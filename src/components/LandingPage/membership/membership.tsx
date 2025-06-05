import { PLATINUM, PRIME } from "@/constant/constants";
import useInView from "@/hooks/useInView";
import { motion, useScroll, useTransform } from "framer-motion";
import MembershipCard from "../cards/membershipCard";
import { NavLink } from "react-router-dom";
import { useRef } from "react";

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

  const backgroundElements = [
    {
      className:
        "absolute -top-[25%] -left-[10%] w-[500px] h-[500px] bg-gradient-to-br from-yellow-200 via-yellow-300 to-orange-200 rounded-full blur-sm",
      animate: { y: [0, 25, 0], scale: [1, 1.15, 1], rotate: [0, 10, 0] },
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
    },
    {
      className:
        "absolute top-[40%] -left-[3%] w-32 h-32 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full shadow-xl",
      animate: { y: [0, 15, 0], rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] },
      transition: { duration: 7, repeat: Infinity, ease: "easeInOut" },
    },
    {
      className:
        "absolute top-1/2 -left-[9%] w-[28%] h-[40%] bg-gradient-to-tr from-orange-300 to-yellow-400 rounded-full opacity-80",
      animate: { y: [0, -20, 0], scale: [1, 1.08, 1] },
      transition: { duration: 9, repeat: Infinity, ease: "easeInOut" },
    },
    {
      className:
        "absolute -bottom-[8%] -left-[5%] w-[28%] h-[40%] bg-gradient-to-tl from-orange-400 to-yellow-300 rounded-full",
      animate: { y: [0, 18, 0], rotate: [-8, 8, -8] },
      transition: { duration: 8.5, repeat: Infinity, ease: "easeInOut" },
    },
    {
      className:
        "absolute -top-[12%] -right-[9%] w-80 h-80 bg-gradient-to-bl from-yellow-100 via-yellow-200 to-orange-200 rounded-full opacity-90",
      animate: { y: [0, 30, 0], scale: [1, 1.12, 1] },
      transition: { duration: 10, repeat: Infinity, ease: "easeInOut" },
    },
    {
      className:
        "absolute top-[4%] -right-[12%] w-96 h-96 bg-gradient-to-tl from-orange-200 via-yellow-300 to-orange-300 rounded-full opacity-70",
      animate: { y: [0, 20, 0], rotate: [-5, 5, -5] },
      transition: { duration: 8.8, repeat: Infinity, ease: "easeInOut" },
    },
    {
      className:
        "absolute top-1/5 -right-[10%] w-64 h-64 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full",
      animate: { y: [0, -15, 0], scale: [1, 1.1, 1] },
      transition: { duration: 7.5, repeat: Infinity, ease: "easeInOut" },
    },
    {
      className:
        "absolute top-1/2 -right-[4%] w-32 h-32 bg-gradient-to-tr from-orange-200 to-yellow-300 rounded-full shadow-lg",
      animate: { y: [0, 20, 0], scale: [1, 1.08, 1] },
      transition: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
    },
    {
      className:
        "absolute bottom-10 -right-[15%] w-[28%] h-[40%] bg-gradient-to-bl from-orange-300 to-yellow-400 rounded-full opacity-85",
      animate: { y: [0, -12, 0], scale: [1, 1.06, 1] },
      transition: { duration: 9.2, repeat: Infinity, ease: "easeInOut" },
    },
    {
      className:
        "absolute -bottom-[20%] -right-[5%] w-[28%] h-[40%] bg-gradient-to-tr from-yellow-200 via-orange-200 to-yellow-300 rounded-full",
      animate: { y: [0, 22, 0], rotate: [-6, 6, -6] },
      transition: { duration: 8.7, repeat: Infinity, ease: "easeInOut" },
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen p-6 md:p-12 lg:p-16 flex flex-col justify-center overflow-hidden items-center bg-gradient-to-br from-white via-orange-50 to-yellow-50"
      id="subscription"
    >
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
        className="absolute -top-[25%] -left-[10%] translate-x-[25%] translate-y-[33%] w-[500px] h-[500px] pointer-events-none"
        style={{ rotate }}
      >
        <motion.img
          src="/assets/home/homepage fillers/klement Homepage Illustration.png"
          alt="klement"
          className="absolute top-2/4 right-0 w-[20rem] hidden xl:block drop-shadow-2xl"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.div
        className="absolute -bottom-[8%] -left-[5%] translate-y-[5%] w-[28%] h-[40%] flex justify-center items-start pointer-events-none"
        animate={{ y: [0, 15, 0], scale: [1, 1.03, 1] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src="/assets/payments/payments logo.png"
          alt="payments"
          className="lg:block w-[60%] max-w-[450px] hidden xl:block drop-shadow-xl"
        />
      </motion.div>

      <motion.div
        ref={sectionRef}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative z-10 w-full max-w-7xl mx-auto"
      >
        <motion.div
          variants={itemVariants}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            ✨ Choose Your Plan
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-bold font-inter text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight bg-gradient-to-r from-gray-800 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4"
          >
            Membership Plans
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-inter"
          >
            Unlock the full potential of Mentoons with our carefully crafted
            membership tiers designed for every need.
          </motion.p>
        </motion.div>
        <motion.div
          variants={cardContainerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 place-items-center w-full max-w-6xl mx-auto mb-12"
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

        {/* Enhanced CTA Section */}
        <motion.div variants={itemVariants} className="text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <NavLink
              to="/mentoons-works"
              className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-orange-500/25 focus:outline-none focus:ring-4 focus:ring-orange-400/50 transition-all duration-300 overflow-hidden"
              aria-label="Learn how Mentoons work"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <span className="relative z-10 mr-3">How Mentoons Work</span>

              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 h-6 w-6"
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
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </motion.svg>

              {/* Sparkle Effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                animate={{
                  background: [
                    "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                    "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                    "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </NavLink>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mt-4 text-gray-500 text-sm"
          >
            Discover the magic behind our educational approach
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-orange-300 rounded-full opacity-60"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}
    </section>
  );
};

export default Membership;
