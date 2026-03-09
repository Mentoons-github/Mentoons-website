import { JobData } from "@/types/admin";
import { X } from "lucide-react";

interface ModalProps {
  onClose: () => void;
  data: JobData;
}

const AdminViewJobModal = ({ onClose, data }: ModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 md:p-6 overflow-y-auto">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b bg-gray-50">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {data.jobTitle}
            </h2>

            <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
              {data.location && (
                <span className="px-3 py-1 bg-gray-200 rounded-full">
                  📍 {data.location}
                </span>
              )}

              {data.jobType && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {data.jobType}
                </span>
              )}

              {data.status && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  {data.status}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 grid md:grid-cols-3 gap-8 max-h-[80vh] overflow-y-auto">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                Job Description
              </h3>
              <p className="text-gray-600 whitespace-pre-line">
                {data.jobDescription}
              </p>
            </div>

            {data.responsibilities && data.responsibilities.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                  Responsibilities
                </h3>

                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  {data.responsibilities.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.requirements && data.requirements.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                  Requirements
                </h3>

                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  {data.requirements.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.whatWeOffer && data.whatWeOffer.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                  What We Offer
                </h3>

                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  {data.whatWeOffer.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {data.thumbnail && typeof data.thumbnail === "string" && (
              <div>
                <img
                  src={data.thumbnail}
                  alt="Job Thumbnail"
                  className="w-full h-40 object-cover rounded-lg border"
                />
              </div>
            )}

            {data.skillsRequired && data.skillsRequired.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Skills Required
                </h3>

                <div className="flex flex-wrap gap-2">
                  {data.skillsRequired.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Application Sources */}
            {data.applicationSource && data.applicationSource.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Application Sources
                </h3>

                <div className="flex flex-wrap gap-2">
                  {data.applicationSource.map((source, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Application Count */}
            {data.applicationCount !== undefined && (
              <div className="border rounded-xl p-4 bg-gray-50">
                <p className="text-sm text-gray-500">Applications</p>
                <p className="text-xl font-bold text-gray-800">
                  {data.applicationCount}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminViewJobModal;
