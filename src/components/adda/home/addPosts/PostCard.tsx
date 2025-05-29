import Highlight from "@/components/common/modal/highlight";
import { useAuthModal } from "@/context/adda/authModalContext";
import { useStatusModal } from "@/context/adda/statusModalContext";
import { Post } from "@/pages/v2/adda/userProfile";
import { RewardEventType } from "@/types/rewards";
import { triggerReward } from "@/utils/rewardMiddleware";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BiComment } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdReport, MdBlock, MdPersonAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Reactions from "./likes/reactions";
import Share from "./share/share";
import ReportAbuseModal from "@/components/common/modal/BlockAndReportModal";

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
    email: string;
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

const PostCard = ({
  post,
  isUser = false,
  onDelete,
  setUserPosts,
}: PostCardProps) => {
  const { isSignedIn } = useUser();
  const { openAuthModal } = useAuthModal();
  const [showComments, setShowComments] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [commentCount, setCommentCount] = useState(post.comments.length);
  const [newComment, setNewComment] = useState("");
  const [isSavedPost, setIsSavedPost] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"report" | "block">("report");
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { showStatus } = useStatusModal();
  const user = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check if the user is blocked
  useEffect(() => {
    const checkBlockedStatus = async () => {
      if (!isSignedIn) return;
      try {
        const token = await getToken();
        const response = await axios.get(
          `${import.meta.env.VITE_PROD_URL}/users/check-blocked/${
            post.user._id
          }`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsUserBlocked(response.data.isBlocked);
      } catch (error) {
        console.error("Error checking blocked status:", error);
      }
    };

    checkBlockedStatus();
  }, [post.user._id, isSignedIn, getToken]);

  const handleDeletePost = async () => {
    try {
      const token = await getToken();
      const response = await axios.delete(
        `${import.meta.env.VITE_PROD_URL}/posts/${post._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success === true) {
        setUserPosts?.((prev) =>
          prev.filter((userPost) => userPost._id !== post._id)
        );
        showStatus("success", "Post deleted successfully.");
        if (onDelete) {
          onDelete(post._id);
        }
      } else {
        showStatus("error", "Failed to delete post.");
      }
    } catch (error: any) {
      console.error("Error deleting post:", error);
      showStatus(
        "error",
        error?.response?.data?.message || "Something went wrong."
      );
    } finally {
      setShowDropdown(false);
    }
  };

  const handleReportAbuse = () => {
    if (!isSignedIn) {
      openAuthModal("sign-in");
      return;
    }
    console.log("Opening Report Abuse modal");
    setModalType("report");
    setIsModalOpen(true);
    setShowDropdown(false);
  };

  const handleBlockUser = () => {
    if (!isSignedIn) {
      openAuthModal("sign-in");
      return;
    }
    console.log("Opening Block User modal");
    setModalType("block");
    setIsModalOpen(true);
    setShowDropdown(false);
  };

  const handleUnblockUser = async () => {
    if (!isSignedIn) {
      openAuthModal("sign-in");
      return;
    }
    try {
      const token = await getToken();
      await axios.post(
        `${import.meta.env.VITE_PROD_URL}/users/unblock`,
        {
          userId: post.user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsUserBlocked(false);
      toast.success("User unblocked successfully.");
    } catch (error) {
      console.error("Error unblocking user:", error);
      toast.error("Failed to unblock user. Please try again.");
    } finally {
      setShowDropdown(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!isSignedIn) {
      openAuthModal("sign-in");
      return;
    }
    if (newComment.trim() === "") return;

    const tempId = Date.now();
    const newCommentObj = {
      _id: tempId,
      content: newComment,
      user: {
        _id: user?.user?.id || "",
        name: user?.user?.fullName || "",
        picture: user?.user?.imageUrl || "",
        email: user?.user?.emailAddresses[0]?.emailAddress || "",
      },
      post: post._id,
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
      setComments((prevComments) => [
        ...(Array.isArray(prevComments) ? prevComments : []),
        newCommentObj,
      ]);
      setCommentCount((prev) => prev + 1);
      setNewComment("");

      const token = await getToken();
      const response = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/comments`,
        {
          postId: post._id,
          content: newCommentObj.content,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        const serverComment = await axios.get(
          `${import.meta.env.VITE_PROD_URL}/comments/post/${post._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setComments(serverComment.data.data?.data || []);
        setCommentCount(serverComment.data.data?.length);

        triggerReward(RewardEventType.COMMENT_POST, post._id);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment. Please try again.");

      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== tempId)
      );
      setCommentCount((prev) => prev - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };

  const handleSavePost = async () => {
    if (!isSignedIn) {
      openAuthModal("sign-in");
      return;
    }
    const newSavedState = !isSavedPost;
    setIsSavedPost(newSavedState);

    try {
      const token = await getToken();
      const endpoint = newSavedState
        ? `${import.meta.env.VITE_PROD_URL}/feeds/posts/${post._id}/save`
        : `${import.meta.env.VITE_PROD_URL}/feeds/posts/${post._id}/unsave`;

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
        triggerReward(RewardEventType.SHARE_PRODUCT, post._id);
      }
    } catch (error) {
      console.error("Error saving/unsaving post:", error);
      setIsSavedPost(!newSavedState);
      toast.error("Failed to update saved status. Please try again.");
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isSignedIn) {
      openAuthModal("sign-in");
      return;
    } else if (isUser) {
      navigate("/adda/user-profile");
    } else {
      navigate(`/adda/user/${post.user._id}`);
    }
  };

  useEffect(() => {
    const checkSavedPost = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(
          `${import.meta.env.VITE_PROD_URL}/feeds/posts/${
            post._id
          }/check-saved`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsSavedPost(response.data.data);
      } catch (error) {
        console.error("Error checking saved post:", error);
      }
    };

    const getComments = async () => {
      const token = await getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/comments/post/${post._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(response.data.data);
      setCommentCount(response.data.data.length);
    };
    getComments();
    checkSavedPost();
  }, [post._id, user?.user?.id, getToken]);

  const charLimit = 100;

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
            {post.article && (
              <div className="block w-full p-3 transition border border-gray-200 rounded-lg hover:bg-gray-50">
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
      <div className="flex flex-col items-center justify-start w-full gap-5 p-5 border border-orange-200 rounded-xl min-h-fit">
        <div className="flex items-center justify-between w-full">
          <div
            onClick={(e) => handleClick(e)}
            className="flex items-center justify-start gap-3 cursor-pointer"
          >
            <div className="overflow-hidden rounded-full w-14 h-14">
              <img
                src={post?.user?.picture}
                alt={`${post?.user?.name}-profile`}
                className="object-cover w-full h-full rounded-full"
              />
            </div>
            <div className="flex flex-col figtree">
              <span className="Futura Std">{post.user.name}</span>
              <span className="figtree text-[12px] text-[#807E7E]">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-500 rounded-full hover:bg-orange-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Toggling dropdown, current state:", showDropdown);
                setShowDropdown((prev) => !prev);
              }}
            >
              <BsThreeDots className="w-5 h-5" />
            </motion.button>

            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 z-50 w-48 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
              >
                {isUser ? (
                  <button
                    className="flex items-center w-full px-4 py-3 text-left text-red-600 hover:bg-gray-50 transition-colors"
                    onClick={handleDeletePost}
                  >
                    <RiDeleteBin6Line className="w-5 h-5 mr-2" />
                    Delete Post
                  </button>
                ) : (
                  <>
                    <button
                      className="flex items-center w-full px-4 py-3 text-left text-orange-600 hover:bg-gray-50 transition-colors"
                      onClick={handleReportAbuse}
                    >
                      <MdReport className="w-5 h-5 mr-2" />
                      Report Abuse
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-3 text-left text-red-600 hover:bg-gray-50 transition-colors"
                      onClick={
                        isUserBlocked ? handleUnblockUser : handleBlockUser
                      }
                    >
                      {isUserBlocked ? (
                        <>
                          <MdPersonAdd className="w-5 h-5 mr-2" />
                          Unblock User
                        </>
                      ) : (
                        <>
                          <MdBlock className="w-5 h-5 mr-2" />
                          Block User
                        </>
                      )}
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {renderPostContent()}

        <div className="flex items-center justify-between w-full">
          <div className="flex items-center justify-start gap-3 sm:gap-4">
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
                onClick={() => setShowComments(!showComments)}
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
                ...post,
              }}
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="flex items-center justify-center p-2 rounded-full sm:w-10 sm:h-10"
              onClick={handleSavePost}
            >
              {isSavedPost ? (
                <FaBookmark className="w-5 text-orange-500 sm:w-6 sm:h-6" />
              ) : (
                <FaRegBookmark className="w-5 text-orange-500 sm:w-6 sm:h-6" />
              )}
            </button>
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
                <p className="text-center text-gray-500">No comments yet.</p>
              )}
            </div>
            <div className="flex items-center w-full gap-2 pt-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
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
      <ReportAbuseModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        modalType={modalType}
        userId={post.user._id}
        contentId={post._id}
      />
    </>
  );
};

export default PostCard;
