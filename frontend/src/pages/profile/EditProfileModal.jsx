import { useState, forwardRef, useImperativeHandle } from "react";

const EditProfileModal = forwardRef((props, ref) => {
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState({
		fullName: "",
		username: "",
		email: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "",
	});

	// Allow parent to control modal
	useImperativeHandle(ref, () => ({
		open: () => setIsOpen(true),
		close: () => setIsOpen(false),
	}));

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		alert("Profile updated successfully");
		setIsOpen(false);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="bg-[#0f0f0f] text-white w-[90vw] max-w-xl rounded-lg border border-gray-700 shadow-md p-6 relative">
				<h3 className="text-lg font-bold mb-4">Update Profile</h3>

				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<div className="flex flex-col sm:flex-row gap-2">
						<input
							type="text"
							placeholder="Full Name"
							className="flex-1 bg-transparent border border-gray-700 rounded p-2"
							value={formData.fullName}
							name="fullName"
							onChange={handleInputChange}
						/>
						<input
							type="text"
							placeholder="Username"
							className="flex-1 bg-transparent border border-gray-700 rounded p-2"
							value={formData.username}
							name="username"
							onChange={handleInputChange}
						/>
					</div>

					<div className="flex flex-col sm:flex-row gap-2">
						<input
							type="email"
							placeholder="Email"
							className="flex-1 bg-transparent border border-gray-700 rounded p-2"
							value={formData.email}
							name="email"
							onChange={handleInputChange}
						/>
						<textarea
							placeholder="Bio"
							className="flex-1 bg-transparent border border-gray-700 rounded p-2"
							value={formData.bio}
							name="bio"
							onChange={handleInputChange}
						/>
					</div>

					<div className="flex flex-col sm:flex-row gap-2">
						<input
							type="password"
							placeholder="Current Password"
							className="flex-1 bg-transparent border border-gray-700 rounded p-2"
							value={formData.currentPassword}
							name="currentPassword"
							onChange={handleInputChange}
						/>
						<input
							type="password"
							placeholder="New Password"
							className="flex-1 bg-transparent border border-gray-700 rounded p-2"
							value={formData.newPassword}
							name="newPassword"
							onChange={handleInputChange}
						/>
					</div>

					<input
						type="text"
						placeholder="Link"
						className="flex-1 bg-transparent border border-gray-700 rounded p-2"
						value={formData.link}
						name="link"
						onChange={handleInputChange}
					/>

					<div className="flex justify-end gap-2">
						<button
							type="submit"
							className="px-4 py-2 bg-blue-600 rounded-full text-white text-sm hover:bg-blue-700 transition"
						>
							Update
						</button>
						<button
							type="button"
							className="px-4 py-2 bg-gray-700 rounded-full text-white text-sm hover:bg-gray-800 transition"
							onClick={() => setIsOpen(false)}
						>
							Close
						</button>
					</div>
				</form>
			</div>
		</div>
	);
});

// ✅ Set display name for better debugging and ESLint compatibility
EditProfileModal.displayName = "EditProfileModal";

export default EditProfileModal;
