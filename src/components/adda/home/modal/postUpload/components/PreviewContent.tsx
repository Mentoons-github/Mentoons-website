import { motion } from "framer-motion";
import { PreviewContentProps } from "../types";

const PreviewContent = ({
  postType,
  values,
  mediaPreview,
}: PreviewContentProps) => {
  if (postType === "article") {
    return (
      <motion.div
        key="articlePreview"
        className="flex flex-col items-center w-full gap-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full p-6 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800">
          <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
            Article Preview
          </h3>

          {mediaPreview && mediaPreview.length > 0 && (
            <div className="flex justify-center mb-4">
              <img
                src={mediaPreview[0]}
                alt="Article Cover"
                className="object-cover w-full rounded-lg shadow-md max-h-56"
              />
            </div>
          )}

          <div className="p-5 border border-gray-200 rounded-lg dark:border-gray-700">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {values.title || "Untitled Article"}
            </h2>

            <div className="p-4 mb-4 prose bg-white rounded-md shadow-sm dark:bg-gray-700 dark:prose-invert">
              <p className="text-gray-700 whitespace-pre-wrap dark:text-gray-300">
                {values.articleBody || "No content"}
              </p>
            </div>
          </div>

          <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="px-2 py-1 mr-2 text-xs text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-200">
              {values.visibility || "Public"}
            </span>
            <span>Ready to publish</span>
            <span className="ml-auto text-xs text-blue-500">Step 3 of 3</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="tab3"
      className="flex flex-col items-center w-full gap-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full p-6 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
          Preview Your {postType}
        </h3>

        {mediaPreview && mediaPreview.length > 0 && (
          <div className="flex justify-center mb-4">
            <img
              src={mediaPreview[0]}
              alt="Preview"
              className="rounded-lg shadow-md max-h-48"
            />
          </div>
        )}

        {values.content && (
          <div className="p-4 mb-4 bg-white rounded-md shadow-sm dark:bg-gray-700">
            <p className="text-gray-700 whitespace-pre-wrap dark:text-gray-300">
              {values.content}
            </p>
          </div>
        )}

        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="px-2 py-1 mr-2 text-xs text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-200">
            {postType}
          </span>
          Ready to post
        </div>
      </div>
    </motion.div>
  );
};

export default PreviewContent;
