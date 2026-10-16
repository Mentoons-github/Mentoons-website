import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const halftoneDark = {
  backgroundImage:
    "radial-gradient(rgba(255,255,255,0.18) 2px, transparent 2px)",
  backgroundSize: "16px 16px",
};

const HeroSectionPodcast = () => {
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const [isPageVisible, setIsPageVisible] = useState(true);

  const handleIntroPlay = () => {
    if (audioRef.current && isPageVisible) {
      audioRef.current.play();
    }
  };
  const handleIntroPause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      handleIntroPlay();
    }, 500);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setIsPageVisible(true);
        handleIntroPlay();
      } else {
        setIsPageVisible(false);
        handleIntroPause();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <section
      className="relative bg-primary border-b-8 border-black"
      style={halftoneDark}
    >
      <div className="relative">
        {/* Psychologists badge - top left, responsive */}
        <div className="absolute z-30 top-2 left-2 w-14 sm:top-4 sm:left-4 sm:w-20 md:top-6 md:left-8 md:w-28 lg:top-8 lg:left-12 lg:w-40 xl:w-48 drop-shadow-[4px_4px_0_rgba(0,0,0,0.9)] transition-transform duration-300 hover:scale-105 hover:-rotate-3">
          <img
            src="/assets/LandingPage/psyco.png"
            alt="Carefully crafted by psychologists"
            className="object-contain w-full h-auto"
          />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 xxs:top-4 sm:top-8 md:top-4 lg:top-8 2xl:top-24 md:w-[400px] lg:w-[600px] ">
          <img
            src="/assets/images/podcast-logo.png"
            alt="Podcast logo"
            className="object-cover w-full drop-shadow-[6px_6px_0_rgba(0,0,0,0.9)]"
          />
        </div>

        <div className="flex absolute left-1/2 z-20 gap-2 -translate-x-1/2 xxs:bottom-2 sm:bottom-4 xxs:w-14 md:w-24 md:bottom-8 lg:w-48 lg:bottom-10">
          <div
            className="transition-all duration-300 hover:scale-110 hover:-rotate-6 active:scale-95 cursor-pointer drop-shadow-[4px_4px_0_rgba(0,0,0,0.9)]"
            onClick={handleIntroPlay}
          >
            <img
              src="/assets/images/play.png"
              alt="Play Button"
              className="object-cover w-full"
            />
            <audio
              ref={audioRef}
              src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Others/mentoons-intro-audio.mp3"
            ></audio>
          </div>
          <div
            className="transition-all duration-300 hover:scale-110 hover:rotate-6 active:scale-95 cursor-pointer drop-shadow-[4px_4px_0_rgba(0,0,0,0.9)]"
            onClick={handleIntroPause}
          >
            <img
              src="/assets/images/pause.png"
              alt="Pause Button"
              className="object-cover w-full"
            />
          </div>
        </div>

        <div className="relative pt-4">
          <img
            src="/assets/images/podcast-hero.png"
            alt="Podcast hero Image"
            className="object-cover w-full"
          />

          <div className="absolute bottom-4 left-4 z-20 w-14 sm:w-28 md:w-32 md:left-10 md:bottom-6 lg:w-60 drop-shadow-[5px_5px_0_rgba(0,0,0,0.9)]">
            <img
              src="/assets/images/radio.png"
              alt="Radio Illustration"
              className="object-cover w-full"
            />

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
