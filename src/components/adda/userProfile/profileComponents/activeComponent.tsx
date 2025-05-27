import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Post, UserDetails } from "@/pages/v2/adda/userProfile";
import { UserInfo } from "@/types";
import { Avatar } from "@radix-ui/react-avatar";
import { FiHeart, FiMail, FiMapPin, FiPhone, FiUser } from "react-icons/fi";
import PostCard, { PostData } from "../../home/addPosts/PostCard";
import RewardsSection from "../rewardsSection";

const ProfileActiveTab = ({
  activeTab,
  userPosts,
  friends,
  userSavedPosts,
  isEditing,
  handleProfileSubmit,
  userDetails,
}: {
  activeTab: string;
  userPosts: Post[];
  friends: UserInfo[];
  userSavedPosts: Post[];
  isEditing: boolean;
  handleProfileSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  userDetails: UserDetails;
}) => {
  return (
    <div className="tab-content">
      {activeTab === "profile" && (
        <Card className="p-4 border border-orange-200 shadow-lg shadow-orange-100/80 rounded-xl">
          <div className="mb-4">
            <h3 className="mb-4 text-xl font-semibold text-gray-800">
              Personal Information
            </h3>
            {isEditing ? (
              <form id="profile-edit-form" onSubmit={handleProfileSubmit}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={userDetails.name}
                      className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EC9600] focus:border-[#EC9600]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={userDetails.email}
                      readOnly
                      className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EC9600] focus:border-[#EC9600] bg-gray-100"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      defaultValue={userDetails.phoneNumber}
                      className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EC9600] focus:border-[#EC9600]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      defaultValue={userDetails.location}
                      className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EC9600] focus:border-[#EC9600]"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      defaultValue={userDetails.bio}
                      rows={4}
                      className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EC9600] focus:border-[#EC9600]"
                    />
                  </div>
                  <div className="flex justify-end mt-2 md:col-span-2">
                    <Button
                      type="submit"
                      className="bg-[#EC9600] hover:bg-[#EC9600]/90"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 gap-4 bg-white md:grid-cols-2">
                <div className="p-3 border border-orange-100 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <div className="flex items-center mt-1">
                    <FiUser className="text-[#EC9600] mr-2" />
                    <p className="text-gray-800">{userDetails?.name}</p>
                  </div>
                </div>
                <div className="p-3 border border-orange-100 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <div className="flex items-center mt-1">
                    <FiMail className="text-[#EC9600] mr-2" />
                    <p className="text-gray-800">{userDetails?.email}</p>
                  </div>
                </div>
                <div className="p-3 border border-orange-100 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <div className="flex items-center mt-1">
                    <FiPhone className="text-[#EC9600] mr-2" />
                    <p className="text-gray-800">{userDetails?.phoneNumber}</p>
                  </div>
                </div>
                <div className="p-3 border border-orange-100 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <div className="flex items-center mt-1">
                    <FiMapPin className="text-[#EC9600] mr-2" />
                    <p className="text-gray-800">{userDetails?.location}</p>
                  </div>
                </div>
                <div className="p-3 border border-orange-100 rounded-lg md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Bio</p>
                  <p className="mt-2 text-gray-800">{userDetails?.bio}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Posts Tab */}
      {activeTab === "posts" && (
        <Card className="p-4 border border-orange-200 shadow-lg shadow-orange-100/80 rounded-xl">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">My Posts</h3>

          {/* Post items */}
          <div className="space-y-4">
            {userPosts.map((post) => (
              <PostCard key={post._id} post={post as unknown as PostData} />
            ))}
          </div>
        </Card>
      )}

      {/* Friends Tab */}
      {activeTab === "friends" && (
        <Card className="p-4 border border-orange-200 shadow-lg shadow-orange-100/80 rounded-xl">
          <h3 className="mb-1 text-xl font-semibold text-gray-800">
            My Friends
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            Friends are users who follow you and whom you follow back.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {friends.map((data, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-3 border border-orange-100 rounded-lg"
              >
                <Avatar className="w-16 h-16 mb-2">
                  <img src={data.picture} alt={data.name} />
                </Avatar>
                <p className="font-medium text-center">
                  {data.name} {index + 1}
                </p>
                <p className="mb-2 text-xs text-gray-500">
                  {data.joined ?? "Unavailable"}
                </p>
                <Button className="mt-1 w-full text-xs h-8 bg-[#EC9600] hover:bg-[#EC9600]/90">
                  Message
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Saved Items Tab */}
      {activeTab === "saved" && (
        <Card className="p-4 border border-orange-200 shadow-lg shadow-orange-100/80 rounded-xl">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">
            Saved Items
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {userSavedPosts.map((item) => (
              <PostCard key={item._id} post={item as unknown as PostData} />
            ))}
          </div>
        </Card>
      )}

      {/* Reward Points Tab */}
      {activeTab === "rewards" && <RewardsSection />}

      {/* Activities Tab */}
      {activeTab === "activities" && (
        <Card className="p-4 border border-orange-200 shadow-lg shadow-orange-100/80 rounded-xl">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">
            Recent Activities
          </h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="p-3 transition-colors border border-orange-100 rounded-lg hover:bg-orange-50"
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full">
                    <FiHeart className="text-[#EC9600]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {item % 2 === 0
                        ? "You commented on a post in 'Creative Arts' group"
                        : "You liked a post by Jane Smith"}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {item} hour{item !== 1 ? "s" : ""} ago
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProfileActiveTab;
