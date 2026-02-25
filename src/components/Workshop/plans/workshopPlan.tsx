import { WorkshopPlan } from "@/types/workshopsV2/workshopsV2";
import PlanHeader from "./header";
import PlanCard from "./planCard";
import WorkshopsCategories from "./workshops";
import { fetchAllPlans } from "@/api/workshop/workshop";
import { useStatusModal } from "@/context/adda/statusModalContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDownCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import PlanCarousel from "./PlanCarousel";
import WorkshopBplForm from "@/components/modals/wokshop/WorkshopBplForm";
import { useAuth } from "@clerk/clerk-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { checkAppliedOrNotThunk } from "@/redux/workshop/workshopThunk";

interface CarouselClickType {
  from: string;
  title: string;
}

const WorkshopPlans = () => {
  const [showFAQ, setShowFAQ] = useState(false);
  const [plans, setPlans] = useState<WorkshopPlan[]>([]);
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState<number | null>(
    null,
  );
  const [carouselClick, setCarouselClick] = useState<CarouselClickType | null>(
    null,
  );
  const { userAppliedDetails } = useAppSelector((state) => state.invoice);
  const [bplApplyModal, setBplApplyModal] = useState<boolean>(false);
  const [formStatus, setFormStatus] = useState<string | undefined>(
    userAppliedDetails?.status,
  );
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();

  useEffect(() => {
    setFormStatus(userAppliedDetails?.status ?? "");
  }, [userAppliedDetails]);

  const handleCarouselClick = (from: string, title: string) => {
    setCarouselClick((prev) => {
      if (prev?.from === from && prev?.title === title) {
        return null;
      }

      return { from, title };
    });
  };

  const selectedPlan = plans.find(
    (plan) => plan.duration === carouselClick?.title,
  );

  const navigate = useNavigate();
  const { showStatus } = useStatusModal();

  const planNames = ["Kalakriti", "Instant Katha", "Hasyaras", "Swar"];

  const handlePayClick = (plan: WorkshopPlan) => {
    navigate("/payment", { state: { plan } });
  };

  const fetchUserApplied = async () => {
    const token = await getToken();
    dispatch(checkAppliedOrNotThunk({ token: token as string }));
  };

  const fetchWorkshopPlans = async () => {
    try {
      const response = await fetchAllPlans();
      setPlans(response ?? []);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load plans");
      showStatus("error", err);
    }
  };

  useEffect(() => {
    fetchWorkshopPlans();
    fetchUserApplied();
  }, []);

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
        {/* FAQ floating button */}
        <motion.img
          src="/assets/workshopv2/growth.png"
          alt="growth illustration"
          className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain"
          initial={{ opacity: 0, x: -40, scale: 0.85 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <div className="flex justify-end sticky top-20 z-20 -mb-4">
          <button
            onClick={() => setShowFAQ(true)}
            className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 hover:from-orange-600 hover:via-orange-500 hover:to-orange-700 border-2 border-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group overflow-hidden"
            aria-label="Open Frequently Asked Questions"
          >
            {/* ... same beautiful rotating FAQ button ... */}
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

        <PlanCarousel
          handleCarouselClick={(from, title) =>
            handleCarouselClick(from, title)
          }
          carouselClick={carouselClick}
        />

        {/* Special Offer Banner */}
        {carouselClick?.from === "offer" && (
          <div className="md:grid grid-cols-2">
            <div className="flex justify-center px-4">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-sm sm:max-w-md rounded-2xl border-4 border-[#00b8fe] bg-[#d1f1ff] p-8 md:p-10 shadow-xl overflow-hidden"
              >
                {/* Decorative Background Effects */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -translate-y-32 translate-x-32 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-52 h-52 bg-white/20 rounded-full translate-y-28 -translate-x-28 blur-2xl" />

                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                  <div className="bg-[#1bd070] text-white px-6 py-2 rounded-full text-sm font-bold shadow-md animate-pulse">
                    DigiLocker Verified Required
                  </div>
                  <span className="inline-block bg-white text-[#00b8fe] px-5 py-2 rounded-full text-xs md:text-sm font-semibold uppercase tracking-wider shadow-sm">
                    Exclusive Benefit
                  </span>

                  <div className="space-y-3">
                    <h2 className="text-4xl lg:text-6xl font-extrabold text-[#00b8fe] leading-none">
                      70% OFF
                    </h2>

                    <h3 className="text-lg sm:text-2xl font-bold text-gray-800">
                      For BPL Families
                    </h3>
                  </div>

                  {/* Divider */}
                  <div className="w-16 h-1 bg-[#00b8fe] rounded-full" />

                  {/* Description */}
                  <div className="space-y-2">
                    <p className="text-gray-700 text-base md:text-lg">
                      Submit your valid Digilocker BPL document
                    </p>
                    <p className="text-sm text-gray-600 font-medium">
                      Approval within 7 days
                    </p>
                  </div>

                  {!formStatus && (
                    <button
                      className="mt-4 bg-[#00b8fe] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300"
                      onClick={() => setBplApplyModal(true)}
                    >
                      Apply Now
                    </button>
                  )}

                  {formStatus === "Pending" && (
                    <div className="mt-4 bg-yellow-100 text-yellow-700 px-6 py-3 rounded-lg font-semibold shadow-sm">
                      ⏳ Your application is under review
                    </div>
                  )}

                  {formStatus === "Approved" && (
                    <div className="mt-4 bg-green-100 text-green-700 px-6 py-3 rounded-lg font-semibold shadow-sm">
                      ✅ Your BPL verification is approved
                    </div>
                  )}

                  {formStatus === "Rejected" && (
                    <button
                      className="mt-4 bg-red-100 text-red-700 px-6 py-3 rounded-lg font-semibold shadow-sm hover:bg-red-200 transition"
                      onClick={() => setBplApplyModal(true)}
                    >
                      Reapply Now
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
            <div className="flex items-center justify-center">
              <motion.img
                src="/assets/workshopv2/jar.png"
                alt="jar illustration"
                className=" w-[500px] h-[500px]  object-contain"
                initial={{ opacity: 0, x: -40, scale: 0.85 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="">
          <PlanCard plan={selectedPlan} onPayClick={handlePayClick} />
        </div>
      </div>

      {/* FAQ Modal */}
      <AnimatePresence>
        {showFAQ && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowFAQ(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
            >
              <div className="w-full max-w-3xl max-h-[85vh] rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-white to-orange-50 shadow-2xl overflow-hidden flex flex-col">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                      Frequently Asked Questions
                    </h1>
                    <p className="text-orange-100 mt-3 text-sm md:text-base flex flex-wrap gap-2">
                      {planNames.map((name) => (
                        <span
                          key={name}
                          className="px-3 py-1 rounded-xl bg-white/15 font-semibold"
                        >
                          {name}
                        </span>
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
                  {FAQ.map((item, i) => (
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
                          {item.q}
                        </span>
                        <motion.div
                          animate={{
                            rotate: currentVisibleIndex === i ? 180 : 0,
                          }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
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
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 md:p-5 pt-0 md:pt-2 text-gray-600 leading-relaxed border-t border-orange-100">
                              {item.ans}
                              {item.link && (
                                <a
                                  href={item.link}
                                  className="text-blue-700 hover:underline block mt-2"
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
      {bplApplyModal && (
        <WorkshopBplForm
          onClose={() => setBplApplyModal(false)}
          onUpdateStatus={() => setFormStatus("Pending")}
        />
      )}
    </>
  );
};

export default WorkshopPlans;
