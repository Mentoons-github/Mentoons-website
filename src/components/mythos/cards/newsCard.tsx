import { motion } from "framer-motion";
import useInView from "@/hooks/useInView";
import { News } from "@/types/mythos/interface";

const NewsCard = ({ news }: { news: News[] }) => {
  const { isInView } = useInView(0.3, false);
  return (
    <motion.div
      className="bg-[#6A8FFF] space-y-5 p-5 w-full lg:w-1/3 max-h-[550px] overflow-y-auto"
      initial={{ x: 50, opacity: 0 }}
      animate={isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {news.map((data, index) => (
        <div className="w-full lg:max-w-2xs mx-auto lg:mx-0 p-3" key={index}>
          <div className="flex justify-center items-center w-full font-jost font-semibold text-xs">
            <h1 className="bg-white whitespace-nowrap z-10 pr-3">
              {data.category}
            </h1>
            <div className="flex-grow border-t border-gray-900"></div>
            <span className="bg-white text-gray-600 whitespace-nowrap px-3">
              {data.date}
            </span>
            <div className="w-[30px] border-t border-gray-900"></div>
          </div>
          <h1 className="font-outfit font-semibold text-lg text-[#111111] mt-3">
            {data.news}
          </h1>
        </div>
      ))}
    </motion.div>
  );
};

export default NewsCard;
