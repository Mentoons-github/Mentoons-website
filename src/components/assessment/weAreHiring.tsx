import { Hiring } from "@/types";
import ResumeSubmissionModal from "../common/modal/jobApplyModel";
import { useState } from "react";

const WeAreHiring = ({ hiring }: { hiring: Hiring[] }) => {
  const [position, setPosition] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = (job: string) => {
    setPosition(job);
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col items-center w-full gap-4 md:gap-6 lg:gap-10 px-2 md:px-0">
      {hiring.map((job, index) => (
        <button
          key={index}
          onClick={() => handleClick(job.job)}
          className="w-full p-3 md:p-5 rounded-xl border border-black shadow-xl font-akshar"
          style={{ background: job.bg }}
        >
          <h1 className="text-left text-2xl md:text-3xl lg:text-4xl font-semibold text-black">
            We are hiring <span className="text-white">{job.job}</span>
          </h1>
          <p className="text-left mt-1 md:mt-2 font-inter tracking-[0.35px] text-xs md:text-sm">
            {job.description}
          </p>
          <img
            src={job.image}
            alt={job.job}
            className="w-32 md:w-40 lg:w-48 h-auto mx-auto mt-2 md:mt-3"
          />
          <div className="flex justify-center mt-3 md:mt-4">
            <button className="px-4 md:px-6 py-1 md:py-2 bg-white text-[#EC9600] rounded-full shadow-md border border-[#652D90] font-roboto text-sm md:text-base font-extrabold">
              APPLY HERE
            </button>
          </div>
        </button>
      ))}
      {isOpen && (
        <ResumeSubmissionModal setIsOpen={setIsOpen} position={position} />
      )}
    </div>
  );
};

export default WeAreHiring;
