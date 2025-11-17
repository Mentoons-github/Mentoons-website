import { Mail, User, Building2, Edit2, Key } from "lucide-react";
import { EmployeeInterface } from "@/types/employee";

interface Props {
  employee: EmployeeInterface;
  onOpenPicture: () => void;
  onEditClick: () => void;
  onRequestPermission: () => void;
  sendingRequest: boolean;
  canEdit: boolean;
}

const EmployeeProfileHeader = ({
  employee,
  onOpenPicture,
  onEditClick,
  onRequestPermission,
  sendingRequest,
  canEdit,
}: Props) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
      <div className="relative">
        <button
          onClick={onOpenPicture}
          className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl"
        >
          <div className="w-40 h-40 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-5xl font-bold shadow-lg ring-8 ring-white overflow-hidden">
            {employee.user.picture ? (
              <img
                src={employee.user.picture}
                alt="Profile"
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              employee.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
            )}
          </div>
        </button>
        <div
          className={`absolute -bottom-2 -right-2 px-4 py-1 rounded-full text-sm font-semibold shadow-lg ${
            employee.active
              ? "bg-green-500 text-white"
              : "bg-gray-500 text-white"
          }`}
        >
          {employee.active ? "Active" : "Inactive"}
        </div>
      </div>

      {/* Info + Buttons */}
      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              {employee.user.name}
            </h1>
            <p className="text-xl text-gray-600">{employee.jobRole}</p>
            <div className="flex flex-wrap gap-3 mt-2">
              <span className="flex items-center gap-2 text-gray-600">
                <Mail size={18} /> {employee.user.email}
              </span>
              <span className="flex items-center gap-2 text-gray-600">
                <User size={18} /> {employee.user.gender}
              </span>
              <span className="flex items-center gap-2 text-gray-600">
                <Building2 size={18} /> {employee.department || "N/A"}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            {canEdit ? (
              <button
                onClick={onEditClick}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                <Edit2 size={20} /> Edit Profile
              </button>
            ) : (
              <button
                disabled={sendingRequest}
                onClick={onRequestPermission}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-lg transition-all ${
                  sendingRequest
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-yellow-600 text-white hover:bg-yellow-700"
                }`}
              >
                <Key size={20} />{" "}
                {sendingRequest ? "Sending…" : "Request Permission"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfileHeader;
