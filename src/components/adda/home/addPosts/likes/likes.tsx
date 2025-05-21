import { useAuthModal } from "@/context/adda/authModalContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { motion } from "framer-motion";

import { RewardEventType } from "@/types/rewards";
import { triggerReward } from "@/utils/rewardMiddleware";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "sonner";

const Likes = ({
  type,
  id,
  likeCount,
}: {
  type: "post" | "meme";
  id: string;
  likeCount: number;
}) => {
  const { isSignedIn } = useUser();
  const { openAuthModal } = useAuthModal();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCounter, setLikeCounter] = useState(likeCount || 0);

  const { getToken } = useAuth();

  const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isSignedIn) {
      openAuthModal("sign-in");
      return;
    }
    e.stopPropagation();
    const newLikedState = !isLiked;

    setIsLiked(newLikedState);
    setLikeCounter((prev) => Math.max(0, newLikedState ? prev + 1 : prev - 1));

    try {
      const token = await getToken();
      const endpoint = newLikedState
        ? `${import.meta.env.VITE_PROD_URL}/likes/add-like`
        : `${import.meta.env.VITE_PROD_URL}/likes/remove-like`;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(endpoint, { type, id }, { headers });

      // Update with server response
      if (response.data.likeCount !== undefined) {
        setLikeCounter(response.data.likeCount);
      }

      // Trigger reward points only when adding a like (not when removing)
      if (newLikedState) {
        // Trigger reward for liking a post
        triggerReward(RewardEventType.LIKE_POST, id);
      }

      toast.success(
        newLikedState ? "Liked successfully" : "Reaction removed successfully"
      );
    } catch (error) {
      console.error("Error updating reaction:", error);
      toast.error("Failed to update reaction. Please try again.");
      // Revert UI state on error
      setIsLiked(!newLikedState);
      setLikeCounter((prev) =>
        Math.max(0, newLikedState ? prev - 1 : prev + 1)
      );
    }
  };

  useEffect(() => {
    const checkLike = async () => {
      try {
        const token = await getToken();
        const endpoint = `${
          import.meta.env.VITE_PROD_URL
        }/likes/check-like?type=${type}&id=${id}`;
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(endpoint, {
          headers,
        });
        setIsLiked(response.data.liked);
        if (response.data.likeCount !== undefined) {
          setLikeCounter(response.data.likeCount);
        }
      } catch (error) {
        console.error("Error checking like:", error);
      }
    };

    checkLike();
  }, [type, id, getToken]);

  return (
    <div className="flex items-center justify-center gap-3">
      <motion.button
        className="flex items-center justify-center w-8 p-2 bg-white border border-orange-400 rounded-full sm:w-12 sm:h-12"
        onClick={(e) => handleLike(e)}
        whileTap={{ scale: 0.9 }}
        whileHover={{
          scale: 1.1,
          boxShadow: "0px 4px 10px rgba(255,110,0,0.30)",
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {isLiked ? (
          <FaHeart className="w-4 text-red-500 sm:w-6 sm:h-6" />
        ) : (
          <FaRegHeart className="w-4 text-orange-500 sm:w-6 sm:h-6" />
        )}
      </motion.button>

      <div className="flex items-center gap-1">
        <span className="text-[#605F5F] figtree text-sm">{likeCounter}</span>
      </div>
    </div>
  );
};

export default Likes;
