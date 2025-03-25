import { motion } from "framer-motion";
import { MythosCardProps } from "../../../types";
import useInView from "@/hooks/useInView";

const MythosCards = ({
  data,
  index,
}: {
  data: MythosCardProps;
  index: number;
}) => {
  const { ref, isInView } = useInView(0.3, false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 * index }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="w-[99.5%] h-full md:h-[400px] lg:h-[550px] p-4 md:p-8 lg:p-14 flex flex-col items-center justify-between text-center bg-[#E39712]"
    >
      <div className="flex-1 flex items-center justify-center">
        <img
          src={data.img}
          className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 max-w-full max-h-full object-contain"
          alt={`Step ${index} icon`}
        />
      </div>
      <h1 className="font-montserrat font-semibold text-3xl md:text-4xl lg:text-5xl text-[#1A1D3B] my-4">
        STEP {index}
      </h1>
      <div className="flex-1 flex items-center justify-center">
        <p className="font-mulish font-semibold text-xl md:text-2xl lg:text-4xl leading-tight md:leading-[36px] lg:leading-[40px] text-white">
          {data.description}
        </p>
      </div>
    </motion.div>
  );
};

export default MythosCards;
