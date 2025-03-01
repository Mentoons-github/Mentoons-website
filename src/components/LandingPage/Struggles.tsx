import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

const Struggles = () => {
  const controls = useAnimation();
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start("visible");
        } else {
          controls.start("hidden");
        }
      },
      { threshold: 0.2 }, // Trigger when 20% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [controls]);

  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  // const staggerVariants = {
  //   hidden: { opacity: 0 },
  //   visible: {
  //     opacity: 1,
  //     transition: {
  //       staggerChildren: 0.2,
  //     },
  //   },
  // };

  return (
    <div
      ref={sectionRef}
      className="w-full  bg-[#FFF2E7] px-4 sm:px-6 lg:px-10 py-10"
    >
      <motion.div
        className="w-full max-w-[1200px] mx-auto py-8 lg:py-12 flex flex-col lg:flex-row items-center lg:gap-8"
        variants={fadeInVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Text Section */}
        <div className="w-full lg:w-1/2 space-y-4 text-center lg:text-left mb-6 lg:mb-0">
          <motion.h2 className="text-2xl lg:text-4xl font-thin text-gray-800">
            We know
          </motion.h2>
          <motion.h1 className="text-3xl lg:text-6xl font-bold text-gray-900">
            THE STRUGGLES
          </motion.h1>
          <motion.h2 className="text-lg lg:text-2xl font-light text-gray-700">
            Our Youth is facing
          </motion.h2>
          <motion.p className="text-md lg:text-lg font-medium text-gray-800">
            We delve into the dazzling world of digital entertainment, our hands
            crave devices, our eyes crave screens, and our minds crave constant
            stimulation.
          </motion.p>
          <motion.p className="text-sm lg:text-base font-light text-gray-600">
            #Mobile Addiction, #Scrolling Addiction, #Gaming Addiction, #Social
            Media Addiction, and more.
          </motion.p>
        </div>

        {/* Video Section */}
        <motion.div
          className="w-full lg:w-1/2 flex justify-center"
          initial="hidden"
          animate={controls}
          variants={fadeInVariants}
        >
          <div className="aspect-w-16 aspect-h-9 w-full max-w-[600px] rounded-xl overflow-hidden">
            <video
              src={`${
                import.meta.env.VITE_STATIC_URL
              }static/We know THE STRUGGLES our youth is facing_03.mp4`}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Divider */}
      <motion.hr
        className="w-[90%] h-[2px] mx-auto bg-gray-300 mb-8"
        variants={fadeInVariants}
        initial="hidden"
        animate={controls}
      />

      {/* Description
      <motion.h1
        className="text-center text-xl lg:text-2xl font-semibold text-gray-800 mb-10"
        variants={fadeInVariants}
        initial="hidden"
        animate={controls}
      >
        Our digital lives have started to take a toll on our mental and physical
        health, affecting our sleep, productivity, relationships, and even
        self-esteem.
      </motion.h1>

      {/* Addiction Cards */}
      {/* <motion.div
        className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={staggerVariants}
        initial="hidden"
        animate={controls}
      >
        {AddictionCardsData.map((card, index) => (
          <motion.div key={index} variants={fadeInVariants}>
            <AddictionCards {...card} />
          </motion.div>
        ))}
      </motion.div> */}
    </div>
  );
};

export default Struggles;
