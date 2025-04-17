import useInView from "@/hooks/useInView";
import { motion } from "framer-motion";
import { useState } from "react";
import { MdMessage } from "react-icons/md";

const FAQ = ({ data }: { data: object }) => {
  const { isInView, ref } = useInView(0.3, false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="h-auto px-4 sm:px-8 md:px-12 lg:px-20 py-8 sm:py-10 md:py-15"
    >
      <motion.h1
        initial={{ opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-start font-medium text-2xl sm:text-3xl md:text-4xl tracking-[-1px]"
      >
        Frequently Asked Questions
      </motion.h1>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 w-full mt-6 sm:mt-10">
        <div className="flex flex-col w-full lg:w-3/5 gap-4 sm:gap-5">
          {Object.entries(data).map(([question, answer], index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-full overflow-hidden border border-gray-400 rounded-lg bg-white shadow-md font-manrope"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-3 sm:p-4 bg-white font-extrabold text-[12px] sm:text-lg md:text-xl transition-all hover:bg-gray-100"
              >
                <span className="text-left pr-2">{question}</span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-xl font-bold flex-shrink-0"
                >
                  {openIndex === index ? "−" : "+"}
                </motion.span>
              </button>
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={
                  openIndex === index
                    ? { opacity: 1, height: "auto" }
                    : { opacity: 0, height: 0 }
                }
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="px-3 sm:px-4 pb-3 sm:pb-4 font-medium text-[11px] sm:text-lg md:text-[20px]"
              >
                {answer}
              </motion.p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col justify-center items-center gap-3 sm:gap-4 w-full lg:w-2/5 p-5 sm:p-8 bg-white rounded-xl shadow-lg h-auto lg:max-h-[400px] flex-shrink-0 lg:min-h-[400px] mt-6 lg:mt-0"
        >
          <MdMessage className="text-4xl sm:text-5xl text-black" />
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl sm:text-2xl font-semibold text-center text-black"
          >
            Have Doubts? We are here to help you!
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center text-black leading-relaxed text-sm sm:text-base"
          >
            Contact us for additional help regarding your assessment or
            purchase. Our team is ready to assist you!
          </motion.p>
          <motion.textarea
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            rows={4}
            className="w-full p-3 sm:p-4 border border-black rounded-3xl outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Ask Your Query here..."
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-yellow-400 py-2 sm:py-3 rounded-lg font-medium text-base sm:text-lg transition-all hover:bg-yellow-300 focus:ring-2 focus:ring-blue-300"
          >
            Submit
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FAQ;
