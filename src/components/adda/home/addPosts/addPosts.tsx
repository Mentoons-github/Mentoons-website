import { PHOTO_POST } from "@/constant/constants";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import PostUpload from "../modal/postUpload";
import { useAuthModal } from "@/context/adda/authModalContext";

// Import the post type from PostCardSwitcher instead of PostCard
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
  likes: string[]; // Changed from any[] to string[] assuming likes are user IDs
  comments: string[]; // Changed from any[] to string[] assuming comments are comment IDs
  shares: string[]; // Changed from any[] to string[] assuming shares are user IDs
  createdAt: string | Date;
  visibility: "public" | "friends" | "private";
  tags?: string[];
  location?: string;
}

interface AddPostsProps {
  onPostCreated?: (post: PostData) => void;
}

const AddPosts = ({ onPostCreated }: AddPostsProps) => {
  const { isSignedIn } = useUser();
  const { openAuthModal } = useAuthModal();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const [selectedPostType, setSelectedPostType] = useState<
    "photo" | "video" | "event" | "article" | null
  >(null);

  const handlePost = (type: "photo" | "video" | "event" | "article") => {
    if (!isSignedIn) {
      openAuthModal("sign-in");
      return;
    }
    setSelectedPostType(type);
    setIsOpen(true);
  };

  // Add this function to handle post creation completion
  const handlePostComplete = (newPost: PostData) => {
    // Close the modal
    setIsOpen(false);
    // Reset selected post type
    setSelectedPostType(null);
    // Call the callback if provided
    if (onPostCreated) {
      onPostCreated(newPost);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-start w-full p-4 border border-orange-200 shadow-lg shadow-orange-100/80 rounded-xl">
        <div className="flex items-center w-full gap-3">
          {/* Improved avatar container with proper sizing and overflow handling */}
          <div className="flex-shrink-0 w-10 h-10 overflow-hidden bg-transparent rounded-full">
            <img
              src={
                user?.imageUrl ||
                "/assets/adda/profilePictures/pexels-simon-robben-55958-614810.jpg"
              }
              alt={user?.fullName || "User"}
              className="object-cover w-full h-full rounded-full"
            />
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
