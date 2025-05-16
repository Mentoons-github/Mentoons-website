import React, { useState } from "react";
import { User } from "@/types";
import {
  Calendar,
  MapPin,
  Link,
  Mail,
  User as UserIcon,
  UserPlus,
  UserMinus,
} from "lucide-react";

interface ProfileHeaderProps {
  user: User;
  totalPosts: number;
  totalFollowing: number;
  isCurrentUser: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  totalPosts,
  totalFollowing,
  isCurrentUser,
}) => {
  const [isFriend, setIsFriend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString: Date | string | undefined): string => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleFriendAction = async () => {
    setIsLoading(true);
    try {
      // Replace with actual API call to add/remove friend
      // const token = await getToken();
      // const endpoint = isFriend ? `/adda/unfriend/${user._id}` : `/adda/addFriend/${user._id}`;
      // await axiosInstance(endpoint, {
      //   method: 'POST',
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   }
      // });

      // For demo purposes, we'll just toggle the state
      setIsFriend(!isFriend);
    } catch (error) {
      console.error("Friend action failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-4 w-full">
      <div className="h-24 md:h-40 bg-gradient-to-r from-blue-100 to-purple-100"></div>

      <div className="px-4 sm:px-6 pb-6 relative">
        <div className="flex justify-between items-end -mt-12 md:-mt-16 mb-4">
          <div className="relative">
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name || "User"}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md object-cover"
              />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md bg-gray-200 flex items-center justify-center">
                <UserIcon size={36} className="text-gray-400" />
              </div>
            )}
            {user.subscription?.plan && user.subscription.plan !== "free" && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded-full">
                {user.subscription.plan}
              </div>
            )}
          </div>
          {!isCurrentUser && (
            <button
              onClick={handleFriendAction}
              disabled={isLoading}
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isFriend
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              }`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
              ) : isFriend ? (
                <>
                  <UserMinus size={16} />
                  <span>Unfriend</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Add Friend</span>
                </>
              )}
            </button>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {user.name || "Unnamed User"}
            </h1>

            <div className="mt-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-gray-500 text-sm">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">
                  {user.email || "No email provided"}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>{user.location || "Location not specified"}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>Joined {formatDate(user.joinedDate)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs md:text-sm font-medium">
              {user.role || "USER"}
            </div>
            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs md:text-sm font-medium">
              <span>Last active: </span>
              {user.lastActive
                ? new Date(user.lastActive).toLocaleDateString()
                : "Never"}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center py-3 border-y border-gray-100">
            <div>
              <div className="text-lg md:text-xl font-bold text-gray-900">
                {totalFollowing || 0}
              </div>
              <div className="text-xs md:text-sm text-gray-500">Followers</div>
            </div>
            <div>
              <div className="text-lg md:text-xl font-bold text-gray-900">
                {user.following?.length || 0}
              </div>
              <div className="text-xs md:text-sm text-gray-500">Following</div>
            </div>
            <div>
              <div className="text-lg md:text-xl font-bold text-gray-900">
                {totalPosts || 0}
              </div>
              <div className="text-xs md:text-sm text-gray-500">Posts</div>
            </div>
          </div>
          {user.bio && (
            <div>
              <h3 className="text-xs md:text-sm font-medium text-gray-500">
                Bio
              </h3>
              <p className="mt-1 text-sm md:text-base text-gray-900">
                {user.bio}
              </p>
            </div>
          )}
          {user.interests && user.interests.length > 0 && (
            <div>
              <h3 className="text-xs md:text-sm font-medium text-gray-500">
                Interests
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
          {user.socialLinks &&
            Object.values(user.socialLinks).some((link) => link) && (
              <div>
                <h3 className="text-xs md:text-sm font-medium text-gray-500">
                  Connect
                </h3>
                <div className="mt-2 flex flex-wrap gap-3">
                  {user.socialLinks.facebook && (
                    <a
                      href={`https://${user.socialLinks.facebook}`}
                      className="text-blue-600 hover:text-blue-800 flex items-center text-xs md:text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Link className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                      <span>Facebook</span>
                    </a>
                  )}
                  {user.socialLinks.twitter && (
                    <a
                      href={`https://${user.socialLinks.twitter}`}
                      className="text-blue-400 hover:text-blue-600 flex items-center text-xs md:text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Link className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                      <span>Twitter</span>
                    </a>
                  )}
                  {user.socialLinks.instagram && (
                    <a
                      href={`https://${user.socialLinks.instagram}`}
                      className="text-pink-600 hover:text-pink-800 flex items-center text-xs md:text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Link className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                      <span>Instagram</span>
                    </a>
                  )}
                  {user.socialLinks.linkedin && (
                    <a
                      href={`https://${user.socialLinks.linkedin}`}
                      className="text-blue-700 hover:text-blue-900 flex items-center text-xs md:text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Link className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {user.socialLinks.website && (
                    <a
                      href={`https://${user.socialLinks.website}`}
                      className="text-gray-600 hover:text-gray-800 flex items-center text-xs md:text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Link className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                      <span>Website</span>
                    </a>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
