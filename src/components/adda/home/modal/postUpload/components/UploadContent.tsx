import { Field } from "formik";
import { motion } from "framer-motion";
import { Image, Upload, X } from "lucide-react";
import { UploadContentProps } from "../types";
import PhotoVideoForm from "./PhotoVideoForm";

const UploadContent = ({
  postType,
  values,
  mediaPreview,
  handleMediaUpload,
  addMediaField,
  removeMediaField,
  setFieldValue,
}: UploadContentProps) => {
  if (postType === "photo" || postType === "video") {
    return (
      <PhotoVideoForm
        postType={postType as "photo" | "video"}
        mediaPreview={mediaPreview}
        handleMediaUpload={handleMediaUpload}
        setFieldValue={setFieldValue}
      />
    );
  }

  if (postType === "article") {
    return (
      <div className="flex flex-col w-full h-full gap-5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Upload Cover Image
        </h3>

        <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
          <div className="mb-3 text-center">
            <h4 className="mb-2 font-medium text-gray-700 dark:text-gray-300">
              Cover Image for "{values.title || "Untitled Article"}"
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This image will appear at the top of your article
            </p>
          </div>

          <input
            type="file"
            accept="image/*"
            id="articleCoverImage"
            className="hidden"
            onChange={(e) => handleMediaUpload(e, setFieldValue, 0)}
          />

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mb-3"
          >
            <label
              htmlFor="articleCoverImage"
              className="flex flex-col items-center justify-center w-full h-48 px-4 py-2 text-gray-600 transition duration-200 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer dark:border-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {mediaPreview[0] ? (
                <motion.img
                  src={mediaPreview[0]}
                  alt="Article cover"
                  className="object-cover max-w-full rounded-md max-h-40"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                />
              ) : (
                <motion.div
                  className="flex flex-col items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Image size={40} className="mb-2 text-blue-500" />
                  <p className="font-medium text-center">
                    Click to upload cover image
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    JPG, PNG, GIF up to 10MB
                  </p>
                </motion.div>
              )}
            </label>
          </motion.div>

          {mediaPreview && mediaPreview.length > 0 && (
            <div className="flex items-center justify-center mt-2">
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 px-3 py-1 text-xs text-red-500 border border-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => {
                  const newMedia = [...values.media];
                  newMedia[0] = { ...newMedia[0], file: null, url: undefined };
                  setFieldValue("media", newMedia);
                  const newPreviews = [...mediaPreview];
                  newPreviews[0] = "";
                  setMediaPreview(newPreviews);
                }}
              >
                <X size={14} /> Remove image
              </motion.button>
            </div>
          )}

          <div className="flex justify-between mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {mediaPreview[0] ? "Cover image added" : "No cover image"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Step 2 of 3
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (postType === "event") {
    return (
      <motion.div
        key="preview"
        className="flex flex-col items-center w-full gap-6 p-6 border border-gray-200 rounded-lg shadow-sm dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-200">
          Preview
        </h2>

        {values.eventStartDate && (
          <div className="flex flex-col w-full gap-2 px-4 py-3 text-green-800 bg-green-100 rounded-md dark:bg-green-900 dark:text-green-200">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {new Date(values.eventStartDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {values.location && (
              <div className="flex items-center gap-2 mt-1">
                <span>{values.location}</span>
              </div>
            )}

            {values.description && (
              <div className="flex items-start gap-2 mt-1">
                <span className="text-sm">{values.description}</span>
              </div>
            )}
          </div>
        )}

        <div className="w-full p-4 overflow-y-auto text-gray-700 rounded-md dark:text-gray-300 max-h-36 bg-gray-50 dark:bg-gray-800">
          {values.content ? (
            <p className="whitespace-pre-wrap">{values.content}</p>
          ) : (
            <p className="italic text-center text-gray-400 dark:text-gray-500">
              No content added
            </p>
          )}
        </div>
      </motion.div>
    );
  }

  // Mixed content type
  return (
    <div className="flex flex-col w-full h-full gap-4">
      {values.media.map((media, index) => (
        <div
          key={index}
          className="p-4 border border-gray-200 rounded-lg dark:border-gray-700"
        >
          <div className="flex justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              {media.type === "image" ? "Image" : "Video"} {index + 1}
            </h3>
            {values.media.length > 1 && (
              <button
                type="button"
                className="text-red-500 hover:text-red-700"
                onClick={() => removeMediaField(index, setFieldValue)}
              >
                <X size={18} />
              </button>
            )}
          </div>

          <input
            type="file"
            accept={media.type === "video" ? "video/*" : "image/*"}
            id={`mediaUpload-${index}`}
            className="hidden"
            onChange={(e) => handleMediaUpload(e, setFieldValue, index)}
          />

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mb-3"
          >
            <label
              htmlFor={`mediaUpload-${index}`}
              className="flex flex-col items-center justify-center w-full h-48 px-4 py-2 text-gray-600 transition duration-200 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer dark:border-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {mediaPreview[index] ? (
                <motion.img
                  src={mediaPreview[index]}
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
              ) : (
                <motion.div
                  className="flex flex-col items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Upload size={40} className="mb-2 text-blue-500" />
                  <p className="font-medium text-center">
                    Click to upload {media.type}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {media.type === "image"
                      ? "JPG, PNG, GIF up to 10MB"
                      : "MP4, MOV up to 50MB"}
                  </p>
                </motion.div>
              )}
            </label>
          </motion.div>

          <div className="mb-2">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Caption (optional)
            </label>
            <Field
              type="text"
              name={`media[${index}].caption`}
              className="w-full p-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Add a caption"
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Media Type
            </label>
            <Field
              as="select"
              name={`media[${index}].type`}
              className="w-full p-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </Field>
          </div>
        </div>
      ))}

      {postType === "mixed" && (
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => addMediaField(setFieldValue)}
          className="flex items-center justify-center gap-2 p-2 mt-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700"
        >
          + Add Another Media
        </motion.button>
      )}
    </div>
  );
};

export default UploadContent;
