import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";

const Posts = () => {
  const isLoading = false;

  return (
    <div className="flex flex-col divide-y divide-gray-700">
      {isLoading && (
        <div className="flex flex-col">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {!isLoading && POSTS?.length === 0 && (
        <p className="text-center text-gray-500 my-6">No posts yet. Switch tab 👻</p>
      )}

      {!isLoading &&
        POSTS?.map((post) => <Post key={post._id} post={post} />)}
    </div>
  );
};

export default Posts;
