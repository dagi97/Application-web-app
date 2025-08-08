"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/app/components/input";
import Button from "@/app/components/Button";
import { Progress } from "@/app/components/progress";
import { Label } from "@/app/components/label";
import { useApplicationForm } from "@/hooks/ApplicationFormContext";

export default function CodingProfilesStep() {
  const router = useRouter();
  const { formData, updateFormData, isLoading, isError } = useApplicationForm();

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

  const handleNext = () => {
    router.push("/applicant/edit/essays-resume");
  };

  const handleBack = () => {
    router.push("/applicant/edit/personal-info");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center p-6">
      <form className="bg-white rounded-xl border border-gray-200 shadow-sm w-full max-w-2xl p-6 space-y-6">
        <h2 className="text-center text-xl font-semibold">Application Form</h2>

        <Progress step={2} value={66} className="h-1 bg-gray-200 mb-4" />

        {/* Stepper */}
        <div className="flex justify-around border-b border-gray-200 pb-4 text-sm font-medium">
          <div className="flex items-center gap-2 text-[#5f3dc4]">
            <span className="w-6 h-6 rounded-full bg-[#e0dbfa] text-[#5f3dc4] text-xs flex items-center justify-center">
              1
            </span>
            <span>Personal Info</span>
          </div>
          <div className="flex items-center gap-2 text-[#5f3dc4] font-medium">
            <span className="w-6 h-6 rounded-full bg-[#5f3dc4] text-white text-xs flex items-center justify-center">
              2
            </span>
            <span>Coding Profiles</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span className="w-6 h-6 rounded-full bg-gray-200 text-xs flex items-center justify-center">
              3
            </span>
            <span>Essays & Resume</span>
          </div>
        </div>

        {/* Coding Profile Inputs */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-gray-800">
            Coding Profiles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Label htmlFor="codeforces">Codeforces</Label>
              <Input
                id="codeforces"
                name="codeforces"
                value={formData.codeforces}
                onChange={handleChange}
                className="bg-white"
                placeholder="Enter your Codeforces profile"
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="leetcode">LeetCode</Label>
              <Input
                id="leetcode"
                name="leetcode"
                value={formData.leetcode}
                onChange={handleChange}
                className="bg-white"
                placeholder="Enter your LeetCode profile"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="github">Github</Label>
            <Input
              id="github"
              name="github"
              value={formData.github}
              onChange={handleChange}
              className="bg-white"
              placeholder="Enter your Github profile"
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between border-t pt-4">
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
            type="button"
            size="applicantForm"
            onClick={handleNext}
            className="bg-[#5f3dc4] hover:bg-[#5032ad] text-white px-3 py-1.5 text-sm rounded-md"
          >
            Next: Essay and Resume
          </Button>
        </div>
      </form>
    </div>
  );
}
