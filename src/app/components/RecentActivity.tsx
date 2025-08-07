"use client";

import React from "react";
import { CheckCircle, Calendar, Bell } from "lucide-react";
import { useGetApplicationStatusQuery } from "../../lib/redux/api/applicationApi";

interface ActivityItem {
  id: string;
  title: string;
  date: string;
  type: "submission" | "interview" | "update";
}

const RecentActivity = () => {
  const { data: application, isLoading } = useGetApplicationStatusQuery();

  const getActivityIcon = (type: string) => {
    const iconStyle = "w-4 h-4";
    const wrapperStyle =
      "flex items-center justify-center w-8 h-8 rounded-full bg-blue-100";

    switch (type) {
      case "submission":
        return (
          <div className={wrapperStyle}>
            <CheckCircle className={`${iconStyle} text-green-500`} />
          </div>
        );
      case "interview":
        return (
          <div className={wrapperStyle}>
            <Calendar className={`${iconStyle} text-blue-500`} />
          </div>
        );
      default:
        return (
          <div className={wrapperStyle}>
            <Bell className={`${iconStyle} text-gray-500`} />
          </div>
        );
    }
  };

  let recentActivity: ActivityItem[] = [];

  if (application && application.data.status) {
    const { status, submitted_at, updated_at } = application.data;

    // Add submission activity if available
    if (submitted_at) {
      recentActivity.push({
        id: "1",
        title: "Application submitted",
        date: new Date(submitted_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        type: "submission",
      });
    }

    // Add under review if status is beyond "submitted"
    const reviewStatuses = [
      "pending_review",
      "interview",
      "accepted",
      "rejected",
    ];
    if (reviewStatuses.includes(status)) {
      recentActivity.push({
        id: "2",
        title: "Application under review",
        date: new Date(updated_at || submitted_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        type: "update",
      });
    }

    // Final outcome
    if (["accepted", "rejected"].includes(status)) {
      recentActivity.push({
        id: "3",
        title:
          status === "accepted"
            ? "Application accepted"
            : "Application rejected",
        date: new Date(updated_at || submitted_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        type: "update",
      });
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : recentActivity.length > 0 ? (
          recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500">{activity.date}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No recent activity.</p>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
