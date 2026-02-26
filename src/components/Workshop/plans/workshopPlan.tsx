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
import FaqButton from "@/components/common/faqButton";
import FAQCommon from "@/components/adda/faq";

const WorkshopPlans = () => {
  const [showFAQ, setShowFAQ] = useState(false);
  const [plans, setPlans] = useState<WorkshopPlan[]>([]);

  const navigate = useNavigate();
  const { showStatus } = useStatusModal();

  const planNames = ["Kalakriti", "Instant Katha", "Hasyaras", "Swar"];

  const handlePayClick = (plan: WorkshopPlan) => {
    navigate("/payment", { state: { plan } });
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
          </div>
        </div>

        <div className="flex items-start justify-center gap-10 flex-wrap">
          {plans.length > 0 ? (
            plans.map((plan, index) => (
              <PlanCard key={index} plan={plan} onPayClick={handlePayClick} />
            ))
          ) : (
            <p className="text-gray-500 text-lg">Loading plans...</p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showFAQ && (
          <FAQCommon FAQ={FAQ} setShowFAQ={setShowFAQ} planNames={planNames} />
        )}
      </AnimatePresence>
    </>
  );
};

export default WorkshopPlans;
