import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const Posts = ({ feedType, username, userId }) => {
  const getEndPoint = () => {
    switch (feedType) {
      case 'forYou':
        return '/api/posts/all';
      case 'following':
        return '/api/posts/following';
      case 'posts':
        return `/api/posts/user/${username}`;
      case 'likes':
        return `/api/posts/liked/${userId}`;
      default:
        return '/api/posts/all';
    }
  };

  const POST_ENDPOINT = getEndPoint();

  const { data: posts, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['posts', feedType, username],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Check if response is JSON
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON");
        }

        const data = await res.json();
        console.log(`${feedType} API response:`, data);
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }
        return data;
      } catch (error) {
        console.error(`${feedType} fetch error:`, error.message);
        throw error;
      }
    },
    enabled: feedType !== 'likes' || !!userId,
  });

  useEffect(() => {
    refetch();
  }, [feedType, username, userId, refetch]);

  return (
    <div className="flex flex-col divide-y divide-gray-700">
      {(isLoading || isRefetching) && (
        <div className="flex flex-col">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center text-gray-500 my-6">No posts yet. Switch tab 👻</p>
      )}

      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              feedType={feedType}
              username={username}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
