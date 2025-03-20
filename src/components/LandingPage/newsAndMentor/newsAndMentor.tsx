import FounderNote from "@/components/common/founderNote";
import useInView from "@/hooks/useInView";
import { motion } from "framer-motion";
import { FaTelegram } from "react-icons/fa6";

const NewsAndMentor = () => {
  const { ref: sectionRef, isInView } = useInView(0.3, false);

  return (
    <motion.section
      ref={sectionRef}
      className="w-full flex flex-col lg:flex-row justify-between lg:justify-start items-center gap-10 py-10 px-5 lg:px-0 bg-[#F2C6DE]"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      <motion.div
        className="flex justify-start items-start"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
        }
        transition={{ duration: 1 }}
      >
        <div className="lg:hidden">
          <FounderNote />
        </div>
        <div className="hidden lg:block px-10">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <FounderNote scroll={true} />
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        className="relative flex flex-col justify-center items-center gap-5 w-full lg:w-[750px] px-4 sm:px-8 lg:pr-10 space-y-4"
        initial={{ y: 100, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-center font-semibold text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight text-gray-800">
          Guidance for tomorrow, balance for today
        </h1>
        <div className="absolute top-0 sm:top-10 md:top-20 lg:top-0 left-0 w-16 sm:w-20 sm:h-20">
          <img
            src="/assets/home/newsAndMentor/folded newspaper.png"
            alt="newspaper"
            className="w-auto object-cover"
          />
        </div>
        <div className="absolute top-0 right-0 w-20 sm:w-32">
          <img
            src="/assets/home/newsAndMentor/Messaging with paper airplanes, envelope and speech bubble.png"
            alt="newspaper"
            className="w-auto object-cover"
          />
        </div>

        <div className="w-full max-w-md rounded-full bg-white shadow-lg flex items-center h-12 p-1">
          <input
            type="text"
            placeholder="Enter your email"
            className="outline-none flex-grow py-2 px-3 rounded-l-full text-sm md:text-base"
          />
          <button className="flex justify-center items-center gap-2 sm:gap-3 bg-[#EC9600] cursor-pointer py-2 px-4 sm:px-5 rounded-r-full text-white h-full text-sm md:text-base">
            <FaTelegram /> Subscribe
          </button>
        </div>

        <iframe
          src="https://mentoonsnews.com/"
          title="Mentoon News"
          width="100%"
          height="400"
          sandbox="allow-same-origin allow-scripts allow-popups"
          className="border-none rounded-xl shadow-xl pt-5"
        />
      </motion.div>
    </motion.section>
  );
};

export default NewsAndMentor;
