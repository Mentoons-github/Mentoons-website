import { motion } from "framer-motion";
import useInView from "@/hooks/useInView";
import { NavLink } from "react-router-dom";

const DiscoverYourself = () => {
  const { isInView, ref } = useInView(0.3, false);

  const assessmentBenefit = [
    {
      icon: (
        <img
          src="/assets/assesments/assessment/discoverYourself/Quiz.png"
          alt="quiz"
          className="w-auto max-w-[50px] md:max-w-[70px]"
        />
      ),
      title: "10 Quick Questions",
      description: "Easy, multiple-choice format.",
    },
    {
      icon: (
        <img
          src="/assets/assesments/assessment/discoverYourself/Check Document.png"
          alt="check-document"
          className="w-auto max-w-[50px] md:max-w-[70px]"
        />
      ),
      title: "",
      description:
        "Take our illustrated and fun assessment for free, and if you wish to get a report, get it for Rs 15!",
    },
    {
      icon: (
        <img
          src="/assets/assesments/assessment/discoverYourself/Positive Dynamic.png"
          alt=""
          className="w-auto max-w-[50px] md:max-w-[70px]"
        />
      ),
      title: "Valuable Insights",
      description: "Personal growth tips, Relationship and well-being advice.",
    },
  ];

  return (
    <section
      ref={ref}
      className="flex flex-col md:flex-row items-center w-full px-5 md:px-10 py-10 mt-10 space-y-10 md:space-y-0 md:space-x-10"
    >
      <div className="w-full md:w-2/3 flex flex-col items-center md:items-start text-center md:text-left">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-[#EC9600] font-medium text-4xl md:text-6xl"
        >
          Discover Yourself
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="inter text-md md:text-xl text-[#0C0A09] mt-5 max-w-lg md:max-w-none"
        >
          Uncover your unique traits, strengths, and preferences with our
          psychologist-designed personality assessments. Gain deeper
          self-awareness to make informed decisions, improve relationships, and
          unlock your full potential.
        </motion.p>
        <div className="p-5 w-full mt-5 lg:mt-0">
          <motion.h4
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            className="font-medium text-2xl md:text-[28px]"
          >
            What will you get with this assessment?
          </motion.h4>
          <ul className="flex flex-col justify-center md:justify-start items-center md:items-start gap-5 mt-5">
            {assessmentBenefit.map((data, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: 0.2 * index,
                }}
                className="flex flex-col md:flex-row items-center md:items-start gap-4 inter"
              >
                {data.icon}
                <p className="text-lg md:text-xl text-center md:text-left">
                  {data.title && (
                    <span className="font-semibold">{data.title}: </span>
                  )}
                  <span className="font-medium">{data.description}</span>
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-full md:w-1/3 flex justify-center">
        <div className="p-6 rounded-xl border border-black shadow-xl w-full max-w-md text-center">
          <img
            src="/assets/assesments/One one one call.png"
            alt="book a call"
            className="w-32 sm:w-40 mx-auto"
          />
          <h1 className="text-2xl sm:text-3xl font-semibold mt-3 font-akshar">
            Book a <span className="text-[#EC9600]">one-on-one</span> Call with
            us!
          </h1>
          <p className="text-sm mt-2 font-inter tracking-[0.3px]">
            Want to find out a detailed report of your assessment and get the
            right guidance? Book a one-on-one session with us!
          </p>
          <span className="block font-akshar text-[#EC9600] mt-2">
            BOOK for Rs 499/hr
          </span>
          <div className="flex justify-center mt-4">
            <NavLink
              to="/bookings"
              className="px-6 py-2 rounded-full bg-[#652D90] text-white font-roboto font-extrabold shadow-xl"
            >
              Book A Call
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverYourself;
