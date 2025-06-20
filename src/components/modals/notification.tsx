import { FiBell, FiX } from "react-icons/fi";
import useSocket from "@/hooks/adda/useSocket";
import { useEffect, useState } from "react";
import { NotificationInterface } from "@/types";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NotificationPopup = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [newNotification, setNewNotification] =
    useState<NotificationInterface | null>(null);
  const [progress, setProgress] = useState(100);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification: NotificationInterface) => {
      console.log("new notification got realtime:", notification);
      setNewNotification(notification);
      setShowPopup(true);
      setIsExiting(false);
      setProgress(100);
    };

    socket.on("receive_notification", handleNewNotification);

    return () => {
      socket.off("receive_notification", handleNewNotification);
    };
  }, [socket]);

  useEffect(() => {
    if (showPopup && !isExiting) {
      const duration = 5000;
      const interval = 50;
      const decrement = (interval / duration) * 100;

      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            setIsExiting(true);
            setTimeout(() => {
              setShowPopup(false);
              setIsExiting(false);
            }, 400);
            return 0;
          }
          return prev - decrement;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [showPopup, isExiting]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShowPopup(false);
      setIsExiting(false);
      setProgress(100);
    }, 400);
  };

  if (!showPopup || !newNotification) return null;

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{
            y: -100,
            opacity: 0,
            scale: 0.8,
            rotateX: -15,
          }}
          animate={{
            y: isExiting ? -80 : 0,
            opacity: isExiting ? 0 : 1,
            scale: isExiting ? 0.9 : 1,
            rotateX: isExiting ? -10 : 0,
          }}
          exit={{
            y: -100,
            opacity: 0,
            scale: 0.8,
            rotateX: 15,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 0.8,
            duration: isExiting ? 0.4 : undefined,
          }}
          className="mx-auto max-w-sm w-full"
          onClick={() => navigate("/adda/notifications")}
        >
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(10px)" }}
            className="relative border border-orange-200 rounded-2xl p-4 flex items-center gap-3 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-50 via-orange-25 to-yellow-50 opacity-50"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
              style={{ width: `${progress}%` }}
              initial={{ width: "100%" }}
              animate={{
                width: `${progress}%`,
                opacity: isExiting ? 0 : 1,
              }}
              transition={{
                width: { duration: 0.1 },
                opacity: { duration: 0.2 },
              }}
            />

            <motion.div
              className="relative p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full z-10"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, -10, 10, -5, 5, 0],
              }}
              transition={{
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                rotate: {
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                },
              }}
            >
              <FiBell
                size={20}
                className="text-orange-600"
                aria-hidden="true"
              />

              <motion.div
                className="absolute inset-0 rounded-full border-2 border-orange-400"
                animate={{
                  scale: [1, 1.5, 2],
                  opacity: [1, 0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-orange-300"
                animate={{
                  scale: [1, 1.8, 2.5],
                  opacity: [0.8, 0.3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.5,
                }}
              />
            </motion.div>

            <motion.div
              className="flex-1 z-10"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <motion.h1
                className="font-bold text-base text-gray-900 mb-1"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3 }}
              >
                New Notification
              </motion.h1>
              <motion.p
                className="text-sm text-gray-600 line-clamp-2 leading-relaxed"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {newNotification.message}
              </motion.p>
            </motion.div>

            <motion.div
              className="flex gap-2 z-10"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <NavLink
                  to={"/adda/notifications"}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  aria-label="Read notification"
                  onClick={handleDismiss}
                >
                  Read
                </NavLink>
              </motion.div>

              <motion.button
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 shadow-md hover:shadow-lg"
                aria-label="Dismiss notification"
                onClick={handleDismiss}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "#f3f4f6",
                }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  animate={{ rotate: 0 }}
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiX size={16} className="text-gray-600" />
                </motion.div>
              </motion.button>
            </motion.div>

            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-orange-300 rounded-full opacity-40"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [-5, -15, -5],
                  opacity: [0.4, 0.8, 0.4],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPopup;
