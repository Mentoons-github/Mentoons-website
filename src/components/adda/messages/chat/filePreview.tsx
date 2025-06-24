import React from "react";
import { BsFileEarmarkText, BsX } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

interface FilePreviewModalProps {
  selectedFile: File | null;
  selectedFileURL: string | null;
  isUpload: boolean;
  onCancel: () => void;
  onSend: () => void;
}

const FilePreview: React.FC<FilePreviewModalProps> = ({
  selectedFile,
  selectedFileURL,
  onCancel,
  isUpload,
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
        <div className="relative bg-white rounded-lg p-3 shadow-md border border-gray-200">

          {isUpload ? (
            <div className="flex flex-col items-center justify-center w-[200px] h-[200px]">
              <div className="loader mb-4 border-4 border-blue-500 border-dashed rounded-full w-12 h-12 animate-spin"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : selectedFile.type.startsWith("image/") ? (
            <img
              src={selectedFileURL}
              alt="Preview"
              className="rounded-md max-w-[200px] max-h-[200px] object-cover"
            />
          ) : selectedFile.type.startsWith("video/") ? (
            <video
              src={selectedFileURL}
              controls
              className="rounded-md max-w-[200px] max-h-[200px] object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-[200px] h-[200px] p-4">
              <div className="bg-blue-100 p-4 rounded-full mb-3">
                <BsFileEarmarkText size={40} className="text-blue-500" />
              </div>
              <p className="text-sm text-center text-gray-800 truncate w-[180px]">
                {selectedFile.name}
              </p>
            </div>
          )}

          <button
            onClick={onCancel}
            className="absolute -top-3 -right-3 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
          >
            <BsX size={15} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FilePreview;
