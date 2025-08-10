"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  useGetApplicationStatusQuery,
  useGetApplicationQuery,
} from "@/lib/redux/api/applicationApi";

interface FormData {
  id_number: string;
  university: string;
  degree: string;
  country: string;
  codeforces: string;
  leetcode: string;
  github: string;
  essay_question_1: string;
  essay_question_2: string;
  resume: File | null;
}

interface ApplicationFormContextType {
  formData: FormData;
  updateFormData: (newData: Partial<FormData>) => void;
  resetFormData: (data: Partial<FormData>) => void;
  isLoading: boolean;
  isError: boolean;
  isInitialized: boolean;
  appId: string | null;
}

const defaultFormData: FormData = {
  id_number: "",
  university: "",
  degree: "",
  country: "",
  codeforces: "",
  leetcode: "",
  github: "",
  essay_question_1: "",
  essay_question_2: "",
  resume: null,
};

const ApplicationFormContext = createContext<ApplicationFormContextType | null>(
  null
);

export const ApplicationFormProviderEdit = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch application status (to get app ID)
  const {
    data: statusData,
    isLoading: statusLoading,
    isError: statusError,
  } = useGetApplicationStatusQuery();

  const appId = statusData?.data?.id || statusData?.id || null;

  // Fetch application data using appId
  const {
    data: applicationData,
    isLoading: applicationLoading,
    isError: applicationError,
  } = useGetApplicationQuery(appId ?? "", {
    skip: !appId,
  });

  // Initialize form data once when applicationData loads
  useEffect(() => {
    if (applicationData && !isInitialized) {
      const data = applicationData.data;
      setFormData({
        id_number: data.student_id ?? "",
        university: data.school ?? "",
        degree: data.degree ?? "",
        country: data.country ?? "",
        codeforces: data.codeforces_handle ?? "",
        leetcode: data.leetcode_handle ?? "",
        github: data.github ?? "",
        essay_question_1: data.essay_about_you ?? "",
        essay_question_2: data.essay_why_a2sv ?? "",
        resume: null, // File inputs can't be prefilled
      });
      setIsInitialized(true);
    }
  }, [applicationData, isInitialized]);

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const resetFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <ApplicationFormContext.Provider
      value={{
        formData,
        updateFormData,
        resetFormData,
        isLoading: statusLoading || applicationLoading,
        isError: statusError || applicationError,
        isInitialized,
        appId,
      }}
    >
      {children}
    </ApplicationFormContext.Provider>
  );
};

export const useApplicationForm = (): ApplicationFormContextType => {
  const context = useContext(ApplicationFormContext);
  if (!context) {
    throw new Error(
      "useApplicationForm must be used within an ApplicationFormProvider"
    );
  }
  return context;
};
