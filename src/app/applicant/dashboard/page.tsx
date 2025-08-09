"use client";

import React from "react";
import { useGetApplicationStatusQuery } from "../../../lib/redux/api/applicationApi";
import ApplicationProgressPage from "../../components/ApplicationProgress";
import ApplicantDashboard from "../../components/ApplicantDashboard";

const Page = () => {
  const { data: application, isLoading } = useGetApplicationStatusQuery();

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  return (
    <div>
      {application?.data ? <ApplicationProgressPage /> : <ApplicantDashboard />}
    </div>
  );
};

export default Page;
