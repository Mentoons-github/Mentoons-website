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
    <div className="flex flex-col items-center gap-10">
      {hiring.map((job, index) => (
        <button
          key={index}
          onClick={() => handleClick(job.job)}
          className="p-5 rounded-xl border border-black shadow-xl bg-[#4285F4] font-akshar"
          style={{ background: job.bg }}
        >
          <h1 className="text-left text-4xl font-semibold text-black">
            We are hiring <span className="text-white">{job.job}</span>
          </h1>
          <p className="text-left mt-2 font-inter tracking-[0.35px] text-sm">
            {job.description}
          </p>
          <img
            src={job.image}
            alt={job.job}
            className="w-48 h-auto mx-auto mt-3"
          />
          <div className="flex justify-center mt-4">
            <button className="px-6 py-2 bg-white text-[#EC9600] rounded-full shadow-md border border-[#652D90] font-roboto font-extrabold">
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
