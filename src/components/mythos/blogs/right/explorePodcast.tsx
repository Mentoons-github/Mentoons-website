import { MYTHOS_PODCASTS } from "@/constant/constants";
import { FaBars, FaPlay } from "react-icons/fa6";

const ExplorePodcast = () => {
  return (
    <div className="p-6 flex flex-col bg-[#FEE898] w-[490px] rounded-lg shadow-md">
      <div className="flex justify-between items-center w-full mb-4">
        <h1 className="text-4xl font-bold font-mulish text-[#1A1D3B] w-3/4">
          Explore Podcasts For You
        </h1>
        <img
          src="/assets/mythos/background/blogs/Frame 9.png"
          className="w-12 h-12"
          alt="Podcast Icon"
        />
      </div>
      <div className="space-y-2 w-full mt-5">
        {MYTHOS_PODCASTS.map((data, index) => (
          <div
            key={index}
            className="flex justify-between items-center w-full p-2 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-3">
              <button className="w-8 h-8 flex justify-center items-center rounded-full border border-black bg-transparent text-[#333333] hover:bg-white transition">
                <FaPlay className="w-5 h-5" />
              </button>
              <h2 className="text-sm font-bold text-[#333333] tracking-wider font-roboto">
                {data.title}
              </h2>
            </div>
            <button className="w-8 h-8 flex justify-center items-center">
              <FaBars className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePodcast;
