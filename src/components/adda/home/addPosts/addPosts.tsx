import { PHOTO_POST } from "@/constant/constants";
import { useAuthModal } from "@/context/adda/authModalContext";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import PostUpload from "../modal/postUpload";
import { useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";

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
  setNewPost: (val: boolean) => void;
}

const AddPosts = ({ setNewPost, onPostCreated }: AddPostsProps) => {
  const { isSignedIn } = useUser();
  const { openAuthModal } = useAuthModal();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const [selectedPostType, setSelectedPostType] = useState<
    "photo" | "video" | "event" | "article" | null
  >(null);
  const navigate = useNavigate();

  const handlePost = (type: "photo" | "video" | "event" | "article") => {
    if (!isSignedIn) {
      openAuthModal("sign-in");
      return;
    }
    setSelectedPostType(type);
    setIsOpen(true);
  };

  const handlePostComplete = (newPost: PostData) => {
    setNewPost(true);
    setTimeout(() => {
      setNewPost(false);
    }, 3000);
    setIsOpen(false);
    setSelectedPostType(null);
    // Call the callback if provided
    if (onPostCreated) {
      onPostCreated(newPost);
    }
  };

  return (
    <>
      <div className=" relative flex flex-col items-center justify-start w-full p-4 border border-orange-200 shadow-lg shadow-orange-100/80 rounded-xl z-[20]">
        <div className="flex items-center w-full gap-3">
          {/* Improved avatar container with proper sizing and overflow handling */}
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

          {/* Styled input field with proper height and background */}
          <div className="flex-grow">
            <input
              type="text"
              placeholder="What's in your mind?"
              className="w-full px-4 py-2 text-sm border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-[#e37019]"
            />
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
              <img src={icon} alt={purpose} className="w-5 h-5 sm:w-6 sm:h-6" />
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
};

export default AddPosts;
