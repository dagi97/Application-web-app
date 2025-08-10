"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LabelList,
} from "recharts";
import NavBar from "@/app/components/navigation/AdminNav";
import { useGetAnalyticsQuery } from "../../../lib/redux/api/adminApi";
import AdminNav from "@/app/components/navigation/AdminNav";
import Footer_Variant1 from "@/app/components/footer/footer_variant1";

type AnalyticsData = {
  total_applicants: number;
  acceptance_rate: number;
  average_review_time_days: number;
  application_funnel: {
    submitted: number;
    accepted: number;
    pending_review: number;
    in_progress: number;
  };
  school_distribution: Record<string, number>;
  country_distribution: Record<string, number>;
};

const COLORS = [
  "#6C63FF",
  "#7E8DFE",
  "#A28DFF",
  "#B491FF",
  "#D4B0FF",
  "#E9D8FF",
];

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

// Error Display Component
const ErrorDisplay = ({ error }: { error: any }) => (
  <div className="flex justify-center items-center h-screen">
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
      <strong>Error:</strong>{" "}
      {error?.message || "Failed to load analytics data"}
    </div>
  </div>
);

const AnalyticsDashboard = () => {
  const { data: analyticsData, isLoading, error } = useGetAnalyticsQuery();

  const formatNumber = (num: number) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const funnelData = analyticsData
    ? [
        { name: "Applied", value: analyticsData.application_funnel.submitted },
        {
          name: "Under Review",
          value: analyticsData.application_funnel.pending_review,
        },
        {
          name: "Interview",
          value: analyticsData.application_funnel.in_progress,
        },
        { name: "Accepted", value: analyticsData.application_funnel.accepted },
      ]
    : [];

  const schoolData = analyticsData
    ? Object.entries(analyticsData.school_distribution)
        .map(([name, value]) => ({
          name,
          value,
          percent: ((value / analyticsData.total_applicants) * 100).toFixed(1),
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6)
    : [];

  const mapData = analyticsData
    ? Object.entries(analyticsData.country_distribution).map(
        ([country, count]) => ({ country, value: count })
      )
    : [];

  const sortedMapData = [...mapData].sort(
    (a, b) => (b.value as number) - (a.value as number)
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (!analyticsData) {
    return <ErrorDisplay error={{ message: "No analytics data available" }} />;
  }

  return (
    <>
      <AdminNav />
      <div className="flex flex-col items-start p-6 md:p-10 gap-8 w-full max-w-[1920px] mx-auto bg-gray-50">
        {/* Header */}
        <div className="flex flex-col items-start gap-1 w-full max-w-[1280px]">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Application Analytics
          </h1>
          <p className="text-base text-gray-500">
            Insights for the G7 November Intake
          </p>
        </div>

        <div className="flex flex-col items-start gap-8 w-full max-w-[1280px]">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            <div className="bg-white p-5 rounded-lg shadow-lg border-l-4 border-blue-500">
              <p className="text-sm font-medium text-gray-500">
                Total Applicants
              </p>
              <p className="text-3xl font-semibold text-gray-900 mt-1">
                {formatNumber(analyticsData.total_applicants)}
              </p>
            </div>


            <div className="bg-white p-5 rounded-lg shadow-lg border-l-4 border-green-500">
              <p className="text-sm font-medium text-gray-500">
                Acceptance Rate
              </p>
              <p className="text-3xl font-semibold text-gray-900 mt-1">
                {analyticsData.acceptance_rate.toFixed(1)}%
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-lg border-l-4 border-yellow-500">
              <p className="text-sm font-medium text-gray-500">
                Avg. Review Time
              </p>
              <p className="text-3xl font-semibold text-gray-900 mt-1">
                {analyticsData.average_review_time_days.toFixed(1)} Days
              </p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            {/* Application Funnel */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  Application Funnel
                </h3>
                <p className="text-sm text-gray-500">
                  Applicant journey from submission to acceptance
                </p>
              </div>
              <div className="mt-3 h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={funnelData}
                    margin={{ top: 20, left: 100, right: 20, bottom: 20 }}
                  >
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip
                      formatter={(value) => [
                        formatNumber(Number(value)),
                        "Applicants",
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey="value"
                      name="Applicants"
                      fill="#6C63FF"
                      barSize={30}
                      radius={[5, 5, 5, 5]}
                    >
                      <LabelList
                        dataKey="value"
                        position="right"
                        formatter={(value: number) => formatNumber(value ?? 0)}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>


            {/* University Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  University Distribution
                </h3>
                <p className="text-sm text-gray-500">
                  Breakdown of applicants by university
                </p>
              </div>
              <div className="mt-3 h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={schoolData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={120}
                      dataKey="value"
                      nameKey="name"
                      labelLine={false}
                      label={({ name, value, percent }) =>
                        `${name}: ${formatNumber(value ?? 0)} (${(
                          (percent ?? 0) * 100
                        ).toFixed(1)}%)`
                      }
                    >
                      {schoolData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        `${formatNumber(Number(value ?? 0))} (${
                          props.payload.percent
                        }%)`,
                        props.payload.name,
                      ]}
                    />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-full">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold text-gray-900">
                Geographic Distribution
              </h3>
              <p className="text-sm text-gray-500">Applicants by country</p>
            </div>
            <div className="mt-3 h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedMapData}>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.9} />
                      <stop
                        offset="95%"
                        stopColor="#8884d8"
                        stopOpacity={0.3}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="country" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      formatNumber(Number(value)),
                      "Applicants",
                    ]}
                  />
                  <Legend />
<<<<<<< HEAD
                  <Bar dataKey="value" name="Applicants" fill="#6C63FF" barSize={30} radius={[5, 5, 5, 5]}>
                    <LabelList dataKey="value" position="right" formatter={(value) => formatNumber(value ?? 0)} />
=======
                  <Bar dataKey="value" name="Applicants" radius={[5, 5, 0, 0]}>
                    {sortedMapData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="url(#colorUv)" />
                    ))}
                    <LabelList
                      dataKey="value"
                      position="top"
                      formatter={(value: number) => formatNumber(value ?? 0)}
                    />
>>>>>>> 31cb1edf39aaf25f0f3f524bc2f6db1fab294d30
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
<<<<<<< HEAD

          {/* University Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold text-gray-900">University Distribution</h3>
              <p className="text-sm text-gray-500">Breakdown of applicants by university</p>
            </div>
            <div className="mt-3 h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={schoolData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    dataKey="value"
                    nameKey="name"
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      `${name}: ${formatNumber(value)} (${(percent * 100).toFixed(1)}%)`
                    }
                  >
                    {schoolData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${formatNumber(Number(value))} (${props.payload.percent}%)`, props.payload.name]} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-full">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-semibold text-gray-900">Geographic Distribution</h3>
            <p className="text-sm text-gray-500">Applicants by country</p>
          </div>
          <div className="mt-3 h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedMapData}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="country" />
                <YAxis />
                <Tooltip formatter={(value) => [formatNumber(Number(value)), 'Applicants']} />
                <Legend />
                <Bar dataKey="value" name="Applicants" radius={[5, 5, 0, 0]}>
                  {sortedMapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="url(#colorUv)" />
                  ))}
                  <LabelList dataKey="value" position="top" formatter={(value) => formatNumber(value)} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
=======
>>>>>>> 31cb1edf39aaf25f0f3f524bc2f6db1fab294d30
        </div>
      </div>
      <Footer_Variant1 />
    </>
  );
};

export default AnalyticsDashboard;
