import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { motion } from "framer-motion";
import { MYTHOS_PLANS } from "@/constant/constants";
import PlanCards from "./membershipCards";
import useInView from "@/hooks/useInView";

const MembershipPlans = () => {
  const { ref, isInView } = useInView(0.3, false);
  return (
    <section
      ref={ref}
      className="relative w-full px-5 sm:px-10 md:px-20 lg:px-30 py-16 bg-[#1A1D3B] mx-auto overflow-hidden"
    >
      <img
        src="/assets/mythos/planets/AY.png"
        alt="bg-moon"
        className="absolute top-1/2 left-1/2 w-[90%] h-full max-w-none object-cover transform -translate-x-1/2 -translate-y-1/2 z-0 shadow-2xl shadow-black/30"
      />
      <div className="absolute inset-0 bg-[rgba(26,29,59,0.85)] z-0"></div>
      <div className="relative z-[1] text-white text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-montserrat font-semibold text-2xl sm:text-3xl md:text-4xl text-[#E39712]"
        >
          Check Our Membership Plan
        </motion.h1>
        <div className="mt-10 sm:mt-16">
          <div className="block md:hidden">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={15}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={true}
            >
              {MYTHOS_PLANS.map((plan, index) => (
                <SwiperSlide key={index}>
                  <PlanCards plan={plan} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="hidden md:flex justify-center gap-6">
            {MYTHOS_PLANS.map((plan, index) => (
              <PlanCards key={index} plan={plan} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembershipPlans;
