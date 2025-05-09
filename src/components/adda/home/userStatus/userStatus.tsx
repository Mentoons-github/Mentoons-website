import Status from "@/components/common/modal/status";
import MediaPreviewModal from "@/components/modals/statusPreview";
import { STATUSES } from "@/constant/adda/status";
import {
  fetchStatus,
  markAsWatched,
  sendWatchedStatus,
} from "@/redux/adda/statusSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { StatusInterface } from "@/types";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { toast } from "sonner";

const UserStatus = () => {
  const dispatch = useDispatch<AppDispatch>();
  const fetchedStatus = useSelector(
    (state: RootState) => state.userStatus.statuses
  );

  const [statuses, setStatuses] = useState<StatusInterface[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<StatusInterface | null>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [timeOutId, setTimeOutId] = useState<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setStatuses(STATUSES);
    dispatch(fetchStatus);
  }, [dispatch]);

  useEffect(() => {
    if (fetchedStatus.length > 0) {
      setStatuses(fetchedStatus);
    } else {
      setStatuses(STATUSES);
    }
  }, [fetchedStatus]);

  const handleStatus = (status: StatusInterface) => {
    console.log(status);
    setSelectedStatus(status);
    dispatch(markAsWatched({ id: status.id }));
    console.log("dispatched");

    if (timeOutId) clearTimeout(timeOutId);
    const id = setTimeout(() => {
      dispatch(sendWatchedStatus);
    }, 10000);

    setTimeOutId(id);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!selectedFile) return;

    try {
      setIsUploading(true);

      const formData = new FormData();

      if (imageWithText && !selectedFile.type.startsWith("video/")) {
        const processedFile = new File([imageWithText], selectedFile.name, {
          type: selectedFile.type,
        });
        formData.append("file", processedFile);
      } else {
        formData.append("file", selectedFile);
      }

      formData.append("caption", caption);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newStatus: StatusInterface = {
        id: `status-${Date.now()}`,
        userId: "current-user",
        username: "You",
        userProfilePicture: URL.createObjectURL(selectedFile),
        mediaUrl: imageWithText
          ? URL.createObjectURL(imageWithText)
          : URL.createObjectURL(selectedFile),
        caption: caption,
        timestamp: new Date().toISOString(),
        status: "unwatched",
        duration: selectedFile.type.startsWith("video/") ? 30 : 5,
        viewCount: 0,
        type: selectedFile.type.startsWith("video/") ? "video" : "image",
        url: imageWithText
          ? URL.createObjectURL(imageWithText)
          : URL.createObjectURL(selectedFile),
        createdAt: new Date().toISOString(),
      };

      setStatuses((prev) => [newStatus, ...prev]);

      toast.success("Status uploaded successfully!");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading status:", error);
      toast.error("Failed to upload status. Please try again.");
    } finally {
      setIsUploading(false);
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
            {statuses.map((status) => (
              <SwiperSlide
                key={status.id}
                className="!w-fit flex flex-col gap-1 flex-shrink-0"
                style={{ justifyItems: "center" }}
              >
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full outline flex justify-center items-center ${
                    status.status === "unwatched"
                      ? "outline-gray-400"
                      : "outline-[#EC9600]"
                  }`}
                >
                  <img
                    src={status.userProfilePicture}
                    alt={status.username}
                    className="object-cover w-full h-full rounded-full cursor-pointer"
                    onClick={() => handleStatus(status)}
                  />
                </div>
                <span className="text-xs sm:text-sm text-center truncate max-w-[80px]">
                  {status.username}
                </span>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {selectedStatus && (
        <Status
          status={selectedStatus}
          setStatus={() => setSelectedStatus(null)}
        />
      )}
      {selectedFile && (
        <MediaPreviewModal
          file={selectedFile}
          onClose={handleClosePreview}
          onSubmit={handleSubmitStatus}
        />
      )}
    </section>
  );
};

export default UserStatus;
