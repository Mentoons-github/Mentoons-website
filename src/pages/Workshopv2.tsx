import FAQCard from "@/components/shared/FAQSection/FAQCard";
import { WORKSHOP_FAQ, WORKSHOP_MATTERS_POINTS, WORKSHOPS } from "@/constant";
import { motion } from "framer-motion";
import { useState } from "react";
import { BiSolidMessage } from "react-icons/bi";
import { useInView } from "react-intersection-observer";

export type TPOSITION = {
  _id: string;
  jobTitle: string;
  jobDescription: string;
  thumbnail: string;
  skillsRequired: string[];
  jobType: string;
  location: string;
};
const Workshopv2 = () => {
  const [selecteCategory, setSelectedCategory] = useState("6-12");
  const handleSelectedCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Setting up intersection observers for different sections
  const [headerRef, headerInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [welcomeRef, welcomeInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [expectRef, expectInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [challengesRef, challengesInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [mattersRef, mattersInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [registerRef, registerInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [faqRef, faqInView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <div>
      {WORKSHOPS.filter((item) => item.category === selecteCategory).map(
        (workshop) => (
          <div key={workshop.id} className="">
            <motion.div
              ref={headerRef}
              initial="hidden"
              animate={headerInView ? "visible" : "hidden"}
              variants={fadeIn}
              className="relative justify-between overflow-hidden md:flex"
            >
              <motion.div
                variants={fadeInUp}
                className="flex-1 px-8 pt-24 md:px-20 "
              >
                <h1 className="text-5xl font-semibold text-primary md:text-6xl">
                  Workshops for All!
                </h1>
                <p className="text-xl md:w-[80%] mt-4  pb-8">
                  At Mentoons, we conduct informative and interactive workshops
                  that provide an effective and transformative experience for
                  our participants. Through thought-provoking discussions, group
                  activities, and practical exercises, our workshops empower
                  individuals to develop a healthy and balanced relationship
                  with technology.
                </p>
              </motion.div>
              <motion.div
                variants={fadeInUp}
                className="flex-col items-center justify-center flex-1 gap-12 pb-24 text-2xl font-semibold md:pt-24"
              >
                <div className="flex items-center justify-center gap-16 py-16 ">
                  <button
                    className={`flex items-center justify-start text-yellow-500 px-3 gap-3 w-32 py-[7px] rounded-full bg-yellow-100 border border-yellow-400 hover:ring-4 hover:ring-yellow-300 transition-all duration-200 ${
                      selecteCategory === "6-12" &&
                      "ring-4 ring-yellow-400 shadow-xl shadow-yellow-200"
                    }`}
                    onClick={() => handleSelectedCategory("6-12")}
                  >
                    <span className="w-5 h-5 bg-yellow-500 rounded-full" />
                    6-12
                  </button>
                  <button
                    className={`flex items-center justify-start gap-3 text-rose-600 w-32  px-3 py-[7px] rounded-full bg-red-200 border border-red-500 hover:ring-4 hover:ring-red-500 transition-all duration-200 ${
                      selecteCategory === "13-19" &&
                      "ring-4 ring-red-500 shadow-xl shadow-rose-200"
                    }`}
                    onClick={() => handleSelectedCategory("13-19")}
                  >
                    <span className="w-5 h-5 rounded-full bg-rose-500" />
                    13-19
                  </button>
                </div>
                <div className="flex items-center justify-center gap-16 pb-">
                  <button
                    className={`flex items-center justify-start gap-3 text-blue-500  w-32 px-3 py-[7px]  rounded-full bg-blue-200 border border-blue-500  hover:ring-4 hover:ring-blue-500 transition-all duration-200  ${
                      selecteCategory === "20+" &&
                      "ring-4 ring-blue-500 shadow-xl shadow-blue-200"
                    }`}
                    onClick={() => handleSelectedCategory("20+")}
                  >
                    <span className="w-5 h-5 bg-blue-500 rounded-full" />
                    20+
                  </button>
                  <button
                    className={`flex items-center justify-start gap-3 text-green-500 w-32 px-3 py-2  rounded-full bg-green-200 border border-green-500  hover:ring-4 hover:ring-green-500 transition-all duration-200  ${
                      selecteCategory === "parent" &&
                      "ring-4 ring-green-500 shadow-xl shadow-green-200"
                    }`}
                    onClick={() => handleSelectedCategory("parent")}
                  >
                    <span className="w-5 h-5 bg-green-500 rounded-full" />
                    Parent
                  </button>
                </div>
              </motion.div>
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                src="/assets/images/career-corner.png"
                alt="career-corner"
                className="absolute w-24 transition-all duration-200 -top-2 -right-2 md:w-48 md:-top-4 md:-right-4 hover:scale-110"
                onClick={() => handleSelectedCategory("20+")}
              />
            </motion.div>
            {/* dynamic section */}
            <div
              style={{
                background: `linear-gradient(to bottom, ${workshop.workshopAccentColor}, #FFFFFF)`,
              }}
            >
              <motion.div
                ref={welcomeRef}
                initial="hidden"
                animate={welcomeInView ? "visible" : "hidden"}
                variants={fadeIn}
                className="gap-12 p-8 md:py-16 md:px-20 md:flex"
              >
                <motion.div
                  variants={fadeInUp}
                  className="flex-col gap-8 md:flex-1 md:flex"
                >
                  <div>
                    <h2 className="pb-3 text-5xl font-bold">
                      {" "}
                      Welcome to {workshop.title}!
                    </h2>
                    <p className="text-2xl font-semibold ">
                      {workshop.workshopSubTitle}
                    </p>
                  </div>
                  <div className="pt-12 ">
                    <h3 className="text-2xl font-bold text-[#500EAD] pb-2">
                      {workshop.workshopAim}
                    </h3>
                    <p className="text-xl font-medium">
                      {workshop.workshopAimDescription}
                    </p>
                  </div>
                </motion.div>
                <motion.figure
                  variants={scaleIn}
                  className="flex items-center justify-center flex-1 p-4"
                >
                  <img
                    src={workshop.workshopLogo}
                    alt="Buddy Camp Illustrations"
                    className="object-cover"
                  />
                </motion.figure>
              </motion.div>

              {/* What to expect section */}
              <motion.div
                ref={expectRef}
                initial="hidden"
                animate={expectInView ? "visible" : "hidden"}
                variants={fadeIn}
                className="flex flex-col pt-0 md:p-12"
              >
                <motion.h2
                  variants={fadeInUp}
                  className="pb-12 text-3xl font-semibold text-center"
                >
                  What to expect from {workshop.title}?
                </motion.h2>
                <motion.div
                  variants={staggerContainer}
                  className="flex flex-col items-center gap-4 md:flex-row md:justify-around"
                >
                  {workshop.workshopOfferings.map((offering, index) => (
                    <motion.div
                      key={offering.id}
                      variants={scaleIn}
                      custom={index}
                      style={{
                        border: `1px solid ${offering.accentColor}`,
                        backgroundColor: `${offering.accentColor}20`,
                      }}
                      className="flex flex-col items-center gap-4 p-4 rounded-xl w-[280px] h-[280px] justify-center"
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.3 },
                      }}
                    >
                      <img
                        src={offering.imageUrl}
                        alt={offering.title}
                        className="w-24 h-24"
                      />
                      <p
                        style={{ color: offering.accentColor }}
                        className="text-lg font-bold text-center"
                      >
                        {offering.title}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Challenges faced by Youngsters */}
              <motion.div
                ref={challengesRef}
                initial="hidden"
                animate={challengesInView ? "visible" : "hidden"}
                variants={fadeIn}
                className="flex flex-col p-12"
              >
                <motion.h2
                  variants={fadeInUp}
                  className="pb-12 text-3xl font-semibold text-center"
                >
                  Challenges faced by Youngsters
                </motion.h2>
                <motion.div
                  variants={staggerContainer}
                  className="flex flex-col items-center gap-4 md:flex-row md:justify-around"
                >
                  {workshop.addressedIssues.map((issue, index) => (
                    <motion.div
                      key={issue.id}
                      variants={scaleIn}
                      custom={index}
                      className="flex flex-col items-center gap-4 border p-4 rounded-xl w-[280px] h-[280px] justify-center"
                      style={{
                        border: `1px solid ${workshop.registerFormbgColor}`,
                      }}
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.3 },
                      }}
                    >
                      <img
                        src={issue.imageUrl}
                        alt={issue.title}
                        className="w-24 h-24"
                      />
                      <p className="text-lg font-bold text-center whitespace-nowrap">
                        {issue.title}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* Why our WorkShops Matters */}
            <motion.div
              ref={mattersRef}
              initial="hidden"
              animate={mattersInView ? "visible" : "hidden"}
              variants={fadeIn}
              className="px-6 md:py-12 md:flex md:items-start md:px-20"
            >
              <motion.div variants={staggerContainer} className="flex-1">
                {WORKSHOP_MATTERS_POINTS.map((point, index) => (
                  <motion.div
                    key={point.id}
                    variants={fadeInUp}
                    custom={index}
                    className="flex items-start gap-5 p-4"
                  >
                    <figure className="">
                      <motion.img
                        src={point.icon}
                        alt="icon"
                        className="w-16"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      />
                    </figure>
                    <div>
                      <p className="text-2xl ">
                        <span className="text-2xl font-bold ">
                          {point.lable}:
                        </span>{" "}
                        {point.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div
                variants={fadeInUp}
                className="relative items-center justify-center flex-1"
              >
                <h2 className="pt-4 text-8xl font-semibold text-center luckiest-guy-regular text-primary [-webkit-text-stroke:_2px_black]">
                  Why our workshops matter?
                </h2>
                <figure className="flex items-center justify-end w-full p-4 pt-0 ">
                  <motion.img
                    src="/assets/workshopv2/man-thinking.png"
                    alt=""
                    initial={{ x: 100, opacity: 0 }}
                    animate={
                      mattersInView
                        ? { x: 0, opacity: 1 }
                        : { x: 100, opacity: 0 }
                    }
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </figure>
              </motion.div>
            </motion.div>

            {/* Registrations Form */}
            <motion.div
              ref={registerRef}
              initial="hidden"
              animate={registerInView ? "visible" : "hidden"}
              variants={fadeIn}
              className="p-4 py-12"
              style={{ backgroundColor: `${workshop.workshopAccentColor}` }}
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl font-semibold text-center"
              >
                REGISTER FOR OUR {workshop.title.toUpperCase()} HERE !
              </motion.h2>
              <motion.div variants={fadeInUp} className="my-12 md:flex">
                <figure className="flex-1 ">
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={
                      registerInView
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.8 }
                    }
                    transition={{ duration: 0.6, delay: 0.2 }}
                    src={workshop.registerFormIllustration}
                    alt=""
                    className="w-[60%] mx-auto object-cover p-4"
                  />
                </figure>
                <motion.div variants={scaleIn} className="flex-1 px-6 md:px-36">
                  <form className="flex flex-col w-full gap-4">
                    <div className="box-border flex gap-4">
                      <div className="flex-1 ">
                        <label
                          htmlFor="firstname"
                          className="text-lg font-semibold"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          placeholder="first name"
                          className="box-border w-full p-3 border-2 rounded-lg shadow-xl"
                          style={{
                            border: `2px solid ${workshop.registerFormbgColor}`,
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          htmlFor="lastname"
                          className="text-lg font-semibold"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          placeholder="last name"
                          className="box-border w-full p-3 border-2 rounded-lg shadow-xl"
                          style={{
                            border: `2px solid ${workshop.registerFormbgColor}`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="box-border flex gap-4">
                      <div className="flex-1 ">
                        <label
                          htmlFor="email"
                          className="text-lg font-semibold"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="email"
                          className="box-border w-full p-3 rounded-lg shadow-xl"
                          style={{
                            border: `2px solid ${workshop.registerFormbgColor}`,
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          htmlFor="phone"
                          className="text-lg font-semibold"
                        >
                          Phone
                        </label>
                        <input
                          type="text"
                          placeholder="phone"
                          className="box-border w-full p-3 border-2 rounded-lg shadow-xl"
                          style={{
                            border: `2px solid ${workshop.registerFormbgColor}`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="text-lg font-semibold"
                      >
                        Message
                      </label>
                      <textarea
                        name="message"
                        id="message"
                        placeholder="message"
                        className="box-border w-full p-3 border-2 rounded-lg shadow-xl"
                        style={{
                          border: `2px solid ${workshop.registerFormbgColor}`,
                        }}
                      ></textarea>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="py-3 text-xl font-semibold text-white rounded-lg shadow-lg"
                      style={{
                        backgroundColor: workshop.registerFormbgColor,
                      }}
                    >
                      Submit
                    </motion.button>
                  </form>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Frequently asked questions */}
            <motion.div
              ref={faqRef}
              initial="hidden"
              animate={faqInView ? "visible" : "hidden"}
              variants={fadeIn}
              className="p-8 md:px-28"
            >
              <motion.h2
                variants={fadeInUp}
                className="pb-6 text-2xl font-semibold"
              >
                Frequently asked questions
              </motion.h2>
              <motion.div variants={fadeInUp} className="md:flex md:gap-8">
                <motion.div
                  variants={staggerContainer}
                  className="flex flex-col flex-1 gap-4 mb-8"
                >
                  {WORKSHOP_FAQ.map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      variants={fadeInUp}
                      custom={index}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FAQCard
                        faq={faq}
                        isExpanded={expandedIndex === index}
                        color={workshop.registerFormbgColor}
                        onClick={() =>
                          setExpandedIndex(index === expandedIndex ? -1 : index)
                        }
                      />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  variants={scaleIn}
                  className="flex flex-col flex-1 gap-4 p-4 text-center border-2 md:mb-8 rounded-xl"
                >
                  <div className="w-[80%] mx-auto ">
                    <div className="flex items-center justify-center gap-4 py-2 md:pb-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <BiSolidMessage
                          className="text-5xl"
                          style={{ color: workshop.registerFormbgColor }}
                        />
                      </motion.div>
                    </div>
                    <div>
                      <h3
                        className="text-xl font-bold md:text-3xl md:pb-4"
                        style={{ color: workshop.registerFormbgColor }}
                      >
                        Have Doubts? We are here to help you!
                      </h3>
                      <p className="pt-2 pb-4 text-gray-600 md:text-xl md:pb-6">
                        Contact us for additional help regarding your assessment
                        or purchase made on this platform, We will help you!{" "}
                      </p>
                    </div>
                    <div className="">
                      <form action=" w-full flex flex-col gap-10">
                        <textarea
                          name="doubt"
                          id="doubt"
                          placeholder="Enter your doubt here"
                          className="box-border w-full p-3 rounded-lg shadow-xl"
                          style={{
                            border: `2px solid ${workshop.registerFormbgColor}`,
                          }}
                        ></textarea>

                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="w-full py-3 mt-4 text-xl font-semibold text-white transition-all duration-200 rounded-lg shadow-lg text-ellipsist-white"
                          style={{
                            backgroundColor: workshop.registerFormbgColor,
                          }}
                          type="submit"
                        >
                          Submit
                        </motion.button>
                      </form>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        )
      )}
    </div>
  );
};

export default Workshopv2;
