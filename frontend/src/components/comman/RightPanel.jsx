import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import useFollow from '../../hooks/useFollow.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'

const RightPanel = () => {
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const {follow, isPending} = useFollow()

  if(suggestedUsers?.length === 0) return <div className='md:w-64 w-0'></div>

  return (
    <div className="hidden lg:block my-0 mx-2 border-l border-gray-700 min-h-screen">
      {/* Ensures full-height border */}
      <div className="bg-[#16181C] p-4 rounded-lg sticky top-2 mx-2">
        <p className="font-bold">Who to follow</p>
        <div className="flex flex-col gap-4">
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading &&
            suggestedUsers?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4 p-2 rounded-md hover:bg-[#1d1f23] transition-all duration-200"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      {user.profileImg ? (
                        <img
                          src={user.profileImg}
                          className="w-full h-full object-cover rounded-full"
                          alt="Profile"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 animate-pulse flex items-center justify-center rounded-full">
                          <span className="text-transparent">Avatar</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-32">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-slate-500">@{user.username}</span>
                  </div>
                </div>
                <div>
                  <button
                    className="bg-white text-black hover:bg-white hover:opacity-90 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
                    onClick={(e) => {
                      e.preventDefault()
                      follow(user._id)
                    }}
                      
                  >
                    {isPending ? <LoadingSpinner size='sm'/> : 'Follow'} 
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
