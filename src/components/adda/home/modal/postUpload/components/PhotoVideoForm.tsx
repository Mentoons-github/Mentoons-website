import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";
import { useRef } from "react";
import { MediaUploadProps } from "../types";

interface PhotoVideoFormProps extends MediaUploadProps {
  postType: "photo" | "video";
  setMediaPreview: React.Dispatch<React.SetStateAction<string[]>>;
}

const PhotoVideoForm = ({
  postType,
  mediaPreview,
  handleMediaUpload,
  setFieldValue,
  setMediaPreview,
}: PhotoVideoFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={postType === "video" ? "video/*" : "image/*"}
        id="mediaUpload"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleMediaUpload(e, setFieldValue);
          }
        }}
      />

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <label
          htmlFor="mediaUpload"
          className="flex flex-col items-center justify-center w-full h-64 px-4 py-2 text-gray-600 transition duration-200 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer dark:border-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {mediaPreview && mediaPreview.length > 0 ? (
            postType === "video" ? (
              <motion.video
                src={mediaPreview[0]}
                controls
                className="object-contain max-w-full rounded-md max-h-56"
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
                className="object-contain max-w-full rounded-md max-h-56"
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

      {mediaPreview && mediaPreview.length > 0 && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center self-center gap-1 text-red-500 hover:text-red-600"
          onClick={() => {
            if (mediaPreview[0]) {
              URL.revokeObjectURL(mediaPreview[0]);
            }
            setFieldValue("media", [
              {
                file: null,
                type: postType === "video" ? "video" : "image",
                url: undefined,
              },
            ]);
            setMediaPreview([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
        >
          <X size={16} /> Remove {postType}
        </motion.button>
      )}
    </div>
  );
};

export default PhotoVideoForm;
