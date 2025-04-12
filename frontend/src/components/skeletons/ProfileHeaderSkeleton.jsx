const SkeletonBox = ({ className }) => (
	<div className={`bg-gray-700 animate-pulse ${className}`} />
);

const ProfileHeaderSkeleton = () => {
	return (
		<div className="flex flex-col gap-2 w-full my-2 p-4">
			<div className="flex gap-2 items-center">
				<div className="flex flex-1 gap-1">
					<div className="flex flex-col gap-1 w-full">
						<SkeletonBox className="h-4 w-12 rounded-full" />
						<SkeletonBox className="h-4 w-16 rounded-full" />
						<div className="relative h-40 w-full bg-gray-700 animate-pulse">
							<SkeletonBox className="h-20 w-20 rounded-full border-4 border-gray-900 absolute -bottom-10 left-3" />
						</div>
						<SkeletonBox className="h-6 mt-4 w-24 ml-auto rounded-full" />
						<SkeletonBox className="h-4 w-14 mt-4 rounded-full" />
						<SkeletonBox className="h-4 w-20 rounded-full" />
						<SkeletonBox className="h-4 w-2/3 rounded-full" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileHeaderSkeleton;
