import { motion } from "framer-motion";
import Discover from "@/components/mythos/home/learnMore";
import useInView from "@/hooks/useInView";

const HelperList = ({ data, label }: { data: object; label: string }) => {
  const { ref, isInView } = useInView(0.3, false);

  return (
    <section
      ref={ref}
      className="relative flex flex-col justify-start items-start gap-2 md:gap-5 px-5 sm:px-10 md:px-20 py-20 w-full bg-[#1A1D3B] bg-[url('/public/background/mythos/section/stars_background.png')] bg-center overflow-hidden"
    >
      {label === "HOW WE HELP YOU" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute bottom-0 -right-0 w-[43%] hidden xl:block"
        >
          <img
            src="/assets/mythos/background/Frame.png"
            alt="mars-image"
            className="w-full object-cover"
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute top-5 -right-60 -translate-x-1/2 sm:-translate-x-1/3 md:-translate-x-1/5 w-[43%]"
        >
          <img
            src="/assets/mythos/planets/mars.png"
            alt="mars-image"
            className="w-full object-cover opacity-50"
          />
        </motion.div>
      )}

      <motion.h1
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="montserrat font-semibold text-2xl sm:text-4xl tracking-[2.5px] text-[#E39712]"
      >
        {label}
      </motion.h1>

      <ul className="flex flex-col justify-center items-center gap-3 pt-5 sm:pt-10 px-0 md:px-2 lg:px-4">
        {Object.entries(data).map(([key, value], index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="group flex flex-row justify-between items-center gap-5 fredoka w-full max-w-4xl p-5 rounded-lg"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 montserrat flex items-center justify-center px-4 py-2 rounded-md text-center text-2xl md:text-3xl lg:text-[42px] font-medium text-[#44464B]">
              <span className="text-[#9FE9FF]">0{index + 1}</span>
            </div>
            <div className="text-left w-full text-white">
              <p className="leading-6 text-base md:text-[14px] lg:text-[16px] xl:text-[19px] pt-4 w-full md:w-[500px] lg:w-[600px] mulish">
                <span className="font-extrabold">{key}</span>:{" "}
                <span className="font-normal">{value}</span>
              </p>
            </div>
          </motion.li>
        ))}
      </ul>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-10"
      >
        <Discover label="LEARN MORE" />
      </motion.div>
    </section>
  );
};

export default HelperList;
