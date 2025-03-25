import { JoinCardsProps } from "@/types/mythos/interface";

const MythosNews = ({ news }: { news: JoinCardsProps[] }) => {
  return (
    <div className="p-8 w-full bg-[#FE7D67] border border-[#3B3B3B]">
      <h1 className="text-4xl font-bold font-mulish text-[#1A1D3B] w-3/4">
        Recent News
      </h1>
      {news.map((data, index) => (
        <div key={index} className="mt-5">
          <div className="flex justify-start items-center gap-4">
            <img src={data.img} alt={data.name} className="w-20 h-20" />
            <h1 className="font-outfit text-xl font-medium text-[#1A1D3B] w-1/2">
              {data.name}
            </h1>
          </div>
          <span className="block text-center w-full font-proza font-medium text-white mt-2">
            {data.date}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MythosNews;
