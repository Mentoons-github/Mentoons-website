import UserStatus from "@/components/adda/home/userStatus/userStatus";
import FounderNote from "@/components/common/founderNote";
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  Heart,
  Image,
  MessageCircle,
  Plus,
  Share2,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

interface Meme {
  _id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
  likes: string[];
  comments: Comment[];
  shares: string[];
  user: {
    _id: string;
    name: string;
    role: string;
    picture: string;
    bio?: string;
  };
  description: string;
  tags?: string[];
}

// Dummy data for memes
const dummyMemes: Meme[] = [
  {
    _id: "1",
    title: "When the code finally works",
    imageUrl: "https://picsum.photos/seed/meme1/800/600",
    createdAt: new Date().toISOString(),
    likes: ["user1", "user2"],
    comments: [
      {
        _id: "c1",
        user: {
          _id: "user1",
          name: "John Doe",
          email: "john@example.com",
          picture: "https://i.pravatar.cc/150?img=1",
        },
        content: "This is so relatable! 😂",
        createdAt: new Date().toISOString(),
      },
    ],
    shares: ["user3"],
    user: {
      _id: "user1",
      name: "John Doe",
      role: "developer",
      picture: "https://i.pravatar.cc/150?img=1",
      bio: "Full-stack developer",
    },
    description: "That moment when your code works on the first try...",
    tags: ["coding", "programming", "humor"],
  },
  {
    _id: "2",
    title: "Debugging be like",
    imageUrl: "https://picsum.photos/seed/meme2/800/600",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    likes: ["user2", "user3", "user4"],
    comments: [
      {
        _id: "c2",
        user: {
          _id: "user2",
          name: "Jane Smith",
          email: "jane@example.com",
          picture: "https://i.pravatar.cc/150?img=2",
        },
        content: "Story of my life!",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "c3",
        user: {
          _id: "user3",
          name: "Mike Johnson",
          email: "mike@example.com",
          picture: "https://i.pravatar.cc/150?img=3",
        },
        content: "Too real 😅",
        createdAt: new Date().toISOString(),
      },
    ],
    shares: ["user1"],
    user: {
      _id: "user2",
      name: "Jane Smith",
      role: "developer",
      picture: "https://i.pravatar.cc/150?img=2",
      bio: "Frontend developer",
    },
    description:
      "When you spend 4 hours debugging and the issue was a missing semicolon...",
    tags: ["debugging", "coding", "humor"],
  },
  {
    _id: "3",
    title: "Git commits be like",
    imageUrl: "https://picsum.photos/seed/meme3/800/600",
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    likes: ["user1", "user3", "user4", "user5"],
    comments: [
      {
        _id: "c4",
        user: {
          _id: "user4",
          name: "Sarah Wilson",
          email: "sarah@example.com",
          picture: "https://i.pravatar.cc/150?img=4",
        },
        content: "Fixed a bug... and created 10 more 😂",
        createdAt: new Date().toISOString(),
      },
    ],
    shares: ["user2"],
    user: {
      _id: "user3",
      name: "Mike Johnson",
      role: "developer",
      picture: "https://i.pravatar.cc/150?img=3",
      bio: "Backend developer",
    },
    description:
      "When your commit message is longer than the actual code change...",
    tags: ["git", "coding", "humor"],
  },
];

