import React from "react";
import {
  X,
  MapPin,
  Calendar,
  Users,
  UserCheck,
  Globe,
  Clock,
  Crown,
  AlertTriangle,
  Mail,
  FileText,
} from "lucide-react";
import { User } from "@/types";
import { FaUser } from "react-icons/fa6";

interface UserDetailsModalProps {
  user: User | null;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  onClose,
}) => {
  if (!user) return null;

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return null;
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return null;
    }
  };

  const formatDateTime = (date: Date | string | undefined) => {
    if (!date) return null;
    try {
      return new Date(date).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return null;
    }
  };

  const getRoleColor = (role: string) => {
    const roleColors = {
      admin: "bg-red-100 text-red-800 border-red-200",
      moderator: "bg-orange-100 text-orange-800 border-orange-200",
      premium: "bg-purple-100 text-purple-800 border-purple-200",
      user: "bg-blue-100 text-blue-800 border-blue-200",
      editor: "bg-green-100 text-green-800 border-green-200",
    };
    return (
      roleColors[role.toLowerCase() as keyof typeof roleColors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getSubscriptionStatusColor = (status: string) => {
    const statusColors = {
      active: "bg-green-100 text-green-800",
      expired: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    return (
      statusColors[status.toLowerCase() as keyof typeof statusColors] ||
      "bg-gray-100 text-gray-800"
    );
  };

  const getSocialColor = (platform: string) => {
    const colors = {
      facebook: "text-blue-600 hover:bg-blue-50 border-blue-200",
      twitter: "text-sky-500 hover:bg-sky-50 border-sky-200",
      instagram: "text-pink-600 hover:bg-pink-50 border-pink-200",
      linkedin: "text-blue-700 hover:bg-blue-50 border-blue-200",
      website: "text-gray-600 hover:bg-gray-50 border-gray-200",
    };
    return (
      colors[platform as keyof typeof colors] ||
      "text-gray-600 hover:bg-gray-50 border-gray-200"
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Cover Image */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            {user.coverImage ? (
              <img
                src={user.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="https://placehold.co/1200x192"
                alt="No cover image"
                className="w-full h-full object-cover opacity-50"
              />
            )}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Section */}
          <div className="relative px-6 pb-6">
            {/* Profile Picture */}
            <div className="flex items-start justify-between -mt-16 mb-6">
              <div className="relative">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                    {getInitials(user.name)}
                  </div>
                )}
                {user.isBlocked && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                  {user.isBlocked && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                      Blocked
                    </span>
                  )}
                </div>
                <p className="text-gray-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>

              {/* Bio */}
              {user.bio && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                    About
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{user.bio}</p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Personal Details
                  </h3>

                  {user.location && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}

                  {user.dateOfBirth && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Born {formatDate(user.dateOfBirth)}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-gray-600">
                    <FaUser className="w-4 h-4" />
                    <span>Joined {formatDate(user.joinedDate)}</span>
                  </div>

                  {user.lastActive && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Last active {formatDateTime(user.lastActive)}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Statistics
                  </h3>

                  <div className="grid grid-cols-3 gap-4">
                    {user.posts && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-center mb-1">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="text-xl font-bold text-blue-600">
                          {user.posts.length > 0 ? user.posts.length : 0}
                        </div>
                        <div className="text-xs text-blue-600">Posts</div>
                      </div>
                    )}

                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="text-xl font-bold text-green-600">
                        {user.followers.length}
                      </div>
                      <div className="text-xs text-green-600">Followers</div>
                    </div>

                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <UserCheck className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="text-xl font-bold text-purple-600">
                        {user.following.length}
                      </div>
                      <div className="text-xs text-purple-600">Following</div>
                    </div>
                  </div>
                </div>
              </div>

              {user.socialLinks && Object.keys(user.socialLinks).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Social Links
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(user.socialLinks).map(
                      ([platform, url]) =>
                        url && (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${getSocialColor(
                              platform
                            )}`}
                          >
                            {platform === "facebook" && (
                              <Globe className="w-4 h-4" />
                            )}
                            {platform === "twitter" && (
                              <X className="w-4 h-4" />
                            )}
                            {platform === "instagram" && (
                              <Globe className="w-4 h-4" />
                            )}
                            {platform === "linkedin" && (
                              <Globe className="w-4 h-4" />
                            )}
                            {platform === "website" && (
                              <Globe className="w-4 h-4" />
                            )}
                            <span className="text-sm capitalize">
                              {platform}
                            </span>
                          </a>
                        )
                    )}
                  </div>
                </div>
              )}

              {/* Subscription Details */}
              {user.subscription && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Subscription
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Crown className="w-4 h-4" />
                      <span>Plan: {user.subscription.plan}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getSubscriptionStatusColor(
                          user.subscription.status
                        )}`}
                      >
                        Status: {user.subscription.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Started: {formatDate(user.subscription.startDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Valid Until: {formatDate(user.subscription.validUntil)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
