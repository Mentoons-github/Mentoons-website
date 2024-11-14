import Team from "@/components/comics/Team";
import { Suspense } from "react";

const AboutMentoons = () => {
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
    </div>
  );
};

export default AboutMentoons;
