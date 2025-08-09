"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  mapApiToReviewDetail,
  ReviewDetail,
} from "../../lib/redux/types/applicantData";
import ManagerDetailPage from "@/app/components/ManagerDetail";

const ManagerDetailsPage = () => {
  const params = useParams();
  const application_id =
    (params?.application_id as string) ||
    "8db025c5-e0c9-40e3-843a-fc65713dc1dd";
  const [reviewDetail, setReviewDetail] = useState<ReviewDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchReview() {
      setIsLoading(true);
      setIsError(false);
      try {
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NzkzYTFhYS1kNjFmLTQ0MzgtODZmYi02NTJhNjMxZWIxNzYiLCJleHAiOjE3NTQ3MTc1NDYsInR5cGUiOiJhY2Nlc3MifQ.gs0pRUo77OS3gjCeoy4mdE7gXlaY3iLij0xzlMMqwIA";

        const res = await fetch(
          `https://a2sv-application-platform-backend-team2.onrender.com/manager/applications/${application_id}`,
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
  console.log("Review Detail:", reviewDetail);

  return (
    <ManagerDetailPage
      reviewDetail={reviewDetail}
      isLoading={isLoading}
      isError={isError}
    />
  );
};

export default ManagerDetailsPage;
