import { WordRotate } from "@/components/magicui/word-rotate";
import EnquiryModal from "@/components/modals/EnquiryModal";
import RegirstrationModal from "@/components/modals/RegistrationModal";
import FAQCard from "@/components/shared/FAQSection/FAQCard";
import WorkshopActivities from "@/components/Workshop/activities";
import WorkshopBanner from "@/components/Workshop/banner/banner";
import WorkshopInfoCarousel from "@/components/Workshop/carousal";
import WorkShopChallenges from "@/components/Workshop/challenges/challenges";
import { WORKSHOP_FAQ, WORKSHOPS } from "@/constant";
import { ModalMessage, workshop } from "@/utils/enum";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { BiSolidMessage } from "react-icons/bi";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

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
  const [user, setUser] = useState<any>();

  const { getToken } = useAuth();
  const { user: clerkUser } = useUser();

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

  const fetchUser = useCallback(async () => {
    try {
      const token = await getToken();
      if (!clerkUser?.id || !token) {
        toast.error("User not authenticated or token not available");
        return null;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/user/user/${clerkUser?.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        return response.data.data;
      } else {
        toast.error("Failed to fetch user data");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data");
      return null;
    }
  }, [getToken, clerkUser]);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await fetchUser();
      if (userData) {
        setUser(userData);
        setFormData({
          firstname: userData?.name?.split(" ")[0] || "",
          lastname: userData?.name?.split(" ")[1] || "",
          email: userData?.email || "",
          phone: userData?.phoneNumber || "",
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
      }
    };
    fetchData();
  }, [fetchUser, clerkUser, selecteCategory]);

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
      } else {
        toast.error("Registration Failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration Failed");
    }
  };

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

  const [headerRef, headerInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [registerRef, registerInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [faqRef, faqInView] = useInView({ threshold: 0.2, triggerOnce: true });

  const handleDoubtSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const queryResponse = await axios.post(
        "https://mentoons-backend-zlx3.onrender.com/api/v1/query",
        {
          message: enquiryMessag,
          name: enquiryName,
          email: enquiryEmail,
          queryType: "workshop",
        }
      );
      if (queryResponse.status === 201) {
        setShowEnquiryModal(true);
      }
    } catch (error) {
      toast.error("Failed to submit message");
    }
  };

  return (
    <div>
      <WorkshopBanner />
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
                className="flex-1 px-8 pt-24 md:px-20"
              >
                <h1 className="text-5xl font-semibold text-primary md:text-8xl min-w-4xl">
                  Workshops At Mentoons
                </h1>
                <div className="mt-3">
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
                <p className="text-xl md:w-[80%] mt-5 pb-8">
                  At Mentoons, we conduct informative and interactive workshops
                  that provide an effective and transformative experience for
                  our participants.
                </p>
                <p className="text-xl md:w-[80%] mt-4 pb-8">
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
            </motion.div>

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
              <motion.div className="flex flex-col flex-1 h-full">
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
                    className="object-cover w-[50%]"
                  />
                </figure>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex-1 h-full my-12 md:flex-1"
              >
                <motion.div
                  variants={scaleIn}
                  className="items-start justify-start flex-1 h-full px-6 lg:px-36"
                >
                  <form
                    className="flex flex-col visible w-full h-full gap-4"
                    onSubmit={handleRegisterationForm}
                  >
                    <div className="box-border flex gap-4">
                      <div className="flex-1">
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
                          value={formData.firstname}
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
                          value={formData.lastname}
                          style={{
                            border: `2px solid ${workshop.registerFormbgColor}`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="box-border flex gap-4">
                      <div className="flex-1">
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
                          value={formData.email}
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
                          value={formData.phone}
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
                        value={formData.message}
                      ></textarea>
                    </div>
                    <div className="flex-1">
                      <label className="text-lg font-semibold">
                        Select Category
                      </label>
                      <div className="flex flex-col gap-3 mt-2">
                        <label className="flex items-center gap-2">
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
                        <label className="flex items-center gap-2">
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
                        <label className="flex items-center gap-2">
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
                          setExpandedIndex(index === expandedIndex ? -1 : index)
                        }
                      />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  variants={scaleIn}
                  className="flex flex-col flex-1 gap-4 p-4 text-center border-2 border-white/80 bg-white/80 md:mb-8 rounded-xl"
                >
                  <div className="w-[80%] mx-auto">
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
                        or purchase made on this platform, We will help you!
                      </p>
                    </div>
                    <div>
                      <form
                        className="flex flex-col w-full gap-4"
                        onSubmit={(e) => handleDoubtSubmission(e)}
                      >
                        <div className="flex gap-4">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Your Name"
                            value={user?.name || enquiryName}
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
                            value={user?.email || enquiryEmail}
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
  );
};

export default Workshopv2;
