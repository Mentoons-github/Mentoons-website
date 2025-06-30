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
import "swiper/swiper-bundle.css";

const videos = [
  {
    id: 1,
    src: "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/how_Mentoons_Works/Sarah%2C+35+Years%2C+Elementary+School+Teacher.mp4",
    thumbnail:
      "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/how_Mentoons_Works/thumbnails/how+mentoons+works+4.jpg",
    title: "Sarah's Assessment Approach",
    description:
      "Watch Sarah, an elementary school educator, share how Mentoons helped her develop more effective assessment methods and track student growth through creative storytelling.",
  },
  {
    id: 2,
    src: "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/how_Mentoons_Works/Raj%2C+42+Years%2C+IT+Manager%2C+Podcast+%26+Convo+Ca.mp4",
    thumbnail:
      "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/how_Mentoons_Works/thumbnails/how+mentoons+works+1.jpg",
    title: "Raj's Journey with Mentoons",
    description:
      "Meet Raj, a 42-year-old IT Manager who discovered how Mentoons transformed his approach to conversations and podcasting, enhancing his communication skills both at work and home.",
  },
  {
    id: 3,
    src: "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/how_Mentoons_Works/Olivia%2C+28+Years%2C+Psychologist.mp4",
    thumbnail:
      "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/how_Mentoons_Works/thumbnails/Untitled_Artwork+47.png",
    title: "Olivia's Professional Growth",
    description:
      "Discover how Olivia, a 28-year-old psychologist, uses Mentoons to enhance her practice and connect better with clients through innovative storytelling techniques.",
  },
  {
    id: 4,
    src: "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/how_Mentoons_Works/Samantha%2C+35+Years%2C+Elementary+School+Teacher.mp4",
    thumbnail:
      "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/how_Mentoons_Works/thumbnails/how+mentoons+works+3.jpg",
    title: "Samantha's Teaching Transformation",
    description:
      "See how Samantha, a 35-year-old elementary school teacher, revolutionized her classroom dynamics using Mentoons to foster better family conversations and student engagement.",
  },
  {
    id: 5,
    src: "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/how_Mentoons_Works/Rajesh+K+42+Years+old+IT+Manager.mp4",
    thumbnail:
      "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/how_Mentoons_Works/thumbnails/how+mentoons+works+5.jpg",
    title: "Rajesh's Success Story",
    description:
      "Learn how Rajesh, an experienced IT Manager, leveraged Mentoons' comics and stories to improve team communication and leadership effectiveness in his organization.",
  },
];

const UserStatus = () => {
  const { isSignedIn } = useUser();
  const { openAuthModal } = useAuthModal();
  const dispatch = useDispatch<AppDispatch>();
  const { getToken } = useAuth();
  const statusGroups = useSelector(
    (state: RootState) => state.userStatus.statusGroups || []
  );
  const [selectedStatusGroup, setSelectedStatusGroup] =
    useState<UserStatusInterface | null>(null);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<(typeof videos)[0] | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchStatusWithToken = async () => {
      const token = (await getToken()) || "";
      dispatch(fetchStatus(token));
    };
    fetchStatusWithToken();
  }, [dispatch, getToken]);

  const handleStatus = async (
    statusGroup: UserStatusInterface,
    index: number = 0
  ) => {
    setSelectedStatusGroup(statusGroup);
    setCurrentStatusIndex(index);
    setSelectedVideo(null);
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

  const handleVideoClick = (video: (typeof videos)[0]) => {
    setSelectedVideo(video);
    setSelectedStatusGroup(null);
    setCurrentStatusIndex(0);
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
        (group) => group.user._id === selectedStatusGroup?.user._id
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
        (group) => group.user._id === selectedStatusGroup?.user._id
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
    caption: string
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
        })
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
          : "Failed to upload status. Please try again."
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
          : "Failed to delete status. Please try again."
      );
    }
  };

  return (
    <section className="w-full">
      <div className="flex items-center justify-start gap-4 px-2 py-2 sm:flex-row sm:gap-10 sm:px-4">
        <div className="flex flex-col items-center justify-center flex-shrink-0 gap-1">
          <label
            htmlFor="upload"
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 relative bg-[#FFDC9F] outline-[#EC9600] outline-dashed outline-offset-2 rounded-full flex justify-center items-center cursor-pointer hover:bg-[#FFE5B2] transition-all duration-200"
          >
            <FaPlus className="absolute text-[#EC9600] text-2xl sm:text-3xl p-1 border-2 sm:border-3 border-[#EC9600] rounded-full" />
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
        <div className="flex-grow w-full mt-2 overflow-x-auto scrollbar-thin scrollbar-thumb-[#EC9600] scrollbar-track-gray-100 sm:mt-0">
          <Swiper
            spaceBetween={8}
            freeMode={true}
            modules={[FreeMode]}
            className="w-full"
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
            {statusGroups.map((statusGroup) => (
              <SwiperSlide
                key={statusGroup.user._id}
                className="!w-fit flex flex-col gap-1 flex-shrink-0"
                style={{ justifyItems: "center" }}
              >
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full ${
                    !statusGroup.isRead && !statusGroup.isOwner
                      ? "outline outline-[#EC9600]"
                      : "outline outline-gray-300"
                  } flex justify-center items-center`}
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
            {videos.map((video) => (
              <SwiperSlide
                key={`video-${video.id}`}
                className="!w-fit flex flex-col gap-1 flex-shrink-0"
                style={{ justifyItems: "center" }}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full outline outline-[#EC9600] flex justify-center items-center">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="object-cover w-full h-full rounded-full cursor-pointer"
                    onClick={() => handleVideoClick(video)}
                  />
                </div>
                <span className="text-xs sm:text-sm text-center truncate max-w-[80px]">
                  {video.title}
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
              (group) => group.user._id === selectedStatusGroup.user._id
            ) <
              statusGroups.length - 1
          }
          hasPrevious={
            currentStatusIndex > 0 ||
            statusGroups.findIndex(
              (group) => group.user._id === selectedStatusGroup.user._id
            ) > 0
          }
          totalStatuses={selectedStatusGroup.statuses.length}
          currentIndex={currentStatusIndex}
        />
      )}

      {selectedVideo && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-[999999999]">
          <div className="relative w-full max-w-2xl p-4">
            <button
              className="absolute top-2 -right-5 text-white text-2xl"
              onClick={() => setSelectedVideo(null)}
            >
              ×
            </button>
            <video
              className="w-full h-auto rounded-lg"
              controls
              autoPlay
              poster={selectedVideo.thumbnail}
            >
              <source src={selectedVideo.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="mt-4 text-white">
              <h3 className="text-lg font-semibold">{selectedVideo.title}</h3>
              <p className="text-sm">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
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
    </section>
  );
};

export default UserStatus;
