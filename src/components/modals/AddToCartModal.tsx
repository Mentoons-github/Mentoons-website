import React, { useEffect, useRef } from "react";
import { X, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({
  isOpen,
  onClose,
  productName,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleViewCart = () => {
    onClose();
    navigate("/cart"); // Uncomment when using with React Router
  };

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      style={{
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <Sparkles className="w-4 h-4 text-yellow-300 opacity-30" />
          </div>
        ))}
      </div>

      <div
        ref={modalRef}
        className={`relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-500 ${
          isOpen ? "scale-100 rotate-0" : "scale-95 rotate-3"
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        {/* Decorative top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500"></div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-110 group"
        >
          <X className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
        </button>

        <div className="px-8 py-8">
          {/* Success icon with animation */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-200 to-orange-200 flex items-center justify-center shadow-lg">
                <img
                  src="/assets/modals/check-verified.svg"
                  alt="Verified check"
                  className="w-8 h-8 object-contain animate-pulse"
                />
              </div>
              {/* Subtle ripple effect */}
              <div className="absolute inset-0 rounded-full bg-orange-300 opacity-20 animate-ping"></div>
            </div>
          </div>

          {/* Hooray Image */}
          <div className="flex justify-center mb-6">
            <img
              src="/assets/modals/hooray.png"
              alt="Hooray celebration"
              className="w-48 h-auto object-contain transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Characters Image */}
          <div className="flex justify-center mb-8">
            <img
              src="/assets/modals/klementAndToonla.png"
              alt="Klement and Toonla characters"
              className="w-56 h-auto object-contain transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Success message */}
          <div className="text-center mb-8">
            <p className="text-xl text-gray-700 leading-relaxed">
              Hey we have added{" "}
              <span className="font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                {productName}
              </span>{" "}
              in your cart.
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={handleViewCart}
              className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold text-lg rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-300"
            >
              View Cart
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Decorative bottom element */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 opacity-50"></div>
      </div>
    </div>
  );
};

export default AddToCartModal;
