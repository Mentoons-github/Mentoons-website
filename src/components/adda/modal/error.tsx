import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ErrorModalProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

const ErrorModal = ({ open, message, onClose }: ErrorModalProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="m-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            initial={{ scale: 0.9, y: -30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: -30, opacity: 0 }}
            transition={{ type: "spring", damping: 18, stiffness: 160 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <AlertTriangle className="h-7 w-7" />
              </span>
            </div>
            <h2 className="mb-2 text-center text-lg font-semibold text-stone-900">
              Oops!
            </h2>
            <p className="mb-6 text-center text-sm text-stone-600">{message}</p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-stone-900 px-6 py-2 text-sm font-medium text-white hover:bg-stone-800"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorModal;
