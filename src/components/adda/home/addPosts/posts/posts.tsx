import { useState } from "react";
import { BiComment } from "react-icons/bi";
import Likes from "../likes/likes";
import { FaRegBookmark } from "react-icons/fa6";
import Share from "../share/share";
import { motion } from "framer-motion";
import Highlight from "@/components/common/modal/highlight";

const Posts = () => {
  const [showComments, setShowComments] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, text: "Great post!" },
    { id: 2, text: "Very informative" },
    { id: 3, text: "Nice content!" },
  ]);
  const [newComment, setNewComment] = useState("");

  const postDetails = {
    title: "Hardik's Post",
    description:
      "Showing anger, frustration, insecurity in situations does not have good impression on the child. Parents should think before they react to any situation specially in front of their children learn from there behavior and so parents have to be good role models for them.",
    postUrl: "https://example.com/posts/123",
    imageUrl: "/assets/adda/post/8.jpg",
    author: "Hardik",
    role: "Teacher at Divim Technology",
    timestamp: "25 Nov at 12:24 PM",
    likes: 25,
    comments: comments.length,
    saves: 5,
  };

  const handleCommentSubmit = () => {
    if (newComment.trim() === "") return;
    setComments([...comments, { id: comments.length + 1, text: newComment }]);
    setNewComment("");
  };

  const charLimit = 100;

  return (
    <>
      <div className="flex flex-col justify-start items-center gap-5 p-5 shadow-xl rounded-xl w-full min-h-fit">
        <div className="flex justify-start items-center gap-3 w-full">
          <div className="w-14 h-14 rounded-full overflow-hidden">
            <img
              src="/assets/adda/profilePictures/pexels-stefanstefancik-91227.jpg"
              alt="user-profile-picture"
              className="h-full w-full object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col figtree">
            <span className="Futura Std">Hardik</span>
            <span className="figtree text-sm text-[#807E7E]">
              Teacher at Divim Technology
            </span>
            <span className="figtree text-[12px] text-[#807E7E]">
              25 Nov at 12:24 PM
            </span>
          </div>
        </div>

        <p className="figtree text-[#3E3E59] text-base w-full break-words">
          {isExpanded
            ? postDetails.description
            : postDetails.description.slice(0, charLimit) +
              (postDetails.description.length > charLimit ? "..." : "")}
          {postDetails.description.length > charLimit && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-500 ml-2"
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          )}
        </p>

        <div className="w-full">
          <img
            src={postDetails.imageUrl}
            alt="posts"
            className="w-full h-auto object-cover rounded-lg"
            onClick={() => setSelectedPost(postDetails.imageUrl)}
          />
        </div>

        <div className="flex justify-between items-center px-3 w-full">
          <div className="flex justify-start items-center gap-3 sm:gap-4">
            <Likes />
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="rounded-full w-8 sm:w-12 sm:h-12 p-2 border border-gray-400 flex justify-center items-center"
                onClick={() => setShowComments(!showComments)}
              >
                <BiComment className="w-4 sm:w-6 sm:h-6 text-yellow-500" />
              </motion.button>
              <span className="text-[#605F5F] text-sm sm:text-base figtree">
                {comments.length}
              </span>
            </div>
            <Share postDetails={postDetails} />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="rounded-full sm:w-8 sm:w-10 sm:h-10 p-2 flex justify-center items-center">
              <FaRegBookmark className="w-5 sm:w-6 sm:h-6 text-[#D56A11]" />
            </button>
            <span className="text-[#605F5F] text-sm sm:text-base figtree">
              5
            </span>
          </div>
        </div>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full bg-gray-100 p-4 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-gray-700">Comments</h3>
            <div className="flex flex-col gap-3 w-full max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-2">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-md border border-gray-200 w-full"
                  >
                    <img
                      src="/assets/adda/profilePictures/pexels-stefanstefancik-91227.jpg"
                      alt="profile-picture"
                      className="w-10 h-10 rounded-full object-cover border border-gray-300"
                    />
                    <div className="flex flex-col bg-gray-100 p-3 rounded-md flex-1 overflow-hidden w-full">
                      <span className="font-semibold text-gray-800">Sam</span>
                      <p className="text-gray-600 break-words w-full max-w-full">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No comments yet.</p>
              )}
            </div>
            <div className="w-full pt-3 flex items-center gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 p-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Write a comment..."
              />
              <button
                onClick={handleCommentSubmit}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </div>
      {selectedPost && (
        <Highlight selectedPost={selectedPost} setPost={setSelectedPost} />
      )}
    </>
  );
};

export default Posts;
