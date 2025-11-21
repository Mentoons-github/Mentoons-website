import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import axiosInstance from "@/api/axios";
import { useStatusModal } from "@/context/adda/statusModalContext";
import PostCard from "@/components/adda/home/addPosts/PostCard";
import { PostData } from "@/components/adda/home/addPosts/PostCard";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

interface User {
  id: string;
  name: string;
  picture: string;
}

const PostPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const { getToken } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { showStatus } = useStatusModal();
  const [post, setPost] = useState<PostData | null>(null);
  const [initiator, setInitiator] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPostOrMeme = async (id: string, type: "post" | "meme") => {
    try {
      const token = await getToken();
      if (!token) {
        console.warn("Clerk token missing!");
        return showStatus("error", "You must login again.");
      }
      const endpoint = type === "meme" ? `/memes/${id}` : `/posts/${id}`;
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.data.success) {
        throw new Error(response.data.message || `Failed to fetch ${type}`);
      }
      return response.data.data;
    } catch (err: any) {
      console.log(err);
      throw new Error(err.response?.data?.message || `Error fetching ${type}`);
    }
  };

  const fetchComment = async (commentId: string) => {
    try {
      const response = await axiosInstance.get(`/comments/post/${commentId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch comment");
      }
      return response.data.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Error fetching comment");
    }
  };

  const fetchUser = async (userId: string) => {
    try {
      const response = await axiosInstance.get(`/user/user/${userId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch user");
      }
      return response.data.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Error fetching user");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      // Validate postId
      if (!postId) {
        showStatus("error", "Content ID not found");
        navigate("/adda/notifications", { replace: true });
        return;
      }

      try {
        setLoading(true);
        const initiatorId = state?.initiatorId;
        const referenceModel = state?.referenceModel;

        // Fetch initiator details
        if (initiatorId) {
          const userData = await fetchUser(initiatorId);
          setInitiator(userData);
        }

        // Handle comment notifications
        let targetId = postId;
        let contentType: "post" | "meme" = "post";
        if (referenceModel === "Comment" && postId) {
          const comment = await fetchComment(postId);
          targetId = comment.postId;
          contentType = comment.postType === "meme" ? "meme" : "post";
        } else if (state?.postType) {
          contentType = state.postType === "meme" ? "meme" : "post";
        }

        // Fetch post or meme
        if (targetId) {
          const postData = await fetchPostOrMeme(targetId, contentType);
          setPost({
            ...postData,
            _id: postData._id,
            postType: postData.postType,
            user: {
              _id: postData.user._id,
              name: postData.user.name,
              email: postData.user.email || "",
              picture: postData.user.picture || "",
            },
            content: postData.content,
            title: postData.title,
            media: postData.media,
            article: postData.article,
            event: postData.event,
            likes: postData.likes || [],
            comments: postData.comments || [],
            shares: postData.shares || [],
            saves: postData.saves || 0,
            tags: postData.tags,
            location: postData.location,
            visibility: postData.visibility || "public",
            createdAt: postData.createdAt,
            updatedAt: postData.updatedAt,
          });
        } else {
          showStatus("error", "Content ID not found");
          navigate("/adda/notifications", { replace: true });
        }
      } catch (err: any) {
        showStatus("error", err.message || "An error occurred");
        navigate("/adda/notifications", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [postId, navigate, showStatus]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-orange-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto p-5"
    >
      <PostCard post={post} />
      {initiator && (
        <div className="mt-4 bg-white border border-orange-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <img
              src={initiator.picture || "/default-avatar.png"}
              alt={initiator.name}
              className="w-10 h-10 rounded-full border-2 border-orange-200 object-cover"
            />
            <div className="flex-1">
              <p className="font-medium text-orange-900">{initiator.name}</p>
              <p className="text-sm text-orange-600">
                {state?.referenceModel === "Comment"
                  ? "Commented on this post"
                  : "Liked this post"}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/adda/user/${initiator.id}`)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              View Profile
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PostPage;
