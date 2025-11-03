import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JobApplication } from "@/types/admin";
import * as XLSX from "xlsx";

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: JobApplication | null;
}

const JobApplicationModal = ({
  isOpen,
  onClose,
  application,
}: JobApplicationModalProps) => {
  const [activeTab, setActiveTab] = useState<
    "details" | "coverNote" | "documents"
  >("details");
  const [showActionMenu, setShowActionMenu] = useState(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const exportToExcel = () => {
    if (!application) return;

    const safeFileName = application.name.replace(/[^a-zA-Z0-9]/g, "_");

    const data = [
      {
        Name: application.name,
        Email: application.email,
        "Job Title": application.jobTitle,
        Phone: application.phone,
        "Portfolio Link": application.portfolioLink,
        Gender: application.gender,
        "Cover Note": application.coverNote,
        "Resume Link": application.resume,
        "Cover Letter Link": application.coverLetterLink,
        "Applied At": new Date(application.createdAt).toLocaleString(),
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);

    worksheet["!cols"] = [
      { wch: 20 }, // Name
      { wch: 30 }, // Email
      { wch: 25 }, // Job Title
      { wch: 15 }, // Phone
      { wch: 40 }, // Portfolio Link
      { wch: 10 }, // Gender
      { wch: 50 }, // Cover Note
      { wch: 40 }, // Resume Link
      { wch: 40 }, // Cover Letter Link
      { wch: 20 }, // Applied At
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Application Details");

    XLSX.writeFile(workbook, `${safeFileName}_Application.xlsx`);
  };

  if (!application) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", damping: 25, stiffness: 500 },
    },
    exit: { y: 50, opacity: 0 },
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  const actionMenuVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  const TabButton = ({
    tab,
    label,
  }: {
    tab: "details" | "coverNote" | "documents";
    label: string;
  }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
        activeTab === tab
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </motion.button>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return (
          <motion.div
            key="details"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                {application.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {application.name}
                </h3>
                <p className="text-gray-500">{application.gender}</p>
                <p className="text-gray-600 font-medium">
                  {application.jobTitle}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Email Address
                </h4>
                <a
                  href={`mailto:${application.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {application.email}
                </a>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Phone Number
                </h4>
                <a
                  href={`tel:${application.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {application.phone}
                </a>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Portfolio
                </h4>
                <a
                  href={application.portfolioLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {application.portfolioLink}
                </a>
              </div>
            </div>
          </motion.div>
        );
      case "coverNote":
        return (
          <motion.div
            key="coverNote"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-gray-50 p-6 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Cover Note
            </h3>
            <div className="prose prose-sm max-w-none text-gray-600">
              {application.coverNote.split("\n").map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </motion.div>
        );
      case "documents":
        return (
          <motion.div
            key="documents"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">Resume</h4>
                  <p className="text-sm text-gray-500">
                    View or download resume
                  </p>
                </div>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={application.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
                >
                  Open Resume
                </motion.a>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">Cover Letter</h4>
                  <p className="text-sm text-gray-500">
                    View or download cover letter
                  </p>
                </div>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={application.coverLetterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
                >
                  Open Cover Letter
                </motion.a>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-orange-600 to-yellow-800 px-6 py-4 flex items-center justify-between">
              <h2 className="text-white text-lg font-bold">
                Application Details
              </h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="rounded-full bg-white bg-opacity-20 p-1 text-white hover:bg-opacity-30 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </div>
            <div className="flex space-x-2 px-6 py-4 border-b">
              <TabButton tab="details" label="Details" />
              <TabButton tab="coverNote" label="Cover Note" />
              <TabButton tab="documents" label="Documents" />
            </div>
            <div className="px-6 py-6 overflow-auto max-h-[calc(90vh-150px)]">
              <AnimatePresence mode="wait">
                {renderTabContent()}
              </AnimatePresence>
            </div>
            <div className="border-t px-6 py-4 flex justify-end gap-3 bg-gray-50">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100"
              >
                Close
              </motion.button>
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowActionMenu(!showActionMenu)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
                >
                  Take Action
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform duration-200 ${
                      showActionMenu ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </motion.button>
                <AnimatePresence>
                  {showActionMenu && (
                    <motion.div
                      variants={actionMenuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden w-48"
                    >
                      <a
                        href={`tel:${application.phone}`}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors w-full text-left"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        Call Candidate
                      </a>
                      <a
                        href={`mailto:${application.email}`}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors w-full text-left"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        Email Candidate
                      </a>
                      <button
                        onClick={exportToExcel}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors w-full text-left"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Export to Excel
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JobApplicationModal;
