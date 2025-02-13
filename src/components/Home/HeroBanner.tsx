import { Fade } from "react-awesome-reveal";
import Sidebar from "../comics/Sidebar";
// type detailsData = {
//   url: string;
//   title: string;
//   description: string;
// };
const HeroBanner = () => {
  // const details: detailsData[] = [
  //   {
  //     url: "/assets/home/box 3.png",
  //     title: "Join Us",
  //     description:
  //       "Sign up and browse through our interactive sessions, books, games, and videos.",
  //   },
  //   {
  //     url: "/assets/home/box 2.png",
  //     title: "Join Us",
  //     description:
  //       "Sign up and browse through our interactive sessions, books, games, and videos.",
  //   },
  //   {
  //     url: "/assets/home/box 1.png",
  //     title: "Join Us",
  //     description:
  //       "Sign up and browse through our interactive sessions, books, games, and videos.",
  //   },
  // ];

  return (
    <div id="home-heroSection" className="h-full w-full relative z-10 ">
      <div className="absolute top-[5rem] right-0 z-50 hidden lg:block">
        <div className="relative group">
          <div className="bg-red-500 text-white w-8 h-40 rounded-l-lg flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:w-14 group-hover:rounded-lg">
            <div className="flex flex-col items-center group-hover:items-start transition-all duration-300 ">
              <Sidebar className="hidden md:block" content="comics" />
            </div>
          </div>
          <div className="absolute top-[4.2rem] right-[4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black text-white text-xs font-bold py-2 px-4 rounded-lg shadow-lg whitespace-nowrap">
              View Comics
            </div>
          </div>
        </div>
        <div className="relative group">
          <div className="bg-green-500 text-white w-8 h-40 rounded-l-lg flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:w-14 group-hover:rounded-lg">
            <div className="flex flex-col items-center group-hover:items-start transition-all duration-300 ">
              <Sidebar className="hidden md:block" content="podcasts" />
            </div>
          </div>
          <div className="absolute top-[4rem] right-[4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black text-white text-xs font-bold py-2 px-4 rounded-lg shadow-lg whitespace-nowrap">
              View Podcasts
            </div>
          </div>
        </div>
        <div className="relative group">
          <div className="bg-primary text-white w-8 h-40 rounded-l-lg flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:w-14 group-hover:rounded-lg">
            <div className="flex flex-col items-center group-hover:items-start transition-all duration-300 ">
              <Sidebar className="hidden md:block" content="workshops" />
            </div>
          </div>
          <div className="absolute top-[4rem] right-[4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black text-white text-xs font-bold py-2 px-4 rounded-lg shadow-lg whitespace-nowrap">
              View Workshops
            </div>
          </div>
        </div>
      </div>
      <Fade>
        <img
          loading="lazy"
          src="/assets/home/home-banner.png"
          alt="hero-banner"
          className="w-full object-cover hidden lg:block "
        />
      </Fade>

      <Fade>
        <img
          loading="lazy"
          src="/assets/home/mv.png"
          alt="hero-banner"
          className="w-full object-cover lg:hidden"
        />
      </Fade>
      {/* <div className='flex flex-row flex-nowrap w-full items-center justify-around  gap-4 sm:gap-6 px-3'>
        {details.map((item, index) => (
          <div
            key={index}
            className='w-[10rem] md:w-[15rem] lg:w-[20rem] h-auto relative -top-2 md:top-[-3rem] lg:top-[-5rem] flex flex-col items-center justify-center text-center'
          >
            <img
              src={item.url}
              alt={item.title}
              className='absolute inset-0 h-auto w-full object-contain'
            />
          </div>
        ))}
      </div> */}
      <img
        src="/assets/images/blue-bg.png"
        alt=""
        className="absolute -bottom-[18%] sm:-bottom-[20%] lg:-bottom-[33%]  -z-[1]"
      />
    </div>
  );
};

export default HeroBanner;
