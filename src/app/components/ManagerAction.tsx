"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";
import Toaster from "./Toaster";
import {
  useAssignReviewerMutation,
  useDecideApplicationMutation,
  useGetAllReviewersQuery,
  useGetApplicationByIdQuery,
} from "../../lib/redux/api/managerApi";
import { loginAndStoreToken } from "../../lib/redux/utils/login";

interface ManagerActionProps {
  applicationId: string;
}

const ManagerAction: React.FC<ManagerActionProps> = ({ applicationId }) => {
  const { register, handleSubmit, reset } = useForm<{ reviewer: string }>();

  const [decisionNote, setDecisionNote] = useState("");
  const [toaster, setToaster] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const [selectedReviewer, setSelectedReviewer] = useState("");
  const [selectedReviewerName, setSelectedReviewerName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showReviewerDropdown, setShowReviewerDropdown] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Temporary login
  useEffect(() => {
    loginAndStoreToken("d@gmail.com", "123").catch(() => {});
  }, []);

  // API hooks
  const { data: reviewersData, isLoading: isLoadingReviewers } =
    useGetAllReviewersQuery();

  const { data: applicationData, isLoading: isLoadingApplication } =
    useGetApplicationByIdQuery(applicationId);

  const [assignReviewer, { isLoading: isAssigning }] =
    useAssignReviewerMutation();

  const [decideApplication, { isLoading: isDeciding }] =
    useDecideApplicationMutation();

  // Toaster helper
  const showToaster = (message: string, type: "success" | "error") => {
    setToaster({ show: true, message, type });
    setTimeout(() => {
      setToaster((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // Extract reviewers safely
  const reviewers = reviewersData?.data?.reviewers || [];

  // Filter reviewers based on search term (case-insensitive)
  const filteredReviewers = reviewers.filter((r: any) =>
    r.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Current application decision status (null if none)
  const applicationStatus = applicationData?.data?.application?.status || null;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowReviewerDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle selecting reviewer from dropdown
  const handleSelectReviewer = (rev: any) => {
    setSelectedReviewer(rev.id);
    setSelectedReviewerName(rev.full_name);
    setSearchTerm(rev.full_name);
    setShowReviewerDropdown(false);
  };

  // On input change, update searchTerm and show dropdown
  const handleReviewerInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(e.target.value);
    setSelectedReviewer("");
    setSelectedReviewerName(e.target.value);
    setShowReviewerDropdown(true);
  };

  // Assign Reviewer submit handler
  const onSubmit = async () => {
    if (!selectedReviewer) {
      showToaster("Please select a reviewer from the list.", "error");
      return;
    }

    const reviewerName =
      reviewers.find((r: any) => r.id === selectedReviewer)?.full_name || "";

    if (
      !window.confirm(
        `Are you sure you want to assign ${reviewerName} to this application?`
      )
    )
      return;

    try {
      await assignReviewer({
        appId: applicationId,
        reviewer_id: selectedReviewer,
      }).unwrap();

      showToaster(`Reviewer ${reviewerName} assigned successfully!`, "success");
      reset();
      setSelectedReviewer("");
      setSelectedReviewerName("");
      setSearchTerm("");
    } catch (err) {
      showToaster("Failed to assign reviewer. Please try again.", "error");
    }
  };

  // Accept / Reject decision handler
  const handleDecision = async (status: "accepted" | "rejected") => {
    if (
      !window.confirm(
        `Are you sure you want to ${status} this application? This action is final.`
      )
    )
      return;

    try {
      const note =
        decisionNote.trim() || `Manager decided to ${status} this application.`;

      await decideApplication({
        appId: applicationId,
        status,
        decision_notes: note,
      }).unwrap();

      showToaster(`Application ${status} successfully!`, "success");
      setDecisionNote("");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      showToaster(
        `Failed to ${status} application. Please try again.`,
        "error"
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md">
      {/* Toaster */}
      <Toaster
        message={toaster.message}
        type={toaster.type}
        onClose={() => setToaster((prev) => ({ ...prev, show: false }))}
        show={toaster.show}
      />

      <h2 className="text-2xl font-semibold mb-6">Manager Actions</h2>

      {/* Assign Reviewer Section */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-6"
        autoComplete="off"
      >
        <label className="block font-medium text-gray-700 mb-2">
          Assign Reviewer
        </label>

        <div className="relative">
          <input
            type="text"
            placeholder="Search and select reviewer..."
            value={selectedReviewerName}
            onChange={handleReviewerInputChange}
            onFocus={() => setShowReviewerDropdown(true)}
            ref={inputRef}
            className="w-full rounded-md bg-gray-100 px-3 py-2 mb-2 text-gray-900 outline-none border border-gray-300"
            disabled={isLoadingReviewers}
            autoComplete="off"
          />

          {showReviewerDropdown && (
            <div
              ref={dropdownRef}
              className="absolute z-10 w-full max-h-48 overflow-auto bg-white border border-gray-300 rounded shadow-md"
            >
              {isLoadingReviewers ? (
                <div className="p-2 text-gray-500">Loading reviewers...</div>
              ) : filteredReviewers.length > 0 ? (
                filteredReviewers.map((rev: any) => (
                  <div
                    key={rev.id}
                    className="cursor-pointer px-3 py-2 hover:bg-blue-100"
                    onClick={() => handleSelectReviewer(rev)}
                  >
                    {rev.full_name}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500">No reviewers found</div>
              )}
            </div>
          )}
        </div>

        <Button type="submit" size="xsmall" disabled={isAssigning}>
          {isAssigning ? "Assigning..." : "Confirm"}
        </Button>
      </form>

      <hr className="my-6 border-gray-300" />

      {/* Final Decision Section */}
      <div>
        <h3 className="text-xl font-semibold mb-1">Final Decision</h3>
        <p className="text-gray-600 mb-4">
          This action is final and will notify the applicant.
        </p>

        {isLoadingApplication ? (
          <p>Loading application decision status...</p>
        ) : applicationStatus === "accepted" ||
          applicationStatus === "rejected" ? (
          <div className="p-4 bg-gray-100 rounded text-center text-lg font-semibold">
            Decision made:{" "}
            <span
              className={
                applicationStatus === "accepted"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {applicationStatus.toUpperCase()}
            </span>
          </div>
        ) : (
          <>
            <textarea
              className="w-full bg-gray-100 rounded-md px-3 py-2 mb-4 text-gray-900 outline-none border-none resize-none"
              placeholder="Optional decision note (leave empty for default)"
              rows={3}
              value={decisionNote}
              onChange={(e) => setDecisionNote(e.target.value)}
              disabled={isDeciding}
            />

            <div className="flex space-x-4">
              <Button
                size="medium"
                onClick={() => handleDecision("rejected")}
                className="flex-1 font-semibold py-2 rounded transition max-w-[150px] bg-red-600 hover:bg-red-700 text-white"
                disabled={isDeciding}
              >
                Reject
              </Button>

              <Button
                size="medium"
                onClick={() => handleDecision("accepted")}
                className="flex-1 font-semibold py-2 rounded transition bg-green-600 hover:bg-green-700 text-white"
                disabled={isDeciding}
              >
                Accept
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManagerAction;
