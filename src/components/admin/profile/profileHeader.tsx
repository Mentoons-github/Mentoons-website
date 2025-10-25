import React from "react";
import { Camera, Shield, Calendar, Lock } from "lucide-react";
import { Admin } from "@/types/admin";

interface ProfileHeaderProps {
  adminData: Admin;
  handleProfilePicChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShowPasswordModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  adminData,
  handleProfilePicChange,
  setShowPasswordModal,
}) => {
  return (
    <>
      <div className="h-40 bg-gradient-to-r from-blue-600 to-blue-800 relative">
        <div className="absolute inset-0 bg-black opacity-10"></div>
      </div>
      <div className="px-6 md:px-10 pb-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-20 mb-8">
          <div className="relative group">
            <div className="w-36 h-36 rounded-3xl border-4 border-white shadow-2xl overflow-hidden bg-white">
              <img
                src={adminData.picture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-3xl opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
              <div className="text-center">
                <Camera className="w-8 h-8 text-white mx-auto mb-1" />
                <span className="text-white text-xs font-medium">
                  Change Photo
                </span>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleProfilePicChange}
              />
            </label>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {adminData.name}
              </h1>
              <div className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full">
                <Shield className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-lg text-gray-600 font-medium mb-1">
              {adminData.role}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Joined {adminData.joinDate?.split("T")[0]}
              </span>
              <span>•</span>
              <span>ID: {adminData._id}</span>
            </div>
          </div>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Change Password
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
