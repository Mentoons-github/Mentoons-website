import { useState } from "react";
import { format } from "date-fns";
import { ProfileUserDetails } from "@/types/adda/userProfile";
import {
  CalendarRange,
  Edit,
  Hourglass,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import ProfileFormModal from "@/pages/v2/adda/userProfile/profieForm";

interface LeftSectionProps {
  userDetails: ProfileUserDetails;
  setUserDetails: React.Dispatch<React.SetStateAction<ProfileUserDetails>>;
  handleProfileSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  removeInterest: (index: number) => void;
  updateInterests: () => Promise<void>;
  totalFollowers: string[];
  totalFollowing: string[];
  setModalType: React.Dispatch<
    React.SetStateAction<"followers" | "following" | "blocked" | null>
  >;
}

const LeftSection = ({
  userDetails,
  setUserDetails,
  handleProfileSubmit,
  removeInterest,
  updateInterests,
  totalFollowers,
  totalFollowing,
  setModalType,
}: LeftSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);

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
            <div className="text-center">
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

            <div className="flex items-center gap-4 sm:gap-6 mt-6 p-2 sm:p-3 bg-gray-50 rounded-xl w-full justify-center">
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

          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base sm:text-lg text-gray-900">
                Personal Info
              </h2>
              <Edit
                className="w-4 h-4 text-gray-400 cursor-pointer hover:text-orange-500 transition-colors"
                onClick={() => setIsEditing(true)}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MapPin className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <span className="text-gray-900 font-medium text-sm">
                    {userDetails.location || "Not provided"}
                  </span>
                  <p className="text-xs text-gray-500">Current Location</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CalendarRange className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <span className="text-gray-900 font-medium text-sm">
                    {userDetails.joinedDate
                      ? format(new Date(userDetails.joinedDate), "MMMM yyyy")
                      : "Not provided"}
                  </span>
                  <p className="text-xs text-gray-500">Member Since</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Hourglass className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <span className="text-gray-900 font-medium text-sm">
                    {userDetails.dateOfBirth
                      ? format(
                          new Date(userDetails.dateOfBirth),
                          "MMMM d, yyyy",
                        )
                      : "Not provided"}
                  </span>
                  <p className="text-xs text-gray-500">Date of Birth</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <span className="text-gray-900 font-medium text-sm">
                    {userDetails.phoneNumber || "Not provided"}
                  </span>
                  <p className="text-xs text-gray-500">Phone</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl h-11 sm:h-12 font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LeftSection;
