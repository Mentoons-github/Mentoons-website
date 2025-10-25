import React, { createContext, useContext, useState, ReactNode } from "react";
import SubmissionModal from "@/components/modals/commonModal";

interface SubmissionStatus {
  isSubmitting: boolean;
  currentStep: "uploading" | "saving" | "success" | "error" | "Requesting";
  message: string;
  error?: string;
}

interface SubmissionModalContextType {
  showModal: (status: SubmissionStatus) => void;
  hideModal: () => void;
}

const SubmissionModalContext = createContext<
  SubmissionModalContextType | undefined
>(undefined);

export const SubmissionModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus | null>(null);

  const showModal = (status: SubmissionStatus) => {
    setSubmissionStatus(status);
  };

  const hideModal = () => {
    setSubmissionStatus(null);
  };

  return (
    <SubmissionModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {submissionStatus && (
        <SubmissionModal
          submissionStatus={submissionStatus}
          closeSubmissionModal={hideModal}
        />
      )}
    </SubmissionModalContext.Provider>
  );
};

export const useSubmissionModal = () => {
  const context = useContext(SubmissionModalContext);
  if (!context) {
    throw new Error(
      "useSubmissionModal must be used within a SubmissionModalProvider"
    );
  }
  return context;
};
