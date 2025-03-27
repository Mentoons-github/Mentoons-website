import { ASSESSMENT_DATA } from "@/constant/constants";
import useInView from "@/hooks/useInView";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AssessmentCards = () => {
  const isMobile = window.innerWidth < 768;
  const { ref, isInView } = useInView(isMobile ? 0.1 : 0.3, false);

  const navigate = useNavigate();

  const getIcon = (key: string) => {
    switch (key) {
      case "Time":
        return <span className="text-red-500">🕒</span>;
      case "Reading Level":
        return <span className="text-blue-500">📚</span>;
      case "Age":
        return <span className="text-green-500">🎯</span>;
      default:
        return null;
    }
  };

  return (
    <motion.div
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 place-items-center"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
      }}
    >
      {ASSESSMENT_DATA.map((data, index) => (
        <motion.div
          className="h-[600px] w-full max-w-[400px] p-5 shadow-xl rounded-xl space-y-3 bg-white flex flex-col justify-between"
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.2 }}
          whileHover={{
            scale: 1.02,
            boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <motion.div
            className="rounded-xl overflow-hidden bg-yellow-300"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ background: data.color }}
          >
            <img
              src={data.thumbnail}
              alt="card-img"
              className="w-full h-52 md:h-56 object-cover"
            />
          </motion.div>
          <motion.h1 className="font-semibold text-xl lg:text-2xl tracking-[0.5px]">
            {data.name}
          </motion.h1>
          <motion.p className="text-sm lg:text-md tracking-[0.35px]">
            {data.desc}
          </motion.p>
          <ul className="font-inter space-y-2">
            {Object.entries(data.details).map(([key, value]) => (
              <motion.li
                key={key}
                className="flex items-center gap-2 text-sm lg:text-md"
              >
                {getIcon(key)}
                <h5 className="font-semibold">{key}:</h5>
                <span>{value}</span>
              </motion.li>
            ))}
          </ul>
          <motion.div className="flex flex-col md:flex-row justify-between items-center w-full p-3 space-y-3 md:space-y-0">
            <p className="text-sm">
              <span className="font-medium text-2xl md:text-3xl">
                ₹ {data.price}/
              </span>{" "}
              Report
            </p>
            <motion.button
              className="px-4 py-2 bg-[#EC9600] rounded-full font-extrabold text-white"
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 5px 15px rgba(255,153,31,0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                navigate(`/assesment-questions`, {
                  state: {
                    questionGallery: data.questionGallery,
                    assessment: data.name,
                  },
                })
              }
            >
              START TEST
            </motion.button>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AssessmentCards;
