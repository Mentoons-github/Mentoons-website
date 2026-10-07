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
import { useBadge } from "@/context/adda/badgeContext";

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

const chipColors = ["#ef4444", "#3b82f6", "#22c55e", "#a855f7"];

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
    const { showBadge } = useBadge();

    const navigate = useNavigate();

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

        console.log("response data : ", response.data.badge);

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

          if (response.data.badge) {
            showBadge(response.data.badge);
          }

          if (response.data.badges && Array.isArray(response.data.badges)) {
            showBadge(response.data.badges);
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
        <style>{`
          @keyframes ap-pop {
            0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
            70%  { transform: scale(1.15) rotate(4deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          @keyframes ap-slam {
            0%   { transform: scale(1.8) rotate(-4deg); opacity: 0; }
            60%  { transform: scale(0.97) rotate(0.5deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          .ap-pop  { animation: ap-pop 0.4s cubic-bezier(.2,.9,.3,1.4) both; }
          .ap-slam { animation: ap-slam 0.4s cubic-bezier(.2,.8,.3,1) both; }

          .ap-font {
            font-family: var(--font-comic) !important;
            font-weight: 400 !important;
            letter-spacing: 0.05em;
          }
          .ap-chip-font {
            font-family: var(--font-comic-chip, var(--font-comic)) !important;
            font-weight: 400 !important;
            letter-spacing: 0.04em;
          }

          .ap-card {
            background-color: #fffbeb;
            background-image: radial-gradient(rgba(249,115,22,0.18) 1.5px, transparent 2px);
            background-size: 14px 14px;
            border: 3px solid #000;
            box-shadow: 6px 6px 0 #000;
            border-radius: 14px;
          }

          .ap-avatar {
            background: #fff;
            border: 3px solid #000;
            box-shadow: 3px 3px 0 #000;
            border-radius: 999px;
            transition: transform 0.15s cubic-bezier(.34,1.56,.64,1);
          }
          .ap-avatar:hover { transform: rotate(-6deg) scale(1.08); }

          .ap-input {
            background: #fff;
            color: #000;
            border: 3px solid #000;
            box-shadow: 3px 3px 0 #000;
            border-radius: 10px;
            outline: none;
            transition: box-shadow 0.1s ease, transform 0.1s ease, background 0.1s ease;
          }
          .ap-input::placeholder { color: #6b7280; }
          .ap-input:focus {
            background: #fffef2;
            box-shadow: 5px 5px 0 #f97316, 5px 5px 0 1px #000;
            transform: translate(-2px, -2px);
          }

          .ap-tag {
            background: #fde047;
            color: #000;
            border: 3px solid #000;
            box-shadow: 3px 3px 0 #000;
            border-radius: 8px;
            padding: 1px 10px;
            transform: rotate(-2deg) skewX(-6deg);
            display: inline-block;
          }

          .ap-cta {
            background: #f97316;
            color: #fff;
            border: 3px solid #000;
            box-shadow: 4px 4px 0 #000;
            border-radius: 10px;
            text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
            transform: rotate(-2deg);
            transition: box-shadow 0.1s ease, background 0.1s ease, transform 0.1s ease;
          }
          .ap-cta:hover:not(:disabled) { background: #fb923c; transform: rotate(-2deg) scale(1.06); }
          .ap-cta:active:not(:disabled) { box-shadow: 0 0 0 #000; transform: rotate(-2deg) translate(3px, 3px); }
          .ap-cta:disabled { opacity: 0.6; cursor: not-allowed; }

          .ap-divider {
            border: 0;
            border-top: 3px dashed #000;
            opacity: 0.85;
          }

          .ap-action {
            background: var(--chip);
            color: #fff;
            border: 3px solid #000;
            box-shadow: 3px 3px 0 #000;
            border-radius: 8px;
            transform: rotate(var(--rot, 0deg));
            transition: transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease;
            text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
          }
          .ap-action:hover {
            transform: rotate(0deg) translate(-2px, -2px) scale(1.06);
            box-shadow: 6px 6px 0 #000;
          }
          .ap-action:active {
            transform: translate(3px, 3px);
            box-shadow: 0 0 0 #000;
          }
          .ap-action-icon {
            background: #fff;
            border: 2px solid #000;
            border-radius: 6px;
            padding: 2px;
          }

          @media (prefers-reduced-motion: reduce) {
            .ap-pop, .ap-slam { animation: none; }
          }
        `}</style>

        <div className="ap-card relative flex flex-col w-full p-5">
          <div className="flex items-start gap-4">
            <div className="ap-pop flex-shrink-0">
              <div className="ap-avatar w-12 h-12 overflow-hidden flex items-center justify-center">
                {user?.imageUrl ? (
                  <img
                    onClick={() => navigate("/adda/user-profile")}
                    src={user?.imageUrl}
                    alt={user?.fullName || "User"}
                    className="object-cover w-full h-full cursor-pointer"
                  />
                ) : (
                  <FiUser className="w-8 h-8 text-gray-500" />
                )}
              </div>
            </div>

            <div ref={textInputRef} className="flex flex-col w-full gap-3">
              {isTextInputActive ? (
                <div className="ap-slam flex flex-col gap-3">
                  <textarea
                    rows={5}
                    placeholder="✍️ Share your thoughts or first blog as a parent..."
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    autoFocus
                    className="ap-input ap-font w-full resize-none px-4 py-3 text-base"
                  />
                  <div className="w-full">
                    <label className="ap-tag ap-chip-font mb-2 text-sm">
                      Tags (separate by comma)
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      name="tags"
                      className="ap-input ap-font w-full px-4 py-3 mt-2 text-base"
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
                  className="ap-input ap-font w-full px-4 py-3 text-base"
                />
              )}
              {textContent.trim() && (
                <div className="ap-pop flex justify-end">
                  <button
                    onClick={handleTextSubmit}
                    disabled={isSubmitting}
                    className="ap-cta ap-font px-6 py-1.5 text-xl uppercase cursor-pointer"
                  >
                    {isSubmitting ? "Publishing..." : "Publish"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <hr className="ap-divider w-full my-4" />

          <div className="flex items-center justify-between gap-3">
            {PHOTO_POST.map(({ icon, purpose }, index) => (
              <button
                key={index}
                onClick={() =>
                  handlePost(
                    purpose.toLowerCase() as
                      "photo" | "video" | "event" | "article",
                  )
                }
                aria-label={purpose}
                className="ap-action ap-chip-font group relative flex items-center justify-center gap-2 px-3 py-2 text-sm flex-1 cursor-pointer"
                style={
                  {
                    ["--chip" as string]: chipColors[index % chipColors.length],
                    ["--rot" as string]: `${index % 2 === 0 ? -2 : 2}deg`,
                  } as React.CSSProperties
                }
              >
                <span className="ap-action-icon flex items-center justify-center shrink-0">
                  <img
                    src={icon}
                    alt={purpose}
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                </span>
                <span className="hidden sm:inline whitespace-nowrap uppercase">
                  {purpose}
                </span>

                <span className="sm:hidden absolute -top-9 left-1/2 -translate-x-1/2 bg-yellow-300 text-black border-2 border-black text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
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
            postedImage={pastedImage}
          />
        )}

        <ErrorModal
          open={isErrorModalOpen}
          message={errorModalProps.error}
          onClose={() => setIsErrorModalOpen(false)}
        />
      </>
    );
  },
);

export default AddPosts;
