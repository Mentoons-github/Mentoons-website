import { Camera, Plus } from "lucide-react";
import { ProfileUserDetails } from "@/types/adda/userProfile";
import { useSubmissionModal } from "@/context/adda/commonModalContext";

interface CoverPictureProps {
  userDetails: ProfileUserDetails;
  coverPhotoInputRef: React.RefObject<HTMLInputElement>;
  profilePhotoInputRef: React.RefObject<HTMLInputElement>;
  onCoverPhotoSelect: (file: File) => void;
  onProfilePhotoSelect: (file: File) => void;
}

const CoverPicture = ({
  userDetails,
  coverPhotoInputRef,
  profilePhotoInputRef,
  onCoverPhotoSelect,
  onProfilePhotoSelect,
}: CoverPictureProps) => {
  const { showModal } = useSubmissionModal();

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const validateAndHandleFile = (file: File, type: "cover" | "profile") => {
    if (file.size > MAX_FILE_SIZE) {
      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: "File size should not exceed 5MB",
      });
      return;
    }

    if (type === "cover") {
      onCoverPhotoSelect(file);
    } else {
      onProfilePhotoSelect(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    validateAndHandleFile(file, "cover");
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    validateAndHandleFile(file, "profile");
  };

  return (
    // Outer wrapper: pb gives space below for the profile picture overflow
    <div className="relative mb-16 sm:mb-18 lg:mb-20">
      {/* Cover photo */}
      <div
        className={`w-full h-48 sm:h-64 lg:h-80 rounded-t-2xl bg-cover bg-center relative overflow-hidden ${
          userDetails.coverImage
            ? ""
            : "bg-gradient-to-r from-orange-300 to-green-400"
        }`}
        style={
          userDetails.coverImage
            ? { backgroundImage: `url(${userDetails.coverImage})` }
            : {}
        }
      >
        {/* Cover photo edit button */}
        <div
          className="absolute bottom-4 right-4 p-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 w-11 h-11 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 z-10"
          onClick={() => coverPhotoInputRef.current?.click()}
          title="Edit cover photo"
        >
          <Camera className="w-5 h-5 text-white" />
        </div>

        <input
          type="file"
          ref={coverPhotoInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleCoverChange}
        />
      </div>

      <div className="absolute left-6 sm:left-8 -bottom-12 sm:-bottom-14 lg:-bottom-16">
        <div className="relative group w-24 h-24 sm:w-28 sm:h-28 lg:w-48 lg:h-48 cursor-pointer">
          <img
            src={
              userDetails.picture ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
            }
            alt="Profile"
            className="w-full h-full object-cover rounded-full border-[3px] border-white shadow-xl transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div
            className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            onClick={() => profilePhotoInputRef.current?.click()}
          >
            <Camera className="text-white w-6 h-6 drop-shadow" />
          </div>

          <div
            className="absolute bottom-0.5 right-0.5 bg-gradient-to-br from-orange-500 to-orange-400 p-2 rounded-full shadow-md border-2 border-white hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95"
            onClick={() => profilePhotoInputRef.current?.click()}
          >
            <Plus className="text-white w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>

          <input
            type="file"
            ref={profilePhotoInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleProfileChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CoverPicture;
