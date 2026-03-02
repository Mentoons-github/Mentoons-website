import { WorkshopPlan } from "@/types/workshopsV2/workshopsV2";
import PlanHeader from "./header";
import PlanCard from "./planCard";
import WorkshopsCategories from "./workshops";
import { fetchAllPlans } from "@/api/workshop/workshop";
import { useStatusModal } from "@/context/adda/statusModalContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import FaqButton from "@/components/common/faqButton";
import FAQCommon from "@/components/adda/faq";

const WorkshopPlans = () => {
  const [showFAQ, setShowFAQ] = useState(false);
  const [plans, setPlans] = useState<WorkshopPlan[]>([]);
  // const [currentVisibleIndex, setCurrentVisibleIndex] = useState<number | null>(
  //   null,
  // );
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
        <motion.img
          src="/assets/workshopv2/growth.png"
          alt="growth illustration"
          className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain"
          initial={{ opacity: 0, x: -40, scale: 0.85 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <FaqButton setShowFAQ={setShowFAQ} />

        <PlanHeader />
        <WorkshopsCategories />

        <PlanCarousel
          handleCarouselClick={(from, title) =>
            handleCarouselClick(from, title)
          }
          carouselClick={carouselClick}
        />
        <div className="relative overflow-hidden rounded-2xl  p-4 md:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>

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
            <div className="flex items-start justify-center gap-10 flex-wrap">
          
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showFAQ && (
          <FAQCommon FAQ={FAQ} setShowFAQ={setShowFAQ} planNames={planNames} />
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
