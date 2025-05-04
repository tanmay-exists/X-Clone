import { useState, forwardRef, useImperativeHandle } from "react";
import { toast } from "react-hot-toast";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const EditProfileModal = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch the authenticated user to pre-populate the form
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
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
    },
  });

  // Initialize formData with the current user data
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    username: authUser?.username || "",
    email: authUser?.email || "",
    bio: authUser?.bio || "",
    link: authUser?.link || "",
    newPassword: "",
    currentPassword: "",
  });

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/users/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData), // Send formData directly, not nested
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success('Profile updated successfully');
      setIsOpen(false); // Close the modal on success
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['authUser'] }),
        queryClient.invalidateQueries({ queryKey: ['userProfile'] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    }
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
    updateProfile();
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
              {isUpdatingProfile ? 'Updating...' : 'Update'}
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

EditProfileModal.displayName = "EditProfileModal";

export default EditProfileModal;
