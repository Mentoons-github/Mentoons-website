import { motion } from "framer-motion";
import useInView from "@/hooks/useInView";

const Heading = () => {
  const { isInView, ref } = useInView(0.3, false);
  const groups = [
    { color: "#FE8B7D", category: "Psychologists" },
    { color: "#FFB027", category: "Birthsigns" },
    { color: "#F73E3E", category: "Aries rising" },
    { color: "#88A6FF", category: "Career" },
    { color: "#5961EF", category: "Astrologers" },
    { color: "#FE8B7D", category: "Healers" },
    { color: "#FFB027", category: "Planets" },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="flex flex-col-reverse lg:flex-row justify-between items-start gap-5 w-full"
    >
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-3/4"
      >
        <h1 className="montserrat font-bold text-[32px] sm:text-[40px] tracking-wider text-[#1A1D3B]">
          GROUPS SUGGESTED FOR YOU
        </h1>
        <p className="mulish font-semibold text-lg sm:text-xl text-[#1A1D3B] w-full sm:w-lg text-wrap mt-4">
          Create groups and connect with like-minded people from your community!
        </p>
        <motion.div
          className="flex flex-wrap gap-3 sm:gap-5 mt-5"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          {groups.map((text, index) => (
            <motion.button
              key={index}
              className="w-fit px-3 py-2 sm:py-3 rounded-full text-md font-bold inter cursor-pointer"
              style={{ background: text.color }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              #{text.category}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="space-y-3 w-full lg:w-auto lg:mr-5 lg:text-left"
      >
        <h2 className="mulish text-xs sm:text-sm tracking-wider">
          FOR MEMBERS ONLY
        </h2>
        <h1 className="flex justify-start items-center gap-3 whitespace-nowrap">
          <img
            src="/assets/mythos/icons/star.png"
            alt="star-icon"
            className="h-3 w-3 sm:h-4 sm:w-4"
          />
          <span className="mulish text-sm sm:text-lg font-bold tracking-normal">
            EXPLORE MORE
          </span>
        </h1>
      </motion.div>
    </motion.div>
  );
};

export default Heading;
