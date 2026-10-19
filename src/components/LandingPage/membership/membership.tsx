import { PLATINUM, PRIME } from "@/constant/constants";
import useInView from "@/hooks/useInView";
import { motion, useScroll, useTransform } from "framer-motion";
import MembershipCard from "../cards/membershipCard";
import { NavLink } from "react-router-dom";
import { useRef } from "react";

const HALFTONE_BG = {
  backgroundColor: "#F5F5F4",
  backgroundImage: "radial-gradient(#d6d3d1 1.2px, transparent 1.2px)",
  backgroundSize: "16px 16px",
};

const HALFTONE_OVERLAY = {
  backgroundImage:
    "radial-gradient(rgba(17,24,39,0.16) 1.6px, transparent 1.6px)",
  backgroundSize: "16px 16px",
};

const Membership = () => {
  const isMobile = window.innerWidth < 768;
  const { ref: sectionRef, isInView } = useInView(isMobile ? 0.1 : 0.3, false);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
      },
    },
  };

  // Flat, ink-outlined comic circles (replace the old gradient blobs)
  const backgroundElements = [
    {
      className:
        "absolute -top-[25%] -left-[10%] h-[420px] w-[420px] rounded-full border-4 border-gray-900 bg-[#FFD93D] opacity-80",
      animate: { y: [0, 25, 0], scale: [1, 1.1, 1] },
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
    },
    {
      className:
        "absolute top-[40%] -left-[3%] h-28 w-28 rounded-full border-4 border-gray-900 bg-[#FF5D8F] shadow-[6px_6px_0_0_#111827]",
      animate: { y: [0, 15, 0], rotate: [0, 15, -15, 0] },
      transition: { duration: 7, repeat: Infinity, ease: "easeInOut" },
    },
    {
      className:
        "absolute -bottom-[10%] -left-[5%] h-[34%] w-[24%] rounded-full border-4 border-gray-900 bg-[#4CC9F0] opacity-80",
      animate: { y: [0, 18, 0], rotate: [-8, 8, -8] },
      transition: { duration: 8.5, repeat: Infinity, ease: "easeInOut" },
    },
    {
      className:
        "absolute -top-[12%] -right-[9%] h-72 w-72 rounded-full border-4 border-gray-900 bg-[#7AE582] opacity-80",
      animate: { y: [0, 30, 0], scale: [1, 1.1, 1] },
      transition: { duration: 10, repeat: Infinity, ease: "easeInOut" },
    },
    {
      className:
        "absolute top-1/2 -right-[4%] h-28 w-28 rounded-full border-4 border-gray-900 bg-[#FF9800] shadow-[6px_6px_0_0_#111827]",
      animate: { y: [0, 20, 0], scale: [1, 1.08, 1] },
      transition: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
    },
    {
      className:
        "absolute -bottom-[20%] -right-[5%] h-[36%] w-[26%] rounded-full border-4 border-gray-900 bg-[#FFD93D] opacity-80",
      animate: { y: [0, 22, 0], rotate: [-6, 6, -6] },
      transition: { duration: 8.7, repeat: Infinity, ease: "easeInOut" },
    },
  ];

  return (
    <section
      ref={containerRef}
      style={HALFTONE_BG}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden border-y-2 border-gray-900 p-6 md:p-12 lg:p-16"
      id="subscription"
    >
      {/* halftone shading over the whole section */}
      <div
        className="pointer-events-none absolute inset-0"
        style={HALFTONE_OVERLAY}
      />

      {backgroundElements.map((element, index) => (
        <motion.div
          key={index}
          className={element.className}
          animate={element.animate}
          transition={element.transition}
          style={index % 2 === 0 ? { y: y1 } : { y: y2 }}
        />
      ))}

      <motion.div
        className="pointer-events-none absolute -top-[25%] -left-[10%] h-[500px] w-[500px] translate-x-[25%] translate-y-[33%]"
        style={{ rotate }}
      >
        <motion.img
          src="/assets/home/homepage fillers/klement Homepage Illustration.png"
          alt="klement"
          className="absolute right-0 top-2/4 hidden w-[20rem] drop-shadow-2xl xl:block"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute -bottom-[8%] -left-[5%] flex h-[40%] w-[28%] translate-y-[5%] items-start justify-center"
        animate={{ y: [0, 15, 0], scale: [1, 1.03, 1] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src="/assets/payments/payments logo.png"
          alt="payments"
          className="hidden w-[60%] max-w-[450px] drop-shadow-xl xl:block"
        />
      </motion.div>

      <motion.div
        ref={sectionRef}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative z-10 mx-auto w-full max-w-7xl"
      >
        <motion.div
          variants={itemVariants}
          className="mb-12 text-center md:mb-16"
        >
          <motion.div
            className="font-comic-chip mb-5 inline-flex -rotate-2 items-center rounded-full border-2 border-gray-900 bg-[#FFD93D] px-4 py-2 text-sm tracking-wide text-gray-900 shadow-[3px_3px_0_0_#111827]"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            ✨ Choose Your Plan
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-comic mb-6 text-5xl leading-tight tracking-wide text-white sm:text-6xl md:text-7xl"
            style={{
              WebkitTextStroke: "2px #111827",
              textShadow: "5px 5px 0 #111827",
            }}
          >
            Membership Plans
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto inline-block max-w-2xl rotate-1 rounded-2xl border-2 border-gray-900 bg-white px-5 py-3 text-base font-medium leading-relaxed text-gray-900 shadow-[5px_5px_0_0_#111827] md:text-lg"
          >
            Unlock the full potential of Mentoons with our carefully crafted
            membership tiers designed for every need.
          </motion.p>
        </motion.div>

        <motion.div
          variants={cardContainerVariants}
          className="mx-auto mb-14 grid w-full max-w-6xl grid-cols-1 place-items-center gap-10 lg:grid-cols-2 lg:gap-14"
        >
          {[PRIME, PLATINUM].map((data, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              className="w-full max-w-md"
            >
              <MembershipCard membership={data} />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants} className="text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <NavLink
              to="/mentoons-works"
              className="font-comic-chip group inline-flex items-center gap-3 rounded-2xl border-2 border-gray-900 bg-[#FF9800] px-8 py-4 text-lg tracking-wide text-white shadow-[6px_6px_0_0_#111827] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_0_#111827] focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-900/40"
              aria-label="Learn how Mentoons work"
              style={{ textShadow: "2px 2px 0 #111827" }}
            >
              <span>How Mentoons Work</span>

              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M9 5l7 7-7 7"
                />
              </motion.svg>
            </NavLink>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="font-comic mt-5 text-xl tracking-wide text-gray-900"
          >
            Discover the magic behind our educational approach
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Membership;
