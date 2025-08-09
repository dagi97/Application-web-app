// page.tsx
"use client";
import ReviewerFeedback from "@/app/components/ReviewerFeedback";
import { useParams } from "next/navigation";

export default function ReviewPage() {
  const { application_id } = useParams();
  return <ReviewerFeedback applicationId={application_id as string} />;
}
