import Image from "next/image";
import React from "react";
import HeaderManagerDetail from "./HeaderManagerDetail";
import { Card, CardHeader, CardTitle, CardContent } from "./Card2";
import type { ReviewDetail } from "../../lib/redux/types/applicantData";
import ManagerAction from "./ManagerAction";

interface ManagerDetailPageProps {
  reviewDetail: ReviewDetail | null;
  isLoading?: boolean;
  isError?: boolean;
  leftHovered?: boolean;
  onLeftHoverChange?: (hovered: boolean) => void;
}

const ManagerDetailPage: React.FC<ManagerDetailPageProps> = ({
  reviewDetail,
  isLoading = false,
  isError = false,
  leftHovered = false,
  onLeftHoverChange,
}) => {
  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <HeaderManagerDetail
        leftHovered={leftHovered}
        onLeftHoverChange={onLeftHoverChange}
      />

      <main className="py-8">
        <div className="mx-auto max-w-7xl py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold mt-2 mb-6 sm:mb-8">
            Manage: {reviewDetail ? reviewDetail.name : "Undefined"}
          </h1>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
            <Card className="lg:col-span-2 w-full">
              <CardHeader>
                <CardTitle>Applicant Profile</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6 p-4 sm:p-6">
                {isLoading && (
                  <div className="text-gray-500">Loading applicant data...</div>
                )}
                {isError && (
                  <div className="text-red-500">
                    Failed to load review details.
                  </div>
                )}

                {reviewDetail && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-[#6B7280]">
                          School
                        </h3>
                        <p className="mt-1 break-words">
                          {reviewDetail.school}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-[#6B7280]">
                          Degree Program
                        </h3>
                        <p className="mt-1 break-words">
                          {reviewDetail.degree}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Coding Profiles
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2 items-center">
                        <a
                          href={`https://leetcode.com/${reviewDetail.leetcode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-semibold text-[#4F46E5] hover:text-[#182E6F] px-3 py-1 rounded break-words"
                        >
                          LeetCode
                        </a>
                        <a
                          href={`https://codeforces.com/profile/${reviewDetail.codeforces}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-semibold text-[#4F46E5] hover:text-[#182E6F] px-3 py-1 rounded break-words"
                        >
                          Codeforces
                        </a>
                      </div>
                    </div>

                    {reviewDetail.essays.map((essay, index) => (
                      <div key={index} className="pt-2">
                        <h3 className="text-sm font-medium text-gray-500">
                          {essay.question}
                        </h3>
                        <p className="mt-1 text-base text-gray-900 break-words">
                          {essay.answer}
                        </p>
                      </div>
                    ))}

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Resume
                      </h3>
                      <a
                        href={reviewDetail.resumeURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-base font-medium text-indigo-600 hover:text-indigo-800 break-words"
                      >
                        View Resume.pdf
                      </a>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="lg:col-span-1 flex items-start lg:items-stretch">
              <Card className="flex flex-col h-auto lg:h-full w-full">
                <ManagerAction applicationId={reviewDetail?.id ?? ""} />
              </Card>
            </div>
          </div>
        </div>
      </main>

      <div className="bg-[#1F2937] w-full max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-white">
          &copy; 2025 A2SV. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ManagerDetailPage;
