import ComicsSection from "@/components/Home/ComicsSection";
// import FeelFree from "@/components/Home/FeelFree";
import HeroBanner from "@/components/Home/HeroBanner";
// import MdMultiverse from "@/components/Home/MdMultiverse";
import Struggles from "@/components/Home/Struggles";
// import PricingPlan from "@/components/shared/Pricing-Plan";
// import WhatWeOffer from "@/components/Home/WhatWeOffer";

const Home = () => {
  return (
    <div className="h-full w-full">
      <HeroBanner />
      <Struggles />
      {/* <MdMultiverse /> */}
      {/* <WhatWeOffer /> */}
      {/* <FeelFree /> */}
      <ComicsSection />
      {/* <section id='pricing'>
        <PricingPlan />
      </section> */}
    </div>
  );
};

export default Home;
