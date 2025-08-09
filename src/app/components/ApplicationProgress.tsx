"use client";

import Link from "next/link";
import Header from "./ApplicantHeader";
import TimeLineCard from "./TimeLinecard";
import RecentActivity from "./RecentActivity";
import Footer from "./Footer";

export default function ApplicationProgressPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header name="john" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Your Application Progress
          </h1>
          <p className="text-gray-600">
            {"You're on your way! Here's a summary of your application status."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Timeline */}
          <div className="lg:col-span-2">
            <TimeLineCard />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <RecentActivity />
            </div>

            {/* Important Updates */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Important Updates</h3>

              <div className="text-sm text-gray-600">
                <p>
                  There are no new updates at this time. We will notify you by
                  email when your application status changes.
                </p>
              </div>
            </div>

            {/* Interview Preparation Card */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold mb-2">
                Get Ready for the Interview!
              </h3>

              <p className="text-blue-100 text-sm mb-4">
                While you wait, {"it's"} a great time to prepare. Practice your
                problem-solving skills on platforms like LeetCode and
                Codeforces.
              </p>

              <Link
                href="#"
                className="text-blue-100 hover:text-white text-sm font-medium "
              >
                Read our interview prep guide →
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2023 A2SV. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
