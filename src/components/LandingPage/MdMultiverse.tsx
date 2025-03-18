import { motion } from "framer-motion";

const MdMultiverse = () => {
  

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
