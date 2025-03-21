import { motion } from "framer-motion";
import useInView from "@/hooks/useInView";
import { MythosPlan } from "../../../types";
import MythosButton from "./button";

const PlanCards = ({ plan, index }: { plan: MythosPlan; index: number }) => {
  const { ref, isInView } = useInView(0.3, false);

  return (
    <motion.div
      ref={ref}
      className="w-auto md:w-[40%] h-auto rounded-3xl border border-white border-2 mx-auto text-center p-12 sm:p-5 lg:p-10 xl:p-12 flex flex-col"
      key={index}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h1 className="font-cormorant font-bold text-2xl lg:text-[34px] text-white">
        PSYMYTH
      </h1>
      <span className="font-montserrat text-[#9FE9FF] font-semibold text-[12px] sm:text-sm">
        {plan.duration} MONTH PLAN
      </span>
      <ul className="text-center font-montserrat font-medium text-[10px] sm:text-[11px] xl:text-sm space-y-6 py-5 text-white flex-grow">
        {plan.benefits.map((benefit, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: benefit }}></li>
        ))}
      </ul>
      <span className="font-bold font-cormorant text-5xl text-[#9FE9FF] mb-10">
        ₹{plan.price}
      </span>
      <div className="flex justify-center items-center">
        <MythosButton label="GET NOW" />
      </div>
    </motion.div>
  );
};

export default PlanCards;
