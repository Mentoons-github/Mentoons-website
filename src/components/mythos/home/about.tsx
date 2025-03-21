import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import useInView from "@/hooks/useInView";

const AboutMythos = () => {
  const { ref, isInView } = useInView(0.3, false);

  return (
    <section
      ref={ref}
      className="p-6 md:p-16 flex flex-col md:flex-row justify-between items-start gap-8 md:gap-14 lg:gap-20 bg-[#1A1D3B] bg-[url('/assets/mythos/background/section/stars_background.png')] bg-center"
    >
      <div className="w-full md:w-1/2 lg:w-lg space-y-6 md:space-y-10">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-[#E39712] font-semibold text-2xl sm:text-3xl md:text-4xl tracking-wide font-montserrat w-3/4"
        >
          ABOUT MENTOONS MYTHOS
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
          }
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="font-mulish text-sm sm:text-base md:text-lg lg:text-[20px] text-white text-start text-justify w-[520px] max-w-full"
        >
          Mentoons Mythos isn’t just about reports; it’s a thriving community of
          individuals seeking purpose, clarity, and cosmic guidance. Whether
          you’re exploring astrology, psychology, or career growth, our groups
          help you connect with like-minded people who share your journey.
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
        }
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        className="w-full md:w-1/2 flex justify-center"
      >
        <div className="relative w-full pb-[56.25%] max-w-[100%] sm:max-w-[90%] md:max-w-full">
          <ReactPlayer
            url="https://res.cloudinary.com/dacwu8tri/video/upload/v1741857522/Mentoons_Mythos_2_psixmo.mp4"
            className="absolute inset-0"
            width="100%"
            height="100%"
            controls
            playing={isInView}
            config={{
              file: {
                attributes: {
                  controlsList: "nodownload",
                  disablePictureInPicture: true,
                },
              },
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default AboutMythos;
