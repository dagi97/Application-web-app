import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import Image from "next/image";

interface HeaderManagerDetailProps {
  managerName?: string | null;
  leftHovered?: boolean;
  onLeftHoverChange?: (hovered: boolean) => void;
}

const HeaderManagerDetail = ({
  managerName,
  leftHovered = false,
  onLeftHoverChange,
}: HeaderManagerDetailProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/manager/dashboard"
            className="flex items-center bg-white"
            onMouseEnter={() => onLeftHoverChange && onLeftHoverChange(true)}
            onMouseLeave={() => onLeftHoverChange && onLeftHoverChange(false)}
          >
            <Image
              src={
                leftHovered ? "/images/variant=1.png" : "/images/variant=2.png"
              }
              alt="left"
              width={28}
              height={28}
              className="h-5 w-5"
            />
            <span className="ml-2 text-sm text-[#6B7280] hover:text-gray-700 hidden sm:inline">
              Back to Dashboard
            </span>
          </Link>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="manager/profile"
              className="py-2 border-b-2 border-transparent hover:text-[#829FAB]"
            >
              {managerName || "Manager"}
            </Link>
            <a
              href="#"
              className="py-2 border-b-2 border-transparent text-[#6B7280] hover:underline hover:text-[#829FAB]"
            >
              Logout
            </a>
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
              href="/manager/dashboard"
              className="block text-gray-600 hover:text-gray-900 py-2"
            >
              Dashboard
            </Link>
            <Link href={"manager/profile"} className="block text-gray-600 py-2">
              {managerName || "Manager"}
            </Link>
            <button className="block text-gray-600 hover:text-gray-900 py-2">
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderManagerDetail;
