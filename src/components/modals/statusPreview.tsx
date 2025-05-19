import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaPaperPlane } from "react-icons/fa";
import { FiCheck } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";

interface MediaPreviewModalProps {
  isSuccess: boolean;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  file: File | null;
  onClose: () => void;
  onSubmit: (imageWithText: Blob | null, caption: string) => void;
}

const MediaPreviewModal = ({
  isSuccess,
  isLoading,
  setIsLoading,
  file,
  onClose,
  onSubmit,
}: MediaPreviewModalProps) => {
  const [caption, setCaption] = useState("");
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 50, y: 90 });
  const [isDragging, setIsDragging] = useState(false);
  const [textStyle, setTextStyle] = useState({
    fontSize: 24,
    color: "#ffffff",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: "4px 8px",
    borderRadius: "4px",
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      header.style.display = "none";
    }
    return () => {
      if (header) {
        header.style.display = "flex";
      }
    };
  }, []);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
      setIsVideo(file.type.startsWith("video/"));
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const handleSubmit = () => {
    setIsLoading(true);

    if (!isVideo && mediaUrl && caption) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            ctx.font = `${textStyle.fontSize}px Arial`;
            ctx.fillStyle = textStyle.backgroundColor;
            const xPos = (textPosition.x / 100) * img.width;
            const yPos = (textPosition.y / 100) * img.height;
            const textWidth = ctx.measureText(caption).width;
            const textHeight = textStyle.fontSize;
            ctx.fillRect(
              xPos - textWidth / 2 - 4,
              yPos - textHeight + 4,
              textWidth + 8,
              textHeight + 8
            );
            ctx.fillStyle = textStyle.color;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(caption, xPos, yPos);
            canvas.toBlob((blob) => {
              setTimeout(() => {
                setTimeout(() => {
                  onSubmit(blob, caption);
                }, 1000);
              }, 1500);
            });
          }
        }
      };
      img.src = mediaUrl;
    } else {
      setTimeout(() => {
        setTimeout(() => {
          onSubmit(null, caption);
        }, 1000);
      }, 1500);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!caption || isVideo) return;
    setIsDragging(true);
    if (imageContainerRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setTextPosition({ x, y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const boundedX = Math.max(0, Math.min(100, x));
    const boundedY = Math.max(0, Math.min(100, y));
    setTextPosition({ x: boundedX, y: boundedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!file || !mediaUrl) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black bg-opacity-75 pointer-events-auto"
      style={{
        isolation: "isolate",
        contain: "layout paint size",
        transformStyle: "preserve-3d",
        position: "fixed",
        zIndex: 2147483647,
      }}
    >
      <div
        ref={modalRef}
        className={`relative bg-gray-900 text-white rounded-lg overflow-hidden flex flex-col transition-all duration-300 
          ${
            isFullscreen
              ? "w-full h-full"
              : "w-11/12 max-w-3xl mx-auto md:h-auto md:max-h-[80vh]"
          }`}
      >
        <canvas ref={canvasRef} className="hidden" />
        <div className="flex items-center justify-between p-3 bg-gray-800">
          <h3 className="text-lg font-medium">Preview Status</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-300 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isFullscreen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5"
                  />
                )}
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-300 rounded-full hover:bg-gray-700 hover:text-white"
            >
              <IoCloseOutline className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div
          ref={imageContainerRef}
          className={`flex-grow overflow-hidden relative ${
            isFullscreen ? "flex items-center justify-center" : ""
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {isVideo ? (
            <video
              ref={videoRef}
              src={mediaUrl}
              className={`mx-auto ${
                isFullscreen
                  ? "max-h-full max-w-full"
                  : "max-h-[60vh] max-w-full"
              }`}
              controls
              autoPlay
              loop
            />
          ) : (
            <>
              <img
                src={mediaUrl}
                alt="Status preview"
                className={`mx-auto ${
                  isFullscreen
                    ? "max-h-full max-w-full object-contain"
                    : "max-h-[60vh] max-w-full object-contain"
                }`}
              />
              {caption && (
                <div
                  className="absolute transform -translate-x-1/2 cursor-move select-none"
                  style={{
                    left: `${textPosition.x}%`,
                    top: `${textPosition.y}%`,
                    fontSize: `${textStyle.fontSize}px`,
                    color: textStyle.color,
                    backgroundColor: textStyle.backgroundColor,
                    padding: textStyle.padding,
                    borderRadius: textStyle.borderRadius,
                  }}
                >
                  {caption}
                </div>
              )}
            </>
          )}
          {!isVideo && caption && (
            <div className="absolute px-2 py-1 text-sm text-white bg-gray-800 bg-opacity-75 rounded bottom-4 left-4">
              Click anywhere on the image to position your caption
            </div>
          )}
        </div>
        <div className="p-4 bg-gray-800">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption..."
                className="w-full px-4 py-2 text-gray-800 bg-white border-none rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                autoFocus
              />
              <button
                onClick={toggleEdit}
                className="p-3 text-white rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center px-4 py-2 text-sm text-gray-300 bg-gray-700 rounded-full">
                  {caption ? caption : "Add a caption..."}
                </div>
                <button
                  onClick={toggleEdit}
                  className="p-2 text-gray-300 rounded-full hover:bg-gray-700"
                >
                  <MdOutlineEdit className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!mediaUrl || isLoading}
                className="relative flex items-center gap-2 px-5 py-2 overflow-hidden text-white rounded-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    isSuccess ? (
                      <motion.div
                        key="success"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <span>Success</span>
                        <FiCheck className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="loading"
                        className="flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <span>Sharing</span>
                        <motion.div
                          className="w-5 h-5 border-2 border-white rounded-full border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      </motion.div>
                    )
                  ) : (
                    <motion.div
                      key="share"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <span>Share</span>
                      <FaPaperPlane />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          )}
          {!isVideo && caption && (
            <div className="flex flex-wrap gap-2 mt-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-300">Font Size:</label>
                <select
                  value={textStyle.fontSize}
                  onChange={(e) =>
                    setTextStyle({
                      ...textStyle,
                      fontSize: parseInt(e.target.value),
                    })
                  }
                  className="px-2 py-1 text-sm text-white bg-gray-700 rounded"
                >
                  <option value="16">Small</option>
                  <option value="24">Medium</option>
                  <option value="32">Large</option>
                  <option value="40">XL</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-300">Color:</label>
                <select
                  value={textStyle.color}
                  onChange={(e) =>
                    setTextStyle({ ...textStyle, color: e.target.value })
                  }
                  className="px-2 py-1 text-sm text-white bg-gray-700 rounded"
                >
                  <option value="#ffffff">White</option>
                  <option value="#000000">Black</option>
                  <option value="#ff5722">Orange</option>
                  <option value="#2196f3">Blue</option>
                  <option value="#4caf50">Green</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-300">Background:</label>
                <select
                  value={textStyle.backgroundColor}
                  onChange={(e) =>
                    setTextStyle({
                      ...textStyle,
                      backgroundColor: e.target.value,
                    })
                  }
                  className="px-2 py-1 text-sm text-white bg-gray-700 rounded"
                >
                  <option value="rgba(0,0,0,0.5)">
                    Semi-transparent black
                  </option>
                  <option value="rgba(0,0,0,0)">Transparent</option>
                  <option value="rgba(255,255,255,0.5)">
                    Semi-transparent white
                  </option>
                  <option value="#000000">Solid black</option>
                  <option value="#ffffff">Solid white</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black bg-opacity-70"
            >
              {isSuccess ? (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                  }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.2,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="flex items-center justify-center w-20 h-20 mb-4 text-white bg-green-500 rounded-full"
                  >
                    <FiCheck className="w-10 h-10" />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl font-medium text-white"
                  >
                    Status shared successfully!
                  </motion.p>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center">
                  <motion.div
                    className="w-16 h-16 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="w-full h-full border-4 border-orange-500 rounded-full border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-xl font-medium text-white">
                      Sharing your status
                    </p>
                    <motion.div
                      className="flex mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <motion.span
                        className="w-2 h-2 mx-1 bg-white rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          repeatType: "loop",
                          delay: 0,
                        }}
                      />
                      <motion.span
                        className="w-2 h-2 mx-1 bg-white rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          repeatType: "loop",
                          delay: 0.2,
                        }}
                      />
                      <motion.span
                        className="w-2 h-2 mx-1 bg-white rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          repeatType: "loop",
                          delay: 0.4,
                        }}
                      />
                    </motion.div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>,
    document.body
  );
};

export default MediaPreviewModal;
