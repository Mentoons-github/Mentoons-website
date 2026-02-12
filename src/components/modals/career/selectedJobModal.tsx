import { motion } from "framer-motion";
import { TPOSITION } from "@/redux/careerSlice";
import { useState } from "react";
import AccordionSection from "./accordionSection";
import { X, Briefcase } from "lucide-react";
import Loader from "@/components/common/Loader";

interface SelectedJobModalProps {
  selectedJob: TPOSITION;
  onClose: () => void;
  onApply: (jobId: string) => void;
  isLoading: boolean;
  fetchError: string | null;
}

const SelectedJobModal = ({
  selectedJob,
  onClose,
  onApply,
  isLoading,
  fetchError,
}: SelectedJobModalProps) => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
        <div className="bg-white rounded-2xl p-12 max-w-md w-full text-center shadow-2xl">
          <Loader />
          <p className="mt-6 text-lg font-medium text-gray-700">
            Loading job details...
          </p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-red-100">
          <div className="text-red-500 text-6xl mb-6">!</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Failed to load job
          </h2>
          <p className="text-gray-600 mb-8">{fetchError}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300"
            >
              Close
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative max-w-2xl w-full rounded-2xl border border-gray-200 shadow-2xl bg-white overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="bg-gradient-to-br from-orange-50 to-white p-6 border-b border-gray-100">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-600" />
          </motion.button>

          <div className="flex items-start gap-4 mb-6">
            {selectedJob?.thumbnail ? (
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={selectedJob.thumbnail}
                alt={selectedJob.jobTitle}
                className="w-20 h-20 rounded-xl object-cover shadow-md border-2 border-white flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-md flex-shrink-0">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
            )}

            <div className="flex-1 pr-10">
              <h1 className="text-3xl font-semibold text-gray-900 leading-tight">
                {selectedJob?.jobTitle}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
              <span className="text-2xl font-bold text-orange-500 mb-1">
                {selectedJob.applicationCount ?? 0}
              </span>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Applications
              </p>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
              <span className="text-base font-semibold text-gray-800 mb-1">
                {selectedJob.jobType}
              </span>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Job Type
              </p>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
              <span className="text-base font-semibold text-gray-800 mb-1">
                {selectedJob.location}
              </span>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Location
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-3 overflow-y-auto flex-1">
          <AccordionSection
            title="Skills Required"
            isOpen={openSection === "skills"}
            onToggle={() => toggleSection("skills")}
          >
            <ul className="flex flex-wrap items-center justify-start gap-2">
              {selectedJob.skillsRequired.length > 0 &&
                selectedJob.skillsRequired.map((skill, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full text-sm text-white font-medium shadow-md hover:shadow-lg transition-shadow"
                  >
                    {skill}
                  </motion.li>
                ))}
            </ul>
          </AccordionSection>

          <AccordionSection
            title="Job Description"
            isOpen={openSection === "job-description"}
            onToggle={() => toggleSection("job-description")}
          >
            <div className="text-gray-700 leading-relaxed text-base">
              {selectedJob.jobDescription}
            </div>
          </AccordionSection>

          {selectedJob.requirements && selectedJob.requirements.length > 0 && (
            <AccordionSection
              title="Requirements"
              isOpen={openSection === "requirements"}
              onToggle={() => toggleSection("requirements")}
            >
              <ul className="text-gray-700 leading-relaxed text-base list-disc pl-6 space-y-2">
                {selectedJob.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </AccordionSection>
          )}

          {selectedJob.responsibilities &&
            selectedJob.responsibilities.length > 0 && (
              <AccordionSection
                title="Responsibilities"
                isOpen={openSection === "responsibilities"}
                onToggle={() => toggleSection("responsibilities")}
              >
                <ul className="text-gray-700 leading-relaxed text-base list-disc pl-6 space-y-2">
                  {selectedJob.responsibilities.map((res, i) => (
                    <li key={i}>{res}</li>
                  ))}
                </ul>
              </AccordionSection>
            )}

          {selectedJob.whatWeOffer && selectedJob.whatWeOffer.length > 0 && (
            <AccordionSection
              title="What we offer"
              isOpen={openSection === "what-we-offer"}
              onToggle={() => toggleSection("what-we-offer")}
            >
              <ul className="text-gray-700 leading-relaxed text-base list-disc pl-6 space-y-2">
                {selectedJob.whatWeOffer.map((offer, i) => (
                  <li key={i}>{offer}</li>
                ))}
              </ul>
            </AccordionSection>
          )}
        </div>

        <div className="flex items-center justify-center p-5 border-t border-gray-100 bg-gradient-to-br from-orange-50 to-white">
          <button
            onClick={() => onApply(selectedJob._id)}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 px-10 py-3.5 rounded-xl text-lg font-semibold text-white hover:shadow-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            Apply Now
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SelectedJobModal;
