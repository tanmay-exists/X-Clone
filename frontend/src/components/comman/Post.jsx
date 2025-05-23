import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner.jsx";
import { formatPostDate } from '../../utils/date/index.js';

const Post = ({ post, feedType, username }) => {
  const [comment, setComment] = useState("");
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [isLikedLocal, setIsLikedLocal] = useState(post.likes.includes(authUser?._id));
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const queryClient = useQueryClient();
  const postOwner = post.user;
  const isMyPost = authUser?._id === post.user._id;
  const formattedDate = formatPostDate(post.createdAt);

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/${post._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts", feedType, username] });
    },
    onError: (error) => {
      toast.error(`Failed to delete post: ${error.message}`);
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${post._id}`, {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
    onMutate: async () => {
      // Optimistic update
      setIsLikedLocal((prev) => !prev);
      setLikeCount((prev) => (isLikedLocal ? prev - 1 : prev + 1));
    },
    onSuccess: (updatedLikes) => {
      // Update the cache with the actual data from the server
      queryClient.setQueryData(['posts', feedType, username], (oldData) => {
        if (!oldData) return [];
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
      setIsLikedLocal(updatedLikes.includes(authUser?._id));
      setLikeCount(updatedLikes.length);
      // Invalidate queries to refetch liked posts
      if (feedType === 'likes') {
        queryClient.invalidateQueries({ queryKey: ['posts', 'likes', username] });
      }
    },
    onError: (error) => {
      // Revert local state on error
      setIsLikedLocal(post.likes.includes(authUser?._id));
      setLikeCount(post.likes.length);
      toast.error(error.message);
    },
  });

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/comment/${post._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ text: comment }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Comment posted successfully');
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['posts', feedType, username] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDeletePost = () => {
    deletePost();
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost();
  };

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  return (
    <>
      <div className="flex gap-2 items-start p-4 border-b border-gray-700">
        <div>
          <Link to={`/profile/${postOwner.username}`} className="block">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              {postOwner.profileImg ? (
                <img
                  src={postOwner.profileImg}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-300 animate-pulse flex items-center justify-center">
                  <span className="text-transparent">Avatar</span>
                </div>
              )}
            </div>
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center">
            <Link to={`/profile/${postOwner.username}`} className="font-bold">
              {postOwner.fullName}
            </Link>
            <span className="text-gray-700 flex gap-1 text-sm">
              <Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>
            {isMyPost && (
              <span className="flex justify-end flex-1">
                {!isDeleting && (
                  <FaTrash className="cursor-pointer hover:text-red-500" onClick={handleDeletePost} />
                )}
                {isDeleting && <LoadingSpinner size="sm" />}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 overflow-hidden">
            <span>{post.text}</span>
            {post.img && (
              <img
                src={post.img}
                className="h-80 object-contain rounded-lg border border-gray-700"
                alt=""
              />
            )}
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex gap-4 items-center w-2/3 justify-between">
              <div
                className="flex gap-1 items-center cursor-pointer group"
                onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
              >
                <FaRegComment className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
                <span className="text-sm text-slate-500 group-hover:text-sky-400">
                  {post.comments.length}
                </span>
              </div>
              <dialog id={`comments_modal${post._id}`} className="border-none outline-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-transparent">
                <div className="bg-black rounded-lg p-4 w-full max-w-md">
                  <h3 className="font-bold text-lg mb-4 text-white">COMMENTS</h3>
                  <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                    {post.comments.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No comments yet 🤔 Be the first one 😉
                      </p>
                    )}
                    {post.comments.map((comment) => (
                      <div key={comment._id} className="flex gap-2 items-start">
                        <div>
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            {comment.user.profileImg ? (
                              <img
                                src={comment.user.profileImg}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-300 flex items-center justify-center rounded-full">
                                <svg
                                  className="w-6 h-6 text-gray-500"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-white">{comment.user.fullName}</span>
                            <span className="text-gray-700 text-sm">@{comment.user.username}</span>
                          </div>
                          <div className="text-sm text-white">{comment.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                    onSubmit={handlePostComment}
                  >
                    <textarea
                      className="w-full p-1 rounded text-md resize-none border border-gray-800 bg-black text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button className="bg-blue-500 text-white rounded-full text-sm px-4 py-1 hover:bg-blue-700 transition">
                      {isCommenting ? (
                        <LoadingSpinner size='md' />
                      ) : (
                        "Post"
                      )}
                    </button>
                  </form>
                </div>
                <form method="dialog" className="bg-black bg-opacity-50">
                  <button className="outline-none text-transparent">close</button>
                </form>
              </dialog>
              <div className="flex gap-1 items-center group cursor-pointer">
                <BiRepost className="w-6 h-6 text-slate-500 group-hover:text-green-500" />
                <span className="text-sm text-slate-500 group-hover:text-green-500">0</span>
              </div>
              <div className="flex gap-1 items-center group cursor-pointer" onClick={handleLikePost}>
                {isLiking && <LoadingSpinner size='sm' />}
                {!isLikedLocal && !isLiking && (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />
                )}
                {isLikedLocal && !isLiking && (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500" />
                )}
                <span
                  className={`text-sm text-slate-500 group-hover:text-pink-500 ${
                    isLikedLocal ? "text-pink-500" : ""
                  }`}
                >
                  {likeCount}
                </span>
              </div>
            </div>
            <div className="flex w-1/3 justify-end gap-2 items-center">
              <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
