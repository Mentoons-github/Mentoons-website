import { useEffect, useState } from "react";
import ExplorePodcast from "./explorePodcast";
import { MYTHOS_NEWS, NEWS } from "@/constant/constants";
import { JoinCardsProps } from "@/types/mythos/interface";
import MythosNews from "./mythosNews";
import MissingOutProducts from "./missingOutProducts";

const RightSection = () => {
  const [news, setNews] = useState<JoinCardsProps[] | []>([]);

  useEffect(() => {
    setNews(MYTHOS_NEWS);
  }, []);
  return (
    <div className="flex flex-col gap-10">
      <ExplorePodcast />
      <MythosNews news={news} />
      <div className="bg-[#6A8FFF] space-y-5 p-5 w-full max-h-[550px] overflow-y-auto">
        {NEWS.map((data, index) => (
          <div className="w-full lg:max-w-2xs mx-auto lg:mx-0 p-3" key={index}>
            <div className="flex justify-center items-center w-full font-jost font-semibold text-xs">
              <h1 className="bg-white whitespace-nowrap z-10 pr-3">
                {data.category}
              </h1>
              <div className="flex-grow border-t border-gray-900"></div>
              <span className="bg-white text-gray-600 whitespace-nowrap px-3">
                {data.date}
              </span>
              <div className="w-[30px] border-t border-gray-900"></div>
            </div>
            <h1 className="font-outfit font-semibold text-lg text-[#111111] mt-3">
              {data.news}
            </h1>
          </div>
        ))}
      </div>
      <MissingOutProducts />
      <div className="flex justify-center ">
        <img
          src="/assets/mythos/planets/NEPTİN.png"
          alt="neptune"
          className="w-96 h-96"
        />
      </div>
    </div>
  );
};

export default RightSection;
