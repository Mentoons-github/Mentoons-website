import { useState } from "react";
import { motion } from "framer-motion";
import { PRODUCTS_BENEFITS } from "@/constant/products";
import useInView from "@/hooks/useInView";

const ProductsBenefits = () => {
  const { isInView, ref } = useInView(0.3, false);
  const [active, setActive] = useState<string[] | null>(
    Object.values(PRODUCTS_BENEFITS)[0] || null
  );

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="h-fit flex flex-col items-center justify-center px-5"
    >
      <div className="bg-white w-full">
        <div className="py-7 px-4 sm:px-10 rounded-lg">
          <div className="flex flex-wrap justify-around items-center gap-4">
            {Object.entries(PRODUCTS_BENEFITS).map(([key, values], index) => (
              <motion.button
                key={index}
                whileHover={{ y: -3, boxShadow: "1px 4px 1px gray" }}
                whileTap={{ scale: 0.97, boxShadow: "none" }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setActive(values)}
                className="w-full sm:w-2/5 md:w-1/3 lg:w-1/4 h-12 sm:h-16 text-xs sm:text-sm md:text-[14px] lg:text-md xl:text-xl flex items-center justify-center rounded-full border border-black border-2 font-bold text-base transition-all montserrat text-[#0C0A09] whitespace-nowrap px-4"
                style={{
                  backgroundColor: active === values ? "#FCE83E" : "#D9D9D9",
                }}
              >
                {key.replace(/_/g, " ")}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center w-full my-2 sm:my-5">
          <ul className="w-full sm:w-4/5 md:w-2/3 min-h-[200px] space-y-2 md:space-y-6 sm:space-y-10 p-3 sm:p-5 poppins">
            {active &&
              active.map((data, index) => (
                <motion.li
                  key={data}
                  className="flex items-center gap-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                >
                  <motion.div
                    className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-black flex justify-center items-center sm:text-lg md:text-2xl font-semibold p-5"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {index + 1}
                  </motion.div>
                  <motion.span
                    className="text-[15px] sm:text-xl md:text-lg lg:text-xl xl:text-3xl font-medium"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    {data}
                  </motion.span>
                </motion.li>
              ))}
          </ul>
        </div>
      </div>
    </motion.section>
  );
};

export default ProductsBenefits;
