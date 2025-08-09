"use client;";
import React from "react";
import Button from "./Button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 404 Section */}
      <main className="flex-grow flex items-center justify-center text-center px-4">
        <div className="max-w-md">
          <h1 className="text-[100px] font-extrabold text-[#4F46E5]">404</h1>
          <h2 className="text-3xl font-bold text-gray-800">Page Not Found</h2>
          <p className="text-sm text-gray-600 mt-3">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <Button
            size="small"
            className="mt-6"
            onClick={() => (window.location.href = "/")}
          >
            Go Home
          </Button>
        </div>
      </main>
    </div>
  );
}
