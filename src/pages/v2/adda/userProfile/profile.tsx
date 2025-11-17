import PostCard, { PostData } from "@/components/adda/home/addPosts/PostCard";
import CompleteProfileModal from "@/components/adda/userProfile/CompleteProfileModal";
import RewardsSection from "@/components/adda/userProfile/rewardsSection";
import UserListModal from "@/components/common/modal/userList";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RewardEventType } from "@/types/rewards";
import { triggerReward } from "@/utils/rewardMiddleware";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { FaBookmark, FaUsers } from "react-icons/fa";
import { FiAward, FiEdit2, FiHome, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import PhotosCard from "./cards/photosCard";
import ProfileForm from "./profieForm";
import ProfileCompletion from "./profileCompletion";
import ProfileHeader from "./profileHeader";

interface MediaItem {
  url: string;
  type: "image" | "video";
  caption?: string;
}

interface PostUser {
  _id: string;
  name: string;
  picture?: string;
  email?: string;
}

interface Comment {
  _id?: string;
  userId?: string;
  user?: {
    _id: string;
    email?: string;
    name: string;
    picture?: string;
  };
  content?: string;
  text?: string;
  createdAt?: string;
}

interface Post {
  _id: string;
  postType: "text" | "photo" | "video" | "article" | "event" | "mixed";
  user: PostUser;
  content?: string;
  media?: MediaItem[];
  likes: string[];
  comments: Comment[];
  shares: string[];
  saves?: string[] | number;
  visibility: "public" | "friends" | "private";
  createdAt: string;
}

export interface UserDetails {
  _id: string;
  name: string;
  email: string;
  picture?: string;
  bio?: string;
  phoneNumber?: string;
  location?: string;
  education?: string;
  occupation?: string;
  interests?: string[];
  coverImage?: string;
  followers?: string[];
  following?: string[];
  dateOfBirth?: string;
  gender?: string;
  socialLinks?: Array<{ label: string; url: string }>;
  joinedDate?: string;
}

interface ProfileField {
  field: keyof UserDetails;
  label: string;
  minLength?: number;
  required?: boolean;
}

type TabTypes = "profile" | "posts" | "friends" | "rewards" | "saved";

const formatDate = (dateString?: string): string => {
  if (!dateString) return "Not provided";
  try {
    return format(new Date(dateString), "MMMM d, yyyy");
  } catch {
    return dateString;
  }
};

const profileFields: ProfileField[] = [
  { field: "name", label: "Name", required: true },
  { field: "picture", label: "Profile Picture" },
  { field: "email", label: "Email", required: true },
  { field: "phoneNumber", label: "Phone Number" },
  { field: "location", label: "Location" },
  { field: "bio", label: "Bio", minLength: 10 },
  { field: "education", label: "Education" },
  { field: "occupation", label: "Occupation" },
  { field: "interests", label: "Interests", minLength: 3 },
  { field: "dateOfBirth", label: "Date of Birth" },
  { field: "gender", label: "Gender" },
  { field: "socialLinks", label: "Social Links" },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState<TabTypes>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [modalType, setModalType] = useState<"followers" | "following" | null>(
    null
  );
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userSavedPosts, setUserSavedPosts] = useState<Post[]>([]);
  const [totalFollowers, setTotalFollowers] = useState<string[]>([]);
  const [totalFollowing, setTotalFollowing] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userDetails, setUserDetails] = useState<UserDetails>({
    _id: "",
    name: "",
    email: "",
    picture: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    socialLinks: [],
    interests: [],
  });

  const { getToken } = useAuth();
  const { user } = useUser();
  const coverPhotoInputRef = useRef<HTMLInputElement>(null);
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);

  const profileRef = useRef<HTMLDivElement>(null);
  const postsRef = useRef<HTMLDivElement>(null);
  const savedRef = useRef<HTMLDivElement>(null);
  const rewardsRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tab: TabTypes) => {
    setActiveTab(tab);
    let targetRef: React.RefObject<HTMLDivElement> | null = null;
    switch (tab) {
      case "profile":
        targetRef = profileRef;
        break;
      case "posts":
        targetRef = postsRef;
        break;
      case "saved":
        targetRef = savedRef;
        break;
      case "rewards":
        targetRef = rewardsRef;
        break;
      default:
        break;
    }
    if (targetRef?.current) {
      const offset = 2;
      const elementPosition =
        targetRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
      targetRef.current.focus({ preventScroll: true });
    }
  };

  const getProfileCompletion = () => {
    let completedFields = 0;
    if (!userDetails) return 0;

    profileFields.forEach((field) => {
      const value = userDetails[field.field];
      if (field.field === "interests") {
        if ((value as string[])?.length >= (field.minLength || 1)) {
          completedFields++;
        }
      } else if (field.field === "socialLinks") {
        if (
          (value as Array<{ label: string; url: string }>)?.length >=
          (field.minLength || 1)
        ) {
          completedFields++;
        }
      } else if (field.field === "bio") {
        if ((value as string)?.length >= (field.minLength || 1)) {
          completedFields++;
        }
      } else if (field.field === "picture") {
        if (value || user?.imageUrl) {
          completedFields++;
        }
      } else if (value && String(value).trim() !== "") {
        completedFields++;
      }
    });

    return Math.round((completedFields / profileFields.length) * 100);
  };

  const getIncompleteFields = () => {
    const incompleteFields: string[] = [];
    if (!userDetails) return profileFields.map((field) => field.label);

    profileFields.forEach((field) => {
      const value = userDetails[field.field];
      if (field.field === "interests") {
        if (
          !(value as string[])?.length ||
          (value as string[])?.length < (field.minLength || 1)
        ) {
          incompleteFields.push(field.label);
        }
      } else if (field.field === "socialLinks") {
        if (
          !(value as Array<{ label: string; url: string }>)?.length ||
          (value as Array<{ label: string; url: string }>)?.length <
            (field.minLength || 1)
        ) {
          incompleteFields.push(field.label);
        }
      } else if (field.field === "bio") {
        if (
          !(value as string) ||
          (value as string).length < (field.minLength || 1)
        ) {
          incompleteFields.push(field.label);
        }
      } else if (field.field === "picture") {
        if (!value && !user?.imageUrl) {
          incompleteFields.push(field.label);
        }
      } else if (!value || String(value).trim() === "") {
        incompleteFields.push(field.label);
      }
    });

    return incompleteFields;
  };

  const profileCompletionPercentage = getProfileCompletion();
  const isProfileComplete = profileCompletionPercentage === 100;

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);
      const token = await getToken();
      if (!token) {
        toast.error("Authentication required");
        setIsLoading(false);
        return;
      }
      console.log(token, "-----------------------------");
      console.log(
        user?.id,
        "user.==========================================================="
      );
      try {
        const [userResponse, postsResponse, savedPostsResponse] =
          await Promise.all([
            axios.get(
              `${import.meta.env.VITE_PROD_URL}/user/user/${user?.id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            ),
            axios.get(
              `${import.meta.env.VITE_PROD_URL}/posts/user/${user?.id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            ),
            axios.get(`${import.meta.env.VITE_PROD_URL}/feeds/saved`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        setUserDetails(userResponse.data.data);
        setTotalFollowers(userResponse.data.data.followers || []);
        setTotalFollowing(userResponse.data.data.following || []);

        setUserPosts(
          postsResponse.data.data.map((post: Post) => ({
            ...post,
            postType: post.postType || "text",
            user: post.user || {
              _id: user?.id || "",
              name: userDetails.name || "",
              picture: userDetails.picture || "",
              email: userDetails.email || "",
            },
            shares: post.shares || [],
            saves: post.saves || 0,
            visibility: post.visibility || "public",
          }))
        );

        setUserSavedPosts(
          savedPostsResponse.data.data.map((post: Post) => ({
            ...post,
            postType: post.postType || "text",
            user: {
              _id: post.user?._id || "",
              name: post.user?.name || "User",
              picture: post.user?.picture || "",
              email: post.user?.email || "user@example.com",
            },
            shares: post.shares || [],
            saves: post.saves || 0,
            visibility: post.visibility || "public",
          }))
        );
      } catch (error) {
        setError("Failed to load profile data");
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchUserData();
    }
  }, [
    user?.id,
    getToken,
    userDetails.name,
    userDetails.picture,
    userDetails.email,
  ]);

  useEffect(() => {
    if (!isProfileComplete) {
      setShowProfileModal(true);
    } else {
      localStorage.setItem("profileModalShown", "true");
    }
  }, [isProfileComplete]);

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const profileData = {
      bio: formData.get("bio") as string,
      location: formData.get("location") as string,
      education: formData.get("education") as string,
      occupation: formData.get("occupation") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      interests: userDetails.interests || [],
      coverPhoto: (user?.unsafeMetadata?.coverPhoto as string) || "",
      picture: user?.imageUrl || "",
      dateOfBirth: formData.get("dateOfBirth") as string,
      socialLinks: userDetails.socialLinks || [],
      gender: formData.get("gender") as string,
    };

    const token = await getToken();
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_PROD_URL}/user/profile`,
        profileData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully");
        setUserDetails((prev) => ({ ...prev, ...profileData }));
        setIsEditing(false);
        setShowCompletionForm(false);
        triggerReward(RewardEventType.PROFILE_COMPLETION);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleCoverPhotoChange = async (file: File) => {
    const token = await getToken();
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    try {
      toast.loading("Uploading cover photo...");
      const formData = new FormData();
      formData.append("file", file);
      const uploadResponse = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/upload/file`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const fileUrl = uploadResponse.data?.data?.fileDetails?.url;
      if (!fileUrl) {
        toast.dismiss();
        throw new Error("Failed to upload cover photo");
      }

      await user?.update({ unsafeMetadata: { coverPhoto: fileUrl } });

      await axios.put(
        `${import.meta.env.VITE_PROD_URL}/user/profile`,
        { coverImage: fileUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.dismiss();
      toast.success("Cover photo updated successfully");
      setUserDetails((prev) => ({ ...prev, coverImage: fileUrl }));
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to upload cover photo");
      throw error;
    }
  };

  const handleProfilePhotoChange = async (file: File) => {
    const token = await getToken();
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    try {
      toast.loading("Uploading profile photo...");
      const formData = new FormData();
      formData.append("file", file);

      await user?.setProfileImage({ file });

      const uploadResponse = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/upload/file`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const fileUrl = uploadResponse.data?.data?.fileDetails?.url;
      if (!fileUrl) {
        toast.dismiss();
        throw new Error("Failed to upload profile photo");
      }

      await axios.put(
        `${import.meta.env.VITE_PROD_URL}/user/profile`,
        { picture: fileUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.dismiss();
      toast.success("Profile photo updated successfully");
      setUserDetails((prev) => ({ ...prev, picture: fileUrl }));
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to upload profile photo");
      throw error;
    }
  };

  const removeInterest = (indexToRemove: number) => {
    setUserDetails((prev) => ({
      ...prev,
      interests: (prev.interests || []).filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const updateInterests = async () => {
    const token = await getToken();
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_PROD_URL}/user/profile`,
        { interests: userDetails.interests || [] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success("Interests updated successfully");
      }
    } catch {
      toast.error("Failed to update interests");
    }
  };

  useEffect(() => {
    if (userDetails?.socialLinks?.some((link) => typeof link === "string")) {
      const convertedLinks = (
        userDetails.socialLinks as Array<
          string | { label: string; url: string }
        >
      ).map((link) =>
        typeof link === "string" ? { label: "Link", url: link } : link
      );
      setUserDetails((prev) => ({ ...prev, socialLinks: convertedLinks }));
    }
  }, [userDetails?.socialLinks]);

  const handleCompleteProfile = () => {
    setShowProfileModal(false);
    setIsEditing(true);
    localStorage.setItem("profileModalShown", "true");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <>
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={300}
          className="fixed top-0 left-0 z-50 w-full h-full"
        />
      )}
      <CompleteProfileModal
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
        }}
        onCompleteProfile={handleCompleteProfile}
      />
      <div className="w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <ProfileHeader
          userDetails={userDetails}
          coverPhotoInputRef={coverPhotoInputRef}
          profilePhotoInputRef={profilePhotoInputRef}
          handleCoverPhotoChange={handleCoverPhotoChange}
          handleProfilePhotoChange={handleProfilePhotoChange}
          isEditable={true}
          maxImageSize={5}
          onImageError={(error) => toast.error(error)}
        />

        {!isProfileComplete && !showCompletionForm && (
          <ProfileCompletion
            profileCompletionPercentage={profileCompletionPercentage}
            incompleteFields={getIncompleteFields()}
            setShowCompletionForm={setShowCompletionForm}
          />
        )}

        <ProfileForm
          isOpen={showCompletionForm}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
          setShowCompletionForm={setShowCompletionForm}
          handleProfileSubmit={handleProfileSubmit}
          removeInterest={removeInterest}
          updateInterests={updateInterests}
        />

        <div className="pt-8 text-center sm:pt-12">
          <div className="flex flex-col items-center justify-between gap-4 mb-4 sm:flex-row sm:mb-6">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 sm:justify-start">
              {["profile", "posts"].map((tab) => (
                <Button
                  key={tab}
                  onClick={() => handleTabChange(tab as TabTypes)}
                  className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-orange-500 text-white shadow-md"
                      : "text-gray-700 hover:text-orange-500 hover:bg-orange-50"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Button>
              ))}
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
                {userDetails.name}
              </h1>
              <p className="text-sm text-gray-600 sm:text-base">
                {userDetails.email}
              </p>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="mt-2 text-xs text-orange-500 border-orange-500 sm:mt-3 sm:text-sm hover:bg-orange-50"
              >
                <FiEdit2 className="mr-2" />{" "}
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 sm:justify-end">
              {["saved", "rewards"].map((tab) => (
                <Button
                  key={tab}
                  onClick={() => handleTabChange(tab as TabTypes)}
                  className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-orange-500 text-white shadow-md"
                      : "text-gray-700 hover:text-orange-500 hover:bg-orange-50"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-6 py-4 border-gray-200 sm:gap-12 sm:py-6 border-y">
            <div className="text-center">
              <div className="text-lg font-bold text-orange-500 sm:text-2xl">
                {userPosts.length}
              </div>
              <div className="text-xs text-gray-600 sm:text-sm">Posts</div>
            </div>
            <button
              onClick={() => setModalType("followers")}
              className="text-center"
            >
              <div className="text-lg font-bold text-orange-500 sm:text-2xl">
                {totalFollowers.length}
              </div>
              <div className="text-xs text-gray-600 sm:text-sm">Followers</div>
            </button>
            <button
              onClick={() => setModalType("following")}
              className="text-center"
            >
              <div className="text-lg font-bold text-orange-500 sm:text-2xl">
                {totalFollowing.length}
              </div>
              <div className="text-xs text-gray-600 sm:text-sm">Following</div>
            </button>
          </div>
        </div>

        <div ref={profileRef} tabIndex={-1} className="pt-4">
          {activeTab === "profile" && (
            <div className="flex flex-col justify-between gap-4 lg:flex-row sm:gap-6">
              <div className="w-full lg:w-3/5">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <Card className="relative p-4 overflow-hidden bg-white border border-orange-100 shadow-md sm:p-6 lg:p-8 rounded-xl">
                    <div className="absolute top-0 right-0 hidden w-1/3 h-full xl:block">
                      <motion.div
                        className="absolute w-12 h-12 bg-orange-200 rounded-full opacity-30"
                        animate={{
                          y: [0, -10, 0],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.2,
                        }}
                        style={{ right: "10%", top: "20%" }}
                      />
                      <motion.div
                        className="absolute w-10 h-10 bg-orange-300 rounded-full opacity-30"
                        animate={{
                          y: [0, 10, 0],
                          scale: [1, 0.95, 1],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.4,
                        }}
                        style={{ right: "25%", top: "50%" }}
                      />
                    </div>

                    <h2 className="mb-4 text-lg font-semibold text-center text-gray-800 sm:text-xl lg:text-2xl sm:mb-6 sm:text-left">
                      Personal Information
                    </h2>

                    <AnimatePresence>
                      {isEditing ? (
                        <motion.div
                          key="form"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ProfileForm
                            isOpen={isEditing}
                            userDetails={userDetails}
                            setUserDetails={setUserDetails}
                            setShowCompletionForm={setShowCompletionForm}
                            handleProfileSubmit={handleProfileSubmit}
                            removeInterest={removeInterest}
                            updateInterests={updateInterests}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="details"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.2 }}
                          className="grid grid-cols-1 gap-3 pr-0 sm:grid-cols-2 sm:gap-4 lg:gap-6 xl:pr-32"
                        >
                          <motion.p
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            className="text-sm text-gray-700 sm:text-base"
                          >
                            <strong className="font-medium">Name:</strong>{" "}
                            {userDetails.name}
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: 0.15 }}
                            className="text-sm text-gray-700 sm:text-base"
                          >
                            <strong className="font-medium">Email:</strong>{" "}
                            {userDetails.email}
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: 0.2 }}
                            className="text-sm text-gray-700 sm:text-base"
                          >
                            <strong className="font-medium">Phone:</strong>{" "}
                            {userDetails.phoneNumber || "Not provided"}
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: 0.25 }}
                            className="text-sm text-gray-700 sm:text-base"
                          >
                            <strong className="font-medium">Location:</strong>{" "}
                            {userDetails.location || "Not provided"}
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: 0.3 }}
                            className="text-sm text-gray-700 sm:text-base"
                          >
                            <strong className="font-medium">
                              Date of Birth:
                            </strong>{" "}
                            {formatDate(userDetails.dateOfBirth)}
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: 0.35 }}
                            className="text-sm text-gray-700 sm:text-base"
                          >
                            <strong className="font-medium">Gender:</strong>{" "}
                            {userDetails.gender
                              ? userDetails.gender.charAt(0).toUpperCase() +
                                userDetails.gender.slice(1).replace("-", " ")
                              : "Not provided"}
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: 0.4 }}
                            className="text-sm text-gray-700 sm:text-base"
                          >
                            <strong className="font-medium">Education:</strong>{" "}
                            {userDetails.education || "Not provided"}
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: 0.45 }}
                            className="text-sm text-gray-700 sm:text-base"
                          >
                            <strong className="font-medium">Occupation:</strong>{" "}
                            {userDetails.occupation || "Not provided"}
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: 0.5 }}
                            className="text-sm text-gray-700 sm:col-span-2 sm:text-base"
                          >
                            <strong className="font-medium">Bio:</strong>{" "}
                            {userDetails.bio || "No bio provided"}
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: 0.55 }}
                            className="text-sm text-gray-700 sm:text-base"
                          >
                            <strong className="font-medium">Joined:</strong>{" "}
                            {formatDate(userDetails.joinedDate)}
                          </motion.p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              </div>
              <div className="w-full lg:w-2/5">
                <PhotosCard userPosts={userPosts} />
              </div>
            </div>
          )}
        </div>

        <div ref={postsRef} tabIndex={-1} className="pt-4">
          {activeTab === "posts" && (
            <Card className="p-4 border border-orange-100 shadow-md sm:p-6 rounded-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-800 sm:text-xl">
                My Posts
              </h3>
              <div className="space-y-4 sm:space-y-6">
                {userPosts.map((post) => (
                  <PostCard
                    setUserPosts={setUserPosts}
                    isUser={true}
                    key={post._id}
                    post={post as unknown as PostData}
                  />
                ))}
              </div>
            </Card>
          )}
        </div>

        <div ref={savedRef} tabIndex={-1} className="pt-4">
          {activeTab === "saved" && (
            <Card className="p-4 border border-orange-100 shadow-md sm:p-6 rounded-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-800 sm:text-xl">
                Saved Items
              </h3>
              {userSavedPosts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center py-8 text-center sm:py-12"
                >
                  <FaBookmark className="mb-4 text-3xl text-orange-500 sm:text-4xl" />
                  <p className="mb-2 text-base text-gray-600 sm:text-lg">
                    No saved posts yet!
                  </p>
                  <p className="text-xs text-gray-500 sm:text-sm">
                    Start saving posts to see them here.
                  </p>
                  <Button
                    asChild
                    className="mt-4 text-xs text-white bg-orange-500 hover:bg-orange-600 sm:text-sm"
                  >
                    <Link to="/adda">Explore Posts</Link>
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                  {userSavedPosts.map((item) => (
                    <PostCard
                      key={item._id}
                      post={item as unknown as PostData}
                    />
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>

        <div ref={rewardsRef} tabIndex={-1} className="pt-4">
          {activeTab === "rewards" && <RewardsSection />}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
        <div className="flex items-center justify-around px-4 h-14 sm:h-16">
          {[
            {
              tab: "profile",
              icon: <FiUser className="text-xl sm:text-2xl" />,
            },
            {
              tab: "friends",
              icon: <FaUsers className="text-xl sm:text-2xl" />,
            },
            {
              tab: "home",
              icon: <FiHome className="text-xl sm:text-2xl" />,
              link: "/adda",
            },
            {
              tab: "rewards",
              icon: <FiAward className="text-xl sm:text-2xl" />,
            },
            {
              tab: "saved",
              icon: <FaBookmark className="text-xl sm:text-2xl" />,
            },
          ].map(({ tab, icon, link }) =>
            link ? (
              <Link
                key={tab}
                to={link}
                className={`p-2 ${
                  activeTab === tab ? "text-orange-500" : "text-gray-600"
                } hover:text-orange-500 transition-colors`}
              >
                {icon}
              </Link>
            ) : (
              <button
                key={tab}
                className={`p-2 ${
                  activeTab === tab ? "text-orange-500" : "text-gray-600"
                } hover:text-orange-500 transition-colors`}
                onClick={() =>
                  tab === "friends"
                    ? setModalType("following")
                    : handleTabChange(tab as TabTypes)
                }
              >
                {icon}
              </button>
            )
          )}
        </div>
      </div>
      {modalType && (
        <UserListModal
          userIds={modalType === "followers" ? totalFollowers : totalFollowing}
          title={modalType === "followers" ? "Followers" : "Following"}
          setShowModal={() => setModalType(null)}
        />
      )}
    </>
  );
};

export default Profile;
