import { BplVerificationTypes } from "@/types/workshopsV2/bplVerificationTypes";
import { X, CheckCircle, XCircle, Clock } from "lucide-react";
import { useState } from "react";

interface Props {
  onClose: () => void;
  data: BplVerificationTypes;
  updateStatus: (applicationId: string, status: string) => void;
}

const BplApplicationViewModal = ({ onClose, data, updateStatus }: Props) => {
  const [localStatus, setLocalStatus] = useState<
    "Approved" | "Rejected" | "Pending"
  >(data.status ?? "Pending");

  const statusConfig: Record<
    "Approved" | "Rejected" | "Pending",
    {
      color: string;
      icon: React.ReactNode;
    }
  > = {
    Approved: {
      color: "bg-green-50 text-green-700 border-green-200",
      icon: <CheckCircle className="w-5 h-5" />,
    },
    Rejected: {
      color: "bg-red-50 text-red-700 border-red-200",
      icon: <XCircle className="w-5 h-5" />,
    },
    Pending: {
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      icon: <Clock className="w-5 h-5" />,
    },
  };

  const currentStatus = statusConfig[localStatus];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">
            BPL Verification Application
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Status */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${currentStatus.color}`}
            >
              {currentStatus.icon}
              {localStatus}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard
              label="Ration Card Number"
              value={data.rationCardNumber}
            />
            <InfoCard label="Head of Family" value={data.headOfFamilyName} />
            <InfoCard label="Mobile Number" value={data.mobileNumber} />
            <InfoCard label="State" value={data.state} />
            <InfoCard label="District" value={data.district} />
          </div>

          {/* Document Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Uploaded Document
            </p>

            <a
              href={data.document}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm font-medium text-gray-700"
            >
              View Uploaded File
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        {localStatus === "Pending" && (
          <div className="flex justify-end gap-4 px-8 py-5 border-t border-gray-100 bg-gray-50">
            <button
              onClick={async () => {
                try {
                  await updateStatus(data._id as string, "Rejected");
                  setLocalStatus("Approved");
                } catch (error) {
                  console.error("Update failed");
                }
              }}
              className="px-5 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 font-medium hover:bg-red-100 transition"
            >
              Reject
            </button>

            <button
              onClick={async () => {
                try {
                  await updateStatus(data._id as string, "Approved");
                  setLocalStatus("Approved");
                } catch (error) {
                  console.error("Update failed");
                }
              }}
              className="px-5 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition shadow-sm"
            >
              Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
      {label}
    </p>
    <p className="text-gray-800 font-medium text-sm break-words">
      {value || "-"}
    </p>
  </div>
);

export default BplApplicationViewModal;
