"use client";

import { useParams } from "next/navigation";
import ManagerDetailPage from "@/app/components/ManagerDetail";
import { useGetMappedReviewDetailQuery } from "@/lib/redux/api/managerApi";

export default function ManagerDetailsPage() {
  const params = useParams();
  const application_id =
    (params?.application_id as string) ||
    "54343999-5f65-4518-8f98-7bc2b743ae52";

  const {
    data: reviewDetail,
    isLoading,
    isError,
  } = useGetMappedReviewDetailQuery(application_id);

  return (
    <ManagerDetailPage
      reviewDetail={reviewDetail ?? null}
      isLoading={isLoading}
      isError={isError}
    />
  );
}
