import { RootState } from "@/redux/store";
import { Upload, Check, X } from "lucide-react";
import { useSelector } from "react-redux";

const ProgressBarUpload = () => {
  const { loading, progress, success, error, file } = useSelector(
    (state: RootState) => state.fileUpload
  );

  const getStatus = () => {
    if (success) return "success";
    if (error) return "error";
    if (loading) return "uploading";
    return "idle";
  };

  const status = getStatus();
  const isUploading = loading;

  const fileName = file
    ? typeof file === "string"
      ? "File"
      : file.name
    : "File";

  if (!isUploading && status !== "success" && status !== "error") {
    return null;
  }

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-orange-500";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "success":
        return "Upload complete!";
      case "error":
        return error || "Upload failed";
      default:
        return `Uploading ${fileName}...`;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <Check className="w-4 h-4 text-green-600" />;
      case "error":
        return <X className="w-4 h-4 text-red-600" />;
      default:
        return <Upload className="w-4 h-4 text-orange-600 animate-pulse" />;
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-8xl mx-auto px-3 sm:px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">{getStatusIcon()}</div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-gray-700 truncate">
                {getStatusText()}
              </p>
              <span className="text-xs font-semibold text-gray-600 ml-2">
                {status === "uploading" ? `${Math.round(progress)}%` : ""}
              </span>
            </div>

            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ease-out ${getStatusColor()}`}
                style={{
                  width: `${
                    status === "success"
                      ? 100
                      : status === "error"
                      ? 100
                      : progress
                  }%`,
                }}
              >
                {status === "uploading" && (
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default ProgressBarUpload;
