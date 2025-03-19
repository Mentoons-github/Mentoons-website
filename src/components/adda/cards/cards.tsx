import { Groups } from "../../../types";

const GroupCards = ({
  cardData,
  type,
}: {
  cardData: Groups[];
  type: "parents" | "specializedRole";
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {cardData.map((data, index) => (
        <div
          className="rounded-lg shadow-xl p-5 w-3/4 max-w-sm mx-auto"
          key={index}
        >
          <div
            className="flex flex-col justify-between items-center overflow-hidden h-60 rounded-3xl"
            style={{ backgroundColor: data.bg }}
          >
            <h1 className="text-white font-extrabold text-lg sm:text-xl md:text-2xl text-center p-2">
              {data.mainTitle.toUpperCase()}
            </h1>
            <div className="w-48 sm:w-56 h-full flex justify-center items-center">
              <img
                src={data.img}
                alt={data.mainTitle?.toString()}
                className="w-full h-full object-fill rounded-lg"
              />
            </div>
          </div>
          <div className="space-y-4 mt-4">
            {data.mainTitle && (
              <h1 className="font-semibold text-lg sm:text-xl md:text-2xl">
                {data.mainTitle}
              </h1>
            )}
            <p className="text-sm sm:text-lg w-full text-left">
              {data.description}
            </p>
            <div className="flex justify-end">
              <button className="rounded-full px-6 py-2 bg-[#EC9600] font-extrabold text-sm sm:text-lg text-white cursor-pointer">
                JOIN NOW
              </button>
            </div>
          </div>
        </div>
      ))}
      {type === "parents" && (
        <div className="p-5 rounded-4xl border border-black shadow-lg w-3/4 h-fit flex flex-col justify-end self-end mx-auto">
          <h1 className="font-semibold text-5xl leading-10">
            Create your
            <span className="text-[#EC9600]">own group and invite Friends</span>
          </h1>
          <p className="inter leading-6 text-base mt-2">
            Have a unique interest, challenge, or idea that isn’t represented in
            our existing groups? Build your own group!
          </p>
          <div className="flex justify-center items-center my-12">
            <button className="rounded-full px-5 py-2 bg-[#652D90] roboto font-extrabold text-lg text-white cursor-pointer">
              CREATE GROUP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupCards;
