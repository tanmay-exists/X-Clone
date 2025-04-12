import { useState } from "react";

import Posts from "../../components/comman/Posts.jsx";
import CreatePost from "./CreatePost.jsx";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	return (
		<>
			<div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'>
				{/* Header */}
				<div className='flex w-full border-b border-gray-700'>
					<div
						className={`flex justify-center flex-1 p-3 transition duration-300 cursor-pointer relative ${
							feedType === "forYou" ? "text-white font-bold" : "text-gray-500"
						}`}
						onClick={() => setFeedType("forYou")}
					>
						For you
						{feedType === "forYou" && (
							<div className='absolute bottom-0 left-0 w-full h-1 bg-blue-500'></div>
						)}
					</div>
					<div
						className={`flex justify-center flex-1 p-3 transition duration-300 cursor-pointer relative ${
							feedType === "following" ? "text-white font-bold" : "text-gray-500"
						}`}
						onClick={() => setFeedType("following")}
					>
						Following
						{feedType === "following" && (
							<div className='absolute bottom-0 left-0 w-full h-1 bg-blue-400'></div>
						)}
					</div>
				</div>

				{/* CREATE POST INPUT */}
				<CreatePost />

				{/* POSTS */}
				<Posts feedType={feedType} />
			</div>
		</>
	);
};

export default HomePage;
