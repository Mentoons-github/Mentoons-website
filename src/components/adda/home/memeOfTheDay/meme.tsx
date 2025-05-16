import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Meme = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center w-full p-4 bg-white border border-gray-100 shadow-lg rounded-xl dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="flex items-center justify-between w-full mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.2, rotate: 10 }}
            className="relative"
          >
            <img
              src="/assets/adda/sidebar/e62353b3daac244b2443ebe94d0d8343.png"
              alt="emoji"
              className="w-7 h-7"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute w-3 h-3 border border-white rounded-full -top-1 -right-1 bg-mt-yellow"
            />
          </motion.div>
          <h1 className="font-semibold text-md text-men-blue dark:text-white figtree whitespace-nowrap">
            Mentoons Meme
          </h1>
        </div>

        <motion.span
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-mt-teal/20 text-mt-teal"
        >
          <Award size={12} />
          Fresh
        </motion.span>
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative w-full mb-3 overflow-hidden rounded-xl group"
        onClick={() => navigate("/adda/meme")}
      >
        <img
          src="/assets/adda/sidebar/WhatsApp Image 2025-02-17 at 15.56.48_ee80d5fb.jpg"
          alt="meme"
          className="object-cover w-full h-auto transition-all rounded-xl"
        />

        <div className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-br from-mt-purple/20 via-transparent to-mt-yellow/20 group-hover:opacity-100 rounded-xl" />
      </motion.div>
      <motion.div
        whileHover={{ y: -2 }}
        className="px-2 py-1 text-xs font-medium rounded-full text-mt-orange dark:text-mt-yellow bg-mt-orange/10 dark:bg-mt-yellow/20"
      >
        #MemetoonsTuesday
      </motion.div>
    </motion.div>
  );
};

export default Meme;
