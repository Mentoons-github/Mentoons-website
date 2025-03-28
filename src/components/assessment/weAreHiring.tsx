import { Hiring } from "@/types";
import { NavLink } from "react-router-dom";

const WeAreHiring = ({ hiring }: { hiring: Hiring[] }) => {
  return (
    <div className="flex flex-col items-center gap-10">
      {hiring.map((job, index) => (
        <div
          key={index}
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
            <NavLink
              to="/hiring"
              className="px-6 py-2 bg-white text-[#EC9600] rounded-full shadow-md border border-[#652D90] font-roboto font-extrabold"
            >
              APPLY HERE
            </NavLink>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeAreHiring;
