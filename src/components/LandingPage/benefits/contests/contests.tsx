import { CONSTESTS } from "@/constant/constants";

const Contests = () => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="flex flex-col items-center gap-6">
        {CONSTESTS.length > 0 ? (
          CONSTESTS.map(({ image, title, text }, index) => (
            <div
              className="flex w-full max-w-4xl items-center justify-between border-b pb-6 gap-6 bg-blue-200 bg-opacity-50 p-4"
              key={index}
            >
              <div className="flex flex-col gap-4 flex-1 text-left">
                <h1 className="text-lg font-semibold">{title}</h1>
                <button className="px-6 py-2 bg-yellow-400 text-black font-medium rounded-lg shadow-md hover:bg-yellow-500 transition-all w-42">
                  {text}
                </button>
              </div>
              <div className="flex justify-end bg-white">
                <img
                  src={image}
                  alt={title}
                  className="w-[150px] h-[150px] object-cover rounded-lg shadow-md"
                />
              </div>
            </div>
          ))
        ) : (
          <h1 className="text-xl font-semibold text-gray-600">
            No contests found
          </h1>
        )}
      </div>
    </div>
  );
};

export default Contests;
