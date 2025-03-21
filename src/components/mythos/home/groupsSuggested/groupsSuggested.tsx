import useInView from "@/hooks/useInView";
import Heading from "./heading";
import { motion } from "framer-motion";

const GroupsSuggested = () => {
  const { isInView, ref } = useInView(0.3, false);

  return (
    <motion.section
      ref={ref}
      className="px-4 lg:px-16 xl:px-24 py-10 flex flex-col items-start gap-6 overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      >
        <Heading />
      </motion.div>

      <div className="flex flex-wrap justify-start items-center lg:items-start w-full gap-5 md:gap-2 xl:gap-10 mt-10">
        <motion.div
          className="flex flex-col justify-center gap-3 p-8 bg-yellow-500 rounded-xl shadow-md h-[480px] w-full md:w-full lg:w-[28%] min-w-[250px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
          }
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
        >
          <h1 className="text-2xl md:text-4xl lg:text-2xl md:text-center lg:text-start font-bold font-mulish">
            Astrologers
          </h1>
          <p className="text-sm md:text-xl lg:text-sm font-inter leading-relaxed">
            Astrologers study how celestial bodies influence human behavior,
            using birth charts to predict events and provide guidance.
          </p>
          <motion.img
            src="/assets/mythos/cards/suggestedGroups/Purple magic ball with cards and incense stick.png"
            alt="purple_ball"
            className="w-[275px] h-[304px] mx-auto object-contain mt-5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 0.4, delay: 0.5 }}
          />
        </motion.div>
        <div className="flex flex-col justify-start gap-4 h-fit md:h-[480px] md:w-[50%] lg:w-[50%] xl:w-[40%] min-w-[250px] md:min-w-[350px]">
          {[
            {
              title: "Psychologists",
              description:
                "Psychologists specialize in the study of human behavior and mental processes, using scientific methods to understand and explain thoughts, emotions, and behaviors.",
              img: "/assets/mythos/cards/suggestedGroups/female psychologist sits and explains.png",
              bg: "#567AE5",
            },
            {
              title: "Reiki Healers",
              description:
                "Reiki healers use hands-on energy healing to promote relaxation, alleviate pain, and improve overall well-being.",
              img: "/assets/mythos/cards/suggestedGroups/woman doing yoga.png",
              bg: "#59DCA3",
            },
          ].map((group, index) => (
            <motion.div
              key={index}
              className="flex items-start justify-between md:justify-start p-5 rounded-xl shadow-md flex-1"
              style={{ backgroundColor: group.bg }}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: 0.2 + index * 0.2,
              }}
            >
              <div className="w-auto sm:w-3/5">
                <h1 className="text-2xl font-bold font-mulish">
                  {group.title}
                </h1>
                <p className="text-xs font-inter tracking-tight leading-relaxed h-fit w-auto sm:w-[90%] lg:w-[80%]">
                  {group.description}
                </p>
              </div>
              <motion.img
                src={group.img}
                alt={group.title.toLowerCase()}
                className="w-[120px] h-24 sm:h-[128px] lg:w-[150px] lg:h-[158px] xl:w-[178px] xl:h-[170px] object-contain flex-shrink-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.8 }
                }
                transition={{ duration: 0.4, delay: 0.4 + index * 0.2 }}
              />
            </motion.div>
          ))}
        </div>
        <div className="flex flex-col justify-center items-center gap-7 h-fit md:h-[480px] w-full md:w-[48%] lg:w-[10%] xl:w-[20%] lg:min-w-[180px] xl:min-w-[200px]">
          {[
            {
              name: "Aries",
              symbol: "♈︎",
              img: "/assets/mythos/cards/suggestedGroups/aries.png",
              bg: "#E39712",
            },
            {
              name: "Taurus",
              symbol: "♉︎",
              img: "/assets/mythos/cards/suggestedGroups/taurus.png",
              bg: "#567AE5",
            },
          ].map((sign, index) => (
            <motion.div
              key={index}
              className="flex flex-row md:flex-col justify-around md:justify-start items-center gap-5 md:gap-0 p-3 rounded-xl shadow-md flex-1 w-full"
              style={{ backgroundColor: sign.bg }}
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: 0.3 + index * 0.2,
              }}
            >
              <motion.img
                src={sign.img}
                alt={sign.name.toLowerCase()}
                className="w-[130px] md:w-[100px] md:h-[90px] lg:w-[120px] lg:h-[120px] xl:w-[164px] xl:h-[138px]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.8 }
                }
                transition={{ duration: 0.4, delay: 0.5 + index * 0.2 }}
              />
              <div>
                <h1 className="text-lg font-bold font-mulish text-start w-full flex justify-start items-center gap-3">
                  <span className="text-sm font-bold flex items-center gap-2">
                    {sign.symbol}
                  </span>
                  <span>{sign.name}</span>
                </h1>
                <p className="text-xs font-inter text-start leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default GroupsSuggested;
