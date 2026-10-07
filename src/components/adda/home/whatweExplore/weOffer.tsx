import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

const WhatWeOffer = ({
  onActionButtonClick,
}: {
  onActionButtonClick: () => void;
}) => {
  const details = {
    Workshops: {
      description:
        "Engaging sessions for all ages, including music and art therapy, storytelling, revival of ancient values, study skills, and a basic introduction to spirituality.",
      link: "/mentoons-workshops",
    },
    "Comics & Audio Comics": {
      description:
        "Engaging stories that inspire creativity and teach positive values, providing a healthy alternative to excessive screen time and helping children develop focus and imagination.",
      link: "/mentoons-comics?option=comic",
    },
    Podcasts: {
      description:
        "Engaging discussions offering practical advice to manage digital distractions, build self-control, and promote emotional well-being for children and families.",
      link: "/mentoons-podcast",
    },
    Assessments: {
      description:
        "Tools to identify and address social media and mobile addiction, offering personalized guidance to improve academic focus and overall personal growth.",
      link: "/assessment-page",
    },
  };

  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLButtonElement>(null);
  const actionButtonRef = useRef<HTMLButtonElement>(null);
  const listItemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      containerRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
    )
      .fromTo(
        titleRef.current,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4 },
        "-=0.2",
      )
      .fromTo(
        actionButtonRef.current,
        { scale: 0, opacity: 0, rotate: -180 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        "-=0.2",
      );
  }, []);

  useEffect(() => {
    if (isOpen) {
      const targets = listItemRefs.current.filter(Boolean);
      gsap.fromTo(
        targets,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.35,
          stagger: 0.08,
          ease: "power2.out",
        },
      );
    }
  }, [isOpen]);

  const toggleDetails = () => {
    setIsOpen(!isOpen);
  };

  const handleActionHoverEnter = () => {
    gsap.to(actionButtonRef.current, {
      rotate: 15,
      scale: 1.15,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleActionHoverLeave = () => {
    gsap.to(actionButtonRef.current, {
      rotate: 0,
      scale: 1,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  return (
    <div ref={containerRef} className="wo-panel p-5">
      <style>{`
        .wo-font {
          font-family: var(--font-comic) !important;
          font-weight: 400 !important;
          letter-spacing: 0.05em;
        }
        .wo-chip-font {
          font-family: var(--font-comic-chip, var(--font-comic)) !important;
          font-weight: 400 !important;
          letter-spacing: 0.04em;
        }

        .wo-panel {
          background-color: #fffbeb;
          background-image: radial-gradient(rgba(249,115,22,0.18) 1.5px, transparent 2px);
          background-size: 14px 14px;
          border: 4px solid #000;
          box-shadow: 6px 6px 0 #000;
          border-radius: 16px;
        }

        .wo-title {
          background: #fde047;
          color: #000;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 10px;
          padding: 0 12px;
          transform: rotate(-2deg) skewX(-6deg);
          display: inline-block;
          transition: box-shadow 0.1s ease, background 0.1s ease;
        }
        .wo-title-btn:hover .wo-title { background: #facc15; box-shadow: 5px 5px 0 #000; }
        .wo-title-btn:active .wo-title { box-shadow: 0 0 0 #000; }

        .wo-chevron {
          background: #fff;
          color: #000;
          border: 3px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 999px;
        }

        .wo-action {
          background: #fb923c;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          border-radius: 999px;
          transition: box-shadow 0.1s ease, background 0.1s ease;
        }
        .wo-action:hover { background: #fdba74; box-shadow: 6px 6px 0 #000; }
        .wo-action:active { box-shadow: 1px 1px 0 #000; }

        .wo-item {
          background: #fff;
          color: #000;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 12px;
          transition: box-shadow 0.1s ease, background 0.1s ease;
        }
        .wo-item:hover { background: #fef9c3; box-shadow: 5px 5px 0 #000; }
        .wo-item:active { box-shadow: 1px 1px 0 #000; }

        .wo-arrow {
          background: #fde047;
          color: #000;
          border: 2px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 999px;
        }

        .wo-tag {
          background: #fde047;
          color: #000;
          border: 2px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 6px;
          padding: 0 8px;
          transform: rotate(-2deg) skewX(-6deg);
          display: inline-block;
          margin-right: 4px;
        }
      `}</style>

      <div className="flex items-center justify-between gap-4 mb-4">
        <button
          ref={titleRef}
          onClick={toggleDetails}
          className="wo-title-btn flex items-center gap-3 whitespace-nowrap focus:outline-none focus:ring-0 active:outline-none active:ring-0"
          aria-expanded={isOpen}
          aria-controls="details-section"
        >
          <span className="wo-title wo-font text-2xl sm:text-3xl pr-1">
            What We Offer
          </span>
          <motion.span
            className="wo-chevron flex items-center justify-center w-8 h-8 shrink-0"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.span>
        </button>

        <motion.button
          ref={actionButtonRef}
          onClick={onActionButtonClick}
          onMouseEnter={handleActionHoverEnter}
          onMouseLeave={handleActionHoverLeave}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          className="wo-action flex items-center justify-center z-10 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 focus:outline-none focus:ring-0 active:outline-none active:ring-0"
          aria-label="Create new post"
        >
          <img
            src="/assets/home/homepage fillers/sir Illustration.png"
            alt="Action button icon"
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
          />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            id="details-section"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mx-auto space-y-4 mt-4 overflow-hidden p-2"
          >
            {Object.entries(details).map(([key, value], index) => (
              <li key={index} ref={(el) => (listItemRefs.current[index] = el)}>
                <NavLink
                  to={value.link}
                  className="wo-item w-full text-left flex items-start gap-2 md:gap-4 p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  aria-label={`Learn more about ${key}`}
                  onMouseEnter={(e) =>
                    gsap.to(e.currentTarget, {
                      x: 4,
                      duration: 0.2,
                      ease: "power2.out",
                    })
                  }
                  onMouseLeave={(e) =>
                    gsap.to(e.currentTarget, {
                      x: 0,
                      duration: 0.2,
                      ease: "power2.out",
                    })
                  }
                >
                  <span className="wo-arrow flex items-center justify-center w-7 h-7 md:w-8 md:h-8 flex-shrink-0 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 md:h-5 md:w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeWidth={3}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                  <div className="wo-chip-font text-sm md:text-base leading-relaxed">
                    <span className="wo-tag wo-font">{key}</span>{" "}
                    {value.description}
                  </div>
                </NavLink>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WhatWeOffer;
