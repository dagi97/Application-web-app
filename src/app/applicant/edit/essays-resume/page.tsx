"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/app/components/Label";
import { Progress } from "@/app/components/Progress";
import { Textarea } from "@/app/components/Textarea";
import Button from "@/app/components/Button";
import Toaster from "@/app/components/Toaster";
import { useApplicationForm } from "@/hooks/ApplicationFormContext";
import { useEditApplicationMutation } from "@/lib/redux/api/applicationApi";
import Header from "@/app/components/ApplicantHeader";

export default function EssaysResumeStep() {
  const router = useRouter();
  const { formData, updateFormData, isLoading, isError, appId } =
    useApplicationForm();

  const [editApplication, { isLoading: isEditing }] =
    useEditApplicationMutation();

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    show: boolean;
  }>({ message: "", type: "success", show: false });

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setResumeFile(file);
      updateFormData({ resume: file });
    }
  };

  const handleSubmit = async () => {
    if (!appId) {
      setToast({
        message: "Application ID not found.",
        type: "error",
        show: true,
      });
      return;
    }

    const payload = new FormData();

    // Map frontend formData keys to backend API keys
    const mapping: Record<string, string> = {
      id_number: "student_id",
      university: "school",
      degree: "degree",
      country: "country",
      codeforces: "codeforces_handle",
      leetcode: "leetcode_handle",
      github: "github",
      essay_question_1: "essay_about_you",
      essay_question_2: "essay_why_a2sv",
    };

    // Append only non-empty values to payload
    Object.entries(mapping).forEach(([formKey, apiKey]) => {
      const value = formData[formKey as keyof typeof formData];
      if (value !== "" && value !== null && value !== undefined) {
        payload.append(apiKey, value as string);
      }
    });

    if (resumeFile) {
      payload.append("resume", resumeFile);
    }

    try {
      await editApplication({ appId, data: payload }).unwrap();

      setToast({
        message: "Application updated successfully!",
        type: "success",
        show: true,
      });

      setTimeout(() => {
        router.push("/applicant");
      }, 1500);
    } catch (err: any) {
      setToast({
        message: err?.data?.message || err.message || "Something went wrong.",
        type: "error",
        show: true,
      });
    }
  };

  const handleBack = () => {
    router.push("/applicant/edit/coding-profiles");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading application data...</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>Error loading application data. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center px-4 py-8">
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

          {/* Essay Questions */}
          <div className="space-y-4 mt-4">
            <div>
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
                placeholder="Write about yourself..."
              />
            </div>

            <div>
              <Label
                htmlFor="essay_question_2"
                className="text-gray-700 font-medium"
              >
                Why do you want to join A2SV?
              </Label>
              <Textarea
                id="essay_question_2"
                name="essay_question_2"
                rows={4}
                value={formData.essay_question_2}
                onChange={(e) =>
                  updateFormData({ essay_question_2: e.target.value })
                }
                placeholder="Explain your motivation..."
              />
            </div>

            <div>
              <Label htmlFor="resume" className="text-gray-700 font-medium">
                Upload Resume
              </Label>
              <input
                type="file"
                id="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                className="mt-1 block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
              />
              {resumeFile && (
                <p className="mt-1 text-sm text-green-600">
                  Uploaded: {resumeFile.name}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <Button type="button" variant="secondary" onClick={handleBack}>
              Back
            </Button>
            <Button type="submit" disabled={isEditing}>
              {isEditing ? "Updating..." : "Update Application"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
