import { PHOTO_POST } from "@/constant/constants";
import { useAuthModal } from "@/context/adda/authModalContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { forwardRef, useImperativeHandle, useState } from "react";
import { FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PostUpload from "../modal/postUpload";

interface PostData {
  _id: string;
  postType: "text" | "photo" | "video" | "article" | "event" | "mixed";
  user: {
    _id: string;
    name: string;
    role: string;
    profilePicture: string;
  };
  content?: string;
  title?: string;
  media?: Array<{
    url: string;
    type: "image" | "video";
    caption?: string;
  }>;
  article?: {
    body: string;
    coverImage?: string;
  };
  event?: {
    startDate: string | Date;
    endDate?: string | Date;
    venue: string;
    description: string;
    coverImage?: string;
  };
  likes: string[];
  comments: string[];
  shares: string[];
  createdAt: string | Date;
  visibility: "public" | "friends" | "private";
  tags?: string[];
  location?: string;
}

interface AddPostsProps {
  onPostCreated?: (post: PostData) => void;
  setLatestPost?: (val: boolean) => void;
  setPendingPost?: (post: PostData) => void;
}

interface AddPostsRef {
  handlePost: (type: "photo" | "video" | "event" | "article") => void;
  setPendingPost?: (post: PostData) => void;
}

const AddPosts = forwardRef<AddPostsRef, AddPostsProps>(
  ({ setLatestPost, onPostCreated, setPendingPost }, ref) => {
    const { isSignedIn } = useUser();
    const { getToken } = useAuth();
    const { openAuthModal } = useAuthModal();
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useUser();
    const [selectedPostType, setSelectedPostType] = useState<
      "photo" | "video" | "event" | "article" | null
    >(null);
    const [textContent, setTextContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handlePost = (type: "photo" | "video" | "event" | "article") => {
      if (!isSignedIn) {
        openAuthModal("sign-in");
        return;
      }
      setSelectedPostType(type);
      setIsOpen(true);
    };

    useImperativeHandle(ref, () => ({
      handlePost,
      setPendingPost,
    }));

    const handlePostComplete = (newPost: PostData) => {
      if (setLatestPost) {
        setLatestPost(true);
      }
      if (setPendingPost) {
        setPendingPost(newPost);
      }
      setIsOpen(false);
      setSelectedPostType(null);
      if (onPostCreated) {
        onPostCreated(newPost);
      }
    };

    const handleTextSubmit = async () => {
      if (!isSignedIn) {
        openAuthModal("sign-in");
        return;
      }

      if (!textContent.trim()) {
        toast.error("Please enter some text to post");
        return;
      }

      setIsSubmitting(true);
      try {
        const token = await getToken();
        if (!token) {
          toast.error("Authentication failed. Please log in again.");
          return;
        }

        const postData = {
          content: textContent,
          postType: "text",
          visibility: "public",
        };

        const apiUrl = `${import.meta.env.VITE_PROD_URL}/posts`;
        const response = await axios.post(apiUrl, postData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          toast.success("Text post created successfully!");
          setTextContent("");

          let postData = null;
          if (response.data.data && response.data.data.post) {
            postData = response.data.data.post;
          } else if (response.data.post) {
            postData = response.data.post;
          } else if (
            response.data.data &&
            typeof response.data.data === "object"
          ) {
            postData = response.data.data;
          }

          const structuredPost: PostData = {
            ...postData,
            _id: postData?._id || `temp-${Date.now()}`,
            postType: postData?.postType || "text",
            user: postData?.user || {
              _id: user?.id || "unknown",
              name: user?.fullName || "User",
              role: "User",
              profilePicture: user?.imageUrl || "",
            },
            likes: postData?.likes || [],
            comments: postData?.comments || [],
            shares: postData?.shares || [],
            createdAt: postData?.createdAt || new Date().toISOString(),
            visibility: postData?.visibility || "public",
            content: postData?.content || textContent,
          };

          if (setPendingPost) {
            setPendingPost(structuredPost);
          }
          if (setLatestPost) {
            setLatestPost(true);
          }
          if (onPostCreated) {
            onPostCreated(structuredPost);
          }
        } else {
          toast.error("Failed to create post: " + response.data.message);
        }
      } catch (error) {
        console.error("Text post creation failed:", error);
        let errorMessage = "Unknown error";
        if (axios.isAxiosError(error) && error.response) {
          errorMessage = error.response.data?.message || error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        toast.error(`Failed to create text post: ${errorMessage}`);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <>
        <div className="relative flex flex-col items-center justify-start w-full p-4 border border-orange-200 shadow-lg shadow-orange-100/80 rounded-xl">
          <div className="flex items-center w-full gap-3">
            <div className="flex-shrink-0 w-10 h-10 overflow-hidden bg-transparent rounded-full">
              {user?.imageUrl ? (
                <img
                  onClick={() => navigate("/adda/user-profile")}
                  src={user?.imageUrl}
                  alt={user?.fullName || "User"}
                  className="object-cover w-full h-full rounded-full cursor-pointer"
                />
              ) : (
                <FiUser className="w-8 h-8 text-gray-500" />
              )}
            </div>

            <div className="flex items-center w-full gap-2">
              <input
                type="text"
                placeholder="Start your first blogging as a parent"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="flex-grow px-4 py-2 text-sm border-0 font-inter rounded-full focus:outline-none focus:ring-2 focus:ring-[#e37019]"
              />
              {textContent.trim() && (
                <button
                  onClick={handleTextSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-1 text-sm font-medium text-orange-600 bg-white border border-orange-300 rounded-full hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send"}
                </button>
              )}
            </div>
          </div>

          <hr className="w-full my-3 border-orange-200" />

          <div className="flex flex-wrap items-center justify-between w-full gap-2">
            {PHOTO_POST.map(({ icon, purpose }, index) => (
              <button
                className="flex items-center gap-2 p-1 transition-colors rounded-lg outline-none cursor-pointer hover:bg-gray-100"
                key={index}
                onClick={() =>
                  handlePost(
                    purpose.toLowerCase() as
                      | "photo"
                      | "video"
                      | "event"
                      | "article"
                  )
                }
              >
                <img
                  src={icon}
                  alt={purpose}
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
                <span className="figtree text-xs sm:text-sm font-medium text-[#605F5F]">
                  {purpose}
                </span>
              </button>
            ))}
          </div>
        </div>

        {selectedPostType && (
          <PostUpload
            isOpen={isOpen}
            onClose={setIsOpen}
            postType={selectedPostType}
            onPostCreated={handlePostComplete}
          />
        )}
      </>
    );
  }
);

export default AddPosts;
