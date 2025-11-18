import LeftSection from "@/components/adda/userProfile/profile/leftSection";
import ProfileFormModal from "./adda/userProfile/profieForm";
import CompleteProfileModal from "@/components/adda/userProfile/CompleteProfileModal";
import UserListModal from "@/components/common/modal/userList";
import PhotosCard from "./adda/userProfile/cards/photosCard";
import { Camera } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { ProfileUserDetails, ProfilePost } from "@/types/adda/userProfile";
import ProfileTabContent from "@/components/adda/userProfile/profile/tabContent";
import LoadingSpinner from "@/components/adda/userProfile/loader/spinner";
import ProfileCompletionWidget from "@/components/adda/cards/profileCompletion";
import { useSubmissionModal } from "@/context/adda/commonModalContext";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Posts");
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [modalType, setModalType] = useState<"followers" | "following" | null>(
    null
  );
  const [userPosts, setUserPosts] = useState<ProfilePost[]>([]);
  const [userSavedPosts, setUserSavedPosts] = useState<ProfilePost[]>([]);
  const [totalFollowers, setTotalFollowers] = useState<string[]>([]);
  const [totalFollowing, setTotalFollowing] = useState<string[]>([]);
  const [isFetchingUserData, setIsFetchingUserData] = useState(false);
  const { showModal, hideModal } = useSubmissionModal();
  const { getToken } = useAuth();
  const { user } = useUser();
  const coverPhotoInputRef = useRef<HTMLInputElement>(null);
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);

  const profileFields = [
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

  const getProfileCompletion = () => {
    let completedFields = 0;
    if (!userDetails) return 0;

    profileFields.forEach((field) => {
      const value = userDetails[field.field as keyof ProfileUserDetails];
      if (field.field === "interests") {
        if ((value as string[])?.length >= (field.minLength || 1)) {
          completedFields++;
        }
      } else if (field.field === "socialLinks") {
        if ((value as Array<{ label: string; url: string }>)?.length >= 1) {
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
      if (field.required) return;
      const value = userDetails[field.field as keyof ProfileUserDetails];
      if (field.field === "interests") {
        if (
          !(value as string[])?.length ||
          (value as string[])?.length < (field.minLength || 1)
        ) {
          incompleteFields.push(field.label);
        }
      } else if (field.field === "socialLinks") {
        if (!(value as Array<{ label: string; url: string }>)?.length) {
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

  const [userDetails, setUserDetails] = useState<ProfileUserDetails>({
    _id: "",
    name: "",
    email: "",
    picture: "",
    phoneNumber: "",
    location: "",
    bio: "",
    education: "",
    occupation: "",
    interests: [],
    coverImage: "",
    dateOfBirth: "",
    gender: "",
    socialLinks: [],
    joinedDate: "",
  });

  const profileCompletionPercentage = getProfileCompletion();
  const isProfileComplete = profileCompletionPercentage === 100;
  const incompleteFields = getIncompleteFields();

  const fetchUserData = async () => {
    setIsFetchingUserData(true);
    const token = await getToken();
    if (!token) {
      setIsFetchingUserData(false);
      return;
    }
    try {
      const [userResponse, postsResponse, savedPostsResponse] =
        await Promise.all([
          axios.get(`${import.meta.env.VITE_PROD_URL}/user/user/${user?.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(
            `${import.meta.env.VITE_PROD_URL}/posts/user/${
              user?.id
            }?currentUser=${user?.id}`,
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
        postsResponse.data.data.map((post: ProfilePost) => ({
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
        savedPostsResponse.data.data.map((post: ProfilePost) => ({
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
      console.error("Error fetching user data:", error);
      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: "Failed to load profile data",
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsFetchingUserData(false);
      setTimeout(hideModal, 2000);
    }
  };

  useEffect(() => {
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
    showModal({
      isSubmitting: true,
      currentStep: "saving",
      message: "Updating profile...",
    });

    const profileData = {
      name: userDetails.name || user?.fullName || "",
      email: userDetails.email || user?.primaryEmailAddress?.emailAddress || "",
      phoneNumber: userDetails.phoneNumber || "",
      location: userDetails.location || "",
      dateOfBirth: userDetails.dateOfBirth || "",
      gender: userDetails.gender || "",
      bio: userDetails.bio || "",
      education: userDetails.education || "",
      occupation: userDetails.occupation || "",
      interests: userDetails.interests || [],
      socialLinks: userDetails.socialLinks || [],
      picture: userDetails.picture || user?.imageUrl || "",
      coverImage: (user?.unsafeMetadata?.coverPhoto as string) || "",
    };

    const token = await getToken();
    if (!token) {
      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: "Authentication required",
        error: "No token found",
      });
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_PROD_URL}/user/profile`,
        profileData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setUserDetails((prev) => ({ ...prev, ...profileData }));
        setShowCompletionForm(false);
        setShowConfetti(true);
        showModal({
          isSubmitting: false,
          currentStep: "success",
          message: "Profile updated successfully!",
        });
        setTimeout(() => {
          setShowConfetti(false);
          hideModal();
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: "Failed to update profile",
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const handleCoverPhotoChange = async (file: File) => {
    showModal({
      isSubmitting: true,
      currentStep: "uploading",
      message: "Uploading cover photo...",
    });

    const token = await getToken();
    if (!token) {
      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: "Authentication required",
        error: "No token found",
      });
      return;
    }

    try {
      if (file.size > 5 * 1024 * 1024) {
        showModal({
          isSubmitting: false,
          currentStep: "error",
          message: "File size should not exceed 5MB",
        });
        return;
      }

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
        showModal({
          isSubmitting: false,
          currentStep: "error",
          message: "Failed to upload cover photo",
          error: "No file URL returned",
        });
        return;
      }

      await user?.update({ unsafeMetadata: { coverPhoto: fileUrl } });

      await axios.put(
        `${import.meta.env.VITE_PROD_URL}/user/profile`,
        { coverImage: fileUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserDetails((prev) => ({ ...prev, coverImage: fileUrl }));
      showModal({
        isSubmitting: false,
        currentStep: "success",
        message: "Cover photo updated successfully!",
      });
      setTimeout(hideModal, 2000);
    } catch (error) {
      console.error("Error uploading cover photo:", error);
      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: "Failed to upload cover photo",
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const handleProfilePhotoChange = async (file: File) => {
    showModal({
      isSubmitting: true,
      currentStep: "uploading",
      message: "Uploading profile photo...",
    });

    const token = await getToken();
    if (!token) {
      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: "Authentication required",
        error: "No token found",
      });
      return;
    }

    try {
      if (file.size > 5 * 1024 * 1024) {
        showModal({
          isSubmitting: false,
          currentStep: "error",
          message: "File size should not exceed 5MB",
        });
        return;
      }

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
        showModal({
          isSubmitting: false,
          currentStep: "error",
          message: "Failed to upload profile photo",
          error: "No file URL returned",
        });
        return;
      }

      await axios.put(
        `${import.meta.env.VITE_PROD_URL}/user/profile`,
        { picture: fileUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserDetails((prev) => ({ ...prev, picture: fileUrl }));
      showModal({
        isSubmitting: false,
        currentStep: "success",
        message: "Profile photo updated successfully!",
      });
      setTimeout(hideModal, 2000);
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: "Failed to upload profile photo",
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
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
    showModal({
      isSubmitting: true,
      currentStep: "saving",
      message: "Updating interests...",
    });

    const token = await getToken();
    if (!token) {
      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: "Authentication required",
        error: "No token found",
      });
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_PROD_URL}/user/profile`,
        { interests: userDetails.interests || [] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showModal({
        isSubmitting: false,
        currentStep: "success",
        message: "Interests updated successfully!",
      });
      setTimeout(hideModal, 2000);
    } catch (error) {
      console.error("Error updating interests:", error);
      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: "Failed to update interests",
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const handleCompleteProfile = () => {
    setShowProfileModal(false);
    setShowCompletionForm(true);
  };


  if (isFetchingUserData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={200}
          className="fixed top-0 left-0 z-50 w-full h-full"
        />
      )}
      <CompleteProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onCompleteProfile={handleCompleteProfile}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative mb-6 sm:mb-8">
            <div
              className={`w-full h-48 sm:h-64 lg:h-80 rounded-t-2xl bg-cover bg-center ${
                userDetails.coverImage
                  ? ""
                  : "bg-gradient-to-r from-orange-300 to-green-400"
              }`}
              style={
                userDetails.coverImage
                  ? { backgroundImage: `url(${userDetails.coverImage})` }
                  : {}
              }
            >
              <div
                className="absolute bottom-2 right-2 p-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 w-10 h-10 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => coverPhotoInputRef.current?.click()}
              >
                <Camera className="w-5 h-5 text-white" />
              </div>
              <input
                type="file"
                ref={coverPhotoInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleCoverPhotoChange(file);
                  }
                }}
              />
            </div>
          </div>

          {!isProfileComplete && !showCompletionForm && (
            <ProfileCompletionWidget
              profileCompletionPercentage={profileCompletionPercentage}
              incompleteFields={incompleteFields}
              setShowCompletionForm={setShowCompletionForm}
              isProfileComplete={isProfileComplete}
            />
          )}
          {showCompletionForm && (
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 mb-6 sm:mb-8">
              <ProfileFormModal
                userDetails={userDetails}
                setUserDetails={setUserDetails}
                setShowCompletionForm={setShowCompletionForm}
                handleProfileSubmit={handleProfileSubmit}
                removeInterest={removeInterest}
                updateInterests={updateInterests}
                isOpen={showCompletionForm}
              />
            </div>
          )}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            <div className="w-full lg:w-1/3">
              <LeftSection
                userDetails={userDetails}
                setUserDetails={setUserDetails}
                handleProfileSubmit={handleProfileSubmit}
                removeInterest={removeInterest}
                updateInterests={updateInterests}
                coverPhotoInputRef={coverPhotoInputRef}
                profilePhotoInputRef={profilePhotoInputRef}
                handleCoverPhotoChange={handleCoverPhotoChange}
                handleProfilePhotoChange={handleProfilePhotoChange}
                totalFollowers={totalFollowers}
                totalFollowing={totalFollowing}
                setModalType={setModalType}
              />
            </div>
            <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div className="flex flex-wrap gap-2 sm:gap-3 bg-white rounded-xl p-1 w-fit shadow-sm">
                  {["Posts", "Rewards", "Saved", "Details"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 relative ${
                        activeTab === tab
                          ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-md"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <span className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs">
                          {tab === "Posts"
                            ? userPosts.length
                            : tab === "Rewards"
                            ? 8
                            : tab === "Saved"
                            ? userSavedPosts.length
                            : "1"}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 sm:p-6 lg:p-8">
                {activeTab === "Posts" && (
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      My Posts
                    </h2>
                  </div>
                )}
                {activeTab === "Rewards" && (
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      My Rewards
                    </h2>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base">
                      Achievements and recognition earned through community
                      participation
                    </p>
                  </div>
                )}
                {activeTab === "Saved" && (
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Saved Items
                    </h2>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base">
                      Content you've bookmarked for later reference
                    </p>
                  </div>
                )}
                {activeTab === "Details" && (
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Profile Details
                    </h2>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base">
                      Your personal information and preferences
                    </p>
                  </div>
                )}
                <ProfileTabContent
                  activeTab={activeTab}
                  userPosts={userPosts}
                  userSavedPosts={userSavedPosts}
                  userDetails={userDetails}
                  setUserPosts={setUserPosts}
                  setShowCompletionForm={setShowCompletionForm}
                />
              </div>
            </div>
          </div>
          {/* <div className="mt-4 sm:mt-6 lg:mt-8">
            <PhotosCard userPosts={userPosts} />
          </div> */}
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
