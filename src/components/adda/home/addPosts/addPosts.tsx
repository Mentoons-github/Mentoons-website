import { PHOTO_POST } from "@/constant/constants";
import { useAuthModal } from "@/context/adda/authModalContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
} from "react";
import { FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PostUpload from "../modal/postUpload";
import ErrorModal from "../../modal/error";

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
  visibility: "public" | "private";
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
    const [tags, setTags] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [isTextInputActive, setIsTextInputActive] = useState(false);
    const [pastedImage, setPastedImage] = useState<File | null>(null);
    const textInputRef = useRef<HTMLDivElement | null>(null);
    const [errorModalProps, setErrorModalProps] = useState<{
      error: string;
      action: "nav" | "retry" | "custom";
      link?: string;
      actionText?: string;
      onAction?: () => void;
    }>({ error: "", action: "nav" });
    const navigate = useNavigate();

    // Handle clipboard paste event
    useEffect(() => {
      const handlePaste = (event: ClipboardEvent) => {
        const items = event.clipboardData?.items;
        if (!items) return;

        for (const item of items) {
          if (item.type.startsWith("image")) {
            const file = item.getAsFile();
            if (file) {
              if (!isSignedIn) {
                openAuthModal("sign-in");
                return;
              }
              setPastedImage(file);
              setSelectedPostType("photo");
              setIsOpen(true);
              event.preventDefault();
              break;
            }
          }
        }
      };

      window.addEventListener("paste", handlePaste);
      return () => window.removeEventListener("paste", handlePaste);
    }, [isSignedIn, openAuthModal]);

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
      setPastedImage(null);
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
        setErrorModalProps({
          error: "Please enter some text to post.",
          action: "custom",
          actionText: "OK",
          onAction: () => {},
        });
        setIsErrorModalOpen(true);
        return;
      }

      setIsSubmitting(true);
      try {
        const token = await getToken();
        if (!token) {
          openAuthModal("sign-in");
          return;
        }

        const postData = {
          content: textContent,
          postType: "text",
          visibility: "public",
          tags:
            tags
              ?.split(",")
              ?.map((t) => t.trim())
              ?.filter((t) => t.length > 0) || [],
        };

        const apiUrl = `${import.meta.env.VITE_PROD_URL}/posts`;
        const response = await axios.post(apiUrl, postData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setTextContent("");
          setIsTextInputActive(false);

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
          setErrorModalProps({
            error: "Failed to create post: " + response.data.message,
            action: "retry",
            actionText: "Try Again",
            onAction: handleTextSubmit,
          });
          setIsErrorModalOpen(true);
        }
      } catch (error) {
        console.error("Text post creation failed:", error);
        setErrorModalProps({
          error: `Complete your profile and start posting`,
          action: "nav",
          actionText: "Edit Profile",
          link: "/adda/user-profile",
          onAction: handleTextSubmit,
        });
        setIsErrorModalOpen(true);
      } finally {
        setIsSubmitting(false);
      }
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          textInputRef.current &&
          !textInputRef.current.contains(event.target as Node)
        ) {
          if (!isSubmitting) {
            setIsTextInputActive(false);
          }
        }
      };

      if (isTextInputActive) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isTextInputActive, isSubmitting]);

    return (
      <>
        <div className="relative flex flex-col w-full p-5 bg-white border border-orange-200 rounded-2xl shadow-md shadow-orange-100/70">
          {/* Top Section: Avatar + Blog Input */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0  w-12 h-12 overflow-hidden rounded-full ring-2 ring-orange-200">
              {user?.imageUrl ? (
                <img
                  onClick={() => navigate("/adda/user-profile")}
                  src={user?.imageUrl}
                  alt={user?.fullName || "User"}
                  className="object-cover w-full h-full cursor-pointer"
                />
              ) : (
                <FiUser className="w-10 h-10 mx-auto my-auto text-gray-400" />
              )}
            </div>

            <div ref={textInputRef} className="flex flex-col w-full gap-3">
              {isTextInputActive ? (
                <div>
                  <textarea
                    rows={5}
                    placeholder="✍️ Share your thoughts or first blog as a parent..."
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    autoFocus
                    className="w-full resize-none px-4 py-3 text-sm border border-gray-200 rounded-xl font-inter focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-300 transition"
                  />
                  <div className="w-full">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tags (seperate by coma)
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      name="tags"
                      className="w-full resize-none px-4 py-3 text-sm border border-gray-200 rounded-xl font-inter focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-300 transition"
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="✍️ Share your thoughts or first blog as a parent..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  onFocus={() => setIsTextInputActive(true)}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl font-inter focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-300 transition"
                />
              )}
              {textContent.trim() && (
                <div className="flex justify-end">
                  <button
                    onClick={handleTextSubmit}
                    disabled={isSubmitting}
                    className="px-5 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg shadow hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isSubmitting ? "Publishing..." : "Publish"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <hr className="w-full my-4 border-t border-orange-100" />

          <div className="flex flex-wrap items-center justify-between gap-3">
            {PHOTO_POST.map(({ icon, purpose }, index) => (
              <button
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
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 transition rounded-lg hover:bg-orange-50 hover:text-orange-600"
              >
                <img
                  src={icon}
                  alt={purpose}
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
                <span className="figtree">{purpose}</span>
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
            postedImage={pastedImage}
          />
        )}

        <ErrorModal
          isOpen={isErrorModalOpen}
          onClose={() => setIsErrorModalOpen(false)}
          error={errorModalProps.error}
          action={errorModalProps.action}
          link={errorModalProps.link}
          actionText={errorModalProps.actionText}
          onAction={errorModalProps.onAction}
        />
      </>
    );
  }
);

export default AddPosts;
