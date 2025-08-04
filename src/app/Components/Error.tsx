import React from "react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 404 Section */}
      <main className="flex-grow flex items-center justify-center text-center px-4">
        <div className="max-w-md">
          <h1 className="text-[72px] font-bold text-[#4F46E5]">404</h1>
          <h2 className="text-xl font-semibold mt-2">Page Not Found</h2>
          <p className="text-sm text-gray-600 mt-1">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <button className="mt-4 px-4 py-2 bg-[#4F46E5] text-white rounded hover:bg-indigo-600 transition text-sm">
            Go Home
          </button>
        </div>
      </main>
    </div>
  );
}
