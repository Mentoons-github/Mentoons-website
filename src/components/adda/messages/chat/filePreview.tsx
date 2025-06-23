import React from "react";
import { BsX, BsTrash, BsCheck } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

interface FilePreviewModalProps {
  selectedFile: File | null;
  selectedFileURL: string | null;
  onCancel: () => void;
  onSend: () => void;
}

const FilePreview: React.FC<FilePreviewModalProps> = ({
  selectedFile,
  selectedFileURL,
  onCancel,
  onSend,
}) => {
  if (!selectedFile || !selectedFileURL) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="flex justify-center items-center py-3 px-4 z-10 absolute bottom-20 left-2 mx-2 mb-2"
      >
        <div className="relative">
          {selectedFile.type.startsWith("image/") ? (
            <>
              <img
                src={selectedFileURL}
                alt="Preview"
                className="rounded-md mb-2 max-w-[200px] max-h-[200px] object-cover"
              />
              <button
                onClick={onCancel}
                className="absolute -top-4 -right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
              >
                <BsX size={15} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 bg-white p-2 rounded-md shadow">
              <p className="text-sm text-gray-700 truncate">
                {selectedFile.name}
              </p>
              <button
                onClick={onCancel}
                className="p-2 text-red-500 hover:bg-red-100 rounded-full"
              >
                <BsTrash size={16} />
              </button>
              <button
                onClick={onSend}
                className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
              >
                <BsCheck size={18} />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FilePreview;
