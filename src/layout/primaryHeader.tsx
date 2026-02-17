import AuthButton from "@/components/common/authButton";
import NotificationModal from "@/components/common/modal/notificationModal";
import {
  ANIMATION_TEXTS_ADDA,
  ANIMATION_TEXTS_HOME,
} from "@/constant/constants";
import useSocket from "@/hooks/adda/useSocket";
import { addNotification } from "@/redux/adda/notificationSlice";
import { NotificationInterface } from "@/types";
import { SignedIn, useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FaClock, FaMessage, FaPhone } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from "@/api/axios";
import PlatinumMembershipModal from "@/components/common/modal/platinumSubscriptionModal";

const PrimaryHeader = () => {
  const { socket } = useSocket();
  const location = useLocation();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [unreadCount, setUnreadCount] = useState(0);
  const [membershipModal, setMembershipModal] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.on("receive_notification", (notification: NotificationInterface) => {
      dispatch(addNotification(notification));
    });

    socket.on("unread_message_count", ({ count }: { count: number }) => {
      setUnreadCount(count);
    });

    return () => {
      socket.off("unread_message_count");
      socket.off("receive_notification");
    };
  }, [socket, dispatch]);

  const handleMessageClick = async () => {
    try {
      const token = await getToken();
      const res = await axiosInstance.get("/user/subscription-status", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { isValid, plan } = res.data.data;
      const isPlatinum = plan.toLowerCase() === "platinum";

      if (isValid && isPlatinum) {
        setUnreadCount(0);
        navigate("/chat");
      } else {
        setMembershipModal(true);
      }
    } catch (err) {
      setMembershipModal(true);
    }
  };

  const adda = useMemo(
    () => location.pathname.startsWith("/adda"),
    [location.pathname]
  );

  const animationTexts = useMemo(
    () => (adda ? ANIMATION_TEXTS_ADDA : ANIMATION_TEXTS_HOME),
    [adda]
  );

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

  if (location.pathname.startsWith("/employee")) {
    return null;
  }

  return (
    <div className="z-50 flex items-center justify-between md:justify-around w-full px-1 md:px-5 font-light text-white bg-gray-600 font-akshar">
      <div className="flex justify-start w-auto gap-5 py-2 md:gap-15 md:w-1/3 lg:w-1/2">
        <div className="hidden md:inline-flex items-center whitespace-nowrap gap-0 sm:gap-2 text-[10px] md:text-xs lg:text-sm xl:text-base">
          <FaClock className="hidden sm:block" />
          <h3>Monday - Saturday</h3>
          <span>10:00 AM - 8:00 PM</span>
        </div>
        <a
          href="tel:+917892858593"
          className="flex-shrink-0 hidden no-underline xl:block"
        >
          <div className="bg-white text-[10px] md:text-[12px] font-semibold rounded-full px-2 md:px-3 py-1 flex justify-center items-center gap-1 text-primary whitespace-nowrap">
            <FaPhone className="flex-shrink-0" />{" "}
            <span className="flex-shrink-0">+91 7892858593</span>
          </div>
        </a>
      </div>

      <div className="flex items-center justify-center w-2/5 py-2 overflow-hidden md:w-1/4">
        <motion.div
          variants={textAnimation}
          animate="animate"
          key="animation-texts"
          className="flex gap-8 md:gap-12 whitespace-nowrap"
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

      <div className="flex items-center justify-end w-auto gap-6 lg:gap-10 md:w-1/2">
        <SignedIn>
          <button onClick={handleMessageClick} className="relative">
            <FaMessage />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-semibold">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
          <NotificationModal getToken={getToken} />
        </SignedIn>
        <AuthButton />
      </div>
      <PlatinumMembershipModal
        isOpen={membershipModal}
        onClose={() => setMembershipModal(false)}
        onNavigate={() => {
          setMembershipModal(false);
          navigate("/membership");
        }}
      />
    </div>
  );
};

export default PrimaryHeader;
