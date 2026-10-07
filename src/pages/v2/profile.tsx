import LeftSection from "@/components/adda/userProfile/profile/leftSection";
import CompleteProfileModal from "@/components/adda/userProfile/CompleteProfileModal";
import UserListModal from "@/components/common/modal/userList";
import { Ellipsis, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import {
  ProfileUserDetails,
  ProfilePost,
  Badge,
} from "@/types/adda/userProfile";
import ProfileTabContent from "@/components/adda/userProfile/profile/tabContent";
import LoadingSpinner from "@/components/adda/userProfile/loader/spinner";
import ProfileCompletionWidget from "@/components/adda/cards/profileCompletion";
import { useSubmissionModal } from "@/context/adda/commonModalContext";
import Croppr from "croppr";
import "croppr/dist/croppr.css";
import UserProfileMoreModal from "@/components/common/modal/userProfile.tsx/UserProfileMoreModal";
import CoverPicture from "@/components/adda/profile/coverPicture";
import ProfileFormModal from "./adda/userProfile/profieForm";

interface FollowType {
  _id: string;
  name: string;
  picture: string;
  role: string;
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState<
    "Posts" | "Rewards" | "Saved" | "Details" | "Badges"
  >("Posts");
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [modalType, setModalType] = useState<
    "followers" | "following" | "blocked" | null
  >(null);
  const [userPosts, setUserPosts] = useState<ProfilePost[]>([]);
  const [userSavedPosts, setUserSavedPosts] = useState<ProfilePost[]>([]);
  const [totalFollowers, setTotalFollowers] = useState<string[]>([]);
  const [totalFollowing, setTotalFollowing] = useState<string[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [isFetchingUserData, setIsFetchingUserData] = useState(false);
  const [moreModal, setMoreModal] = useState(false);

  const { showModal, hideModal } = useSubmissionModal();
  const { getToken } = useAuth();
  const { user } = useUser();

  const coverPhotoInputRef = useRef<HTMLInputElement>(null);
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const coverImgRef = useRef<HTMLImageElement>(null);
  const profileImgRef = useRef<HTMLImageElement>(null);

  const coverCropInstance = useRef<any>(null);
  const profileCropInstance = useRef<any>(null);

  const [showCoverCropper, setShowCoverCropper] = useState(false);
  const [showProfileCropper, setShowProfileCropper] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [coverImageLoaded, setCoverImageLoaded] = useState(false);
  const [profileImageLoaded, setProfileImageLoaded] = useState(false);
  const [badges, setBadges] = useState<Badge[]>([]);

  const [userId, setUserId] = useState<string>("");

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

  // Level Tracker State
  // const [currentLevel, setCurrentLevel] = useState(7);
  // const [currentXP, setCurrentXP] = useState(1850);
  // const [xpToNextLevel, setXpToNextLevel] = useState(2400);

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
    if (!userDetails) return 0;
    let completedFields = 0;

    profileFields.forEach((field) => {
      const value = userDetails[field.field as keyof ProfileUserDetails];

      if (field.field === "interests") {
        if ((value as string[])?.length >= (field.minLength || 1))
          completedFields++;
      } else if (field.field === "socialLinks") {
        if ((value as Array<{ label: string; url: string }>)?.length >= 1)
          completedFields++;
      } else if (field.field === "bio") {
        if ((value as string)?.length >= (field.minLength || 1))
          completedFields++;
      } else if (field.field === "picture") {
        if (value || user?.imageUrl) completedFields++;
      } else if (value && String(value).trim() !== "") {
        completedFields++;
      }
    });

    return Math.round((completedFields / profileFields.length) * 100);
  };

  const getIncompleteFields = () => {
    const incompleteFields: string[] = [];
    if (!userDetails) return profileFields.map((f) => f.label);

    profileFields.forEach((field) => {
      if (field.required) return;
      const value = userDetails[field.field as keyof ProfileUserDetails];

      if (field.field === "interests") {
        if (
          !(value as string[])?.length ||
          (value as string[])?.length < (field.minLength || 1)
        )
          incompleteFields.push(field.label);
      } else if (field.field === "socialLinks") {
        if (!(value as Array<{ label: string; url: string }>)?.length)
          incompleteFields.push(field.label);
      } else if (field.field === "bio") {
        if (
          !(value as string) ||
          (value as string).length < (field.minLength || 1)
        )
          incompleteFields.push(field.label);
      } else if (field.field === "picture") {
        if (!value && !user?.imageUrl) incompleteFields.push(field.label);
      } else if (!value || String(value).trim() === "") {
        incompleteFields.push(field.label);
      }
    });

    return incompleteFields;
  };

  const profileCompletionPercentage = getProfileCompletion();
  const isProfileComplete = profileCompletionPercentage === 100;
  const incompleteFields = getIncompleteFields();

  // const progressPercentage = Math.round((currentXP / xpToNextLevel) * 100);

  const fetchUserData = async () => {
    setIsFetchingUserData(true);
    const token = await getToken();
    if (!token) {
      setIsFetchingUserData(false);
      return;
    }

    try {
      const [userResponse, postsResponse, savedPostsResponse, badgeResponse] =
        await Promise.all([
          axios.get(`${import.meta.env.VITE_PROD_URL}/user/user`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(
            `${import.meta.env.VITE_PROD_URL}/posts/user/${user?.id}?currentUser=${user?.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
          axios.get(`${import.meta.env.VITE_PROD_URL}/feeds/saved`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_PROD_URL}/badge`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      const userData = userResponse.data.data;
      setUserDetails(userData);
      setUserId(userData._id);
      console.log(badgeResponse.data.badges);
      setBadges(badgeResponse.data.badges || []);

      setTotalFollowers(
        userData.followers?.map((ele: FollowType) => ele._id) || [],
      );
      setTotalFollowing(
        userData.following?.map((ele: FollowType) => ele._id) || [],
      );
      setBlockedUsers(userData.blockedUsers || []);

      setUserPosts(
        postsResponse.data.data.map((post: ProfilePost) => ({
          ...post,
          postType: post.postType || "text",
          user: post.user || {
            _id: user?.id || "",
            name: userData.name || "",
            picture: userData.picture || "",
            email: userData.email || "",
          },
          shares: post.shares || [],
          saves: post.saves || 0,
          visibility: post.visibility || "public",
        })),
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
        })),
      );
    } catch (error) {
      console.error("Error fetching user data:", error);
      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: "Failed to load profile data",
      });
    } finally {
      setIsFetchingUserData(false);
      setTimeout(hideModal, 2000);
    }
  };

  useEffect(() => {
    if (user?.id) fetchUserData();
  }, [user?.id]);

  useEffect(() => {
    const isModalShown = sessionStorage.getItem("modalShown");
    if (!isModalShown && !isProfileComplete) {
      setShowProfileModal(true);
    }
  }, [isProfileComplete]);

  useEffect(() => {
    if (
      !showCoverCropper ||
      !coverImgRef.current ||
      !coverImageUrl ||
      !coverImageLoaded
    )
      return;

    const timer = setTimeout(() => {
      if (coverImgRef.current && coverImgRef.current.offsetWidth > 0) {
        if (coverCropInstance.current) coverCropInstance.current.destroy();
        coverCropInstance.current = new Croppr(coverImgRef.current, {
          aspectRatio: 3 / 1,
          startSize: [90, 50, "%"],
        });
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      if (coverCropInstance.current) {
        coverCropInstance.current.destroy();
        coverCropInstance.current = null;
      }
    };
  }, [showCoverCropper, coverImageUrl, coverImageLoaded]);

  useEffect(() => {
    if (
      !showProfileCropper ||
      !profileImgRef.current ||
      !profileImageUrl ||
      !profileImageLoaded
    )
      return;

    const timer = setTimeout(() => {
      if (profileImgRef.current && profileImgRef.current.offsetWidth > 0) {
        if (profileCropInstance.current) profileCropInstance.current.destroy();
        profileCropInstance.current = new Croppr(profileImgRef.current, {
          aspectRatio: 1,
          startSize: [70, 70, "%"],
        });
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      if (profileCropInstance.current) {
        profileCropInstance.current.destroy();
        profileCropInstance.current = null;
      }
    };
  }, [showProfileCropper, profileImageUrl, profileImageLoaded]);

  useEffect(() => {
    return () => {
      if (coverImageUrl) URL.revokeObjectURL(coverImageUrl);
      if (profileImageUrl) URL.revokeObjectURL(profileImageUrl);
    };
  }, [coverImageUrl, profileImageUrl]);

  const applyCrop = async (type: "cover" | "profile") => {
    const instance =
      type === "cover"
        ? coverCropInstance.current
        : profileCropInstance.current;
    const imgUrl = type === "cover" ? coverImageUrl : profileImageUrl;
    const setShow =
      type === "cover" ? setShowCoverCropper : setShowProfileCropper;
    const setUrl = type === "cover" ? setCoverImageUrl : setProfileImageUrl;
    const setLoaded =
      type === "cover" ? setCoverImageLoaded : setProfileImageLoaded;

    if (!instance || !imgUrl) return;

    const { x, y, width, height } = instance.getValue();
    const img = new Image();
    img.src = imgUrl;
    await img.decode();

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

    canvas.toBlob(async (blob) => {
      if (blob) {
        const croppedFile = new File(
          [blob],
          type === "cover" ? "cover.jpg" : "profile.jpg",
          {
            type: "image/jpeg",
          },
        );

        if (type === "cover") await handleCoverPhotoChange(croppedFile);
        else await handleProfilePhotoChange(croppedFile);

        setShow(false);
        setLoaded(false);
        setTimeout(() => {
          setUrl(null);
          if (imgUrl) URL.revokeObjectURL(imgUrl);
        }, 300);

        if (instance) instance.destroy();
        if (type === "cover") coverCropInstance.current = null;
        else profileCropInstance.current = null;
      }
    }, "image/jpeg");
  };

  const closeCropper = (type: "cover" | "profile") => {
    const instance =
      type === "cover"
        ? coverCropInstance.current
        : profileCropInstance.current;
    const url = type === "cover" ? coverImageUrl : profileImageUrl;
    const setShow =
      type === "cover" ? setShowCoverCropper : setShowProfileCropper;
    const setUrl = type === "cover" ? setCoverImageUrl : setProfileImageUrl;
    const setLoaded =
      type === "cover" ? setCoverImageLoaded : setProfileImageLoaded;

    if (instance) instance.destroy();

    setShow(false);
    setLoaded(false);
    setUrl(null);
    if (url) setTimeout(() => URL.revokeObjectURL(url), 300);

    if (type === "cover") coverCropInstance.current = null;
    else profileCropInstance.current = null;
  };

  const handleFileSelect = (file: File, type: "cover" | "profile") => {
    if (file.size > 5 * 1024 * 1024) {
      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: "File size should not exceed 5MB",
      });
      return;
    }

    const url = URL.createObjectURL(file);
    if (type === "cover") {
      setCoverImageUrl(url);
      setCoverImageLoaded(false);
      setShowCoverCropper(true);
    } else {
      setProfileImageUrl(url);
      setProfileImageLoaded(false);
      setShowProfileCropper(true);
    }
  };

  const handleCoverPhotoChange = async (file: File) => {
    showModal({
      isSubmitting: true,
      currentStep: "uploading",
      message: "Uploading cover photo...",
    });
    const token = await getToken();
    if (!token) return;

    try {
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
        },
      );

      const fileUrl = uploadResponse.data?.data?.fileDetails?.url;
      if (!fileUrl) throw new Error("Upload failed");

      await user?.update({ unsafeMetadata: { coverPhoto: fileUrl } });
      await axios.put(
        `${import.meta.env.VITE_PROD_URL}/user/profile`,
        { coverImage: fileUrl },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setUserDetails((prev) => ({ ...prev, coverImage: fileUrl }));
      showModal({
        isSubmitting: false,
        currentStep: "success",
        message: "Cover photo updated!",
      });
    } catch (error) {
      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: "Failed to upload cover photo",
      });
    } finally {
      setTimeout(hideModal, 2000);
    }
  };

  const handleProfilePhotoChange = async (file: File) => {
    showModal({
      isSubmitting: true,
      currentStep: "uploading",
      message: "Uploading profile photo...",
    });
    const token = await getToken();
    if (!token) return;

    try {
      await user?.setProfileImage({ file });

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
        },
      );

      const fileUrl = uploadResponse.data?.data?.fileDetails?.url;
      if (!fileUrl) throw new Error("Upload failed");

      await axios.put(
        `${import.meta.env.VITE_PROD_URL}/user/profile`,
        { picture: fileUrl },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setUserDetails((prev) => ({ ...prev, picture: fileUrl }));
      showModal({
        isSubmitting: false,
        currentStep: "success",
        message: "Profile photo updated!",
      });
    } catch (error) {
      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: "Failed to upload profile photo",
      });
    } finally {
      setTimeout(hideModal, 2000);
    }
  };

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
      coverImage: userDetails.coverImage || "",
    };

    const token = await getToken();
    if (!token) {
      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: "Authentication required",
      });
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_PROD_URL}/user/profile`,
        profileData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setUserDetails((prev) => ({ ...prev, ...profileData }));
      setShowCompletionForm(false);
      setShowConfetti(true);

      showModal({
        isSubmitting: false,
        currentStep: "success",
        message: "Profile updated!",
      });
      setTimeout(() => {
        setShowConfetti(false);
        hideModal();
      }, 2000);
    } catch (error) {
      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: "Failed to update profile",
      });
    }
  };

  const removeInterest = (indexToRemove: number) => {
    setUserDetails((prev) => ({
      ...prev,
      interests: (prev.interests || []).filter((_, i) => i !== indexToRemove),
    }));
  };

  const updateInterests = async () => {
    showModal({
      isSubmitting: true,
      currentStep: "saving",
      message: "Updating interests...",
    });
    const token = await getToken();
    if (!token) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_PROD_URL}/user/profile`,
        { interests: userDetails.interests || [] },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      showModal({
        isSubmitting: false,
        currentStep: "success",
        message: "Interests updated!",
      });
    } catch (error) {
      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: "Failed to update interests",
      });
    } finally {
      setTimeout(hideModal, 2000);
    }
  };

  const handleCompleteProfile = () => {
    setShowProfileModal(false);
    setShowCompletionForm(true);
  };

  const handleCloseInitialModal = () => {
    setShowProfileModal(false);
    sessionStorage.setItem("modalShown", "true");
  };

  const onUnblockSuccess = (blockedUserId: string) => {
    setBlockedUsers((prev) => prev.filter((id) => id !== blockedUserId));
  };

  const reduceFollower = (id: string) => {
    setTotalFollowers((prev) => prev.filter((_id) => _id !== id));
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
        onClose={handleCloseInitialModal}
        onCompleteProfile={handleCompleteProfile}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="w-full mx-auto">
          <CoverPicture
            coverPhotoInputRef={coverPhotoInputRef}
            profilePhotoInputRef={profilePhotoInputRef}
            userDetails={userDetails}
            onCoverPhotoSelect={(file) => handleFileSelect(file, "cover")}
            onProfilePhotoSelect={(file) => handleFileSelect(file, "profile")}
          />

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

          {/* Improved Level Tracker - Above Tabs
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
            <div className="px-6 pt-6 pb-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                    <Flame className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      Level {currentLevel}
                    </p>
                    <p className="text-sm text-gray-500 -mt-1">
                      Community Explorer
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-2xl font-semibold text-gray-800">
                      {currentXP}
                    </span>
                    <span className="text-gray-400 text-sm">XP</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {xpToNextLevel - currentXP} XP to Level {currentLevel + 1}
                  </p>
                </div>
              </div> */}

          {/* Progress Bar */}
          {/* <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div
                  className="absolute h-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 rounded-full transition-all duration-700"
                  style={{ width: `${progressPercentage}%` }}
                />
                <div
                  className="absolute h-full w-12 bg-white/30 animate-shimmer"
                  style={{
                    left: `${progressPercentage - 8}%`,
                    opacity: progressPercentage > 5 ? 1 : 0,
                  }}
                />
              </div>
            </div>
          </div> */}

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            <div className="w-full lg:w-1/3">
              <LeftSection
                userDetails={userDetails}
                setUserDetails={setUserDetails}
                handleProfileSubmit={handleProfileSubmit}
                removeInterest={removeInterest}
                updateInterests={updateInterests}
                totalFollowers={totalFollowers}
                totalFollowing={totalFollowing}
                setModalType={setModalType}
              />
            </div>

            <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
                <div className="flex flex-wrap gap-2 sm:gap-3 bg-white rounded-xl p-1 w-fit shadow-sm">
                  {["Posts", "Rewards", "Saved", "Details", "Badges"].map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-2 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 relative ${
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
                                  : "0"}
                          </span>
                        )}
                      </button>
                    ),
                  )}
                </div>

                <div className="relative">
                  <div
                    onClick={() => setMoreModal((prev) => !prev)}
                    className="cursor-pointer"
                  >
                    {moreModal ? <X size={20} /> : <Ellipsis size={20} />}
                  </div>
                  {moreModal && (
                    <UserProfileMoreModal
                      setModalType={setModalType}
                      onClose={() => setMoreModal(false)}
                    />
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-6 lg:p-8">
                <ProfileTabContent
                  badges={badges}
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
        </div>
      </div>

      {modalType && (
        <UserListModal
          userIds={
            modalType === "followers"
              ? totalFollowers
              : modalType === "following"
                ? totalFollowing
                : blockedUsers
          }
          title={
            modalType === "followers"
              ? "Followers"
              : modalType === "following"
                ? "Following"
                : "Blocked Users"
          }
          setShowModal={() => setModalType(null)}
          currentUserId={userId}
          reduceFollower={reduceFollower}
          onUnblockedUser={onUnblockSuccess}
        />
      )}

      {showCoverCropper && coverImageUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => closeCropper("cover")}
        >
          <div
            className="bg-white p-6 rounded-2xl shadow-xl max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Crop Cover Photo</h3>
            <div className="max-h-96 overflow-hidden bg-gray-50 rounded-lg relative">
              {!coverImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Loading image...
                </div>
              )}
              <img
                ref={coverImgRef}
                src={coverImageUrl}
                alt="Crop cover"
                onLoad={() => setCoverImageLoaded(true)}
                className={`w-full transition-opacity duration-200 ${!coverImageLoaded ? "opacity-0" : "opacity-100"}`}
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => closeCropper("cover")}
                className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => applyCrop("cover")}
                disabled={!coverImageLoaded}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfileCropper && profileImageUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => closeCropper("profile")}
        >
          <div
            className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Crop Profile Photo</h3>
            <div className="max-h-96 overflow-hidden bg-gray-50 rounded-lg relative">
              {!profileImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Loading image...
                </div>
              )}
              <img
                ref={profileImgRef}
                src={profileImageUrl}
                alt="Crop profile"
                onLoad={() => setProfileImageLoaded(true)}
                className={`w-full transition-opacity duration-200 ${!profileImageLoaded ? "opacity-0" : "opacity-100"}`}
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => closeCropper("profile")}
                className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => applyCrop("profile")}
                disabled={!profileImageLoaded}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
