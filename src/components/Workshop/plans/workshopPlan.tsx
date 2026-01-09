import { WorkshopPlan } from "@/types/workshopsV2/workshopsV2";
import PlanHeader from "./header";
import PlanCard from "./planCard";
import WorkshopsCategories from "./workshops";
import { WORKSHOP_PLANS } from "@/constant/adda/quiz";
import { WorkshopPlan as WorkshopPlanType } from "@/types/workshop";
import { useNavigate } from "react-router-dom";

const WorkshopPlans = ({ plans }: { plans?: WorkshopPlan[] }) => {
  const navigate = useNavigate();

  const handlePayClick = (plan: WorkshopPlanType) => {
    navigate("/payment", { state: { plan } });
  };

  return (
    <div className="lg:my-20 mb-10 md:mb-0  mx-5 md:mx-20 space-y-10">
      <PlanHeader />
      <WorkshopsCategories />

      <div className="relative overflow-hidden rounded-2xl bg-black p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>

        <div className="relative z-10 text-center">
          <div className="inline-block mb-4">
            <span className="bg-white text-orange-600 px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
              Special Offer
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
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
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-semibold">Available on all plans</span>
            </div>

            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-semibold">Apply during checkout</span>
            </div>
          </div>

          <p className="text-white/90 text-sm mt-4">
            * BPL card verification required at checkout
          </p>
        </div>
      </div>

      <div className="flex items-start justify-center gap-10 flex-wrap">
        {plans && plans.length > 0 ? (
          <>
            {plans.map((plan, index) => (
              <PlanCard key={index} plan={plan} onPayClick={handlePayClick} />
            ))}
          </>
        ) : (
          <>
            {WORKSHOP_PLANS.map((plan, index) => (
              <PlanCard key={index} plan={plan} onPayClick={handlePayClick} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default WorkshopPlans;
