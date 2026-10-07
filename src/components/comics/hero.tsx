import { motion } from "framer-motion";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const pop = {
  hidden: { opacity: 0, scale: 0.85, rotate: -6 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: -2,
    transition: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] },
  },
};

const ComicHero = () => {
  return (
    <div
      className="relative overflow-hidden py-14 md:py-20"
      style={{
        backgroundColor: "#FFF8E7",
        backgroundImage: "radial-gradient(#00000014 1.4px, transparent 1.4px)",
        backgroundSize: "16px 16px",
      }}
    >
      {/* torn/ripped edge at bottom */}
      <svg
        className="absolute bottom-0 left-0 w-full h-6 md:h-10"
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40 L0,10 L40,25 L80,5 L120,22 L160,8 L200,28 L240,10 L280,24 L320,4 L360,20 L400,10 L440,26 L480,6 L520,22 L560,12 L600,28 L640,8 L680,24 L720,4 L760,20 L800,10 L840,26 L880,6 L920,22 L960,12 L1000,28 L1040,8 L1080,24 L1120,4 L1160,20 L1200,10 L1200,40 Z"
          fill="#FFF8E7"
        />
      </svg>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={container}
        className="relative max-w-7xl mx-auto px-4 lg:px-8 lg:flex lg:items-center lg:gap-14"
      >
        <div className="flex-1 text-center lg:text-left">
          {/* speech bubble eyebrow */}
          <motion.div variants={fadeUp} className="inline-block relative mb-6">
            <div className="bg-white border-[3px] border-black rounded-2xl px-5 py-2 shadow-[4px_4px_0_0_#000]">
              <p className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-black">
                Digital Wellness Series
              </p>
            </div>
            <div
              className="absolute -bottom-2 left-8 w-4 h-4 bg-white border-b-[3px] border-r-[3px] border-black"
              style={{ transform: "rotate(45deg)" }}
            />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="luckiest-guy-regular text-4xl sm:text-5xl md:text-7xl leading-[1.05] text-black"
            style={{
              WebkitTextStroke: "1.5px black",
              textShadow: "4px 4px 0 #FF9800, 8px 8px 0 rgba(0,0,0,0.15)",
            }}
          >
            E-Comics &<br className="hidden sm:block" /> Audio Comics
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 mx-auto lg:mx-0 max-w-xl text-base sm:text-lg md:text-xl font-medium text-gray-700 leading-relaxed"
          >
            Welcome to the world of meaningful stories and valuable life
            lessons. Our comics help children and teenagers navigate{" "}
            <span className="font-extrabold text-orange-500">
              important life topics
            </span>{" "}
            with ease and enjoyment — social media, safety, gadget addiction,
            and more, told the way kids actually want to read them.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex justify-center lg:justify-start"
          >
            <motion.a
              href="#comics"
              whileHover={{ scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-orange-500 text-white font-black uppercase tracking-wide px-7 py-3.5 rounded-xl border-[3px] border-black shadow-[5px_5px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
            >
              Explore Comics
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                →
              </motion.span>
            </motion.a>
          </motion.div>
        </div>

        <div className="flex-1 mt-14 lg:mt-0 relative flex justify-center">
          {/* comic panel frame */}
          <motion.div
            variants={pop}
            className="relative bg-white border-[4px] border-black rounded-2xl shadow-[8px_8px_0_0_#000] p-3 sm:p-4 max-w-md md:max-w-lg w-full"
          >
            {/* corner tape */}
            <div className="absolute -top-3 -left-4 w-16 h-7 bg-yellow-300/90 border border-black/20 rotate-[-8deg] shadow-sm" />
            <div className="absolute -top-3 -right-4 w-16 h-7 bg-yellow-300/90 border border-black/20 rotate-[8deg] shadow-sm" />

            <div className="rounded-lg overflow-hidden border-[3px] border-black">
              <motion.img
                src="/assets/comic-V2/comic-hero-v2.png"
                alt="comic page hero Image"
                className="w-full h-auto"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* pow burst badge */}
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              whileInView={{ scale: 1, rotate: -12 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.5,
                type: "spring",
                stiffness: 260,
                damping: 15,
              }}
              className="absolute -bottom-6 -right-6 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center"
            >
              <svg viewBox="0 0 100 100" className="absolute w-full h-full">
                <polygon
                  points="50,2 61,22 82,15 78,38 98,50 78,62 82,85 61,78 50,98 39,78 18,85 22,62 2,50 22,38 18,15 39,22"
                  fill="#FF9800"
                  stroke="black"
                  strokeWidth="2.5"
                />
              </svg>
              <span className="relative luckiest-guy-regular text-white text-xs sm:text-sm text-center leading-none px-2">
                PICK
                <br />
                YOURS!
              </span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ComicHero;
