import { WordRotate } from "@/components/magicui/word-rotate";
import EnquiryModal from "@/components/modals/EnquiryModal";
import RegirstrationModal from "@/components/modals/RegistrationModal";
import FAQCard from "@/components/shared/FAQSection/FAQCard";
import { WORKSHOP_FAQ, WORKSHOPS } from "@/constant";
import { ModalMessage, workshop } from "@/utils/enum";
import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { BiSolidMessage } from "react-icons/bi";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
// export type TPOSITION = {
//   _id: string;
//   jobTitle: string;
//   jobDescription: string;
//   thumbnail: string;
//   skillsRequired: string[];
//   jobType: string;
//   location: string;
// };
const Workshopv2 = () => {
  const [selecteCategory, setSelectedCategory] = useState("6-12");
  const handleSelectedCategory = (category: string) => {
    setSelectedCategory(category);
  };
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const [enquiryMessag, setEquiryMessage] = useState("");
  const [enquiryEmail, setEnquiryEmail] = useState("");
  const [enquiryName, setEnquiryName] = useState("");

  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    message: "",
    workshop:
      selecteCategory === "6-12"
        ? "Buddy Camp"
        : selecteCategory === "13-19"
        ? "Teen Camp"
        : selecteCategory === "20+"
        ? "Career Corner"
        : selecteCategory === "parent"
        ? "Parent Camp"
        : "",
    doubt: "",
  });

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterationForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const workshopRegistrationResponse = await axios.post(
        "https://mentoons-backend-zlx3.onrender.com/api/v1/workshop/submit-form",
        formData
      );
      if (workshopRegistrationResponse.status === 200) {
        setShowRegistrationModal(true);
      } else {
        toast.error("Registration Failed");
      }

      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        message: "",
        workshop:
          selecteCategory === "6-12"
            ? "Buddy Camp"
            : selecteCategory === "13-19"
            ? "Teen Camp"
            : selecteCategory === "20+"
            ? "Career Corner"
            : selecteCategory === "parent"
            ? "Parent Camp"
            : "",
        doubt: "",
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration Failed");
    } finally {
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        message: "",
        workshop: "",
        doubt: "",
      });
    }
  };

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
  // const [welcomeRef, welcomeInView] = useInView({
  //   threshold: 0.2,
  //   triggerOnce: true,
  // });
  // const [expectRef, expectInView] = useInView({
  //   threshold: 0.2,
  //   triggerOnce: true,
  // });
  // const [challengesRef, challengesInView] = useInView({
  //   threshold: 0.2,
  //   triggerOnce: true,
  // });
  // const [mattersRef, mattersInView] = useInView({
  //   threshold: 0.2,
  //   triggerOnce: true,
  // });
  const [registerRef, registerInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [faqRef, faqInView] = useInView({ threshold: 0.2, triggerOnce: true });

  const handleDoubtSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const queryResponse = await axios.post(
        "https://mentoons-backend-zlx3.onrender.com/api/v1/query", // Fixed the endpoint URL
        {
          message: enquiryMessag,
          name: enquiryName,
          email: enquiryEmail,
          queryType: "workshop",
        }
      );
      console.log(queryResponse);
      if (queryResponse.status === 201) {
        setShowEnquiryModal(true);
      }
    } catch (error) {
      toast.error("Failed to submit message");
    }
  };

  return (
    <>
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
                    Workshops At Mentoons
                  </h1>

                  <div className="">
                    <WordRotate
                      motionProps={{
                        initial: { opacity: 1, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        transition: { duration: 0.5, ease: "easeInOut" },
                      }}
                      words={[
                        "Fun and Creative Workshops for Kids",
                        "Offline and Online Workshops Available",
                        "Led By Psychologists and Academicians",
                      ]}
                      className="text-2xl md:w-[80%]"
                    />
                  </div>

                  <p className="text-xl md:w-[80%] mt-4  pb-8">
                    At Mentoons, we conduct informative and interactive
                    workshops that provide an effective and transformative
                    experience for our participants.
                  </p>
                  <p className="text-xl md:w-[80%] mt-4  pb-8">
                    Our expert-led workshops empower children, teens, and young
                    adults to build healthier relationships with
                    technology—without compromising fun, connection, or
                    creativity.
                  </p>
                </motion.div>
                <div className="flex items-center justify-end flex-1 pr-20">
                  <img
                    src="/assets/workshopv2/workshopNew.png"
                    alt="workshop-v2"
                  />
                </div>
                {/* <motion.div
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
                 
                </div>
              </motion.div> */}
                {/* <motion.img
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  src="/assets/images/career-corner.png"
                  alt="career-corner"
                  className="absolute w-24 transition-all duration-200 -top-2 -right-2 md:w-48 md:-top-4 md:-right-4 hover:scale-110"
                  onClick={() => handleSelectedCategory("20+")}
                /> */}
              </motion.div>
              {/* dynamic section */}
              {/* <div
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
                </motion.div> */}

              {/* What to expect section */}
              {/* <motion.div
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
              </motion.div> */}

              {/* Challenges faced by Youngsters */}
              {/* <motion.div
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
              </motion.div> */}

              {/* Why our WorkShops Matters */}
              {/* <motion.div
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
                    <h2 className="pt-4 text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-semibold text-center luckiest-guy-regular text-primary [-webkit-text-stroke:_2px_black]">
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
                </motion.div> */}
              <WorkShopChallenges />
              <WorkshopInfoCarousel />
              <WorkshopActivities />

              {/* Registrations Form */}
              <motion.div
                ref={registerRef}
                initial="hidden"
                animate={registerInView ? "visible" : "hidden"}
                variants={fadeIn}
                className="p-4 py-12 bg-[#FFAA15] flex flex-col md:flex-row justify-center"
              >
                <motion.div className="flex flex-col flex-1 h-full ">
                  <h2 className="pt-4 text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-center luckiest-guy-regular text-black [-webkit-text-stroke:_2px_white] w-[80%] mx-auto">
                    REGISTER FOR OUR WORKSHOP HERE !
                  </h2>
                  <figure className="flex items-center justify-center flex-1">
                    <motion.img
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={
                        registerInView
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 0.8 }
                      }
                      transition={{ duration: 0.6, delay: 0.2 }}
                      src="/assets/workshopv2/workshop-registration.png"
                      alt=""
                      className="object-cover  w-[50%]"
                    />
                  </figure>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="flex-1 h-full my-12 md:flex-1"
                >
                  <motion.div
                    variants={scaleIn}
                    className="items-start justify-start flex-1 h-full px-6 lg:px-36 "
                  >
                    <form
                      className="flex flex-col visible w-full h-full gap-4 "
                      onSubmit={handleRegisterationForm}
                    >
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
                            onChange={handleFormChange}
                            name="firstname"
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
                            onChange={handleFormChange}
                            name="lastname"
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
                            onChange={handleFormChange}
                            name="email"
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
                            onChange={handleFormChange}
                            name="phone"
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
                          onChange={handleFormChange}
                        ></textarea>
                      </div>
                      <div className="flex-1 ">
                        <label className="text-lg font-semibold">
                          Select Category
                        </label>
                        <div className="flex flex-col gap-2 mt-2 md:flex-row">
                          <label className="flex items-start gap-2">
                            <input
                              type="radio"
                              name="category"
                              value="6-12"
                              checked={selecteCategory === "6-12"}
                              onChange={(e) =>
                                handleSelectedCategory(e.target.value)
                              }
                              className="w-4 h-4"
                            />
                            <span>Buddy Camp (6-12 years)</span>
                          </label>
                          <label className="flex items-start gap-2">
                            <input
                              type="radio"
                              name="category"
                              value="13-19"
                              checked={selecteCategory === "13-19"}
                              onChange={(e) =>
                                handleSelectedCategory(e.target.value)
                              }
                              className="w-4 h-4"
                            />
                            <span>Teen Camp (13-19 years)</span>
                          </label>
                          <label className="flex items-start gap-2">
                            <input
                              type="radio"
                              name="category"
                              value="20+"
                              checked={selecteCategory === "20+"}
                              onChange={(e) =>
                                handleSelectedCategory(e.target.value)
                              }
                              className="w-4 h-4"
                            />
                            <span>Career Corner (20+ years)</span>
                          </label>
                        </div>
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
                className="p-8 md:px-28 bg-gradient-to-b from-[#FEB977] to-[#FF942E]"
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
                            setExpandedIndex(
                              index === expandedIndex ? -1 : index
                            )
                          }
                        />
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div
                    variants={scaleIn}
                    className="flex flex-col flex-1 gap-4 p-4 text-center border-2 border-white/80 bg-white/80 md:mb-8 rounded-xl"
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
                        <p className="pt-2 pb-2 text-gray-600 md:text-xl md:pb-6">
                          Contact us for additional help regarding your workshop
                          or purchase made on this platform, We will help you!{" "}
                        </p>
                      </div>
                      <div className="">
                        <form
                          className="flex flex-col w-full gap-4 "
                          onSubmit={(e) => handleDoubtSubmission(e)}
                        >
                          <div className="flex gap-4">
                            <input
                              type="text"
                              name="name"
                              id="name"
                              placeholder="Your Name"
                              value={enquiryName}
                              onChange={(e) => setEnquiryName(e.target.value)}
                              className="w-full p-3 rounded-lg shadow-xl"
                              style={{
                                border: `2px solid ${workshop.registerFormbgColor}`,
                              }}
                              required
                            />

                            <input
                              type="email"
                              name="email"
                              id="email"
                              value={enquiryEmail}
                              onChange={(e) => setEnquiryEmail(e.target.value)}
                              placeholder="Your Email"
                              className="w-full p-3 rounded-lg shadow-xl"
                              style={{
                                border: `2px solid ${workshop.registerFormbgColor}`,
                              }}
                              required
                            />
                          </div>
                          <textarea
                            name="doubt"
                            id="doubt"
                            value={enquiryMessag}
                            onChange={(e) => setEquiryMessage(e.target.value)}
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
        {showRegistrationModal && (
          <RegirstrationModal
            onClose={() => setShowRegistrationModal(false)}
            isOpen={showRegistrationModal}
            message={ModalMessage.ENQUIRY_MESSAGE}
            regirsterFor={
              selecteCategory === "6-12"
                ? workshop.BUDDY_CAMP
                : selecteCategory === "13-19"
                ? workshop.TEEN_CAMP
                : selecteCategory === "20+"
                ? workshop.CAREER_CORNER
                : ""
            }
          />
        )}
        {showEnquiryModal && (
          <EnquiryModal
            isOpen={showEnquiryModal}
            onClose={() => setShowEnquiryModal(false)}
            message={ModalMessage.ENQUIRY_MESSAGE}
          />
        )}
      </div>
    </>
  );
};

