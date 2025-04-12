const RightPanelSkeleton = () => {
	return (
		<div className='flex items-center justify-between gap-4 p-2 rounded-md bg-[#1d1f23] animate-pulse'>
			{/* Left Section (Profile Image & Name) */}
			<div className='flex gap-2 items-center'>
				<div className='w-10 h-10 bg-gray-700 rounded-full'></div> {/* Profile Image Skeleton */}
				<div className='flex flex-col'>
					<div className='h-3 w-32 bg-gray-700 rounded-md'></div> {/* Name Skeleton */}
					<div className='h-2 w-24 bg-gray-700 rounded-md mt-1'></div> {/* Username Skeleton */}
				</div>
			</div>

			{/* Right Section (Follow Button) */}
			<div className='w-20 h-8 bg-gray-700 rounded-full'></div> {/* Follow Button Skeleton */}
		</div>
	);
};

export default RightPanelSkeleton;
