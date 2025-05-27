import Highlight from "@/components/common/modal/highlight";
import { motion } from "framer-motion";
import { useState } from "react";
import { BiComment } from "react-icons/bi";
import { FaPlay } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import Reactions from "./likes/reactions";
import Share from "./share/share";

interface MixedPostCardProps {
  post: {
    _id: string;
    user: {
      _id: string;
      name: string;
      role: string;
      profilePicture: string;
    };
    content?: string;
    title?: string;
    postType: "mixed";
    media: Array<{
      url: string;
      type: "image" | "video";
      caption?: string;
    }>;
    likes: string[];
    comments: Comment[];
    shares: string[];
    createdAt: string | Date;
    visibility: "public" | "friends" | "private";
    tags?: string[];
    location?: string;
  };
  initialComments?: Comment[];
}

interface Comment {
  id: number;
  text: string;
  author: {
    name: string;
    profilePicture: string;
  };
}

const MixedPostCard = ({ post, initialComments = [] }: MixedPostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);

  const handleCommentSubmit = () => {
    if (newComment.trim() === "") return;
    setComments([
      ...comments,
      {
        id: comments.length + 1,
        text: newComment,
        author: {
          name: "Current User", // Replace with actual current user
          profilePicture:
            "/assets/adda/profilePictures/pexels-stefanstefancik-91227.jpg", // Replace with actual user profile
        },
      },
    ]);
    setNewComment("");
  };

  const charLimit = 100;

  // Format date for display
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Group media by type for better organization
  const groupedMedia = {
    images: post.media.filter((m) => m.type === "image"),
    videos: post.media.filter((m) => m.type === "video"),
  };



  return (
    <div className="flex flex-col items-center justify-start w-full gap-5 p-5 border border-gray-200 rounded-xl min-h-fit">
      <div className="flex items-center justify-start w-full gap-3">
        <div className="overflow-hidden rounded-full w-14 h-14">
          <img
            src={post.user.profilePicture}
            alt={`${post.user.name}-profile`}
            className="object-cover w-full h-full rounded-full"
          />
        </div>
        <div className="flex flex-col figtree">
          <span className="Futura Std">{post.user.name}</span>
          <span className="figtree text-sm text-[#807E7E]">
            {post.user.role}
          </span>
          <span className="figtree text-[12px] text-[#807E7E]">
            {formatDate(post.createdAt)}
          </span>
          {post.location && (
            <span className="figtree text-[12px] text-[#807E7E]">
              📍 {post.location}
            </span>
          )}
        </div>
      </div>

      {/* Title if present */}
      {post.title && (
        <h3 className="w-full text-lg font-semibold figtree">{post.title}</h3>
      )}

      {/* Post content */}
      {post.content && (
        <p className="figtree text-[#3E3E59] text-base w-full break-words mb-3">
          {isExpanded
            ? post.content
            : post.content.slice(0, charLimit) +
              (post.content.length > charLimit ? "..." : "")}
          {post.content.length > charLimit && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 text-blue-500"
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          )}
        </p>
      )}

      {/* Photos grid - only show if we have images */}
      {groupedMedia.images.length > 0 && (
        <div className="w-full mb-4">
          <h4 className="mb-2 text-sm font-medium text-gray-500">Photos</h4>
          <div
            className={`w-full grid gap-2 ${
              groupedMedia.images.length === 1
                ? "grid-cols-1"
                : groupedMedia.images.length === 2
                ? "grid-cols-2"
                : groupedMedia.images.length === 3
                ? "grid-cols-2"
                : "grid-cols-2"
            }`}
          >
            {groupedMedia.images
              .map((media, index) => (
                <div
                  key={`img-${index}`}
                  className={`relative ${
                    groupedMedia.images.length === 3 && index === 0
                      ? "col-span-2"
                      : ""
                  } ${
                    groupedMedia.images.length > 4 && index === 3
                      ? "relative"
                      : ""
                  }`}
                >
                  <img
                    src={media.url}
                    alt={media.caption || `Photo ${index + 1}`}
                    className="object-cover w-full h-full rounded-lg cursor-pointer"
                    onClick={() => setSelectedPhoto(media.url)}
                  />
                  {groupedMedia.images.length > 4 && index === 3 && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg cursor-pointer"
                      onClick={() =>
                        setSelectedPhoto(groupedMedia.images[4].url)
                      }
                    >
                      <span className="text-2xl font-bold text-white">
                        +{groupedMedia.images.length - 4}
                      </span>
                    </div>
                  )}
                  {media.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 text-white bg-black bg-opacity-50">
                      <p className="text-sm">{media.caption}</p>
                    </div>
                  )}
                </div>
              ))
              .slice(0, 4)}
          </div>
        </div>
      )}

      {/* Videos - only show if we have videos */}
      {groupedMedia.videos.length > 0 && (
        <div className="w-full mb-4">
          <h4 className="mb-2 text-sm font-medium text-gray-500">Videos</h4>
          <div
            className={`w-full ${
              groupedMedia.videos.length > 1 ? "space-y-4" : ""
            }`}
          >
            {groupedMedia.videos
              .map((media, index) => (
                <div
                  key={`vid-${index}`}
                  className="relative w-full overflow-hidden rounded-lg"
                >
                  {activeVideoIndex === index ? (
                    <video
                      src={media.url}
                      controls
                      autoPlay
                      className="w-full h-auto rounded-lg"
                      onEnded={() => setActiveVideoIndex(null)}
                    />
                  ) : (
                    <div className="relative">
                      {/* Video thumbnail - in a real app you'd generate this */}
                      <div className="relative bg-gray-200 rounded-lg aspect-video">
                        <button
                          className="absolute inset-0 flex items-center justify-center w-full h-full bg-black rounded-lg bg-opacity-30"
                          onClick={() => setActiveVideoIndex(index)}
                        >
                          <FaPlay className="w-12 h-12 text-white" />
                        </button>
                      </div>
                      {media.caption && (
                        <div className="absolute bottom-0 left-0 right-0 p-2 text-white bg-black bg-opacity-50">
                          <p className="text-sm">{media.caption}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
              .slice(0, 2)}{" "}
            {/* Limit to 2 videos for better UX */}
            {groupedMedia.videos.length > 2 && (
              <button
                className="w-full py-2 mt-2 text-sm text-blue-500 hover:underline"
                onClick={() => (window.location.href = `/posts/${post._id}`)}
              >
                View {groupedMedia.videos.length - 2} more videos
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap w-full gap-2 mt-2">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs text-blue-600 bg-blue-100 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between w-full px-3">
        <div className="flex items-center justify-start gap-3 sm:gap-4">
          {/* <Likes type="post" id={post._id} likeCount={post.likes.length} />
           */}
          <Reactions type="post" id={post._id} likeCount={post.likes.length} />
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{
                scale: 1.1,
                boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
              }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex items-center justify-center w-8 p-2 border border-gray-400 rounded-full sm:w-12 sm:h-12"
              onClick={() => setShowComments(!showComments)}
            >
              <BiComment className="w-4 text-yellow-500 sm:w-6 sm:h-6" />
            </motion.button>
            <span className="text-[#605F5F] text-sm sm:text-base figtree">
              {comments.length}
            </span>
          </div>
          <Share
            type="post"
            postDetails={{
              ...post,
              shares: post.shares,
              saves: 0,
              user: {
                ...post.user,
                email: "",
                picture: "",
              },
            }}
          />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="flex items-center justify-center p-2 rounded-full sm:w-8 sm:w-10 sm:h-10">
            <FaRegBookmark className="w-5 sm:w-6 sm:h-6 text-[#D56A11]" />
          </button>
          <span className="text-[#605F5F] text-sm sm:text-base figtree">
            {post.shares.length}
          </span>
        </div>
      </div>

      {showComments && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full p-4 bg-gray-100 rounded-lg"
        >
          <h3 className="text-lg font-semibold text-gray-700">Comments</h3>
          <div className="flex flex-col gap-3 w-full max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-2">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start w-full gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-md"
                >
                  <img
                    src={comment.author.profilePicture}
                    alt="profile-picture"
                    className="object-cover w-10 h-10 border border-gray-300 rounded-full"
                  />
                  <div className="flex flex-col flex-1 w-full p-3 overflow-hidden bg-gray-100 rounded-md">
                    <span className="font-semibold text-gray-800">
                      {comment.author.name}
                    </span>
                    <p className="w-full max-w-full text-gray-600 break-words">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No comments yet.</p>
            )}
          </div>
          <div className="flex items-center w-full gap-2 pt-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 p-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Write a comment..."
            />
            <button
              onClick={handleCommentSubmit}
              className="px-4 py-2 text-white transition bg-yellow-500 rounded-lg hover:bg-yellow-600"
            >
              Send
            </button>
          </div>
        </motion.div>
      )}

      {/* Photo lightbox */}
      {selectedPhoto && (
        <Highlight selectedPost={selectedPhoto} setPost={setSelectedPhoto} />
      )}
    </div>
  );
};

export default MixedPostCard;
