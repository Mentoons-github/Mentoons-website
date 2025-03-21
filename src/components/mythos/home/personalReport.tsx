import { motion } from "framer-motion";
import useInView from "@/hooks/useInView";
import MythosButton from "./button";
import { useState } from "react";
import MythosLoginModal from "@/components/common/modal/mythosLogin";

const PersonalReport = () => {
  const { ref, isInView } = useInView(0.3, false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      ref={ref}
      className="relative py-20 w-full h-auto flex flex-col-reverse md:flex-row justify-between items-center gap-20 px-4 md:px-20 overflow-hidden"
    >
      <img
        src="/assets/mythos/personalReport/h3-rev-png5.png.png"
        className="absolute -bottom-0 right-0 w-1/2 z-[-1]"
        alt="bg-icon"
      />
      <div className="absolute inset-0 bg-[#1A1D3B] z-[-2]"></div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full flex justify-center"
      >
        <img
          src="/assets/mythos/personalReport/Exploring virtual reality with vr headset.png"
          alt="Exploring VR with Headset"
          className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl h-auto object-cover"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full min-h-[400px] space-y-20 text-left"
      >
        <h1 className="font-montserrat font-semibold text-2xl md:text-3xl lg:text-4xl tracking-[2px] md:tracking-[2.5px] text-[#E39712] leading-tight">
          ABOUT MENTOONS PERSONOLOGY REPORT
        </h1>

        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white space-y-8 font-mulish text-md sm:text-lg mt-6 md:px-5"
        >
          {[
            "This includes psychology-based assessments.",
            "Get Psychological Report and Mythological Report.",
            "Purpose of life based on birth star.",
          ].map((text, index) => (
            <li className="flex items-center justify-start" key={index}>
              <span className="mr-2">⬤</span>
              {text}
            </li>
          ))}
        </motion.ul>

        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="font-mulish text-start text-[#E39712] font-bold tracking-widest text-xl sm:text-2xl w-auto sm:w-lg"
        >
          Take Our Assessment And Get Your Personology report
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center md:justify-start"
          onClick={() => setIsOpen(true)}
        >
          <MythosButton label="VIEW SAMPLE REPORT" />
        </motion.div>
      </motion.div>
      {isOpen && <MythosLoginModal set={setIsOpen} />}
    </section>
  );
};

export default PersonalReport;
