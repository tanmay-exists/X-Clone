import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from '@tanstack/react-query'
import {useEffect} from 'react'

const Posts = ({feedType}) => {
  
  const getEndPoint = () => {
    switch (feedType){
      case 'forYou':
        return 'api/posts/all'
      case 'following':
        return 'api/posts/following'
      default:
        return 'api/posts/all'
    }
  }

  const POST_ENDPOINT = getEndPoint()

  const {data: posts, isLoading, refetch, isRefetching} = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT) 
        const data = await res.json()
        if(!res.ok){
          throw new Error(data.error || 'Something went wrong')
        }
        return data

      } catch (error) {
        throw new Error(error) 
      }
    }
  })

  useEffect(() => {
    refetch()
  }, [feedType, refetch])

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
          {posts.map((post) => <Post key={post._id} post={post} />)}
        </div>
      )} 
    </div>
  );
};

export default Posts;
