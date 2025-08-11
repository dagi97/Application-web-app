"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

const HeaderAuth = ({ text }: { text: string }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-[0px_1px_2px_0px_#0000000D] backdrop-blur-[12px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="text-2xl font-bold">
            <a
              href="https://a2sv.org"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <Image
                src={"/a2sv-logo.svg"}
                alt="A2SV"
                width={96}
                height={96}
                className="h-6 w-auto ml-16"
              />
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium pr-28">
            <Link
              href="/"
              className="py-2 border-b-2 border-transparent text-[#6B7280] hover:text-[#829FAB]"
            >
              Home
            </Link>
            <Link
              href={`/auth/${
                text === "Create Account" ? "register" : "signin"
              }`}
              className="text-[#4F46E5] hover:underline"
            >
              {text}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2 focus:outline-none"
              aria-label="Open menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-4 space-y-2 flex flex-col">
            <Link
              href="/"
              className="block py-2 border-b border-gray-100 text-[#6B7280] hover:text-[#829FAB]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href={`/auth/${
                text === "Create Account" ? "register" : "signin"
              }`}
              className="text-[#4F46E5] hover:underline"
              onClick={() => setMobileMenuOpen(false)}
            >
              {text}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderAuth;
