import Team from "@/components/comics/Team";
import React, { Suspense, useState, useEffect } from "react";
const AboutMentoons = () => {
  useEffect(() => {
    if (window.location.hash === '#fun-section') {
      setTimeout(() => {
        const element = document.getElementById('fun-section');
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  const [isPaused, setIsPaused] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const toggleIntroPlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPaused(false);
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPaused(true); // Optional: reset audio to the beginning
      }
    }
  };
  return (
    <div className="w-full ">
      <div className="relative">
        <img
          src="/assets/images/about-mentoons-hero.png"
          alt=""
          className=" w-full object-cover "
        />

        <div className="absolute -bottom-5 md:-bottom-16 left-1/2 transform -translate-x-1/2">
          <img
            src={`/assets/images/${isPaused ? "play.png" : "pause.png"}`}
            alt="Play Button"
            className="w-12 md:w-32 hover:scale-110 transition-all duration-300 "
            onClick={toggleIntroPlayPause}
          />

          <audio
            ref={audioRef}
            typeof=".mp3"
            src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Others/about-mentoons.mp3"
          ></audio>
        </div>
      </div>

      <div>
        <img
          src="/assets/images/about-mentoons-mission.png"
          alt="Mentoons mission section"
          className="w-full object-cover"
        />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Team />
      </Suspense>
      <div>
        <div
          className= "flex flex-col bg-mt-teal text-white py-10 space-y-7"
        >
          <div className="py-8 space-y-7" id="fun-section">
            <div className="text-start space-y-4">
              <div className="text-5xl text-center lg:text-7xl w-full font-extrabold tracking-wide leading-[1.10]">
                Fun @mentoons
              </div>
            </div>
            <div className="flex items-center justify-between gap-20 rounded-2xl">
              <video
                src="https://mentoons-website.s3.ap-northeast-1.amazonaws.com/miscellaneous/Team+Celebration+Video+03.mp4"
                controls
                autoPlay
                muted
                loop
                playsInline
                webkit-playsinline
                className="w-[80%] mx-auto rounded-2xl"
              ></video>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-[#FFDB67] ">
        <div className="  py-12 px-2 md:py-16 text-center  text-2xl md:text-4xl font-semibold relative">
          <h2 className="pb-8 relative z-20">Mentoons In Action</h2>

          <p className="text-orange-600 text-3xl md:text-5xl">
            Behind the Scene with our Guides
          </p>
          <div className=" absolute top-10  right-5 z-2 md:right-[30%]">
            <img
              src="/assets/images/persona-family.png"
              alt=""
              className="w-36 md:w-52"
            />
          </div>
        </div>
        <div className="relative">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-4 mx-auto relative z-20 w-[80%]">
              {[
                "persona-1",
                "persona-2",
                "persona-3",
                "persona-4",
                "persona-5",
                "persona-6",
              ].map((item) => (
                <div key={item + "_"} className="">
                  <img
                    src={`/assets/images/${item}.jpg`}
                    alt=""
                    className="w-full rounded-2xl"
                  />
                </div>
              ))}
            </div>
            <p className="text-xl font-semibold  py-12 text-center">
              Watch our video to see how our mentors shape futures with guidance
              and a touch of fun
            </p>
          </div>
          <div className="absolute -top-20 left-0 z-0 ">
            <img
              src="/assets/images/decorative-illustration.png"
              alt=""
              className="w-52 md:w-72"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutMentoons;
