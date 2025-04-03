import { PLATINUM, PRIME } from "@/constant/constants";
import useInView from "@/hooks/useInView";
import { motion } from "framer-motion";
import MembershipCard from "../cards/membershipCard";

const Membership = () => {
  const isMobile = window.innerWidth < 768;
  const { ref: sectionRef, isInView } = useInView(isMobile ? 0.1 : 0.3, false);

  return (
    <section className="relative p-6 md:p-10 flex flex-col justify-center overflow-hidden items-center bg-white">
      <motion.div
        className="absolute -top-[25%] -left-[10%] translate-x-[25%] translate-y-[33%] w-[500px] h-[500px] bg-yellow-200 rounded-full"
        animate={{ y: [0, 15, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.img
          src="/assets/home/homepage fillers/klement Homepage Illustration.png"
          alt="klement"
          className="absolute top-2/4 right-0 w-[20rem] hidden xl:block"
        />
      </motion.div>

      <motion.div
        className="absolute top-[40%] -left-[3%] w-32 h-32 bg-[#FFD89C] rounded-full shadow-[inset_-1px_-5px_7px_rgba(0,0,0,0.2)]"
        animate={{ y: [0, 10, 0], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-1/2 -left-[9%] translate-y-[5%] w-[28%] h-[40%] bg-[#FFC66B] rounded-full z-0"
        animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute -bottom-[8%] -left-[5%] translate-y-[5%] w-[28%] h-[40%] bg-[#FFAB40] rounded-full"
        animate={{ y: [0, 12, 0], rotate: [-5, 5, -5] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute -bottom-[8%] -left-[5%] translate-y-[5%] w-[28%] h-[40%] bg-[#FFAB40] rounded-full flex justify-center items-start">
        <img
          src="/assets/payments/payments logo.png"
          alt="payments"
          className="lg:block w-[60%] max-w-[450px] hidden xl:block"
        />
      </div>

      <motion.div
        className="absolute -top-[12%] -right-[9%] w-80 h-80 bg-[#FFF1B3] rounded-full z-3"
        animate={{ y: [0, 20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-[4%] -right-[12%] w-96 h-96 bg-[#FFD27F] rounded-full z-2"
        animate={{ y: [0, 15, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-1/5 -right-[10%] translate-y-5 w-64 h-64 bg-[#FFF9E3] rounded-full z-1"
        animate={{ y: [0, -10, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-1/2 -right-[4%] w-32 h-32 bg-[#FFE8B3] rounded-full shadow-[inset_-1px_-5px_7px_rgba(0,0,0,0.2)] z-0"
        animate={{ y: [0, 12, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-10 -right-[15%] translate-y-1/2 w-[28%] h-[40%] bg-[#FFBF66] rounded-full z-1"
        animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute -bottom-[20%] -right-[5%] translate-y-[5%] w-[28%] h-[40%] bg-yellow-200 rounded-full"
        animate={{ y: [0, 14, 0], rotate: [-4, 4, -4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        id="subscription"
        ref={sectionRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="p-6 md:p-10 flex flex-col justify-center items-center w-full z-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
          transition={{ duration: 0.6, ease: "easeIn" }}
          className="font-semibold text-[28px] md:text-[36px] lg:text-[48px] leading-tight text-gray-800 mb-6 md:mb-8 text-center"
        >
          Membership Plans
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-15 space-y-10 md:space-y-0 w-full max-w-5xl pt-8">
          {[PRIME, PLATINUM].map((data, index) => (
            <MembershipCard membership={data} key={index} />
          ))}
        </div>
        {/* <div className="p-6 md:p-10">
          <h1 className="text-center text-lg md:text-xl font-normal epilogue">
            Pay Through
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-4 place-items-center gap-6 md:gap-10 mx-auto pt-5">
            {[
              "google-pay-icon",
              "paytm-icon",
              "razorpay-icon",
              "master-card-icon",
            ].map((icon, index) => (
              <motion.img
                key={index}
                initial={{ opacity: 0, y: "-100%" }}
                animate={{
                  opacity: isInView ? 1 : 0,
                  y: isInView ? 0 : "-100%",
                }}
                transition={{ duration: 0.8 + index * 0.1, ease: "easeInOut" }}
                src={`/assets/home/membership/payment/${icon}.svg`}
                alt={icon}
                className="w-8 h-8 md:w-10 md:h-10"
              />
            ))}
          </div>
        </div> */}
      </motion.div>
    </section>
  );
};

export default Membership;
