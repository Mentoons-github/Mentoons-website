import { CommonFAQ } from "@/types/faq";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownCircle, X } from "lucide-react";
import { useState } from "react";

const FAQCommon = ({
  FAQ,
  setShowFAQ,
  planNames,
}: {
  FAQ: CommonFAQ[];
  setShowFAQ: (val: boolean) => void;
  planNames?: string[];
}) => {
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState<number | null>(
    null,
  );
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => setShowFAQ(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
      >
        <div className="w-full max-w-3xl max-h-[85vh] rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-white to-orange-50 shadow-2xl overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Frequently Asked Questions
              </h1>
              <p className="text-orange-100 mt-3 text-sm md:text-base flex flex-wrap gap-2">
                {planNames &&
                  planNames.length > 0 &&
                  planNames.map((name) => (
                    <span
                      key={name}
                      className="px-3 py-1 rounded-xl bg-white/15 font-semibold"
                    >
                      {name}
                    </span>
                  ))}
              </p>
            </div>
            <button
              onClick={() => setShowFAQ(false)}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
              aria-label="Close FAQ"
            >
              <X className="w-6 h-6 text-white" strokeWidth={2.5} />
            </button>
          </div>

          <div className="overflow-y-auto p-6 space-y-3">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-orange-100"
              >
                <button
                  onClick={() =>
                    setCurrentVisibleIndex(currentVisibleIndex === i ? null : i)
                  }
                  className="w-full p-4 md:p-5 flex justify-between items-center text-left hover:bg-orange-50 transition-colors duration-200 group"
                  aria-expanded={currentVisibleIndex === i}
                >
                  <span className="text-base md:text-lg font-semibold text-gray-800 pr-4 group-hover:text-orange-600 transition-colors duration-200">
                    {item.q}
                  </span>
                  <motion.div
                    animate={{
                      rotate: currentVisibleIndex === i ? 180 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <ChevronDownCircle className="w-6 h-6 text-orange-500" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {currentVisibleIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 md:p-5 pt-0 md:pt-2 text-gray-600 leading-relaxed border-t border-orange-100">
                        {item.ans}
                        {item.link && (
                          <a
                            href={item.link}
                            className="text-blue-700 hover:underline block mt-2"
                          >
                            Click here to download
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default FAQCommon;
