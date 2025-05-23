import axios from "@/api/axios";
import AuthButton from "@/components/common/authButton";
import {
  ANIMATION_TEXTS_ADDA,
  ANIMATION_TEXTS_HOME,
} from "@/constant/constants";
import { NotificationInterface } from "@/types";
import { SignedIn, useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState, useMemo } from "react";
import { FaClock, FaBell } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";

const PrimaryHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const adda = useMemo(
    () => location.pathname.startsWith("/adda"),
    [location.pathname]
  );

  const animationTexts = useMemo(
    () => (adda ? ANIMATION_TEXTS_ADDA : ANIMATION_TEXTS_HOME),
    [adda]
  );

  const [notifications, setNotifications] = useState<
    NotificationInterface[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/adda/userNotifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Notifications response:", response.data);
      setNotifications(
        Array.isArray(response.data.data) ? response.data.data : []
      );
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (adda) {
      fetchNotifications();
    }
  }, [fetchNotifications, adda]);

  const getNotificationCount = () => {
    if (isLoading) {
      return 0;
    }
    return notifications?.length || 0;
  };

  const textAnimation = {
    animate: {
      x: ["58%", "-58%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 40,
          ease: "linear",
        },
      },
    },
  };

  return (
    <div className="flex items-center justify-around w-full px-5 font-light text-white bg-gray-600 z-50 font-akshar">
      <div className="flex justify-start w-auto gap-5 py-2 md:gap-15 md:w-1/3 lg:w-1/2">
        <div className="hidden md:inline-flex items-center whitespace-nowrap gap-0 sm:gap-2 text-[10px] md:text-xs lg:text-sm xl:text-base">
          <FaClock className="hidden sm:block" />
          <h3>Monday - Saturday</h3>
          <span>10:00 AM - 8:00 PM</span>
        </div>
      </div>

      <div className="flex items-center justify-center w-1/2 py-2 overflow-hidden md:w-1/4">
        <motion.div
          variants={textAnimation}
          animate="animate"
          key="animation-texts"
          className="flex gap-12 whitespace-nowrap"
        >
          {animationTexts
            .concat(animationTexts)
            .map(({ text, color }, index) => (
              <h1
                className={`${color} font-normal md:font-medium lg:font-normal text-[15px] md:text-md lg:text-lg xl:text-base font-akshar`}
                key={`${text}-${index}`}
              >
                {text}
              </h1>
            ))}
        </motion.div>
      </div>

      <div className="flex items-end justify-end w-auto gap-10 md:w-1/2">
        {adda && (
          <SignedIn>
            <div
              onClick={() => navigate("/adda/notifications")}
              className="relative hidden py-2 cursor-pointer md:block"
            >
              <FaBell />
              {getNotificationCount() > 0 && (
                <span className="absolute px-2 text-xs text-center text-black bg-yellow-400 rounded-full -top-0 -right-4">
                  {getNotificationCount()}
                </span>
              )}
            </div>
          </SignedIn>
        )}
        <AuthButton />
      </div>
    </div>
  );
};

export default PrimaryHeader;
