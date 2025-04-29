import MythosLoginModal from "@/components/common/modal/mythosLogin";
import useInView from "@/hooks/useInView";
import { motion } from "framer-motion";
import { useState } from "react";
import MythosButton from "./button";

const PersonalReport = () => {
  const { ref, isInView } = useInView(0.3, false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      ref={ref}
      className="relative flex flex-col-reverse items-center justify-between w-full h-auto gap-20 px-4 py-20 overflow-hidden md:flex-row md:px-20"
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
        className="relative z-10 flex justify-center w-full"
      >
        <img
          src="/assets/mythos/personalReport/Exploring virtual reality with vr headset.png"
          alt="Exploring VR with Headset"
          className="object-cover w-full h-auto max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
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
          className="mt-6 space-y-8 text-white font-mulish text-md sm:text-lg md:px-5"
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
