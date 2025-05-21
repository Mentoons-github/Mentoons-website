import React from "react";
import { User } from "@/types";

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
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">About</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Basic Information
            </h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500">Name:</span>
                <span className="ml-2 text-gray-900">
                  {user.name || "Not provided"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Location:</span>
                <span className="ml-2 text-gray-900">
                  {user.location || "Not provided"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Date of Birth:</span>
                <span className="ml-2 text-gray-900">
                  {user.dateOfBirth
                    ? formatDate(user.dateOfBirth)
                    : "Not provided"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Joined:</span>
                <span className="ml-2 text-gray-900">
                  {formatDate(user.joinedDate)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Last Active:</span>
                <span className="ml-2 text-gray-900">
                  {user.lastActive
                    ? formatDate(user.lastActive)
                    : "Not available"}
                </span>
              </div>
            </div>
          </div>

          {user.subscription && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Subscription
              </h3>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500">Plan:</span>
                  <span className="ml-2 text-gray-900 capitalize">
                    {user.subscription.plan || "Free"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span className="ml-2 text-gray-900 capitalize">
                    {user.subscription.status || "Inactive"}
                  </span>
                </div>
                {user.subscription.validUntil && (
                  <div>
                    <span className="text-gray-500">Valid Until:</span>
                    <span className="ml-2 text-gray-900">
                      {formatDate(user.subscription.validUntil)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {user.bio && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Bio</h3>
              <p className="mt-2 text-gray-900 whitespace-pre-line">
                {user.bio}
              </p>
            </div>
          )}

          {user.interests && user.interests.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Interests</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
