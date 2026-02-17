import { motion } from "framer-motion";
const ComicHero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-10 md:mt-16 lg:flex lg:items-start"
    >
      <div className="flex-1">
        <p className="text-lg font-extrabold pl-14">Digital Wellness Series</p>
        <h1 className="py-2 text-2xl font-semibold text-center text-primary md:text-6xl md:pb-4">
          E-Comics & Audio Comics
        </h1>
        <p className="lg:w-3/4 px-4 lg:py-4 mx-auto text-lg font-medium text-center lg:text-left md:text-2xl">
          Welcome to the world of meaningful stories and valuable life lessons.
          <br /> Our Comics and stories are designed to help children and
          teenagers navigate{" "}
          <span className="text-orange-400 font-semibold">
            important life
          </span>{" "}
          topics with ease and enjoyment.
          <br /> Comic book series that address topics like social media,
          safety, gadget addiction.
        </p>
      </div>
      <div className="flex-1 mt-5 lg:mt-0">
        <h2
          className="py-4 text-xl md:text-3xl text-center luckiest-guy-regular"
          style={{ wordSpacing: 8 }}
        >
          CHOOSE COMICS Best FOR YOU!
        </h2>
        <div className="flex items-center justify-center w-full p-2 lg:p-4 lg:pr-24">
          <img
            src="/assets/comic-V2/comic-hero-v2.png"
            alt="comic page hero Image"
            className="w-full h-auto"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ComicHero;