const MemePage = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);

  const [newComment, setNewComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [isSavedMeme, setIsSavedMeme] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [memeCaption, setMemeCaption] = useState("");
  const [memeTag, setMemeTag] = useState("");
  const [memeTags, setMemeTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showMemeModal, setShowMemeModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  console.log(showAuthModal);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowMemeModal(false);
        setSelectedImage(null);
        setMemeCaption("");
        setMemeTags([]);
        setMemeTag("");
      }
    };

    if (showMemeModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMemeModal]);

  const handleMemeUpload = async () => {
    if (!selectedImage || !memeCaption) {
      toast.error("Please add a meme image and caption");
      return;
    }

    setIsUploading(true);
    try {
      const token = await getToken();
      const response = await axios.post(
        `http://localhost:4000/api/v1/memes`,
        {
          image: selectedImage,
          caption: memeCaption,
          tags: memeTags,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response);
      setIsUploading(false);
      toast.success("Meme uploaded successfully");
      setSelectedImage(null);
      setMemeCaption("");
      setMemeTag("");
      setMemeTags([]);
    } catch (error) {
      console.error("Error uploading meme:", error);
      toast.error("Failed to upload meme. Please try again.");
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const fetchMemes = async () => {
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

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Use dummy data instead of API call
        setMemes(dummyMemes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching memes:", error);
        toast.error("Failed to load memes. Please try again later.");
        setLoading(false);
      }
    };

    fetchMemes();
  }, [getToken, isSignedIn]);

  const handleMemeClick = (memeId: string) => {
    navigate(`/adda/meme/${memeId}`);
  };

  const handleLike = async (memeId: string) => {
    if (!isSignedIn) {
      setShowAuthModal(true);
      return;
    }

    try {
      const token = await getToken();
      await axios.post(
        `http://localhost:4000/api/v1/memes/${memeId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update the meme's likes in the state
      setMemes((prevMemes) =>
        prevMemes.map((meme) =>
          meme._id === memeId
            ? {
                ...meme,
                likes: meme.likes.includes(user?.id || "")
                  ? meme.likes.filter((id) => id !== user?.id)
                  : [...meme.likes, user?.id || ""],
              }
            : meme
        )
      );
    } catch (error) {
      console.error("Error liking meme:", error);
      toast.error("Failed to like meme. Please try again.");
    }
  };

  const handleSaveMeme = async (memeId: string) => {
    if (!isSignedIn) {
      setShowAuthModal(true);
      return;
    }

    try {
      const token = await getToken();
      await axios.post(
        `http://localhost:4000/api/v1/memes/${memeId}/save`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsSavedMeme(!isSavedMeme);
      toast.success(isSavedMeme ? "Meme unsaved" : "Meme saved");
    } catch (error) {
      console.error("Error saving meme:", error);
      toast.error("Failed to save meme. Please try again.");
    }
  };

  const handleCommentSubmit = async (memeId: string) => {
    if (!newComment.trim() || !user) {
      if (!isSignedIn) {
        setShowAuthModal(true);
        return;
      }
      return;
    }

    try {
      const token = await getToken();
      const response = await axios.post(
        `http://localhost:4000/api/v1/memes/${memeId}/comment`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the meme's comments in the state
      setMemes((prevMemes) =>
        prevMemes.map((meme) =>
          meme._id === memeId
            ? {
                ...meme,
                comments: [...meme.comments, response.data.data],
              }
            : meme
        )
      );

      setNewComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-16 h-16 border-t-4 border-orange-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {/* {showAuthModal && !isSignedIn && (
        <AuthModal
          onClose={() => {
            if (isSignedIn) {
              setShowAuthModal(false);
            }
          }}
        />
      )} */}

      <div className="flex items-start justify-center w-full p-2 bg-white max-w-8xl sm:p-3 md:p-4">
        <div className="relative flex flex-col w-full">
          {/* Header section with user status */}
          <div className="sticky left-0 flex items-center w-full top-[64px] z-[99999] bg-white">
            <div className="flex-grow w-full min-w-0 py-2">
              <UserStatus />
            </div>
            <div className="flex-shrink-0 hidden px-4 pt-2 md:block">
              <Link to="/mythos">
                <img
                  src="/assets/adda/sidebar/Introducing poster.png"
                  alt="mentoons-mythos"
                  className="max-w-[134px] lg:max-w-[170px]"
                />
              </Link>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex flex-col w-full md:flex-row md:gap-4 lg:gap-6">
            {/* Left sidebar - Founder Note (only visible on lg screens and up) */}
            <div className="flex-shrink-0 hidden lg:block lg:w-1/4">
              <div className="sticky top-[204px] w-full">
                <FounderNote scroll={false} />
              </div>
            </div>

            {/* Center content area - Memes */}
            <div className="flex flex-col  sm:gap-6 w-full md:flex-1 lg:max-w-[50%]  bg-white">
              <div className="sticky top-[200px] z-[999] flex items-center justify-between w-full   bg-white  rounded-lg rounded-tr-none rounded-tl-none ">
                <div className="flex items-center w-full p-2 border border-orange-200 rounded-lg justify-betweens">
                  <div className="flex items-center justify-start w-full gap-3 ">
                    <button
                      onClick={() => (window.location.href = "/adda")}
                      className="p-2 text-orange-600 transition-colors bg-orange-100 rounded-full hover:bg-orange-200"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      className="p-3 rounded-full shadow-lg bg-gradient-to-br from-orange-400 to-orange-500"
                    >
                      {/* User who created the meme */}
                      {user?.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={user?.fullName || "User"}
                          className="w-10 h-10 border border-orange-200 rounded-full"
                        />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </motion.div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col figtree">
                        <span className="text-xl font-bold text-orange-600">
                          Memes
                        </span>
                        <span className="text-sm text-orange-500 ">
                          Share and enjoy funny moments
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-center p-3 transition-colors border-2 border-orange-300 border-dashed rounded-lg cursor-pointer hover:bg-orange-50 w-fit"
                    onClick={() => setShowMemeModal(true)}
                  >
                    <div className="flex items-center gap-2">
                      <Image className="w-6 h-6 text-orange-400" />
                      <p className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        Share a meme
                      </p>
                      <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 rounded-full">
                        <Plus className="w-4 h-5 text-orange-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meme Upload Modal */}
              {showMemeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[100000] flex items-center justify-center p-4 backdrop-blur-sm">
                  <motion.div
                    ref={modalRef}
                    className="relative w-full max-w-2xl p-6 bg-white shadow-xl rounded-xl"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setShowMemeModal(false);
                        setSelectedImage(null);
                        setMemeCaption("");
                        setMemeTags([]);
                        setMemeTag("");
                      }}
                      className="absolute p-1 text-gray-500 transition bg-gray-100 rounded-full top-4 right-4 hover:text-gray-700 hover:bg-gray-200"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>

                    <h2 className="mb-4 text-2xl font-bold text-gray-800">
                      Share a Meme
                    </h2>

                    <div className="flex flex-col gap-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative flex flex-col items-center justify-center w-full p-6 border-2 border-orange-300 border-dashed rounded-lg cursor-pointer hover:bg-orange-50"
                        onClick={() =>
                          document.getElementById("memeUpload")?.click()
                        }
                      >
                        {selectedImage ? (
                          <div className="relative w-full">
                            <img
                              src={URL.createObjectURL(selectedImage)}
                              alt="Meme preview"
                              className="object-contain w-full rounded-lg max-h-64"
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(null);
                              }}
                              className="absolute p-1 text-white bg-red-500 rounded-full top-2 right-2 hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </div>
                        ) : (
                          <>
                            <Image className="w-12 h-12 mb-3 text-orange-400" />
                            <p className="mb-2 text-sm font-medium text-gray-700">
                              Click to upload a meme
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG or GIF (Max 5MB)
                            </p>
                          </>
                        )}
                        <input
                          id="memeUpload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              if (file.size > 5 * 1024 * 1024) {
                                toast.error(
                                  "File size should be less than 5MB"
                                );
                                return;
                              }
                              setSelectedImage(file);
                            }
                          }}
                        />
                      </motion.div>

                      <textarea
                        value={memeCaption}
                        onChange={(e) => setMemeCaption(e.target.value)}
                        placeholder="Add a caption to your meme..."
                        className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                        rows={3}
                      />

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={memeTag}
                          onChange={(e) => setMemeTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && memeTag.trim()) {
                              e.preventDefault();
                              if (!memeTags.includes(memeTag.trim())) {
                                setMemeTags([...memeTags, memeTag.trim()]);
                              }
                              setMemeTag("");
                            }
                          }}
                          placeholder="Add tags (press Enter to add)"
                          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <Button
                          onClick={() => {
                            if (
                              memeTag.trim() &&
                              !memeTags.includes(memeTag.trim())
                            ) {
                              setMemeTags([...memeTags, memeTag.trim()]);
                              setMemeTag("");
                            }
                          }}
                          className="px-3 py-2"
                        >
                          Add Tag
                        </Button>
                      </div>

                      {memeTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {memeTags.map((tag, index) => (
                            <motion.div
                              key={index}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="flex items-center px-3 py-1 text-sm bg-orange-100 rounded-full"
                            >
                              #{tag}
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  setMemeTags(
                                    memeTags.filter((_, i) => i !== index)
                                  )
                                }
                                className="ml-2 text-gray-500 hover:text-red-500"
                              >
                                <X className="w-3 h-3" />
                              </motion.button>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-end mt-4">
                        <Button
                          onClick={handleMemeUpload}
                          disabled={!selectedImage || isUploading}
                          className="px-4 py-2"
                        >
                          {isUploading ? (
                            <div className="flex items-center">
                              <div className="w-4 h-4 mr-2 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                              Uploading...
                            </div>
                          ) : (
                            "Share Meme"
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
              {/* **************** */}

              {memes?.map((meme) => (
                <motion.div
                  key={meme._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col items-center justify-start w-full gap-5 p-5 border border-orange-200 rounded-xl min-h-fit">
                    {/* User information */}
                    <div className="flex items-center justify-start w-full gap-3">
                      <div className="overflow-hidden rounded-full w-14 h-14">
                        <img
                          src={meme.user.picture}
                          alt={`${meme.user.name}-profile`}
                          className="object-cover w-full h-full rounded-full"
                        />
                      </div>
                      <div className="flex flex-col figtree">
                        <span className="Futura Std">{meme.user.name}</span>
                        <span className="figtree text-sm text-[#807E7E]">
                          {meme.user.role}
                        </span>
                        <span className="figtree text-[12px] text-[#807E7E]">
                          {new Date(meme.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Meme title */}
                    <h1 className="w-full mb-2 text-xl font-bold text-gray-800">
                      {meme.title}
                    </h1>

                    {/* Meme description */}
                    <p className="w-full mb-2 text-gray-700">
                      {meme.description}
                    </p>

                    {/* Meme image */}
                    <div className="w-full mb-2 overflow-hidden rounded-lg">
                      <img
                        src={meme.imageUrl}
                        alt={meme.title}
                        className="w-full object-cover max-h-[500px]"
                        onClick={() => handleMemeClick(meme._id)}
                      />
                    </div>

                    {/* Tags */}
                    {meme.tags && meme.tags.length > 0 && (
                      <div className="flex flex-wrap w-full gap-2 mb-2">
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
                    <div className="flex items-center justify-between w-full ">
                      <div className="flex items-center justify-start gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            whileHover={{
                              scale: 1.1,
                              boxShadow: "0px 4px 10px rgba(255,110,0,0.30)",
                            }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className={`flex items-center justify-center w-8 p-2 border ${
                              meme.likes.includes(user?.id || "")
                                ? "border-red-400"
                                : "border-orange-400"
                            } rounded-full sm:w-12 sm:h-12`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(meme._id);
                            }}
                          >
                            <Heart
                              className={`w-4 sm:w-6 sm:h-6 ${
                                meme.likes.includes(user?.id || "")
                                  ? "fill-red-500 text-red-500"
                                  : "text-orange-500"
                              }`}
                            />
                          </motion.button>
                          <span className="text-[#605F5F] text-sm sm:text-base figtree">
                            {meme.likes.length}
                          </span>
                        </div>
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
                              setShowAllComments(!showAllComments);
                            }}
                          >
                            <MessageCircle className="w-4 text-orange-500 sm:w-6 sm:h-6" />
                          </motion.button>
                          <span className="text-[#605F5F] text-sm sm:text-base figtree">
                            {meme.comments.length}
                          </span>
                        </div>
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
                              // Add share functionality
                            }}
                          >
                            <Share2 className="w-4 text-orange-500 sm:w-6 sm:h-6" />
                          </motion.button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button
                          className="flex items-center justify-center p-2 rounded-full sm:w-10 sm:h-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveMeme(meme._id);
                          }}
                        >
                          {isSavedMeme ? (
                            <Bookmark className="w-5 text-orange-500 fill-orange-500 sm:w-6 sm:h-6" />
                          ) : (
                            <Bookmark className="w-5 text-orange-500 sm:w-6 sm:h-6" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Comments section */}
                    {showAllComments && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="w-full p-4 bg-gray-100 rounded-lg"
                      >
                        <h3 className="text-lg font-semibold text-gray-700">
                          Comments
                        </h3>
                        <div className="flex flex-col gap-3 w-full max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-2">
                          {meme.comments.length > 0 ? (
                            meme.comments.map((comment) => (
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
                            <p className="text-center text-gray-500">
                              No comments yet.
                            </p>
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCommentSubmit(meme._id);
                            }}
                            className="px-4 py-2 text-white transition bg-orange-500 rounded-lg hover:bg-orange-600"
                          >
                            Send
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right sidebar */}
            <div className="flex-shrink-0 hidden w-full md:w-1/3 lg:w-1/4 md:block">
              <div className="md:sticky flex flex-col gap-4 sm:gap-6 md:rounded-lg md:pt-0 top-[200px] z-10 w-full">
                {/* Popular tags */}
                <div className="p-5 bg-white border border-orange-200 rounded-lg">
                  <h3 className="mb-4 text-lg font-bold">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "memes",
                      "funny",
                      "programming",
                      "coding",
                      "humor",
                      "tech",
                    ].map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm text-gray-700 bg-orange-100 rounded-full cursor-pointer hover:bg-orange-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {/* Related memes */}
              <div className="p-5 mt-6 bg-white border border-orange-200 rounded-lg md:sticky top-[370px]">
                <h3 className="mb-4 text-lg font-bold">Related Memes</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <div className="w-16 h-16 overflow-hidden rounded-lg">
                        <img
                          src={`https://source.unsplash.com/random/100x100?meme&sig=${item}`}
                          alt="Related meme"
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">
                          Funny Parenting Meme
                        </h4>
                        <p className="mt-1 text-xs text-gray-500">2 days ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemePage;
