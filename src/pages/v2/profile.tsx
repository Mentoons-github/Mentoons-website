import LeftSection from "@/components/adda/userProfile/profile/leftSection";
import ProfileFormModal from "./adda/userProfile/profieForm";
import CompleteProfileModal from "@/components/adda/userProfile/CompleteProfileModal";
import UserListModal from "@/components/common/modal/userList";
import { Camera, Ellipsis, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { ProfileUserDetails, ProfilePost } from "@/types/adda/userProfile";
import ProfileTabContent from "@/components/adda/userProfile/profile/tabContent";
import LoadingSpinner from "@/components/adda/userProfile/loader/spinner";
import ProfileCompletionWidget from "@/components/adda/cards/profileCompletion";
import { useSubmissionModal } from "@/context/adda/commonModalContext";
import Croppr from "croppr";
import "croppr/dist/croppr.css";
import UserProfileMoreModal from "@/components/common/modal/userProfile.tsx/UserProfileMoreModal";

interface FollowType {
  _id: string;
  name: string;
  picture: string;
  role: string;
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Posts");
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
  const [userId, setUserId] = useState<string>("");
  const [moreModal, setMoreModal] = useState<boolean>(false);

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

  const getProfileCompletion = () => {
    let completedFields = 0;
    if (!userDetails) return 0;
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
      } else if (value && String(value).trim() !== "") completedFields++;
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
      } else if (!value || String(value).trim() === "")
        incompleteFields.push(field.label);
    });
    return incompleteFields;
  };

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
          axios.get(`${import.meta.env.VITE_PROD_URL}/user/user`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(
            `${import.meta.env.VITE_PROD_URL}/posts/user/${
              user?.id
            }?currentUser=${user?.id}`,
            { headers: { Authorization: `Bearer ${token}` } },
          ),
          axios.get(`${import.meta.env.VITE_PROD_URL}/feeds/saved`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
      setUserDetails(userResponse.data.data);
      setUserId(userResponse.data.data._id);
      setTotalFollowers(
        userResponse.data.data.followers.map((ele: FollowType) => ele._id) ||
          [],
      );
      setTotalFollowing(
        userResponse.data.data.following.map((ele: FollowType) => ele._id) ||
          [],
      );
      setBlockedUsers(
        userResponse.data.data.blockedUsers.map((ele: string) => ele) || [],
      );
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
  }, [user?.id, getToken]);

  useEffect(() => {
    const isModalShown = sessionStorage.getItem("modalShown");
    if (!isModalShown) setShowProfileModal(true);
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
      if (
        coverImgRef.current &&
        coverImgRef.current.offsetWidth > 0 &&
        coverImgRef.current.offsetHeight > 0
      ) {
        if (coverCropInstance.current) {
          try {
            coverCropInstance.current.destroy();
          } catch {}
          coverCropInstance.current = null;
        }
        coverCropInstance.current = new Croppr(coverImgRef.current, {
          aspectRatio: 3 / 1,
          startSize: [90, 50, "%"],
        });
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      if (coverCropInstance.current) {
        try {
          coverCropInstance.current.destroy();
        } catch {}
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
      if (
        profileImgRef.current &&
        profileImgRef.current.offsetWidth > 0 &&
        profileImgRef.current.offsetHeight > 0
      ) {
        if (profileCropInstance.current) {
          try {
            profileCropInstance.current.destroy();
          } catch {}
          profileCropInstance.current = null;
        }
        profileCropInstance.current = new Croppr(profileImgRef.current, {
          aspectRatio: 1,
          startSize: [70, 70, "%"],
        });
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      if (profileCropInstance.current) {
        try {
          profileCropInstance.current.destroy();
        } catch {}
        profileCropInstance.current = null;
      }
    };
  }, [showProfileCropper, profileImageUrl, profileImageLoaded]);

  useEffect(() => {
    return () => {
      if (coverImageUrl) URL.revokeObjectURL(coverImageUrl);
      if (profileImageUrl) URL.revokeObjectURL(profileImageUrl);
    };
  }, []);

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

        try {
          instance.destroy();
        } catch {}
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

    if (instance) {
      try {
        instance.destroy();
      } catch {}
    }
    if (type === "cover") coverCropInstance.current = null;
    else profileCropInstance.current = null;

    setShow(false);
    setLoaded(false);
    setUrl(null);
    if (url) setTimeout(() => URL.revokeObjectURL(url), 300);
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
    if (!token) {
      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: "Authentication required",
      });
      return;
    }
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
      setTimeout(hideModal, 2000);
    } catch (error) {
      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: "Failed to upload cover photo",
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
      });
      return;
    }
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
      setTimeout(hideModal, 2000);
    } catch (error) {
      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: "Failed to upload profile photo",
      });
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
    if (!token)
      return showModal({
        isSubmitting: false,
        currentStep: "error",
        message: "Authentication required",
      });

    try {
      await axios.put(
        `${import.meta.env.VITE_PROD_URL}/user/profile`,
        profileData,
        { headers: { Authorization: `Bearer ${token}` } },
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
    if (!token)
      return showModal({
        isSubmitting: false,
        currentStep: "error",
        message: "Authentication required",
      });

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
      setTimeout(hideModal, 2000);
    } catch (error) {
      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: "Failed to update interests",
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

  const reduceFollower = (id: string) => {
    setTotalFollowers((prev) => prev.filter((_id) => _id !== id));
  };
  // const addFollowing = (id: string) => {
  //   setTotalFollowing((prev) => [...prev, id]);
  // };

  const handleCloseInitialModal = () => {
    setShowProfileModal(false);
    sessionStorage.setItem("modalShown", "true");
  };

  const onUnblockSuccess = (userId: string) => {
    setBlockedUsers((prev) => prev.filter((id) => id !== userId));
  };

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
                onChange={(e) =>
                  e.target.files?.[0] &&
                  handleFileSelect(e.target.files[0], "cover")
                }
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
                profilePhotoInputRef={profilePhotoInputRef}
                handleProfilePhotoChange={handleProfilePhotoChange}
                totalFollowers={totalFollowers}
                totalFollowing={totalFollowing}
                setModalType={setModalType}
                onProfilePhotoSelect={(file) =>
                  handleFileSelect(file, "profile")
                }
              />
            </div>

            <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
                <div className="flex flex-wrap gap-2 sm:gap-3 bg-white rounded-xl p-1 w-fit shadow-sm">
                  {["Posts", "Rewards", "Saved", "Details"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
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
                                : "1"}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <div onClick={() => setMoreModal((prev) => !prev)}>
                    {moreModal ? <X /> : <Ellipsis />}
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
          onUnblockedUser={(blockedUserId: string) =>
            onUnblockSuccess(blockedUserId)
          }
          // addFollowing={addFollowing}
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
                className={`w-full transition-opacity duration-200 ${
                  !coverImageLoaded ? "opacity-0" : "opacity-100"
                }`}
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
                className={`w-full transition-opacity duration-200 ${
                  !profileImageLoaded ? "opacity-0" : "opacity-100"
                }`}
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
