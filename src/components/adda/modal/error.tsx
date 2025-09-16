import { NavLink } from "react-router-dom";
import { useEffect, useRef } from "react";

interface ErrorModalInterface {
  isOpen: boolean;
  onClose: () => void;
  error: string;
  action: "nav" | "retry" | "custom";
  link?: string;
  actionText?: string;
  onAction?: () => void;
}

const ErrorModal = ({
  isOpen,
  onClose,
  error,
  action,
  link = "",
  actionText = "Take Action",
  onAction,
}: ErrorModalInterface) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/25 flex items-center justify-center z-50"
      role="dialog"
      aria-labelledby="error-modal-title"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <h1
          id="error-modal-title"
          className="text-lg font-semibold text-red-600 mb-4"
        >
          Please fill your details
        </h1>
        <p className="text-sm text-gray-700 mb-6">{error}</p>
        <div className="flex justify-end gap-4">
          {action === "nav" && link && (
            <NavLink
              to={link}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded hover:bg-orange-700"
              onClick={onClose}
            >
              {actionText}
            </NavLink>
          )}
          {action === "retry" && (
            <button
              onClick={() => {
                if (onAction) onAction();
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              {actionText}
            </button>
          )}
          {action === "custom" && onAction && (
            <button
              onClick={() => {
                onAction();
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
            >
              {actionText}
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
