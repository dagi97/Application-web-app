"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/app/components/Input";
import Button from "@/app/components/Button";
import { Progress } from "@/app/components/Progress";
import { Label } from "@/app/components/Label";
import { useApplicationForm } from "@/hooks/ApplicationFormContext";
import Header from "@/app/components/ApplicantHeader";

export default function PersonalInfoStep() {
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
    router.push("/applicant/edit/coding-profiles");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center p-6">
        <form className="bg-white rounded-xl border border-gray-200 shadow-sm w-full max-w-2xl p-6 space-y-6">
          <h2 className="text-center text-xl font-semibold">
            Application Form
          </h2>

          <Progress step={1} value={33} className="h-1 bg-gray-200 mb-4" />

          {/* Stepper */}
          <div className="flex justify-around border-b border-gray-200 pb-4 text-sm font-medium">
            <div className="flex items-center gap-2 text-[#5f3dc4]">
              <span className="w-6 h-6 rounded-full bg-[#5f3dc4] text-white text-xs flex items-center justify-center">
                1
              </span>
              <span>Personal Info</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="w-6 h-6 rounded-full bg-gray-200 text-xs flex items-center justify-center">
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

          {/* Inputs */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-800">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="id_number">ID Number</Label>
                <Input
                  id="id_number"
                  name="id_number"
                  value={formData.id_number}
                  onChange={(e) =>
                    updateFormData({ id_number: e.target.value })
                  }
                  className="bg-white"
                  placeholder="Enter your ID number"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="university">School / University</Label>
                <Input
                  id="university"
                  name="university"
                  value={formData.university}
                  onChange={(e) =>
                    updateFormData({ university: e.target.value })
                  }
                  className="bg-white"
                  placeholder="Enter your university"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="degree">Degree Program</Label>
                <Input
                  id="degree"
                  name="degree"
                  value={formData.degree}
                  onChange={(e) => updateFormData({ degree: e.target.value })}
                  className="bg-white"
                  placeholder="Enter your degree program"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={(e) => updateFormData({ country: e.target.value })}
                  className="bg-white"
                  placeholder="Enter your country"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between border-t pt-4">
            <Button
              type="button"
              variant="secondary"
              size="small"
              className="bg-gray-100 text-gray-800 px-3 py-1.5 text-sm rounded-md"
              onClick={() => router.push("/applicant/dashboard")}
            >
              Back
            </Button>
            <Button
              type="button"
              size="applicantForm"
              onClick={handleNext}
              className="bg-[#5f3dc4] hover:bg-[#5032ad] text-white px-3 py-1.5 text-sm rounded-md"
            >
              Next: Coding Profiles
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
