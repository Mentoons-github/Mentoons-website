import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface PostContent {
  type: "image" | "video" | "text" | "mixed" | "article";
  src?: string;
  content?: string;
  title?: string;
  html?: string;
}

const Highlight = ({
  selectedPost,
  setPost,
}: {
  selectedPost: string | PostContent;
  setPost: (val: string) => void;
}) => {
  const [postData, setPostData] = useState<PostContent>({ type: "image" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Determine the type of post
    if (typeof selectedPost === "string") {
      // Check if it's a video or image based on extension
      if (selectedPost.match(/\.(mp4|webm|ogg)$/i)) {
        setPostData({ type: "video", src: selectedPost });
      } else if (selectedPost.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        setPostData({ type: "image", src: selectedPost });
      } else {
        // Default to text if not recognized
        setPostData({ type: "text", content: selectedPost });
      }
    } else {
      // Handle object type posts
      if (selectedPost.type === "article" || selectedPost.type === "text") {
        console.log("Article/text content:", selectedPost);
      }
      setPostData(selectedPost);
    }
    setLoading(false);
  }, [selectedPost]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center w-full h-48">
          <div className="loader"></div>
        </div>
      );
    }

    switch (postData.type) {
      case "image":
        return (
          <img
            src={postData.src}
            alt={postData.title || "Post Image"}
            className="w-full h-auto object-contain max-h-[70vh] rounded-md"
            onLoad={() => setLoading(false)}
          />
        );
      case "video":
        return (
          <video
            src={postData.src}
            controls
            autoPlay
            className="w-full h-auto max-h-[70vh] rounded-md"
            onLoadedData={() => setLoading(false)}
          >
            Your browser does not support the video tag.
          </video>
        );
      case "article":
      case "text":
        return (
          <div className="p-6 text-lg overflow-y-auto max-h-[70vh] w-full">
            {postData.title && (
              <h3 className="mb-4 text-xl font-bold">{postData.title}</h3>
            )}
            {postData.html ? (
              <div
                dangerouslySetInnerHTML={{ __html: postData.html }}
                className="article-content"
              />
            ) : (
              <p className="whitespace-pre-wrap">
                {postData.content || "No content available"}
              </p>
            )}
          </div>
        );
      case "mixed":
        return (
          <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
            {postData.title && (
              <h3 className="px-6 pt-4 text-xl font-bold">{postData.title}</h3>
            )}
            {postData.src && (
              <div className="px-6">
                <img
                  src={postData.src}
                  alt={postData.title || "Post Image"}
                  className="object-contain w-full h-auto rounded-md"
                  onLoad={() => setLoading(false)}
                />
              </div>
            )}
            {postData.html ? (
              <div
                className="px-6 pb-6"
                dangerouslySetInnerHTML={{ __html: postData.html }}
              />
            ) : (
              postData.content && (
                <p className="px-6 pb-6 whitespace-pre-wrap">
                  {postData.content}
                </p>
              )
            )}
          </div>
        );
      default:
        return (
          <div className="p-6">
            <p>Unknown post type: {postData.type}</p>
            <pre className="p-2 mt-4 overflow-auto bg-gray-100 rounded dark:bg-gray-700">
              {JSON.stringify(postData, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.7)] backdrop-blur-sm z-[99999999] p-4"
      onClick={() => setPost("")}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: [0.19, 1.0, 0.22, 1.0] }}
        className="relative w-[95%] md:w-4/5 lg:w-3/5 max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute z-10 top-2 right-2">
          <button
            onClick={() => setPost("")}
            className="p-2 transition-colors duration-200 bg-gray-100 rounded-full dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-600 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {renderContent()}
      </motion.div>
    </motion.div>
  );
};

export default Highlight;
