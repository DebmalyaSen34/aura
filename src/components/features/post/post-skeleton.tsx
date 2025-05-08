export function PostSkeleton() {
  return (
    <div className="bg-[#15151F] rounded-xl p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-800"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-800 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-800 rounded w-1/4"></div>
        </div>
      </div>
      <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-800 rounded w-5/6 mb-2"></div>
      <div className="h-4 bg-gray-800 rounded w-4/6 mb-4"></div>
      <div className="flex justify-between mt-4">
        <div className="h-4 bg-gray-800 rounded w-8"></div>
        <div className="h-4 bg-gray-800 rounded w-8"></div>
        <div className="h-4 bg-gray-800 rounded w-8"></div>
      </div>
    </div>
  );
}
