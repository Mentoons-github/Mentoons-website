import { X } from "lucide-react";

interface EmployeePermissionModalProps {
  onClose: () => void;
}

const EmployeePermissionModal = ({ onClose }: EmployeePermissionModalProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Request Permission</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>
      <p className="text-gray-600 mb-6">
        A permission request to edit your profile has been sent to your
        supervisor. You will be notified once approval is granted.
      </p>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default EmployeePermissionModal;
