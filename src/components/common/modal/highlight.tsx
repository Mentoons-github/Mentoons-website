import { motion } from "framer-motion";

const Highlight = ({
  selectedPost,
  setPost,
}: {
  selectedPost: string;
  setPost: (val: string) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.55)] z-50"
      onClick={() => setPost("")}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-[90%] md:w-3/4 lg:w-1/2 max-w-3xl bg-white p-5 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setPost("")}
          className="absolute top-0 right-1 text-4xl font-bold text-gray-600 hover:text-black"
        >
          ×
        </button>
        <img
          src={selectedPost}
          alt="Highlighted Post"
          className="w-full h-auto object-cover rounded-lg"
        />
      </motion.div>
    </motion.div>
  );
};

export default Highlight;
