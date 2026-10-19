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
import FaqButton from "@/components/common/faqButton";
import FAQCommon from "@/components/adda/faq";

interface CarouselClickType {
  from: string;
  title: string;
}

// Comic-paper halftone dots
const halftone = {
  backgroundColor: "#fff3b0",
  backgroundImage: "radial-gradient(#f2c200 1.6px, transparent 1.7px)",
  backgroundSize: "16px 16px",
};

const comicBtn =
  "font-comic text-xl tracking-widest text-black border-4 border-black shadow-[4px_4px_0_#000] px-6 py-2 transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#000] active:translate-y-1 active:shadow-none";

const WorkshopPlans = () => {
  const [showFAQ, setShowFAQ] = useState(false);
  const [plans, setPlans] = useState<WorkshopPlan[]>([]);
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
      <div
        className="relative px-4 md:px-10 lg:px-20 py-10 lg:py-20"
        style={halftone}
      >
        <div className="relative space-y-10">
          <motion.img
            src="/assets/workshopv2/growth.png"
            alt="growth illustration"
            className="pointer-events-none absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain"
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

          <div className="relative">
            {/* Special Offer Banner */}
            {carouselClick?.from === "offer" && (
              <div className="md:grid grid-cols-2 gap-6 items-center">
                <div className="flex justify-center px-4">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full max-w-sm sm:max-w-md bg-[#d1f1ff] border-4 border-black shadow-[8px_8px_0_#000] p-8 md:p-10 -rotate-1"
                  >
                    <div className="flex flex-col items-center text-center space-y-5">
                      <div className="font-comic text-lg tracking-wider bg-[#2ed47a] text-black border-2 border-black shadow-[3px_3px_0_#000] px-5 py-1 rotate-2">
                        DigiLocker verified required
                      </div>
                      <span className="font-comic text-base tracking-wider bg-white text-black border-2 border-black px-4 py-0.5">
                        Exclusive benefit
                      </span>

                      <div className="space-y-2">
                        <h2
                          className="font-comic-chip text-6xl lg:text-7xl leading-none tracking-wide text-[#ff4b3e]"
                          style={{
                            WebkitTextStroke: "3px #000",
                            paintOrder: "stroke fill",
                            textShadow: "4px 4px 0 #000",
                          }}
                        >
                          70% OFF
                        </h2>

                        <h3 className="font-comic text-2xl sm:text-3xl tracking-wider text-gray-900">
                          For BPL Families
                        </h3>
                      </div>

                      {/* Divider */}
                      <div className="w-20 h-1.5 bg-black" />

                      {/* Description */}
                      <div className="space-y-2">
                        <p className="text-gray-800 text-base md:text-lg">
                          Submit your valid Digilocker BPL document
                        </p>
                        <p className="font-comic text-lg tracking-wider text-gray-700">
                          Approval within 7 days
                        </p>
                      </div>

                      {!formStatus && (
                        <button
                          className={`${comicBtn} bg-[#00b8fe]`}
                          onClick={() => setBplApplyModal(true)}
                        >
                          Apply Now
                        </button>
                      )}

                      {formStatus === "Pending" && (
                        <div className="font-comic text-xl tracking-wider bg-[#ffe66d] text-black border-4 border-black px-6 py-2">
                          ⏳ Your application is under review
                        </div>
                      )}

                      {formStatus === "Approved" && (
                        <div className="font-comic text-xl tracking-wider bg-[#b9f5d0] text-black border-4 border-black px-6 py-2">
                          ✅ Your BPL verification is approved
                        </div>
                      )}

                      {formStatus === "Rejected" && (
                        <button
                          className={`${comicBtn} bg-[#ff4b3e]`}
                          onClick={() => setBplApplyModal(true)}
                        >
                          Reapply Now
                        </button>
                      )}
                    </div>
                  </motion.div>
                </div>
                <div className="flex items-center justify-center mt-8 md:mt-0">
                  <motion.img
                    src="/assets/workshopv2/jar.png"
                    alt="jar illustration"
                    className="w-full max-w-[420px] md:max-w-[500px] h-auto object-contain"
                    initial={{ opacity: 0, x: -40, scale: 0.85 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}

            {/* Selected plan */}
            <PlanCard plan={selectedPlan} onPayClick={handlePayClick} />
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
