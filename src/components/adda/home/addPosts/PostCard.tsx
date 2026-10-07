import ReportAbuseModal from "@/components/common/modal/BlockAndReportModal";
import { useAuthModal } from "@/context/adda/authModalContext";
import { RewardEventType } from "@/types/rewards";
import { triggerReward } from "@/utils/rewardMiddleware";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BiComment } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { MdBlock, MdPersonAdd, MdReport } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Reactions from "./likes/reactions";
import ReactionsDisplay from "./likes/ReactionsDisplay";
import Share from "./share/share";
import PostContent from "./renderPostContent";
import axiosInstance from "@/api/axios";

export type PostType =
  "text" | "photo" | "video" | "article" | "event" | "mixed";

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
  onDelete?: (postId: string) => void;
  onUserBlocked?: (userId: string) => void;
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

const PostCard = ({ post, onDelete, onUserBlocked }: PostCardProps) => {
  const { isSignedIn } = useUser();
  const { openAuthModal } = useAuthModal();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [commentCount, setCommentCount] = useState(post.comments.length);
  const [newComment, setNewComment] = useState("");
  const [isSavedPost, setIsSavedPost] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"report" | "block">("report");
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [reactionUpdateKey, setReactionUpdateKey] = useState(0);
  const [userId, setUserId] = useState<string>("");

  const user = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("No token found");
      }
      const res = await axiosInstance.get("user/user", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setUserId(res.data.data._id);
    } catch (err) {
      console.error("Error fetching user:", err);
      console.error(
        err instanceof Error ? err.message : "Failed to load user data",
      );
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

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

  const handleDeletePost = async () => {
    if (onDelete) {
      onDelete(post._id);
    }
    setShowDropdown(false);
  };

  const handleReportAbuse = () => {
    if (!isSignedIn) {
      openAuthModal("sign-in");
      return;
    }
    setModalType("report");
    setIsModalOpen(true);
    setShowDropdown(false);
  };

  const handleBlockUser = () => {
    if (!isSignedIn) {
      openAuthModal("sign-in");
      return;
    }
    setModalType("block");
    setIsModalOpen(true);
    setShowDropdown(false);
  };

  const handleUnblockUser = () => {
    console.log("first");
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
        newCommentObj,
        ...(Array.isArray(prevComments) ? prevComments : []),
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
        },
      );

      if (response.data && response.data.data) {
        const serverComment = await axios.get(
          `${import.meta.env.VITE_PROD_URL}/comments/post/${post._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setComments(serverComment.data.data);
        setCommentCount(serverComment.data.data?.length);

        triggerReward(RewardEventType.COMMENT_POST, post._id);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment. Please try again.");

      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== tempId),
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
        },
      );
      console.log(response.data);

      if (newSavedState) {
        triggerReward(RewardEventType.SAVED_POST, post._id);
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
    } else if (userId === post.user._id) {
      navigate("/adda/user-profile");
    } else {
      navigate(`/adda/user/${post.user._id}`);
    }
  };

  const handlePostClick = () => {
    if (!isSignedIn) {
      openAuthModal("sign-in");
      return;
    } else {
      navigate(`/adda/post/${post._id}`);
    }
  };

  useEffect(() => {
    const checkSavedPost = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(
          `${import.meta.env.VITE_PROD_URL}/feeds/posts/${post._id}/check-saved`,
          { headers: { Authorization: `Bearer ${token}` } },
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
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setComments(response.data.data);
      setCommentCount(response.data.data.length);
    };
    getComments();
    checkSavedPost();
  }, [post._id, user?.user?.id, getToken]);

  const handleReactionUpdate = (counts: Record<string, number>) => {
    setReactionUpdateKey((prev) => prev + 1);
    console.log("Reaction update counts:", counts);
  };

  return (
    <>
      <style>{`
        @keyframes pc-pop {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          70%  { transform: scale(1.15) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes pc-slam {
          0%   { transform: scale(1.6) rotate(-3deg); opacity: 0; }
          60%  { transform: scale(0.97) rotate(0.5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .pc-pop  { animation: pc-pop 0.4s cubic-bezier(.2,.9,.3,1.4) both; }
        .pc-slam { animation: pc-slam 0.35s cubic-bezier(.2,.8,.3,1) both; }

        .pc-font {
          font-family: var(--font-comic) !important;
          font-weight: 400 !important;
          letter-spacing: 0.05em;
        }
        .pc-chip-font {
          font-family: var(--font-comic-chip, var(--font-comic)) !important;
          font-weight: 400 !important;
          letter-spacing: 0.04em;
        }

        .pc-card {
          background: #fff;
          border: 3px solid #000;
          box-shadow: 6px 6px 0 #000;
          border-radius: 14px;
        }

        .pc-avatar {
          background: #fff;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 999px;
          transition: transform 0.15s cubic-bezier(.34,1.56,.64,1);
        }
        .pc-user:hover .pc-avatar { transform: rotate(-6deg) scale(1.08); }

        .pc-date {
          background: #fde047;
          color: #000;
          border: 2px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 6px;
          padding: 0 8px;
          font-size: 11px;
          line-height: 1.5;
          transform: rotate(-1.5deg) skewX(-6deg);
          display: inline-block;
        }

        .pc-round {
          background: #fff;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 999px;
          transition: transform 0.15s cubic-bezier(.34,1.56,.64,1), box-shadow 0.1s ease, background 0.1s ease;
        }
        .pc-round:hover { background: #fde047; transform: translate(-2px, -2px) rotate(-4deg); box-shadow: 5px 5px 0 #000; }
        .pc-round:active { transform: translate(2px, 2px); box-shadow: 0 0 0 #000; }
        .pc-round-on { background: #fde047; }

        .pc-count {
          background: #fff;
          color: #000;
          border: 2px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 6px;
          min-width: 26px;
          padding: 0 6px;
          text-align: center;
          transform: rotate(2deg) skewX(-6deg);
          display: inline-block;
        }

        .pc-menu {
          background: #fff;
          border: 3px solid #000;
          box-shadow: 5px 5px 0 #000;
          border-radius: 10px;
        }
        .pc-menu-item { transition: background 0.1s ease; }
        .pc-menu-item:hover { background: #fde047; }
        .pc-menu-item + .pc-menu-item { border-top: 3px dashed #000; }

        .pc-divider { border: 0; border-top: 3px dashed #000; opacity: 0.85; }

        .pc-comments {
          background-color: #fffbeb;
          background-image: radial-gradient(rgba(249,115,22,0.18) 1.5px, transparent 2px);
          background-size: 14px 14px;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          border-radius: 12px;
        }
        .pc-title {
          background: #fde047;
          color: #000;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 8px;
          padding: 0 12px;
          transform: rotate(-2deg) skewX(-6deg);
          display: inline-block;
        }
        .pc-bubble {
          background: #fff;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 12px;
        }
        .pc-bubble-img {
          border: 3px solid #000;
          border-radius: 999px;
          box-shadow: 2px 2px 0 #000;
        }

        .pc-input {
          background: #fff;
          color: #000;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 10px;
          outline: none;
          transition: box-shadow 0.1s ease, transform 0.1s ease, background 0.1s ease;
        }
        .pc-input::placeholder { color: #6b7280; }
        .pc-input:focus {
          background: #fffef2;
          box-shadow: 5px 5px 0 #f97316, 5px 5px 0 1px #000;
          transform: translate(-2px, -2px);
        }

        .pc-cta {
          background: #f97316;
          color: #fff;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 10px;
          text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
          transform: rotate(-2deg);
          transition: box-shadow 0.1s ease, background 0.1s ease, transform 0.1s ease;
        }
        .pc-cta:hover { background: #fb923c; transform: rotate(-2deg) scale(1.06); }
        .pc-cta:active { box-shadow: 0 0 0 #000; transform: rotate(-2deg) translate(3px, 3px); }

        @media (prefers-reduced-motion: reduce) {
          .pc-pop, .pc-slam { animation: none; }
        }
      `}</style>

      <div className="pc-card flex flex-col items-center justify-start w-full gap-5 p-5 min-h-fit">
        <div className="flex items-center justify-between w-full">
          <div
            onClick={(e) => handleClick(e)}
            className="pc-user flex items-center justify-start gap-3 cursor-pointer"
          >
            <div className="pc-pop">
              <div className="pc-avatar overflow-hidden w-14 h-14">
                <img
                  src={post?.user?.picture}
                  alt={`${post?.user?.name}-profile`}
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
            </div>
            <div className="flex flex-col items-start gap-1">
              <span className="pc-font text-lg leading-none">
                {post.user.name}
              </span>
              <span className="pc-chip-font pc-date">
                {formatDate(post.createdAt)}
              </span>
            </div>
          </div>

          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Post options"
              className="pc-round flex items-center justify-center w-10 h-10 text-black cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown((prev) => !prev);
              }}
            >
              <BsThreeDots className="w-5 h-5" />
            </motion.button>

            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="pc-menu absolute right-0 z-50 w-52 mt-2 overflow-hidden"
              >
                {userId === post.user._id ? (
                  <button
                    className="pc-menu-item pc-font flex items-center w-full px-4 py-3 text-left text-red-600 cursor-pointer"
                    onClick={handleDeletePost}
                  >
                    <RiDeleteBin6Line className="w-5 h-5 mr-2" />
                    Delete Post
                  </button>
                ) : (
                  <>
                    <button
                      className="pc-menu-item pc-font flex items-center w-full px-4 py-3 text-left text-orange-600 cursor-pointer"
                      onClick={handleReportAbuse}
                    >
                      <MdReport className="w-5 h-5 mr-2" />
                      Report Abuse
                    </button>
                    <button
                      className="pc-menu-item pc-font flex items-center w-full px-4 py-3 text-left text-red-600 cursor-pointer"
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

        <PostContent post={post} handlePostClick={handlePostClick} />

        <hr className="pc-divider w-full" />

        <div className="flex items-center justify-between w-full">
          <div className="flex items-center justify-start gap-3 sm:gap-4">
            <Reactions
              type="post"
              id={post._id}
              likeCount={post.likes.length}
              showLikeCount={false}
              toggleReaction={true}
              toggleBorder={true}
              onReactionUpdate={handleReactionUpdate}
            />
            <ReactionsDisplay
              key={`reactions-${post._id}-${reactionUpdateKey}`}
              type="post"
              id={post._id}
              initialLikeCount={post.likes.length}
            />
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                aria-label="Toggle comments"
                className={`pc-round flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 shrink-0 cursor-pointer ${
                  showComments ? "pc-round-on" : ""
                }`}
                onClick={() => setShowComments(!showComments)}
              >
                <BiComment className="w-5 h-5 text-orange-500 sm:w-6 sm:h-6 shrink-0" />
              </motion.button>
              <span className="pc-count pc-chip-font text-sm sm:text-base">
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
              aria-label={isSavedPost ? "Unsave post" : "Save post"}
              className={`pc-round flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 cursor-pointer ${
                isSavedPost ? "pc-round-on" : ""
              }`}
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
            className="pc-comments w-full p-4"
          >
            <h3 className="pc-title pc-font text-xl mb-2">Comments</h3>
            <div className="flex flex-col gap-3 w-full max-h-[300px] overflow-y-auto p-2">
              {comments?.length > 0 ? (
                comments.map((comment: Comment) => (
                  <div
                    key={comment._id}
                    className="pc-bubble pc-slam flex items-start w-full gap-3 p-3"
                  >
                    <img
                      src={comment.user.picture}
                      alt="profile-picture"
                      className="pc-bubble-img object-cover w-10 h-10 shrink-0"
                    />
                    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                      <span className="pc-font text-black truncate">
                        {comment.user.name}
                      </span>
                      <p className="w-full text-gray-700 break-words text-sm">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="pc-font text-center text-gray-600">
                  No comments yet. Be the first!
                </p>
              )}
            </div>
            <div className="flex items-center w-full gap-3 pt-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pc-input pc-font flex-1 min-w-0 px-3 py-2 text-base"
                placeholder="Write a comment..."
              />
              <button
                onClick={handleCommentSubmit}
                className="pc-cta pc-font px-4 py-1.5 text-lg uppercase shrink-0 cursor-pointer"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </div>
      <ReportAbuseModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        modalType={modalType}
        userId={post.user._id}
        contentId={post._id}
        reportType="post"
        onSuccess={() => {
          setIsUserBlocked(true);
          if (onUserBlocked) {
            onUserBlocked(post.user._id);
          }
        }}
      />
    </>
  );
};

export default PostCard;
