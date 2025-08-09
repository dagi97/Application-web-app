"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import Image from "next/image";
import { signOut } from "next-auth/react";

interface HeaderProps {
  name: string;
  dashboardLink: string;
}

const Header = (prop: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="text-2xl font-bold">
            <Link
              href="https://a2sv.org"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <Image
                src={"/a2sv_logo.png"}
                alt="A2SV"
                width={96}
                height={96}
                className="h-6 w-auto ml-16"
              />
            </Link>
          </div>
          <Link
            href={prop.dashboardLink}
            className="py-2 border-b-2 border-blue-500 text-sm hover:text-[#6B7280] hidden md:inline-block"
          >
            Dashboard
          </Link>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/profile"
              className="py-2 border-b-2 border-transparent text-[#793bf0] hover:text-[#51158C]"
            >
              Your Profile
            </Link>
            <Link
              href="/profile"
              className="py-2 border-b-2 border-transparent hover:text-[#829FAB]"
            >
              {prop.name}
            </Link>
            <Link
              href="#"
              className="py-2 border-b-2 border-transparent text-[#6B7280] hover:underline hover:text-[#829FAB]"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Logout
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-2 space-y-2">
            <Link
              href={prop.dashboardLink}
              className="block text-gray-600 hover:text-gray-900 py-2"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="block text-gray-600 hover:text-gray-900 py-2"
            >
              Your Profile
            </Link>
            <span className="block text-gray-600 py-2">John Doe</span>
            <button
              className="block text-gray-600 hover:text-gray-900 py-2"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
