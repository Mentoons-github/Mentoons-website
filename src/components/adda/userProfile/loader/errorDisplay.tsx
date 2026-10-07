interface ErrorDisplayProps {
  message: string;
  description?: string;
  onClose?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  description,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-[100]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden relative">
        {/* Close Button - Now Working */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all text-xl z-10"
            aria-label="Close error modal"
          >
            ✕
          </button>
        )}

        <div className="p-10 text-center">
          <div className="mx-auto mb-6 w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-5xl">
            ⚠️
          </div>

          <h2 className="text-2xl font-semibold text-red-600 mb-4">
            {message}
          </h2>

          {description && (
            <p className="text-gray-600 text-[15.5px] leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Bottom Action Button */}
        {onClose && (
          <div className="border-t border-gray-100 px-8 py-5 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
