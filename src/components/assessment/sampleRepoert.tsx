import useInView from "@/hooks/useInView";
import { motion } from "framer-motion";
import { useState } from "react";
import Report from "./sampleReport";

const SampleReport = () => {
  const { isInView, ref } = useInView(0.3, false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        ref={ref}
        className="w-full p-5 backdrop-blur-md flex flex-col md:flex-row justify-start items-center gap-5 md:gap-30 px-5 md:px-20 min-h-[100px] mt-20 text-center md:text-left"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          backgroundColor: "rgba(255, 153, 31, 0.4)",
          boxShadow: "0px 0px 30px 40px rgba(255, 153, 31, 0.4)",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, x: -80 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="font-medium text-lg md:text-[28px] text-[#0C0A09] max-w-full md:max-w-[450px]"
        >
          Check out the sample report you will receive after the assessment!
        </motion.h1>

        <motion.div
          className="flex flex-wrap justify-center lg:justify-start items-center w-full md:w-auto mt-4 md:mt-0 lg:ml-40"
          initial={{ opacity: 0, x: 80 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        >
          <motion.button
            className="px-6 py-3 bg-[#EC9600] text-white rounded-full roboto shadow-lg"
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 5px 15px rgba(255, 153, 31, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
          >
            SAMPLE REPORT
          </motion.button>
        </motion.div>
      </motion.div>

      {isModalOpen && <Report onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default SampleReport;
