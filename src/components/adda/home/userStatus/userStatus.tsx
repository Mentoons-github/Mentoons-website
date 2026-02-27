import Status from "@/components/common/modal/status";
import MediaPreviewModal from "@/components/modals/statusPreview";
import { useAuthModal } from "@/context/adda/authModalContext";
import {
  createStatus,
  deleteStatus,
  fetchStatus,
  sendWatchedStatus,
} from "@/redux/adda/statusSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { UserStatusInterface } from "@/types";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import DosAndDonts from "../../status/dosAndDonts";
import "swiper/swiper-bundle.css";
import { gsap } from "gsap";

const categories = [
  {
    name: "Fun & Entertainment",
    path: "/fun-entertainment",
    imageUrl: "/assets/adda/fun-Entertainement.jpg",
    hover: "Try me",
  },
  {
    name: "Free Downloads",
    path: "/free-download",
    imageUrl: "/assets/adda/free-Downloads.jpg",
    hover: "Download Me",
  },
  {
    name: "Games",
    path: "/adda/game-lobby",
    imageUrl: "/assets/adda/games.jpg",
    hover: "Play Me",
  },
  {
    name: "Quiz",
    path: "/quiz",
    imageUrl: "/assets/adda/quiz.jpg",
    hover: "Answer me",
  },
  {
    name: "Career Corner",
    path: "/joinus/careers",
    imageUrl: "/assets/adda/careerCorner.jpg",
    hover: "Let's Get serious",
  },
];

