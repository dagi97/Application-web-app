"use client";
import { useGetApplicationStatusQuery } from "../../lib/redux/api/applicationApi";
import { CheckCircle } from "lucide-react";
import React, { useEffect } from "react";

const TIMELINE_CONFIG = [
  {
    id: "in_progress",
    title: "In Progress",
    description:
      "You're currently working on your application. Make sure to complete and submit it before the deadline.",
  },
  {
    id: "submitted",
    title: "Application Submitted",
    description:
      "Your application has been successfully submitted. We're excited to learn more about you!",
  },
  {
    id: "pending_review",
    title: "Under Review",
    description:
      "Our team is currently reviewing your application. This may take a few days. Thank you for your patience.",
  },
  {
    id: "interview",
    title: "Interview Stage",
    description: "If selected, you will be invited for an interview.",
  },
  {
    id: "decision",
    title: "Decision Made",
    description: "You will be notified of the final decision.",
  },
];

const statusOrder = [
  "in_progress",
  "submitted",
  "pending_review",
  "interview",
  "decision",
];

const getStepIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    case "current":
      return (
        <span className="w-6 h-6 flex items-center justify-center">
          <span className="w-4 h-4 rounded-full bg-blue-600 border-4 border-blue-200 block"></span>
        </span>
      );
    default:
      return <div className="w-6 h-6 rounded-full bg-gray-300"></div>;
  }
};

const TimeLineCard = () => {
  const { data: application, isLoading } = useGetApplicationStatusQuery();

  // ✅ Corrected: Get index of current status from statusOrder
  const currentStepIdx = application?.data
    ? statusOrder.indexOf(application.data.status)
    : 0;

  const timelineSteps = TIMELINE_CONFIG.map((step, idx) => {
    let status: "completed" | "current" | "pending" = "pending";
    if (idx < currentStepIdx) status = "completed";
    else if (idx === currentStepIdx) status = "current";

    return {
      ...step,
      status,
      date:
        step.id === "submitted" && application?.data?.submitted_at
          ? new Date(application.data.submitted_at).toLocaleDateString(
              undefined,
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )
          : undefined,
    };
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Application Timeline</h2>
      {isLoading ? (
        <div className="text-gray-500 text-center py-8">Loading...</div>
      ) : (
        <div className="space-y-6">
          {timelineSteps.map((step, index) => (
            <div key={step.id} className="flex items-start space-x-4">
              <div className="flex-shrink-0 flex flex-col items-center">
                {getStepIcon(step.status)}
                {index < timelineSteps.length - 1 && (
                  <div
                    className={`w-0.5 h-16 mt-2 ${
                      step.status === "completed" ||
                      timelineSteps[index + 1].status === "completed"
                        ? "bg-green-500"
                        : step.status === "current" ||
                          timelineSteps[index + 1].status === "current"
                        ? "bg-blue-200"
                        : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className={`text-lg font-medium ${
                    step.status === "current"
                      ? "text-blue-600"
                      : step.status === "completed"
                      ? "text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </h3>

                {step.status === "current" && (
                  <p className="text-sm text-blue-600 font-medium mb-2">
                    Current Stage
                  </p>
                )}

                {step.date && (
                  <p className="text-sm text-gray-500">{step.date}</p>
                )}

                {step.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {step.description}
                  </p>
                )}

                {step.id === "in_progress" && step.status === "current" && (
                  <div className="flex space-x-2 mt-3">
                    <button className="px-4 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Edit
                    </button>
                    <button className="px-4 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600">
                      Delete
                    </button>
                    <button className="px-4 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeLineCard;
