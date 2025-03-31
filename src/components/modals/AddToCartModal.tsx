import React, { useEffect, useRef } from "react";

import { IoClose } from "react-icons/io5";
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
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // Close on escape key press
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

  const handleClick = () => {
    onClose();
  };
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999999] "
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-[600px] py-10 pb-8"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center items-center  relative  ">
          <div className="bg-[#FFD9AA] flex items-center justify-center p-4 rounded-full">
            <img
              src="/assets/modals/check-verified.svg"
              alt="Verifed check"
              className="w-10 h-10 object-cover "
            />
          </div>
          <button
            onClick={onClose}
            className="text-4xl text-nuetral-700 text-neutral-700 bg-white shadow-md p-1 rounded-lg absolute top-0 right-0"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        <div className="flex items-center justify-center pt-4">
          <img
            src="/assets/modals/hooray.png"
            alt="thankyou"
            className="w-[60%] object-cover "
          />
        </div>
        <div className="flex items-center justify-center pt-6 ">
          <img
            src="/assets/modals/klementAndToonla.png"
            alt="thankyou"
            className="w-[60%] object-cover "
          />
        </div>

        <div className="w-[80%] mx-auto text-neutral-600 font-normal  text-xl text-center leading-2 ">
          <p>
            Hey we have added{" "}
            <span className="text-neutral-800 font-bold">{productName}</span> in
            your cart.
          </p>
        </div>

        <div
          onClick={handleClick}
          className="w-full py-4 flex items-center justify-center bg-[#EC9600] text-white font-bold text-xl mt-6 rounded-xl"
        >
          View Cart
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
