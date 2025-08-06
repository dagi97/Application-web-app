"use client";

import Image from "next/image";
import { useGetAssignedReviewsQuery } from "../lib/redux/api/reviewsApiSlice";
import { useState, useEffect } from "react";
import {
  fetchReviewerProfile,
  loginAndStoreToken,
} from "../lib/redux/utils/login";
import ApplicationCard from "./ApplicationCard";
import Header from "./Header";

export default function ReviewerDashboard() {
  const [leftHovered, setLeftHovered] = useState(false);
  const [rightHovered, setRightHovered] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "underReview" | "complete"
  >("all");
  const [sortBy, setSortBy] = useState("date");
  const [reviewerName, setReviewerName] = useState("Reviewer");
  const [reviewerProfile, setReviewerProfile] = useState<any>(null);

  // This is a temporary solution for testing purposes (login), change when mixed with others
  useEffect(() => {
    loginAndStoreToken("abcd@gmail.com", "bezzthegoat").catch(() => {});
  }, []);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (token) {
      fetchReviewerProfile(token).then((profile) => {
        if (profile) {
          setReviewerProfile(profile);
          setReviewerName(profile.full_name || "Reviewer");
        }
      });
    }
  }, []);

  const { data, isLoading, isError } = useGetAssignedReviewsQuery({
    page: 1,
    limit: 10,
  });
  const [applications, setApplications] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (data?.data?.reviews) {
      setApplications(data.data.reviews);
    }
  }, [data]);

  // Temp solution until i figure out how to change the status on the backend, this is just for local state management
  const handleStatusChange = (applicationId: string, newStatus: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.application_id === applicationId
          ? { ...app, status: newStatus }
          : app
      )
    );
  };

  let filteredApplications =
    selectedFilter === "all"
      ? applications
      : applications.filter((app) => {
          if (selectedFilter === "underReview") {
            return app.status === "under_review";
          } else if (selectedFilter === "complete") {
            return app.status === "accepted";
          }
          return true;
        });

  filteredApplications = [...filteredApplications].sort((a, b) => {
    if (sortBy === "date") {
      return (
        new Date(b.submission_date).getTime() -
        new Date(a.submission_date).getTime()
      );
    } else {
      return a.applicant_name.localeCompare(b.applicant_name);
    }
  });

  const cardsPerPage = 6;
  const totalCount = filteredApplications.length;
  const totalPages = Math.ceil(totalCount / cardsPerPage);
  const startIdx = (currentPage - 1) * cardsPerPage;
  const endIdx = Math.min(startIdx + cardsPerPage, totalCount);
  const paginatedApplications = filteredApplications.slice(startIdx, endIdx);

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6] font-sans">
      <Header name={reviewerName} />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-12 mb-24">
          {/* Debug section - remove later
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-900">
            <strong>Debug Info:</strong>
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
              {JSON.stringify(
                { data, isLoading, isError, reviewerProfile },
                null,
                2
              )}
            </pre>
          </div> */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold">Assigned Applications</h1>
            {isLoading ? (
              <p className="mt-2 text-gray-600">Loading applications...</p>
            ) : isError ? (
              <p className="mt-2 text-red-600">Failed to load applications.</p>
            ) : (
              <p className="mt-2 text-gray-600">{`You have ${totalCount} applications waiting for your review.`}</p>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <button
                className={`px-4 py-2 text-sm font-semibold rounded-md cursor-pointer transition-colors duration-150 ${
                  selectedFilter === "all"
                    ? "text-white bg-indigo-600 hover:bg-indigo-800"
                    : "bg-[#E5E7EB] text-[#4B5563] hover:bg-[#D1D5DB]"
                }`}
                onClick={() => setSelectedFilter("all")}
                type="button"
              >
                All
              </button>
              <button
                className={`px-4 py-2 text-sm font-semibold rounded-md cursor-pointer transition-colors duration-150 ${
                  selectedFilter === "underReview"
                    ? "text-white bg-indigo-600 hover:bg-indigo-800"
                    : "bg-[#E5E7EB] text-[#4B5563] hover:bg-[#D1D5DB]"
                }`}
                onClick={() => setSelectedFilter("underReview")}
                type="button"
              >
                Under Review
              </button>
              <button
                className={`px-4 py-2 text-sm font-semibold rounded-md cursor-pointer transition-colors duration-150 ${
                  selectedFilter === "complete"
                    ? "text-white bg-indigo-600 hover:bg-indigo-800"
                    : "bg-[#E5E7EB] text-[#4B5563] hover:bg-[#D1D5DB]"
                }`}
                onClick={() => setSelectedFilter("complete")}
                type="button"
              >
                Complete
              </button>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <label htmlFor="sort-by" className="text-gray-600 font-medium">
                Sort by
              </label>
              <select
                id="sort-by"
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                value={sortBy}
                onChange={(val) =>
                  setSortBy(val.target.value === "name" ? "name" : "date")
                }
              >
                <option value="date">Submission Date</option>
                <option value="name">Applicant Name</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {isLoading ? (
              <div className="col-span-3 text-center text-gray-500">
                Loading...
              </div>
            ) : isError ? (
              <div className="col-span-3 text-center text-red-500">
                Error loading applications.
              </div>
            ) : paginatedApplications.length === 0 ? (
              <div className="col-span-3 text-center text-gray-500">
                No applications found.
              </div>
            ) : (
              paginatedApplications.map((application) => (
                <ApplicationCard
                  key={application.application_id}
                  application={application}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
          <div className="mt-10 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">
                {endIdx > 0 ? startIdx + 1 : 0}
              </span>{" "}
              to <span className="font-semibold">{endIdx}</span> of{" "}
              <span className="font-semibold">{totalCount}</span> results
            </p>

            <div className="flex items-center gap-1">
              <button
                className="flex items-center justify-center w-9 h-9 rounded-md bg-white hover:bg-gray-100"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <Image
                  src={leftHovered ? "/left_hover.png" : "/left.png"}
                  onMouseEnter={() => setLeftHovered(true)}
                  onMouseLeave={() => setLeftHovered(false)}
                  alt="left"
                  width={48}
                  height={48}
                />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`flex items-center justify-center w-9 h-9 rounded-md border ${
                    currentPage === i + 1
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-gray-300 bg-white hover:bg-gray-50"
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="flex items-center justify-center w-9 h-9 rounded-md bg-white hover:bg-gray-100"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                <Image
                  src={rightHovered ? "/right_hover.png" : "/right.png"}
                  onMouseEnter={() => setRightHovered(true)}
                  onMouseLeave={() => setRightHovered(false)}
                  alt="left"
                  width={48}
                  height={48}
                />
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#1F2937] mt-12 sticky bottom-0 w-full">
        <div className="max-w-7xl mx-auto pb-10 pt-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <hr className="text-gray-600 w-full mb-3" />
          <p className="text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} A2SV. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
