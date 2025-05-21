import Highlight from "@/components/common/modal/highlight";
import { RewardEventType } from "@/types/rewards";
import { triggerReward } from "@/utils/rewardMiddleware";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BiComment } from "react-icons/bi";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Likes from "./likes/likes";
import Share from "./share/share";

export interface MemeData {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    picture: string;
  };
  title?: string;
  image: string;
  description?: string;
  likes: string[];
  likeCount: number;
  comments: Comment[];
  commentCount: number;
  shares: string[];
  shareCount: number;
  saves: string[];
  saveCount: number;
  tags?: string[];
  visibility: "public" | "friends" | "private";
  createdAt: string;
  updatedAt: string;
}

interface MemeCardProps {
  meme: MemeData;
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

const MemeCard = ({ meme }: MemeCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [selectedMeme, setSelectedMeme] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>(meme.comments);
  const [newComment, setNewComment] = useState("");
  const [isSavedMeme, setIsSavedMeme] = useState(false);
  const [likeCount, setLikeCount] = useState(meme.likes.length);

  const user = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const handleCommentSubmit = async (meme: MemeData) => {
    if (newComment.trim() === "") return;

    const tempId = Date.now(); // Create a temporary ID for optimistic update
    const newCommentObj = {
      _id: tempId,
      content: newComment,
      user: {
        _id: user?.user?.id || "",
        name: user?.user?.fullName || "",
        picture: user?.user?.imageUrl || "",
        email: user?.user?.emailAddresses[0]?.emailAddress || "",
      },
      meme: meme?._id,
      media: [],
      likes: [],
      replies: [],
      parentComment: null,
      mentions: [],
      isEdited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Optimistically update the UI
    setComments((prevComments) => [...(prevComments || []), newCommentObj]);
    setNewComment("");

    try {
      const token = await getToken();
      const response = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/comments`,
        {
          memeId: meme._id,
          content: newComment,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const serverComment = response.data.data;

      // Replace the temporary comment with the server-returned one
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === tempId ? serverComment : comment
        )
      );

      // Trigger reward for commenting on a meme
      triggerReward(RewardEventType.COMMENT_POST, meme._id);

      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      // Remove the temporary comment on error
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== tempId)
      );
      toast.error("Failed to add comment. Please try again.");
    }
  };

  const handleSaveMeme = async () => {
    const newSavedState = !isSavedMeme;
    setIsSavedMeme(newSavedState);
    try {
      const token = await getToken();
      const endpoint = `${import.meta.env.VITE_PROD_URL}/memeFeed/save/${
        meme._id
      }`;

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

      // Trigger reward for saving a meme (only when saving, not unsaving)
      if (newSavedState) {
        triggerReward(RewardEventType.SHARE_PRODUCT, meme._id);
      }

      toast.success(
        newSavedState ? "Meme saved successfully" : "Meme unsaved successfully"
      );
    } catch (error) {
      console.error("Error saving/unsaving meme:", error);
      // Revert both saved state and count on error
      setIsSavedMeme(!newSavedState);
      toast.error("Failed to update saved status. Please try again.");
    }
  };

  useEffect(() => {
    const checkSavedMeme = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(
          `${import.meta.env.VITE_PROD_URL}/memeFeed/saved/${meme._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data.saved);
        setIsSavedMeme(response.data.saved);
      } catch (error) {
        console.error("Error checking saved meme:", error);
      }
    };
    checkSavedMeme();
  }, []);

  useEffect(() => {
    const getAllLikes = async () => {
      const token = await getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/likes/get-likes?type=meme&id=${
          meme._id
        }`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data.data);
      setLikeCount(response.data.data.length);
    };
    getAllLikes();
  }, []);

  const charLimit = 100;

  const renderMemeContent = () => {
    return (
      <div
        className="w-full"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/adda/meme/${meme._id}`);
        }}
      >
        {meme.title && (
          <h3 className="mb-2 text-lg font-semibold text-[#3E3E59]">
            {meme.title}
          </h3>
        )}
        <p className="figtree text-[#3E3E59] text-base w-full break-words mb-3">
          {isExpanded
            ? meme.description
            : meme.description?.slice(0, charLimit) +
              (meme.description && meme.description.length > charLimit
                ? "..."
                : "")}
          {meme.description && meme.description.length > charLimit && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 text-blue-500"
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          )}
        </p>
        {meme.image && (
          <img
            src={meme.image}
            alt={meme.title || "Meme"}
            className="object-cover w-full h-auto rounded-lg cursor-pointer"
            onClick={() => setSelectedMeme(meme.image || null)}
          />
        )}
        {meme.tags && meme.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {meme.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 text-xs text-orange-600 bg-orange-100 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col items-center justify-start w-full gap-5 p-5 border border-orange-200 rounded-xl min-h-fit">
        <div className="flex items-center justify-start w-full gap-3">
          <div className="overflow-hidden rounded-full w-14 h-14">
            <img
              src={meme?.user?.picture}
              alt={`${meme?.user?.name}-profile`}
              className="object-cover w-full h-full rounded-full"
            />
          </div>
          <div className="flex flex-col figtree">
            <span className="Futura Std">{meme.user.name}</span>
            <span className="figtree text-sm text-[#807E7E]">
              {meme.user.email}
            </span>
            <span className="figtree text-[12px] text-[#807E7E]">
              {new Date(meme.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {renderMemeContent()}

        <div className="flex items-center justify-between w-full">
          <div className="flex items-center justify-start gap-3 sm:gap-4">
            <Likes type="meme" id={meme._id} likeCount={likeCount} />
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0px 4px 10px rgba(255,110,0,0.30)",
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex items-center justify-center w-8 p-2 border border-orange-400 rounded-full sm:w-12 sm:h-12"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowComments(!showComments);
                }}
              >
                <BiComment className="w-4 text-orange-500 sm:w-6 sm:h-6" />
              </motion.button>
              <span className="text-[#605F5F] text-sm sm:text-base figtree">
                {comments.length}
              </span>
            </div>
            <Share
              postDetails={{
                ...meme,
              }}
              type="meme"
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="flex items-center justify-center p-2 rounded-full sm:w-10 sm:h-10"
              onClick={handleSaveMeme}
            >
              {isSavedMeme ? (
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
              {comments && comments.length > 0 ? (
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
                className="flex-1 p-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Write a comment..."
              />
              <button
                onClick={() => handleCommentSubmit(meme)}
                className="px-4 py-2 text-white transition bg-orange-500 rounded-lg hover:bg-orange-600"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </div>
      {selectedMeme && (
        <Highlight selectedPost={selectedMeme} setPost={setSelectedMeme} />
      )}
    </>
  );
};

export default MemeCard;
