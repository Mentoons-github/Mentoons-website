import { FaCheck, FaSpinner, FaTimes } from "react-icons/fa";

interface SubmissionStatus {
  isSubmitting: boolean;
  currentStep: "uploading" | "saving" | "success" | "error" | "Requesting";
  message: string;
  error?: string;
}

interface SubmissionModalProps {
  submissionStatus: SubmissionStatus;
  closeSubmissionModal: () => void;
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({
  submissionStatus,
  closeSubmissionModal,
}) => {
  if (
    !submissionStatus.isSubmitting &&
    submissionStatus.currentStep !== "success" &&
    submissionStatus.currentStep !== "error"
  ) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 sm:p-10 text-center transform transition-all">
        {submissionStatus.currentStep === "uploading" && (
          <>
            <div className="mb-6">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                <FaSpinner className="w-10 h-10 text-blue-500 animate-spin" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {submissionStatus.message.includes("Deleting")
                ? "Deleting Image"
                : "Uploading Image"}
            </h3>
            <p className="text-base text-gray-600 leading-relaxed">
              {submissionStatus.message}
            </p>
          </>
        )}

        {submissionStatus.currentStep === "saving" && (
          <>
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <FaSpinner className="w-10 h-10 text-green-500 animate-spin" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Processing
            </h3>
            <p className="text-base text-gray-600 leading-relaxed">
              {submissionStatus.message}
            </p>
          </>
        )}

        {submissionStatus.currentStep === "success" && (
          <>
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <FaCheck className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-3">Success!</h3>
            <p className="text-base text-gray-700 leading-relaxed mb-8">
              {submissionStatus.message}
            </p>
            <button
              onClick={closeSubmissionModal}
              className="w-full px-6 py-3.5 text-base font-semibold bg-green-500 text-white rounded-xl hover:bg-green-600 active:scale-95 transition-all shadow-lg hover:shadow-xl"
            >
              Close
            </button>
          </>
        )}

        {submissionStatus.currentStep === "error" && (
          <>
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <FaTimes className="w-10 h-10 text-red-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-red-800 mb-3">
              Oops! Something Went Wrong
            </h3>
            <p className="text-base text-gray-700 leading-relaxed mb-3">
              {submissionStatus.message}
            </p>
            {submissionStatus.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-700 font-medium">
                  {submissionStatus.error}
                </p>
              </div>
            )}
            <button
              onClick={closeSubmissionModal}
              className="w-full px-6 py-3.5 text-base font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600 active:scale-95 transition-all shadow-lg hover:shadow-xl"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SubmissionModal;
