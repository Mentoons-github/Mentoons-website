import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FaCamera } from "react-icons/fa6";
import { FiEdit2 } from "react-icons/fi";
import { UserDetails } from "./profile";
import { memo } from "react";

interface ProfileHeaderProps {
  userDetails: UserDetails;
  coverPhotoInputRef: React.RefObject<HTMLInputElement>;
  profilePhotoInputRef: React.RefObject<HTMLInputElement>;
  handleCoverPhotoChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  handleProfilePhotoChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
}

const ProfileHeader = memo(
  ({
    userDetails,
    coverPhotoInputRef,
    profilePhotoInputRef,
    handleCoverPhotoChange,
    handleProfilePhotoChange,
  }: ProfileHeaderProps) => (
    <div className="relative">
      <div
        className="w-full h-80 object-cover rounded-xl shadow-lg"
        style={{
          backgroundImage: userDetails.coverImage
            ? `url(${userDetails.coverImage})`
            : "linear-gradient(to right, #EC9600, #fbbf24)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Button
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2"
          onClick={() => coverPhotoInputRef.current?.click()}
        >
          <FaCamera className="text-white" />
        </Button>
        <input
          type="file"
          ref={coverPhotoInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleCoverPhotoChange}
        />
      </div>
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-white shadow-xl flex justify-center items-center">
        <Avatar className="w-36 h-36 ring-4 ring-white">
          <img
            src={
              userDetails.picture ||
              "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
            }
            alt="profile-picture"
            className="object-cover"
          />
          <Button
            className="absolute bottom-0 right-0 w-8 h-8 p-0 text-white bg-orange-500 rounded-full hover:bg-orange-600"
            onClick={() => profilePhotoInputRef.current?.click()}
          >
            <FiEdit2 size={14} />
          </Button>
          <input
            type="file"
            ref={profilePhotoInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleProfilePhotoChange}
          />
        </Avatar>
      </div>
    </div>
  )
);

export default ProfileHeader;
