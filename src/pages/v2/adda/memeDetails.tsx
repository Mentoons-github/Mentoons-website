import Likes from "@/components/adda/home/addPosts/likes/likes";
import Share from "@/components/adda/home/addPosts/share/share";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BiArrowBack, BiComment, BiLock } from "react-icons/bi";
import { FaBookmark, FaRegBookmark, FaUserPlus } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

// Types
interface Comment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    picture: string;
  };
  content: string;
  createdAt: string;
}

interface MemeDetails {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    picture: string;
    role: string;
    bio?: string;
    location?: string;
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

// Authentication Modal Component
const AuthModal = ({ onClose }: { onClose: () => void }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  // Handle redirect after auth
  const handleAuth = (authType: "signin" | "signup") => {
    // Store the current path to redirect back after auth
    localStorage.setItem("authRedirectUrl", currentPath);
    navigate(`/${authType === "signin" ? "sign-in" : "sign-up"}`, {
      state: { from: currentPath },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100000] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 bg-white shadow-xl rounded-xl">
        <button
          onClick={onClose}
          disabled={isSignedIn}
          className="absolute text-gray-500 top-4 right-4 hover:text-gray-700"
        >
          <FaXmark size={20} />
        </button>

        <div className="mb-6 text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-orange-100 rounded-full">
            <BiLock className="text-4xl text-orange-500" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            Authentication Required
          </h2>
          <p className="text-gray-600">
            Sign in or register to view this meme, engage with the community,
            and access all features.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleAuth("signin")}
            className="flex items-center justify-center w-full py-3 font-medium text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
          >
            <span className="mr-2">Sign In</span>
          </button>

          <button
            onClick={() => handleAuth("signup")}
            className="flex items-center justify-center w-full py-3 font-medium text-orange-500 transition-colors border-2 border-orange-500 rounded-lg hover:bg-orange-50"
          >
            <FaUserPlus className="mr-2" />
            <span>Create an Account</span>
          </button>
        </div>

        <div className="pt-6 mt-6 text-sm text-center text-gray-500 border-t border-gray-200">
          <p>
            Join our community to access exclusive content, interact with memes,
            and connect with like-minded individuals.
          </p>
        </div>
      </div>
    </div>
  );
};

const MemeDetailsPage = () => {
  const { memeId } = useParams<{ memeId: string }>();
  const [meme, setMeme] = useState<MemeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSavedMeme, setIsSavedMeme] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
 
  const [likeCount, setLikeCount] = useState(meme?.likeCount || 0);
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Check for redirect from authentication
  useEffect(() => {
    const redirectUrl = localStorage.getItem("authRedirectUrl");
    if (redirectUrl && isSignedIn) {
      localStorage.removeItem("authRedirectUrl");
    }
  }, [isSignedIn, location.pathname]);

  useEffect(() => {
    const fetchMemeDetails = async () => {
      setLoading(true);
      try {
        if (!isSignedIn) {
          setShowAuthModal(true);
          setLoading(false);
          return;
        }

        if (!(await getToken())) {
          setShowAuthModal(true);
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_PROD_URL}memes/${memeId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await getToken()}`,
            },
          }
        );
        console.log(response.data);
        setMeme(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching meme details:", err);
        setError(true);
        setLoading(false);
      }
    };

    // Call both functions
    fetchMemeDetails();

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []); // Remove dependencies since we're using dummy data

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !user) {
      // If not signed in, show auth modal
      if (!isSignedIn) {
        setShowAuthModal(true);
        return;
      }
      return;
    }

    try {
      if (!(await getToken())) {
        setShowAuthModal(true);
        return;
      }

      const newCommentObj: Comment = {
        _id: `temp-${Date.now()}`,
        user: {
          _id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.emailAddresses[0].emailAddress,
          picture:
            user.imageUrl ||
            "/assets/adda/profilePictures/pexels-stefanstefancik-91227.jpg",
        },
        content: newComment,
        createdAt: new Date().toISOString(),
      };

      setMeme((prevMeme) => {
        if (!prevMeme) return null;
        return {
          ...prevMeme,
          comments: [...prevMeme.comments, newCommentObj],
        };
      });
      const token = await getToken();
      const response = await axios.post(
        "http://localhost:4000/api/v1/comments",
        {
          memeId: memeId,
          content: newComment,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      toast.success("Comment added successfully");

      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleSaveMeme = async () => {
    const newSavedState = !isSavedMeme;
    setIsSavedMeme(newSavedState);

   

    try {
      const token = await getToken();
      const endpoint = `${
        import.meta.env.VITE_PROD_URL
      }memeFeed/save/${memeId}`;

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
          `${import.meta.env.VITE_PROD_URL}memeFeed/saved/${memeId}`,
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
        `${
          import.meta.env.VITE_PROD_URL
        }likes/get-likes?type=meme&id=${memeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data.data);
      setLikeCount(response.data.data.length);
    };
    getAllLikes();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-16 h-16 border-t-4 border-orange-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !meme) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
        <h2 className="mb-4 text-2xl font-bold text-red-500">Error</h2>
        <p className="mb-6 text-gray-700">
          {error
            ? "Failed to load meme details. Please try again later."
            : "Meme not found"}
        </p>
        <Link
          to="/adda/meme"
          className="px-6 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
        >
          Go Back to Memes
        </Link>
      </div>
    );
  }