export default Workshopv2;

const WorkShopChallenges = () => {
  return (
    <div className="relative flex-col items-center justify-center p-4 pb-24 ">
      <div className="absolute top-0 left-4 md:left-8">
        <img
          src="/assets/workshopv2/workshop-yellow-pattern.png"
          alt="challenges"
          className="w-16 h-16 md:w-24 md:h-24"
        />
      </div>
      <div className="absolute top-0 right-4 md:right-8">
        <img
          src="/assets/workshopv2/workshop-green-pattern.png"
          alt="challenges"
          className="w-16 h-16 md:w-24 md:h-24"
        />
      </div>
      <div className="absolute bottom-0 left-4 md:left-8">
        <img
          src="/assets/workshopv2/workshop-red-pattern.png"
          alt="challenges"
          className="w-16 h-16 md:w-24 md:h-24"
        />
      </div>
      <div className="absolute bottom-0 right-4 md:right-8">
        <img
          src="/assets/workshopv2/workshop-blue-pattern.png"
          alt="challenges"
          className="w-16 h-16 md:w-24 md:h-24"
        />
      </div>
      <div className="w-full">
        <h2 className="pt-6 pb-12 text-3xl font-semibold text-center md:pb-24 md:text-4xl">
          Challenges faced by Kids Today!
        </h2>

        <div className="flex flex-col flex-wrap items-center justify-around gap-8 px-4 md:flex-row md:gap-4 md:px-12">
          {[
            {
              title: "Mobile Addiction",
              description:
                "Kids are spending too much time on social media platforms like Instagram, TikTok, and Snapchat.",
              image: "/assets/workshopv2/workshop-mobile-addiction.png",
            },
            {
              title: "Gaming Addiction",
              description:
                "Kids are spending too much time on social media platforms like Instagram, TikTok, and Snapchat.",
              image: "/assets/workshopv2/workshop-gaming-addiction.png",
            },
            {
              title: "Social Media Addiction",
              description:
                "Kids are spending too much time on social media platforms like Instagram, TikTok, and Snapchat.",
              image: "/assets/workshopv2/workshop-social-media-addiction.png",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center w-full gap-4 md:w-auto"
            >
              <div className="w-48 h-48 md:w-64 md:h-64">
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-contain w-full h-full"
                />
              </div>
              <h3 className="text-lg font-medium text-center md:text-xl">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WorkshopActivities = () => {
  return (
    <div className="bg-gradient-to-b from-white to-[#FFDA9A] w-full pb-10">
      <h2 className="pt-6 pb-12 text-3xl font-semibold text-center md:pb-24 md:text-4xl">
        What We Do In Our Workshops
      </h2>
      <div className="flex flex-wrap justify-around gap-4 pb-10">
        {[
          {
            title: "Painting Session for Kids",
            image: "/assets/workshopv2/panting-session.png",
          },
          {
            title: "Mindfulness Session for Age 6-12",
            image: "/assets/workshopv2/mindfullness.png",
          },
          {
            title: "Social Media Detox Workshop",
            image: "/assets/workshopv2/social-media-detox.png",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-4"
          >
            <img src={item.image} alt={item.title} />
            <h3 className="text-xl font-semibold">{item.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

const WorkshopInfoCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="relative">
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {[
            {
              title: "Workshops Held For Ages 6-12",
              age: "6-12",
              focus:
                "Reducing screen dependency, encouraging creativity and empathy",
              activities: [
                "Story-based lessons",
                "Digital-free play challenges",
                "Painting & role-playing to understand emotions",
              ],
              image: "/assets/workshopv2/workshop-carousel-1.png",
            },
            {
              title: "Workshops Held For Ages 13-19",
              age: "13-19",
              focus: "Breaking free from gaming & social media cycles",
              activities: [
                "Guided journaling",
                "Social detox challenges",
                "Peer-led discussion circles",
              ],
              image: "/assets/workshopv2/workshop-carousel-2.png",
            },
            {
              title: "Workshops Held For Ages 20+",
              age: "20+",
              focus:
                "Managing content overload, improving attention & emotional clarity",
              activities: [
                "Digital self-assessment",
                "Dopamine detox exercises",
                "Habit loop rewiring",
              ],
              image: "/assets/workshopv2/workshop-carousel-3.png",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center md:items-start justify-center gap-4 min-w-full min-h-[500px] px-4 py-8 md:py-0"
            >
              <div className="flex flex-col flex-1 order-2 max-w-2xl gap-4 md:order-1">
                <h3 className="pb-4 text-3xl font-semibold text-center md:pb-8 md:text-5xl md:text-left">
                  Workshop Held for{" "}
                  <span
                    className={`${
                      item.age === "6-12"
                        ? "text-[#EC9600]"
                        : item.age === "13-19"
                        ? "text-[#007AFF]"
                        : "text-red-600"
                    }`}
                  >
                    Age {item.age}
                  </span>
                </h3>
                <p className="pb-4 text-lg font-medium text-center md:text-xl md:text-left">
                  <span className="font-semibold">Focus:</span> {item.focus}
                </p>
                <ul className="space-y-2 font-semibold">
                  <h4 className="pb-4 text-xl font-semibold text-center md:text-left">
                    Activities:
                  </h4>
                  {item.activities.map((activity, index) => (
                    <li
                      key={index}
                      className="pl-4 text-base text-center list-disc list-inside md:text-lg md:text-left"
                    >
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center flex-1 order-1 w-full max-w-2xl md:justify-end md:order-2 md:w-auto">
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-contain w-full md:w-auto shadow-lg h-[300px] md:h-[400px] rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : 2))}
          className="absolute z-10 p-2 -translate-y-1/2 rounded-full shadow-lg left-2 md:left-4 top-1/2 bg-white/80 hover:bg-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 md:w-6 md:h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev < 2 ? prev + 1 : 0))}
          className="absolute z-10 p-2 -translate-y-1/2 rounded-full shadow-lg right-2 md:right-4 top-1/2 bg-white/80 hover:bg-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 md:w-6 md:h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
        <div className="absolute flex gap-2 -translate-x-1/2 bottom-4 left-1/2">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
                currentSlide === index ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
