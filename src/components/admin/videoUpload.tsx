import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { FaPlayCircle, FaPlus, FaTrashAlt } from "react-icons/fa";
import { errorToast, successToast } from "../../utils/toastResposnse";

interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    fileDetails: {
      url: string;
      key: string;
      originalName: string;
      mimetype: string;
      uploadedAt: string;
      userId: string;
      fileSize: number;
    };
  };
}

interface VideoData {
  videoUrl: string;
}

const VideoUpload = ({
  onVideoUpload,
  multiple = false,
  initialVideos = [],
}: {
  onVideoUpload: (videos: VideoData[]) => void;
  multiple?: boolean;
  initialVideos?: VideoData[];
}) => {
  const [uploading, setUploading] = useState(false);
  const [productVideos, setProductVideos] =
    useState<VideoData[]>(initialVideos);
  const { getToken } = useAuth();

  // Initialize with initial videos if provided
  useEffect(() => {
    if (initialVideos && initialVideos.length > 0) {
      setProductVideos(initialVideos);
    }
  }, [initialVideos]);

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (!files.length) return;

    setUploading(true);

    try {
      const token = await getToken();

      // Handle each file one by one
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          "https://mentoons-backend-zlx3.onrender.com/api/v1/upload/file",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = (await response.json()) as UploadResponse;

        if (data.success && data.data.fileDetails) {
          // Create new video data object with the URL
          const newVideoData: VideoData = {
            videoUrl: data.data.fileDetails.url,
          };

          // Update the product videos array based on multiple flag
          if (multiple) {
            const newProductVideos = [...productVideos, newVideoData];
            setProductVideos(newProductVideos);
            onVideoUpload(newProductVideos);
          } else {
            // If single video, replace existing
            const newProductVideos = [newVideoData];
            setProductVideos(newProductVideos);
            onVideoUpload(newProductVideos);
          }

          successToast("Video uploaded successfully");
        } else {
          errorToast("Failed to process uploaded video");
        }
      }
    } catch (error) {
      console.error("Error uploading videos:", error);
      errorToast("Failed to upload video");
    } finally {
      setUploading(false);
      // Clear the input value to allow uploading the same file again
      const fileInput = document.getElementById(
        "video-upload"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }
  };

  const removeVideo = (indexToRemove: number) => {
    const updatedVideos = productVideos.filter(
      (_, index) => index !== indexToRemove
    );
    setProductVideos(updatedVideos);
    onVideoUpload(updatedVideos);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="file"
          onChange={handleVideoChange}
          multiple={multiple}
          accept="video/*"
          className="hidden"
          id="video-upload"
          disabled={uploading}
        />
        <label
          htmlFor="video-upload"
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700 disabled:opacity-50"
        >
          <FaPlus className="mr-2" />
          {uploading ? "Uploading..." : "Add Video"}
        </label>
        {uploading && (
          <span className="text-sm text-gray-500">
            Uploading, please wait...
          </span>
        )}
      </div>

      {/* Video Preview Section */}
      {productVideos.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-2 text-sm font-medium text-gray-700">
            Video Preview
          </h4>
          <div
            className={`grid gap-4 ${
              multiple ? "grid-cols-2 sm:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {productVideos.map((video, index) => (
              <div key={index} className="relative group">
                <div className="relative overflow-hidden bg-gray-100 border border-gray-200 rounded shadow-sm aspect-video">
                  <video
                    src={video.videoUrl}
                    className="object-cover w-full h-full"
                    controls
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none group-hover:opacity-0">
                    <FaPlayCircle className="text-4xl text-white" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeVideo(index)}
                  className="absolute p-1 text-white transition-opacity bg-red-500 rounded-full opacity-0 top-2 right-2 group-hover:opacity-100"
                  title="Remove video"
                >
                  <FaTrashAlt size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
