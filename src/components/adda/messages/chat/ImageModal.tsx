import { motion, AnimatePresence } from 'framer-motion';
import { BsDownload, BsX } from 'react-icons/bs';

interface ImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
  onDownload: (url: string, fileName: string) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose, onDownload }) => {
  return (
    <AnimatePresence>
      {imageUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-2xl max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageUrl}
              alt="Enlarged view"
              className="w-96 h-full object-contain rounded-lg"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => onDownload(imageUrl, "enlarged-image.jpg")}
                className="p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
              >
                <BsDownload size={20} />
              </button>
              <button
                onClick={onClose}
                className="p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
              >
                <BsX size={20} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;