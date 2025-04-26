const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-4",
  xl: "h-12 w-12 border-4",
};

const LoadingSpinner = ({ size = "md" }) => {
  const sizeClass = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`inline-block animate-spin rounded-full border-t-transparent border-solid ${sizeClass} border-gray-700`}
    />
  );
};

export default LoadingSpinner;
