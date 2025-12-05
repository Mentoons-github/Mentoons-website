import React from "react";

interface ProgressModalProps {
  isOpen: boolean;
  type: "compress" | "upload" | "submit" | "progress";
  message?: string;
  progress?: {
    current: number;
    total: number;
  };
}

const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  type,
  message,
  progress,
}) => {
  if (!isOpen) return null;

  const getContent = () => {
    switch (type) {
      case "compress": {
        return {
          icon: (
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
          ),
          title: "Compressing Images",
          description:
            message || "Please wait while we compress your images...",
          showProgress: !!progress && progress.total > 0,
        };
      }

      case "upload": {
        return {
          icon: (
            <div className="relative w-16 h-16">
              <svg
                className="w-16 h-16 text-blue-600 animate-bounce"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
          ),
          title: "Uploading Images",
          description: message || "Uploading your pictures, please wait...",
          showProgress: false,
        };
      }

      case "submit": {
        return {
          icon: (
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-green-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
          ),
          title: "Submitting Form",
          description: message || "Submitting your form, please wait...",
          showProgress: false,
        };
      }

      case "progress": {
        const percentage =
          progress && progress.total > 0
            ? Math.round((progress.current / progress.total) * 100)
            : 0;
        return {
          icon: (
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-blue-200"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 28}
                  strokeDashoffset={2 * Math.PI * 28 * (1 - percentage / 100)}
                  className="text-blue-600 transition-all duration-300"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-sm font-bold text-blue-600">
                {percentage}%
              </span>
            </div>
          ),
          title: "Processing",
          description: message || "Processing your files...",
          showProgress: true,
          percentage,
        };
      }

      default:
        return { icon: null, title: "", description: "", showProgress: false };
    }
  };

  const content = getContent();
  const percentage =
    (content as any).percentage ??
    (progress && progress.total > 0
      ? Math.round((progress.current / progress.total) * 100)
      : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-center mb-6">{content.icon}</div>
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-3">
          {content.title}
        </h3>
        <p className="text-gray-600 text-center mb-6">{content.description}</p>

        {content.showProgress && progress && progress.total > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span className="font-semibold">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 text-center">
              {progress.current} of {progress.total} completed
            </p>
          </div>
        )}

        {!content.showProgress && (
          <div className="flex justify-center gap-2 mt-6">
            <div
              className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressModal;
