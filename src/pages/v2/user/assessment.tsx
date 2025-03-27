import AssessmentCards from "@/components/assessment/assessmentCards";
import DiscoverYourself from "@/components/assessment/discoverYourself";
import SampleReport from "@/components/assessment/sampleRepoert";
import FAQ from "./faq/faq";
import { FAQ_PRODUCT } from "@/constant/faq";
import WeAreHiring from "@/components/assessment/weAreHiring";
import { useEffect, useState } from "react";
import { HIRING } from "@/constant/constants";
import { Hiring } from "@/types";
import { NavLink } from "react-router-dom";

const Assessment = () => {
  const [hiring, setHiring] = useState<Hiring[] | []>([]);
  useEffect(() => {
    setHiring(HIRING);
  }, []);

  return (
    <>
      <DiscoverYourself />
      <SampleReport />
      <div className="flex flex-col lg:flex-row justify-between items-start mt-20 p-5 md:p-10 lg:p-15 gap-10">
        <div className="w-full lg:w-3/4">
          <AssessmentCards />
        </div>
        <div className="w-full lg:w-1/4 p-3 flex flex-col justify-start items-center gap-10">
          <div className="p-4 rounded-xl border border-black shadow-xl w-full text-center sm:text-left">
            <img
              src="/assets/assesments/One one one call.png"
              alt="book a call"
              className="w-40 sm:w-56 mx-auto"
            />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mt-3 font-akshar">
              Book a <span className="text-[#EC9600]">one-on-one</span> Call
              with us!
            </h1>
            <p className="text-sm mt-2 font-inter tracking-[0.3px]">
              Want to find out a detailed report of your assessment and get the
              right guidance? Book a one-on-one session with us!
            </p>
            <span className="block font-akshar text-[#EC9600] mt-2">
              BOOK for Rs 499/hr
            </span>
            <div className="flex justify-center mt-4">
              <NavLink
                to="/bookings"
                className="px-6 py-2 rounded-full bg-[#652D90] text-white font-roboto font-extrabold shadow-xl"
              >
                Book A Call
              </NavLink>
            </div>
          </div>
          <WeAreHiring hiring={hiring} />
        </div>
      </div>
      <FAQ data={FAQ_PRODUCT} />
    </>
  );
};

export default Assessment;
