"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  mapApiToReviewDetail,
  ReviewDetail,
} from "../../../lib/redux/types/detailData";
import ReviewerDetailPage from "../page";

const ReviewDetailsPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const application_id = params?.application_id as string;
  const reviewerName = searchParams?.get("reviewerName") || null;
  const readonly = searchParams?.get("readonly") === "true";
  const status = searchParams?.get("status") || null;
  const [reviewDetail, setReviewDetail] = useState<ReviewDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchReview() {
      setIsLoading(true);
      setIsError(false);
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : null;
        const res = await fetch(
          `https://a2sv-application-platform-backend-team2.onrender.com/reviews/${application_id}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        const data = await res.json();
        if (data && data.success && data.data) {
          setReviewDetail(mapApiToReviewDetail(data));
        } else {
          setReviewDetail(null);
        }
      } catch (e) {
        setIsError(true);
        setReviewDetail(null);
      } finally {
        setIsLoading(false);
      }
    }
    if (application_id) fetchReview();
  }, [application_id]);

  return (
    <ReviewerDetailPage
      reviewDetail={reviewDetail}
      reviewerName={reviewerName}
      isLoading={isLoading}
      isError={isError}
      readonly={readonly}
      reviewStatus={status}
    />
  );
};

export default ReviewDetailsPage;
