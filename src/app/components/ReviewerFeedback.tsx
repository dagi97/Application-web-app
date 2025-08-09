"use client";

import { useEffect } from "react";
import { useGetReviewerFeedbackQuery } from "@/lib/redux/api/applicationApi";

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
    return <div className="text-sm text-gray-500">Loading review...</div>;
  if (error)
    return <div className="text-sm text-red-500">Error fetching review</div>;

  if (!reviewResponse?.data?.review) {
    return (
      <div className="text-sm text-gray-600">
        No reviewer feedback has been submitted for this application yet.
      </div>
    );
  }

  const review = reviewResponse.data.review;

  return (
    <div className="bg-white p-4 rounded-md shadow-sm max-w-md">
      <h2 className="text-base font-semibold mb-3 text-gray-900">
        Reviewer&apos;s Feedback (Jane R.)
      </h2>

      <section className="mb-3 text-xs text-gray-600">
        <p className="font-medium mb-1">Activity Check</p>
        <p>{review.activity_check_notes || "N/A"}</p>
      </section>

      <section className="grid grid-cols-2 gap-x-8 gap-y-2 mb-3 text-xs text-gray-700">
        <div>
          <p className="font-medium">Resume Score</p>
          <p>{review.resume_score}/100</p>
        </div>
        <div>
          <p className="font-medium">Essay Score</p>
          <p>{review.essay_why_a2sv_score}/100</p>
        </div>
        <div>
          <p className="font-medium">Tech Interview</p>
          <p>{review.technical_interview_score}/100</p>
        </div>
        <div>
          <p className="font-medium">Behavioral</p>
          <p>{review.behavioral_interview_score}/100</p>
        </div>
      </section>

      <section className="text-xs text-gray-700">
        <p className="font-medium mb-1">Interviewer Notes</p>
        <p>{review.interview_notes || "No notes provided."}</p>
      </section>
    </div>
  );
}
