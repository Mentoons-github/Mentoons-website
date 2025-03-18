import useInView from "@/hooks/useInView";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaChevronDown, FaChevronRight, FaYoutube } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FAQ } from "../../constant/faq";
import AddaTV from "./addaTV";

const AddaSection = () => {
  const { ref: sectionRef, isInView } = useInView(0.3, false);

  const [isOpen, setIsOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex justify-start items-center gap-8 bg-transparent py-10 sm:py-10 md:py-15 xl:py-23 p-10 sm:p-8 md:p-10 lg:p-15 xl:p-20"
    >
      <div className="flex flex-col justify-start items-start gap-4 sm:gap-2">
        <motion.h1
          initial={{ opacity: 0, x: -80, scale: 0.8 }}
          animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", type: "spring" }}
          className="text-[40px] sm:text-[45px] md:text-[50px] lg:text-[64px] font-bold text-[#EC9600]"
        >
          Mentoons Adda
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
        >
          <div className="flex justify-center items-center gap-5">
            <h6 className="font-medium md:text-md lg:text-[27px]">
              /ˈʌdə,ˈadə/
            </h6>
            <div className="md:text-md lg:text-[23.4px] italic inter">
              <span>noun</span>
              <span className="pl-3">Indian</span>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          className="font-semibold text-start md:text-[17px] lg:text-[20px] xl:text-[23px] w-auto pt-5"
        >
          A place for parents and children to gather and have meaningful
          interactions and strike conversations.
        </motion.p>

        <div className="block md:hidden pt-10 flex justify-center items-center">
          <AddaTV />
        </div>

        <div className="w-full relative flex justify-center items-center md:justify-start sm:items-center gap-5 pt-10">
          <Link to="/adda">
            <motion.button
              initial={{ opacity: 0, rotate: -10, y: 20 }}
              animate={
                isInView ? { opacity: 1, rotate: 0, y: 0 } : { opacity: 0 }
              }
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.9 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 1, rotate: 0 }}
              className="font-akshar px-5 py-2 sm:py-2 lg:py-4 bg-[#EC9600] font-extrabold text-[10px] sm:text-[12px] md:text-[15px] lg:text-[20px] xl:text-[28px] text-white rounded-full sm:rounded-xl lg:rounded-full shadow-lg active:shadow-none"
            >
              VISIT MENTOONS ADDA
            </motion.button>
          </Link>
          <div className="relative">
            <motion.button
              initial={{ opacity: 0, rotate: -10, y: 20 }}
              animate={
                isInView ? { opacity: 1, rotate: 0, y: 0 } : { opacity: 0 }
              }
              transition={{ duration: 1, ease: "easeOut", delay: 1 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 1, rotate: 0 }}
              onClick={() => setIsOpen(!isOpen)}
              className="font-akshar flex items-center gap-2 px-5 py-2 sm:py-2 lg:py-4 bg-[#EC9600] font-extrabold text-[10px] sm:text-[12px] md:text-[15px] lg:text-[20px] xl:text-[28px] text-white rounded-full sm:rounded-xl lg:rounded-full shadow-lg active:shadow-none"
            >
              FAQ
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="sm:block hidden"
              >
                <FaChevronRight className="text-white text-[7px] sm:text-[18px] md:text-[20px] " />
              </motion.div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="sm:hidden block"
              >
                <FaChevronDown className="text-white text-[15px] sm:hidden block" />
              </motion.div>
            </motion.button>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute top-full -left-[75%] md:left-[30px] mt-3 w-48 sm:w-64 bg-white shadow-lg rounded-lg p-2 sm:p-4 text-black z-10"
              >
                <ul className="h-full w-full flex flex-col gap-2">
                  {FAQ.map((faq, index) => (
                    <li
                      key={index}
                      className="border p-2 sm:p-4 rounded cursor-pointer"
                    >
                      <div
                        className="flex justify-between items-center hover:text-[#EC9600] text-sm sm:text-base"
                        onClick={() => toggleFAQ(index)}
                      >
                        {faq.question}
                        <FaChevronDown
                          className={`transition-transform duration-300 ${
                            openIndex === index ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={
                          openIndex === index
                            ? { opacity: 1, height: "auto" }
                            : { opacity: 0, height: 0 }
                        }
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="mt-2 text-gray-700 text-sm sm:text-base">
                          {faq.answer}
                        </p>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={isInView ? { opacity: 1, scale: 1.05 } : { opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 1 }}
        className="p-2 grid place-items-center flex-0 xl:flex-1 hidden md:block"
      >
        <AddaTV />
        <a
          href="https://youtube.com/@mentoons3544?si=UEmsNRDP128trYDW"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 shadow-lg hover:bg-red-700 transition"
        >
          <FaYoutube className="w-5 h-5" />
          Follow Us on YouTube
        </a>
      </motion.div>
    </motion.section>
  );
};

export default AddaSection;
