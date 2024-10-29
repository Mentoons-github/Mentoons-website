import React from "react";
import Wordbreak from "./Wordbreak";
import { TeamSlider } from "./Sliders";

const Team: React.FC = () => {
  return (
    <div
      id="team"
      className="container flex flex-col bg-primary text-white py-10 space-y-7"
    >
      <div className="py-8 space-y-7">
        <div className="text-start space-y-4">
          <div className=" text-3xl lineBefore uppercase text-[#d71515]">
            Our Team{" "}
          </div>
          <div className="text-5xl text-center lg:text-7xl w-full font-extrabold tracking-wide leading-[1.10]">
            Meet With Our <Wordbreak /> Comic Artist.
          </div>
        </div>
        <div className="flex items-center justify-between gap-20">
          <TeamSlider />
        </div>
      </div>
      {/* <div className="flex gap-[2rem] lg:gap-[4rem] flex-col lg:flex-row items-center">
        <div className="w-full lg:w-[40%] flex items-center justify-between">
          <div className="space-y-2">
            <div className="text-5xl lg:text-8xl font-semibold">97%</div>
            <div>Satisfaction Rate</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl lg:text-8xl font-semibold">12M</div>
            <div>Users Registration</div>
          </div>
        </div>
        <div className="w-full lg:w-[60%] font-medium text-lg">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus{" "}
          <Wordbreak />
          voluptatum, iusto assumenda. Rerum neque saepe commodi, iusto esse{" "}
          <Wordbreak />
          eius, ratione explicabo vitae, sunt aperiam a.
        </div>
      </div> */}
    </div>
  );
};

export default Team;
