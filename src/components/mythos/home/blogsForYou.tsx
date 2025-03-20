import Discover from "./learnMore";
import { NEWS, BLOGS } from "../../../constant/constants";
import { motion } from "framer-motion";
import useInView from "@/hooks/useInView";

const BlogsForYou = () => {
  const { isInView, ref } = useInView(0.3, false);

  return (
    <section
      ref={ref}
      className="px-4 sm:px-8 md:px-30 py-10 bg-[#1A1D3B] overflow-hidden"
    >
      <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-6 text-center md:text-left">
        <motion.h1
          className="text-[#E39712] montserrat font-semibold text-2xl sm:text-3xl md:text-4xl max-w-xl leading-tight md:leading-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Expand Your Knowledge With Our Exclusive Blog-Content
        </motion.h1>

        <motion.div
          className="shrink-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
          }
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
        >
          <Discover label="LEARN MORE" />
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between mt-10 gap-8">
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full lg:w-3/5"
        >
          {BLOGS.map((blog, index) => (
            <motion.div
              className="w-full max-w-[350px] mx-auto h-fit space-y-1"
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
              }
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={blog.img}
                alt="blog-post1"
                className="w-full h-auto object-cover rounded-xl"
              />
              <span className="text-[#9FE9FF] font-semibold text-md sm:text-sm md:text-base montserrat">
                {blog.date}
              </span>
              <h1 className="mt-1 cormorant font-semibold text-xl sm:text-lg md:text-xl lg:text-xl text-white">
                {blog.name}
              </h1>
              <Discover label="READ MORE" />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-[#6A8FFF] space-y-5 p-5 w-full lg:w-1/3 max-h-[550px] overflow-y-auto"
          initial={{ x: 50, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {NEWS.map((data, index) => (
            <div
              className="w-full lg:max-w-2xs mx-auto lg:mx-0 p-3"
              key={index}
            >
              <div className="flex justify-center items-center w-full jost font-semibold text-xs">
                <h1 className="bg-white whitespace-nowrap z-10 pr-3">
                  {data.category}
                </h1>
                <div className="flex-grow border-t border-gray-900"></div>
                <span className="bg-white text-gray-600 whitespace-nowrap px-3">
                  {data.date}
                </span>
                <div className="w-[30px] border-t border-gray-900"></div>
              </div>
              <h1 className="outfit font-semibold text-lg text-[#111111] mt-3">
                {data.news}
              </h1>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogsForYou;
