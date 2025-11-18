import React, { useEffect, useState } from "react";
import {
  X,
  Calendar,
  Briefcase,
  Mail,
  CheckCircle,
  XCircle,
  Phone,
  IndianRupee,
  UserCheck,
  MapPin,
  Shield,
  Clock,
  Crown,
  Users,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getEmployees } from "@/redux/admin/employee/api";
import { handleProfileEdit } from "@/redux/admin/admin/adminApi";
import { errorToast, successToast } from "@/utils/toastResposnse";
import { formatDate } from "@/utils/formateDate";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

interface DetailsModalProps {
  item: any;
  itemType: "employee" | "user";
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
  const dispatch = useDispatch<AppDispatch>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionStatus, setActionStatus] = useState<{
    status: "success" | "error" | null;
    message: string;
  }>({ status: null, message: "" });
  const { getToken } = useAuth();
  const [employee, setEmployee] = useState<any>(null);

  useEffect(() => {
    if (itemType === "employee" && item?._id) {
      const fetchEmployee = async () => {
        try {
          const token = await getToken();
          const res = await axios.get(
            `${import.meta.env.VITE_PROD_URL}/employee/${item._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setEmployee(res.data.data.fullDetails || res.data.data);
        } catch (err) {
          setEmployee(item);
        }
      };
      fetchEmployee();
    }
  }, [item, itemType, getToken]);

  if (!item) return null;
  const data = itemType === "employee" ? employee || item : item;
  console.log(data)

  const handleProfileEditRequest = async (action: "approve" | "reject") => {
    const token = await getToken();
    if (!token || !data._id) return;

    setIsProcessing(true);
    setActionStatus({ status: null, message: "" });

    try {
      const result = await dispatch(
        handleProfileEdit({
          token,
          action: action === "approve" ? "approved" : "rejected",
          employeeId: data._id,
        })
      );

      if (handleProfileEdit.fulfilled.match(result)) {
        successToast(
          action === "approve"
            ? "Profile edit approved"
            : "Profile edit rejected"
        );
        setActionStatus({
          status: "success",
          message: action === "approve" ? "Approved" : "Rejected",
        });
        dispatch(getEmployees({ sortOrder, searchTerm, page, limit }));
        setTimeout(onClose, 1500);
      } else {
        const msg = result.payload || "Action failed";
        errorToast(msg);
        setActionStatus({ status: "error", message: msg });
      }
    } catch {
      errorToast("Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const isEmployee = itemType === "employee";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 h-40 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-20 mb-6">
            {data.picture ? (
              <img
                src={data.picture}
                alt={data.name}
                className="w-36 h-36 rounded-full object-cover shadow-2xl border-8 border-white ring-4 ring-blue-100 relative z-10"
              />
            ) : (
              <div className="w-36 h-36 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-2xl border-8 border-white ring-4 ring-blue-100 relative z-10">
                {getInitials(data.user?.name || data.name || "NA")}
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {data.user?.name || data.name}
              </h1>
              {isEmployee && data.jobRole && (
                <p className="text-lg text-gray-600 mb-2">{data.jobRole}</p>
              )}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                {isEmployee ? (
                  <>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        data.active
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {data.active ? "Active" : "Inactive"}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold border border-blue-200 shadow-sm">
                      {data.employmentType}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold border border-blue-200 shadow-sm">
                      {data.role}
                    </span>
                    {data.subscription?.plan && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${
                          data.subscription.plan === "free"
                            ? "bg-gray-100 text-gray-800 border-gray-200"
                            : "bg-purple-100 text-purple-800 border-purple-200"
                        }`}
                      >
                        <Crown className="w-3 h-3 inline mr-1" />
                        {data.subscription.plan.toUpperCase()}
                      </span>
                    )}
                    {data.isBlocked && (
                      <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold border border-red-200">
                        Blocked
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {isEmployee && data.profileEditRequest?.status === "pending" && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-4 mb-6 shadow-md">
              <div className="flex items-start gap-3 mb-3">
                <Clock className="w-5 h-5 text-amber-600 mt-1" />
                <div>
                  <h3 className="font-bold text-amber-900 mb-1">
                    Pending Profile Edit Request
                  </h3>
                  <p className="text-sm text-gray-700">
                    Requested on:{" "}
                    {formatDate(data.profileEditRequest.requestedAt)}
                  </p>
                </div>
              </div>
              {actionStatus.status && (
                <div
                  className={`mb-3 p-2 rounded-lg text-sm ${
                    actionStatus.status === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <p className="font-medium">{actionStatus.message}</p>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleProfileEditRequest("approve")}
                  disabled={isProcessing || actionStatus.status === "success"}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-md hover:shadow-lg"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleProfileEditRequest("reject")}
                  disabled={isProcessing || actionStatus.status === "success"}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-md hover:shadow-lg"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                {isEmployee ? "Employee Information" : "User Information"}
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 font-medium">Email</p>
                    <p className="text-sm text-gray-800 font-medium truncate">
                      {data.email}
                    </p>
                  </div>
                </div>

                {(data.phoneNumber || data.user?.phoneNumber) && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Phone</p>
                      <p className="text-sm text-gray-800 font-medium">
                        +91 {data.phoneNumber || data.user?.phoneNumber}
                      </p>
                    </div>
                  </div>
                )}

                {isEmployee ? (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <Briefcase className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">
                          Department
                        </p>
                        <p className="text-sm text-gray-800 font-medium">
                          {data.department}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <UserCheck className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">
                          Job Role
                        </p>
                        <p className="text-sm text-gray-800 font-medium">
                          {data.jobRole}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <IndianRupee className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">
                          Salary
                        </p>
                        <p className="text-sm text-gray-800 font-medium">
                          ₹{Number(data.salary).toLocaleString("en-IN")}/month
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">
                          Join Date
                        </p>
                        <p className="text-sm text-gray-800 font-medium">
                          {formatDate(data.joinDate)}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {data.location && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        <div className="p-2 bg-blue-600 rounded-lg">
                          <MapPin className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Location
                          </p>
                          <p className="text-sm text-gray-800 font-medium">
                            {data.location}
                          </p>
                        </div>
                      </div>
                    )}

                    {data.joinedDate && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        <div className="p-2 bg-blue-600 rounded-lg">
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Joined Date
                          </p>
                          <p className="text-sm text-gray-800 font-medium">
                            {formatDate(data.joinedDate)}
                          </p>
                        </div>
                      </div>
                    )}

                    {data.dateOfBirth && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        <div className="p-2 bg-blue-600 rounded-lg">
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Date of Birth
                          </p>
                          <p className="text-sm text-gray-800 font-medium">
                            {formatDate(data.dateOfBirth)}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                {isEmployee ? "Status Overview" : "Account Details"}
              </h3>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 space-y-3 border border-blue-200 shadow-sm">
                {isEmployee ? (
                  <>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="text-sm text-gray-600 font-medium">
                        Invite Status
                      </span>
                      <span className="text-xs font-semibold text-green-700 px-2 py-1 bg-green-100 rounded-full">
                        {data.inviteStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="text-sm text-gray-600 font-medium">
                        Account Status
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          data.active
                            ? "text-green-700 bg-green-100"
                            : "text-red-700 bg-red-100"
                        }`}
                      >
                        {data.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {data.profileEditRequest && (
                      <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                        <span className="text-sm text-gray-600 font-medium">
                          Edit Request
                        </span>
                        <span className="text-xs font-semibold text-amber-700 px-2 py-1 bg-amber-100 rounded-full capitalize">
                          {data.profileEditRequest.status}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {data.subscription && (
                      <>
                        <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                          <span className="text-sm text-gray-600 font-medium">
                            Subscription
                          </span>
                          <span className="text-xs font-semibold text-purple-700 px-2 py-1 bg-purple-100 rounded-full capitalize">
                            {data.subscription.plan}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                          <span className="text-sm text-gray-600 font-medium">
                            Status
                          </span>
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                              data.subscription.status === "active"
                                ? "text-green-700 bg-green-100"
                                : "text-gray-700 bg-gray-100"
                            }`}
                          >
                            {data.subscription.status}
                          </span>
                        </div>
                        {data.subscription.validUntil && (
                          <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                            <span className="text-sm text-gray-600 font-medium">
                              Valid Until
                            </span>
                            <span className="text-xs font-semibold text-gray-700">
                              {formatDate(data.subscription.validUntil)}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                    {data.lastActive && (
                      <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                        <span className="text-sm text-gray-600 font-medium">
                          Last Active
                        </span>
                        <span className="text-xs font-semibold text-gray-700">
                          {formatDate(data.lastActive)}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {!isEmployee &&
                (data.followers?.length > 0 ||
                  data.following?.length > 0 ||
                  data.friends?.length > 0) && (
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      Social Stats
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <p className="text-xl font-bold text-blue-600">
                          {data.followers?.length || 0}
                        </p>
                        <p className="text-xs text-gray-600">Followers</p>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <p className="text-xl font-bold text-blue-600">
                          {data.following?.length || 0}
                        </p>
                        <p className="text-xs text-gray-600">Following</p>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <p className="text-xl font-bold text-blue-600">
                          {data.friends?.length || 0}
                        </p>
                        <p className="text-xs text-gray-600">Friends</p>
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
