import { Card } from "@/components/ui/card";
import { User } from "@/types";
import React from "react";
import { FiCalendar, FiClock, FiMapPin, FiTag, FiUser } from "react-icons/fi";

interface AboutSectionProps {
  user: User;
}

const AboutSection: React.FC<AboutSectionProps> = ({ user }) => {
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
    <Card className="border border-orange-200 shadow-lg shadow-orange-100/80 rounded-xl">
      <div className="p-6">
        <h3 className="mb-3 font-semibold text-orange-600 text-md">
          Personal Information
        </h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Basic Info */}
            <div className="p-3 border border-orange-100 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <div className="flex items-center mt-1">
                <FiUser className="mr-2 text-orange-500" />
                <p className="text-gray-800">{user.name || "Not provided"}</p>
              </div>
            </div>

            <div className="p-3 border border-orange-100 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Location</p>
              <div className="flex items-center mt-1">
                <FiMapPin className="mr-2 text-orange-500" />
                <p className="text-gray-800">
                  {user.location || "Not provided"}
                </p>
              </div>
            </div>

            <div className="p-3 border border-orange-100 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Date of Birth</p>
              <div className="flex items-center mt-1">
                <FiCalendar className="mr-2 text-orange-500" />
                <p className="text-gray-800">
                  {user.dateOfBirth
                    ? formatDate(user.dateOfBirth)
                    : "Not provided"}
                </p>
              </div>
            </div>

            <div className="p-3 border border-orange-100 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Joined Date</p>
              <div className="flex items-center mt-1">
                <FiClock className="mr-2 text-orange-500" />
                <p className="text-gray-800">{formatDate(user.joinedDate)}</p>
              </div>
            </div>

            <div className="p-3 border border-orange-100 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Last Active</p>
              <div className="flex items-center mt-1">
                <FiClock className="mr-2 text-orange-500" />
                <p className="text-gray-800">
                  {user.lastActive
                    ? formatDate(user.lastActive)
                    : "Not available"}
                </p>
              </div>
            </div>
          </div>
          {/* Bio */}
          {user.bio && (
            <div className="p-4 mt-4 border border-orange-100 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Bio</p>
              <div className="flex mt-2">
                <p className="text-gray-800 whitespace-pre-line">{user.bio}</p>
              </div>
            </div>
          )}

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <div className="p-4 mt-4 border border-orange-100 rounded-lg">
              <p className="mb-2 text-sm font-medium text-gray-500">
                Interests
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="flex items-center px-3 py-1 text-sm text-orange-500 bg-orange-100 rounded-full"
                  >
                    <FiTag className="mr-1" />
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AboutSection;
