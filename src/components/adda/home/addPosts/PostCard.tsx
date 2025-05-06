import Highlight from "@/components/common/modal/highlight";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { BiComment } from "react-icons/bi";
import { FaRegBookmark } from "react-icons/fa6";
import Likes from "./likes/likes";
import Share from "./share/share";

// Define the different post types
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
  user: {
    _id: string;
    name: string;
    role: string;
    profilePicture: string;
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
  likes: { _id: string }[];
  comments: { _id: string }[]; // Using any[] as the Comment schema isn't provided
  shares: { _id: string }[];
  tags?: string[];
  location?: string;
  visibility: "public" | "friends" | "private";
  createdAt: string;
  updatedAt?: string;
}

interface PostCardProps {
  post: PostData;
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

const PostCard = ({ post, initialComments = [] }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const user = useUser();
  console.log(user);

  const handleCommentSubmit = () => {
    if (newComment.trim() === "") return;
    setComments([
      ...comments,
      {
        id: comments.length + 1,
        text: newComment,
        author: {
          name: user?.user?.fullName || "", // Replace with actual current user
          profilePicture:
            user?.user?.imageUrl ||
            "/assets/adda/profilePictures/pexels-stefanstefancik-91227.jpg", // Replace with actual user profile
        },
      },
    ]);
    setNewComment("");
  };

  const charLimit = 100;

  // Create a postDetails object for the Share component
  const postDetails = {
    title: post.title || "",
    description: post.content || "",
    postUrl: `post/${post._id}`,
    imageUrl: post.media && post.media.length > 0 ? post.media[0].url : "",
    author: post.user.name,
    role: post.user.role,
    timestamp: new Date(post.createdAt).toLocaleString(),
    likes: post.likes.length,
    comments: comments.length,
    saves: post.shares.length,
  };

  const renderPostContent = () => {
    switch (post.postType) {
      case "text":
        return (
          <p className="figtree text-[#3E3E59] text-base w-full break-words">
            {isExpanded
              ? post.content
              : post.content?.slice(0, charLimit) +
                (post.content && post.content.length > charLimit ? "..." : "")}
            {post.content && post.content.length > charLimit && (
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
          <div className="w-full">
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
            {post.media && post.media.length > 0 && (
              <img
                src={post.media[0].url}
                alt={post.title || "Photo"}
                className="object-cover w-full h-auto rounded-lg"
                onClick={() => setSelectedPost(post.media?.[0].url || null)}
              />
            )}
          </div>
        );
      case "video":
        return (
          <div className="w-full">
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
            {post.media &&
              post.media.length > 0 &&
              post.media[0].type === "video" && (
                <div className="relative w-full overflow-hidden">
                  <video
                    controls={true}
                    src={post.media[0].url}
                    className="object-contain w-full rounded-lg h-96"
                    onClick={() => setSelectedPost(post.media?.[0].url || null)}
                  />
                </div>
              )}
          </div>
        );
      case "article":
        return (
          <div className="w-full">
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
            {post.article && (
              <a
                href={`/article/${post._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full p-3 transition border border-gray-200 rounded-lg hover:bg-gray-50"
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
              </a>
            )}
          </div>
        );
      case "event":
        return (
          <div className="w-full">
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
      <div className="flex flex-col items-center justify-start w-full gap-5 p-5 border border-orange-200 rounded-xl min-h-fit">
        <div className="flex items-center justify-start w-full gap-3">
          <div className="overflow-hidden rounded-full w-14 h-14">
            <img
              src={user?.user?.imageUrl}
              alt={`${user?.user?.fullName}-profile`}
              className="object-cover w-full h-full rounded-full"
            />
          </div>
          <div className="flex flex-col figtree">
            <span className="Futura Std">{user?.user?.fullName}</span>
            <span className="figtree text-sm text-[#807E7E]">
              {post.user.role}
            </span>
            <span className="figtree text-[12px] text-[#807E7E]">
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {renderPostContent()}

        <div className="flex items-center justify-between w-full px-3">
          <div className="flex items-center justify-start gap-3 sm:gap-4">
            <Likes postId={post._id} likeCount={post.likes.length} />
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0px 4px 10px rgba(255,110,0,0.30)",
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex items-center justify-center w-8 p-2 border border-orange-400 rounded-full sm:w-12 sm:h-12"
                onClick={() => setShowComments(!showComments)}
              >
                <BiComment className="w-4 text-orange-500 sm:w-6 sm:h-6" />
              </motion.button>
              <span className="text-[#605F5F] text-sm sm:text-base figtree">
                {comments.length}
              </span>
            </div>
            <Share 
              postDetails={{
                ...postDetails,
                shareCount: post.shares.length,
              }}
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="flex items-center justify-center p-2 rounded-full sm:w-10 sm:h-10">
              <FaRegBookmark className="w-5 text-orange-500 sm:w-6 sm:h-6" />
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
                className="flex-1 p-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Write a comment..."
              />
              <button
                onClick={handleCommentSubmit}
                className="px-4 py-2 text-white transition bg-orange-500 rounded-lg hover:bg-orange-600"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </div>
      {selectedPost && (
        <Highlight selectedPost={selectedPost} setPost={setSelectedPost} />
      )}
    </>
  );
};

export default PostCard;
