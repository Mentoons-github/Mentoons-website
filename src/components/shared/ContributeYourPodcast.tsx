import { motion } from "framer-motion";
const ContributeYourPodcast = () => {
  return (
    <section className='border'>
      <div className='w-full relative'>
        <img
          src='/assets/images/contribute-to-our-podcast.jpg'
          alt='Podcast'
          className='w-full object-cover'
        />
        <motion.div
          className='absolute bottom-6 left-20 min-w-20 w-24 sm:w-32 md:bottom-16 md:left-60 md:w-48 lg:w-64'
          initial={{ y: 0 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <a href='#'>
            <img
              src='/assets/images/submit-your-podcast-button.png'
              alt='Submit Your Podcast'
              className='w-full object-cover'
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ContributeYourPodcast;
