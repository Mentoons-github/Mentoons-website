import React, { useEffect, useRef } from "react";

import { IoClose } from "react-icons/io5";
interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  message,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[999999] bg-black/40 backdrop-blur-sm px-4">
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 md:p-10 text-center animate-[fadeIn_.3s_ease]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center
        rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <IoClose className="text-xl text-gray-700" />
        </button>

        <div className="flex justify-center mb-6">
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 shadow-inner">
            <img
              src="/assets/modals/check-verified.svg"
              alt="Verified"
              className="w-10 h-10"
            />

            <div className="absolute inset-0 rounded-full bg-orange-200 blur-xl opacity-40"></div>
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          Thank You!
        </h2>

        <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
          {message}
        </p>

        <div className="mt-8">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-xl text-white font-semibold
          bg-gradient-to-r from-orange-400 to-orange-500
          hover:from-orange-500 hover:to-orange-600
          shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnquiryModal;
