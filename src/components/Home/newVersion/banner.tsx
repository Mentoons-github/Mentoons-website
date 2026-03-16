import { FaArrowUp } from "react-icons/fa6";

const HomeBanner = () => {
  return (
    <section className="relative h-screen mt-5">
      <div className="absolute -left-72 top-1/3 w-[600px] h-[600px] bg-purple-400/10 rounded-full" />
      <p className="absolute top-10 right-10 text-sm text-gray-500 w-72">
        In this digital age, where technology has become an integral part of
        children's lives, it is alarming to witness a growing trend of emotional
        detachment and lack of balance among our young ones
      </p>
      <img
        src="/assets/home/newPage/mother_and_child.png"
        className="absolute left-48 bottom-0 w-64"
      />

      <div className="px-10 py-5">
        <div className="flex items-center gap-2">
          <span className="w-12 h-1 bg-orange-600"></span>
          <p className="text-2xl font-semibold text-orange-400">
            FINDING BALANCE
          </p>
        </div>

        <h1 className="text-7xl font-extrabold ml-10 [-webkit-text-stroke:2px_rgba(0,0,0,0.5)]">
          <span className="bg-gradient-to-b from-orange-600 via-white to-green-600 text-transparent bg-clip-text">
            INTRODUCING
          </span>
          <br />
          <span className="bg-gradient-to-b from-orange-600 via-white to-green-600 text-transparent bg-clip-text ml-12">
            THE CONCEPT
          </span>
        </h1>

        <div className="flex items-center justify-center mt-2">
          <span className="whitespace-nowrap flex items-center text-8xl font-extrabold">
            😊f
          </span>
        </div>

        <div className="flex flex-col items-end mt-5">
          <h1 className="ml-auto mt-4 text-7xl font-extrabold text-right">
            <span className="bg-gradient-to-b from-orange-600 via-white to-green-600 text-transparent bg-clip-text [-webkit-text-stroke:2px_rgba(0,0,0,0.5)]">
              CROSS GENERATION & COLLABORATION
            </span>
          </h1>

          <div className="flex flex-col items-start mt-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-green-400">
                TO CREATE MENTALLY HEALTHY KIDS!
              </span>
              <span className="w-12 h-1 bg-green-500"></span>
            </div>

            <button className="flex items-center justify-center gap-2 rounded-lg bg-green-400 px-10 py-2 text-white mt-3 text-lg">
              Consult Us <FaArrowUp className="rotate-45" />{" "}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
