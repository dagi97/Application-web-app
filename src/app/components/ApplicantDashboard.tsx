"use client";
import Link from "next/link";
import { CheckCircle, Circle, ExternalLink, Menu } from "lucide-react";
import Header from "./ApplicantHeader";
import React from "react";
import { useGetAllActiveCycleQuery } from "../../lib/redux/api/applicationApi";
import CycleCard from "./CycleCard";
import { useGetProfileQuery } from "@/lib/redux/api/ProfileApiSlice";

export default function ApplicantDashboard() {
  const { data, isLoading, error } = useGetAllActiveCycleQuery();
  const { data: profileData } = useGetProfileQuery();
  // Add this inside your component, after getting profileData:
  const profile = profileData?.data || {};

  function calculateCompletion(profile: any) {
    if (!profile) return 0;

    const fields = ["full_name", "email", "role", "profile_picture_url", "id"];

    let completedCount = 0;

    fields.forEach((field) => {
      if (profile[field] && profile[field] !== "") {
        completedCount++;
      }
    });

    return Math.round((completedCount / fields.length) * 100);
  }

  const completionPercentage = calculateCompletion(profile);

  const userName = profileData?.data?.full_name || "User";

  const activeCycles = data?.data?.cycles || [];

  const checklistItems = [
    { id: 1, text: "Create an Account", completed: true },
    { id: 2, text: "Fill Personal Information", completed: false },
    { id: 3, text: "Submit Coding Profiles", completed: false },
    { id: 4, text: "Write Essays", completed: false },
    { id: 5, text: "Upload Resume", completed: false },
  ];

  const helpfulResources = [
    { title: "Tips for a Great Application", href: "#" },
    { title: "A2SV Problem Solving Guide", href: "#" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome, {userName}!
          </h1>
          <p className="text-gray-600">
            Your journey to a global tech career starts now.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Application Card */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <p>Loading cycles...</p>
            ) : error ? (
              <p>Failed to load cycles</p>
            ) : (
              <div className="space-y-6">
                {activeCycles.length > 0 ? (
                  activeCycles.map((cycle: any) => (
                    <CycleCard
                      key={cycle.id}
                      name={cycle.name}
                      startDate={cycle.start_date}
                      endDate={cycle.end_date}
                    />
                  ))
                ) : (
                  <p>No active cycles available.</p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Complete Your Profile
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">
                        {completionPercentage}% COMPLETE
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    Go to profile →
                  </Link>
                </div>
              </div>
            </div>

            {/* Application Checklist */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Application Checklist
                </h3>
                <div className="space-y-3">
                  {checklistItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      {item.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          item.completed ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Helpful Resources */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Helpful Resources
                </h3>
                <div className="space-y-3">
                  {helpfulResources.map((resource, index) => (
                    <Link
                      key={index}
                      href={resource.href}
                      className="flex items-center justify-between text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <span>{resource.title}</span>
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
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
