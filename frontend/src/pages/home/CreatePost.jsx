import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);

	const imgRef = useRef(null);

	const isPending = false;
	const isError = false;

	const data = {
		profileImg: "/avatars/boy1.png",
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		alert("Post created successfully");
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className='flex p-4 items-start gap-3 border-b border-gray-700'>
			{/* Profile Image */}
			<div className='w-12 h-12 rounded-full overflow-hidden'>
				<img src={data.profileImg || "/avatar-placeholder.png"} className='w-full h-full object-cover' />
			</div>

			{/* Post Form */}
			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				{/* Textarea */}
				<textarea
					className='w-full text-lg bg-transparent resize-none border-none focus:outline-none placeholder-gray-500'
					placeholder="What's happening?"
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>

				{/* Image Preview */}
				{img && (
					<div className='relative w-full max-w-xs mx-auto rounded-xl overflow-hidden border border-gray-700'>
						<IoCloseSharp
							className='absolute top-1 right-1 text-white bg-black/60 rounded-full w-6 h-6 p-1 cursor-pointer'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						/>
						<img src={img} className='w-full h-auto object-cover' />
					</div>
				)}

				{/* Action Buttons */}
				<div className='flex justify-between items-center border-t border-gray-700 pt-3'>
					<div className='flex gap-3'>
						<CiImageOn className='text-blue-300 w-6 h-6 cursor-pointer' onClick={() => imgRef.current.click()} />
						<BsEmojiSmileFill className='text-blue-300 w-5 h-5 cursor-pointer' />
					</div>
					<input type='file' hidden ref={imgRef} onChange={handleImgChange} />

					<button
						className={`px-4 py-2 rounded-full font-bold text-white ${
							text.trim() ? "bg-blue-400 hover:bg-blue-600" : "bg-gray-500 cursor-not-allowed"
						}`}
						disabled={!text.trim()}
					>
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>

				{/* Error Message */}
				{isError && <div className='text-red-500 text-sm'>Something went wrong</div>}
			</form>
		</div>
	);
};

export default CreatePost;
