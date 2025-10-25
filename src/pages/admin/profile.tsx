import PasswordModal from "@/components/admin/modal/profile/password";
import ProfileHeader from "@/components/admin/profile/profileHeader";
import ProfileInfo from "@/components/admin/profile/profileInfo";
import {
  changePassword,
  editAdminDetails,
  fetchAdminProfile,
} from "@/redux/admin/admin/adminApi";
import { AppDispatch, RootState } from "@/redux/store";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { Admin } from "@/types/admin";
import { useStatusModal } from "@/context/adda/statusModalContext";
import { uploadFile } from "@/redux/fileUploadSlice";
import { useSubmissionModal } from "@/context/adda/commonModalContext";

const AdminProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { admin, error, loading } = useSelector(
    (state: RootState) => state.admin
  );
  const { showStatus } = useStatusModal();
  const { getToken } = useAuth();
  const { showModal } = useSubmissionModal();

  useEffect(() => {
    if (error) {
      showStatus("error", error);
    }
  }, [error]);

  const getAuthToken = useCallback(async () => {
    try {
      return await getToken();
    } catch (err) {
      console.error("Failed to get auth token:", err);
      showStatus("error", "Failed to authenticate. Please log in again.");
      return null;
    }
  }, [getToken, showStatus]);

  useEffect(() => {
    const fetchAdmin = async () => {
      const token = await getAuthToken();
      if (token) {
        try {
          await dispatch(fetchAdminProfile({ token })).unwrap();
        } catch (err) {
          console.error("Failed to fetch admin profile:", err);
          showStatus("error", "Failed to load profile data.");
        }
      }
    };

    fetchAdmin();
  }, [dispatch, getAuthToken]);

  const handleEditProfile = async (values: Partial<Admin>) => {
    console.log("Editing data:", values);
    const token = await getAuthToken();
    if (!token) {
      showStatus("error", "Authentication token missing.");
      return;
    }

    try {
      await dispatch(editAdminDetails({ data: values, token })).unwrap();
      setIsEditing(false);
      showStatus("success", "Profile updated successfully!");
    } catch (error: any) {
      console.error("Edit profile failed:", error);
      showStatus("error", error.message || "Failed to update profile.");
      setIsEditing(true);
    }
  };

  const handleProfilePicChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    showModal({
      currentStep: "uploading",
      isSubmitting: true,
      message: "Uploading profile picture",
    });
    const file = e.target.files?.[0];
    if (file) {
      const token = await getAuthToken();
      if (!token) {
        showStatus("error", "Authentication token missing.");
        return;
      }

      try {
        const resultAction = await dispatch(
          uploadFile({ file, getToken: getAuthToken })
        );

        if (uploadFile.fulfilled.match(resultAction)) {
          const uploadedUrl = resultAction.payload.data.fileDetails?.url;
          console.log("Uploaded profile picture URL:", uploadedUrl);

          if (uploadedUrl) {
            const updateResult = await dispatch(
              editAdminDetails({
                data: { picture: uploadedUrl },
                token,
              })
            ).unwrap();
            console.log(
              "editAdminDetails result for profile pic:",
              updateResult
            );

            if (
              !updateResult.name ||
              !updateResult.email ||
              !updateResult.phoneNumber
            ) {
              console.log("Response incomplete - refetching full profile");
              await dispatch(fetchAdminProfile({ token })).unwrap();
            }

            const reader = new FileReader();
            reader.onloadend = () => {
              console.log("Profile pic preview:", reader.result);
            };
            reader.readAsDataURL(file);

            showModal({
              currentStep: "success",
              isSubmitting: false,
              message: "Profile picture uploaded successfully",
            });
          } else {
            throw new Error("No URL returned from file upload.");
          }
        } else {
          throw new Error("File upload failed.");
        }
      } catch (error: any) {
        console.error("Profile picture update failed:", error);
        showModal({
          currentStep: "error",
          isSubmitting: false,
          message: "Failed to upload profile picture",
        });
      }
    }
  };

  const handleChangePassword = async (newPassword: string) => {
    try {
      console.log(newPassword);
      showModal({
        currentStep: "saving",
        isSubmitting: true,
        message: "Saving your password",
      });
      const token = (await getAuthToken()) ?? "";
      await dispatch(changePassword({ newPassword, token })).unwrap();

      showModal({
        currentStep: "success",
        isSubmitting: false,
        message: "Your password has been changed",
      });
    } catch (error: any) {
      console.log("error found:", error);
      showModal({
        currentStep: "error",
        isSubmitting: false,
        message: error || "Failed to change password",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No admin data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <ProfileHeader
            adminData={admin}
            handleProfilePicChange={handleProfilePicChange}
            setShowPasswordModal={setShowPasswordModal}
          />
          <ProfileInfo
            adminData={admin}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleEditProfile={handleEditProfile}
          />
        </div>
        <PasswordModal
          showPasswordModal={showPasswordModal}
          setShowPasswordModal={() => setShowPasswordModal(false)}
          onChangePassword={handleChangePassword}
        />
      </div>
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminProfile;
