"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/app/components/Input";
import { Label } from "@/app/components/Label";
import { Progress } from "@/app/components/Progress";
import { Textarea } from "@/app/components/Textarea";
import Button from "@/app/components/Button";
import Toaster from "@/app/components/Toaster";

import { useApplicationForm } from "@/lib/context/ApplicationFormContext";
import { useSubmitApplicationMutation } from "@/lib/redux/api/applicationApi";

export default function EssaysResumeStep() {
  const router = useRouter();
  const { formData, updateFormData } = useApplicationForm();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitApplication, { isLoading }] = useSubmitApplicationMutation();

  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    show: boolean;
  }>({
    message: "",
    type: "success",
    show: false,
  });

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const errors: string[] = [];

    if (!formData.university) errors.push("University (school) is required.");
    if (!formData.id_number) errors.push("Student ID is required.");
    if (!formData.degree) errors.push("Degree is required.");
    if (!formData.country) errors.push("Country is required.");
    if (!formData.leetcode) errors.push("LeetCode handle is required.");
    if (!formData.codeforces) errors.push("Codeforces handle is required.");
    if (!formData.essay_question_1)
      errors.push("Essay about yourself is required.");
    if (!formData.essay_question_2)
      errors.push("Essay about why you want to join is required.");
    if (!resumeFile) errors.push("Resume file is required.");

    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }

    setErrorMessages([]);

    const payload = new FormData();
    payload.append("school", formData.university ?? "");
    payload.append("student_id", formData.id_number ?? "");
    payload.append("degree", formData.degree ?? "");
    payload.append("country", formData.country ?? "Ethiopia");
    payload.append("leetcode_handle", formData.leetcode ?? "");
    payload.append("codeforces_handle", formData.codeforces ?? "");
    payload.append("essay_about_you", formData.essay_question_1 ?? "");
    payload.append("essay_why_a2sv", formData.essay_question_2 ?? "");
    if (resumeFile) payload.append("resume", resumeFile);

    try {
      await submitApplication(payload).unwrap();

      setToast({
        message:
          "Application submitted successfully! You will be redirected to the dashboard page.",
        type: "success",
        show: true,
      });

      // ✅ Redirect to dashboard after short delay
      setTimeout(() => {
        router.push("/applicant/dashboard"); // 🔁 Change if your dashboard route is different
      }, 1500);
    } catch (err: any) {
      console.error("Submission failed:", err);

      if (err?.data?.message) {
        setToast({
          message: err.data.message,
          type: "error",
          show: true,
        });
      } else if (err?.status === 409) {
        setToast({
          message: "You have already submitted an application.",
          type: "error",
          show: true,
        });
      } else {
        setToast({
          message: "Something went wrong. Please try again.",
          type: "error",
          show: true,
        });
      }
    }
  };

  const handleBack = () => {
    router.push("/applicant/application/coding-profiles");
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center px-4 py-8">
      {/* ✅ Toaster */}
      <Toaster
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <form
        className="bg-white shadow-md rounded-xl border w-full max-w-xl p-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <h2 className="text-center text-lg font-semibold mb-6">
          Application Form
        </h2>
        <Progress step={3} value={100} className="h-1 bg-gray-200 mb-4" />

        {/* Stepper */}
        <div className="flex justify-around border-b border-gray-200 pb-4 text-sm font-medium">
          <div className="flex items-center gap-2 text-[#5f3dc4]">
            <span className="w-6 h-6 rounded-full bg-[#e0dbfa] text-[#5f3dc4] text-xs flex items-center justify-center">
              1
            </span>
            <span>Personal Info</span>
          </div>
          <div className="flex items-center gap-2 text-[#5f3dc4]">
            <span className="w-6 h-6 rounded-full bg-[#e0dbfa] text-[#5f3dc4] text-xs flex items-center justify-center">
              2
            </span>
            <span>Coding Profiles</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span className="w-6 h-6 rounded-full bg-[#5f3dc4] text-white text-xs flex items-center justify-center">
              3
            </span>
            <span>Essays & Resume</span>
          </div>
        </div>

        {/* Validation Errors */}
        {errorMessages.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-4">
            <ul className="list-disc list-inside text-sm">
              {errorMessages.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Essay Questions */}
        <div className="space-y-4 mt-4">
          <div className="space-y-4">
            <Label
              htmlFor="essay_question_1"
              className="text-gray-700 font-medium"
            >
              Tell us about yourself.
            </Label>
            <Textarea
              id="essay_question_1"
              name="essay_question_1"
              rows={4}
              value={formData.essay_question_1}
              onChange={(e) =>
                updateFormData({ essay_question_1: e.target.value })
              }
              placeholder="Write your answer here..."
              className="mt-1 border border-[#E0E0E0] focus:border-[#5f3dc4] focus:ring-[#e0dbfa] rounded-md shadow-sm"
            />
          </div>

          <div className="space-y-4">
            <Label
              htmlFor="essay_question_2"
              className="text-gray-700 font-medium"
            >
              Why do you want to join us?
            </Label>
            <Textarea
              id="essay_question_2"
              name="essay_question_2"
              rows={4}
              value={formData.essay_question_2}
              onChange={(e) =>
                updateFormData({ essay_question_2: e.target.value })
              }
              placeholder="Write your answer here..."
              className="mt-1 border border-[#E0E0E0] focus:border-[#5f3dc4] focus:ring-[#e0dbfa] rounded-md shadow-sm"
            />
          </div>
        </div>

        {/* Resume Upload */}
        <div className="mt-6 space-y-4">
          <Label htmlFor="resume" className="text-gray-700 font-medium">
            Resume
          </Label>
          <p className="text-sm text-gray-500 mb-1">Upload your resume</p>
          <Input
            id="resume"
            type="file"
            accept=".pdf"
            onChange={handleResumeChange}
            className="bg-white"
          />
          {!resumeFile && (
            <p className="text-xs text-red-500 mt-1">* No file chosen</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between">
          <Button
            type="button"
            variant="secondary"
            size="small"
            className="bg-gray-100 text-gray-800 px-3 py-1.5 text-sm rounded-md"
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            type="submit"
            size="applicantForm"
            className="bg-[#5f3dc4] hover:bg-[#5032ad] text-white px-6 py-2 rounded-md"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