const UserStatus = () => {
  const { isSignedIn } = useUser();
  const { openAuthModal } = useAuthModal();
  const dispatch = useDispatch<AppDispatch>();
  const { getToken } = useAuth();
  const statusGroups = useSelector(
    (state: RootState) => state.userStatus.statusGroups || [],
  );
  const [selectedStatusGroup, setSelectedStatusGroup] =
    useState<UserStatusInterface | null>(null);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadButtonRef = useRef<HTMLDivElement>(null);
  const guidelinesLinkRef = useRef<HTMLButtonElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const swiperWrapperRef = useRef<HTMLDivElement>(null);
  const avatarRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(sectionRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })
      .fromTo(
        guidelinesLinkRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35 },
        "-=0.1",
      )
      .fromTo(
        uploadButtonRef.current,
        { scale: 0.5, opacity: 0, rotate: -180 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        "-=0.2",
      )
      .fromTo(
        swiperWrapperRef.current,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5 },
        "-=0.3",
      );
  }, []);

  useEffect(() => {
    if (statusGroups.length > 0) {
      const targets = avatarRefs.current.filter(Boolean);
      gsap.fromTo(
        targets,
        { scale: 0.6, opacity: 0, y: 10 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: "back.out(1.4)",
        },
      );
    }
  }, [statusGroups]);

  const handleAvatarHoverEnter = (el: HTMLDivElement | null) => {
    if (!el) return;
    gsap.to(el, { scale: 1.1, duration: 0.2, ease: "power2.out" });
  };

  const handleAvatarHoverLeave = (el: HTMLDivElement | null) => {
    if (!el) return;
    gsap.to(el, { scale: 1, duration: 0.2, ease: "power2.out" });
  };

  const handleUploadButtonHoverEnter = () => {
    gsap.to(uploadButtonRef.current, {
      scale: 1.08,
      rotate: 90,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleUploadButtonHoverLeave = () => {
    gsap.to(uploadButtonRef.current, {
      scale: 1,
      rotate: 0,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  useEffect(() => {
    const fetchStatusWithToken = async () => {
      const token = (await getToken()) || "";
      dispatch(fetchStatus(token));
    };
    fetchStatusWithToken();
  }, [dispatch, getToken]);

  const handleStatus = async (
    statusGroup: UserStatusInterface,
    index: number = 0,
  ) => {
    setSelectedStatusGroup(statusGroup);
    setCurrentStatusIndex(index);
    if (
      !statusGroup.isOwner &&
      statusGroup.statuses &&
      statusGroup.statuses.length > 0
    ) {
      const token = (await getToken()) || "";
      const statusToWatch = statusGroup.statuses[index];
      dispatch(sendWatchedStatus({ statusId: statusToWatch._id, token }));
    }
  };

  const handleNextStatus = async () => {
    if (
      selectedStatusGroup &&
      currentStatusIndex < selectedStatusGroup.statuses.length - 1
    ) {
      const nextIndex = currentStatusIndex + 1;
      setCurrentStatusIndex(nextIndex);
      if (!selectedStatusGroup.isOwner) {
        const token = (await getToken()) || "";
        const statusToWatch = selectedStatusGroup.statuses[nextIndex];
        dispatch(sendWatchedStatus({ statusId: statusToWatch._id, token }));
      }
    } else {
      const currentGroupIndex = statusGroups.findIndex(
        (group) => group.user._id === selectedStatusGroup?.user._id,
      );
      if (currentGroupIndex < statusGroups.length - 1) {
        const nextGroup = statusGroups[currentGroupIndex + 1];
        handleStatus(nextGroup, 0);
      } else {
        setSelectedStatusGroup(null);
        setCurrentStatusIndex(0);
      }
    }
  };

  const handlePreviousStatus = () => {
    if (selectedStatusGroup && currentStatusIndex > 0) {
      setCurrentStatusIndex(currentStatusIndex - 1);
    } else {
      const currentGroupIndex = statusGroups.findIndex(
        (group) => group.user._id === selectedStatusGroup?.user._id,
      );
      if (currentGroupIndex > 0) {
        const prevGroup = statusGroups[currentGroupIndex - 1];
        handleStatus(prevGroup, prevGroup.statuses.length - 1);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSignedIn) {
      openAuthModal("sign-in");
      return;
    }
    const file = event.target.files && event.target.files[0];
    if (file) {
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "video/mp4",
        "video/webm",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload an image or video.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File is too large. Maximum size is 10MB.");
        return;
      }
      setSelectedFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClosePreview = () => {
    setSelectedFile(null);
  };

  const handleSubmitStatus = async (
    imageWithText: Blob | null,
    caption: string,
  ) => {
    setIsSuccess(false);
    if (!selectedFile) return;
    try {
      setIsUploading(true);
      const token = (await getToken()) || "";
      const fileToUpload =
        imageWithText && !selectedFile.type.startsWith("video/")
          ? new File([imageWithText], selectedFile.name, {
              type: selectedFile.type,
            })
          : selectedFile;
      await dispatch(
        createStatus({
          file: fileToUpload,
          caption,
          token,
        }),
      ).unwrap();
      toast.success("Status uploaded successfully!");
      setIsSuccess(false);
      setLoading(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading status:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload status. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteStatus = async (statusId: string) => {
    try {
      const token = (await getToken()) || "";
      await dispatch(deleteStatus({ statusId, token })).unwrap();
      toast.success("Status deleted successfully!");
      setSelectedStatusGroup(null);
    } catch (error) {
      console.error("Error deleting status:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete status. Please try again.",
      );
    }
  };

  return (
    <section ref={sectionRef} className="w-full">
      <div className="flex items-end justify-start gap-1 md:gap-4 md:px-2 sm:flex-row sm:gap-10 sm:px-4 ">
        <div className="flex flex-col items-center justify-center flex-shrink-0 gap-1">
          <button
            ref={guidelinesLinkRef}
            onClick={() => setIsGuidelinesOpen(true)}
            className="text-[#EC9600] text-xs"
          >
            View Guidelines
          </button>
          <label
            htmlFor="upload"
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 relative bg-[#FFDC9F] outline-[#EC9600] outline-dashed outline-offset-2 rounded-full flex justify-center items-center cursor-pointer hover:bg-[#FFE5B2] transition-all duration-200"
          >
            <div
              ref={uploadButtonRef}
              className="w-full h-full flex justify-center items-center"
              onMouseEnter={handleUploadButtonHoverEnter}
              onMouseLeave={handleUploadButtonHoverLeave}
            >
              <FaPlus className="absolute text-[#EC9600] text-2xl sm:text-3xl p-1 border-2 sm:border-3 border-[#EC9600] rounded-full" />
            </div>
            <input
              type="file"
              id="upload"
              ref={fileInputRef}
              hidden
              onChange={handleFileChange}
              accept="image/jpeg, image/jpg, image/png, image/webp, video/mp4, video/webm"
              disabled={isUploading}
            />
          </label>
          <span className="text-xs text-center sm:text-sm">Share Story</span>
        </div>

        <div
          ref={swiperWrapperRef}
          className="flex-grow w-full mt-2 overflow-x-auto scrollbar-thin scrollbar-thumb-[#EC9600] scrollbar-track-gray-100 sm:mt-0 "
        >
          <Swiper
            spaceBetween={8}
            freeMode={true}
            modules={[FreeMode]}
            className="w-full pt-1 pl-1"
            slidesPerView="auto"
            breakpoints={{
              320: { slidesPerView: 3.5, spaceBetween: 5 },
              480: { slidesPerView: 4, spaceBetween: 8 },
              640: { slidesPerView: 4.5, spaceBetween: 8 },
              768: { slidesPerView: 5, spaceBetween: 10 },
              1024: { slidesPerView: 7, spaceBetween: 12 },
              1280: { slidesPerView: 8, spaceBetween: 15 },
            }}
          >
            {statusGroups.map((statusGroup, i) => (
              <SwiperSlide
                key={statusGroup.user._id}
                className="!w-fit flex flex-col gap-1 flex-shrink-0"
                style={{ justifyItems: "center" }}
              >
                <div
                  ref={(el) => (avatarRefs.current[i] = el)}
                  className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full ${
                    !statusGroup.isRead && !statusGroup.isOwner
                      ? "outline outline-[#EC9600]"
                      : "outline outline-gray-300"
                  } flex justify-center items-center`}
                  onMouseEnter={() =>
                    handleAvatarHoverEnter(avatarRefs.current[i])
                  }
                  onMouseLeave={() =>
                    handleAvatarHoverLeave(avatarRefs.current[i])
                  }
                >
                  <img
                    src={statusGroup.user.picture}
                    alt={statusGroup.user.name}
                    className="object-cover w-full h-full rounded-full cursor-pointer"
                    onClick={() => handleStatus(statusGroup)}
                  />
                </div>
                {statusGroup.isOwner ? (
                  <span className="text-xs sm:text-sm text-center truncate max-w-[80px]">
                    Your Story
                  </span>
                ) : (
                  <NavLink
                    to={`/adda/user/${statusGroup.user._id}`}
                    className="text-xs sm:text-sm text-center truncate max-w-[80px]"
                  >
                    {statusGroup.user.name}
                  </NavLink>
                )}
              </SwiperSlide>
            ))}

            {categories.map((category, i) => (
              <SwiperSlide
                key={category.path}
                className="!w-fit flex flex-col gap-1 flex-shrink-0"
                style={{ justifyItems: "center" }}
              >
                <NavLink
                  to={category.path}
                  className={({ isActive }) =>
                    `relative group w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex justify-center items-center cursor-pointer transition-all duration-200 overflow-hidden ${
                      isActive
                        ? "ring-2 ring-offset-2 ring-[#EC9600]"
                        : "outline outline-[#EC9600]"
                    }`
                  }
                  ref={(el) => {
                    if (el) {
                      const idx = statusGroups.length + i;
                      avatarRefs.current[idx] = el as unknown as HTMLDivElement;
                    }
                  }}
                  onMouseEnter={(e) =>
                    gsap.to(e.currentTarget, {
                      scale: 1.1,
                      duration: 0.2,
                      ease: "power2.out",
                    })
                  }
                  onMouseLeave={(e) =>
                    gsap.to(e.currentTarget, {
                      scale: 1,
                      duration: 0.2,
                      ease: "power2.out",
                    })
                  }
                >
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 text-center text-lg font-semibold opacity-0 group-hover:opacity-100 flex items-center justify-center w-full h-full bg-orange-400/90 text-white transition-opacity ease-in">
                    {category.hover}
                  </div>
                </NavLink>
                <span className="text-xs sm:text-sm text-center truncate max-w-[80px]">
                  {category.name}
                </span>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {selectedStatusGroup && selectedStatusGroup.statuses.length > 0 && (
        <Status
          status={{
            ...selectedStatusGroup.statuses[currentStatusIndex],
            isOwner: selectedStatusGroup.isOwner || false,
          }}
          setStatus={() => setSelectedStatusGroup(null)}
          onDelete={handleDeleteStatus}
          onNext={handleNextStatus}
          onPrevious={handlePreviousStatus}
          hasNext={
            currentStatusIndex < selectedStatusGroup.statuses.length - 1 ||
            statusGroups.findIndex(
              (group) => group.user._id === selectedStatusGroup.user._id,
            ) <
              statusGroups.length - 1
          }
          hasPrevious={
            currentStatusIndex > 0 ||
            statusGroups.findIndex(
              (group) => group.user._id === selectedStatusGroup.user._id,
            ) > 0
          }
          totalStatuses={selectedStatusGroup.statuses.length}
          currentIndex={currentStatusIndex}
        />
      )}

      {selectedFile && (
        <MediaPreviewModal
          isSuccess={isSuccess}
          isLoading={loading}
          setIsLoading={setLoading}
          file={selectedFile}
          onClose={handleClosePreview}
          onSubmit={handleSubmitStatus}
        />
      )}

      <DosAndDonts
        isOpen={isGuidelinesOpen}
        onClose={() => setIsGuidelinesOpen(false)}
      />
    </section>
  );
};

export default UserStatus;
