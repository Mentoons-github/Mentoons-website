import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MythosLoginModal = ({ set }: { set: (val: boolean) => void }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ scaleY: 0, opacity: 0.7 }}
      animate={{ scaleY: 1, opacity: 1 }}
      exit={{ scaleY: 0, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={() => set(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
        className="w-lg h-auto p-5 bg-[#FEE898] rounded-lg shadow-lg relative inter"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute text-2xl font-bold cursor-pointer top-2 right-2"
          onClick={() => set(false)}
        >
          ×
        </button>
        <h1 className="text-center font-semibold text-5xl text-[#2D2E2E]">
          Start Your Cosmic Journey With Us
        </h1>
        <p className="text-center mt-5 text-[#2D2E2E]">
          Sign Up with us to get a detailed report of your personalogy
          assessment and improve your life and career.
        </p>
        <div className="mt-5 space-y-2">
          <button
            className="w-full py-2 bg-[#1A1D3B] text-white inter font-medium text-lg rounded-md"
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
          </button>
          <button
            className="w-full py-2 text-lg font-medium bg-white border border-gray-800 rounded-md inter"
            onClick={() => navigate("/sign-in")}
          >
            Login
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MythosLoginModal;
