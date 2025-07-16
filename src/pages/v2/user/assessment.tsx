import AssessmentCards from "@/components/assessment/assessmentCards";
import DiscoverYourself from "@/components/assessment/discoverYourself";
import SampleReport from "@/components/assessment/sampleRepoert";
import WeAreHiring from "@/components/assessment/weAreHiring";
import { HIRING } from "@/constant/constants";
import { FAQ_ASSESSMENT } from "@/constant/faq";
import useInView from "@/hooks/useInView";
import { fetchProducts } from "@/redux/productSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Hiring } from "@/types";
import { ProductType } from "@/utils/enum";
import { useAuth } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FAQ from "./faq/faq";
import Quiz from "@/components/assessment/quiz/quiz";

const Assessment = () => {
  const [hiring, setHiring] = useState<Hiring[] | []>([]);
  const [activeTab, setActiveTab] = useState<"assessments" | "quiz">(
    "assessments"
  );

  useEffect(() => {
    setHiring(HIRING);
  }, []);

  const { getToken } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const { items: products } = useSelector((state: RootState) => state.products);
  const isMobile = window.innerWidth < 768;
  const { ref, isInView } = useInView(isMobile ? 0.1 : 0.3, false);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const token = await getToken();
        const assessment = await dispatch(
          fetchProducts({
            type: ProductType.ASSESSMENT,
            token: token!,
          })
        );
        console.log("Assessment", assessment.payload);
      } catch (error: unknown) {
        console.error("Error fetching products:", error);
      }
    };

    fetchAssessments();
  }, [dispatch, getToken]);

  const buttonVariants = {
    initial: { scale: 1, y: 0 },
    hover: {
      scale: 1.05,
      y: -2,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  };

  const tabIndicatorVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <>
      <DiscoverYourself />
      <SampleReport />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-start justify-between gap-10 p-5 mt-20 lg:flex-row md:p-10 lg:p-15"
      >
        <div className="w-full lg:w-3/4">
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            className="max-w-xl mx-auto my-6 flex justify-center"
          >
            <div className="relative flex bg-gray-100 rounded-2xl p-2 shadow-inner">
              {/* Animated background slider */}
              <motion.div
                className="absolute top-2 bottom-2 bg-white rounded-xl shadow-lg"
                initial={false}
                animate={{
                  left: activeTab === "assessments" ? "8px" : "50%",
                  right: activeTab === "assessments" ? "50%" : "8px",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />

              {/* Assessment Button */}
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => setActiveTab("assessments")}
                className={`relative z-10 px-8 py-4 font-semibold rounded-xl transition-all duration-300 ${
                  activeTab === "assessments"
                    ? "text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-blue-500"
                }`}
              >
                <motion.span
                  variants={itemVariants}
                  className="flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Assessments
                </motion.span>

                {/* Active indicator */}
                <AnimatePresence>
                  {activeTab === "assessments" && (
                    <motion.div
                      variants={tabIndicatorVariants}
                      initial="initial"
                      animate="animate"
                      exit="initial"
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full"
                    />
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Quiz Button */}
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => setActiveTab("quiz")}
                className={`relative z-10 px-8 py-4 font-semibold rounded-xl transition-all duration-300 ${
                  activeTab === "quiz"
                    ? "text-green-600 shadow-sm"
                    : "text-gray-600 hover:text-green-500"
                }`}
              >
                <motion.span
                  variants={itemVariants}
                  className="flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Quiz
                </motion.span>

                {/* Active indicator */}
                <AnimatePresence>
                  {activeTab === "quiz" && (
                    <motion.div
                      variants={tabIndicatorVariants}
                      initial="initial"
                      animate="animate"
                      exit="initial"
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-600 rounded-full"
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>

          {/* Content area with animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "assessments" ? (
                <AssessmentCards
                  assessmentData={products}
                  isInView={isInView}
                />
              ) : (
                <div className="text-center py-20">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="bg-gradient-to-r from-green-50 to-green-100 p-8 rounded-2xl"
                  >
                    <Quiz />
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center justify-start w-full gap-10 p-3 lg:w-1/4">
          <WeAreHiring hiring={hiring} />
        </div>
      </motion.div>

      <FAQ data={FAQ_ASSESSMENT} />
    </>
  );
};

export default Assessment;
