import { useRef, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Posts from "../../components/comman/Posts.jsx";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton.jsx";
import EditProfileModal from "./EditProfileModal.jsx";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { formatMemberSinceDate } from '../../utils/date/index.js';

const ProfilePage = () => {
  const { username } = useParams();
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [isEdited, setIsEdited] = useState(false);
  const [feedType, setFeedType] = useState("posts");
  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);
  const modalRef = useRef(null);

  // Fetch the authenticated user
  const { data: authUser, error: authError } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON");
        }
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch authenticated user");
        }
        return data;
      } catch (error) {
        console.error("Auth fetch error:", error.message);
        throw error;
      }
    },
    retry: false, // Disable retries for faster debugging
  });

  // Determine if this is the user's own profile
  const isMyProfile = authUser?.username === username;

  // Fetch the user profile
  const { data: user, isLoading, refetch, isRefetching, error: profileError } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON");
        }
        const data = await res.json();
        console.log("Profile API response:", data);
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        console.error("Profile fetch error:", error.message);
        throw error;
      }
    },
    enabled: !!authUser, // Only fetch profile after authUser is loaded
  });

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (state === "coverImg") setCoverImg(reader.result);
        if (state === "profileImg") setProfileImg(reader.result);
        setIsEdited(true);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  // Check for user ID mismatch
  useEffect(() => {
    if (authUser && user && authUser._id !== user._id) {
      console.warn("User ID mismatch:", authUser._id, user._id);
    }
  }, [authUser, user]);

  if (authError) {
    return <p className="text-center text-lg mt-4">Failed to load user: {authError.message}</p>;
  }

  return (
    <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
      {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
      {!isLoading && !isRefetching && !user && (
        <p className="text-center text-lg mt-4">
          {profileError ? profileError.message : "User not found"}
        </p>
      )}

      {!isLoading && !isRefetching && user && (
        <>
          <div className="flex gap-10 px-4 py-2 items-center">
            <Link to="/">
              <FaArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex flex-col">
              <p className="font-bold text-lg">{user?.fullName}</p>
              <span className="text-sm text-slate-500">{user?.posts?.length || 0} posts</span>
            </div>
          </div>

          {/* COVER IMAGE */}
          <div className="relative group">
            {coverImg || user?.coverImg ? (
              <img
                src={coverImg || user?.coverImg}
                className="h-52 w-full object-cover"
                alt="cover image"
              />
            ) : (
              <div className="h-52 w-full bg-neutral-900" />
            )}

            {isMyProfile && (
              <div
                className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover:opacity-100 transition"
                onClick={() => coverImgRef.current.click()}
              >
                <MdEdit className="w-5 h-5 text-white" />
              </div>
            )}

            <input
              type="file"
              hidden
              ref={coverImgRef}
              onChange={(e) => handleImgChange(e, "coverImg")}
            />
            <input
              type="file"
              hidden
              ref={profileImgRef}
              onChange={(e) => handleImgChange(e, "profileImg")}
            />

            {/* PROFILE IMAGE */}
            <div className="absolute -bottom-16 left-4">
              <div className="w-32 h-32 rounded-full overflow-hidden relative group">
                {profileImg || user?.profileImg ? (
                  <img
                    src={profileImg || user?.profileImg}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 animate-pulse flex items-center justify-center">
                    <span className="text-transparent">Avatar</span>
                  </div>
                )}
                {isMyProfile && (
                  <div
                    className="absolute top-2 right-2 p-1 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition"
                    onClick={() => profileImgRef.current.click()}
                  >
                    <MdEdit className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end px-4 mt-5">
            {isMyProfile && (
              <button
                className="px-4 py-1 text-sm border border-gray-500 text-white rounded-full hover:bg-gray-800 transition"
                onClick={() => modalRef.current.open()}
              >
                Edit Profile
              </button>
            )}
            {!isMyProfile && (
              <button
                className="px-4 py-1 text-sm border border-gray-500 text-white rounded-full hover:bg-gray-800 transition"
                onClick={() => alert("Followed successfully")}
              >
                Follow
              </button>
            )}
            {isEdited && (
              <button
                className="px-4 py-1 text-sm bg-blue-600 text-white rounded-full ml-2 hover:bg-blue-700 transition"
                onClick={() => {
                  alert("Profile updated successfully");
                  setIsEdited(false);
                }}
              >
                Update
              </button>
            )}
          </div>

          {/* INFO */}
          <div className="flex flex-col gap-4 mt-14 px-4">
            <div className="flex flex-col">
              <span className="font-bold text-lg">{user?.fullName}</span>
              <span className="text-sm text-slate-500">@{user?.username}</span>
              <span className="text-sm my-1">{user?.bio}</span>
            </div>

            <div className="flex gap-2 flex-wrap">
              {user?.link && (
                <div className="flex gap-1 items-center">
                  <FaLink className="w-3 h-3 text-slate-500" />
                  <a
                    href={user.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {user.link.replace("https://", "")}
                  </a>
                </div>
              )}
              <div className="flex gap-2 items-center">
                <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-500">{formatMemberSinceDate(user?.createdAt)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex gap-1 items-center">
                <span className="font-bold text-xs">{user?.following.length}</span>
                <span className="text-slate-500 text-xs">Following</span>
              </div>
              <div className="flex gap-1 items-center">
                <span className="font-bold text-xs">{user?.followers.length}</span>
                <span className="text-slate-500 text-xs">Followers</span>
              </div>
            </div>
          </div>

          {/* TABS: Posts & Likes */}
          <div className="flex justify-around mt-6 border-b border-gray-800">
            <button
              className={`px-4 py-2 font-semibold ${
                feedType === "posts" ? "border-b-4 border-blue-500 text-white" : "text-slate-500"
              }`}
              onClick={() => setFeedType("posts")}
            >
              Posts
            </button>
            <button
              className={`px-4 py-2 font-semibold ${
                feedType === "likes" ? "border-b-4 border-blue-500 text-white" : "text-slate-500"
              }`}
              onClick={() => setFeedType("likes")}
            >
              Likes
            </button>
          </div>

          {/* MODAL */}
          <EditProfileModal ref={modalRef} />

          {/* POSTS DISPLAY */}
          {user?._id ? (
            <Posts feedType={feedType} username={username} userId={user._id} />
          ) : (
            <p className="text-center text-gray-500 my-6">Loading posts...</p>
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePage;
