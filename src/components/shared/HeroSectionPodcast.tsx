import { motion } from "framer-motion";
import React from "react";
const HeroSectionPodcast = () => {
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const handleIntroPlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };
  const handleIntroPause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Optional: reset audio to the beginning
    }
  };

  return (
    <section className='relative bg-primary'>
      {/* <nav className='flex justify-between items-center px-4  pb-0'>
    <div className='w-28 sm:w-40 md:w-60 lg:w-40'>
      <img
        src='/assets/mentoons-logo.png'
        alt='Mentoons Logo'
        className='w-full object-cover'
      />
    </div>
    <div className='flex items-center justify-center gap-3'>
      <div className=' text-white items-center justify-center gap-2 text-xs sm:text-sm md:text-base  md:flex  animate-blink'>
        <span className='flex items-center justify-center gap-1 whitespace-nowrap'>
          <LuPhoneCall fill='white' />
          Call us <a href='tel:9036033300'>9036033300</a>
        </span>
        <span className='flex items-center justify-center gap-1 '>
          <MdEmail />
          <a href='mailto:metalmahesh@gmail.com'>metalmahesh@gmail.com</a>
        </span>
      </div>
      <div className='text-lg sm:text-2xl border-[1.5px] border-white rounded-[4px] hover:scale-110 transition-all duration-300 mt-1 mr-1  '>
        <IoMenu color='white' />
      </div>
    </div>
  </nav> */}
      {/* <Navbar /> */}
      {/* <audio autoPlay>
    <source src='mentoons-intro-audio.mp3' />
  </audio> */}
      {/* Hero Section */}
      <div className='relative'>
        <div className='absolute left-1/2 -translate-x-1/2 xxs:top-4 sm:top-8 md:top-4 lg:top-8 2xl:top-24 md:w-[400px] lg:w-[600px] '>
          <img
            src='/assets/images/podcast-logo.png'
            alt='Podcast logo'
            className='w-full object-cover'
          />
        </div>

        {/* Play button */}
        <div className='absolute  xxs:bottom-2  sm:bottom-4 left-1/2 -translate-x-1/2 xxs:w-14 flex gap-2 md:w-24 md:bottom-8 z-[40] lg:w-48 lg:bottom-10 '>
          <div
            className='hover:scale-110 transition-all duration-300'
            onClick={handleIntroPlay}
          >
            <img
              src='/assets/images/play.png'
              alt='Play Button'
              className='w-full object-cover'
            />
            <audio
              ref={audioRef}
              src='/assets/audios/mentoons-intro-audio.mp3'
            ></audio>
          </div>
          <div
            className='hover:scale-110 transition-all duration-300'
            onClick={handleIntroPause}
          >
            <img
              src='/assets/images/pause.png'
              alt='Pause Button'
              className='w-full object-cover'
            />
            <audio
              ref={audioRef}
              src='/assets/audios/mentoons-intro-audio.mp3'
            ></audio>
          </div>
        </div>

        {/* Hero Image */}
        <div className='relative pt-4'>
          <img
            src='/assets/images/podcast-hero.png'
            alt='Podcast hero Image'
            className='w-full object-cover'
          />

          {/* Radio */}
          <div className='   absolute w-14 sm:w-28 md:w-32 bottom-4 left-4 md:left-10 md:bottom-6 z-[40] lg:w-60'>
            <img
              src='/assets/images/radio.png'
              alt='Radio Illustration'
              className='w-full object-cover'
            />

            {/* Music Note Div */}
            <div className='absolute bottom-0  flex sm:gap-2 justify-end  '>
              <motion.div
                className='w-4 absolute rotate-12 sm:w-6 md:w-12 '
                initial={{ x: 0, opacity: 0, scale: 1, rotate: 0 }}
                animate={{
                  x: [100, 0],
                  opacity: [0, 1, 0],
                  scale: [1, 1.5, 1.5],
                  rotate: [0, 30, 30],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  delay: 0,
                }}
              >
                <img src='/assets/images/music-note-3.png' alt='Music Notes' />
              </motion.div>
              <motion.div
                className=' absolute w-4 md:w-12 flex items-center '
                initial={{ x: 0, opacity: 0, scale: 1, rotate: 0 }}
                animate={{
                  x: [100, 0],
                  opacity: [0, 1, 0],
                  scale: [1, 1.5, 1.5],
                  rotate: [0, 30, 30],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  delay: 1,
                }}
              >
                <img src='/assets/images/music-note-2.png' alt='Music Notes' />
              </motion.div>
              <motion.div
                className='w-4 flex items-end md:w-12 '
                initial={{ x: 0, opacity: 0, scale: 1, rotate: 0 }}
                animate={{
                  x: [100, 0],
                  opacity: [0, 1, 0],
                  scale: [1, 1.5, 1.5],
                  rotate: [0, 30, 30],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  delay: 2,
                }}
              >
                <img src='/assets/images/music-note-1.png' alt='Music Notes' />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionPodcast;
