"use client";
import React, { useState } from "react";
import {
  useGetApplicationStatusQuery,
  useSubmitApplicationMutation,
  useDeleteApplicationMutation,
} from "../../lib/redux/api/applicationApi";
import { CheckCircle } from "lucide-react";
import Button from "./Button";
import Toaster from "./Toaster";

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
    id: "accepted",
    title: "Accepted 🎉",
    description: "Congratulations! You've been accepted.",
  },
  {
    id: "rejected",
    title: "Rejected",
    description:
      "We regret to inform you that your application was not successful.",
  },
];

const statusOrder = [
  "in_progress",
  "submitted",
  "pending_review",
  "interview",
  "accepted",
  "rejected",
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
  const [submitApplication] = useSubmitApplicationMutation();
  const [deleteApplication] = useDeleteApplicationMutation();
  const { data: application, isLoading } = useGetApplicationStatusQuery();

  const [toast, setToast] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ show: true, type, message });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  const currentStatus = application?.data?.status;
  const currentStepIdx = currentStatus ? statusOrder.indexOf(currentStatus) : 0;

  const visibleSteps = TIMELINE_CONFIG.filter((step) => {
    if (step.id === "accepted" || step.id === "rejected") {
      return currentStatus === step.id;
    }
    return true;
  });

  const timelineSteps = visibleSteps.map((step, idx) => {
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
              { year: "numeric", month: "long", day: "numeric" }
            )
          : undefined,
    };
  });

  return (
    <>
      <Toaster
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={closeToast}
      />

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
                    className={`text-lg ${
                      step.status !== "pending" ? "font-bold" : "font-medium"
                    } ${
                      step.status === "current"
                        ? "text-blue-600"
                        : step.id === "rejected"
                        ? "text-red-600"
                        : step.id === "accepted"
                        ? "text-green-600"
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

                  {step.status !== "pending" && step.date && (
                    <p className="text-sm text-gray-500">{step.date}</p>
                  )}

                  {step.status !== "pending" && step.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {step.description}
                    </p>
                  )}

                  {step.id === "in_progress" && step.status === "current" && (
                    <div className="flex space-x-2 mt-3">
                      <Button
                        className="bg-blue-600 text-white hover:bg-blue-700"
                        size="small"
                      >
                        Edit
                      </Button>

                      <Button
                        className="bg-red-500 text-white hover:bg-red-600"
                        size="small"
                        disabled={isDeleting}
                        onClick={() => {
                          if (application?.data?.id) {
                            const confirmed = window.confirm(
                              "Are you sure you want to delete your application?"
                            );
                            if (!confirmed) return;

                            setIsDeleting(true);
                            deleteApplication(application.data.id)
                              .unwrap()
                              .then(() =>
                                showToast(
                                  "success",
                                  "Application deleted successfully"
                                )
                              )
                              .catch(() =>
                                showToast("error", "Error deleting application")
                              )
                              .finally(() => setIsDeleting(false));
                          }
                        }}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </Button>

                      <Button
                        className="bg-green-600 text-white hover:bg-green-700"
                        size="small"
                        disabled={isSubmitting}
                        onClick={() => {
                          if (application?.data?.id) {
                            const confirmed = window.confirm(
                              "Are you sure you want to submit your application?"
                            );
                            if (!confirmed) return;

                            setIsSubmitting(true);
                            submitApplication(application.data.id)
                              .unwrap()
                              .then(() =>
                                showToast(
                                  "success",
                                  "Application submitted successfully"
                                )
                              )
                              .catch(() =>
                                showToast(
                                  "error",
                                  "Error submitting application"
                                )
                              )
                              .finally(() => setIsSubmitting(false));
                          }
                        }}
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TimeLineCard;
