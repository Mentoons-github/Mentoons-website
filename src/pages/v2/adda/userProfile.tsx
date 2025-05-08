import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import {
  FaBookmark,
  FaCalendarAlt,
  FaCamera,
  FaCrown,
  FaGift,
  FaImage,
  FaMedal,
  FaUsers,
} from "react-icons/fa";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiAward,
  FiCalendar,
  FiCheck,
  FiEdit2,
  FiHeart,
  FiHome,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import { Link } from "react-router-dom";

// Shadcn UI components
import PostCard from "@/components/adda/home/addPosts/PostCard";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "sonner";
import { Avatar } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";

// Define interface for user data
interface UserData {
  name: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  joinedDate: string;
  bio: string;
  education: string;
  occupation: string;
  interests: string[];
  stats: {
    posts: number;
    friends: number;
    groups: number;
  };
  [key: string]: any; // Allow indexing with string
}

// Define interface for profile field
interface ProfileField {
  field: string;
  label: string;
  minLength?: number;
}

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [userPosts, setUserPosts] = useState<any[]>([]);

  const [userSavedPosts, setUserSavedPosts] = useState<any[]>([]);

  const [userDetails, setUserDetails] = useState<any>({});

  const { getToken } = useAuth();
  const { user } = useUser();
  // const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock user data with some missing fields to demonstrate incomplete profile
  const userData: UserData = {
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    email: "john.doe@example.com",
    phone: "", // Missing phone
    location: "New York, USA",
    joinedDate: "January 2023",
    bio: "", // Missing bio
    education: "", // Missing education
    occupation: "", // Missing occupation
    interests: ["Reading"], // Incomplete interests
    stats: {
      posts: 24,
      friends: 186,
      groups: 5,
    },
  };

  // Calculate profile completion percentage
  const profileFields: ProfileField[] = [
    { field: "name", label: "Name" },
    { field: "avatar", label: "Profile Picture" },
    { field: "email", label: "Email" },
    { field: "phone", label: "Phone Number" },
    { field: "location", label: "Location" },
    { field: "bio", label: "Bio" },
    { field: "education", label: "Education" },
    { field: "occupation", label: "Occupation" },
    { field: "interests", label: "Interests", minLength: 3 },
  ];

  const getProfileCompletion = () => {
    let completedFields = 0;

    profileFields.forEach((field) => {
      if (field.field === "interests") {
        if (
          userData.interests &&
          userData.interests.length >= (field.minLength || 1)
        ) {
          completedFields++;
        }
      } else if (
        userData[field.field] &&
        userData[field.field].toString().trim() !== ""
      ) {
        completedFields++;
      }
    });

    return Math.round((completedFields / profileFields.length) * 100);
  };

  const profileCompletionPercentage = getProfileCompletion();
  const isProfileComplete = profileCompletionPercentage === 100;

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, save the form data to the backend
    // For demo purposes, just show confetti
    setShowCompletionForm(false);
    setShowConfetti(true);

    // Hide confetti after 5 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  useEffect(() => {
    const fetchUsersPost = async () => {
      try {
        const token = await getToken();
        if (!token) {
          throw new Error("No token found");
        }
        const response = await axios.get(
          `http://localhost:4000/api/v1/posts/user/${user?.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.data);
        setUserPosts(response.data.data);
        toast.success("Posts fetched successfully");
      } catch (error) {
        console.log(error);
        toast.error("Error fetching posts");
      }
    };
    fetchUsersPost();
  }, []);

  useEffect(() => {
    const fetchUserSavedPosts = async () => {
      try {
        const token = await getToken();
        if (!token) {
          throw new Error("No token found");
        }
        const response = await axios.get(
          `http://localhost:4000/api/v1/feeds/saved`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setUserSavedPosts(response.data.data);
      } catch (error) {
        console.log(error);
        toast.error("Error fetching saved posts");
      }
    };
    fetchUserSavedPosts();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = await getToken();
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get(
        `http://localhost:4000/api/v1/user/user/${user?.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setUserDetails(response.data.data);
    };
    fetchUserDetails();
  }, [user?.id]);

  return (
    <>
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      <div className="flex items-start justify-center w-full p-2 max-w-8xl sm:p-3 md:p-4">
        <div className="relative flex flex-col w-full">
          {/* Profile Header */}
          <div className="sticky left-0 top-[64px] z-[99999] bg-white">
            <div className="flex items-center justify-between w-full p-3 border-b border-orange-200">
              <div className="flex items-center">
                <Link
                  to="/adda"
                  className="mr-3 flex items-center text-[#EC9600] hover:text-[#EC9600]/80"
                >
                  <FiArrowLeft className="mr-1" size={18} />
                  <span className="text-sm font-medium">Back to Adda</span>
                </Link>
                <h1 className="text-xl font-semibold text-gray-800 md:text-2xl">
                  My Profile
                </h1>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm border-[#EC9600] text-[#EC9600] hover:bg-orange-50"
              >
                <FiEdit2 className="mr-2" />{" "}
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            </div>
          </div>

          {/* Profile Completion Alert - Show only if profile is incomplete */}
          {!isProfileComplete && !showCompletionForm && (
            <div className="p-4 mt-4 border bg-amber-50 border-amber-200 rounded-xl">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="w-5 h-5 text-amber-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">
                    Your profile is incomplete
                  </h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>
                      Please complete your profile to get the most out of
                      Mentoons Adda.
                    </p>
                    <div className="mt-2">
                      <div className="relative h-2 overflow-hidden rounded-full bg-amber-100">
                        <div
                          className="absolute left-0 top-0 h-full bg-[#EC9600]"
                          style={{ width: `${profileCompletionPercentage}%` }}
                        ></div>
                      </div>
                      <p className="mt-1 text-xs text-amber-600">
                        {profileCompletionPercentage}% complete
                      </p>
                    </div>
                    <Button
                      className="mt-3 bg-[#EC9600] hover:bg-[#EC9600]/90 text-white"
                      onClick={() => setShowCompletionForm(true)}
                    >
                      Complete Your Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Completion Form */}
          {showCompletionForm && (
            <div className="mt-4">
              <Card className="p-6 border border-orange-200 shadow-lg shadow-orange-100/80 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Complete Your Profile
                  </h2>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className="bg-[#EC9600] h-2.5 rounded-full"
                        style={{ width: `${profileCompletionPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {profileCompletionPercentage}%
                    </span>
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Prefilled fields */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue={userDetails.name}
                        className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EC9600] focus:border-[#EC9600]"
                      />
                      {userDetails.name && (
                        <FiCheck className="inline ml-2 text-green-500" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={userDetails.email}
                        className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EC9600] focus:border-[#EC9600]"
                      />
                      {userDetails.email && (
                        <FiCheck className="inline ml-2 text-green-500" />
                      )}
                    </div>

                    {/* Missing fields highlighted */}
                    <div className="space-y-1">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        Phone Number
                        {!userDetails.phone && (
                          <span className="ml-2 text-xs font-normal text-amber-600">
                            (Missing)
                          </span>
                        )}
                      </label>
                      <input
                        type="tel"
                        placeholder="Add your phone number"
                        defaultValue={userDetails.phone}
                        className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EC9600] focus:border-[#EC9600]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        type="text"
                        defaultValue={userDetails.location}
                        className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EC9600] focus:border-[#EC9600]"
                      />
                      {userDetails?.location && (
                        <FiCheck className="inline ml-2 text-green-500" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        Education
                        {!userDetails?.education && (
                          <span className="ml-2 text-xs font-normal text-amber-600">
                            (Missing)
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        placeholder="Add your education"
                        defaultValue={userDetails?.education}
                        className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EC9600] focus:border-[#EC9600]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        Occupation
                        {!userDetails?.occupation && (
                          <span className="ml-2 text-xs font-normal text-amber-600">
                            (Missing)
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        placeholder="Add your occupation"
                        defaultValue={userDetails?.occupation}
                        className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EC9600] focus:border-[#EC9600]"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        Bio
                        {!userDetails?.bio && (
                          <span className="ml-2 text-xs font-normal text-amber-600">
                            (Missing)
                          </span>
                        )}
                      </label>
                      <textarea
                        placeholder="Tell us about yourself"
                        defaultValue={userDetails?.bio}
                        rows={4}
                        className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EC9600] focus:border-[#EC9600]"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        Interests
                        {userDetails.interests &&
                          userDetails.interests.length < 3 && (
                            <span className="ml-2 text-xs font-normal text-amber-600">
                              (Add at least 3 interests)
                            </span>
                          )}
                      </label>
                      <div className="p-2 border border-orange-200 rounded-md">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {userDetails.interests.map(
                            (interest: string, index: number) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-orange-100 text-[#EC9600] rounded-full text-sm"
                              >
                                {interest}
                              </span>
                            )
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add an interest"
                            id="new-interest"
                            className="flex-1 p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EC9600] focus:border-[#EC9600]"
                          />
                          <Button
                            type="button"
                            className="bg-[#EC9600] hover:bg-[#EC9600]/90"
                            onClick={() => {
                              const interestInput = document.getElementById(
                                "new-interest"
                              ) as HTMLInputElement;
                              if (interestInput && interestInput.value.trim()) {
                                userDetails.interests = [
                                  ...userDetails.interests,
                                  interestInput.value.trim(),
                                ];
                                interestInput.value = "";
                              }
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[#EC9600] text-[#EC9600] hover:bg-orange-50"
                      onClick={() => setShowCompletionForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#EC9600] hover:bg-[#EC9600]/90"
                    >
                      Complete Profile
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}

          {/* Main content area - only show if not displaying the completion form */}
          {!showCompletionForm && (
            <div className="flex flex-col w-full mt-4 md:flex-row md:gap-4 lg:gap-6">
              {/* Left sidebar */}
              <div className="flex-shrink-0 w-full md:w-1/3 lg:w-1/4">
                <div className="sticky top-[130px] flex flex-col gap-4">
                  {/* User Card */}
                  <Card className="overflow-hidden border border-orange-200 shadow-lg shadow-orange-100/80 rounded-xl">
                    <div className="relative h-24 bg-gradient-to-r from-[#EC9600] to-amber-400">
                      <Button
                        className="absolute w-8 h-8 p-0 rounded-full top-2 right-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                        onClick={() => {}}
                      >
                        <FaCamera className="text-white" />
                      </Button>
                    </div>

                    <div className="flex flex-col items-center px-4 pb-4 -mt-12">
                      <div className="relative">
                        <Avatar className="w-24 h-24 ring-4 ring-white">
                          <img
                            src={userDetails.picture}
                            alt={userDetails.name}
                          />
                        </Avatar>
                        <Button
                          className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-[#EC9600] text-white hover:bg-[#EC9600]/90"
                          onClick={() => {}}
                        >
                          <FiEdit2 size={14} />
                        </Button>
                      </div>

                      <h2 className="mt-3 text-lg font-bold text-gray-800">
                        {userDetails.name}
                      </h2>
                      <p className="flex items-center mt-1 text-sm text-gray-600">
                        <FiMapPin className="mr-1" size={14} />{" "}
                        {userDetails.location}
                      </p>
                      <p className="flex items-center mt-1 text-xs text-gray-500">
                        <FiCalendar className="mr-1" size={12} /> Joined{" "}
                        {userDetails.joinedDate}
                      </p>

                      {/* Profile Completion Badge */}
                      {!isProfileComplete && (
                        <div className="w-full mt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Profile Completion
                            </span>
                            <span className="text-xs font-medium text-[#EC9600]">
                              {profileCompletionPercentage}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-orange-100 rounded-full mt-1">
                            <div
                              className="h-1.5 bg-[#EC9600] rounded-full"
                              style={{
                                width: `${profileCompletionPercentage}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* User Stats */}
                      <div className="flex justify-between w-full pt-4 mt-4 border-t border-orange-200">
                        <div className="text-center">
                          <p className="font-bold text-xl text-[#EC9600]">
                            {userDetails?.posts?.length || 0}
                          </p>
                          <p className="text-xs text-gray-600">Posts</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-xl text-[#EC9600]">
                            {userDetails?.friends?.length || 0}
                          </p>
                          <p className="text-xs text-gray-600">Friends</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-xl text-[#EC9600]">
                            {userDetails?.groups?.length || 0}
                          </p>
                          <p className="text-xs text-gray-600">Groups</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Interests Section */}
                  <Card className="p-4 border border-orange-200 shadow-lg shadow-orange-100/80 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Interests
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#EC9600] hover:text-[#EC9600]/90 p-0"
                      >
                        <FiEdit2 size={16} />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {userDetails?.interests &&
                        userDetails?.interests.map(
                          (interest: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-orange-100 text-[#EC9600] rounded-full text-sm"
                            >
                              {interest}
                            </span>
                          )
                        )}
                    </div>
                  </Card>

                  {/* Suggested Friends - Similar to friend request on home page */}
                  <Card className="p-4 border border-orange-200 shadow-lg shadow-orange-100/80 rounded-xl">
                    <h3 className="mb-3 text-lg font-semibold text-gray-800">
                      Suggested Friends
                    </h3>
                    <div className="space-y-3">
                      {[1, 2, 3].map((item) => (
                        <div
                          key={item}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="w-10 h-10">
                              <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Friend${item}`}
                                alt="Friend"
                              />
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                Friend Name {item}
                              </p>
                              <p className="text-xs text-gray-500">
                                12 mutual friends
                              </p>
                            </div>
                          </div>
                          <Button className="text-xs h-8 bg-[#EC9600] hover:bg-[#EC9600]/90">
                            Connect
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>

              {/* Main Content */}
              <div className="w-full md:flex-1 lg:max-w-[75%] mt-4 md:mt-0">
                {/* Navigation Tabs */}
                <Card className="p-2 mb-4 border border-orange-200 shadow-lg shadow-orange-100/80 rounded-xl">
                  <div className="flex pb-1 space-x-2 overflow-x-auto">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap flex items-center ${
                        activeTab === "profile"
                          ? "bg-[#EC9600] text-white"
                          : "hover:bg-orange-50"
                      }`}
                    >
                      <FiUser className="mr-2" /> Profile Info
                    </button>
                    <button
                      onClick={() => setActiveTab("posts")}
                      className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap flex items-center ${
                        activeTab === "posts"
                          ? "bg-[#EC9600] text-white"
                          : "hover:bg-orange-50"
                      }`}
                    >
                      <FaImage className="mr-2" /> My Posts
                    </button>
                    <button
                      onClick={() => setActiveTab("friends")}
                      className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap flex items-center ${
                        activeTab === "friends"
                          ? "bg-[#EC9600] text-white"
                          : "hover:bg-orange-50"
                      }`}
                    >
                      <FaUsers className="mr-2" /> Friends
                    </button>
                    <button
                      onClick={() => setActiveTab("saved")}
                      className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap flex items-center ${
                        activeTab === "saved"
                          ? "bg-[#EC9600] text-white"
                          : "hover:bg-orange-50"
                      }`}
                    >
                      <FaBookmark className="mr-2" /> Saved
                    </button>
                    <button
                      onClick={() => setActiveTab("rewards")}
                      className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap flex items-center ${
                        activeTab === "rewards"
                          ? "bg-[#EC9600] text-white"
                          : "hover:bg-orange-50"
                      }`}
                    >
                      <FiAward className="mr-2" /> Reward Points
                    </button>
                    <button
                      onClick={() => setActiveTab("activities")}
                      className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap flex items-center ${
                        activeTab === "activities"
                          ? "bg-[#EC9600] text-white"
                          : "hover:bg-orange-50"
                      }`}
                    >
                      <FaCalendarAlt className="mr-2" /> Activities
                    </button>
                  </div>
                </Card>

                {/* Tab Content */}
                <div className="tab-content">
                  {/* Profile Info Tab */}
                  {activeTab === "profile" && (
                    <Card className="p-4 border border-orange-200 shadow-lg shadow-orange-100/80 rounded-xl">
                      <div className="mb-4">
                        <h3 className="mb-4 text-xl font-semibold text-gray-800">
                          Personal Information
                        </h3>
                        {isEditing ? (
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                              <label className="text-sm font-medium text-gray-700">
                                Full Name
                              </label>
                              <input
                                type="text"
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
                                defaultValue={userDetails.email}
                                className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EC9600] focus:border-[#EC9600]"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-sm font-medium text-gray-700">
                                Phone
                              </label>
                              <input
                                type="tel"
                                defaultValue={userDetails.phone}
                                className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EC9600] focus:border-[#EC9600]"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-sm font-medium text-gray-700">
                                Location
                              </label>
                              <input
                                type="text"
                                defaultValue={userDetails.location}
                                className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EC9600] focus:border-[#EC9600]"
                              />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <label className="text-sm font-medium text-gray-700">
                                Bio
                              </label>
                              <textarea
                                defaultValue={userDetails.bio}
                                rows={4}
                                className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EC9600] focus:border-[#EC9600]"
                              />
                            </div>
                            <div className="flex justify-end mt-2 md:col-span-2">
                              <Button className="bg-[#EC9600] hover:bg-[#EC9600]/90">
                                Save Changes
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-4 bg-white md:grid-cols-2">
                            <div className="p-3 border border-orange-100 rounded-lg">
                              <p className="text-sm font-medium text-gray-500">
                                Full Name
                              </p>
                              <div className="flex items-center mt-1">
                                <FiUser className="text-[#EC9600] mr-2" />
                                <p className="text-gray-800">
                                  {userDetails.name}
                                </p>
                              </div>
                            </div>
                            <div className="p-3 border border-orange-100 rounded-lg">
                              <p className="text-sm font-medium text-gray-500">
                                Email
                              </p>
                              <div className="flex items-center mt-1">
                                <FiMail className="text-[#EC9600] mr-2" />
                                <p className="text-gray-800">
                                  {userDetails?.email}
                                </p>
                              </div>
                            </div>
                            <div className="p-3 border border-orange-100 rounded-lg">
                              <p className="text-sm font-medium text-gray-500">
                                Phone
                              </p>
                              <div className="flex items-center mt-1">
                                <FiPhone className="text-[#EC9600] mr-2" />
                                <p className="text-gray-800">
                                  {userDetails?.phone}
                                </p>
                              </div>
                            </div>
                            <div className="p-3 border border-orange-100 rounded-lg">
                              <p className="text-sm font-medium text-gray-500">
                                Location
                              </p>
                              <div className="flex items-center mt-1">
                                <FiMapPin className="text-[#EC9600] mr-2" />
                                <p className="text-gray-800">
                                  {userDetails?.location}
                                </p>
                              </div>
                            </div>
                            <div className="p-3 border border-orange-100 rounded-lg md:col-span-2">
                              <p className="text-sm font-medium text-gray-500">
                                Bio
                              </p>
                              <p className="mt-2 text-gray-800">
                                {userDetails?.bio}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* <div className="mt-6">
                        <h3 className="mb-4 text-xl font-semibold text-gray-800">
                          Account Settings
                        </h3>
                        <div className="space-y-3">
                          <div className="p-3 transition-colors border border-orange-100 rounded-lg cursor-pointer hover:bg-orange-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full">
                                  <FiSettings className="text-[#EC9600]" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">
                                    Privacy Settings
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Manage your privacy preferences
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                className="text-[#EC9600]"
                              >
                                Manage
                              </Button>
                            </div>
                          </div>

                          <div className="p-3 transition-colors border border-orange-100 rounded-lg cursor-pointer hover:bg-orange-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full">
                                  <FiSettings className="text-[#EC9600]" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">
                                    Notification Preferences
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Update how you receive notifications
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                className="text-[#EC9600]"
                              >
                                Manage
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div> */}
                    </Card>
                  )}

                  {/* Posts Tab */}
                  {activeTab === "posts" && (
                    <Card className="p-4 border border-orange-200 shadow-lg shadow-orange-100/80 rounded-xl">
                      <h3 className="mb-4 text-xl font-semibold text-gray-800">
                        My Posts
                      </h3>

                      {/* Post creation box similar to AddPosts component */}
                      {/* <div className="flex flex-col items-center justify-start w-full p-4 mb-4 border border-orange-200 rounded-xl">
                        <div className="flex items-center w-full gap-3">
                          <div className="flex-shrink-0 w-10 h-10 overflow-hidden bg-transparent rounded-full">
                            <img
                              src={userData.avatar}
                              alt={userData.name}
                              className="object-cover w-full h-full rounded-full"
                            />
                          </div>
                          <div className="flex-grow">
                            <input
                              type="text"
                              placeholder="What's in your mind?"
                              className="w-full px-4 py-2 text-sm border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-[#EC9600]"
                            />
                          </div>
                        </div>

                        <hr className="w-full my-3 border-orange-200" />

                        <div className="flex items-center justify-between w-full">
                          <button className="flex items-center gap-2 p-1 transition-colors rounded-lg hover:bg-orange-50">
                            <FaImage className="text-[#EC9600]" />
                            <span className="text-sm font-medium text-gray-600">
                              Photo
                            </span>
                          </button>
                          <button className="flex items-center gap-2 p-1 transition-colors rounded-lg hover:bg-orange-50">
                            <FaVideo className="text-[#EC9600]" />
                            <span className="text-sm font-medium text-gray-600">
                              Video
                            </span>
                          </button>
                          <button className="flex items-center gap-2 p-1 transition-colors rounded-lg hover:bg-orange-50">
                            <FaCalendarAlt className="text-[#EC9600]" />
                            <span className="text-sm font-medium text-gray-600">
                              Event
                            </span>
                          </button>
                        </div>
                      </div> */}

                      {/* Post items */}
                      <div className="space-y-4">
                        {userPosts.map((post) => (
                          <PostCard key={post._id} post={post} />
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Friends Tab */}
                  {activeTab === "friends" && (
                    <Card className="p-4 border border-orange-200 shadow-lg shadow-orange-100/80 rounded-xl">
                      <h3 className="mb-4 text-xl font-semibold text-gray-800">
                        My Friends
                      </h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center p-3 border border-orange-100 rounded-lg"
                          >
                            <Avatar className="w-16 h-16 mb-2">
                              <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Friend${index}`}
                                alt="Friend"
                              />
                            </Avatar>
                            <p className="font-medium text-center">
                              Friend Name {index + 1}
                            </p>
                            <p className="mb-2 text-xs text-gray-500">
                              Joined Jan 2023
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
                          <PostCard key={item._id} post={item} />
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Reward Points Tab */}
                  {activeTab === "rewards" && (
                    <Card className="p-4 border border-orange-200 shadow-lg shadow-orange-100/80 rounded-xl">
                      <h3 className="mb-4 text-xl font-semibold text-gray-800">
                        Your Reward Points
                      </h3>

                      {/* Points Overview */}
                      <div className="p-4 mb-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
                        <div className="flex flex-col items-center justify-between md:flex-row">
                          <div className="flex items-center mb-4 md:mb-0">
                            <div className="h-16 w-16 rounded-full bg-[#EC9600] flex items-center justify-center mr-4">
                              <FaCrown className="text-3xl text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Total Points
                              </p>
                              <p className="text-3xl font-bold text-gray-800">
                                1,250
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-center md:items-end">
                            <p className="mb-1 text-sm text-gray-600">
                              Current Level
                            </p>
                            <div className="flex items-center">
                              <FaMedal className="text-[#EC9600] mr-2" />
                              <p className="font-semibold text-gray-800">
                                Silver Member
                              </p>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                              750 more points to Gold
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Reward Tiers */}
                      <div className="mb-6">
                        <h4 className="mb-3 text-lg font-semibold text-gray-800">
                          Reward Tiers
                        </h4>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                          <div className="p-3 border border-orange-100 rounded-lg bg-orange-50">
                            <div className="flex items-center mb-2">
                              <div className="flex items-center justify-center w-8 h-8 mr-2 bg-gray-400 rounded-full">
                                <FaMedal className="text-sm text-white" />
                              </div>
                              <p className="font-medium text-gray-800">
                                Bronze
                              </p>
                            </div>
                            <p className="text-sm text-gray-600">
                              0 - 1,000 points
                            </p>
                            <ul className="mt-2 space-y-1 text-xs text-gray-600">
                              <li>• Access to basic features</li>
                              <li>• Weekly newsletter</li>
                            </ul>
                          </div>
                          <div className="p-3 border border-orange-100 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200">
                            <div className="flex items-center mb-2">
                              <div className="flex items-center justify-center w-8 h-8 mr-2 bg-gray-500 rounded-full">
                                <FaMedal className="text-sm text-white" />
                              </div>
                              <p className="font-medium text-gray-800">
                                Silver (Current)
                              </p>
                            </div>
                            <p className="text-sm text-gray-600">
                              1,000 - 2,000 points
                            </p>
                            <ul className="mt-2 space-y-1 text-xs text-gray-600">
                              <li>• All Bronze benefits</li>
                              <li>• Exclusive content access</li>
                              <li>• Monthly digital rewards</li>
                            </ul>
                          </div>
                          <div className="p-3 border border-orange-100 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-100">
                            <div className="flex items-center mb-2">
                              <div className="flex items-center justify-center w-8 h-8 mr-2 bg-yellow-500 rounded-full">
                                <FaMedal className="text-sm text-white" />
                              </div>
                              <p className="font-medium text-gray-800">Gold</p>
                            </div>
                            <p className="text-sm text-gray-600">
                              2,000+ points
                            </p>
                            <ul className="mt-2 space-y-1 text-xs text-gray-600">
                              <li>• All Silver benefits</li>
                              <li>• Premium workshop access</li>
                              <li>• Merchandise discounts</li>
                              <li>• Priority support</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Available Rewards */}
                      <div className="mb-6">
                        <h4 className="mb-3 text-lg font-semibold text-gray-800">
                          Available Rewards
                        </h4>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                          {[
                            {
                              name: "Digital Sticker Pack",
                              points: 100,
                              image: "stickers",
                            },
                            {
                              name: "Exclusive E-Book",
                              points: 350,
                              image: "ebook",
                            },
                            {
                              name: "Premium Workshop",
                              points: 500,
                              image: "workshop",
                            },
                            {
                              name: "Mentoons Merchandise",
                              points: 750,
                              image: "merch",
                            },
                          ].map((reward, index) => (
                            <div
                              key={index}
                              className="overflow-hidden border border-orange-100 rounded-lg"
                            >
                              <div className="flex items-center justify-center h-32 bg-orange-100">
                                <FaGift className="text-[#EC9600] text-4xl" />
                              </div>
                              <div className="p-3">
                                <h5 className="font-medium text-gray-800">
                                  {reward.name}
                                </h5>
                                <div className="flex items-center justify-between mt-2">
                                  <p className="text-sm text-gray-600">
                                    {reward.points} points
                                  </p>
                                  <Button
                                    size="sm"
                                    className={`text-xs ${
                                      reward.points <= 1250
                                        ? "bg-[#EC9600] hover:bg-[#EC9600]/90"
                                        : "bg-gray-300 cursor-not-allowed"
                                    }`}
                                    disabled={reward.points > 1250}
                                  >
                                    Redeem
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Points History */}
                      <div>
                        <h4 className="mb-3 text-lg font-semibold text-gray-800">
                          Points History
                        </h4>
                        <div className="space-y-3">
                          {[
                            {
                              action: "Completed profile",
                              points: 50,
                              date: "2 days ago",
                            },
                            {
                              action: "Daily login streak (7 days)",
                              points: 70,
                              date: "1 week ago",
                            },
                            {
                              action: "Shared a post",
                              points: 10,
                              date: "1 week ago",
                            },
                            {
                              action: "Workshop participation",
                              points: 200,
                              date: "2 weeks ago",
                            },
                            {
                              action: "Commented on 5 posts",
                              points: 25,
                              date: "3 weeks ago",
                            },
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 border border-orange-100 rounded-lg hover:bg-orange-50"
                            >
                              <div className="flex items-center">
                                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-3 bg-orange-100 rounded-full">
                                  <FiAward className="text-[#EC9600]" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {item.action}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {item.date}
                                  </p>
                                </div>
                              </div>
                              <p className="font-bold text-[#EC9600]">
                                +{item.points}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  )}

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
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile fixed bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            className={`relative outline-none cursor-pointer p-2 ${
              activeTab === "profile" ? "text-[#EC9600]" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <FiUser className="text-2xl" />
          </button>

          <button
            className={`relative outline-none cursor-pointer p-2 ${
              activeTab === "friends" ? "text-[#EC9600]" : ""
            }`}
            onClick={() => setActiveTab("friends")}
          >
            <FaUsers className="text-2xl" />
          </button>

          <Link to="/adda" className="relative p-2 outline-none cursor-pointer">
            <FiHome className="text-2xl text-[#EC9600]" />
          </Link>

          <button
            className={`relative outline-none cursor-pointer p-2 ${
              activeTab === "rewards" ? "text-[#EC9600]" : ""
            }`}
            onClick={() => setActiveTab("rewards")}
          >
            <FiAward className="text-2xl" />
          </button>

          <button
            className={`relative outline-none cursor-pointer p-2 ${
              activeTab === "saved" ? "text-[#EC9600]" : ""
            }`}
            onClick={() => setActiveTab("saved")}
          >
            <FaBookmark className="text-2xl" />
          </button>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
