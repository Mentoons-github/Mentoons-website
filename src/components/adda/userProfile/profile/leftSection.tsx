import { useState } from "react";
import { format } from "date-fns";
import { ProfileUserDetails } from "@/types/adda/userProfile";
import {
  CalendarRange,
  Camera,
  Edit,
  Hourglass,
  Mail,
  MapPin,
  Phone,
  Plus,
  UserPlus,
} from "lucide-react";
import ProfileFormModal from "@/pages/v2/adda/userProfile/profieForm";
import { useSubmissionModal } from "@/context/adda/commonModalContext";

interface LeftSectionProps {
  userDetails: ProfileUserDetails;
  setUserDetails: React.Dispatch<React.SetStateAction<ProfileUserDetails>>;
  handleProfileSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  removeInterest: (index: number) => void;
  updateInterests: () => Promise<void>;
  profilePhotoInputRef: React.RefObject<HTMLInputElement>;
  handleProfilePhotoChange: (file: File) => Promise<void>;
  totalFollowers: string[];
  totalFollowing: string[];
  setModalType: React.Dispatch<
    React.SetStateAction<"followers" | "following" | null>
  >;
  onProfilePhotoSelect?: (file: File) => void;
}

const LeftSection = ({
  userDetails,
  setUserDetails,
  handleProfileSubmit,
  removeInterest,
  updateInterests,
  profilePhotoInputRef,
  handleProfilePhotoChange,
  totalFollowers,
  totalFollowing,
  setModalType,
  onProfilePhotoSelect,
}: LeftSectionProps) => {
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { showModal } = useSubmissionModal();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: "File size should not exceed 5MB",
      });
      return;
    }

    if (onProfilePhotoSelect) {
      onProfilePhotoSelect(file);
    } else {
      await handleProfilePhotoChange(file);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      {isEditing ? (
        <ProfileFormModal
          userDetails={userDetails}
          setUserDetails={setUserDetails}
          setShowCompletionForm={() => setIsEditing(false)}
          handleProfileSubmit={handleProfileSubmit}
          removeInterest={removeInterest}
          updateInterests={updateInterests}
          isOpen={isEditing}
        />
      ) : (
        <>
          <div className="flex flex-col items-center">
            <div
              className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 group cursor-pointer"
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
            >
              <img
                src={
                  userDetails.picture ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                }
                alt="Profile picture"
                className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
              {isImageHovered && (
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center transition-opacity duration-300">
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              )}
              <input
                type="file"
                ref={profilePhotoInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <div
                className="absolute bottom-0 right-0 p-1 sm:p-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => profilePhotoInputRef.current?.click()}
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-white group-hover:rotate-90 transition-transform duration-300" />
              </div>
            </div>

            <div className="text-center mt-3 sm:mt-4">
              <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                {userDetails.name || "User Name"}
              </h1>
              <p className="text-gray-600 mt-1 text-xs sm:text-sm">
                {userDetails.occupation || ""}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2 text-gray-500">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">
                  {userDetails.email || "user@example.com"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 mt-4 sm:mt-6 p-2 sm:p-3 bg-gray-50 rounded-xl w-full justify-center">
              <button
                className="flex flex-col items-center text-center group cursor-pointer"
                onClick={() => setModalType("following")}
              >
                <span className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                  {totalFollowing.length}
                </span>
                <span className="text-xs sm:text-sm text-gray-600">
                  Following
                </span>
              </button>
              <div className="w-px h-6 sm:h-8 bg-gray-300"></div>
              <button
                className="flex flex-col items-center text-center group cursor-pointer"
                onClick={() => setModalType("followers")}
              >
                <span className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                  {totalFollowers.length}
                </span>
                <span className="text-xs sm:text-sm text-gray-600">
                  Followers
                </span>
              </button>
            </div>
          </div>

          <div className="mt-4 sm:mt-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="font-bold text-base sm:text-lg text-gray-900">
                Personal Info
              </h2>
              <Edit
                className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 cursor-pointer hover:text-orange-500 transition-colors"
                onClick={() => setIsEditing(true)}
              />
            </div>

            <div className="grid sm:grid-cols-2 sm:gap-4 space-y-3 sm:space-y-0">
              <div className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="p-1 sm:p-2 bg-orange-100 rounded-lg">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                </div>
                <div>
                  <span className="text-gray-900 font-medium text-xs sm:text-sm">
                    {userDetails.location || "Not provided"}
                  </span>
                  <p className="text-xs text-gray-500">Current Location</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="p-1 sm:p-2 bg-blue-100 rounded-lg">
                  <CalendarRange className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                </div>
                <div>
                  <span className="text-gray-900 font-medium text-xs sm:text-sm">
                    {userDetails.joinedDate
                      ? format(new Date(userDetails.joinedDate), "MMMM yyyy")
                      : "Not provided"}
                  </span>
                  <p className="text-xs text-gray-500">Member Since</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="p-1 sm:p-2 bg-green-100 rounded-lg">
                  <Hourglass className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                </div>
                <div>
                  <span className="text-gray-900 font-medium text-xs sm:text-sm">
                    {userDetails.dateOfBirth
                      ? format(
                          new Date(userDetails.dateOfBirth),
                          "MMMM d, yyyy"
                        )
                      : "Not provided"}
                  </span>
                  <p className="text-xs text-gray-500">Date of Birth</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="p-1 sm:p-2 bg-green-100 rounded-lg">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                </div>
                <div>
                  <span className="text-gray-900 font-medium text-xs sm:text-sm">
                    {userDetails.phoneNumber || "Not provided"}
                  </span>
                  <p className="text-xs text-gray-500">Phone</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mt-4 sm:mt-6">
              <button
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl h-10 sm:h-12 font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 text-xs sm:text-sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                Edit Profile
              </button>
              <button className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 rounded-xl h-10 sm:h-12 font-semibold hover:bg-gray-200 transition-colors duration-300 text-xs sm:text-sm">
                <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                Share Profile
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LeftSection;
