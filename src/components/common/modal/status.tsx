import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaPause,
  FaPlay,
  FaSpinner,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { StatusInterface } from "../../../types";

const Status = ({
  status,
  setStatus,
  onDelete,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  totalStatuses = 1,
  currentIndex = 0,
  isUserChange = false, // New prop to indicate user change
}: {
  status: StatusInterface;
  setStatus: () => void;
  onDelete?: (statusId: string) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  totalStatuses?: number;
  currentIndex?: number;
  isUserChange?: boolean; // New prop
}) => {
  const isVideo = (media: string) => /\.(mp4|webm|ogg|mov)$/i.test(media);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showViewers, setShowViewers] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<
    "left" | "right" | "none"
  >("none");
  const progressInterval = 10;
  const progressStep = 100 / (progressInterval * 20);

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
    setProgress(0);
    setIsLoading(true);
    setIsPaused(true);
  }, [status._id]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!showViewers && !isPaused && !isLoading) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            if (hasNext && onNext) {
              setTimeout(() => onNext(), 300);
              return 0;
            } else {
              setTimeout(() => setStatus(), 300);
              return 100;
            }
          }
          return prev + progressStep;
        });
      }, 50);

      if (isVideo(status.content) && videoRef.current) {
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error);
        });
      }
    } else {
      if (isVideo(status.content) && videoRef.current) {
        videoRef.current.pause();
      }
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [
    setStatus,
    status.content,
    showViewers,
    isPaused,
    isLoading,
    hasNext,
    onNext,
    progressStep,
  ]);

  const handleDelete = async () => {
    if (deleteConfirm) {
      if (onDelete && status._id) {
        setIsDeleting(true);
        try {
          await onDelete(status._id);
          setStatus();
        } catch (error) {
          console.error("Error deleting status:", error);
          setIsDeleting(false);
        }
      }
    } else {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000);
    }
  };

  const togglePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPaused(!isPaused);
  };

  const toggleViewers = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowViewers(!showViewers);
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showViewers) {
      setShowViewers(false);
    }
  };

  const handleLeftSideClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasPrevious && onPrevious) {
      setTransitionDirection("left");
      onPrevious();
    }
  };

  const handleRightSideClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasNext && onNext) {
      setTransitionDirection("right");
      onNext();
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setIsPaused(false);
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
    setIsPaused(false);
  };

  const formattedTime = status.createdAt
    ? formatDistanceToNow(new Date(status.createdAt), { addSuffix: true })
    : "2h ago";

  const displayViewers = Array.isArray(status.viewers) ? status.viewers : [];

  const contentVariants = {
    sameUserInitial: {
      opacity: 0,
      scale:
        transitionDirection === "right"
          ? 0.9
          : transitionDirection === "left"
          ? 0.9
          : 1,
    },
    sameUserAnimate: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    sameUserExit: {
      opacity: 0,
      scale:
        transitionDirection === "right"
          ? 0.9
          : transitionDirection === "left"
          ? 0.9
          : 1,
      transition: { duration: 0.2 },
    },

    differentUserInitial: {
      opacity: 0,
      x:
        transitionDirection === "right"
          ? "100%"
          : transitionDirection === "left"
          ? "-100%"
          : 0,
    },
    differentUserAnimate: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        bounce: 0.2,
      },
    },
    differentUserExit: {
      opacity: 0,
      x:
        transitionDirection === "right"
          ? "-100%"
          : transitionDirection === "left"
          ? "100%"
          : 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 flex items-center justify-center bg-black z-[10]"
      onClick={setStatus}
    >
      <motion.div
        initial={
          isUserChange
            ? contentVariants.differentUserInitial
            : contentVariants.sameUserInitial
        }
        animate={
          isUserChange
            ? contentVariants.differentUserAnimate
            : contentVariants.sameUserAnimate
        }
        exit={
          isUserChange
            ? contentVariants.differentUserExit
            : contentVariants.sameUserExit
        }
        className="relative w-full h-full mx-auto md:w-[400px] md:h-[85vh] lg:h-[90vh] bg-black flex flex-col max-w-screen-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bars */}
        <div className="absolute top-0 left-0 right-0 z-30 flex w-full gap-1 px-2 pt-2">
          {totalStatuses > 0 && (
            <div className="flex w-full gap-1">
              {Array.from({ length: totalStatuses }).map((_, idx) => (
                <div
                  key={`status-${idx}`}
                  className="flex-1 h-1 overflow-hidden bg-gray-500 bg-opacity-50 rounded-full"
                >
                  {idx === currentIndex ? (
                    <motion.div
                      className="h-full bg-white"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "linear", duration: 0.1 }}
                    />
                  ) : idx < currentIndex ? (
                    <div className="w-full h-full bg-white" />
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between w-full p-4 bg-gradient-to-b from-black/70 to-transparent">
          <div className="flex items-center w-full">
            <div className="flex items-center flex-shrink-0 gap-2 mr-2">
              <motion.img
                initial={{ scale: isUserChange ? 0.5 : 1 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                src={
                  typeof status.user === "object" && status.user !== null
                    ? status.user.picture || "/default-avatar.png"
                    : "/default-avatar.png"
                }
                alt={
                  typeof status.user === "object" && status.user !== null
                    ? status.user.name
                    : "Unknown User"
                }
                className="flex-shrink-0 object-cover w-8 h-8 border-2 border-pink-500 rounded-full"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <motion.p
                initial={{
                  y: isUserChange ? 10 : 0,
                  opacity: isUserChange ? 0 : 1,
                }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-sm font-medium text-white break-words"
              >
                {typeof status.user === "object" && status.user !== null
                  ? status.user.name
                  : "Unknown User"}
                {status.isOwner &&
                  typeof status.user === "object" &&
                  status.user !== null && <span className="ml-1">(You)</span>}
              </motion.p>
              <motion.span
                initial={{
                  y: isUserChange ? 10 : 0,
                  opacity: isUserChange ? 0 : 1,
                }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.1,
                }}
                className="text-xs text-gray-300"
              >
                {formattedTime}
              </motion.span>
            </div>
          </div>
          <div className="flex items-center flex-shrink-0 gap-4 ml-2">
            {status.isOwner && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={`px-2 py-1 text-white rounded-full ${
                  deleteConfirm ? "bg-red-500" : "bg-transparent"
                }`}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <FaSpinner className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <FaTrash
                    className={`w-4 h-4 transition ${
                      deleteConfirm
                        ? "text-white"
                        : "text-gray-300 hover:text-red-500"
                    }`}
                  />
                )}
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="text-white"
              onClick={togglePause}
              disabled={isLoading}
            >
              {isPaused || showViewers ? (
                <FaPlay className="w-5 h-5 transition cursor-pointer hover:text-gray-300" />
              ) : (
                <FaPause className="w-5 h-5 transition cursor-pointer hover:text-gray-300" />
              )}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="text-white"
              onClick={setStatus}
            >
              <FaTimes className="w-5 h-5 transition cursor-pointer hover:text-gray-300" />
            </motion.button>
          </div>
        </div>

        <div className="absolute inset-0 z-10 flex">
          {hasPrevious && (
            <div
              className="flex items-center justify-start w-1/3 h-full px-4 cursor-pointer"
              onClick={handleLeftSideClick}
            >
              <div className="p-2 rounded-full bg-black/30 opacity-70 hover:opacity-100">
                <FaChevronLeft className="w-5 h-5 text-white" />
              </div>
            </div>
          )}
          <div
            className={`${
              hasPrevious && hasNext
                ? "w-1/3"
                : hasNext || hasPrevious
                ? "w-2/3"
                : "w-full"
            } h-full`}
            onClick={handleContentClick}
          />
          {hasNext && (
            <div
              className="flex items-center justify-end w-1/3 h-full px-4 cursor-pointer"
              onClick={handleRightSideClick}
            >
              <div className="p-2 rounded-full bg-black/30 opacity-70 hover:opacity-100">
                <FaChevronRight className="w-5 h-5 text-white" />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center w-full h-full z-5">
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-70">
              <FaSpinner className="w-10 h-10 text-white animate-spin" />
            </div>
          )}
          {isVideo(status.content) ? (
            <video
              ref={videoRef}
              src={status.content}
              autoPlay={false}
              playsInline
              className="object-contain w-full h-full"
              onLoadedData={handleVideoLoad}
            />
          ) : (
            <img
              src={status.content}
              alt="status"
              className="object-contain w-full h-full"
              onLoad={handleImageLoad}
            />
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
          {status.isOwner && (
            <div className="flex justify-between mb-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-3 py-1 text-white bg-white rounded-full bg-opacity-20"
                onClick={toggleViewers}
              >
                <FaEye className="w-4 h-4 mr-2" />
                <span className="text-xs">{displayViewers.length} viewed</span>
              </motion.button>
              {(showViewers || isPaused || isLoading) && (
                <div className="px-3 py-1 text-xs text-white bg-white rounded-full bg-opacity-20">
                  {isLoading
                    ? "Loading..."
                    : showViewers
                    ? "Viewers Open"
                    : "Paused"}
                </div>
              )}
            </div>
          )}
          {!status.isOwner && (
            <div className="flex items-center w-full gap-2 p-2 bg-white rounded-full bg-opacity-20">
              <input
                type="text"
                placeholder="Reply to story..."
                className="flex-1 text-sm text-white placeholder-gray-300 bg-transparent border-none outline-none"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="text-sm font-medium text-white"
              >
                Send
              </motion.button>
            </div>
          )}
        </div>

        <AnimatePresence>
          {showViewers && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 max-h-[60vh] overflow-y-auto bg-black z-40 p-4"
            >
              <h3 className="mb-3 font-semibold text-white">Viewed by</h3>
              <ul className="space-y-2">
                {displayViewers.map((viewer: any, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <img
                      src={viewer.picture || "/default-avatar.png"}
                      alt={viewer.name}
                      className="object-cover w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-white">{viewer.name}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Status;