  const displayedComments = showAllComments
    ? meme.comments
    : meme.comments.slice(0, 3);

  return (
    <>
      {showAuthModal && !isSignedIn && (
        <AuthModal
          onClose={() => {
            if (isSignedIn) {
              setShowAuthModal(false);
            }
          }}
        />
      )}

      <div className="flex flex-col w-full gap-4 sm:gap-6">
        {/* Meme details */}
        <div className="p-5 bg-white border border-orange-200 rounded-lg shadow-sm">
          {/* User information */}
          <div className="flex items-start gap-4 mb-4">
            <button
              onClick={() => navigate("/adda/meme")}
              className="p-2 text-orange-600 transition-colors rounded-full hover:bg-orange-200"
            >
              <BiArrowBack className="w-5 h-5" />
            </button>
            <div className="overflow-hidden rounded-full w-14 h-14">
              <img
                src={meme.user.picture}
                alt={`${meme.user.name}'s profile`}
                className="object-cover w-full h-full rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-bold">{meme.user.name}</h3>
              <p className="text-sm text-gray-600">{meme.user.role}</p>
            </div>
          </div>

          {/* Meme title */}
          {meme.title && (
            <h1 className="mb-3 text-xl font-bold text-gray-800">
              {meme.title}
            </h1>
          )}

          {/* Meme content */}
          {meme?.description && (
            <p className="mb-4 text-gray-700">{meme?.description}</p>
          )}

          {/* Meme image */}
          {meme.image && (
            <div className="mb-4">
              <div className="overflow-hidden rounded-lg">
                <img
                  src={meme.image}
                  alt={meme.title || "Meme"}
                  className="w-full object-contain max-h-[600px]"
                />
              </div>
              {meme.description && (
                <p className="mt-2 text-sm italic text-gray-600">
                  {meme.description}
                </p>
              )}
            </div>
          )}

          {/* Tags */}
          {meme.tags && meme.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {meme.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs text-orange-600 bg-orange-100 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Interaction buttons */}
          <div className="flex items-center justify-between w-full pt-4 border-t border-organge-200">
            <div className="flex items-center gap-4">
              {/* Like button */}
              <div
                onClick={!isSignedIn ? () => setShowAuthModal(true) : undefined}
              >
                <Likes type="meme" id={meme._id} likeCount={likeCount} />
              </div>

              {/* Comment count */}
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0px 4px 10px rgba(255,110,0,0.30)",
                  }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="flex items-center justify-center w-8 p-2 border border-orange-400 rounded-full sm:w-12 sm:h-12"
                >
                  <BiComment className="w-4 text-orange-500 sm:w-6 sm:h-6" />
                </motion.button>
                <span className="text-[#605F5F] text-sm sm:text-base figtree">
                  {meme.comments.length}
                </span>
              </div>

              {/* Share button */}
              <div
                onClick={!isSignedIn ? () => setShowAuthModal(true) : undefined}
              >
                <Share
                  type="meme"
                  postDetails={{
                    ...meme,
                    shares: meme.shares,
                    saves: 0,
                    user: {
                      ...meme.user,
                      email: "",
                      picture: "",
                    },
                  }}
                />
              </div>
            </div>

            {/* Save button */}
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
        </div>

        {/* Comments section */}
        <div className="p-5 bg-white border border-orange-200 rounded-lg shadow-sm">
          <h3 className="mb-4 text-xl font-bold">
            Comments ({meme.comments.length})
          </h3>

          {/* Comment form */}
          <div className="flex items-start gap-3 pb-6 mb-6 border-b border-gray-200">
            <div className="w-10 h-10 overflow-hidden rounded-full">
              <img
                src={
                  user?.imageUrl ||
                  "/assets/adda/profilePictures/pexels-stefanstefancik-91227.jpg"
                }
                alt="Your profile"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={
                  isSignedIn ? "Add a comment..." : "Sign in to comment..."
                }
                className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={3}
                disabled={!isSignedIn}
              ></textarea>
              <button
                onClick={handleCommentSubmit}
                disabled={!newComment.trim() || !isSignedIn}
                className="float-right px-4 py-2 mt-2 text-white bg-orange-500 rounded-lg disabled:opacity-50 hover:bg-orange-600"
              >
                {isSignedIn ? "Post Comment" : "Sign In to Comment"}
              </button>
            </div>
          </div>

          {/* Comments list */}
          <div className="space-y-4">
            {meme.comments.length > 0 ? (
              <>
                {displayedComments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex items-start gap-3 p-4 rounded-lg bg-orange-50"
                  >
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        src={comment.user.picture}
                        alt={`${comment.user.name}'s profile`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{comment.user.name}</h4>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))}

                {meme.comments.length > 3 && (
                  <button
                    onClick={() => setShowAllComments(!showAllComments)}
                    className="w-full py-2 font-medium text-center text-yellow-600 hover:text-yellow-700"
                  >
                    {showAllComments
                      ? "Show Less Comments"
                      : `Show All ${meme.comments.length} Comments`}
                  </button>
                )}
              </>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MemeDetailsPage;
