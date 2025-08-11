'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useGetProfileQuery } from '@/lib/redux/api/ProfileApiSlice';
import { Menu, X } from 'lucide-react';

const AdminNav = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const IsActive = (path: string) => pathname === path;

  const { data: profileData } = useGetProfileQuery();
  const userName = profileData?.data?.full_name || 'Admin';

  return (
    <nav className="shadow-md bg-white">
      <div className="flex justify-between items-center lg:grid lg:grid-cols-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="justify-self-start my-2">
          <img src="/a2sv-logo.svg" alt="A2SV Logo" className="h-12" />
        </div>

        <ul className="hidden lg:flex gap-10 justify-self-center my-2">
          <li>
            <Link
              href="/admin"
              className={IsActive('/admin') ? 'border-b-2 border-[#6366F1] text-[#111827]' : 'text-[#6B7280]'}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/admin/users"
              className={IsActive('/admin/users') ? 'border-b-2 border-[#6366F1] text-[#111827]' : 'text-[#6B7280]'}
            >
              Users
            </Link>
          </li>
          <li>
            <Link
              href="/admin/cycle"
              className={IsActive('/admin/cycle') ? 'border-b-2 border-[#6366F1] text-[#111827]' : 'text-[#6B7280]'}
            >
              Cycles
            </Link>
          </li>
          <li>
            <Link
              href="/admin/analytics"
              className={IsActive('/admin/analytics') ? 'border-b-2 border-[#6366F1] text-[#111827]' : 'text-[#6B7280]'}
            >
              Analytics
            </Link>
          </li>
        </ul>

        <ul className="hidden lg:flex items-center gap-4 justify-self-end my-2">
          <li>
            <Link href="/profile" className="text-[#4F46E5]">
              Your Profile
            </Link>
          </li>
          <li>{userName}</li>
          <li>
            <Link
              href="#"
              className="text-[#6B7280]"
              onClick={() =>
                signOut({
                  callbackUrl: '/',
                })
              }
            >
              Logout
            </Link>
          </li>
        </ul>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden px-4 pb-4">
          <ul className="flex flex-col gap-4 mt-4">
            <li>
              <Link
                href="/admin"
                className={IsActive('/admin') ? 'border-b-2 border-[#6366F1] text-[#111827]' : 'text-[#6B7280]'}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/users"
                className={IsActive('/admin/users') ? 'border-b-2 border-[#6366F1] text-[#111827]' : 'text-[#6B7280]'}
                onClick={() => setMenuOpen(false)}
              >
                Users
              </Link>
            </li>
            <li>
              <Link
                href="/admin/cycle"
                className={IsActive('/admin/cycle') ? 'border-b-2 border-[#6366F1] text-[#111827]' : 'text-[#6B7280]'}
                onClick={() => setMenuOpen(false)}
              >
                Cycles
              </Link >
            </li>
            <li>
              <Link
                href="/admin/analytics"
                className={IsActive('/admin/analytics') ? 'border-b-2 border-[#6366F1] text-[#111827]' : 'text-[#6B7280]'}
                onClick={() => setMenuOpen(false)}
              >
                Analytics
              </Link>
            </li>
            <li>
              <Link href="/profile" className="text-[#4F46E5]" onClick={() => setMenuOpen(false)}>
                Your Profile
              </Link>
            </li>
            <li>{userName}</li>
            <li>
              <button
                className="text-[#6B7280] text-left"
                onClick={() =>
                  signOut({
                    callbackUrl: '/',
                  })
                }
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default AdminNav;