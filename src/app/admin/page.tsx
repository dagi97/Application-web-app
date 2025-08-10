'use client';

import React from "react";
import AdminNav from "../components/navigation/AdminNav";
import SummaryCard from "../components/admin/SummaryCard";
import ActionCard from "../components/admin/ActionCard";
import ActivityCard from "../components/admin/ActivityCard";
import Footer_Variant1 from "../components/footer/footer_variant1";
import { useGetPaginatedUsersQuery } from "@/lib/redux/api/adminApi";

const Page = () => {
  const {data} = useGetPaginatedUsersQuery({page:1,limit:5})
  const tot_user = data?.total_count


  return (
    <div>

      <div className="bg-[#F3F4F6]">
        <AdminNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-[#111827] text-3xl font-[700] mb-8">
            Admin Command Center
          </h1>

          <div className="grid grid-cols-3 gap-7 mb-7">
            <div className="bg-gradient-to-br from-[#6366F1] to-[#9333EA] pt-3 pb-3 pl-4 rounded-md">
              <SummaryCard title="Total Users" number={tot_user} />
            </div>
            <div className="bg-gradient-to-br from-[#22C55E] to-[#0D9488] pt-3 pb-3 pl-4 rounded-md">
              <SummaryCard title="Total Applicants" number={1204} />
            </div>
            <div className="bg-gradient-to-br from-[#EAB308] to-[#EA580C] pt-3 pb-3 pl-4 rounded">
              <SummaryCard title="Active Cycles" number={1} />
            </div>
        
            <div className="pb-32 flex-1 shadow-2xl rounded-md pt-5 pl-5 bg-white">
              <ActionCard title="Manage Users" description="Create,edit, and manage user accounts and roles" page="Users"/>
            </div>
            <div className=" pb-32 flex-1 shadow-2xl rounded-md pt-5 pl-5 bg-white">
              <ActionCard title="Manage Cycles" description="Create and manage application Cycles" page="Cycles"/>
            </div>
            <div className=" pb-32 flex-1 shadow-2xl rounded-md pt-5 pl-5 bg-white">
              <ActivityCard/>
            </div>
          </div>


          <div className="shadow-2xl rounded-md pt-5 pl-5 ml-56 mr-56 pb-6 mb-64 bg-white">
            <ActionCard title="View Analytics" description="Explore Application data and platform insights" page="Analytics"/>
          </div>
        </div>
        <Footer_Variant1 />
      </div>

      
      
    </div>


  );
};

export default Page;
