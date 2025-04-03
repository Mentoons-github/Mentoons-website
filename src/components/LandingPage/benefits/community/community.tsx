import useInView from "@/hooks/useInView";
import { motion } from "framer-motion";
import NewsAndContests from "../contestsAndFun/newsAndContests";
import Details from "../detail/details";

const Community = ({
  openComicModal,
}: {
  openComicModal: (comicLink: string) => void;
}) => {
  const isMobile = window.innerWidth < 768;
  const { ref: sectionRef, isInView } = useInView(isMobile ? 0.1 : 0.3, false);

  return (
    <section className="mt-3 w-full h-auto relative z-0 bg-gradient-to-b from-[rgba(255,187,68,0.8)] via-[rgba(255,165,75,0.9)] to-[rgba(253,185,147,0.8)]">
      <div className="relative z-0 p-10 lg:p-3 xl:p-20">
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pt-4"
        >
          <h1 className="font-akshar text-[50px] sm:text-5xl lg:text-[48px] text-start font-semibold">
            Benefits
          </h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative z-10 flex flex-col items-center justify-between lg:flex-row md:gap-2 lg:gap-5 xl:gap-25"
          >
            <Details />
            <div className="relative w-full">
              <motion.div
                className="absolute flex items-center justify-center hidden lg:block -top-1/3 -left-1/5 xl:-translate-x-10 lg:w-50 xl:w-96 xl:h-96 z-5"
                animate={isInView ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <motion.img
                  src="/assets/home/banner/fillers/spot flash.png"
                  alt="filler"
                  className="object-contain w-60 h-60"
                />
              </motion.div>
              <div className="relative z-10 p-10 lg:p-0 md:flex md:justify-center md:items-center lg:block">
                <NewsAndContests openComicModal={openComicModal} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Community;
