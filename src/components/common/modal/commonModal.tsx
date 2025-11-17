import { X } from "lucide-react";

interface CommonModalProps {
  values: any;
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

const CommonModal = ({ values, isOpen, onClose }: CommonModalProps) => {
  if (!isOpen) return null;

  const renderValue = (data: any): React.ReactNode => {
    if (Array.isArray(data)) {
      return (
        <ul className="list-disc space-y-2 ml-4">
          {data.map((value, i) => (
            <li key={i} className="text-gray-700 text-sm">
              {typeof value === "object" ? renderValue(value) : String(value)}
            </li>
          ))}
        </ul>
      );
    }

    if (typeof data === "object" && data !== null) {
      return (
        <div className="space-y-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
          {Object.entries(data).map(([k, v]) => (
            <div key={k} className="border-l-2 border-blue-500 pl-3">
              <div className="font-semibold text-gray-800 capitalize text-sm">
                {k.replace(/([A-Z])/g, " $1").trim()}
              </div>
              <div className="mt-1 text-gray-600 text-sm">{renderValue(v)}</div>
            </div>
          ))}
        </div>
      );
    }

    return <span className="text-gray-700 text-sm">{String(data)}</span>;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-gray-100">
          <button
            onClick={() => onClose(false)}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Data Details
            </h1>
            <p className="text-gray-500 text-sm mt-1">View your information</p>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center text-base">
              <svg
                className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Data Overview
            </h4>
            <div className="overflow-x-auto">{renderValue(values)}</div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={() => onClose(false)}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors font-medium text-sm"
            >
              Close
            </button>
            <button
              disabled
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium opacity-50 cursor-not-allowed text-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonModal;
