import React, { useEffect, useRef } from "react";
import { BsCopy } from "react-icons/bs";
import {
  FaFacebook,
  FaLinkedinIn,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, link }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  // Close modal when clicking outside
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
  if (!isOpen) return null;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999999] "
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-[600px] absolute top-28 right-40 px-8 pb-8"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center ">
          <h2 className="text-2xl font-normal  text-neutral-700">
            Share with your friends!
          </h2>
          <button
            onClick={onClose}
            className="text-3xl  text-neutral-600 bg-white shadow-md p-2 rounded-lg"
          >
            <IoClose className="font-normal" />
          </button>
        </div>

        <p className="mt-6 text-gray-500 text-start text-xl font-normal">
          Share this link via
        </p>
        <div className="mt-3 flex space-x-3">
          <a
            href={`https://www.facebook.com/profile.php?id=100078693769495`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2  bg-blue-100 border border-blue-200 rounded-lg"
          >
            <FaFacebook className="text-blue-600 text-3xl " />
          </a>
          <a
            href={`https://wa.me/+919036033300`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2  bg-green-100  border border-green-200 rounded-lg"
          >
            <FaWhatsapp className="text-green-600 text-3xl" />
          </a>
          <a
            href={`https://www.linkedin.com/company/mentoons`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-blue-100 border border-blue-200 rounded-lg"
          >
            <FaLinkedinIn className="text-blue-500 text-3xl" />
          </a>

          <a
            href={`https://www.instagram.com/toonmentoons?igsh=aTZvejJqYWM4YmFq`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-rose-100 border border-rose-200 rounded-lg"
          >
            <FaInstagram className="text-rose-600 text-3xl" />
          </a>
          <a
            href={`https://youtube.com/@mentoons3544?si=4Nr6surjgZaLM0YS`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-red-100 border border-red-200 rounded-lg"
          >
            <FaYoutube className="text-red-600 text-3xl" />
          </a>
        </div>

        <p className="mt-8 text-gray-500 font-normal text-start">
          or copy link
        </p>
        <div className="mt-2 flex items-center border border-orange-500 p-1 rounded-lg">
          <input
            type="text"
            value={link}
            readOnly
            className="flex-1 text-gray-500  outline-none pl-3 font-normal"
          />
          <button
            onClick={copyToClipboard}
            className="ml-2 bg-orange-500 text-white px-4 py-2 rounded-lg flex gap-2 items-center"
          >
            <BsCopy />
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
