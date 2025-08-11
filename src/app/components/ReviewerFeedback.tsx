"use client";

import { useEffect } from "react";
import { useGetReviewerFeedbackQuery } from "@/lib/redux/api/managerApi";

interface ReviewerFeedbackProps {
  applicationId: string;
}

export default function ReviewerFeedback({
  applicationId,
}: ReviewerFeedbackProps) {
  const {
    data: reviewResponse,
    isLoading,
    error,
  } = useGetReviewerFeedbackQuery(applicationId, {
    skip: !applicationId,
  });

  useEffect(() => {
    console.log("Application ID:", applicationId);
    console.log("Review Response:", reviewResponse);
  }, [applicationId, reviewResponse]);

  if (isLoading)
    return <div className="text-base text-gray-600">Loading review...</div>;
  if (error)
    return <div className="text-base text-red-600">Error fetching review</div>;

  if (!reviewResponse?.data?.review_details) {
    return (
      <div className="text-base text-gray-700">
        No reviewer feedback has been submitted for this application yet.
      </div>
    );
  }

  const review = reviewResponse.data.review_details;

  return (
    <div className="bg-white p-6 rounded-md shadow-md max-w-lg">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">
        Reviewer&apos;s Feedback (Jane R.)
      </h2>

      <section className="mb-4 text-sm text-gray-700">
        <p className="font-semibold mb-1">Activity Check</p>
        <p>{review.activity_check_notes || "N/A"}</p>
      </section>

      <section className="grid grid-cols-2 gap-x-10 gap-y-3 mb-4 text-sm text-gray-800">
        <div>
          <p className="font-semibold">Resume Score</p>
          <p>{review.resume_score}/100</p>
        </div>
        <div>
          <p className="font-semibold">Essay Score</p>
          <p>{review.essay_why_a2sv_score}/100</p>
        </div>
        <div>
          <p className="font-semibold">Tech Interview</p>
          <p>{review.technical_interview_score}/100</p>
        </div>
        <div>
          <p className="font-semibold">Behavioral</p>
          <p>{review.behavioral_interview_score}/100</p>
        </div>
      </section>

      <section className="text-sm text-gray-800">
        <p className="font-semibold mb-2">Interviewer Notes</p>
        <p>{review.interview_notes || "No notes provided."}</p>
      </section>
    </div>
  );
}
