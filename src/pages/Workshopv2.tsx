import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "sonner";
import { BiSolidMessage } from "react-icons/bi";
import EnquiryModal from "@/components/modals/EnquiryModal";
import RegirstrationModal from "@/components/modals/RegistrationModal";
import FAQCard from "@/components/shared/FAQSection/FAQCard";
import WorkshopActivities from "@/components/Workshop/activities";
import WorkshopBanner from "@/components/Workshop/banner/banner";
import WorkshopInfoCarousel from "@/components/Workshop/carousal";
import WorkShopChallenges from "@/components/Workshop/challenges/challenges";
import { WORKSHOP_FAQ } from "@/constant";
import { WorkshopCategory } from "@/types";
import { ModalMessage } from "@/utils/enum";
import { useSearchParams } from "react-router-dom";
import AboutWorkshop from "@/components/Workshop/about";
import ErrorModal from "@/components/adda/modal/error";
import WorkshopPlans from "@/components/Workshop/plans/workshopPlan";

const Workshopv2 = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);
  const [selectedWorkshopIndex, setSelectedWorkshopIndex] = useState<number>(0);
  const [categories, setCategories] = useState<WorkshopCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [enquiryEmail, setEnquiryEmail] = useState("");
  const [enquiryName, setEnquiryName] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const [user, setUser] = useState<any>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const { getToken } = useAuth();
  const { user: clerkUser } = useUser();
  const [searchParams] = useSearchParams();
  const workshopName = searchParams.get("category");
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    message: "",
    workshop: "",
    ageCategory: "",
    doubt: "",
  });

  useEffect(() => {
    setEnquiryEmail(user?.email || "");
    setEnquiryName(user?.name || "");
  }, [user]);

  const fetchWorkshops = useCallback(async () => {
    try {
      const token = await getToken();
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/workshop/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const fetchedCategories = response.data.data as WorkshopCategory[];
      setCategories(fetchedCategories);

      if (
        fetchedCategories.length > 0 &&
        fetchedCategories[0].workshops.length > 0
      ) {
        let initialCategoryIndex = 0;
        let initialWorkshopIndex = 0;
        let initialWorkshopName =
          fetchedCategories[0].workshops[0].workshopName;

        if (workshopName) {
          for (let i = 0; i < fetchedCategories.length; i++) {
            const workshopIndex = fetchedCategories[i].workshops.findIndex(
              (w) => w.workshopName === workshopName,
            );
            if (workshopIndex !== -1) {
              initialCategoryIndex = i;
              initialWorkshopIndex = workshopIndex;
              initialWorkshopName =
                fetchedCategories[i].workshops[workshopIndex].workshopName;
              break;
            }
          }
        }

        setSelectedCategory(initialWorkshopName);
        setSelectedCategoryIndex(initialCategoryIndex);
        setSelectedWorkshopIndex(initialWorkshopIndex);
        setCurrentSlide(initialCategoryIndex);
        setFormData((prev) => ({
          ...prev,
          workshop: initialWorkshopName,
          ageCategory:
            fetchedCategories[initialCategoryIndex].workshops[
              initialWorkshopIndex
            ]?.ageGroups[0]?.ageRange || "",
        }));
      } else {
        setSelectedCategory("");
        setSelectedCategoryIndex(0);
        setSelectedWorkshopIndex(0);
        setCurrentSlide(0);
        setFormData((prev) => ({
          ...prev,
          workshop: "",
          ageCategory: "",
        }));
        toast.error("No workshops available");
      }
    } catch (error) {
      console.error("Error fetching workshops:", error);
      toast.error("Failed to fetch workshops");
    } finally {
      setLoading(false);
    }
  }, [workshopName]);

  const fetchUser = useCallback(async () => {
    try {
      const token = await getToken();
      if (!clerkUser?.id || !token) {
        return null;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/user/user/${clerkUser?.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
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
    fetchWorkshops();
  }, [fetchWorkshops]);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await fetchUser();
      if (userData) {
        setUser(userData);
        setFormData((prev) => ({
          ...prev,
          firstname: userData?.name?.split(" ")[0] || "",
          lastname: userData?.name?.split(" ")[1] || "",
          email: userData?.email || "",
          phone: userData?.phoneNumber || "",
        }));
      }
    };
    fetchData();
  }, [fetchUser, clerkUser]);

  useEffect(() => {
    if (workshopName && categories.length > 0 && carouselRef.current) {
      let found = false;
      for (let i = 0; i < categories.length; i++) {
        const workshopIndex = categories[i].workshops.findIndex(
          (w) => w.workshopName === workshopName,
        );
        if (workshopIndex !== -1) {
          setSelectedCategoryIndex(i);
          setSelectedWorkshopIndex(workshopIndex);
          setSelectedCategory(
            categories[i].workshops[workshopIndex].workshopName,
          );
          setCurrentSlide(i);
          carouselRef.current.scrollIntoView({ behavior: "smooth" });
          found = true;
          break;
        }
      }
      if (
        !found &&
        categories.length > 0 &&
        categories[0].workshops.length > 0
      ) {
        setSelectedCategory(categories[0].workshops[0].workshopName);
        setSelectedCategoryIndex(0);
        setSelectedWorkshopIndex(0);
        setCurrentSlide(0);
      }
    }
  }, [workshopName, categories]);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectedCategory = (
    category: string,
    categoryIndex: number,
    workshopIndex: number,
  ) => {
    setSelectedCategory(category);
    setSelectedCategoryIndex(categoryIndex);
    setSelectedWorkshopIndex(workshopIndex);
    setCurrentSlide(categoryIndex);
    const selectedWorkshop =
      categories[categoryIndex]?.workshops[workshopIndex];
    setFormData((prev) => ({
      ...prev,
      workshop: category,
      ageCategory: selectedWorkshop?.ageGroups[0]?.ageRange || "",
    }));
  };

  const handleWorkshopButtonClick = (
    categoryIndex: number,
    // workshopIndex: number
    workshopName: string,
  ) => {
    // const workshopName =
    //   categories[categoryIndex]?.workshops[workshopIndex]?.workshopName || "";
    setSelectedCategory(workshopName);
    setSelectedCategoryIndex(categoryIndex);
    // setSelectedWorkshopIndex(workshopIndex);
    setCurrentSlide(categoryIndex);
    setDirection(categoryIndex > currentSlide ? 1 : -1);
    if (carouselRef.current) {
      carouselRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRegisterationForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await getToken();
    if (formData.message.length < 50) {
      toast.error("Message must be at least 50 characters long");
      return;
    }
    try {
      const workshopRegistrationResponse = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/workshop/submit-form`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (workshopRegistrationResponse.status === 200) {
        setShowRegistrationModal(true);
        setFormData({
          firstname: user?.name?.split(" ")[0] || "",
          lastname: user?.name?.split(" ")[1] || "",
          email: user?.email || "",
          phone: user?.phoneNumber || 0,
          message: "",
          workshop: categories[0]?.workshops[0]?.workshopName || "",
          ageCategory:
            categories[0]?.workshops[0]?.ageGroups[0]?.ageRange || "",
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

  const handleDoubtSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (enquiryMessage.trim().length < 50) {
      setShowErrorModal(true);
      setShowErrorMessage("Message must be at least 50 characters long.");
      return;
    }

    try {
      const queryResponse = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/query`,
        {
          message: enquiryMessage,
          name: enquiryName,
          email: enquiryEmail,
          queryType: "workshop",
        },
      );
      if (queryResponse.status === 201) {
        setEnquiryMessage("");
        setShowEnquiryModal(true);
      }
    } catch (error: any) {
      setEnquiryMessage("");
      setShowErrorModal(true);
      setShowErrorMessage(
        error?.response?.data?.message || "Failed to submit message",
      );
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

  const [registerRef, registerInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [faqRef, faqInView] = useInView({ threshold: 0.2, triggerOnce: true });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-800">
            Loading Workshops...
          </h2>
          <p className="text-gray-600 mt-2">
            Preparing amazing content for you
          </p>
        </div>
      </div>
    );
  }

  if (
    categories.length === 0 ||
    categories.every((category) => category.workshops.length === 0)
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            No Workshops Available
          </h2>
          <p className="text-gray-600 mt-2">
            Please check back later for available workshops.
          </p>
        </div>
      </div>
    );
  }

  const selectedWorkshop =
    categories[selectedCategoryIndex]?.workshops[selectedWorkshopIndex];

  return (
    <>
      {/* Banner */}
      <WorkshopBanner
        categories={categories}
        onWorkshopClick={handleWorkshopButtonClick}
      />
      <div className="">
        <AboutWorkshop categories={categories} />

        {/* Workshop Carousel */}
        <div ref={carouselRef} className="mt-10">
          <WorkshopInfoCarousel
            categories={categories}
            currentCategoryIndex={selectedCategoryIndex}
            currentWorkshopIndex={selectedWorkshopIndex}
            setCurrentCategoryIndex={setSelectedCategoryIndex}
            setCurrentWorkshopIndex={setSelectedWorkshopIndex}
            direction={direction}
            setDirection={setDirection}
          />
        </div>
        <WorkshopPlans />

        {/* Challenges */}
        <WorkShopChallenges />

        {/* Activities */}
        <WorkshopActivities />

        <motion.div
          ref={registerRef}
          initial="hidden"
          animate={registerInView ? "visible" : "hidden"}
          variants={fadeIn}
          className="p-4 md:py-12 bg-orange-400 flex flex-col md:flex-row justify-center"
        >
          <motion.div className="flex flex-col flex-1 h-full">
            <h2 className="pt-4 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-center luckiest-guy-regular text-black [-webkit-text-stroke:_2px_white] w-[90%] mx-auto tracking-widest">
              REGISTER FOR OUR WORKSHOPS HERE
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
                className="object-cover lg:w-[50%]"
              />
            </figure>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex-1 h-full ">
            <motion.div
              variants={scaleIn}
              className="items-start justify-start flex-1 h-full px-2 md:px-6 lg:px-36"
            >
              <form
                className="flex flex-col visible w-full h-full gap-4"
                onSubmit={handleRegisterationForm}
              >
                <div className="box-border space-y-4 lg:space-y-0 lg:flex gap-4">
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
                        border: `2px solid #FFAA15`,
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="lastname" className="text-lg font-semibold">
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
                        border: `2px solid #FFAA15`,
                      }}
                    />
                  </div>
                </div>
                <div className="box-border space-y-4 lg:space-y-0 lg:flex gap-4">
                  <div className="flex-1">
                    <label htmlFor="email" className="text-lg font-semibold">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="email"
                      className="box-border w-full p-3 rounded-lg shadow-xl"
                      style={{
                        border: `2px solid #FFAA15`,
                      }}
                      onChange={handleFormChange}
                      name="email"
                      value={formData.email}
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="phone" className="text-lg font-semibold">
                      Phone
                    </label>
                    <input
                      type="text"
                      placeholder="phone"
                      className="box-border w-full p-3 border-2 rounded-lg shadow-xl"
                      style={{
                        border: `2px solid #FFAA15`,
                      }}
                      onChange={handleFormChange}
                      name="phone"
                      value={formData.phone}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="ageCategory"
                    className="text-lg font-semibold"
                  >
                    Select Age Category
                  </label>
                  <select
                    name="ageCategory"
                    id="ageCategory"
                    value={formData.ageCategory}
                    onChange={handleFormChange}
                    className="box-border w-full p-3 border-2 rounded-lg shadow-xl mt-2"
                    style={{
                      border: `2px solid #FFAA15`,
                    }}
                    disabled={!selectedWorkshop?.ageGroups.length}
                  >
                    {selectedWorkshop?.ageGroups.length ? (
                      selectedWorkshop.ageGroups.map((group, index) => (
                        <option key={index} value={group.ageRange}>
                          Age {group.ageRange}
                        </option>
                      ))
                    ) : (
                      <option value="">No age groups available</option>
                    )}
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="text-lg font-semibold">
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    placeholder="message"
                    className="box-border w-full p-3 border-2 rounded-lg shadow-xl"
                    style={{
                      border: `2px solid #FFAA15`,
                    }}
                    onChange={handleFormChange}
                    value={formData.message}
                  ></textarea>
                </div>
                <div className="flex-1">
                  <label className="text-lg font-semibold">
                    Select Workshop
                  </label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {categories.map((category, catIndex) =>
                      category.workshops.map((workshop, workshopIndex) => (
                        <label
                          key={`${catIndex}-${workshopIndex}`}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="radio"
                            name="category"
                            value={workshop.workshopName}
                            checked={selectedCategory === workshop.workshopName}
                            onChange={() =>
                              handleSelectedCategory(
                                workshop.workshopName,
                                catIndex,
                                workshopIndex,
                              )
                            }
                            className="w-4 h-4"
                          />
                          <span>{workshop.workshopName}</span>
                        </label>
                      )),
                    )}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="py-3 text-xl font-semibold text-white rounded-lg shadow-lg border"
                  style={{
                    backgroundColor: "#FFAA15",
                  }}
                >
                  Submit
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          ref={faqRef}
          initial="hidden"
          animate={faqInView ? "visible" : "hidden"}
          variants={fadeIn}
          className="p-4 md:p-8 md:px-10 lg:px-28 bg-gradient-to-b from-[#FEB977] to-[#FF942E]"
        >
          <motion.h2
            variants={fadeInUp}
            className="pb-6 text-2xl font-semibold"
          >
            Frequently asked questions
          </motion.h2>
          <motion.div variants={fadeInUp} className="lg:flex md:gap-8">
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
                    color="#FFAA15"
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
              <div className="md:px-4 lg:px-8 mx-auto">
                <div className="flex items-center justify-center gap-4 py-2 md:pb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BiSolidMessage
                      className="text-5xl"
                      style={{ color: "#FFAA15" }}
                    />
                  </motion.div>
                </div>
                <div>
                  <h3
                    className="text-xl font-bold md:text-3xl md:pb-4"
                    style={{ color: "#FFAA15" }}
                  >
                    Have Doubts? We are here to help you!
                  </h3>
                  <p className="pt-2 pb-2 text-gray-600 md:text-xl md:pb-6">
                    Contact us for additional help regarding your workshop or
                    purchase made on this platform, We will help you!
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
                          border: `2px solid #FFAA15`,
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
                          border: `2px solid #FFAA15`,
                        }}
                        required
                      />
                    </div>
                    <textarea
                      required
                      name="doubt"
                      id="doubt"
                      value={enquiryMessage}
                      onChange={(e) => setEnquiryMessage(e.target.value)}
                      placeholder="Enter your doubt here"
                      className="box-border w-full p-3 rounded-lg shadow-xl"
                      style={{
                        border: `2px solid #FFAA15`,
                      }}
                    ></textarea>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-3 mt-4 text-xl font-semibold text-white transition-all duration-200 rounded-lg shadow-lg text-ellipsist-white"
                      style={{
                        backgroundColor: "#FFAA15",
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
      {showRegistrationModal && (
        <RegirstrationModal
          onClose={() => setShowRegistrationModal(false)}
          isOpen={showRegistrationModal}
          message={ModalMessage.ENQUIRY_MESSAGE}
          regirsterFor={`${selectedCategory} (${formData.ageCategory})`}
        />
      )}
      {showEnquiryModal && (
        <EnquiryModal
          isOpen={showEnquiryModal}
          onClose={() => setShowEnquiryModal(false)}
          message={ModalMessage.ENQUIRY_MESSAGE}
        />
      )}

      {showErrorModal && (
        <ErrorModal
          heading="Faild to submit query"
          error={showErrorMessage}
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </>
  );
};

export default Workshopv2;
