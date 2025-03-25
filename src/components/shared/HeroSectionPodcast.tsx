import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
const HeroSectionPodcast = () => {
  const audioRef = React.useRef<HTMLAudioElement>(null);

  // State to track if the page is visible
  const [isPageVisible, setIsPageVisible] = useState(true);

  const handleIntroPlay = () => {
    if (audioRef.current && isPageVisible) {
      audioRef.current.play();
    }
  };
  const handleIntroPause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Optional: reset audio to the beginning
    }
  };
  // Auto-play audio when component mounts and handle page visibility changes
  useEffect(() => {
    // Small timeout to ensure the audio element is fully loaded
    const timer = setTimeout(() => {
      handleIntroPlay();
    }, 500);

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setIsPageVisible(true);
        // Restart audio when page becomes visible again
        handleIntroPlay();
      } else {
        setIsPageVisible(false);
        // Pause audio when page is hidden
        handleIntroPause();
      }
    };

    // Add event listener for visibility change
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Clean up
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <section className="relative bg-primary">
      {/* <nav className='flex justify-between items-center px-4 pb-0'>
    <div className='w-28 sm:w-40 md:w-60 lg:w-40'>
      <img
        src='/assets/mentoons-logo.png'
        alt='Mentoons Logo'
        className='object-cover w-full'
      />
    </div>
    <div className='flex gap-3 justify-center items-center'>
      <div className='gap-2 justify-center items-center text-xs text-white sm:text-sm md:text-base md:flex animate-blink'>
        <span className='flex gap-1 justify-center items-center whitespace-nowrap'>
          <LuPhoneCall fill='white' />
          Call us <a href='tel:9036033300'>9036033300</a>
        </span>
        <span className='flex gap-1 justify-center items-center'>
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
      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 xxs:top-4 sm:top-8 md:top-4 lg:top-8 2xl:top-24 md:w-[400px] lg:w-[600px] ">
          <img
            src="/assets/images/podcast-logo.png"
            alt="Podcast logo"
            className="object-cover w-full"
          />
        </div>

        {/* Play button */}
        <div className="flex absolute left-1/2 z-20 gap-2 -translate-x-1/2 xxs:bottom-2 sm:bottom-4 xxs:w-14 md:w-24 md:bottom-8 lg:w-48 lg:bottom-10">
          <div
            className="transition-all duration-300 hover:scale-110"
            onClick={handleIntroPlay}
          >
            <img
              src="/assets/images/play.png"
              alt="Play Button"
              className="object-cover w-full"
            />
            <audio
              ref={audioRef}
              typeof=".mp3"
              src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Others/mentoons-intro-audio.mp3"
            ></audio>
          </div>
          <div
            className="transition-all duration-300 hover:scale-110"
            onClick={handleIntroPause}
          >
            <img
              src="/assets/images/pause.png"
              alt="Pause Button"
              className="object-cover w-full"
            />
            <audio
              ref={audioRef}
              src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Others/mentoons-intro-audio.mp3"
            ></audio>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative pt-4">
          <img
            src="/assets/images/podcast-hero.png"
            alt="Podcast hero Image"
            className="object-cover w-full"
          />

          {/* Radio */}
          <div className="absolute bottom-4 left-4 z-20 w-14 sm:w-28 md:w-32 md:left-10 md:bottom-6 lg:w-60">
            <img
              src="/assets/images/radio.png"
              alt="Radio Illustration"
              className="object-cover w-full"
            />

            {/* Music Note Div */}
            <div className="flex absolute bottom-0 justify-end sm:gap-2">
              <motion.div
                className="absolute w-4 rotate-12 sm:w-6 md:w-12"
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
                <img src="/assets/images/music-note-3.png" alt="Music Notes" />
              </motion.div>
              <motion.div
                className="flex absolute items-center w-4 md:w-12"
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
                <img src="/assets/images/music-note-2.png" alt="Music Notes" />
              </motion.div>
              <motion.div
                className="flex items-end w-4 md:w-12"
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
                <img src="/assets/images/music-note-1.png" alt="Music Notes" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionPodcast;
