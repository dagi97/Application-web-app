'use client';

import React from "react";
import AdminNav from "../components/navigation/AdminNav";
import SummaryCard from "../components/admin/SummaryCard";
import ActionCard from "../components/admin/ActionCard";
import ActivityCard from "../components/admin/ActivityCard";
import Footer_Variant1 from "../components/footer/footer_variant1";
import { useGetPaginatedUsersQuery,useGetActiveCyclesQuery,useGetAnalyticsQuery } from "@/lib/redux/api/adminApi";

const Page = () => {
  const {data: getUsers} = useGetPaginatedUsersQuery({page:1,limit:5})
  const tot_user = getUsers?.total_count || 0;

  const {data: getActiveCycles} = useGetActiveCyclesQuery({page:1,limit:5})
  const active_cycles = getActiveCycles?.data.total_count || 0;

  const {data: getAnalytics} = useGetAnalyticsQuery()
  const total_applicants = getAnalytics?.total_applicants || 0;



  return (
    <div>
      <div className="bg-[#F3F4F6]">
        <AdminNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-[#111827] text-2xl lg:text-3xl font-bold mb-8">
            Admin Command Center
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-7 mb-7">
            <div className="bg-gradient-to-br from-[#6366F1] to-[#9333EA] p-4 rounded-md">
              <SummaryCard title="Total Users" number={tot_user} />
            </div>
            <div className="bg-gradient-to-br from-[#22C55E] to-[#0D9488] p-4 rounded-md">
              <SummaryCard title="Total Applicants" number={total_applicants} />
            </div>
            <div className="bg-gradient-to-br from-[#EAB308] to-[#EA580C] p-4 rounded-md">
              <SummaryCard title="Active Cycles" number={active_cycles} />
            </div>

            <div className="pt-5 px-5 pb-8 lg:pb-32 bg-white shadow-xl rounded-md">
              <ActionCard title="Manage Users" description="Create, edit, and manage user accounts and roles" page="Users" />
            </div>
            <div className="pt-5 px-5 pb-8 lg:pb-32 bg-white shadow-xl rounded-md">
              <ActionCard title="Manage Cycles" description="Create and manage application Cycles" page="Cycles" />
            </div>
            <div className="pt-5 px-5 pb-8 lg:pb-32 bg-white shadow-xl rounded-md">
              <ActivityCard />
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-md p-7 lg:mx-56 mb-16 lg:mb-64">
            <ActionCard title="View Analytics" description="Explore Application data and platform insights" page="Analytics" />
          </div>
        </div>
        <Footer_Variant1 />
      </div>
    </div>

  );
};

export default Page;
