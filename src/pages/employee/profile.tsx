import React, { useEffect, useState, useRef } from "react";
import {
  User,
  Mail,
  Building2,
  Edit2,
  X,
  CheckCircle,
  Clock,
  Award,
  TrendingUp,
  Phone,
  Key,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchEmployee, editEmployee } from "@/redux/employee/api";
import { uploadFile } from "@/redux/fileUploadSlice";
import { EmployeeInterface, UserFormData } from "@/types/employee";
import { useAuth } from "@clerk/clerk-react";
import Loader from "@/components/common/admin/loader";
import axios from "axios";
import { useSubmissionModal } from "@/context/adda/commonModalContext";
import { getStatusColor } from "@/utils/task/admin/taskUtils";

export default function EmployeeProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const { getToken } = useAuth();
  const { employee, loading, error } = useSelector(
    (state: RootState) => state.employeeData
  );

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [editForm, setEditForm] = useState<Partial<EmployeeInterface>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [showProfilePicture, setShowProfilePicture] = useState(false);
  const { showModal } = useSubmissionModal();

  const defaultUserData: UserFormData = {
    name: "",
    email: "",
    role: "",
    gender: "other",
    phoneNumber: null,
    picture: undefined,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        if (token) {
          dispatch(fetchEmployee(token));
        } else {
          console.error("No authentication token found");
        }
      } catch (err) {
        console.error("Error fetching token:", err);
      }
    };
    fetchData();
  }, [dispatch, getToken]);

  useEffect(() => {
    if (employee?.employee) {
      setEditForm({
        user: {
          ...defaultUserData,
          name: employee.employee.user.name,
          picture: employee.employee.user.picture,
        },
      });
    }
  }, [employee]);

  // Handle Escape key to close profile picture modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showProfilePicture) {
        setShowProfilePicture(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showProfilePicture]);

  const handleRequestPermission = async () => {
    try {
      setSendingRequest(true);
      const token = await getToken();
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/employee/request-edit`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSendingRequest(false);
        setShowPermissionModal(true);
      } else {
        showModal({
          currentStep: "error",
          isSubmitting: false,
          message: "Failed to send permission request",
        });
      }
    } catch (err: any) {
      console.error("Error sending permission request:", err);
      showModal({
        currentStep: "error",
        isSubmitting: false,
        message:
          err.response.data.message || "Failed to send permission request",
      });
    } finally {
      setSendingRequest(false);
    }
  };

  const handlePermissionModalClose = () => {
    setShowPermissionModal(false);
  };

  const handleSave = async () => {
    try {
      showModal({
        currentStep: "uploading",
        isSubmitting: true,
        message: "Uploading Image",
      });
      let pictureUrl = editForm.user?.picture;

      if (selectedFile) {
        const resultAction = await dispatch(
          uploadFile({ file: selectedFile, getToken })
        );
        if (uploadFile.fulfilled.match(resultAction)) {
          pictureUrl = resultAction.payload.data.fileDetails?.url;
        } else {
          console.error("File upload failed:", resultAction.payload);
          showModal({
            currentStep: "error",
            isSubmitting: true,
            message: "File upload failed.",
            error: "Failed to upload profile picture",
          });
          alert("Failed to upload profile picture");
          return;
        }
      }

      // Validate required fields
      if (!editForm.user?.name) {
        showModal({
          currentStep: "error",
          isSubmitting: true,
          message: "Validation Error",
          error: "Please fill in the Name field",
        });
        alert("Please fill in the Name field");
        return;
      }

      const updatedForm: Partial<EmployeeInterface> = {
        user: {
          ...editForm.user!,
          name: editForm.user!.name,
          picture: pictureUrl,
        },
      };

      const token = await getToken();
      if (!token) {
        showModal({
          currentStep: "error",
          isSubmitting: true,
          message: "Authentication Failed",
          error: "Please re-login to continue.",
        });
        alert("Authentication failed");
        return;
      }

      showModal({
        currentStep: "saving",
        isSubmitting: true,
        message: "Saving changes...",
      });

      await dispatch(
        editEmployee({ updatedData: updatedForm, token })
      ).unwrap();

      showModal({
        currentStep: "success",
        isSubmitting: true,
        message: "Profile updated successfully!",
      });

      setIsEditing(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Failed to save employee:", err);
      showModal({
        currentStep: "error",
        isSubmitting: true,
        message: "Failed to save changes.",
        error: (err as Error).message,
      });
      alert("Failed to save changes");
    }
  };

  const handleCancel = () => {
    setEditForm({
      user: {
        ...defaultUserData,
        name: employee?.employee?.user.name || defaultUserData.name,
        picture: employee?.employee?.user.picture || defaultUserData.picture,
      },
    });
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsEditing(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name.includes("user.")) {
      const userField = name.split(".")[1] as keyof UserFormData;
      setEditForm((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          [userField]: value,
        } as UserFormData,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleOpenProfilePicture = () => {
    setShowProfilePicture(true);
  };

  const handleCloseProfilePicture = () => {
    setShowProfilePicture(false);
  };

  const completionRate = employee?.tasks?.assigned
    ? ((employee.tasks.submitted / employee.tasks.assigned) * 100).toFixed(1)
    : "0.0";
  const submittedPercentage = employee?.tasks?.assigned
    ? (employee.tasks.submitted / employee.tasks.assigned) * 100
    : 0;

  // Permission Request Modal
  const PermissionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Request Permission
          </h3>
          <button
            onClick={handlePermissionModalClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          A permission request to edit your profile has been sent to your
          supervisor. You will be notified once approval is granted.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={handlePermissionModalClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Edit Profile Modal
  const EditProfileModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">
              Name
            </label>
            <input
              type="text"
              name="user.name"
              value={editForm.user?.name || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter name"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                id="profile-picture-upload"
              />
            </div>
            {(selectedFile || editForm.user?.picture) && (
              <div className="mt-4">
                <label className="text-sm font-semibold text-gray-600 block mb-1">
                  Preview
                </label>
                <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg overflow-hidden">
                  {selectedFile ? (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : editForm.user?.picture ? (
                    <img
                      src={editForm.user.picture}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <span className="text-gray-500">No Image</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  // Profile Picture Modal (Updated with Null Check)
  const ProfilePictureModal = () => {
    if (!employee?.employee?.user) {
      console.error("Employee data is missing in ProfilePictureModal");
      return (
        <div
          className={`fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300 ${
            showProfilePicture ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={handleCloseProfilePicture}
          role="dialog"
          aria-label="Profile Picture Modal"
        >
          <div
            className={`relative bg-white rounded-2xl p-6 transform transition-transform duration-300 ${
              showProfilePicture ? "scale-100" : "scale-75"
            } max-w-4xl w-full mx-4`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseProfilePicture}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition"
              aria-label="Close profile picture"
            >
              <X size={24} />
            </button>
            <p className="text-center text-gray-600">
              No profile data available
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300 ${
          showProfilePicture ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleCloseProfilePicture}
        role="dialog"
        aria-label="Profile Picture Modal"
      >
        <div
          className={`relative bg-white rounded-2xl overflow-hidden transform transition-transform duration-300 ${
            showProfilePicture ? "scale-100" : "scale-75"
          } max-w-4xl w-full mx-4`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleCloseProfilePicture}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition"
            aria-label="Close profile picture"
          >
            <X size={24} />
          </button>
          {employee.employee.user.picture ? (
            <img
              src={employee.employee.user.picture}
              alt="Full-size Profile"
              className="max-w-full max-h-[90vh] object-contain w-full h-auto"
              onError={() => console.error("Failed to load profile picture")}
            />
          ) : (
            <div className="w-96 h-96 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-8xl font-bold mx-auto">
              {employee.employee.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!employee?.employee) {
    return <div className="text-center py-10">No employee data available</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Photo */}
      <div className="h-64 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 relative">
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="relative -mt-32 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <button
                  onClick={handleOpenProfilePicture}
                  className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl"
                  aria-label="View profile picture"
                >
                  <div className="w-40 h-40 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-5xl font-bold shadow-lg ring-8 ring-white relative">
                    {employee.employee.user.picture ? (
                      <img
                        src={employee.employee.user.picture}
                        alt="Profile"
                        className="w-full h-full rounded-2xl object-cover"
                      />
                    ) : (
                      employee.employee.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    )}
                  </div>
                </button>
                <div
                  className={`absolute -bottom-2 -right-2 px-4 py-1 rounded-full text-sm font-semibold shadow-lg ${
                    employee.employee.active
                      ? "bg-green-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {employee.employee.active ? "Active" : "Inactive"}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <div className="space-y-2 mb-3">
                      <h1 className="text-4xl font-bold text-gray-900">
                        {employee.employee.user.name}
                      </h1>
                      <p className="text-xl text-gray-600">
                        {employee.employee.jobRole}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <span className="flex items-center gap-2 text-gray-600">
                          <Mail size={18} />
                          <p className="text-gray-600">
                            {employee.employee.user.email}
                          </p>
                        </span>
                        <span className="flex items-center gap-2 text-gray-600">
                          <User size={18} />
                          <span className="capitalize">
                            {employee.employee.user.gender}
                          </span>
                        </span>
                        <span className="flex items-center gap-2 text-gray-600">
                          <Building2 size={18} />
                          <span className="capitalize">
                            {employee.employee.department || "N/A"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    {employee.employee.profileEditRequest &&
                    employee.employee.profileEditRequest.status ===
                      "approved" ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-lg bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl transition-all"
                      >
                        <Edit2 size={20} />
                        Edit Profile
                      </button>
                    ) : (
                      <button
                        disabled={sendingRequest}
                        onClick={handleRequestPermission}
                        className={`
        flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-lg transition-all
        ${
          sendingRequest
            ? "bg-gray-400 text-gray-200 cursor-not-allowed shadow-md"
            : "bg-yellow-600 text-white hover:bg-yellow-700 hover:shadow-xl"
        }
      `}
                      >
                        <Key size={20} />
                        {sendingRequest
                          ? "Sending Request..."
                          : "Request Permission"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <CheckCircle size={20} />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">
                      {employee.tasks.completed}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-orange-600 mb-1">
                      <Clock size={20} />
                      <span className="text-sm font-medium">In Progress</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-700">
                      {employee.tasks.inProgress}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-purple-600 mb-1">
                      <TrendingUp size={20} />
                      <span className="text-sm font-medium">Success Rate</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-700">
                      {completionRate}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showProfilePicture && <ProfilePictureModal />}
        {showPermissionModal && <PermissionModal />}
        {isEditing && <EditProfileModal />}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 font-semibold border-b-2 transition-colors ${
                  activeTab === "overview"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("tasks")}
                className={`py-4 font-semibold border-b-2 transition-colors ${
                  activeTab === "tasks"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Tasks
              </button>
              <button
                onClick={() => setActiveTab("performance")}
                className={`py-4 font-semibold border-b-2 transition-colors ${
                  activeTab === "performance"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Performance
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Personal Information */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Personal Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <Phone className="text-blue-600 mt-1" size={22} />
                        <div className="flex-1">
                          <label className="text-sm font-semibold text-gray-600 block mb-1">
                            Phone Number
                          </label>
                          <p className="text-gray-900 font-medium">
                            {employee.employee.user.phoneNumber || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <User className="text-blue-600 mt-1" size={22} />
                        <div className="flex-1">
                          <label className="text-sm font-semibold text-gray-600 block mb-1">
                            Job Role
                          </label>
                          <p className="text-gray-900 font-medium">
                            {employee.employee.jobRole}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <User className="text-blue-600 mt-1" size={22} />
                        <div className="flex-1">
                          <label className="text-sm font-semibold text-gray-600 block mb-1">
                            Role
                          </label>
                          <p className="text-gray-900 font-medium">
                            {employee.employee.user.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Work Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Work Details
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                        <label className="text-sm font-semibold text-blue-900 block mb-2">
                          Department
                        </label>
                        <p className="text-lg text-blue-700 font-bold capitalize">
                          {employee.employee.department || "N/A"}
                        </p>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                        <label className="text-sm font-semibold text-green-900 block mb-2">
                          Annual Salary
                        </label>
                        <p className="text-lg text-green-700 font-bold">
                          ₹{employee.employee.salary.toLocaleString()}
                        </p>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-100">
                        <label className="text-sm font-semibold text-yellow-900 block mb-2">
                          Status
                        </label>
                        <p className="text-lg text-yellow-700 font-bold">
                          {employee.employee.active ? "Active" : "Inactive"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tasks" && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Recent Tasks
                </h3>
                <div className="space-y-3">
                  {employee.recentTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <CheckCircle
                          className={`${
                            task.status === "completed"
                              ? "text-green-500"
                              : task.status === "in-progress"
                              ? "text-blue-500"
                              : task.status === "overdue"
                              ? "text-red-500"
                              : "text-gray-400"
                          }`}
                          size={24}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {task.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Due: {task.dueDate}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status.replace("-", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "performance" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Task Statistics
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-semibold text-gray-700">
                            Total Assigned Tasks
                          </span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900">
                          {employee.tasks.assigned}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-blue-500 h-3 rounded-full"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-semibold text-gray-700">
                            Submitted Tasks
                          </span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900">
                          {employee.tasks.submitted}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-green-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${submittedPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="font-semibold text-gray-700">
                            Pending Tasks
                          </span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900">
                          {employee.tasks.assigned - employee.tasks.submitted}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${100 - submittedPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-8 p-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm font-medium mb-2">
                            Overall Completion Rate
                          </p>
                          <p className="text-5xl font-bold">
                            {completionRate}%
                          </p>
                        </div>
                        <Award size={64} className="text-blue-200 opacity-50" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
