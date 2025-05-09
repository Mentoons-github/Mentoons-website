import { useEffect, useRef, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { FaPaperPlane } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";

interface MediaPreviewModalProps {
  file: File | null;
  onClose: () => void;
  onSubmit: (imageWithText: Blob | null, caption: string) => void;
}

const MediaPreviewModal = ({
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
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const handleSubmit = () => {
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
              onSubmit(blob, caption);
            });
          }
        }
      };
      img.src = mediaUrl;
    } else {
      onSubmit(null, caption);
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

    // Constrain within bounds
    const boundedX = Math.max(0, Math.min(100, x));
    const boundedY = Math.max(0, Math.min(100, y));

    setTextPosition({ x: boundedX, y: boundedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!file || !mediaUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
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
            <div className="absolute bottom-4 left-4 text-sm text-white bg-gray-800 bg-opacity-75 rounded px-2 py-1">
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
                disabled={!mediaUrl}
                className="flex items-center gap-2 px-5 py-2 text-white rounded-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Share</span>
                <FaPaperPlane />
              </button>
            </div>
          )}

          {!isVideo && caption && (
            <div className="mt-3 flex flex-wrap gap-2">
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
                  className="bg-gray-700 text-white text-sm rounded px-2 py-1"
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
                  className="bg-gray-700 text-white text-sm rounded px-2 py-1"
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
                  className="bg-gray-700 text-white text-sm rounded px-2 py-1"
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
      </div>
    </div>
  );
};

export default MediaPreviewModal;
