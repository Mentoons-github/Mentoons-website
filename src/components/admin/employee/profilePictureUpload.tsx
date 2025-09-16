import React, { useRef } from "react";
import { User, Upload } from "lucide-react";

interface ProfilePictureUploadProps {
  profileImage: File | null;
  setProfileImage: (file: File | null) => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  setProfileImage,
  previewUrl,
  setPreviewUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Profile Picture
      </label>
      <div className="flex items-center space-x-4">
        <div className="w-24 h-24 border-2 border-gray-300 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={40} className="text-gray-400" />
          )}
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
          >
            <Upload size={16} className="mr-2" />
            Upload Photo
          </button>
          <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF, max 2MB</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
