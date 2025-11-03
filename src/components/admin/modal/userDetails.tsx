import React, { useState } from "react";
import {
  X,
  MapPin,
  Calendar,
  Users,
  UserCheck,
  Globe,
  Clock,
  Crown,
  AlertTriangle,
  Mail,
  FileText,
  Briefcase,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { User } from "@/types";
import { FaRupeeSign, FaUser } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getEmployees } from "@/redux/admin/employee/api";
import { handleProfileEdit } from "@/redux/admin/admin/adminApi";
import { errorToast, successToast } from "@/utils/toastResposnse";
import { Employee } from "@/types/employee";
import { formatDateTime, formatDate } from "@/utils/formateDate";
import {
  getRoleColor,
  getSocialColor,
  getSubscriptionStatusColor,
} from "@/utils/task/admin/taskUtils";
import { useAuth } from "@clerk/clerk-react";

interface DetailsModalProps {
  item: User | Employee | null;
  itemType: "user" | "product" | "enquiry" | "employee" | "job" | "meetups";
  onClose: () => void;
  sortOrder?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

const DetailsModal: React.FC<DetailsModalProps> = ({
  item,
  itemType,
  onClose,
  sortOrder = "asc",
  searchTerm = "",
  page = 1,
  limit = 10,
}) => {
  console.log("Modal item:", item);
  const dispatch = useDispatch<AppDispatch>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionStatus, setActionStatus] = useState<{
    status: "success" | "error" | null;
    message: string;
  }>({ status: null, message: "" });
  const { getToken } = useAuth();

