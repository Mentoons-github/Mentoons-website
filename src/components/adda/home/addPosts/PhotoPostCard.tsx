import Highlight from "@/components/common/modal/highlight";
import { motion } from "framer-motion";
import { useState } from "react";
import { BiComment } from "react-icons/bi";
import { FaRegBookmark } from "react-icons/fa6";
import Likes from "./likes/likes";
import Share from "./share/share";

interface PhotoPostCardProps {
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
    postType: "photo";
    media: Array<{
      url: string;
      type: "image";
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

const PhotoPostCard = ({ post, initialComments = [] }: PhotoPostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");

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

      {/* Photos grid */}
      {post.media && post.media.length > 0 && (
        <div
          className={`w-full grid gap-2 ${
            post.media.length === 1
              ? "grid-cols-1"
              : post.media.length === 2
              ? "grid-cols-2"
              : post.media.length === 3
              ? "grid-cols-2"
              : "grid-cols-2"
          }`}
        >
          {post.media
            .map((media, index) => (
              <div
                key={index}
                className={`relative ${
                  post.media.length === 3 && index === 0 ? "col-span-2" : ""
                } ${post.media.length > 4 && index === 3 ? "relative" : ""}`}
              >
                <img
                  src={media.url}
                  alt={media.caption || `Photo ${index + 1}`}
                  className="object-cover w-full h-full rounded-lg cursor-pointer"
                  onClick={() => setSelectedPhoto(media.url)}
                />
                {post.media.length > 4 && index === 3 && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg cursor-pointer"
                    onClick={() => setSelectedPhoto(post.media[4].url)}
                  >
                    <span className="text-2xl font-bold text-white">
                      +{post.media.length - 4}
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
          <Likes postId={post._id} likeCount={post.likes.length} isUserLiked={post.likes.includes(post.user._id)} />
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

export default PhotoPostCard;
