import { motion } from "framer-motion";
import "./banner.css";

const WorkshopBanner = () => {
  return (
    <div className="relative bg-primary min-h-[80vh] flex items-start justify-center overflow-hidden">
      <motion.img
        src="/assets/workshopv2/fillers/pencil_boy.png.png"
        alt="happy-boy"
        className="absolute w-15 h-20 left-20 top-10 z-20"
        initial={{ opacity: 0, x: -50, rotate: -10 }}
        animate={{
          opacity: 1,
          x: 0,
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          opacity: { duration: 1 },
          x: { duration: 1 },
          rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
        whileHover={{ scale: 1.1, rotate: 10 }}
      />

      <motion.div className="absolute right-20 bottom-20 z-20">
        <motion.img
          src="/assets/workshopv2/fillers/SVG.png"
          alt="happy-boy"
          className="relative w-36 h-36"
          initial={{ opacity: 0, scale: 0.5, rotate: 180 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0,
          }}
          transition={{ duration: 1.5, ease: "backOut" }}
          whileHover={{
            scale: 1.1,
            rotate: 15,
            transition: { duration: 0.3 },
          }}
        />
      </motion.div>

      <div className="relative z-10 mt-20">
        <motion.div
          className="absolute inset-0 text-[12rem] font-extrabold font-sans text-white/10 blur-sm"
          initial={{ y: 10 }}
          animate={{
            y: [-15, 25, -15],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          WORKSHOPS
        </motion.div>

        <motion.h1
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [-20, 20, -20],
            backgroundPositionY: ["40%", "60%", "40%"],
            opacity: 1,
          }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            backgroundPositionY: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            },
            opacity: { duration: 1.5 },
          }}
          className="relative text-transparent text-[12rem] font-extrabold font-sans bg-[url('/assets/assesments/Exercise/exercise-02.jpg')] bg-clip-text bg-cover bg-center"
          style={{
            filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))",
            textShadow: "0 0 20px rgba(255,255,255,0.3)",
          }}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.3 },
          }}
        >
          WORKSHOPS
        </motion.h1>

        <motion.div
          className="absolute inset-0 text-[12rem] font-extrabold font-sans text-white/5 blur-2xl"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          WORKSHOPS
        </motion.div>
      </div>

      <div className="custom-shape-divider-bottom-1756203234">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
      <motion.div
        className="absolute top-1/2 left-10 w-4 h-4 border-2 border-white/30 rounded-full"
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      <motion.div
        className="absolute top-1/3 right-10 w-6 h-1 bg-white/20 rounded-full"
        animate={{
          scaleX: [1, 1.5, 1],
          opacity: [0.2, 0.8, 0.2],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

export default WorkshopBanner;