  if (!item) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleProfileEditRequest = async (action: "approve" | "reject") => {
    const token = await getToken();
    if (!token) return;
    if (itemType !== "employee" || !("profileEditRequest" in item)) return;

    setIsProcessing(true);
    setActionStatus({ status: null, message: "" });

    try {
      const resultAction = await dispatch(
        handleProfileEdit({
          token,
          action: action === "approve" ? "approved" : "rejected",
          employeeId: item._id ?? "",
        })
      );

      if (handleProfileEdit.fulfilled.match(resultAction)) {
        const successMessage =
          action === "approve"
            ? "Profile edit request approved successfully"
            : "Profile edit request rejected successfully";

        successToast(successMessage);
        setActionStatus({ status: "success", message: successMessage });

        await dispatch(getEmployees({ sortOrder, searchTerm, page, limit }));

        setTimeout(() => onClose(), 1500);
      } else {
        const errorMessage =
          resultAction.payload ||
          "Failed to process profile edit request. Please try again.";
        errorToast(errorMessage);
        setActionStatus({ status: "error", message: errorMessage });
      }
    } catch (error) {
      console.error("Error handling profile edit request:", error);
      errorToast("An unexpected error occurred");
      setActionStatus({
        status: "error",
        message: "An unexpected error occurred",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Cover Image */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            {itemType === "user" && "coverImage" in item && item.coverImage ? (
              <img
                src={item.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="https://placehold.co/1200x192"
                alt="No cover image"
                className="w-full h-full object-cover opacity-50"
              />
            )}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Section */}
          <div className="relative px-6 pb-6">
            {/* Profile Picture */}
            <div className="flex items-start justify-between -mt-16 mb-6">
              <div className="relative">
                {itemType === "user" && "picture" in item && item.picture ? (
                  <img
                    src={item.picture}
                    alt={item.name || "Unknown"}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : itemType === "employee" &&
                  "profilePicture" in item &&
                  item.profilePicture ? (
                  <img
                    src={item.profilePicture}
                    alt={item.name || "Unknown"}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                    {getInitials(item.name || "Unknown")}
                  </div>
                )}
                {itemType === "user" &&
                  "isBlocked" in item &&
                  item.isBlocked && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                  )}
              </div>
            </div>

            {/* Item Info */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {item.name || "Unknown"}
                  </h1>
                  {itemType === "user" && "role" in item && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                        item.role!
                      )}`}
                    >
                      {item.role}
                    </span>
                  )}
                  {itemType === "user" &&
                    "isBlocked" in item &&
                    item.isBlocked && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        Blocked
                      </span>
                    )}
                  {itemType === "employee" && "status" in item && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "Active"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-red-100 text-red-800 border-red-200"
                      }`}
                    >
                      {item.status as string}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {item.email || "N/A"}
                </p>
              </div>

              {/* Profile Edit Request */}
              {itemType === "employee" &&
                "profileEditRequest" in item &&
                item.profileEditRequest?.status === "pending" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-yellow-700 uppercase tracking-wide mb-2">
                      Pending Profile Edit Request
                    </h3>
                    <p className="text-gray-600 mb-4">
                      A profile edit request is pending for this employee,
                      submitted on{" "}
                      {formatDate(item.profileEditRequest.requestedAt)}. Review
                      and take action.
                    </p>
                    {actionStatus.status && (
                      <p
                        className={`text-sm mb-4 ${
                          actionStatus.status === "success"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {actionStatus.message}
                      </p>
                    )}
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleProfileEditRequest("approve")}
                        disabled={
                          isProcessing || actionStatus.status === "success"
                        }
                        className={`flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ${
                          isProcessing || actionStatus.status === "success"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleProfileEditRequest("reject")}
                        disabled={
                          isProcessing || actionStatus.status === "success"
                        }
                        className={`flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${
                          isProcessing || actionStatus.status === "success"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

              {/* Bio for User */}
              {itemType === "user" && "bio" in item && item.bio && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                    About
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.bio}</p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal/Employee Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    {itemType === "user"
                      ? "Personal Details"
                      : "Employee Details"}
                  </h3>

                  {/* === ONLY FOR EMPLOYEE === */}
                  {itemType === "employee" &&
                    "dateOfBirth" in item &&
                    item.dateOfBirth && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Born {formatDate(item.dateOfBirth)}</span>
                      </div>
                    )}

                  {itemType === "employee" &&
                    "joinDate" in item &&
                    item.joinDate && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <FaUser className="w-4 h-4" />
                        <span>Joined {formatDate(item.joinDate)}</span>
                      </div>
                    )}

                  {/* === USER FIELDS (unchanged) === */}
                  {itemType === "user" &&
                    "location" in item &&
                    item.location && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{item.location}</span>
                      </div>
                    )}

                  {itemType === "user" &&
                    "joinedDate" in item &&
                    item.joinedDate && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <FaUser className="w-4 h-4" />
                        <span>Joined {formatDate(item.joinedDate)}</span>
                      </div>
                    )}

                  {itemType === "user" &&
                    "lastActive" in item &&
                    item.lastActive && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          Last active {formatDateTime(item.lastActive)}
                        </span>
                      </div>
                    )}

                  {/* === EMPLOYEE FIELDS (below DOB & Join Date) === */}
                  {itemType === "employee" && "department" in item && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      <span>Department: {item.department}</span>
                    </div>
                  )}

                  {itemType === "employee" && "jobRole" in item && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      <span>Job Role: {item.jobRole as string}</span>
                    </div>
                  )}

                  {itemType === "employee" && "salary" in item && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaRupeeSign className="w-4 h-4" />
                      <span>Salary: ₹{item.salary.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Stats for User */}
                {itemType === "user" &&
                  "posts" in item &&
                  "followers" in item &&
                  "following" in item && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Statistics
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center justify-center mb-1">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="text-xl font-bold text-blue-600">
                            {item.posts?.length || 0}
                          </div>
                          <div className="text-xs text-blue-600">Posts</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center justify-center mb-1">
                            <Users className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="text-xl font-bold text-green-600">
                            {item.followers?.length || 0}
                          </div>
                          <div className="text-xs text-green-600">
                            Followers
                          </div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="flex items-center justify-center mb-1">
                            <UserCheck className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="text-xl font-bold text-purple-600">
                            {item.following?.length || 0}
                          </div>
                          <div className="text-xs text-purple-600">
                            Following
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>

              {/* Social Links for User */}
              {itemType === "user" &&
                "socialLinks" in item &&
                item.socialLinks &&
                Object.keys(item.socialLinks).length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Social Links
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(item.socialLinks).map(
                        ([platform, url]) =>
                          url && (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${getSocialColor(
                                platform
                              )}`}
                            >
                              {platform === "facebook" && (
                                <Globe className="w-4 h-4" />
                              )}
                              {platform === "twitter" && (
                                <X className="w-4 h-4" />
                              )}
                              {platform === "instagram" && (
                                <Globe className="w-4 h-4" />
                              )}
                              {platform === "linkedin" && (
                                <Globe className="w-4 h-4" />
                              )}
                              {platform === "website" && (
                                <Globe className="w-4 h-4" />
                              )}
                              <span className="text-sm capitalize">
                                {platform}
                              </span>
                            </a>
                          )
                      )}
                    </div>
                  </div>
                )}

              {/* Subscription Details for User */}
              {itemType === "user" &&
                "subscription" in item &&
                item.subscription && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Subscription
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Crown className="w-4 h-4" />
                        <span>Plan: {item.subscription.plan}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getSubscriptionStatusColor(
                            item.subscription.status
                          )}`}
                        >
                          Status: {item.subscription.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Started: {formatDate(item.subscription.startDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Valid Until:{" "}
                          {formatDate(item.subscription.validUntil)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
