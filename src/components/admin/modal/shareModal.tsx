import { X, Loader2 } from "lucide-react";

interface ShareModalProps {
  response?: { message: string; success: boolean } | null;
  onClose: () => void;
  onShare: () => void;
  isLoading: boolean;
}

const ShareModal = ({
  response,
  onClose,
  onShare,
  isLoading,
}: ShareModalProps) => {
  const hasResponse = !!response;
  const isSuccess = response?.success ?? false;
  const message = response?.message ?? "";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Close modal"
          disabled={isLoading}
        >
          <X size={24} />
        </button>

        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-5 pr-10">
            {hasResponse
              ? isSuccess
                ? "Success"
                : "Failed"
              : "Forward Application to Super Admin"}
          </h2>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Sending application details...</p>
            </div>
          ) : hasResponse ? (
            <div className="space-y-6 text-center">
              <div
                className={`p-5 rounded-lg border ${
                  isSuccess
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                <p className="text-lg font-medium">{message}</p>
              </div>

              <button
                onClick={onClose}
                className="px-10 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors w-full sm:w-auto"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-600 leading-relaxed mb-8">
                Are you sure you want to share this candidate’s resume and
                application details with the administrator?
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-end">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className={`px-10 py-3 text-white font-medium rounded-lg transition-colors min-w-[140px] ${
                    isLoading
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  Cancel
                </button>

                <button
                  onClick={onShare}
                  disabled={isLoading}
                  className={`px-10 py-3 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors min-w-[140px] ${
                    isLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                  {isLoading ? "Sending..." : "Send"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
