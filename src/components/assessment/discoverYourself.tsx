import { motion } from "framer-motion";
import useInView from "@/hooks/useInView";

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
    <section ref={ref} className="w-full px-5 md:px-10 py-10 mt-10 space-y-6">
      <div className="text-center md:text-left">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-[#EC9600] font-medium text-4xl md:text-7xl"
        >
          Discover Yourself
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="inter text-md md:text-xl text-[#0C0A09] mt-5 md:w-4/5 mx-auto md:mx-0"
        >
          Uncover your unique traits, strengths, and preferences with our
          psychologist-designed personality assessments. Gain deeper
          self-awareness to make informed decisions, improve relationships, and
          unlock your full potential.
        </motion.p>
      </div>
      <div className="p-5">
        <motion.h4
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="font-medium text-2xl md:text-[28px] text-center md:text-left"
        >
          What will you get with this assessment?
        </motion.h4>
        <ul className="flex flex-col justify-start items-center md:items-start gap-5 mt-5">
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
              className="flex flex-col md:flex-row justify-center items-center md:items-start gap-4 inter text-center md:text-left"
            >
              {data.icon}
              <p className="text-lg md:text-xl">
                {data.title && (
                  <span className="font-semibold">{data.title}: </span>
                )}
                <span className="font-medium">{data.description}</span>
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default DiscoverYourself;
