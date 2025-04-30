import useInView from "@/hooks/useInView";
import { motion } from "framer-motion";
import { BLOGS, NEWS } from "../../../constant/constants";
import Discover from "./learnMore";

const BlogsForYou = () => {
  const { isInView, ref } = useInView(0.3, false);

  return (
    <section
      ref={ref}
      className="px-4 lg:px-16 xl:px-24 py-10 bg-[#1A1D3B] overflow-hidden w-full"
    >
      <div className="flex flex-col items-center justify-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <motion.h1
          className="text-[#E39712] font-montserrat font-semibold text-2xl sm:text-3xl md:text-4xl max-w-xl leading-tight md:leading-10"
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

      <div className="flex flex-col justify-between gap-8 mt-10 lg:flex-row">
        <div
          ref={ref}
          className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:w-3/5"
        >
          {BLOGS.slice(0, 4).map((blog, index) => (
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
                className="object-cover w-full h-auto rounded-xl"
              />
              <span className="text-[#9FE9FF] font-semibold text-md sm:text-sm md:text-base font-montserrat">
                {blog.date}
              </span>
              <h1 className="mt-1 text-xl font-semibold text-white font-cormorant sm:text-lg md:text-xl lg:text-xl">
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
              className="w-full p-3 mx-auto lg:max-w-2xs lg:mx-0"
              key={index}
            >
              <div className="flex items-center justify-center w-full text-xs font-semibold font-jost">
                <h1 className="z-10 pr-3 bg-white whitespace-nowrap">
                  {data.category}
                </h1>
                <div className="flex-grow border-t border-gray-900"></div>
                <span className="px-3 text-gray-600 bg-white whitespace-nowrap">
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
      </div>
    </section>
  );
};

export default BlogsForYou;
