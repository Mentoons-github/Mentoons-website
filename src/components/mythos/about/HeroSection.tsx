import { motion } from "framer-motion";
import ReactPlayer from "react-player";

const HeroSection = () => {
  return (
    <div className="bg-[#1A1D3B] bg-[url('/assets/mythos/background/section/stars_background.png')] bg-center p-4 md:p-6 pb-12 md:pb-24">
      <motion.div 
        className="w-full md:w-[80%] lg:w-[60%] mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-[#E39712] text-center py-6 md:py-10"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          ABOUT MENTOONS MYTHOS
        </motion.h1>
        <motion.p 
          className="pb-8 text-lg tracking-wide text-center text-white md:pb-12 sm:text-xl md:text-2xl md:tracking-widest"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Mentoons Mythos isn't just about reports; it's a thriving community of
          individuals seeking purpose, clarity, and cosmic guidance. Whether
          you're exploring astrology, psychology, or career growth, our groups
          help you connect with like-minded people who share your journey.
        </motion.p>
      </motion.div>
      <motion.div 
        className="relative w-[95%] sm:w-[90%] md:w-[80%] mx-auto h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] pb-12 md:pb-24"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <ReactPlayer
          url="https://res.cloudinary.com/dacwu8tri/video/upload/v1741857522/Mentoons_Mythos_2_psixmo.mp4"
          className="absolute inset-0"
          width="100%"
          height="100%"
          controls
          config={{
            file: {
              attributes: {
                controlsList: "nodownload",
                disablePictureInPicture: true,
              },
            },
          }}
        />
      </motion.div>
    </div>
  );
};

export default HeroSection;
