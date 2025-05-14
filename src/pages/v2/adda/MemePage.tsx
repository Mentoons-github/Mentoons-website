import MemeCard from "@/components/adda/home/addPosts/MemeCard";
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, Image, Plus, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  image: string;
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
    image: "https://picsum.photos/seed/meme1/800/600",
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
    image: "https://picsum.photos/seed/meme2/800/600",
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
    image: "https://picsum.photos/seed/meme3/800/600",
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

    if (!user) {
      toast.error("Please login to upload a meme");
      return;
    }

    if (!isSignedIn) {
      setShowAuthModal(true);
      return;
    }

    const token = await getToken();
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedImage);

      const uploadResponse = await axios.post(
        `https://mentoons-backend-zlx3.onrender.com/api/v1/upload/file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const imageUrl = uploadResponse.data.data.fileDetails.url;

      const response = await axios.post(
        `${import.meta.env.VITE_PROD_URL}memes`,
        {
          title: "test",
          image: imageUrl,
          description: memeCaption,
          tags: memeTags,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response);
      toast.success("Meme uploaded successfully");
      setSelectedImage(null);
      setMemeCaption("");
      setMemeTag("");
      setMemeTags([]);
    } catch (error) {
      console.error("Error uploading meme:", error);
      toast.error("Failed to upload meme. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const fetchMemesFeeds = async () => {
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
          `${import.meta.env.VITE_PROD_URL}memeFeed`,
          {
            headers: { Authorization: `Bearer ${await getToken()}` },
            params: {
              page: 1,
              limit: 10,
              sortBy: "createdAt",
              sortOrder: "desc",
              search: "",
              tags: "",
            },
          }
        );
        setMemes(response.data.data || dummyMemes);
      } catch (error) {
        console.error("Error fetching memes:", error);
        toast.error("Failed to load memes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMemesFeeds();
  }, [getToken, isSignedIn]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-16 h-16 border-t-4 border-orange-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col w-full gap-4 sm:gap-6">
      {/* Meme header */}
      <div className="sticky top-[200px] z-[10] flex items-center justify-between w-full bg-white rounded-lg rounded-tr-none rounded-tl-none">
        <div className="flex items-center w-full p-2 border border-orange-200 rounded-lg shadow-lg justify-betweens shadow-orange-100/80">
          <div className="flex items-center justify-start w-full gap-3 ">
            <button
              onClick={() => navigate("/adda/home")}
              className="p-2 text-orange-600 transition-colors bg-orange-100 rounded-full hover:bg-orange-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="p-1 rounded-full shadow-lg bg-gradient-to-br from-orange-400 to-orange-500"
            >
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
                <span className="text-xl font-bold text-orange-600">Memes</span>
                <span className="text-sm text-orange-500">
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
                onClick={() => document.getElementById("memeUpload")?.click()}
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
                        toast.error("File size should be less than 5MB");
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
                    if (memeTag.trim() && !memeTags.includes(memeTag.trim())) {
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
                          setMemeTags(memeTags.filter((_, i) => i !== index))
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

      {/* Meme list */}
      {memes?.map((meme) => (
        <MemeCard key={meme._id} meme={meme} />
      ))}
    </div>
  );
};

export default MemePage;
