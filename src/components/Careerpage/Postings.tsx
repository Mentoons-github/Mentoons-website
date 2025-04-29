import { JobPosting } from "@/types";

interface PostingsProps {
  onClick: () => void;
  job: JobPosting;
}

const Postings = ({ onClick, job }: PostingsProps) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer hover:scale-105 transition-transform duration-200"
    >
      <div className="flex flex-col gap-3 sm:gap-5 transform skew-x-[-10deg] sm:skew-x-[-20deg] lg:skew-x-[-40deg] bg-gradient-to-t from-[#449BB6] to-[#68D2F3] p-3 sm:p-5 relative w-full rounded-lg shadow-[3px_3px_6px_0px_#30819AAD,3px_3px_6px_0px_#36B3DAAD]">
        <img
          src={job.thumbnail}
          alt="job-thumbnail"
          className="absolute top-0 right-0 w-full h-full object-left object-contain skew-x-[10deg] sm:skew-x-[20deg] lg:skew-x-[40deg]"
        />
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold transform skew-x-[10deg] sm:skew-x-[20deg] lg:skew-x-[40deg] text-center whitespace-nowrap z-10 mb-5">
          {job.jobTitle}
        </h1>
        <p className="w-3/4 ml-auto overflow-hidden text-sm sm:text-base lg:text-lg transform skew-x-[10deg] truncate sm:skew-x-[20deg] lg:skew-x-[40deg] text-right pr-4 whitespace-nowrap absolute bottom-2 right-0 text-white font-bold">
          {job.jobDescription}
        </p>
      </div>
    </div>
  );
};

export default Postings;
