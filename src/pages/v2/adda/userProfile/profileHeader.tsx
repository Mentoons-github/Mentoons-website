import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FaCamera } from "react-icons/fa6";
import { FiEdit2, FiLoader } from "react-icons/fi";
import { UserDetails } from "./profile";
import { memo, useState, useCallback } from "react";
import ImageCropperModal from "@/components/common/modal/cropper/cropperModal";

interface ProfileHeaderProps {
  userDetails: UserDetails;
  coverPhotoInputRef: React.RefObject<HTMLInputElement>;
  profilePhotoInputRef: React.RefObject<HTMLInputElement>;
  handleCoverPhotoChange: (file: File) => Promise<void>;
  handleProfilePhotoChange: (file: File) => Promise<void>;
  isEditable?: boolean;
  maxImageSize?: number;
  onImageError?: (error: string) => void;
}

const ProfileHeader = memo(
  ({
    userDetails,
    coverPhotoInputRef,
    profilePhotoInputRef,
    handleCoverPhotoChange,
    handleProfilePhotoChange,
    isEditable = true,
    maxImageSize = 5,
    onImageError,
  }: ProfileHeaderProps) => {
    const [isCoverPhotoLoading, setIsCoverPhotoLoading] = useState(false);
    const [isProfilePhotoLoading, setIsProfilePhotoLoading] = useState(false);
    const [coverImageError, setCoverImageError] = useState(false);
    const [profileImageError, setProfileImageError] = useState(false);
    const [cropperOpen, setCropperOpen] = useState<"cover" | "profile" | null>(
      null
    );
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);

    const validateImage = useCallback(
      (file: File): string | null => {
        if (file.size > maxImageSize * 1024 * 1024) {
          return `Image size must be less than ${maxImageSize}MB`;
        }

        const validTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        if (!validTypes.includes(file.type)) {
          return "Please select a valid image file (JPEG, PNG, or WebP)";
        }

        return null;
      },
      [maxImageSize]
    );

    const openCropper = useCallback(
      (file: File, type: "cover" | "profile") => {
        const validationError = validateImage(file);
        if (validationError) {
          onImageError?.(validationError);
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          setImageToCrop(reader.result as string);
          setCropperOpen(type);
        };
        reader.readAsDataURL(file);
      },
      [validateImage, onImageError]
    );

    const onCoverPhotoChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        openCropper(file, "cover");
      },
      [openCropper]
    );

    const onProfilePhotoChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        openCropper(file, "profile");
      },
      [openCropper]
    );

    const handleCroppedImage = useCallback(
      async (croppedFile: File, type: "cover" | "profile") => {
        const validationError = validateImage(croppedFile);
        if (validationError) {
          onImageError?.(validationError);
          setCropperOpen(null);
          return;
        }

        try {
          if (type === "cover") {
            setIsCoverPhotoLoading(true);
            setCoverImageError(false);
            await handleCoverPhotoChange(croppedFile);
          } else {
            setIsProfilePhotoLoading(true);
            setProfileImageError(false);
            await handleProfilePhotoChange(croppedFile);
          }
        } catch (error) {
          if (type === "cover") {
            setCoverImageError(true);
            onImageError?.("Failed to upload cover photo. Please try again.");
          } else {
            setProfileImageError(true);
            onImageError?.("Failed to upload profile photo. Please try again.");
          }
        } finally {
          setIsCoverPhotoLoading(false);
          setIsProfilePhotoLoading(false);
          setCropperOpen(null);
          setImageToCrop(null);
        }
      },
      [
        handleCoverPhotoChange,
        handleProfilePhotoChange,
        validateImage,
        onImageError,
      ]
    );

    const defaultCoverGradient =
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    const fallbackProfileImage =
      "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(userDetails.name || "User") +
      "&background=f59e0b&color=ffffff&size=250&rounded=true";

    return (
      <div className="relative group">
        <div className="relative overflow-hidden rounded-2xl shadow-xl">
          <div
            className={`w-full h-80 bg-cover bg-center transition-all duration-500 ${
              coverImageError ? "opacity-50" : ""
            }`}
            style={{
              backgroundImage:
                userDetails.coverImage && !coverImageError
                  ? `url(${userDetails.coverImage})`
                  : defaultCoverGradient,
            }}
            role="img"
            aria-label={
              userDetails.coverImage
                ? "User cover photo"
                : "Default cover background"
            }
          >
            <div className="absolute inset-0 bg-black/10" />

            {isEditable && (
              <div className="absolute top-6 right-6 flex gap-2">
                <Button
                  className={`
                    bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 
                    backdrop-blur-md rounded-full p-3 transition-all duration-300
                    shadow-lg hover:shadow-xl transform hover:scale-105
                    ${
                      isCoverPhotoLoading ? "cursor-not-allowed opacity-70" : ""
                    }
                  `}
                  onClick={() => coverPhotoInputRef.current?.click()}
                  aria-label="Change cover photo"
                  disabled={isCoverPhotoLoading}
                  size="sm"
                >
                  {isCoverPhotoLoading ? (
                    <FiLoader className="w-4 h-4 animate-spin" />
                  ) : (
                    <FaCamera className="w-4 h-4" />
                  )}
                </Button>

                {isCoverPhotoLoading && (
                  <div className="absolute -bottom-1 left-0 right-0 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 animate-pulse" />
                  </div>
                )}
              </div>
            )}

            <input
              type="file"
              ref={coverPhotoInputRef}
              className="hidden"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={onCoverPhotoChange}
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <div className="relative p-2">
            <div className="w-40 h-40 rounded-full bg-white p-1 shadow-2xl transition-transform duration-300 hover:scale-105">
              <Avatar className="w-full h-full ring-4 ring-white/50 relative">
                <img
                  src={
                    profileImageError
                      ? fallbackProfileImage
                      : userDetails.picture || fallbackProfileImage
                  }
                  alt={`${userDetails.name || "User"}'s profile picture`}
                  className={`
                    object-cover w-full h-full transition-all duration-300
                    ${profileImageError ? "opacity-50" : ""}
                  `}
                  loading="lazy"
                  onError={() => setProfileImageError(true)}
                  onLoad={() => setProfileImageError(false)}
                />
              </Avatar>
            </div>

            {isEditable && (
              <Button
                className={`
                  absolute bottom-0 right-0 w-12 h-12 p-0 
                  bg-gradient-to-r from-orange-400 to-orange-600 
                  hover:from-orange-500 hover:to-orange-700
                  text-white rounded-full shadow-lg hover:shadow-xl
                  transition-all duration-300 transform hover:scale-110
                  border-4 border-white z-10
                  ${
                    isProfilePhotoLoading ? "cursor-not-allowed opacity-70" : ""
                  }
                `}
                onClick={() => profilePhotoInputRef.current?.click()}
                aria-label="Change profile picture"
                disabled={isProfilePhotoLoading}
              >
                {isProfilePhotoLoading ? (
                  <FiLoader className="w-5 h-5 animate-spin" />
                ) : (
                  <FiEdit2 className="w-5 h-5" />
                )}
              </Button>
            )}

            <input
              type="file"
              ref={profilePhotoInputRef}
              className="hidden"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={onProfilePhotoChange}
              aria-hidden="true"
            />

            {isProfilePhotoLoading && (
              <div className="absolute inset-2 flex items-center justify-center">
                <div className="w-44 h-44 rounded-full border-4 border-blue-200">
                  <div className="w-full h-full rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </div>

        {coverImageError && (
          <div className="absolute top-4 left-4 bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-lg text-sm">
            Failed to load cover image
          </div>
        )}

        {cropperOpen && imageToCrop && (
          <ImageCropperModal
            imageSrc={imageToCrop}
            aspectRatio={cropperOpen === "cover" ? 16 / 9 : 1}
            onCrop={(croppedFile) =>
              handleCroppedImage(croppedFile, cropperOpen)
            }
            onCancel={() => {
              setCropperOpen(null);
              setImageToCrop(null);
            }}
          />
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.userDetails.coverImage === nextProps.userDetails.coverImage &&
      prevProps.userDetails.picture === nextProps.userDetails.picture &&
      prevProps.userDetails.name === nextProps.userDetails.name &&
      prevProps.isEditable === nextProps.isEditable &&
      prevProps.maxImageSize === nextProps.maxImageSize
    );
  }
);

ProfileHeader.displayName = "ProfileHeader";

export default ProfileHeader;
