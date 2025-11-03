import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";

interface PhotoVideoFormProps {
  postType: "photo" | "video";
  mediaPreview: string[];
  handleMediaUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: unknown) => void
  ) => void;
  setFieldValue: (field: string, value: unknown) => void;
  setMediaPreview: (previews: string[]) => void;
  isPastedImage?: boolean;
}

const PhotoVideoForm: React.FC<PhotoVideoFormProps> = ({
  postType,
  mediaPreview,
  handleMediaUpload,
  setFieldValue,
  setMediaPreview,
  isPastedImage,
}) => {
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
          Upload {postType === "photo" ? "Image" : "Video"}
        </h3>

        <input
          type="file"
          accept={postType === "photo" ? "image/*" : "video/*"}
          id="mediaUpload"
          className="hidden"
          onChange={(e) => handleMediaUpload(e, setFieldValue)}
          disabled={isPastedImage} // Disable input if pasted image exists
        />

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mb-3"
        >
          <label
            htmlFor="mediaUpload"
            className="flex flex-col items-center justify-center w-full h-48 px-4 py-2 text-gray-600 transition duration-200 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer dark:border-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {mediaPreview[0] ? (
              postType === "video" ? (
                <motion.video
                  src={mediaPreview[0]}
                  controls
                  className="object-contain max-w-full rounded-md max-h-40"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                />
              ) : (
                <motion.img
                  src={mediaPreview[0]}
                  alt="Preview"
                  className="object-contain max-w-full rounded-md max-h-40"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                />
              )
            ) : (
              <motion.div
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Upload size={40} className="mb-2 text-blue-500" />
                <p className="font-medium text-center">
                  Click to upload {postType}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {postType === "photo"
                    ? "JPG, PNG, GIF up to 10MB"
                    : "MP4, MOV up to 50MB"}
                </p>
              </motion.div>
            )}
          </label>
        </motion.div>

        {mediaPreview[0] && (
          <div className="flex items-center justify-center mt-2">
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1 px-3 py-1 text-xs text-red-500 border border-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={() => {
                const newMedia = [{ file: null, type: postType, caption: "" }];
                setFieldValue("media", newMedia);
                if (mediaPreview[0]) {
                  URL.revokeObjectURL(mediaPreview[0]);
                }
                setMediaPreview([]);
              }}
            >
              <X size={14} /> Remove {postType}
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoVideoForm;
