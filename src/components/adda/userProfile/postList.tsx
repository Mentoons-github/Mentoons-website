import { useAuthModal } from "@/context/adda/authModalContext";
import { Post } from "@/pages/v2/adda/userProfile";
import { MediaType, User } from "@/types";
import { RewardEventType } from "@/types/rewards";
import { triggerReward } from "@/utils/rewardMiddleware";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { BiComment } from "react-icons/bi";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { toast } from "sonner";
import Reactions from "../home/addPosts/likes/reactions";
import Share from "../home/addPosts/share/share";

interface PostsListProps {
  posts: Post[];
  user: User;
}

// Define Comment interface
interface Comment {
  _id: string | number;
  content: string;
  user: {
    _id: string;
    name: string;
    picture: string;
    email: string;
  };
  post: string;
  media: unknown[];
  likes: string[];
  replies: unknown[];
  parentComment: null | unknown;
  mentions: string[];
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

const PostsList = ({ posts, user }: PostsListProps) => {
  const { isSignedIn } = useAuth();
  const { openAuthModal } = useAuthModal();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>(
    {}
  );
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const { getToken } = useAuth();

  const { user: userData } = useUser();
  const [showComments, setShowComments] = useState(false);
  const togglePostExpansion = (postId: string) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMedia = (media: {
    url: string;
    type: string;
    caption?: string;
  }) => {
    switch (media.type) {
      case MediaType.IMAGE:
        return (
          <div className="mt-3 overflow-hidden rounded-lg">
            <img
              src={media.url}
              alt={media.caption || "Post image"}
              className="object-cover w-full h-auto"
            />
            {media.caption && (
              <p className="mt-1 text-sm text-gray-500">{media.caption}</p>
            )}
          </div>
        );
      case MediaType.VIDEO:
        return (
          <div className="mt-3 overflow-hidden rounded-lg">
            <video
              src={media.url}
              controls
              className="w-full"
              poster="/api/placeholder/640/360"
            />
            {media.caption && (
              <p className="mt-1 text-sm text-gray-500">{media.caption}</p>
            )}
          </div>
        );
      case MediaType.AUDIO:
        return (
          <div className="mt-3">
            <audio src={media.url} controls className="w-full" />
            {media.caption && (
              <p className="mt-1 text-sm text-gray-500">{media.caption}</p>
            )}
          </div>
        );
      case MediaType.DOCUMENT:
        return (
          <div className="p-3 mt-3 border border-gray-200 rounded-lg bg-gray-50">
            <a
              href={media.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:underline"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
              {media.caption || "View Document"}
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  const renderPostContent = (post: Post) => {
    switch (post.postType) {
      case "text":
        return (
          <>
            {post.content &&
            post.content?.length > 280 &&
            !expandedPosts[post._id] ? (
              <>
                <p className="text-gray-800">
                  {post.content.substring(0, 280)}...
                </p>
                <button
                  onClick={() => togglePostExpansion(post._id)}
                  className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Read More
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-800">{post.content}</p>
                {post.content && post.content?.length > 280 && (
                  <button
                    onClick={() => togglePostExpansion(post._id)}
                    className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Show Less
                  </button>
                )}
              </>
            )}
          </>
        );

      case "article":
        return (
          <div className="mt-3 space-y-2">
            {post.article?.coverImage && (
              <img
                src={post.article.coverImage}
                alt="Article cover"
                className="w-full h-auto rounded-lg"
              />
            )}
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="text-gray-700">{post.article?.body}</p>
          </div>
        );

      case "event":
        return (
          <div className="mt-3 space-y-2">
            {post.event?.coverImage && (
              <img
                src={post.event.coverImage}
                alt="Event cover"
                className="w-full h-auto rounded-lg"
              />
            )}
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="text-sm text-gray-500">
              {formatDate(post.event?.startDate || "")}
              {post.event?.endDate && ` - ${formatDate(post.event.endDate)}`}
            </p>
            <p className="text-gray-700">{post.event?.description}</p>
            <p className="text-sm italic text-gray-600">
              Venue: {post.event?.venue}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  if (posts.length === 0) {
    return (
      <div className="p-6 text-center bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
        <p className="mt-2 text-gray-500">
          {user._id === user.clerkId
            ? "You haven't created any posts yet."
            : `${user.name} hasn't created any posts yet.`}
        </p>
      </div>
    );
  }

  const handleCommentSubmit = async (postId: string) => {
    if (!isSignedIn) {
      openAuthModal("sign-in");
      return;
    }
    if (newComment.trim() === "") return;

    const tempId = Date.now();
    const newCommentObj: Comment = {
      _id: tempId,
      content: newComment,
      user: {
        _id: userData?.id || "",
        name: userData?.fullName || "",
        picture: userData?.imageUrl || "",
        email: userData?.emailAddresses[0]?.emailAddress || "",
      },
      post: postId,
      media: [],
      likes: [],
      replies: [],
      parentComment: null,
      mentions: [],
      isEdited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // Optimistically update UI
      setComments((prevComments) => [
        ...(Array.isArray(prevComments) ? prevComments : []),
        newCommentObj,
      ]);
      setCommentCount((prev) => prev + 1);
      setNewComment("");

      // Make API call
      const token = await getToken();
      const response = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/comments`,
        {
          postId: postId,
          content: newCommentObj.content,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update with server response
      if (response.data && response.data.data) {
        const serverComment = await axios.get(
          `${import.meta.env.VITE_PROD_URL}/comments/post/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setComments(serverComment.data.data);
        setCommentCount(serverComment.data.data.length);

        triggerReward(RewardEventType.COMMENT_POST, postId);
        // toast.success("Comment added successfully");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment. Please try again.");

      // Revert optimistic update
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== tempId)
      );
      setCommentCount((prev) => prev - 1);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    postId: string
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default Enter behavior (e.g., new line)
      handleCommentSubmit(postId);
    }
  };
  const handleSavePost = async (postId: string) => {
    if (!isSignedIn) {
      openAuthModal("sign-in");
      return;
    }
    const currentlySaved = savedPosts[postId] || false;
    const newSavedState = !currentlySaved;

    // Update state optimistically
    setSavedPosts((prev) => ({
      ...prev,
      [postId]: newSavedState,
    }));

    try {
      const token = await getToken();
      const endpoint = newSavedState
        ? `${import.meta.env.VITE_PROD_URL}/feeds/posts/${postId}/save`
        : `${import.meta.env.VITE_PROD_URL}/feeds/posts/${postId}/unsave`;

      const response = await axios.post(
        endpoint,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);

      if (newSavedState) {
        triggerReward(RewardEventType.SAVED_POST, postId);
      }

      // toast.success(
      //   newSavedState ? "Post saved successfully" : "Post unsaved successfully"
      // );
    } catch (error) {
      console.error("Error saving/unsaving post:", error);
      // Revert state on error
      setSavedPosts((prev) => ({
        ...prev,
        [postId]: !newSavedState,
      }));
      toast.error("Failed to update saved status. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post._id}
          className="overflow-hidden bg-white border border-orange-200 rounded-lg"
        >
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center">
              <img
                src={user.picture || "/api/placeholder/40/40"}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="mt-3">{renderPostContent(post)}</div>

            {/* Media */}
            {post.media && post.media.length > 0 && (
              <div className="mt-3 space-y-2">
                {post.media.map((item, idx) => (
                  <div key={idx}>{renderMedia(item)}</div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col items-start justify-between gap-4 pt-3 mt-4 border-t border-orange-200">
              <div className="flex items-center justify-between w-full">
                <div className="flex space-x-4">
                  <Reactions
                    type="post"
                    id={post._id}
                    likeCount={post.likes.length}
                  />
                  <div className="flex items-center gap-2 sm:gap-3">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      whileHover={{
                        scale: 1.1,
                        boxShadow: "0px 4px 10px rgba(255,110,0,0.30)",
                      }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="flex items-center justify-center w-8 p-2 border border-orange-400 rounded-full sm:w-12 sm:h-12"
                      onClick={() => {
                        setShowComments(!showComments);
                        setActivePostId(post._id);
                      }}
                    >
                      <BiComment className="w-4 text-orange-500 sm:w-6 sm:h-6" />
                    </motion.button>
                    <span className="text-[#605F5F] text-sm sm:text-base figtree">
                      {commentCount}
                    </span>
                  </div>

                  <Share
                    type="post"
                    postDetails={{
                      _id: post._id,
                      title: post.title,
                      content: post.content,
                      visibility: post.visibility,
                      shares: post.shares,
                      user: {
                        _id: post.user._id || "",
                        name: post.user.name || "",
                        email: post.user.email || "",
                        picture: post.user.picture || "",
                      },
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    className="flex items-center justify-center p-2 rounded-full sm:w-10 sm:h-10"
                    onClick={() => handleSavePost(post._id)}
                  >
                    {savedPosts[post._id] ? (
                      <FaBookmark className="w-5 text-orange-500 sm:w-6 sm:h-6" />
                    ) : (
                      <FaRegBookmark className="w-5 text-orange-500 sm:w-6 sm:h-6" />
                    )}
                  </button>
                </div>
              </div>
              {showComments && activePostId === post._id && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="w-full p-4 bg-gray-100 rounded-lg"
                >
                  <h3 className="text-lg font-semibold text-gray-700">
                    Comments
                  </h3>
                  <div className="flex flex-col gap-3 w-full max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-2">
                    {comments?.length > 0 ? (
                      comments.map((comment: Comment) => (
                        <div
                          key={comment._id}
                          className="flex items-start w-full gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-md"
                        >
                          <img
                            src={comment.user.picture}
                            alt="profile-picture"
                            className="object-cover w-10 h-10 border border-gray-300 rounded-full"
                          />
                          <div className="flex flex-col flex-1 w-full p-3 overflow-hidden bg-gray-100 rounded-md">
                            <span className="font-semibold text-gray-800">
                              {comment.user.name}
                            </span>
                            <p className="w-full max-w-full text-gray-600 break-words">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">
                        No comments yet.
                      </p>
                    )}
                  </div>
                  <div className="flex items-center w-full gap-2 pt-3">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, post._id)}
                      className="flex-1 p-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Write a comment..."
                    />
                    <button
                      onClick={() => handleCommentSubmit(post._id)}
                      className="px-4 py-2 text-white transition bg-orange-500 rounded-lg hover:bg-orange-600"
                    >
                      Send
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostsList;
