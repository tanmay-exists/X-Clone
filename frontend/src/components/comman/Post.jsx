import { FaRegComment, FaRegHeart, FaRegBookmark, FaTrash } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { useState } from "react";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const isLiked = false;
  const isMyPost = true;
  const formattedDate = "1h";

  const handleDeletePost = () => {};
  const handleLikePost = () => {};
  const handlePostComment = (e) => e.preventDefault();

  return (
    <div className="flex gap-4 p-4 border-b border-gray-700 transition duration-200">
      {/* Profile Image */}
      <Link to={`/profile/${post.user.username}`} className="shrink-0">
        <img src={post.user.profileImg || "/avatar-placeholder.png"} className="w-10 h-10 rounded-full" />
      </Link>

      {/* Post Content */}
      <div className="flex flex-col flex-1 gap-2">
        <div className="flex items-center gap-2">
          <Link to={`/profile/${post.user.username}`} className="font-semibold hover:underline">
            {post.user.fullName}
          </Link>
          <span className="text-gray-500 text-sm">
            <Link to={`/profile/${post.user.username}`} className="hover:underline">
              @{post.user.username}
            </Link>{" "}
            · {formattedDate}
          </span>
          {isMyPost && (
            <FaTrash className="ml-auto text-gray-500 hover:text-red-500 cursor-pointer" onClick={handleDeletePost} />
          )}
        </div>

        {/* Post Text */}
        <p className="text-white">{post.text}</p>

        {/* Post Image */}
        {post.img && (
          <img src={post.img} className="mt-2 rounded-xl border border-gray-700 w-full max-h-96 object-cover" />
        )}

        {/* Post Actions */}
        <div className="flex justify-between mt-2 text-gray-500 text-sm">
          <div className="flex items-center gap-2 hover:text-sky-400 cursor-pointer">
            <FaRegComment className="w-4 h-4" />
            <span>{post.comments.length}</span>
          </div>

          <div className="flex items-center gap-2 hover:text-green-500 cursor-pointer">
            <BiRepost className="w-5 h-5" />
            <span>0</span>
          </div>

          <div
            className={`flex items-center gap-2 cursor-pointer ${
              isLiked ? "text-pink-500" : "hover:text-pink-500"
            }`}
            onClick={handleLikePost}
          >
            <FaRegHeart className="w-4 h-4" />
            <span>{post.likes.length}</span>
          </div>

          <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer">
            <FaRegBookmark className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
