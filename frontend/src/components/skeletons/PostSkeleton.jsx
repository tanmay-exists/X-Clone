const PostSkeleton = () => {
  return (
    <div className="flex gap-4 p-4 border-b border-gray-700 animate-pulse">
      <div className="w-10 h-10 bg-gray-600 rounded-full shrink-0"></div>

      <div className="flex flex-col gap-3 w-full">
        <div className="bg-gray-600 h-3 w-20 rounded-full"></div>
        <div className="bg-gray-600 h-3 w-32 rounded-full"></div>
        <div className="bg-gray-600 h-40 w-full rounded-md"></div>
      </div>
    </div>
  );
};

export default PostSkeleton;
