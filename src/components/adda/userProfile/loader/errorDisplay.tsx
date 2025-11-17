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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            X
          </button>
        )}
        <div className="p-8 text-center">
          <div className="mb-6">Error Icon</div>
          <h2 className="text-xl font-semibold text-red-600 mb-3">{message}</h2>
          {description && <p className="text-gray-600">{description}</p>}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
