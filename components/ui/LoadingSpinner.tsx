'use client';

export default function LoadingSpinner() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="relative">
          {/* Outer ring */}
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          {/* Inner pulse */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 bg-blue-600 rounded-full animate-pulse opacity-20"></div>
          </div>
        </div>
        <p className="text-gray-600 font-medium">Đang tải bản đồ...</p>
        <p className="text-gray-400 text-sm mt-1">Vui lòng chờ trong giây lát</p>
      </div>
    </div>
  );
}
