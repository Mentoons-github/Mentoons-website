import React from "react";
import { User } from "@/types";
import { Calendar, MapPin, Link, Mail, User as UserIcon } from "lucide-react";

interface ProfileHeaderProps {
  user: User;
  totalPosts: number;
  totalFollowing: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  totalPosts,
  totalFollowing,
}) => {
  const formatDate = (dateString: Date | string | undefined): string => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
      <div className="md:flex">
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name || "User"}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md object-cover"
              />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md bg-gray-200 flex items-center justify-center">
                <UserIcon size={48} className="text-gray-400" />
              </div>
            )}
            {user.subscription?.plan && user.subscription.plan !== "free" && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded-full">
                {user.subscription.plan}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {user.name || "Unnamed User"}
            </h1>
            <div className="mt-1 flex items-center text-gray-500">
              <Mail className="h-4 w-4 mr-1" />
              <span>{user.email || "No email provided"}</span>
            </div>
            <div className="mt-1 flex items-center text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{user.location || "Location not specified"}</span>
            </div>
            <div className="mt-1 flex items-center text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Joined {formatDate(user.joinedDate)}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {user.role || "USER"}
              </div>
              <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                <span>Last active: </span>
                {user.lastActive
                  ? new Date(user.lastActive).toLocaleDateString()
                  : "Never"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="px-4">
              <div className="text-2xl font-bold text-gray-900">
                {totalFollowing || 0}
              </div>
              <div className="text-sm text-gray-500">Followers</div>
            </div>
            <div className="px-4">
              <div className="text-2xl font-bold text-gray-900">
                {user.following?.length || 0}
              </div>
              <div className="text-sm text-gray-500">Following</div>
            </div>
            <div className="px-4">
              <div className="text-2xl font-bold text-gray-900">
                {totalPosts || 0}
              </div>
              <div className="text-sm text-gray-500">Posts</div>
            </div>
          </div>
        </div>
      </div>

      {user.bio && (
        <div className="px-6 md:px-8 pb-6">
          <h3 className="text-sm font-medium text-gray-500">Bio</h3>
          <p className="mt-1 text-gray-900">{user.bio}</p>
        </div>
      )}

      {user.interests && user.interests.length > 0 && (
        <div className="px-6 md:px-8 pb-6">
          <h3 className="text-sm font-medium text-gray-500">Interests</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {user.interests.map((interest, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {user.socialLinks &&
        Object.values(user.socialLinks).some((link) => link) && (
          <div className="px-6 md:px-8 pb-6">
            <h3 className="text-sm font-medium text-gray-500">Social Links</h3>
            <div className="mt-2 flex flex-wrap gap-3">
              {user.socialLinks.facebook && (
                <a
                  href={`https://${user.socialLinks.facebook}`}
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Link className="h-4 w-4 mr-1" />
                  <span>Facebook</span>
                </a>
              )}
              {user.socialLinks.twitter && (
                <a
                  href={`https://${user.socialLinks.twitter}`}
                  className="text-blue-400 hover:text-blue-600 flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Link className="h-4 w-4 mr-1" />
                  <span>Twitter</span>
                </a>
              )}
              {user.socialLinks.instagram && (
                <a
                  href={`https://${user.socialLinks.instagram}`}
                  className="text-pink-600 hover:text-pink-800 flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Link className="h-4 w-4 mr-1" />
                  <span>Instagram</span>
                </a>
              )}
              {user.socialLinks.linkedin && (
                <a
                  href={`https://${user.socialLinks.linkedin}`}
                  className="text-blue-700 hover:text-blue-900 flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Link className="h-4 w-4 mr-1" />
                  <span>LinkedIn</span>
                </a>
              )}
              {user.socialLinks.website && (
                <a
                  href={`https://${user.socialLinks.website}`}
                  className="text-gray-600 hover:text-gray-800 flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Link className="h-4 w-4 mr-1" />
                  <span>Website</span>
                </a>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default ProfileHeader;
