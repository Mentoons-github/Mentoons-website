import Team from "@/components/comics/Team";
import Wordbreak from "@/components/comics/Wordbreak";
import { Suspense, useEffect } from "react";

const AboutMentoons = () => {
  useEffect(() => {
    if (window.location.hash === '#fun-section') {
      setTimeout(() => {
        const element = document.getElementById('fun-section');
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  return (
    <div className="w-full">
      <img
        src="/assets/images/about-mentoons-hero.png"
        alt=""
        className=" w-full object-cover "
      />
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
          className="container flex flex-col bg-mt-teal text-white py-10 space-y-7"
        >
          <div className="py-8 space-y-7" id="fun-section">
            <div className="text-start space-y-4">
              <div className=" text-3xl lineBefore uppercase text-[#d71515]">
                Fun with mentoons{" "}
              </div>
              <div className="text-5xl text-center lg:text-7xl w-full font-extrabold tracking-wide leading-[1.10]">
                Life is Fun at <Wordbreak /> Mentoons
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
    </div>
  );
};

export default AboutMentoons;
