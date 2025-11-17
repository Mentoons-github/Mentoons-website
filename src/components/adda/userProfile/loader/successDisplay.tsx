import React from "react";
import { CheckCircle, X } from "lucide-react";

interface SuccessDisplayProps {
  message: string;
  description?: string;
  onClose?: () => void;
}

const SuccessDisplay: React.FC<SuccessDisplayProps> = ({
  message,
  description,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-[1000]">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close Button - Always visible if onClose exists */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-50 bg-white rounded-full p-1 shadow-md"
          >
            <X size={18} />
          </button>
        )}

        <div className="p-8 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <CheckCircle
              size={64}
              className="relative mx-auto text-green-500 drop-shadow-lg animate-bounce"
              style={{ animationDuration: "2s", animationIterationCount: "3" }}
            />
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            {message}
          </h2>
          {description && (
            <p className="text-gray-600 leading-relaxed mb-6">{description}</p>
          )}

          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessDisplay;
