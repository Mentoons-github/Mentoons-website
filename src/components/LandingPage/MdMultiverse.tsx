import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
// import { useNavigate } from "react-router-dom";

const MdMultiverse = () => {
  //   const navigate = useNavigate();

  // Animation controls and in-view hooks for each section
  const [titleRef, titleInView] = useInView({ threshold: 0.2 });
  const titleControls = useAnimation();
  //   const [offeringsRef, offeringsInView] = useInView({ threshold: 0.2 });
  const offeringsControls = useAnimation();

  // Trigger animations when sections come into view
  useEffect(() => {
    if (titleInView) {
      titleControls.start("visible");
    } else {
      titleControls.start("hidden"); // Reset animation on scroll out
    }

    // if (offeringsInView) {
    //   offeringsControls.start("visible");
    // } else {
    //   offeringsControls.start("hidden"); // Reset animation on scroll out
    // }
  }, [titleInView, titleControls, offeringsControls]);

  //   const OfferingData = [
  //     {
  //       title: "Comics",
  //       description:
  //         "Our flagship comics feature beautifully illustrated stories that explore mentoring themes, covering topics like history, science, social skills, and personal growth.",
  //       image: "/assets/LandingPage/com.png",
  //       color: "#FFF27E",
  //       signImage: "/assets/LandingPage/com-si.png",
  //       link: "/mentoons-comics",
  //     },
  //     {
  //       title: "Audio Comics",
  //       description:
  //         "Audio comics blend traditional comics with voice acting, sound effects, and music, creating an immersive, on-the-go storytelling experience",
  //       image: "/assets/LandingPage/audio.png",
  //       color: "#4FE5FF",
  //       signImage: "/assets/LandingPage/aud-si.png",
  //       link: "/mentoons-comics/audio-comics",
  //     },
  //     {
  //       title: "Podcasts",
  //       description:
  //         '"Mentor Moments," our weekly podcast series, introduces young listeners to inspiring conversations with mentors across various fields, making learning fun and accessible',
  //       image: "/assets/LandingPage/pod.png",
  //       color: "#C0FFA0",
  //       signImage: "/assets/LandingPage/pod-si.png",
  //       link: "/mentoons-podcast",
  //     },
  //     {
  //       title: "Workshops",
  //       description:
  //         "Our workshops, led by industry pros, boost mentoring skills, teamwork, and personal growth in comic creation, storytelling, and character design",
  //       image: "/assets/LandingPage/works.png",
  //       color: "#FBB13E",
  //       signImage: "/assets/LandingPage/work-si.png",
  //       link: "/mentoons-workshops",
  //     },
  //   ];

  return (
    <div
      className="w-full h-full relative"
      style={{
        background: "#F9F8DD",
      }}
    >
      {/* Title and Description Section */}
      <motion.div
        ref={titleRef}
        className="flex flex-row flex-wrap lg:flex-nowrap items-center justify-center px-2 lg:px-[10vw]"
        initial="hidden"
        animate={titleControls}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
        }}
      >
        <div className="flex flex-col items-center lg:justify-start justify-center h-full p-10 lg:p-10 lg:gap-10 lg:ml-20">
          <h1 className="text-4xl lg:text-7xl font-bold whitespace-nowrap">
            HERE'S HOW
            <br />
            WE CAN HELP
          </h1>
          <figure>
            <img src="/assets/LandingPage/md-exp.png" alt="md-multiverse" />
          </figure>
        </div>
        <div>
          <h1 className="text-medium text-left">
            With Mentoons, You can Imagine a world where your kids are not only
            gadget-friendly but also culturally rooted and emotionally balanced
            individuals who respect their elders and value their heritage.
          </h1>
        </div>
      </motion.div>

      {/* Offering Section */}
      {/* <motion.div
                ref={offeringsRef}
                className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 lg:px-10 py-8"
                initial="hidden"
                animate={offeringsControls}
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.3 },
                    },
                }}
            >
                {OfferingData.map((offering, index) => (
                    <motion.div
                        key={index}
                        className="relative group hover:scale-105 transition-transform duration-300"
                        onClick={() => navigate(offering.link)}
                        variants={{
                            hidden: { opacity: 0, y: 50 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                        }}
                    >
                        <div className="rounded-xl shadow-lg overflow-hidden h-full">
                            <div
                                className="h-48 relative"
                                style={{ backgroundColor: offering.color }}
                            >
                                <img
                                    src="/assets/LandingPage/star-bg.png"
                                    alt="star bg"
                                    className="absolute inset-0 w-full h-full opacity-50"
                                />
                                <img
                                    src={offering.image}
                                    alt={offering.title}
                                    className="absolute inset-0 w-full h-full object-contain p-4"
                                />
                            </div>
                            <div className="p-6 relative bg-[url('/assets/LandingPage/offering-bg.png')] bg-cover bg-center">
                                <div className="absolute inset-0 bg-white/10"></div>
                                <h3 className="text-xl font-bold mb-2">
                                    {offering.title}
                                </h3>
                                <p className="text-sm">
                                    {offering.description}
                                </p>
                            </div>
                        </div>
                        <img
                            src={offering.signImage}
                            alt={`${offering.title} sign`}
                            className="w-[4rem] h-[4rem] absolute bottom-0 right-0"
                        />
                    </motion.div>
                ))}
            </motion.div> */}
    </div>
  );
};

export default MdMultiverse;
