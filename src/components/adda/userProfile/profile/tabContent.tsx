import { format } from "date-fns";
import { ProfilePost } from "@/types/adda/userProfile";
import RewardsSection from "@/components/adda/userProfile/rewardsSection";
import { PostData } from "@/components/adda/home/addPosts/PostCard";
import { ProfileUserDetails } from "@/types/adda/userProfile";
import { NavLink, useNavigate } from "react-router-dom";
import ProfilePostCard from "../../home/addPosts/ProfilePostCard";

interface ProfileTabContentProps {
  activeTab: string;
  userPosts: ProfilePost[];
  userSavedPosts: ProfilePost[];
  userDetails: ProfileUserDetails;
  setUserPosts: React.Dispatch<React.SetStateAction<ProfilePost[]>>;
  setShowCompletionForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileTabContent = ({
  activeTab,
  userPosts,
  userSavedPosts,
  userDetails,
  setUserPosts,
  setShowCompletionForm,
}: ProfileTabContentProps) => {
  const navigate = useNavigate();

  switch (activeTab) {
    case "Posts":
      return (
        <div className="space-y-4 sm:space-y-6 mt-6 sm:mt-8 overflow-y-auto ">
          {userPosts.length === 0 ? (
            <div className="text-center py-10 sm:py-12 lg:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl">📝</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6">
                Share your first post with the community!
              </p>
              {/* <button className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-sm sm:text-base">
                Create Post
              </button> */}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto ">
              {userPosts.map((post) => (
                <div
                  onClick={() => navigate(`/adda/post/${post._id}`)}
                  className="flex flex-col items-center justify-start w-full gap-5 p-2 border border-orange-200 rounded-xl min-h-fit"
                >
                  <ProfilePostCard
                    setUserPosts={setUserPosts}
                    isUser={true}
                    key={post._id}
                    post={post as unknown as PostData}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      );
    case "Rewards":
      return (
        <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8">
          <RewardsSection />
        </div>
      );
    case "Saved":
      return (
        <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8">
          {userSavedPosts.length === 0 ? (
            <div className="text-center py-10 sm:py-12 lg:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl">📚</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                No saved items yet
              </h3>
              <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6">
                Save interesting content to view it here later!
              </p>
              <NavLink
                to={"/adda"}
                className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
              >
                Explore Content
              </NavLink>
            </div>
          ) : (
            userSavedPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">
                  {post.content?.slice(0, 50)}...
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
                  Posted by {post.user.name}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Saved {format(new Date(post.createdAt), "MMMM d, yyyy")}
                  </span>
                  <button
                    className="text-orange-500 hover:text-orange-600 text-xs sm:text-sm font-medium"
                    onClick={() => navigate(`/adda/post/${post._id}`)}
                  >
                    View →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      );
    case "Details":
      return (
        <div className="space-y-4 sm:space-y-6 mt-6 sm:mt-8">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Profile Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              {userDetails.name && (
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-600">
                    Name
                  </h3>
                  <p className="text-gray-900 text-sm sm:text-base">
                    {userDetails.name}
                  </p>
                </div>
              )}
              {userDetails.email && (
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-600">
                    Email
                  </h3>
                  <p className="text-gray-900 text-sm sm:text-base">
                    {userDetails.email}
                  </p>
                </div>
              )}
              {userDetails.phoneNumber && (
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-600">
                    Phone Number
                  </h3>
                  <p className="text-gray-900 text-sm sm:text-base">
                    {userDetails.phoneNumber}
                  </p>
                </div>
              )}
              {userDetails.location && (
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-600">
                    Location
                  </h3>
                  <p className="text-gray-900 text-sm sm:text-base">
                    {userDetails.location}
                  </p>
                </div>
              )}
              {userDetails.bio && (
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-600">
                    Bio
                  </h3>
                  <p className="text-gray-900 text-sm sm:text-base">
                    {userDetails.bio}
                  </p>
                </div>
              )}
              {userDetails.education && (
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-600">
                    Education
                  </h3>
                  <p className="text-gray-900 text-sm sm:text-base">
                    {userDetails.education}
                  </p>
                </div>
              )}
              {userDetails.occupation && (
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-600">
                    Occupation
                  </h3>
                  <p className="text-gray-900 text-sm sm:text-base">
                    {userDetails.occupation}
                  </p>
                </div>
              )}
              {userDetails.interests && userDetails.interests.length > 0 && (
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-600">
                    Interests
                  </h3>
                  <p className="text-gray-900 text-sm sm:text-base">
                    {userDetails.interests.join(", ")}
                  </p>
                </div>
              )}
              {userDetails.dateOfBirth && (
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-600">
                    Date of Birth
                  </h3>
                  <p className="text-gray-900 text-sm sm:text-base">
                    {new Date(userDetails.dateOfBirth).toLocaleDateString(
                      "en-En",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              )}
              {userDetails.gender && (
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-600">
                    Gender
                  </h3>
                  <p className="text-gray-900 text-sm sm:text-base">
                    {userDetails.gender}
                  </p>
                </div>
              )}
              {userDetails.socialLinks &&
                userDetails.socialLinks.length > 0 && (
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-600">
                      Social Links
                    </h3>
                    <ul className="list-disc list-inside text-sm sm:text-base">
                      {userDetails.socialLinks.map((link, index) => (
                        <li key={index}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-500 hover:text-orange-600"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              {userDetails.joinedDate && (
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-600">
                    Joined Date
                  </h3>
                  <p className="text-gray-900 text-sm sm:text-base">
                    {format(new Date(userDetails.joinedDate), "MMMM d, yyyy")}
                  </p>
                </div>
              )}
            </div>
            {Object.values(userDetails).every(
              (value) => !value || (Array.isArray(value) && value.length === 0)
            ) && (
              <div className="text-center py-10 sm:py-12 lg:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-2xl sm:text-3xl">ℹ️</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  No profile details available
                </h3>
                <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6">
                  Complete your profile to share more about yourself!
                </p>
                <button
                  onClick={() => setShowCompletionForm(true)}
                  className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
                >
                  Complete Profile
                </button>
              </div>
            )}
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default ProfileTabContent;
