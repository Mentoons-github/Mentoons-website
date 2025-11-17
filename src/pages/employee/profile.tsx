import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchEmployee, editEmployee } from "@/redux/employee/api";
import { uploadFile } from "@/redux/fileUploadSlice";
import { useAuth } from "@clerk/clerk-react";
import Loader from "@/components/common/admin/loader";
import axios from "axios";
import { useSubmissionModal } from "@/context/adda/commonModalContext";

import EmployeeProfileHeader from "@/components/employee/profile/profileHeader";
import EmployeeQuickStats from "@/components/employee/profile/profileStats";
import EmployeeTabsNavigation from "@/components/employee/profile/tabNavigation";
import EmployeeOverviewTab from "@/components/employee/profile/overViewTab";
import EmployeeTasksTab from "@/components/employee/profile/taskTable";
import EmployeePerformanceTab from "@/components/employee/profile/performanceTable";
import EmployeePermissionModal from "@/components/employee/profile/permissionModal";
import EmployeeEditProfileModal from "@/components/employee/profile/editProfile";
import EmployeeProfilePictureModal from "@/components/employee/profile/profilePicture";

const EmployeeProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { getToken } = useAuth();
  const { employee, loading, error } = useSelector(
    (state: RootState) => state.employeeData
  );

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "tasks" | "performance"
  >("overview");
  const [editForm, setEditForm] = useState<any>({ user: {} });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [showProfilePicture, setShowProfilePicture] = useState(false);
  const { showModal } = useSubmissionModal();

  const defaultUserData = {
    name: "",
    email: "",
    role: "",
    gender: "other",
    phoneNumber: null,
    dob: null,
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      if (token) dispatch(fetchEmployee(token));
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
          dob: employee.employee.user.dob,
        },
      });
    }
  }, [employee]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showProfilePicture)
        setShowProfilePicture(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showProfilePicture]);

  const handleRequestPermission = async () => {
    setSendingRequest(true);
    try {
      const token = await getToken();
      await axios.post(
        `${import.meta.env.VITE_PROD_URL}/employee/request-edit`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowPermissionModal(true);
    } catch (err: any) {
      showModal({
        currentStep: "error",
        isSubmitting: false,
        message: err.response?.data?.message || "Failed to send request",
      });
    } finally {
      setSendingRequest(false);
    }
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
          showModal({
            currentStep: "error",
            isSubmitting: true,
            message: "File upload failed.",
          });
          return;
        }
      }

      if (!editForm.user?.name) {
        showModal({
          currentStep: "error",
          isSubmitting: true,
          message: "Name is required",
        });
        return;
      }

      if (editForm.user?.dob && !employee?.employee?.user.dob) {
        const dobDate = new Date(editForm.user.dob);
        const today = new Date();
        if (isNaN(dobDate.getTime()) || dobDate > today) {
          showModal({
            currentStep: "error",
            isSubmitting: true,
            message: "Invalid Date of Birth",
          });
          return;
        }
      }

      const updatedForm = {
        user: {
          ...editForm.user,
          name: editForm.user.name,
          picture: pictureUrl,
          dob: editForm.user.dob,
        },
      };
      const token = await getToken();
      if (!token) {
        showModal({
          currentStep: "error",
          isSubmitting: true,
          message: "Authentication failed",
        });
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
        message: "Profile updated!",
      });
      setIsEditing(false);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      showModal({
        currentStep: "error",
        isSubmitting: true,
        message: "Failed to save",
      });
    }
  };

  if (loading) return <Loader />;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!employee?.employee)
    return <div className="text-center py-10">No data</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-64 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 relative">
        <div className="absolute inset-0 bg-black opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-32 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <EmployeeProfileHeader
              employee={employee.employee}
              onOpenPicture={() => setShowProfilePicture(true)}
              onEditClick={() => setIsEditing(true)}
              onRequestPermission={handleRequestPermission}
              sendingRequest={sendingRequest}
              canEdit={
                employee.employee.profileEditRequest?.status === "approved"
              }
            />
            <EmployeeQuickStats tasks={employee.tasks} />
          </div>
        </div>

        {showProfilePicture && (
          <EmployeeProfilePictureModal
            picture={employee.employee.user.picture}
            name={employee.employee.user.name}
            onClose={() => setShowProfilePicture(false)}
          />
        )}
        {showPermissionModal && (
          <EmployeePermissionModal
            onClose={() => setShowPermissionModal(false)}
          />
        )}
        {isEditing && (
          <EmployeeEditProfileModal
            form={editForm}
            setForm={setEditForm}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            fileRef={fileInputRef}
            onCancel={() => {
              setIsEditing(false);
              setSelectedFile(null);
            }}
            onSave={handleSave}
            employeeDob={employee.employee.user.dob}
          />
        )}

        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <EmployeeTabsNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <div className="p-8">
            {activeTab === "overview" && (
              <EmployeeOverviewTab employee={employee.employee} />
            )}
            {activeTab === "tasks" && (
              <EmployeeTasksTab tasks={employee.recentTasks} />
            )}
            {activeTab === "performance" && (
              <EmployeePerformanceTab tasks={employee.tasks} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
