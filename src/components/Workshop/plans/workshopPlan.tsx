import PlanHeader from "./header";
import PlanCard from "./planCard";
import WorkshopsCategories from "./workshops";
import { WORKSHOP_PLANS } from "@/constant/adda/quiz";

const WorkshopPlan = () => {
  return (
    <div className="lg:my-20 mb-10 md:mb-0  mx-5 md:mx-20 space-y-10">
      <PlanHeader />
      <WorkshopsCategories />
      <div className="flex items-center justify-evenly gap-8 flex-wrap">
        {WORKSHOP_PLANS.map((plan, index) => (
          <PlanCard key={index} plan={plan} />
        ))}
      </div>
    </div>
  );
};

export default WorkshopPlan;
