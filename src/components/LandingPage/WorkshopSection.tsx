import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const WorkshopSection = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({ threshold: 0.2 });
  const letters = ["M", "E", "N", "T", "O", "R", "I", "N", "G"];
  const colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "purple",
    "purple",
    "green",
  ];

  const contentVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "tween", duration: 1.5, ease: "easeOut" },
    },
  };

  const pinsVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (index: number) => ({
      scale: 1,
      opacity: 1,
      transition: { delay: index * 0.3, duration: 1, ease: "easeInOut" },
    }),
  };

  useEffect(() => {
    console.log("WorkshopSection in view:", inView);
  }, [inView]);

  return (
    <div
      ref={ref}
      className="w-full min-h-screen relative z-10"
      style={{
        background: "linear-gradient(180deg, #A4CC13 12.08%, #FFEE67 100%)",
      }}
    >
      <motion.img
        src="/assets/LandingPage/workshop-ass.png"
        alt="workshop assets"
        className="absolute top-0 left-0 w-full object-contain"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={contentVariants}
      />

      <div className="flex flex-col lg:flex-row justify-center items-center w-full px-4 md:px-6 lg:px-8 mx-auto py-8 lg:py-16">
        {/* Left Section */}
        <motion.div
          className="w-full md:w-3/4 lg:w-1/2 mx-auto mb-8 lg:mb-0"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={contentVariants}
        >
          <figure className="w-full max-w-[30rem] mx-auto relative">
            <img
              src="/assets/LandingPage/note.png"
              alt="notebook"
              className="w-full h-auto object-contain"
            />
            <img
              src="/assets/LandingPage/pin.png"
              alt="pin"
              className="absolute top-[10%] left-1/2 transform -translate-x-1/2 w-6 md:w-8 lg:w-10 object-contain"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <h1 className="text-[4vw] lg:text-3xl whitespace-nowrap text-left">
                Making
                <br />
                <div className="flex">
                  {letters.map((letter, index) => (
                    <motion.span
                      key={index}
                      className={`text-${colors[index]}-500 hover:scale-110 transition-transform`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>
                Accessible
                <br />
                Engaging and
                <br />
                Impactful for All
              </h1>
            </div>
          </figure>
        </motion.div>

        {/* Right Section */}
        <motion.div
          className="w-full md:w-3/4 lg:w-1/2"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={contentVariants}
        >
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 lg:mb-8">
            Workshop for all
          </h1>
          <figure className="w-full max-w-[40rem] mx-auto relative z-40">
            <img
              src="/assets/LandingPage/tv.png"
              alt="tv"
              className="w-full h-auto object-contain"
            />

            {/* Workshop Pins */}
            {[
              {
                label: "6-12",
                img: "6",
                position: "top-[10%] left-[20%]",
                workshop: "6-12",
              },
              {
                label: "13-19",
                img: "13",
                position: "top-[10%] right-[20%]",
                workshop: "13-19",
              },
              {
                label: "20+",
                img: "20",
                position: "bottom-[15%] left-[20%]",
                workshop: "20+",
              },
              {
                label: "Parents",
                img: "parents",
                position: "bottom-[15%] right-[20%]",
                workshop: "parents",
              },
            ].map((pin, index) => (
              <motion.figure
                key={index}
                className={`absolute ${pin.position} w-[18%] md:w-[4.5rem] lg:w-[20%]`}
                custom={index}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={pinsVariants}
              >
                <div className="relative">
                  <img
                    src={`/assets/LandingPage/${pin.img.replace("+", "")}.png`}
                    alt={pin.label}
                    className="w-full h-auto cursor-pointer"
                    onClick={() =>
                      navigate(`/mentoons-workshops?workshop=${pin.workshop}`)
                    }
                  />
                  <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-md font-bold lg:text-xl cursor-pointer">
                    {pin.label}
                  </p>
                </div>
              </motion.figure>
            ))}
          </figure>
        </motion.div>
      </div>

      {/* Bottom Decorations */}
      <motion.img
        src="/assets/LandingPage/abc7.png"
        alt="clouds"
        className="absolute -bottom-4 left-0 w-full h-auto object-bottom"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={contentVariants}
      />
      <motion.img
        src="/assets/LandingPage/men-art.png"
        alt="men art"
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[10rem] md:w-[14rem] lg:w-[18rem] h-auto object-bottom z-20 hidden lg:block"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={contentVariants}
      />
      <motion.h1
        className="absolute bottom-0 left-[25%] text-[#864403] font-semibold text-lg md:text-4xl lg:text-3xl z-20 hidden lg:block"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={contentVariants}
      >
        Listen to us
        <br />
        Daily
      </motion.h1>
    </div>
  );
};

export default WorkshopSection;
