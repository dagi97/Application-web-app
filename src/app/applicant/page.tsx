"use client";

import React from "react";
import { useGetApplicationStatusQuery } from "@/lib/redux/api/applicationApi";
import ApplicationProgressPage from "../components/ApplicationProgress";
import ApplicantDashboard from "../components/ApplicantDashboard";
import LoadingSpinner from "../components/LoadingSpinner";

const Page = () => {
  const { data: application, isLoading } = useGetApplicationStatusQuery();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {application?.data ? <ApplicationProgressPage /> : <ApplicantDashboard />}
    </div>
  );
};

export default Page;
