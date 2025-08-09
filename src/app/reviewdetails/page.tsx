import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HeaderReviewDetail from "../components/HeaderReviewDetail";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Textarea,
  Label,
} from "../components/Card2";
import type { ReviewDetail } from "../../lib/redux/types/detailData";
import { submitReview } from "../../lib/redux/utils/detailLogin";
import { loginAndStoreToken } from "../../lib/redux/utils/login";
import Toaster from "../components/Toaster";

interface ReviewerDetailPageProps {
  reviewDetail: ReviewDetail | null;
  reviewerName?: string | null;
  isLoading?: boolean;
  isError?: boolean;
  leftHovered?: boolean;
  onLeftHoverChange?: (hovered: boolean) => void;
  readonly?: boolean;
  reviewStatus?: string | null;
}

const ReviewerDetailPage: React.FC<ReviewerDetailPageProps> = ({
  reviewDetail,
  reviewerName,
  isLoading = false,
  isError = false,
  leftHovered = false,
  onLeftHoverChange,
  readonly = false,
  reviewStatus = null,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      activityCheckNotes: "",
      resumeScore: "",
      essayWhyA2svScore: "",
      essayAboutYouScore: "",
      technicalInterviewScore: "",
      behavioralInterviewScore: "",
    },
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Fix this with auth when connected
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (!token) {
        loginAndStoreToken("abcd@gmail.com", "bezzthegoat!AA").catch(() => {});
      }
    }
  }, []);

  useEffect(() => {
    const details = reviewDetail?.reviewDetails;
    reset({
      activityCheckNotes: details?.activityCheckNotes || "",
      resumeScore:
        details?.resumeScore !== undefined ? String(details.resumeScore) : "",
      essayWhyA2svScore:
        details?.essayWhyA2svScore !== undefined
          ? String(details.essayWhyA2svScore)
          : "",
      essayAboutYouScore:
        details?.essayAboutYouScore !== undefined
          ? String(details.essayAboutYouScore)
          : "",
      technicalInterviewScore:
        details?.technicalInterviewScore !== undefined
          ? String(details.technicalInterviewScore)
          : "",
      behavioralInterviewScore:
        details?.behavioralInterviewScore !== undefined
          ? String(details.behavioralInterviewScore)
          : "",
    });
  }, [reviewDetail, reset]);

  const onSubmit = async (data: any) => {
    if (!reviewDetail || !reviewDetail.id) return;
    const payload = {
      activity_check_notes: data.activityCheckNotes,
      resume_score: Number(data.resumeScore),
      essay_why_a2sv_score: Number(data.essayWhyA2svScore),
      essay_about_you_score: Number(data.essayAboutYouScore),
      technical_interview_score: Number(data.technicalInterviewScore),
      behavioral_interview_score: Number(data.behavioralInterviewScore),
      interview_notes: "Good",
    };
    const result = await submitReview(reviewDetail.id, payload);
    if (result.success) {
      setToastMessage("Review submitted successfully!");
      setToastType("success");
      setShowToast(true);
      reset({
        activityCheckNotes: "",
        resumeScore: "",
        essayWhyA2svScore: "",
        essayAboutYouScore: "",
        technicalInterviewScore: "",
        behavioralInterviewScore: "",
      });
    } else {
      let errorMsg = "Failed to submit review";
      if (result.error && result.error.includes("No auth token")) {
        errorMsg = "You are not logged in. Please log in as a reviewer.";
      }
      setToastMessage(errorMsg);
      setToastType("error");
      setShowToast(true);
      if (result.error) console.error(result.error);
    }
  };
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <HeaderReviewDetail
        reviewerName={reviewerName}
        leftHovered={leftHovered}
        onLeftHoverChange={onLeftHoverChange}
      />

      <div className="bg-[#1F2937] max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center min-w-screen">
        <p className="text-sm text-white">
          &copy; 2025 A2SV. All rights reserved.
        </p>
      </div>

      <main className="py-8">
        <div className="mx-auto max-w-7xl py-4 sm:px-6 lg:px-8">
          <header className="mb-8">
            <a
              href="/"
              className="flex"
              onMouseEnter={() => onLeftHoverChange && onLeftHoverChange(true)}
              onMouseLeave={() => onLeftHoverChange && onLeftHoverChange(false)}
            >
              <Image
                src={
                  leftHovered
                    ? "/images/variant=1.png"
                    : "/images/variant=2.png"
                }
                alt="left"
                width={20}
                height={20}
              />
              <p className="text-sm text-[#6B7280] hover:text-gray-700">
                Back to Dashboard
              </p>
            </a>
            <h1 className="text-3xl font-extrabold mt-2">
              Review: {reviewDetail ? reviewDetail.name : "Undefined"}
            </h1>
          </header>

          <div className="grid grid-cols-2 gap-8 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Applicant Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-[#6B7280]">
                          School
                        </h3>
                        <p className="mt-1">{reviewDetail.school}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-[#6B7280]">
                          Degree Program
                        </h3>
                        <p className="mt-1">{reviewDetail.degree}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Coding Profiles
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <a
                          href={`https://leetcode.com/${reviewDetail.leetcode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-[#4F46E5] hover:text-[#182E6F] px-3 py-1"
                        >
                          LeetCode
                        </a>
                        <a
                          href={`https://codeforces.com/profile/${reviewDetail.codeforces}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-[#4F46E5] hover:text-[#182E6F] px-3 py-1"
                        >
                          Codeforces
                        </a>
                      </div>
                    </div>
                    {reviewDetail.essays.map((essay, index) => (
                      <div key={index}>
                        <h3 className="text-sm font-medium text-gray-500">
                          {essay.question}
                        </h3>
                        <p className="mt-1 text-base text-gray-900">
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
                        className="mt-1 text-base font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        View Resume.pdf
                      </a>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            <div className="lg:col-span-1 flex items-stretch">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col h-full w-full"
              >
                <Card className="flex flex-col h-full">
                  <CardHeader>
                    <CardTitle>Evaluation Form</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1 space-y-6 mt-1">
                    <div>
                      <label
                        htmlFor="activity_score"
                        className="text-[#374151]"
                      >
                        Activity Check Score
                      </label>
                      <Textarea
                        id="activity_score"
                        readOnly={readonly}
                        {...register("activityCheckNotes", {
                          required: "Required",
                        })}
                        className={
                          errors.activityCheckNotes
                            ? "border border-red-500"
                            : ""
                        }
                      />
                      {errors.activityCheckNotes && (
                        <span className="text-xs text-red-500">
                          {errors.activityCheckNotes.message as string}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="resume_score">Resume Score</Label>
                        <Input
                          type="number"
                          id="resume_score"
                          className={`border border-gray-300 rounded-md ${
                            errors.resumeScore ? "border-red-500" : ""
                          }`}
                          readOnly={readonly}
                          min={0}
                          {...register("resumeScore", { required: "Required" })}
                        />
                        {errors.resumeScore && (
                          <span className="text-xs text-red-500">
                            {errors.resumeScore.message as string}
                          </span>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="essay_score">
                          Essay Why A2SV Score
                        </Label>
                        <Input
                          id="essay_score"
                          type="number"
                          className={`border border-gray-300 rounded-md ${
                            errors.essayWhyA2svScore ? "border-red-500" : ""
                          }`}
                          readOnly={readonly}
                          min={0}
                          {...register("essayWhyA2svScore", {
                            required: "Required",
                          })}
                        />
                        {errors.essayWhyA2svScore && (
                          <span className="text-xs text-red-500">
                            {errors.essayWhyA2svScore.message as string}
                          </span>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="essay_about_you_score">
                          Essay About You Score
                        </Label>
                        <Input
                          id="essay_about_you_score"
                          type="number"
                          className={`border border-gray-300 rounded-md ${
                            errors.essayAboutYouScore ? "border-red-500" : ""
                          }`}
                          readOnly={readonly}
                          min={0}
                          {...register("essayAboutYouScore", {
                            required: "Required",
                          })}
                        />
                        {errors.essayAboutYouScore && (
                          <span className="text-xs text-red-500">
                            {errors.essayAboutYouScore.message as string}
                          </span>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="technical_interview_score">
                          Technical Interview Score
                        </Label>
                        <Input
                          id="technical_interview_score"
                          type="number"
                          className={`border border-gray-300 rounded-md ${
                            errors.technicalInterviewScore
                              ? "border-red-500"
                              : ""
                          }`}
                          readOnly={readonly}
                          min={0}
                          {...register("technicalInterviewScore", {
                            required: "Required",
                          })}
                        />
                        {errors.technicalInterviewScore && (
                          <span className="text-xs text-red-500">
                            {errors.technicalInterviewScore.message as string}
                          </span>
                        )}
                      </div>
                      <Toaster
                        message={toastMessage}
                        type={toastType}
                        onClose={() => setShowToast(false)}
                        show={showToast}
                      />
                      <div>
                        <Label htmlFor="behavioral_interview_score">
                          Behavioral Interview Score
                        </Label>
                        <Input
                          id="behavioral_interview_score"
                          type="number"
                          className={`border border-gray-300 rounded-md ${
                            errors.behavioralInterviewScore
                              ? "border-red-500"
                              : ""
                          }`}
                          readOnly={readonly}
                          min={0}
                          {...register("behavioralInterviewScore", {
                            required: "Required",
                          })}
                        />
                        {errors.behavioralInterviewScore && (
                          <span className="text-xs text-red-500">
                            {errors.behavioralInterviewScore.message as string}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-auto">
                      {readonly ? (
                        reviewStatus === "accepted" ? (
                          <button
                            className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-md cursor-not-allowed"
                            disabled
                          >
                            Accepted
                          </button>
                        ) : reviewStatus === "rejected" ? (
                          <button
                            className="w-full bg-red-500 text-white font-semibold py-2 px-4 rounded-md cursor-not-allowed"
                            disabled
                          >
                            Rejected
                          </button>
                        ) : null
                      ) : (
                        <button
                          type="submit"
                          className="w-full bg-[#4F46E5] text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                          disabled={!isValid}
                        >
                          Save & Submit Review
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReviewerDetailPage;
