import { InvetionTypes } from "@/constant/games/InventorSlides";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = [
  { border: "#0071c2", bg: "#e1f2fc", secBg: "#54acdc", text: "#e05706" },
  { border: "#f2332f", bg: "#fefccc", secBg: "#fec818", text: "#00acbd" },
  { border: "#00a357", bg: "#ebf5db", secBg: "#5fa31f", text: "#e70000" },
];

const shuffleArray = (arr: InvetionTypes[]) =>
  [...arr].sort(() => Math.random() - 0.5);

const InventorsSlide = ({
  slides,
  onNext,
  shouldShuffle,
}: {
  slides: InvetionTypes[];
  onNext: () => void;
  shouldShuffle: boolean;
}) => {
  const [shuffledSlides, setShuffledSlides] = useState<InvetionTypes[]>(slides);

  useEffect(() => {
    setShuffledSlides(slides);
  }, [slides]);

  useEffect(() => {
    if (shouldShuffle) {
      setShuffledSlides(shuffleArray(slides));
    }
  }, [shouldShuffle, slides]);

  if (!slides.length) return null;

  return (
    <div className="text-center md:space-y-8 lg:px-4">
      <div
        className={`grid gap-1 md:gap-2 lg:gap-6 ${
          slides.length === 8 ? " grid-cols-3 md:grid-cols-4" : "grid-cols-3"
        }`}
      >
        <AnimatePresence>
          {shuffledSlides.map((item, id) => {
            const color = COLORS[id % COLORS.length];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5 }}
                style={{
                  borderColor: color.border,
                  backgroundColor: color.bg,
                  // backgroundColor: color.secBg,
                }}
                className=" 
                 border-2 md:border-[3px] lg:border-[5px] rounded-lg p-1 lg:p-2 shadow-2xl 
                 backdrop-blur-md cursor-pointer transform hover:scale-105 
                 transition-all duration-300"
              >
                <div className="flex flex-col justify-between items-center h-full space-y-2 rounded-xl p-1 md:p-3">
                  <div
                    style={{ borderColor: color.secBg }}
                    className="w-20 h-20 lg:w-32 lg:h-32 rounded-full overflow-hidden border-2 md:border-[6px] border-white/30 shadow-lg"
                  >
                    <img
                      src={item.inventorImg}
                      alt={item.inventor}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3
                    className="text-xs md:text-sm lg:text-lg font-bold md:font-extrabold text-gray-800 tracking-wide"
                    style={{ color: color.text }}
                  >
                    {item.inventor}
                  </h3>

                  <div className="flex flex-col items-center justify-center">
                    <div className="rounded-xl border-2 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 md:border-[4px] border-[#ae4c07] shadow-md ">
                      <img
                        src={item.inventionImg}
                        alt={item.invention}
                        className=" w-full h-full rounded-lg"
                      />
                    </div>

                    <p className="text-xs font-semibold mt-1 text-gray-700">
                      {item.invention}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ✅ NEXT BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="mt-6 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-cyan-500 hover:to-teal-500 
                   text-white px-10 py-3 rounded-full font-bold shadow-lg transition-all duration-300"
      >
        Next
      </motion.button>
    </div>
  );
};

export default InventorsSlide;
