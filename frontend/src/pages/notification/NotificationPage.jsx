import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/comman/LoadingSpinner.jsx";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useState } from "react";

const NotificationPage = () => {
	const isLoading = false;
	const [showDropdown, setShowDropdown] = useState(false);

	const notifications = [
		{
			_id: "1",
			from: {
				_id: "1",
				username: "johndoe",
				profileImg: "/avatars/boy2.png",
			},
			type: "follow",
		},
		{
			_id: "2",
			from: {
				_id: "2",
				username: "janedoe",
				profileImg: "/avatars/girl1.png",
			},
			type: "like",
		},
	];

	const deleteNotifications = () => {
		alert("All notifications deleted");
		setShowDropdown(false);
	};

	return (
		<div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen text-white">
			{/* Header */}
			<div className="flex justify-between items-center p-4 border-b border-gray-700 relative">
				<p className="font-bold text-lg">Notifications</p>

				<div className="relative">
					<button
						onClick={() => setShowDropdown(!showDropdown)}
						className="p-1 rounded hover:bg-gray-700 transition"
					>
						<IoSettingsOutline className="w-5 h-5 text-white" />
					</button>

					{showDropdown && (
						<ul className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-10">
							<li>
								<button
									onClick={deleteNotifications}
									className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
								>
									Delete all notifications
								</button>
							</li>
						</ul>
					)}
				</div>
			</div>

			{/* Loading Spinner */}
			{isLoading && (
				<div className="flex justify-center items-center h-full">
					<LoadingSpinner size="lg" />
				</div>
			)}

			{/* No Notifications */}
			{!isLoading && notifications.length === 0 && (
				<div className="text-center p-4 font-bold text-gray-400">No notifications 🤔</div>
			)}

			{/* Notification List */}
			{!isLoading &&
				notifications.map((notification) => (
					<div key={notification._id} className="border-b border-gray-700">
						<div className="flex gap-3 p-4 items-center">
							{/* Icon */}
							{notification.type === "follow" && <FaUser className="w-6 h-6 text-blue-500" />}
							{notification.type === "like" && <FaHeart className="w-6 h-6 text-red-500" />}

							{/* Profile & Message */}
							<Link
								to={`/profile/${notification.from.username}`}
								className="flex gap-2 items-center hover:underline"
							>
								<img
									src={notification.from.profileImg || "/avatar-placeholder.png"}
									alt="Profile"
									className="w-8 h-8 rounded-full object-cover"
								/>
								<div className="flex gap-1 text-sm flex-wrap">
									<span className="font-bold text-white">@{notification.from.username}</span>
									<span className="text-gray-400">
										{notification.type === "follow" ? "followed you" : "liked your post"}
									</span>
								</div>
							</Link>
						</div>
					</div>
				))}
		</div>
	);
};

export default NotificationPage;
