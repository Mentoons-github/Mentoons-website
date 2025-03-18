import { COMMUNITY } from "@/constant/constants";

const Details = () => {
  return (
    <ul className="flex flex-col justify-center items-center gap-3 pt-10 px-0 md:px-2 lg:px-4">
      {COMMUNITY.map(({ title, description, color }, index) => (
        <li
          key={index}
          className="flex flex-row justify-between items-center gap-5 font-fredoka w-full max-w-4xl p-5 rounded-lg transition-all"
        >
          <div
            className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center px-4 py-2 rounded-md text-center text-2xl md:text-3xl lg:text-[42px] font-medium text-[#44464B]"
            style={{ backgroundColor: color }}
          >
            0{index + 1}
          </div>

          <div className="text-left w-full">
            <h1 className="fredoka text-xl md:text-xl lg:text-2xl xl:text-3xl font-semibold text-[#131315] underline decoration-2 underline-offset-3">
              {title}
            </h1>
            <p className="font-normal leading-6 text-base md:text-[14px] lg:text-[16px] xl:text-[19px] pt-4 w-full md:w-[500px] lg:w-[600px]">
              {description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Details;
