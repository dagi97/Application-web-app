"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type FormData = {
  id_number?: string;
  university?: string;

  country?: string;
  degree?: string;
  codeforces?: string;
  leetcode?: string;
  github?: string;
  essay_question_1?: string;
  essay_question_2?: string;
  resume?: File | null;
};

type ApplicationFormContextType = {
  formData: FormData;
  updateFormData: (newData: Partial<FormData>) => void;
  resetFormData: () => void;
};

const ApplicationFormContext = createContext<
  ApplicationFormContextType | undefined
>(undefined);

export const useApplicationForm = () => {
  const context = useContext(ApplicationFormContext);
  if (!context) {
    throw new Error(
      "useApplicationForm must be used within ApplicationFormProvider"
    );
  }
  return context;
};

export const ApplicationFormProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [formData, setFormData] = useState<FormData>({});

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const resetFormData = () => setFormData({});

  return (
    <ApplicationFormContext.Provider
      value={{ formData, updateFormData, resetFormData }}
    >
      {children}
    </ApplicationFormContext.Provider>
  );
};
