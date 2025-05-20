import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { FaBookmark, FaCamera, FaImage, FaUsers } from "react-icons/fa";
import {
  FiAlertCircle,
  FiAward,
  FiCalendar,
  FiCheck,
  FiEdit2,
  FiHome,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

// Shadcn UI components
import axiosInstance from "@/api/axios";
import PostCard, { PostData } from "@/components/adda/home/addPosts/PostCard";
import RewardsSection from "@/components/adda/userProfile/rewardsSection";
import { UserInfo } from "@/types";
import { RewardEventType } from "@/types/rewards";
import { triggerReward } from "@/utils/rewardMiddleware";
import { errorToast, successToast } from "@/utils/toastResposnse";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";

// Define interface for post type
export type PostType =
  | "text"
  | "photo"
  | "video"
  | "article"
  | "event"
  | "mixed";

// Define interface for media items
interface MediaItem {
  url: string;
  type: "image" | "video";
  caption?: string;
}

// Define interface for comment
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

// Define interface for user info in posts
interface PostUser {
  _id: string;
  name: string;
  picture?: string;
  email?: string;
  role?: string;
}

// Define post interface to match PostData
export interface Post {
  _id: string;
  postType: PostType;
  userId?: string;
  user: PostUser;
  content?: string;
  title?: string;
  media?: MediaItem[];
  article?: {
    body: string;
    coverImage?: string;
  };
  event?: {
    startDate: string;
    endDate?: string;
    venue: string;
    description: string;
    coverImage?: string;
  };
  likes: string[];
  comments: Comment[];
  shares: string[];
  saves?: string[] | number;
  tags?: string[];
  location?: string;
  visibility: "public" | "friends" | "private";
  createdAt: string;
  updatedAt?: string;
}

// Define interface for user details from API
export interface UserDetails {
  _id: string;
  name: string;
  email: string;
  picture?: string;
  bio?: string;
  phone?: string;
  location?: string;
  education?: string;
  occupation?: string;
  interests?: string[];
  posts?: Post[];
  friends?: string[];
  groups?: string[];
  joinedDate?: string;
  coverPhoto?: string;
  followers?: string[];
  following?: string[];
}

// Define interface for profile field
interface ProfileField {
  field: string;
  label: string;
  minLength?: number;
}

// Add interface for suggested friends
interface SuggestionInterface {
  _id: string;
  name: string;
  picture: string;
}

// Update the Post interface to include all fields from saved posts
export interface SavedPost extends Post {
  userId?: string;
  user: {
    _id: string;
    name: string;
    email: string;
    picture: string;
  };
}

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [friends, setFriends] = useState<UserInfo[]>([]);

  const [userPosts, setUserPosts] = useState<Post[]>([]);

  const [userSavedPosts, setUserSavedPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState<UserDetails>({
    _id: "",
    name: "",
    email: "",
    interests: [],
  });

  const { getToken } = useAuth();
  const { user } = useUser();
  console.log(user);
  // const navigate = useNavigate();

  // Create refs for file inputs
  const coverPhotoInputRef = useRef<HTMLInputElement>(null);
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);

  const [friendSuggestions, setFriendSuggestions] = useState<
    SuggestionInterface[] | null
  >(null);
  const [connectingIds, setConnectingIds] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchFriends = async () => {
      const token = await getToken();
      try {
        const response = await axiosInstance("/adda/getFriends", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data.data);
        setFriends(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFriends();
  }, []);

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

    if (!userDetails) {
      return 0;
    }

    profileFields.forEach((field) => {
      if (field.field === "interests") {
        if (
          userDetails.interests &&
          userDetails.interests.length >= (field.minLength || 1)
        ) {
          completedFields++;
        }
      } else if (
        userDetails[field.field as keyof UserDetails] &&
        String(userDetails[field.field as keyof UserDetails]).trim() !== ""
      ) {
        completedFields++;
      }
    });

    return Math.round((completedFields / profileFields.length) * 100);
  };

  // Add a function to get the incomplete profile fields
  const getIncompleteFields = () => {
    const incompleteFields: string[] = [];

    if (!userDetails) {
      return profileFields.map((field) => field.label);
    }

    profileFields.forEach((field) => {
      if (field.field === "interests") {
        if (
          !userDetails.interests ||
          userDetails.interests.length < (field.minLength || 1)
        ) {
          incompleteFields.push(field.label);
        }
      } else if (
        !userDetails[field.field as keyof UserDetails] ||
        String(userDetails[field.field as keyof UserDetails]).trim() === ""
      ) {
        incompleteFields.push(field.label);
      }
    });

    return incompleteFields;
  };

  const incompleteFields = getIncompleteFields();
  const profileCompletionPercentage = getProfileCompletion();
  const isProfileComplete = profileCompletionPercentage === 100;

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);
      const profileData = {
        bio: formData.get("bio") as string,
        location: formData.get("location") as string,
        education: formData.get("education") as string,
        occupation: formData.get("occupation") as string,
        phone: formData.get("phone") as string,
        interests: userDetails.interests || [], // Include current interests
      };

      const token = await getToken();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_PROD_URL}/user/profile`,
        profileData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);

      if (response.status === 200) {
        toast.success("Profile updated successfully");
        // Update local user data
        setUserDetails((prev: UserDetails) => ({ ...prev, ...profileData }));
        setIsEditing(false);
        setShowCompletionForm(false);

        // Trigger reward for completing the profile
        triggerReward(RewardEventType.PROFILE_COMPLETION);

        // Show confetti for the profile completion
        setShowConfetti(true);
        // Hide confetti after 5 seconds
        setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  // Function to handle adding a new interest
  const addInterest = () => {
    const interestInput = document.getElementById(
      "new-interest"
    ) as HTMLInputElement;
    if (interestInput && interestInput.value.trim()) {
      // Create a new array with all existing interests plus the new one
      const updatedInterests = [
        ...(userDetails.interests || []),
        interestInput.value.trim(),
      ];

      // Update the user details state with the new interests array
      setUserDetails((prev) => ({
        ...prev,
        interests: updatedInterests,
      }));

      // Clear the input field
      interestInput.value = "";
    }
  };

  // Function to handle removing an interest
  const removeInterest = (indexToRemove: number) => {
    const updatedInterests = (userDetails.interests || []).filter(
      (_, index) => index !== indexToRemove
    );
    setUserDetails((prev) => ({
      ...prev,
      interests: updatedInterests,
    }));
  };

  useEffect(() => {
    const fetchUsersPost = async () => {
      try {
        const token = await getToken();
        if (!token) {
          throw new Error("No token found");
        }
        const response = await axios.get(
          `${import.meta.env.VITE_PROD_URL}/posts/user/${user?.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.data);

        // Ensure posts data matches our Post interface with required email field
        const formattedPosts = response.data.data.map(
          (post: Partial<Post>) => ({
            ...post,
            postType: (post.postType as PostType) || "text",
            user: post.user || {
              _id: user?.id || "",
              name: userDetails.name || "",
              picture: userDetails.picture || "",
              email: userDetails.email || "", // Ensure email is always included
            },
            shares: post.shares || [],
            saves: post.saves || 0,
            visibility: post.visibility || "public",
          })
        );

        setUserPosts(formattedPosts as unknown as Post[]);
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
          `${import.meta.env.VITE_PROD_URL}/feeds/saved`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Fix the type issues by explicitly defining the user property
        const formattedSavedPosts = response.data.data.map(
          (post: SavedPost) => ({
            ...post,
            postType: (post.postType as PostType) || "text",
            user: {
              _id: post.userId || "",
              name:
                typeof post.user === "object"
                  ? post.user.name || "User"
                  : "User",
              picture:
                typeof post.user === "object" ? post.user.picture || "" : "",
              email:
                typeof post.user === "object"
                  ? post.user.email || "user@example.com"
                  : "user@example.com",
            },
            shares: post.shares || [],
            saves: post.shares?.length || 0,
            visibility: post.visibility || "public",
          })
        );

        setUserSavedPosts(formattedSavedPosts as unknown as Post[]);
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
        `${import.meta.env.VITE_PROD_URL}/user/user/${user?.id}`,
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

  // Function to handle cover photo upload
  const handleCoverPhotoChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      try {
        const token = await getToken();
        if (!token) {
          toast.error("Authentication required");
          return;
        }

        toast.loading("Uploading cover photo...");

        // First upload the file to S3
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await axios.post(
          "https://mentoons-backend-zlx3.onrender.com/api/v1/upload/file",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!uploadResponse.data?.data?.fileDetails?.url) {
          toast.dismiss();
          toast.error("Failed to upload cover photo");
          return;
        }

        const fileUrl = uploadResponse.data.data.fileDetails.url;

        const clerkResponse = await user?.update({
          unsafeMetadata: {
            coverPhoto: fileUrl,
          },
        });
        console.log("clerkResponse For cover photo", clerkResponse);

        // Now update the user profile with the new cover photo URL
        const updateResponse = await axios.put(
          `${import.meta.env.VITE_PROD_URL}/user/profile`,
          { coverPhoto: fileUrl },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (updateResponse.status === 200) {
          toast.dismiss();
          toast.success("Cover photo updated successfully");

          // Update local user data with new cover photo URL
          setUserDetails((prev) => ({
            ...prev,
            coverPhoto: fileUrl,
          }));
        }
      } catch (error) {
        toast.dismiss();
        console.error("Error uploading cover photo:", error);
        toast.error("Failed to upload cover photo");
      }
    }
  };

  // Function to handle profile photo upload
  const handleProfilePhotoChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      try {
        const token = await getToken();

        if (!token) {
          toast.error("Authentication required");
          return;
        }

        toast.loading("Uploading profile photo...");

        // First upload the file to S3
        const formData = new FormData();
        formData.append("file", file);

        // Update profile image in Clerk with the original file object
        const clerkResponse = await user?.setProfileImage({ file });
        console.log("Clerk update response:", clerkResponse);

        const uploadResponse = await axios.post(
          "https://mentoons-backend-zlx3.onrender.com/api/v1/upload/file",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!uploadResponse.data?.data?.fileDetails?.url) {
          toast.dismiss();
          toast.error("Failed to upload profile photo");
          return;
        }

        const fileUrl = uploadResponse.data.data.fileDetails.url;

        // Now update the user profile with the new profile photo URL
        const updateResponse = await axios.put(
          `${import.meta.env.VITE_PROD_URL}/user/profile`,
          { picture: fileUrl },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (updateResponse.status === 200) {
          toast.dismiss();
          toast.success("Profile photo updated successfully");

          // Update local user data with new profile photo URL
          setUserDetails((prev) => ({
            ...prev,
            picture: fileUrl,
          }));
        }
      } catch (error) {
        toast.dismiss();
        console.error("Error uploading profile photo:", error);
        toast.error("Failed to upload profile photo");
      }
    }
  };

  // Add function to fetch suggestions
  const fetchSuggestions = async () => {
    if (loadingSuggestions) return;
    setLoadingSuggestions(true);

    try {
      const token = await getToken();
      const response = await axiosInstance.get(
        `/adda/requestSuggestions?page=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      const { suggestions } = response.data.data;
      setFriendSuggestions(suggestions || []);
    } catch (error) {
      console.error("Error fetching friend suggestions:", error);
      errorToast("Failed to fetch suggestions");
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Add handleConnect function
  const handleConnect = async (suggestionId: string) => {
    setConnectingIds((prev) => [...prev, suggestionId]);

    try {
      const token = await getToken();
      const response = await axiosInstance.post(
        `/adda/request/${suggestionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success === true) {
        setFriendSuggestions((prevSuggestions) =>
          prevSuggestions
            ? prevSuggestions.filter(
                (suggestion) => suggestion._id !== suggestionId
              )
            : null
        );

        successToast("Friend request sent successfully");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      errorToast("Failed to send friend request");
    } finally {
      setConnectingIds((prev) => prev.filter((id) => id !== suggestionId));
    }
  };

  // Add useEffect to fetch suggestions when component mounts
  useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <>
      {showConfetti && (
        <Confetti recycle={false} numberOfPieces={500} className="w-full" />
      )}

      <div className="flex items-start justify-center w-full max-w-8xl rounded-xl realatie">
        <div className="relative flex flex-col w-full ">
          {/* Profile Header */}
          <div className="sticky top-[172px] md:top-[200px]  z-[5] bg-white rounded-bl-xl rounded-br-xl">
            <div className="flex items-center justify-between w-full p-3 border border-orange-200 shadow-lg rounded-xl shadow-orange-100/80">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/adda/home")}
                  className="p-2 text-orange-600 transition-colors bg-orange-100 rounded-full hover:bg-orange-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <h1 className="text-xl font-semibold text-orange-700 md:text-2xl">
                  {userDetails?.name}
                </h1>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  if (isEditing) {
                    // If editing, find the form and submit it
                    const form = document.getElementById("profile-edit-form");
                    if (form) {
                      const formEvent = new Event("submit", {
                        bubbles: true,
                        cancelable: true,
                      }) as unknown as React.FormEvent<HTMLFormElement>;
                      Object.defineProperty(formEvent, "currentTarget", {
                        value: form,
                      });
                      handleProfileSubmit(formEvent);
                    }
                  } else {
                    // If not editing, switch to edit mode
                    setIsEditing(true);
                  }
                }}
                className="text-sm text-orange-500 border-orange-500 hover:bg-orange-50"
              >
                <FiEdit2 className="mr-2" />{" "}
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            </div>
          </div>

          {/* Profile Completion Alert - Show only if profile is incomplete */}
          {!isProfileComplete && !showCompletionForm && (
            <div className="p-4 mt-4 border border-orange-200 bg-orange-50 rounded-xl">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="w-5 h-5 text-orange-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-orange-800">
                    Your profile is incomplete
                  </h3>
                  <div className="mt-2 text-sm text-orange-700">
                    <p>
                      Please complete your profile to get the most out of
                      Mentoons Adda.
                    </p>
                    <div className="mt-2">
                      <div className="relative h-2 overflow-hidden bg-orange-100 rounded-full">
                        <div
                          className="absolute top-0 left-0 h-full bg-orange-500"
                          style={{ width: `${profileCompletionPercentage}%` }}
                        ></div>
                      </div>
                      <p className="mt-1 text-xs text-orange-600">
                        {profileCompletionPercentage}% complete
                      </p>

                      {incompleteFields.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-orange-700">
                            Missing information:
                          </p>
                          <ul className="flex flex-wrap gap-6 pl-4 text-orange-700 list-disc te-xt-xs mt1">
                            {incompleteFields.map((field, index) => (
                              <li key={index}>{field}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <Button
                      className="mt-3 text-white bg-orange-500 hover:bg-orange-500/90"
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
                        className="bg-orange-500 h-2.5 rounded-full"
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
                        name="name"
                        defaultValue={userDetails.name}
                        className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                        name="email"
                        defaultValue={userDetails.email}
                        readOnly
                        className="w-full p-2 bg-gray-100 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                        name="phone"
                        placeholder="Add your phone number"
                        defaultValue={userDetails.phone}
                        className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                        className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                        name="education"
                        placeholder="Add your education"
                        defaultValue={userDetails?.education}
                        className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                        name="occupation"
                        placeholder="Add your occupation"
                        defaultValue={userDetails?.occupation}
                        className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                        name="bio"
                        placeholder="Tell us about yourself"
                        defaultValue={userDetails?.bio}
                        rows={4}
                        className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                          {userDetails?.interests?.map(
                            (interest: string, index: number) => (
                              <span
                                key={index}
                                className="flex items-center px-3 py-1 text-sm text-orange-500 bg-orange-100 rounded-full"
                              >
                                {interest}
                                <button
                                  type="button"
                                  onClick={() => removeInterest(index)}
                                  className="ml-2 text-orange-500 hover:text-orange-700"
                                >
                                  ×
                                </button>
                              </span>
                            )
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add an interest"
                            id="new-interest"
                            className="flex-1 p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addInterest();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            className="bg-orange-500 hover:bg-orange-500/90"
                            onClick={addInterest}
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
                      className="text-orange-500 border-orange-500 hover:bg-orange-50"
                      onClick={() => setShowCompletionForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-orange-500 hover:bg-orange-500/90"
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
            <div className="flex flex-col w-full mt-4 md:gap-4 lg:gap-6">
              {/* Left sidebar */}
              <div className="w-full ">
                <div className="sticky top-[130px] flex flex-col gap-4">
                  {/* User Card */}
                  <Card className="overflow-hidden border border-orange-200 shadow-lg shadow-orange-100/80 rounded-xl">
                    <div
                      className="relative h-24 bg-gradient-to-r from-orange-500 to-orange-400"
                      style={{
                        backgroundImage: user?.unsafeMetadata?.coverPhoto
                          ? `url(${user?.unsafeMetadata?.coverPhoto})`
                          : "linear-gradient(to right, #EC9600, #fbbf24)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <Button
                        className="absolute w-8 h-8 p-0 rounded-full top-2 right-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                        onClick={() => coverPhotoInputRef.current?.click()}
                      >
                        <FaCamera className="text-white" />
                      </Button>
                      {/* Hidden file input for cover photo */}
                      <input
                        type="file"
                        ref={coverPhotoInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleCoverPhotoChange}
                      />
                    </div>

                    <div className="flex flex-col items-start px-4 pb-4 -mt-12">
                      <div className="relative ">
                        <Avatar className="w-24 h-24 ring-4 ring-white">
                          <img
                            src={userDetails?.picture}
                            alt={userDetails?.name}
                          />
                        </Avatar>
                        <Button
                          className="absolute bottom-0 right-0 w-8 h-8 p-0 text-white bg-orange-500 rounded-full hover:bg-orange-500/90"
                          onClick={() => profilePhotoInputRef.current?.click()}
                        >
                          <FiEdit2 size={14} />
                        </Button>

                        {/* Hidden file input for profile photo */}
                        <input
                          type="file"
                          ref={profilePhotoInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleProfilePhotoChange}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h2 className="mt-3 text-lg font-bold text-gray-800">
                          {userDetails?.name}
                        </h2>
                        <div className="flex gap-2">
                          <p className="flex items-center mt-1 text-sm text-gray-600">
                            <FiMapPin className="mr-1" size={14} />
                            {userDetails?.location}
                          </p>
                          <p className="flex items-center mt-1 text-xs text-gray-500">
                            <FiCalendar className="mr-1" size={12} /> Joined{" "}
                            {userDetails?.joinedDate}
                          </p>
                        </div>
                      </div>

                      {/* User Stats */}
                      <div className="flex justify-between w-full pt-4 mt-4 border-t border-orange-200">
                        <div className="text-center">
                          <p className="text-xl font-bold text-orange-500">
                            {userPosts?.length || 0}
                          </p>
                          <p className="text-xs text-gray-600">Posts</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-orange-500">
                            {userDetails?.friends?.length || 0}
                          </p>
                          <p className="text-xs text-gray-600">Friends</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-orange-500">
                            {userDetails?.followers?.length || 0}
                          </p>
                          <p className="text-xs text-gray-600">Followers</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-orange-500">
                            {userDetails?.following?.length || 0}
                          </p>
                          <p className="text-xs text-gray-600">Following</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-orange-500">
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
                        className="p-0 text-orange-500 hover:text-orange-500/90"
                        onClick={() => setIsEditing(true)}
                      >
                        <FiEdit2 size={16} />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {userDetails?.interests &&
                      userDetails?.interests.length > 0 ? (
                        userDetails?.interests.map(
                          (interest: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1 text-sm text-orange-500 bg-orange-100 rounded-full"
                            >
                              {interest}
                            </span>
                          )
                        )
                      ) : (
                        <p className="text-sm text-gray-500">
                          No interests added yet
                        </p>
                      )}
                    </div>
                  </Card>

                  {/* Suggested Friends */}
                  <Card className="p-4 border border-orange-200 shadow-lg shadow-orange-100/80 rounded-xl">
                    <h3 className="mb-3 text-lg font-semibold text-gray-800">
                      Suggested Friends
                    </h3>
                    <div className="space-y-3">
                      {loadingSuggestions ? (
                        <div className="flex items-center justify-center w-full py-3">
                          <div className="w-5 h-5 border-2 rounded-full border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                          <span className="ml-2 text-sm text-gray-500">
                            Loading suggestions...
                          </span>
                        </div>
                      ) : friendSuggestions && friendSuggestions.length > 0 ? (
                        friendSuggestions.map((suggestion) => (
                          <div
                            key={suggestion._id}
                            className="flex items-center justify-between p-3 transition-all duration-200 bg-white border border-orange-100 rounded-lg hover:shadow-md"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="w-10 h-10">
                                <img
                                  src={suggestion.picture}
                                  alt={suggestion.name}
                                  className="object-cover w-full h-full"
                                />
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium text-gray-800">
                                  {suggestion.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Suggested connection
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleConnect(suggestion._id)}
                              disabled={connectingIds.includes(suggestion._id)}
                              className={`text-xs h-8 text-white font-semibold ${
                                connectingIds.includes(suggestion._id)
                                  ? "bg-gray-300 cursor-not-allowed"
                                  : "bg-orange-500 hover:bg-orange-500/90"
                              }`}
                            >
                              {connectingIds.includes(suggestion._id) ? (
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 rounded-full bo rder-2 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                                  <span>Connecting...</span>
                                </div>
                              ) : (
                                "Connect"
                              )}
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full py-6 text-center">
                          <div className="p-3 mb-3 text-orange-500 rounded-full bg-orange-50">
                            <FiUsers className="w-6 h-6" />
                          </div>
                          <h3 className="mb-1 text-base font-medium text-gray-700">
                            No Suggestions Available
                          </h3>
                          <p className="mb-4 text-sm text-gray-500">
                            We couldn't find any connection suggestions for you
                            at the moment
                          </p>
                          <Button
                            onClick={fetchSuggestions}
                            className="bg-orange-500 hover:bg-orange-500/90"
                          >
                            Refresh Suggestions
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>

              {/* Main Content */}
              <div className="w-full mt-4 md:flex-1 md:mt-0">
                {/* Navigation Tabs */}
                <Card className="p-2 mb-4 border border-orange-200 shadow-lg shadow-orange-100/80 rounded-xl">
                  <div className="flex pb-1 space-x-2 overflow-x-auto">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap flex items-center ${
                        activeTab === "profile"
                          ? "bg-orange-500 text-white"
                          : "hover:bg-orange-50"
                      }`}
                    >
                      <FiUser className="mr-2" /> Profile Info
                    </button>
                    <button
                      onClick={() => setActiveTab("posts")}
                      className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap flex items-center ${
                        activeTab === "posts"
                          ? "bg-orange-500 text-white"
                          : "hover:bg-orange-50"
                      }`}
                    >
                      <FaImage className="mr-2" /> My Posts
                    </button>
                    <button
                      onClick={() => setActiveTab("friends")}
                      className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap flex items-center ${
                        activeTab === "friends"
                          ? "bg-orange-500 text-white"
                          : "hover:bg-orange-50"
                      }`}
                    >
                      <FaUsers className="mr-2" /> Friends
                    </button>
                    <button
                      onClick={() => setActiveTab("saved")}
                      className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap flex items-center ${
                        activeTab === "saved"
                          ? "bg-orange-500 text-white"
                          : "hover:bg-orange-50"
                      }`}
                    >
                      <FaBookmark className="mr-2" /> Saved
                    </button>
                    <button
                      onClick={() => setActiveTab("rewards")}
                      className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap flex items-center ${
                        activeTab === "rewards"
                          ? "bg-orange-500 text-white"
                          : "hover:bg-orange-50"
                      }`}
                    >
                      <FiAward className="mr-2" /> Reward Points
                    </button>
                    {/* <button
                      onClick={() => setActiveTab("activities")}
                      className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap flex items-center ${
                        activeTab === "activities"
                          ? "bg-orange-500 text-white"
                          : "hover:bg-orange-50"
                      }`}
                    >
                      <FaCalendarAlt className="mr-2" /> Activities
                    </button> */}
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
                          <form
                            id="profile-edit-form"
                            onSubmit={handleProfileSubmit}
                          >
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">
                                  Full Name
                                </label>
                                <input
                                  type="text"
                                  name="name"
                                  defaultValue={userDetails.name}
                                  className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                                  className="w-full p-2 bg-gray-100 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">
                                  Phone
                                </label>
                                <input
                                  type="tel"
                                  name="phone"
                                  defaultValue={userDetails.phone}
                                  className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                                  className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                                  className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                />
                              </div>
                              <div className="flex justify-end mt-2 md:col-span-2">
                                <Button
                                  type="submit"
                                  className="bg-orange-500 hover:bg-orange-500/90"
                                >
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          </form>
                        ) : (
                          <div className="grid grid-cols-1 gap-4 bg-white md:grid-cols-2">
                            <div className="p-3 border border-orange-100 rounded-lg">
                              <p className="text-sm font-medium text-gray-500">
                                Full Name
                              </p>
                              <div className="flex items-center mt-1">
                                <FiUser className="mr-2 text-orange-500" />
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
                                <FiMail className="mr-2 text-orange-500" />
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
                                <FiPhone className="mr-2 text-orange-500" />
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
                                <FiMapPin className="mr-2 text-orange-500" />
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
                    </Card>
                  )}

                  {/* Posts Tab */}
                  {activeTab === "posts" && (
                    <Card className="p-4 border border-orange-200 shadow-lg shadow-orange-100/80 rounded-xl">
                      <h3 className="mb-4 text-xl font-semibold text-gray-800">
                        My Posts
                      </h3>

                      {/* Post items */}
                      <div className="space-y-4">
                        {userPosts.map((post) => (
                          <PostCard
                            key={post._id}
                            post={post as unknown as PostData}
                          />
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
                      {friends.length > 0 ? (
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
                              <Button className="w-full h-8 mt-1 text-xs bg-orange-500 hover:bg-orange-500/90">
                                Message
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                          <FiUsers className="w-12 h-12 mb-4 text-orange-400" />
                          <p className="text-lg font-medium text-gray-600">
                            No Friends Found
                          </p>
                          <p className="mt-2 text-sm text-gray-500">
                            Start connecting with people to see them here
                          </p>
                        </div>
                      )}
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
                          <PostCard
                            key={item._id}
                            post={item as unknown as PostData}
                          />
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Reward Points Tab */}
                  {activeTab === "rewards" && <RewardsSection />}
                  {/* 
                  
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
                  )} */}
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
              activeTab === "profile" ? "text-orange-500" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <FiUser className="text-2xl" />
          </button>

          <button
            className={`relative outline-none cursor-pointer p-2 ${
              activeTab === "friends" ? "text-orange-500" : ""
            }`}
            onClick={() => setActiveTab("friends")}
          >
            <FaUsers className="text-2xl" />
          </button>

          <Link to="/adda" className="relative p-2 outline-none cursor-pointer">
            <FiHome className="text-2xl text-orange-500" />
          </Link>

          <button
            className={`relative outline-none cursor-pointer p-2 ${
              activeTab === "rewards" ? "text-orange-500" : ""
            }`}
            onClick={() => setActiveTab("rewards")}
          >
            <FiAward className="text-2xl" />
          </button>

          <button
            className={`relative outline-none cursor-pointer p-2 ${
              activeTab === "saved" ? "text-orange-500" : ""
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
