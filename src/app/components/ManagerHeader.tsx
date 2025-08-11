import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import { useGetProfileQuery } from "@/lib/redux/api/ProfileApiSlice";

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { data: profileData } = useGetProfileQuery();
    const userName = profileData?.data?.full_name || "User";

    return (
        <header className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="text-2xl font-bold">
                        <a
                            href="https://a2sv.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cursor-pointer"
                        >
                            <img src={"/a2sv-logo.svg"} alt="A2SV" />
                        </a>
                    </div>
                    <a
                        href="/manager"
                        className="py-2 border-b-2 border-blue-500 text-sm hover:text-[#6B7280] hidden md:inline-block"
                    >
                        Dashboard
                    </a>
                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        <a
                            href="/profile"
                            className="py-2 border-b-2 border-transparent text-[#793bf0] hover:text-[#51158C]"
                        >
                            Your Profile
                        </a>
                        <a
                            href="#"
                            className="py-2 border-b-2 border-transparent hover:text-[#829FAB]"
                        >
                            {userName}
                        </a>
                        <a
                            href="#"
                            className="py-2 border-b-2 border-transparent text-[#6B7280] hover:underline hover:text-[#829FAB]"
                            onClick={() => signOut({ callbackUrl: "/" })}
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
                            href="/manager"
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
                        <span className="block text-gray-600 py-2"> {userName}</span>
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
