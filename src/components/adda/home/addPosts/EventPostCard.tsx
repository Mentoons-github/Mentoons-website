import { motion } from "framer-motion";
import { useState } from "react";
import { BiCalendarEvent, BiComment, BiMap, BiTimeFive } from "react-icons/bi";
import { FaRegBookmark } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Likes from "./likes/likes";
import Share from "./share/share";

interface EventPostCardProps {
  post: {
    _id: string;
    user: {
      _id: string;
      name: string;
      role: string;
      profilePicture: string;
    };
    content?: string;
    title: string;
    postType: "event";
    event: {
      startDate: string | Date;
      endDate?: string | Date;
      venue: string;
      description: string;
      coverImage?: string;
    };
    likes: any[];
    comments: any[];
    shares: any[];
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

const EventPostCard = ({ post, initialComments = [] }: EventPostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [attending, setAttending] = useState(false);

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

  // Format event date and time
  const formatEventDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatEventTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
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

      {/* Event card */}
      <div className="w-full overflow-hidden border border-gray-200 rounded-lg shadow-md">
        {post.event.coverImage ? (
          <div className="relative h-48">
            <img
              src={post.event.coverImage}
              alt={post.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent">
              <div className="absolute bottom-0 w-full p-4">
                <h2 className="text-xl font-bold text-white">{post.title}</h2>
                <div className="flex items-center mt-1 text-white">
                  <BiCalendarEvent className="mr-1" />
                  <span className="text-sm">
                    {formatEventDate(post.event.startDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600">
            <h2 className="text-xl font-bold text-white">{post.title}</h2>
            <div className="flex items-center mt-1 text-white">
              <BiCalendarEvent className="mr-1" />
              <span className="text-sm">
                {formatEventDate(post.event.startDate)}
              </span>
            </div>
          </div>
        )}

        <div className="p-4">
          <div className="grid grid-cols-1 gap-3 mb-4 sm:grid-cols-2">
            <div className="flex items-center">
              <BiTimeFive className="mr-2 text-gray-600" />
              <div>
                <p className="text-sm font-medium">Time</p>
                <p className="text-sm text-gray-600">
                  {formatEventTime(post.event.startDate)}
                  {post.event.endDate &&
                    ` - ${formatEventTime(post.event.endDate)}`}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <BiMap className="mr-2 text-gray-600" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-gray-600">{post.event.venue}</p>
              </div>
            </div>
          </div>

          <p className="mb-4 text-gray-700">
            {isExpanded
              ? post.event.description
              : post.event.description.slice(0, charLimit) +
                (post.event.description.length > charLimit ? "..." : "")}
            {post.event.description.length > charLimit && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-2 text-blue-500"
              >
                {isExpanded ? "Read Less" : "Read More"}
              </button>
            )}
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setAttending(!attending)}
              className={`px-4 py-2 font-medium rounded-full transition-colors ${
                attending
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              {attending ? "Attending" : "Attend"}
            </button>
            <Link
              to={`/posts/${post._id}`}
              className="px-4 py-2 font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-full hover:bg-gray-100"
            >
              Event Details
            </Link>
          </div>
        </div>
      </div>

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
          <Likes postId={post._id} likeCount={post.likes.length} />
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
              title: post.title,
              description: post.event.description,
              postUrl: `/posts/${post._id}`,
              imageUrl: post.event.coverImage || "",
              author: post.user.name,
              role: post.user.role,
              timestamp: formatDate(post.createdAt),
              likes: post.likes.length,
              comments: comments.length,
              shareCount: post.shares.length,
              saves: 0,
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
    </div>
  );
};

export default EventPostCard;
