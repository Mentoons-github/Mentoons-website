import { X } from "lucide-react";

interface EmployeeProfilePictureModalProps {
  picture: string | null | undefined;
  name: string;
  onClose: () => void;
}

const EmployeeProfilePictureModal = ({
  picture,
  name,
  onClose,
}: EmployeeProfilePictureModalProps) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity"
    onClick={onClose}
  >
    <div
      className="relative bg-white rounded-2xl overflow-hidden max-w-4xl w-full mx-4"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
        aria-label="Close"
      >
        <X size={24} />
      </button>

      {picture ? (
        <img
          src={picture}
          alt="Full size profile"
          className="max-w-full max-h-[90vh] object-contain w-full h-auto"
        />
      ) : (
        <div className="w-96 h-96 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-8xl font-bold mx-auto">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
      )}
    </div>
  </div>
);

export default EmployeeProfilePictureModal;
