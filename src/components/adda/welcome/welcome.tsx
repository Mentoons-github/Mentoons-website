import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

type WelcomeModalProps = {
  onClose: () => void;
};

const WelcomeModal = ({ onClose }: WelcomeModalProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleBrowsePlansClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (location.pathname !== "/mentoons") {
      navigate("/mentoons");
      setTimeout(() => scrollToSubscription(), 500);
    } else {
      scrollToSubscription();
    }
  };

  const scrollToSubscription = () =>
    document
      .getElementById("subscription")
      ?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const checkScrollable = () => {
      const modal = modalRef.current;
      if (modal) {
        const isScrollable = modal.scrollHeight > modal.clientHeight;
        setShowScrollIndicator(
          isScrollable &&
            modal.scrollTop < modal.scrollHeight - modal.clientHeight - 20
        );
      }
    };

    checkScrollable();

    const modal = modalRef.current;
    if (modal) {
      modal.addEventListener("scroll", checkScrollable);
    }

    const timer = setTimeout(checkScrollable, 500);

    return () => {
      if (modal) {
        modal.removeEventListener("scroll", checkScrollable);
      }
      clearTimeout(timer);
    };
  }, []);

  const scrollToBottom = () => {
    const modal = modalRef.current;
    if (modal) {
      modal.scrollTo({
        top: modal.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const details = {
    Workshops:
      "Engaging sessions for all ages, including music and art therapy, storytelling, revival of ancient values, study skills, and a basic introduction to spirituality.",
    "Comics & Audio Comics":
      "Engaging stories that inspire creativity and teach positive values, providing a healthy alternative to excessive screen time and helping children develop focus and imagination.",
    Podcasts:
      "Engaging discussions offering practical advice to manage digital distractions, build self-control, and promote emotional well-being for children and families.",
    Assessments:
      "Tools to identify and address social media and mobile addiction, offering personalized guidance to improve academic focus and overall personal growth.",
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-[9999] overflow-auto">
      <div
        className="bg-white max-w-3xl w-full relative shadow-lg border rounded-lg font-sans max-h-[90vh] overflow-y-auto"
        ref={modalRef}
      >
        <button
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-10"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-4 md:p-8">
          <motion.div
            className="flex justify-center items-center"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <img
              alt="mentoons-logo"
              src="https://mentoons-website.s3.ap-northeast-1.amazonaws.com/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
              className="w-40 h-16 md:w-55 md:h-24"
              onError={(e) =>
                (e.currentTarget.src = "/assets/fallback-logo.png")
              }
            />
          </motion.div>

          <h1 className="text-orange-500 font-bold text-2xl md:text-4xl text-center mt-4">
            Welcome to Mentoons!
          </h1>

          <p className="mx-auto text-center text-gray-700 max-w-xl mt-3 text-sm md:text-base">
            Mentoons is a platform created by psychologists and educators with a
            mission to bring a healthy academic and digital balance to children,
            youth, parents, and elders.
          </p>

          <ul className="mx-auto space-y-4 mt-6">
            {Object.entries(details).map(([key, value], index) => (
              <li
                className="text-gray-700 flex items-start gap-2 md:gap-5 text-sm md:text-base"
                key={index}
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-orange-500 h-5 w-5 md:h-6 md:w-6 flex-shrink-0 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
                <div>
                  <NavLink
                    to="/mentoons"
                    onClick={handleBrowsePlansClick}
                    className="text-orange-500 font-bold hover:underline"
                  >
                    {key}
                  </NavLink>
                  : {value}
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col justify-center items-center mt-6 gap-4">
            <NavLink
              to="/sign-up"
              className="text-center text-base md:text-lg text-white px-6 md:px-24 py-3 bg-orange-500 rounded-full font-bold w-full md:w-auto"
            >
              Take the First Step
            </NavLink>

            <span className="text-orange-500 text-sm md:text-base">
              Already have an account?{" "}
              <NavLink to="/sign-in" className="underline">
                Log In
              </NavLink>
            </span>
          </div>

          <p className="text-gray-500 text-xs md:text-sm text-center mt-6 md:mt-8">
            By continuing, you agree to our Terms of Use and Privacy Policy
          </p>
        </div>

        {showScrollIndicator && (
          <div
            className="flex absolute bottom-6 right-5 bg-orange-500 text-white px-3 py-2 rounded-full cursor-pointer shadow-lg items-center gap-2 animate-bounce hover:bg-orange-600 transition-colors"
            onClick={scrollToBottom}
          >
            <span className="text-sm font-medium">More content</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeModal;
