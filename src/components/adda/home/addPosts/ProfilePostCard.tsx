import { Post } from "@/pages/v2/adda/userProfile";

// import PostContent from "./renderPostContent";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Highlight from "@/components/common/modal/highlight";

export type PostType =
  | "text"
  | "photo"
  | "video"
  | "article"
  | "event"
  | "mixed";

export interface PostData {
  _id: string;
  postType: PostType;
  postUrl?: string;
  user: {
    _id: string;
    name: string;
    email: string | "";
    picture: string;
  };
  content?: string;
  title?: string;
  media?: {
    url: string;
    type: "image" | "video";
    caption?: string;
  }[];
  article?: {
    body: string;
    coverImage: string;
  };
  event?: {
    startDate: string;
    endDate: string;
    venue: string;
    description: string;
    coverImage: string;
  };
  likes: string[];
  comments: Comment[];
  shares: string[];
  saves: number;
  tags?: string[];
  location?: string;
  visibility: "public" | "friends" | "private";
  createdAt: string;
  updatedAt?: string;
}

interface PostCardProps {
  post: PostData;
  isUser?: boolean;
  setUserPosts?: React.Dispatch<React.SetStateAction<Post[]>>;
  onDelete?: (postId: string) => void;
}

interface Comment {
  _id: number;
  user: {
    _id: string;
    email: string;
    name: string;
    picture: string;
  };
  content: string;
}

const ProfilePostCard = ({ post }: PostCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const navigate = useNavigate();
  const charLimit = 100;

  function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 640);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isMobile;
  }

  const isMobile = useIsMobile();
  const textLimit = isMobile ? 150 : 270;
  const limit = isMobile ? 70 : 100;

  const renderPostContent = () => {
    switch (post.postType) {
      case "text":
        return (
          <p
            className="figtree text-[#3E3E59] text-sm md:text-base w-full break-words whitespace-pre-line"
            onClick={() => navigate(`/adda/post/${post._id}`)}
          >
            {isExpanded
              ? post.content
              : post.content?.slice(0, textLimit) +
                (post.content && post.content.length > textLimit ? "..." : "")}

            {post.content && post.content.length > textLimit && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-2 text-blue-500"
              >
                {isExpanded ? "Read Less" : "Read More"}
              </button>
            )}
          </p>
        );
      case "photo":
        return (
          <div
            className="w-full"
            onClick={() => navigate(`/adda/post/${post._id}`)}
          >
            <p className="figtree text-[#3E3E59] text-base w-full break-words ">
              {isExpanded
                ? post.content
                : post.content?.slice(0, charLimit) +
                  (post.content && post.content.length > charLimit
                    ? "..."
                    : "")}
              {post.content && post.content.length > charLimit && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="ml-2 text-blue-500"
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              )}
            </p>
            {post.media && post.media.length > 0 && (
              <img
                src={post.media[0].url}
                alt={post.title || "Photo"}
                className="w-full h-52 md:h-72 object-cover rounded-lg"
                onClick={() => setSelectedPost(post.media?.[0].url || null)}
              />
            )}
          </div>
        );
      case "video":
        return (
          <div
            className="w-full h-full "
            onClick={() => navigate(`/adda/post/${post._id}`)}
          >
            <p className="figtree text-[#3E3E59] text-base w-full break-words mb-">
              {isExpanded
                ? post.content
                : post.content?.slice(0, charLimit) +
                  (post.content && post.content.length > charLimit
                    ? "..."
                    : "")}
              {post.content && post.content.length > charLimit && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="ml-2 text-blue-500"
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              )}
            </p>
            {post.media &&
              post.media.length > 0 &&
              post.media[0].type === "video" && (
                <div className="relative w-full h-52 md:h-72 overflow-hidden rounded-lg">
                  <video
                    controls={true}
                    src={post.media[0].url}
                    className="w-full h-full object-cover"
                    onClick={() => setSelectedPost(post.media?.[0].url || null)}
                  />
                </div>
              )}
          </div>
        );
      case "article":
        return (
          <div
            className="w-full"
            onClick={() => navigate(`/adda/post/${post._id}`)}
          >
            {post.article && (
              <div className="block w-full transition hover:bg-gray-50">
                <img
                  src={post.article.coverImage}
                  alt={post.title || "Article"}
                  className="w-full h-32 md:h-40 object-cover rounded-lg"
                />
                <h3 className="font-medium text-orange-500">
                  {post.title || "Read Article"}
                </h3>
                {post.article.body && (
                  <p className="mt-1 text-sm text-gray-500">
                    {post.article.body.substring(0, limit)}...
                  </p>
                )}
              </div>
            )}
          </div>
        );
      case "event":
        return (
          <div
            className="w-full"
            onClick={() => navigate(`/adda/post/${post._id}`)}
          >
            <p className="figtree text-[#3E3E59] text-base w-full break-words mb-3">
              {isExpanded
                ? post.content
                : post.content?.slice(0, charLimit) +
                  (post.content && post.content.length > charLimit
                    ? "..."
                    : "")}
              {post.content && post.content.length > charLimit && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="ml-2 text-blue-500"
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              )}
            </p>
            {post.event && (
              <div className="block w-full p-3 transition border border-gray-200 rounded-lg hover:bg-gray-50">
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
                  {new Date(post.event.endDate).toLocaleDateString()}
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
      <div >
        <div className="flex items-center justify-between w-full">
          {renderPostContent()}
          {selectedPost && (
            <Highlight selectedPost={selectedPost} setPost={setSelectedPost} />
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePostCard;
