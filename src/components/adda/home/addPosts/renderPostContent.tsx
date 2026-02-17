import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostData } from "./PostCard";
import Highlight from "@/components/common/modal/highlight";
import { useUser } from "@clerk/clerk-react";
import { useAuthModal } from "@/context/adda/authModalContext";

interface PostContentProps {
  post: PostData;
}

const PostContent = ({ post }: PostContentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const { isSignedIn } = useUser();
  const { openAuthModal } = useAuthModal();
  const navigate = useNavigate();
  const charLimit = 100;

  const handleClick = (
    type: "event" | "photo" | "text" | "video" | "article",
    url?: string, // For photo/video media URL
  ) => {
    if (!isSignedIn) {
      openAuthModal("sign-in");
      return;
    }

    switch (type) {
      case "photo":
      case "video":
        if (url) {
          setSelectedPost(url);
        }
        break;
      case "article":
      case "event":
        navigate(`/adda/post/${post._id}`);
        break;
      case "text":
        // No special action for text clicks (already handled by Read More)
        break;
      default:
        break;
    }
  };

  const renderPostContent = () => {
    switch (post.postType) {
      case "text":
        return (
          <p className="figtree text-[#3E3E59] text-base w-full break-words whitespace-pre-line">
            {isExpanded
              ? post.content
              : post.content?.slice(0, charLimit) +
                (post.content && post.content.length > charLimit ? "..." : "")}
            {post.content && post.content.length > charLimit && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-2 text-blue-500 hover:underline"
              >
                {isExpanded ? "Read Less" : "Read More"}
              </button>
            )}
          </p>
        );

      case "photo":
        return (
          <div className="w-full">
            {post.content && (
              <p className="figtree text-[#3E3E59] text-base w-full break-words mb-3">
                {isExpanded
                  ? post.content
                  : post.content.slice(0, charLimit) +
                    (post.content.length > charLimit ? "..." : "")}
                {post.content.length > charLimit && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="ml-2 text-blue-500 hover:underline"
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </button>
                )}
              </p>
            )}
            {post.media && post.media.length > 0 && (
              <img
                src={post.media[0].url}
                alt={post.title || "Photo"}
                className="object-cover w-full h-auto rounded-lg cursor-pointer"
                onClick={() => handleClick("photo", post.media?.[0].url)}
              />
            )}
          </div>
        );

      case "video":
        return (
          <div className="w-full">
            {post.content && (
              <p className="figtree text-[#3E3E59] text-base w-full break-words mb-3">
                {isExpanded
                  ? post.content
                  : post.content.slice(0, charLimit) +
                    (post.content.length > charLimit ? "..." : "")}
                {post.content.length > charLimit && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="ml-2 text-blue-500 hover:underline"
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </button>
                )}
              </p>
            )}
            {post.media &&
              post.media.length > 0 &&
              post.media[0].type === "video" && (
                <div className="relative w-full overflow-hidden">
                  <video
                    controls
                    src={post.media[0].url}
                    className="object-contain w-full rounded-lg h-96 cursor-pointer"
                    onClick={() => handleClick("video", post.media?.[0].url)}
                  />
                </div>
              )}
          </div>
        );

      case "article":
        return (
          <div className="w-full">
            {post.content && (
              <p className="figtree text-[#3E3E59] text-base w-full break-words mb-3">
                {isExpanded
                  ? post.content
                  : post.content.slice(0, charLimit) +
                    (post.content.length > charLimit ? "..." : "")}
                {post.content.length > charLimit && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="ml-2 text-blue-500 hover:underline"
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </button>
                )}
              </p>
            )}
            {post.article && (
              <div
                className="block w-full p-3 transition border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleClick("article")}
              >
                <img
                  src={post.article.coverImage}
                  alt={post.title || "Article"}
                  className="object-cover w-full h-32 mb-2 rounded-lg"
                />
                <h3 className="font-medium text-orange-500">
                  {post.title || "Read Article"}
                </h3>
                {post.article.body && (
                  <p className="mt-1 text-sm text-gray-500">
                    {post.article.body.substring(0, 100)}...
                  </p>
                )}
              </div>
            )}
          </div>
        );

      case "event":
        return (
          <div className="w-full">
            {post.content && (
              <p className="figtree text-[#3E3E59] text-base w-full break-words mb-3">
                {isExpanded
                  ? post.content
                  : post.content.slice(0, charLimit) +
                    (post.content.length > charLimit ? "..." : "")}
                {post.content.length > charLimit && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="ml-2 text-blue-500 hover:underline"
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </button>
                )}
              </p>
            )}
            {post.event && (
              <div
                className="block w-full p-3 transition border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleClick("event")}
              >
                <img
                  src={post.event.coverImage}
                  alt={post.title || "Event"}
                  className="object-cover w-full h-32 mb-2 rounded-lg"
                />
                <h3 className="font-medium text-orange-600">
                  {post.title || "Event"}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {new Date(post.event.startDate).toLocaleDateString()} -{" "}
                  {post.event.endDate
                    ? new Date(post.event.endDate).toLocaleDateString()
                    : "Ongoing"}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Venue: {post.event.venue}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {post.event.description.substring(0, 100)}...
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {renderPostContent()}
      {selectedPost && (
        <Highlight selectedPost={selectedPost} setPost={setSelectedPost} />
      )}
    </>
  );
};

export default PostContent;
