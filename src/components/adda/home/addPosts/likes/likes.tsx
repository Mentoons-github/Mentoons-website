import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "sonner";

const Likes = ({
  postId,
  likeCount,
}: {
  postId: string;
  likeCount: number;
}) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCounter, setLikeCounter] = useState(likeCount);

  const { getToken } = useAuth();

  const handleLike = async () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCounter((prev) => (newLikedState ? prev + 1 : prev - 1));

    try {
      const token = await getToken();
      const endpoint = newLikedState
        ? "http://localhost:4000/api/v1/likes/posts/like"
        : "http://localhost:4000/api/v1/likes/posts/unlike";

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      await axios.post(endpoint, { postId }, { headers });

      // Show success message
      toast.success(
        newLikedState ? "Liked successfully" : "Reaction removed successfully"
      );
    } catch (error) {
      console.error("Error updating reaction:", error);
      toast.error("Failed to update reaction. Please try again.");
      setIsLiked(!newLikedState);
      setLikeCounter((prev) => (newLikedState ? prev - 1 : prev + 1));
    }
  };

  useEffect(() => {
    const checkLike = async () => {
      const token = await getToken();
      const endpoint = `http://localhost:4000/api/v1/likes/posts/like/check?postId=${postId}`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(endpoint, {
        headers,
      });
      if (response.data.liked) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    };

    checkLike();
  }, [isLiked]);
  return (
    <div className="flex items-center justify-center gap-3">
      <motion.button
        className="flex items-center justify-center w-8 p-2 bg-white border border-orange-400 rounded-full sm:w-12 sm:h-12"
        onClick={handleLike}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isLiked ? (
          <FaHeart className="w-4 text-red-500 sm:w-6 sm:h-6" />
        ) : (
          <FaRegHeart className="w-4 text-orange-500 sm:w-6 sm:h-6" />
        )}
      </motion.button>

      {likeCounter > 0 && (
        <div className="flex items-center gap-1">
          <span className="text-[#605F5F] figtree text-sm">{likeCounter}</span>
        </div>
      )}
    </div>
  );
};

export default Likes;
