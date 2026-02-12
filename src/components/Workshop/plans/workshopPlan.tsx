import { WorkshopPlan } from "@/types/workshopsV2/workshopsV2";
import PlanHeader from "./header";
import PlanCard from "./planCard";
import WorkshopsCategories from "./workshops";
// import { WORKSHOP_PLANS } from "@/constant/adda/quiz";
import { WorkshopPlan as WorkshopPlanType } from "@/types/workshop";
import { useNavigate } from "react-router-dom";
import { ChevronDownCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchAllPlans } from "@/api/workshop/workshop";

const WorkshopPlans = () => {
  const [showFAQ, setShowFAQ] = useState(false);
  const [plans, setPlans] = useState<WorkshopPlan[] | []>([]);
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState<number | null>(
    null,
  );

  const fetchWorkshopPlan = async () => {
    try {
      const response = await fetchAllPlans();
      setPlans(response);
    } catch (err) {
      toast.error(err as string);
    }
  };

  useEffect(() => {
    fetchWorkshopPlan();
  }, []);

  const planNames = ["Kalakriti", "Instant Katha", "Hasyaras", "Swar"];
  const navigate = useNavigate();

  const handlePayClick = (plan: WorkshopPlanType) => {
    navigate("/payment", { state: { plan } });
  };

  const FAQ = [
    {
      q: "Will I receive a certificate after completing the workshop?",
      ans: "Yes, all participants will receive a certificate of participation upon successful completion of the workshop.",
    },
    {
      q: "Is the workshop conducted online or offline?",
      ans: "The workshop is available in both online and offline modes, so you can choose the format that works best for you.",
    },
    {
      q: "Do you provide training materials?",
      ans: "Yes, We provide downloadable training materials. Participants can download and print them for easy reference during and after the workshop.",
      link: "#",
    },
    {
      q: "What payment options are available?",
      ans: "We offer multiple payment options for your convenience. Details will be shared during the registration process.",
    },
    {
      q: "Who will be conducting the workshop?",
      ans: "The workshops are conducted by qualified Child Psychologists and Psychologists with hands-on experience in working with children and adolescents.",
    },
    {
      q: "What are the age groups eligible to join the workshop?",
      ans: "The workshop is designed for the following age groups: 6 – 12 years, 13 – 19 years",
    },
  ];

  return (
    <>
      <div className="relative lg:my-20 mb-10 md:mb-0 mx-4 md:mx-10 lg:mx-20 space-y-10">
        <div className="flex justify-end sticky top-20 z-20 -mb-4">
          <button
            onClick={() => setShowFAQ(true)}
            className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 hover:from-orange-600 hover:via-orange-500 hover:to-orange-700 border-2 border-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group overflow-hidden"
            aria-label="Open Frequently Asked Questions"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:animate-spin" />
            <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping opacity-0 group-hover:opacity-75" />
            <svg
              className="absolute inset-0 w-full h-full p-1 -rotate-90 group-hover:rotate-0 transition-transform duration-700 ease-out"
              viewBox="0 0 100 100"
            >
              <defs>
                <path
                  id="circlePath"
                  d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="none"
                />
              </defs>
              <text
                className="text-[16px] md:text-[20px] fill-white font-bold tracking-[0.2em] uppercase"
                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
              >
                <textPath
                  href="#circlePath"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  • FAQ • FAQ •
                </textPath>
              </text>
            </svg>

            <span className="relative text-3xl md:text-4xl text-white font-bold z-10 group-hover:scale-125 transition-transform duration-300">
              ?
            </span>
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg">
              View FAQ
              <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900" />
            </span>
          </button>
        </div>

        <PlanHeader />
        <WorkshopsCategories />

        <div className="relative overflow-hidden rounded-2xl bg-black p-4 md:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>

          <div className="relative z-10 text-center">
            <div className="inline-block mb-4">
              <span className="bg-white text-orange-600 px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
                Special Offer
              </span>
            </div>

            <h2 className="text-2xl md:text-5xl font-extrabold text-white mb-2 md:mb-4 drop-shadow-lg">
              70% OFF for BPL Families
            </h2>

            <p className="text-white text-lg md:text-xl mb-6 max-w-3xl mx-auto">
              We believe every child deserves quality education. Below Poverty
              Line (BPL) families can avail
              <span className="font-bold"> 70% discount</span> on all workshop
              plans!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">Submit BPL Card</span>
              </div>
            </div>

            <p className="text-white/90 text-sm mt-4">
              * BPL card verification/Authentication required at checkout
            </p>
          </div>
        </div>

        <div className="flex items-start justify-center gap-10 flex-wrap">
          {plans && plans.length > 0 && (
            <>
              {plans.map((plan, index) => (
                <PlanCard key={index} plan={plan} onPayClick={handlePayClick} />
              ))}
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showFAQ && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowFAQ(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] top-0 left-0 right-0 bottom-0 w-screen h-screen"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-[9999] p-4"
            >
              <div className="w-full max-w-3xl max-h-[85vh] rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-white to-orange-50 shadow-2xl overflow-hidden flex flex-col">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                      Frequently Asked Questions
                    </h1>
                    <p className="text-orange-100 mt-1 text-sm md:text-base flex items-center justify-start gap-3 mt-3">
                      {planNames.map((data) => (
                        <div className="px-3 py-1 rounded-xl bg-white/15 font-semibold">
                          {data}
                        </div>
                      ))}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowFAQ(false)}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
                    aria-label="Close FAQ"
                  >
                    <X className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-3">
                  {FAQ.map((data, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-orange-100"
                    >
                      <button
                        onClick={() =>
                          setCurrentVisibleIndex(
                            currentVisibleIndex === i ? null : i,
                          )
                        }
                        className="w-full p-4 md:p-5 flex justify-between items-center text-left hover:bg-orange-50 transition-colors duration-200 group"
                        aria-expanded={currentVisibleIndex === i}
                      >
                        <span className="text-base md:text-lg font-semibold text-gray-800 pr-4 group-hover:text-orange-600 transition-colors duration-200">
                          {data.q}
                        </span>

                        <motion.div
                          animate={{
                            rotate: currentVisibleIndex === i ? 180 : 0,
                          }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="flex-shrink-0"
                        >
                          <ChevronDownCircle className="w-6 h-6 text-orange-500" />
                        </motion.div>
                      </button>

                      <AnimatePresence initial={false}>
                        {currentVisibleIndex === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.3,
                              ease: "easeInOut",
                            }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 md:p-5 pt-0 md:pt-2 text-gray-600 leading-relaxed border-t border-orange-100">
                              {data.ans}
                              {data.link && (
                                <a
                                  href={data.link}
                                  className="text-blue-700 hover:underline"
                                >
                                  Click here to download
                                </a>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default WorkshopPlans;
