import { ChevronDownCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

type AccordionSectionProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
};

const AccordionSection = ({
  title,
  isOpen,
  onToggle,
  children,
}: AccordionSectionProps) => {
  return (
    <div className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="flex items-center justify-between w-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 px-6 py-5 text-lg font-semibold text-white"
      >
        {title}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronDownCircle className="w-6 h-6" />
        </motion.span>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full overflow-hidden bg-white border-x border-b border-gray-200"
          >
            <div className="p-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccordionSection;
