import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  subscriptionType: string;
  status?: string;
  renewalDate?: string;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  open,
  onClose,
  subscriptionType,
  status = "Unknown",
}) => {
  const renewalDate = new Date();
  renewalDate.setFullYear(renewalDate.getFullYear() + 1);
  const navigate = useNavigate();
  const { user } = useUser();
  const formattedRenewalDate = renewalDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    const updateMembership = async () => {
      if (status.toLowerCase() === "success" && user) {
        try {
          const userv = await user.update({
            publicMetadata: {
              membershipType: subscriptionType.toLowerCase(),
            },
          } as any);
          console.log("membershipUpdated : ", userv);
        } catch (error) {
          console.error("Error updating membership:", error);
        }
      }
    };

    updateMembership();
  }, [status, user]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (open && e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [open, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    navigate("/");
    onClose();
  };

  if (!open) return null;

  const getSubscriptionColor = () => {
    switch (subscriptionType.toLowerCase()) {
      case "prime":
        return "bg-gradient-to-r from-rose-500 to-pink-600";
      case "platinum":
        return "bg-gradient-to-r from-gray-300 to-gray-500";
      default:
        return "bg-gradient-to-r from-gray-700 to-gray-900";
    }
  };

  const getStatusInfo = () => {
    switch (status.toUpperCase()) {
      case "Success":
        return {
          statusText: "Active",
          statusColor: "text-green-600 dark:text-green-500",
          dotColor: "bg-green-500",
          headerText: `${subscriptionType.toUpperCase()} SUBSCRIPTION`,
          subHeaderText: "Active subscription",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ),
          showRenewalDate: true,
          showPaymentMethod: true,
          showManageButton: true,
        };
      case "Cancelled":
      case "CANCELED":
        return {
          statusText: "Cancelled",
          statusColor: "text-gray-600 dark:text-gray-400",
          dotColor: "bg-gray-500",
          headerText: `${subscriptionType.toUpperCase()} SUBSCRIPTION`,
          subHeaderText: "Subscription cancelled",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          ),
          showRenewalDate: false,
          showPaymentMethod: false,
          showManageButton: false,
        };
      case "Aborted":
        return {
          statusText: "Aborted",
          statusColor: "text-amber-600 dark:text-amber-500",
          dotColor: "bg-amber-500",
          headerText: `${subscriptionType.toUpperCase()} SUBSCRIPTION`,
          subHeaderText: "Subscription attempt aborted",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ),
          showRenewalDate: false,
          showPaymentMethod: false,
          showManageButton: false,
        };
      case "Failure":
      case "ERROR":
      case "Invalid":
        return {
          statusText: "Failed",
          statusColor: "text-red-600 dark:text-red-500",
          dotColor: "bg-red-500",
          headerText: `${subscriptionType.toUpperCase()} SUBSCRIPTION`,
          subHeaderText: "Subscription payment failed",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          ),
          showRenewalDate: false,
          showPaymentMethod: false,
          showManageButton: false,
        };
      case "Unknown":
      default:
        return {
          statusText: "Unknown",
          statusColor: "text-blue-600 dark:text-blue-500",
          dotColor: "bg-blue-500",
          headerText: `${subscriptionType.toUpperCase()} SUBSCRIPTION`,
          subHeaderText: "Subscription status pending",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          ),
          showRenewalDate: false,
          showPaymentMethod: false,
          showManageButton: false,
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden w-full max-w-md transform transition-all">
        <div className={`${getSubscriptionColor()} px-6 py-4 text-white`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{statusInfo.headerText}</h2>
            <div className="bg-white bg-opacity-20 p-1 rounded-full">
              {statusInfo.icon}
            </div>
          </div>
          <p className="text-sm opacity-90 mt-1">{statusInfo.subHeaderText}</p>
        </div>

        <div className="px-6 py-5 text-left">
          <div className="space-y-4">
            {statusInfo.showRenewalDate && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Next renewal
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formattedRenewalDate}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <div className="flex items-center mt-1">
                <span
                  className={`h-2 w-2 rounded-full ${statusInfo.dotColor} mr-2`}
                ></span>
                <p className={`font-medium ${statusInfo.statusColor}`}>
                  {statusInfo.statusText}
                </p>
              </div>
            </div>

            {statusInfo.showPaymentMethod && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Payment method
                </p>
                <div className="flex items-center mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path
                      fillRule="evenodd"
                      d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="font-medium text-gray-900 dark:text-white">
                    •••• •••• •••• 4242
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-800 dark:bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-700 dark:hover:bg-gray-800 transition shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
