import { motion } from "framer-motion";
import ProblemCard from "./problemCard";
import useInView from "@/hooks/useInView";

const ProblemFaced = () => {
  const { ref, isInView } = useInView(0.3, false);

  return (
    <section ref={ref} className="py-10 px-4 md:px-20 bg-[#E39712]">
      <motion.h1
        className="text-[#1A1D3B] font-bold text-3xl sm:text-4xl md:text-[36px] montserrat mb-6 tracking-[2.5px] montserrat"
        initial={{ opacity: 0, y: -50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        THE PROBLEMS FACED BY PEOPLE
      </motion.h1>
      <motion.div
        className="w-full flex justify-between items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
        }
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <ProblemCard />
      </motion.div>
    </section>
  );
};

export default ProblemFaced;
