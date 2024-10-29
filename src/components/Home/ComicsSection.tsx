import AirplaneBg from "@/assets/imgs/airplaneBgHome.png";
import FlyingBook from "@/assets/imgs/bookBgHome.svg";
import React from "react";
// import ComicPodcastHome from "@/assets/imgs/comic-podcastHome.png";
// import PortalImgHome from "@/assets/imgs/portalBgHome.svg";
import heartImage from "/assets/home/heartImage.png";
import WorkshopBgHome from "/assets/home/workshopSection.png";
// import StoreBgHome from "@/assets/imgs/storeHome.png";
import ElderWorkshopHome from "@/assets/imgs/elderWorkshopHome.svg";
import BuddyWorkshopHome from "@/assets/imgs/kidsWorkshopHome.svg";
import Klement_Toonla_Home from "@/assets/imgs/klement_toonlaBgHome.svg";
import ParentWorkshopHome from "@/assets/imgs/parentsWorkshopHome.png";
import TeenWorkshopHome from "@/assets/imgs/teenWorkshopHome.svg";
// import workshopTextHome from "@/assets/imgs/workshopTextHome.svg";
import { easeInOut, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
// import AudioComicButton from "@/assets/imgs/audioComicButton.png";
// import PodcastButton from "@/assets/imgs/podcastButton.png";
// import ReadButton from "@/assets/imgs/readButton.png";
// import ListenButton from "@/assets/imgs/listenButton.png";
import { PODCAST_CATEGORY, PODCAST_SLIDER } from "@/constant";
import Autoplay from "embla-carousel-autoplay";
import { HiPlay } from "react-icons/hi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

const ComicsSection: React.FC = () => {
  const navigate = useNavigate();
  const [isActiveCategory, setIsActiveCategory] = React.useState("6-12");
  const [selectedTopic, setSelectedTopic] = React.useState(
    "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/where-it-all-begin.mp4"
  );
  const plugin = React.useRef(Autoplay({ delay: 2000 }));

  const handleSelectedCategroy = (category: string) => {
    setIsActiveCategory(category);
  };

  const handleSelectedTopic = (topic: string) => {
    console.log(topic);
    setSelectedTopic(topic);
  };
  return (
    <>
      <div className="relative  space-y-10 mt-20 mb-[160%] sm:mb-[124%] md:mb-[122%] lg:mb-[136%]">
        {/* WorkShop Section */}

        {/* Comic Section */}
        <div className="relative  top-[-100%]">
          <img
            src="/assets/images/workshop-section-bg.png"
            alt="comics background"
          />
          {/* <img
            className='absolute w-[40%] lg:w-[30%] top-[-2rem] lg:top-0 left-[20%]'
            src='/assets/home/box 3.png'
            alt='comics background border border-red-600'
          /> */}
          <div className="absolute top-[18%] flex items-center justify-center">
            <motion.img
              initial={{ x: -400 }}
              whileInView={{ x: 0 }}
              transition={{ duration: 3.5 }}
              className="hidden md:block md:w-[70%] lg:w-[80%]"
              src={AirplaneBg}
              alt="airplane image"
            />
            <motion.img
              initial={{ x: -300 }}
              whileInView={{ x: 0 }}
              transition={{ duration: 3.5 }}
              className="block md:hidden w-[80%]"
              src={AirplaneBg}
              alt="airplane image"
            />
          </div>
          <div className="hidden lg:block absolute top-[30%] lg:top-[20%]">
            <motion.img
              initial={{ rotateX: 10, y: -200, scale: 0 }}
              whileInView={{ rotateX: 0, y: 300, scale: 1.2, opacity: 0 }}
              transition={{ delay: 0.5, duration: 2, ease: easeInOut }}
              className="w-[50%] z-[50] relative -top-14 lg:left-[65%]"
              src={Klement_Toonla_Home}
              alt="klement and toonla"
            />
          </div>
          <div className="hidden md:block lg:hidden absolute top-[40%]">
            <motion.img
              initial={{ rotateX: 10, y: -200, scale: 0 }}
              whileInView={{ rotateX: 0, y: 68, scale: 1.2, opacity: 0 }}
              transition={{ delay: 0.8, duration: 2, ease: easeInOut }}
              className="w-[30%] z-[50] relative -top-14 left-[35%]"
              src={Klement_Toonla_Home}
              alt="klement and toonla"
            />
          </div>
          <div className="block md:hidden absolute top-[40%]">
            <motion.img
              initial={{ rotateX: 10, y: -70, scale: 0 }}
              whileInView={{ rotateX: 0, y: 60, scale: 1.2, opacity: 0 }}
              transition={{ delay: 0.8, duration: 2, ease: easeInOut }}
              className="w-[30%] z-[50] relative -top-14 left-[35%]"
              src={Klement_Toonla_Home}
              alt="klement and toonla"
            />
          </div>
          <div className="absolute z-50 flex items-center justify-start top-[50%]  left-[10%]">
            <motion.img
              initial={{ y: -20 }}
              animate={{ y: [-20, -10, -20] }} // Smooth movement between values
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror", // Ensures a seamless back-and-forth motion
              }}
              className="z-50 w-1/3 md:w-1/2 lg:w-full"
              src={FlyingBook}
              alt="books image"
            />
          </div>
          <div className="absolute flex items-center justify-around top-[40%] ] right-0 lg:right-[10%]">
            <motion.img
              initial={{ y: -20 }}
              animate={{ y: [-20, -10, -20] }} // Smooth movement between values
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror", // Ensures a seamless back-and-forth motion
              }}
              className="z-50 w-1/3 md:w-1/2 lg:w-full"
              src={FlyingBook}
              alt="books image"
            />
          </div>
          <div className="hidden md:block absolute top-[70%] lg:top-[60%] left-[20%]">
            <motion.img
              initial={{ y: -20, rotate: -25 }}
              animate={{ y: [-20, -10, -20], rotate: -25 }} // Smooth movement between values
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror", // Ensures a seamless back-and-forth motion
              }}
              className="z-[200] rotate-[-25deg] w-1/2"
              src={heartImage}
              alt="books image"
            />
          </div>
          <div className="hidden absolute md:flex items-center justify-around top-[70%] lg:top-[60%] right-0 lg:right-[10%]">
            <motion.img
              initial={{ y: -20 }}
              animate={{ y: [-20, -10, -20] }} // Smooth movement between values
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror", // Ensures a seamless back-and-forth motion
              }}
              className="z-50 -rotate-[25deg] w-1/3 md:w-1/2 lg:w-full"
              src={FlyingBook}
              alt="books image"
            />
          </div>
          {/* Workshop Section */}
          <div className="absolute top-[50%]">
            <div className=" relative ">
              <img className="" src={WorkshopBgHome} alt="workshop" />
              {/* <div>
          <img
            className="absolute w-[45%] -left-[1%] top-[12%]"
            src={workshopTextHome}
            alt="workshop"
          />
        </div> */}
              {/* <div className='absolute left-0 bottom-[142%]'>
            <img
              className='z-50 w-[15%] md:w-[30%] lg:w-2/3 cursor-pointer hover:scale-110 active:scale-105 transition-all ease-in-out duration-300'
              src={TransformButton}
              alt='comic button'
            />
          </div> */}
              {/* <div className="w-full absolute rotate-180 flex items-center justify-center right-4 top-0 ">
          <img className="w-1/3" src={PortalImgHome} alt="portal" />
        </div> */}
              <div className="">
                <img
                  onClick={() => navigate("/mentoons-workshops?workshop=6-12")}
                  className="absolute right-[38%] top-[26%] w-[13%] hover:scale-105 cursor-pointer transition-all ease-in-out duration-300"
                  src={BuddyWorkshopHome}
                  alt="workshop poster"
                />
              </div>
              <div>
                <img
                  onClick={() => navigate("/mentoons-workshops?workshop=13-19")}
                  className="absolute right-[13%] top-[30%] w-[15%] hover:scale-105 cursor-pointer rotate-2 transition-all ease-in-out duration-300"
                  src={TeenWorkshopHome}
                  alt="workshop poster"
                />
              </div>
              <div>
                <img
                  onClick={() =>
                    navigate("/mentoons-workshops?workshop=20+")
                  }
                  className="absolute right-[33%] top-[50%] w-[15%] hover:scale-105 cursor-pointer transition-all ease-in-out duration-300"
                  src={ElderWorkshopHome}
                  alt="workshop poster"
                />
              </div>
              <div>
                <img
                  onClick={() =>
                    navigate("/mentoons-workshops?workshop=Parents")
                  }
                  className="absolute right-[14%] top-[50%] w-[13%] hover:scale-105 cursor-pointer transition-all ease-in-out duration-300"
                  src={ParentWorkshopHome}
                  alt="workshop poster"
                />
              </div>
            </div>
          </div>
          {/* <div className='absolute left-0 -bottom-[15%]'>
            <img
              // onClick={() => navigate("/mentoons-comics/comics")}
              className='z-50 w-[30%] lg:w-2/3 cursor-pointer hover:scale-110 active:scale-105 transition-all ease-in-out duration-300'
              src={ReadButton}
              alt='comic button'
            />
          </div> */}
          {/* <div className="hidden md:block absolute -right-[45%] md:right-[8%] -bottom-[18%] md:-bottom-[16%] rotate-6">
            <img
              onClick={() => navigate("/mentoons-comics")}
              className="z-50 w-[25%] md:w-[40%] lg:w-2/3 cursor-pointer hover:scale-105 active:scale-95 transition-all ease-in-out duration-300"
              src={ComicButton}
              alt="comic button"
            />
          </div> */}
          {/*
        <div className="absolute left-1/2 -bottom-[45%]">
          <img
            onClick={() => navigate("/mentoons-comics/audio-comics")}
            className="z-50 md:w-[40%] lg:w-2/3 cursor-pointer hover:scale-110 active:scale-105 transition-all ease-in-out duration-300"
            src={AudioComicButton}
            alt="comic button"
          />
        </div> */}
          {/* <div className="absolute left-2/3 -bottom-[86%]">
          <img
            onClick={() => navigate("/mentoons-podcast")}
            className="z-50 w-2/3 cursor-pointer hover:scale-110 active:scale-105 transition-all ease-in-out duration-300"
            src={PodcastButton}
            alt="comic button"
          />
        </div> */}
          {/* <div className="absolute left-0 -bottom-[75%]">
          <img
            // onClick={() => navigate("/mentoons-comics/comics")}
            className="z-50 w-[30%] lg:w-2/3 cursor-pointer hover:scale-110 active:scale-105 transition-all ease-in-out duration-300"
            src={ListenButton}
            alt="comic button"
          />
        </div> */}
        </div>
        {/* Podcast Section*/}
        <div className="absolute -bottom-[136%] ">
          {/* <img className='block' src={podcastSection} alt='workshop' /> */}
          <div className="relative ">
            <img src="/assets/images/new-podcast-page.png" alt="" />
            <div className="absolute top-[29%]  w-[55%]">
              <div className="relative pl-2 md:pl-4  flex flex-col gap-8 ">
                <div className="relative">
                  <img src="/assets/images/mentoons-tv.png" alt="" />

                  <video
                    src={selectedTopic}
                    className=" w-[55%] absolute top-[33%] left-[22%]"
                    autoPlay
                    controls
                    muted
                  />
                </div>

                <div className="self-center ">
                  {PODCAST_CATEGORY.filter(
                    (item) => item.categroy === isActiveCategory
                  ).map((item) => (
                    <div key={item.categroy} className="pl-2 cursor-pointer">
                      {item.podcastCategoryTopics.map((topic, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 "
                          onClick={() => handleSelectedTopic(topic.videoSrc)}
                        >
                          <span className="text-3xl md:text-4xl lg:text-6xl">
                            <HiPlay />
                          </span>
                          <span className="text-base md:text-xl lg:text-2xl md:pt-2 hover:underline">
                            {topic.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute top-[32%] right-0  w-[45%]  px-2 md:pr-8 ">
              <div className="relative">
                <img src="/assets/images/blue-box.png" alt="" />

                <div className=" absolute top-0.5 w-full  pr-1 pt-0.5">
                  <div className="relative flex items-center justify-between">
                    <div className=" relative flex-1 flex flex-wrap  ">
                      <div className="relative flex-[0.5] flex flex-wrap pl-2 pt-2 ">
                        <div className="flex md:pt-8 md:pl-8">
                          <div
                            className="relative"
                            onClick={() =>
                              handleSelectedCategroy(
                                PODCAST_CATEGORY[0]?.categroy
                              )
                            }
                          >
                            <img
                              src={`/assets/images/${
                                isActiveCategory ===
                                PODCAST_CATEGORY[0]?.categroy
                                  ? "6-12-w.png"
                                  : "6-12-b.png"
                              }`}
                              alt=""
                              className=" w-full object-cover hover:scale-105 transition-all duration-300"
                            />
                          </div>
                          <div
                            className="relative  pr-1"
                            onClick={() =>
                              handleSelectedCategroy(
                                PODCAST_CATEGORY[1]?.categroy
                              )
                            }
                          >
                            <img
                              src={`/assets/images/${
                                isActiveCategory ===
                                PODCAST_CATEGORY[1]?.categroy
                                  ? "13-19-w.png"
                                  : "13-19-b.png"
                              }`}
                              alt=""
                              className="w-full md:object-cover hover:scale-105 transition-all duration-300"
                            />
                            {/* <span
                              className={`absolute top-1 left-1.5 md:top-5 md:left-7 text-xs md:text-3xl font-bold ${
                                isActiveCategory ===
                                PODCAST_CATEGORY[1]?.categroy
                                  ? "text-black"
                                  : "text-white"
                              } `}
                            >
                              {PODCAST_CATEGORY[1]?.categroy}
                            </span> */}
                          </div>
                        </div>
                        <div
                          className="relative md:pl-5"
                          onClick={() =>
                            handleSelectedCategroy(
                              PODCAST_CATEGORY[2]?.categroy
                            )
                          }
                        >
                          <img
                            src={`/assets/images/${
                              isActiveCategory === PODCAST_CATEGORY[2]?.categroy
                                ? "20+-w.png"
                                : "20+-b.png"
                            }`}
                            alt=""
                            className="w-full object-cover hover:scale-105 transition-all duration-300 "
                          />
                        </div>
                      </div>
                      <div
                        className="relative  flex flex-[0.5]"
                        onClick={() => navigate("/career-corner")}
                      >
                        <img
                          src="/assets/images/career-corner.png"
                          alt=""
                          className="w-full hover:scale-105 transition-all duration-300   "
                        />
                      </div>
                    </div>
                    {/* <div className=' relative flex flex-[0.4] border '>
                      <div className=' absolute w-[150px]'>
                        <img
                          src='/assets/images/career-corner.png'
                          alt=''
                          className='w-full '
                        />
                      </div>
                    </div> */}
                  </div>
                </div>
                <div className="absolute top-[30%]">
                  <div className="relative ">
                    <img
                      src="/assets/images/carousel-bg.png"
                      alt=""
                      className="p-3 md:p-8 pt-2"
                    />
                    <div className=" absolute top-5 md:top-10 ">
                      <div className="w-[36%] md:w-[46%] mx-auto">
                        <Carousel
                          plugins={[plugin.current]}
                          className="w-full  mx-auto   "
                          onMouseEnter={plugin.current.stop}
                          onMouseLeave={plugin.current.reset}
                        >
                          <CarouselContent>
                            {PODCAST_SLIDER.map((item, index) => (
                              <CarouselItem key={index}>
                                <div className=" w-full">
                                  <img
                                    src={`/assets/images/${item}`}
                                    alt=""
                                    className="w-full object-contain"
                                  />
                                  <p>{}</p>
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="bg-transparent border-none ml-2" />
                          <CarouselNext className="bg-transparent border-none mr-2" />
                        </Carousel>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-[21%] right-10  md:right-24  w-[30%]">
              <div className="relative">
                <img src="/assets/images/podcast-psychologists.png" alt="" />
              </div>
            </div>
          </div>

          {/* <div>
          <img
            className="absolute w-[45%] -left-[1%] top-[12%]"
            src={workshopTextHome}
            alt="workshop"
          />
        </div> */}
          {/* <div className="absolute left-0 bottom-[42%]">
          <img
            className="z-50 w-[15%] md:w-[30%] lg:w-2/3 cursor-pointer hover:scale-110 active:scale-105 transition-all ease-in-out duration-300"
            src={TransformButton}
            alt="comic button"
          />
        </div> */}
          {/* <div className="">
          <img
            onClick={() => navigate("/mentoons-workshops?workshop=buddy")}
            className="absolute right-[38%] top-[26%] w-[13%] hover:scale-105 cursor-pointer transition-all ease-in-out duration-300"
            src={BuddyWorkshopHome}
            alt="workshop poster"
          />
        </div>
        <div>
          <img
            onClick={() => navigate("/mentoons-workshops?workshop=teen")}
            className="absolute right-[13%] top-[30%] w-[15%] hover:scale-105 cursor-pointer rotate-2 transition-all ease-in-out duration-300"
            src={TeenWorkshopHome}
            alt="workshop poster"
          />
        </div>
        <div>
          <img
            onClick={() => navigate("/mentoons-workshops?workshop=family")}
            className="absolute right-[33%] top-[50%] w-[15%] hover:scale-105 cursor-pointer transition-all ease-in-out duration-300"
            src={ElderWorkshopHome}
            alt="workshop poster"
          />
        </div>
        <div>
          <img
            onClick={() => navigate("/mentoons-workshops?workshop=family")}
            className="absolute right-[14%] top-[50%] w-[13%] hover:scale-105 cursor-pointer transition-all ease-in-out duration-300"
            src={ParentWorkshopHome}
            alt="workshop poster"
          />
        </div> */}
        </div>
      </div>
    </>
  );
};

export default ComicsSection;

// import AirplaneBg from "@/assets/imgs/airplaneBgHome.png";
// import FlyingBook from "@/assets/imgs/bookBgHome.svg";
// import React from "react";
// // import ComicPodcastHome from "@/assets/imgs/comic-podcastHome.png";
// // import PortalImgHome from "@/assets/imgs/portalBgHome.svg";
// import ComicsBgHome from "@/assets/imgs/comicsBgHome.svg";
// import heartImage from "/assets/home/heartImage.png";
// import WorkshopBgHome from "/assets/home/workshopSection.png";
// import workshopBgHome2 from "/assets/home/workshopSection2.png";
// // import StoreBgHome from "@/assets/imgs/storeHome.png";
// import ElderWorkshopHome from "@/assets/imgs/elderWorkshopHome.svg";
// import BuddyWorkshopHome from "@/assets/imgs/kidsWorkshopHome.svg";
// import Klement_Toonla_Home from "@/assets/imgs/klement_toonlaBgHome.svg";
// import ParentWorkshopHome from "@/assets/imgs/parentsWorkshopHome.png";
// import TeenWorkshopHome from "@/assets/imgs/teenWorkshopHome.svg";
// // import workshopTextHome from "@/assets/imgs/workshopTextHome.svg";
// import ComicButton from "@/assets/imgs/comicButton.png";
// import { easeInOut, motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// // import AudioComicButton from "@/assets/imgs/audioComicButton.png";
// // import PodcastButton from "@/assets/imgs/podcastButton.png";
// // import ReadButton from "@/assets/imgs/readButton.png";
// // import ListenButton from "@/assets/imgs/listenButton.png";
// import { PODCAST_CATEGORY, PODCAST_SLIDER } from "@/constant";
// import Autoplay from "embla-carousel-autoplay";
// import { HiPlay } from "react-icons/hi";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "../ui/carousel";

// const ComicsSection: React.FC = () => {
//   const navigate = useNavigate();
//   const [isActiveCategory, setIsActiveCategory] = React.useState("6-12");
//   const [selectedTopic, setSelectedTopic] = React.useState(
//     "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/where-it-all-begin.mp4"
//   );
//   const plugin = React.useRef(Autoplay({ delay: 2000 }));

//   const handleSelectedCategroy = (category: string) => {
//     setIsActiveCategory(category);
//   };

//   const handleSelectedTopic = (topic: string) => {
//     console.log(topic);
//     setSelectedTopic(topic);
//   };
//   return (
//     <>
//       <div className="relative  space-y-10 mt-20 mb-[186%] sm:mb-[174%] md:mb-[162%] lg:mb-[156%]">
//         {/* WorkShop Section */}
//         <div className=" relative ">
//           <img className="" src={WorkshopBgHome} alt="workshop" />
//           {/* <div>
//           <img
//             className="absolute w-[45%] -left-[1%] top-[12%]"
//             src={workshopTextHome}
//             alt="workshop"
//           />
//         </div> */}
//           {/* <div className='absolute left-0 bottom-[142%]'>
//             <img
//               className='z-50 w-[15%] md:w-[30%] lg:w-2/3 cursor-pointer hover:scale-110 active:scale-105 transition-all ease-in-out duration-300'
//               src={TransformButton}
//               alt='comic button'
//             />
//           </div> */}
//           {/* <div className="w-full absolute rotate-180 flex items-center justify-center right-4 top-0 ">
//           <img className="w-1/3" src={PortalImgHome} alt="portal" />
//         </div> */}
//           <div className="">
//             <img
//               onClick={() => navigate("/mentoons-workshops?workshop=buddy")}
//               className="absolute right-[38%] top-[26%] w-[13%] hover:scale-105 cursor-pointer transition-all ease-in-out duration-300"
//               src={BuddyWorkshopHome}
//               alt="workshop poster"
//             />
//           </div>
//           <div>
//             <img
//               onClick={() => navigate("/mentoons-workshops?workshop=teen")}
//               className="absolute right-[13%] top-[30%] w-[15%] hover:scale-105 cursor-pointer rotate-2 transition-all ease-in-out duration-300"
//               src={TeenWorkshopHome}
//               alt="workshop poster"
//             />
//           </div>
//           <div>
//             <img
//               onClick={() => navigate("/mentoons-workshops?workshop=family")}
//               className="absolute right-[33%] top-[50%] w-[15%] hover:scale-105 cursor-pointer transition-all ease-in-out duration-300"
//               src={ElderWorkshopHome}
//               alt="workshop poster"
//             />
//           </div>
//           <div>
//             <img
//               onClick={() => navigate("/mentoons-workshops?workshop=family")}
//               className="absolute right-[14%] top-[50%] w-[13%] hover:scale-105 cursor-pointer transition-all ease-in-out duration-300"
//               src={ParentWorkshopHome}
//               alt="workshop poster"
//             />
//           </div>
//         </div>
//         {/* Workshop section - 2 */}
//         <div className="">
//           <img className="" src={workshopBgHome2} alt="workshop" />
//         </div>
//         {/* Comic Section */}
//         <div className="relative  top-[-100%]">
//           <img src={ComicsBgHome} alt="comics background" />
//           {/* <img
//             className='absolute w-[40%] lg:w-[30%] top-[-2rem] lg:top-0 left-[20%]'
//             src='/assets/home/box 3.png'
//             alt='comics background border border-red-600'
//           /> */}
//           <div className="absolute top-[40%] lg:top-[40%] flex items-center justify-center">
//             <motion.img
//               initial={{ x: -400 }}
//               whileInView={{ x: 0 }}
//               transition={{ duration: 3.5 }}
//               className="hidden md:block md:w-[70%] lg:w-[80%]"
//               src={AirplaneBg}
//               alt="airplane image"
//             />
//             <motion.img
//               initial={{ x: -300 }}
//               whileInView={{ x: 0 }}
//               transition={{ duration: 3.5 }}
//               className="block md:hidden w-[100%]"
//               src={AirplaneBg}
//               alt="airplane image"
//             />
//           </div>
//           <div className="hidden lg:block absolute top-[30%] lg:top-[50%]">
//             <motion.img
//               initial={{ rotateX: 10, y: -200, scale: 0 }}
//               whileInView={{ rotateX: 0, y: 300, scale: 1.2 }}
//               transition={{ delay: 0.5, duration: 2, ease: easeInOut }}
//               className="w-[50%] z-[50] relative -top-14 lg:left-[65%]"
//               src={Klement_Toonla_Home}
//               alt="klement and toonla"
//             />
//           </div>
//           <div className="hidden md:block lg:hidden absolute top-[60%]">
//             <motion.img
//               initial={{ rotateX: 10, y: -200, scale: 0 }}
//               whileInView={{ rotateX: 0, y: 68, scale: 1.2 }}
//               transition={{ delay: 0.8, duration: 2, ease: easeInOut }}
//               className="w-[30%] z-[50] relative -top-14 left-[35%]"
//               src={Klement_Toonla_Home}
//               alt="klement and toonla"
//             />
//           </div>
//           <div className="block md:hidden absolute top-[60%]">
//             <motion.img
//               initial={{ rotateX: 10, y: -70, scale: 0 }}
//               whileInView={{ rotateX: 0, y: 60, scale: 1.2 }}
//               transition={{ delay: 0.8, duration: 2, ease: easeInOut }}
//               className="w-[30%] z-[50] relative -top-14 left-[35%]"
//               src={Klement_Toonla_Home}
//               alt="klement and toonla"
//             />
//           </div>
//           <div className="absolute z-50 flex items-center justify-start top-[35%] lg:top-[30%] left-[10%]">
//             <motion.img
//               initial={{ y: -20 }}
//               animate={{ y: [-20, -10, -20] }} // Smooth movement between values
//               transition={{
//                 duration: 2,
//                 ease: "easeInOut",
//                 repeat: Infinity,
//                 repeatType: "mirror", // Ensures a seamless back-and-forth motion
//               }}
//               className="z-50 w-1/3 md:w-1/2 lg:w-full"
//               src={FlyingBook}
//               alt="books image"
//             />
//           </div>
//           <div className="absolute flex items-center justify-around top-[35%] lg:top-[30%] right-0 lg:right-[10%]">
//             <motion.img
//               initial={{ y: -20 }}
//               animate={{ y: [-20, -10, -20] }} // Smooth movement between values
//               transition={{
//                 duration: 2,
//                 ease: "easeInOut",
//                 repeat: Infinity,
//                 repeatType: "mirror", // Ensures a seamless back-and-forth motion
//               }}
//               className="z-50 w-1/3 md:w-1/2 lg:w-full"
//               src={FlyingBook}
//               alt="books image"
//             />
//           </div>
//           <div className="hidden md:block absolute top-[70%] lg:top-[60%] left-[20%]">
//             <motion.img
//               initial={{ y: -20, rotate: -25 }}
//               animate={{ y: [-20, -10, -20], rotate: -25 }} // Smooth movement between values
//               transition={{
//                 duration: 2,
//                 ease: "easeInOut",
//                 repeat: Infinity,
//                 repeatType: "mirror", // Ensures a seamless back-and-forth motion
//               }}
//               className="z-[200] rotate-[-25deg] w-1/2"
//               src={heartImage}
//               alt="books image"
//             />
//           </div>
//           <div className="hidden absolute md:flex items-center justify-around top-[70%] lg:top-[60%] right-0 lg:right-[10%]">
//             <motion.img
//               initial={{ y: -20 }}
//               animate={{ y: [-20, -10, -20] }} // Smooth movement between values
//               transition={{
//                 duration: 2,
//                 ease: "easeInOut",
//                 repeat: Infinity,
//                 repeatType: "mirror", // Ensures a seamless back-and-forth motion
//               }}
//               className="z-50 -rotate-[25deg] w-1/3 md:w-1/2 lg:w-full"
//               src={FlyingBook}
//               alt="books image"
//             />
//           </div>
//           <div className="absolute -bottom-[40%]">
//             <img src="/assets/home/comicSection.png" alt="comics shelf" />
//           </div>
//           {/* <div className='absolute left-0 -bottom-[15%]'>
//             <img
//               // onClick={() => navigate("/mentoons-comics/comics")}
//               className='z-50 w-[30%] lg:w-2/3 cursor-pointer hover:scale-110 active:scale-105 transition-all ease-in-out duration-300'
//               src={ReadButton}
//               alt='comic button'
//             />
//           </div> */}
//           <div className="hidden md:block absolute -right-[45%] md:right-[8%] -bottom-[18%] md:-bottom-[16%] rotate-6">
//             <img
//               onClick={() => navigate("/mentoons-comics")}
//               className="z-50 w-[25%] md:w-[40%] lg:w-2/3 cursor-pointer hover:scale-105 active:scale-95 transition-all ease-in-out duration-300"
//               src={ComicButton}
//               alt="comic button"
//             />
//           </div>
//           {/*
//         <div className="absolute left-1/2 -bottom-[45%]">
//           <img
//             onClick={() => navigate("/mentoons-comics/audio-comics")}
//             className="z-50 md:w-[40%] lg:w-2/3 cursor-pointer hover:scale-110 active:scale-105 transition-all ease-in-out duration-300"
//             src={AudioComicButton}
//             alt="comic button"
//           />
//         </div> */}
//           {/* <div className="absolute left-2/3 -bottom-[86%]">
//           <img
//             onClick={() => navigate("/mentoons-podcast")}
//             className="z-50 w-2/3 cursor-pointer hover:scale-110 active:scale-105 transition-all ease-in-out duration-300"
//             src={PodcastButton}
//             alt="comic button"
//           />
//         </div> */}
//           {/* <div className="absolute left-0 -bottom-[75%]">
//           <img
//             // onClick={() => navigate("/mentoons-comics/comics")}
//             className="z-50 w-[30%] lg:w-2/3 cursor-pointer hover:scale-110 active:scale-105 transition-all ease-in-out duration-300"
//             src={ListenButton}
//             alt="comic button"
//           />
//         </div> */}
//         </div>
//         {/* Podcast Section*/}
//         <div className="absolute -bottom-[60%] ">
//           {/* <img className='block' src={podcastSection} alt='workshop' /> */}
//           <div className="relative ">
//             <img src="/assets/images/new-podcast-page.png" alt="" />
//             <div className="absolute top-[29%]  w-[55%]">
//               <div className="relative pl-2 md:pl-4  flex flex-col gap-8 ">
//                 <div className="relative">
//                   <img src="/assets/images/mentoons-tv.png" alt="" />

//                   <video
//                     src={selectedTopic}
//                     className=" w-[55%] absolute top-[33%] left-[22%]"
//                     autoPlay
//                     controls
//                     muted
//                   />
//                 </div>

//                 <div className="self-center ">
//                   {PODCAST_CATEGORY.filter(
//                     (item) => item.categroy === isActiveCategory
//                   ).map((item) => (
//                     <div key={item.categroy} className="pl-2  ">
//                       {item.podcastCategoryTopics.map((topic, index) => (
//                         <div
//                           key={index}
//                           className="flex items-start gap-2 "
//                           onClick={() => handleSelectedTopic(topic.videoSrc)}
//                         >
//                           <span className="text-3xl md:text-4xl lg:text-6xl">
//                             <HiPlay />
//                           </span>
//                           <span className="text-base md:text-xl lg:text-2xl md:pt-2 hover:underline">
//                             {topic.title}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="absolute top-[32%] right-0  w-[45%]  px-2 md:pr-8">
//               <div className="relative">
//                 <img src="/assets/images/blue-box.png" alt="" />

//                 <div className=" absolute top-0.5 w-full  pr-1 pt-0.5">
//                   <div className="relative flex items-center justify-between">
//                     <div className=" relative flex-1 flex flex-wrap  ">
//                       <div className="relative flex-[0.5] flex flex-wrap pl-2 pt-2 ">
//                         <div className="flex md:pt-8 md:pl-8">
//                           <div
//                             className="relative"
//                             onClick={() =>
//                               handleSelectedCategroy(
//                                 PODCAST_CATEGORY[0]?.categroy
//                               )
//                             }
//                           >
//                             <img
//                               src={`/assets/images/${
//                                 isActiveCategory ===
//                                 PODCAST_CATEGORY[0]?.categroy
//                                   ? "6-12-w.png"
//                                   : "6-12-b.png"
//                               }`}
//                               alt=""
//                               className=" w-full object-cover hover:scale-105 transition-all duration-300"
//                             />
//                           </div>
//                           <div
//                             className="relative  pr-1"
//                             onClick={() =>
//                               handleSelectedCategroy(
//                                 PODCAST_CATEGORY[1]?.categroy
//                               )
//                             }
//                           >
//                             <img
//                               src={`/assets/images/${
//                                 isActiveCategory ===
//                                 PODCAST_CATEGORY[1]?.categroy
//                                   ? "13-19-w.png"
//                                   : "13-19-b.png"
//                               }`}
//                               alt=""
//                               className="w-full md:object-cover hover:scale-105 transition-all duration-300"
//                             />
//                             {/* <span
//                               className={`absolute top-1 left-1.5 md:top-5 md:left-7 text-xs md:text-3xl font-bold ${
//                                 isActiveCategory ===
//                                 PODCAST_CATEGORY[1]?.categroy
//                                   ? "text-black"
//                                   : "text-white"
//                               } `}
//                             >
//                               {PODCAST_CATEGORY[1]?.categroy}
//                             </span> */}
//                           </div>
//                         </div>
//                         <div
//                           className="relative md:pl-5"
//                           onClick={() =>
//                             handleSelectedCategroy(
//                               PODCAST_CATEGORY[2]?.categroy
//                             )
//                           }
//                         >
//                           <img
//                             src={`/assets/images/${
//                               isActiveCategory === PODCAST_CATEGORY[2]?.categroy
//                                 ? "20+-w.png"
//                                 : "20+-b.png"
//                             }`}
//                             alt=""
//                             className="w-full object-cover hover:scale-105 transition-all duration-300 "
//                           />
//                         </div>
//                       </div>
//                       <div
//                         className="relative  flex flex-[0.5]"
//                         onClick={() => navigate("/career-corner")}
//                       >
//                         <img
//                           src="/assets/images/career-corner.png"
//                           alt=""
//                           className="w-full hover:scale-105 transition-all duration-300   "
//                         />
//                       </div>
//                     </div>
//                     {/* <div className=' relative flex flex-[0.4] border '>
//                       <div className=' absolute w-[150px]'>
//                         <img
//                           src='/assets/images/career-corner.png'
//                           alt=''
//                           className='w-full '
//                         />
//                       </div>
//                     </div> */}
//                   </div>
//                 </div>
//                 <div className="absolute top-[30%]">
//                   <div className="relative ">
//                     <img
//                       src="/assets/images/carousel-bg.png"
//                       alt=""
//                       className="p-3 md:p-8 pt-2"
//                     />
//                     <div className=" absolute top-5 md:top-10 ">
//                       <div className="w-[36%] md:w-[46%] mx-auto">
//                         <Carousel
//                           plugins={[plugin.current]}
//                           className="w-full  mx-auto   "
//                           onMouseEnter={plugin.current.stop}
//                           onMouseLeave={plugin.current.reset}
//                         >
//                           <CarouselContent>
//                             {PODCAST_SLIDER.map((item, index) => (
//                               <CarouselItem key={index}>
//                                 <div className=" w-full">
//                                   <img
//                                     src={`/assets/images/${item}`}
//                                     alt=""
//                                     className="w-full object-contain"
//                                   />
//                                   <p>{}</p>
//                                 </div>
//                               </CarouselItem>
//                             ))}
//                           </CarouselContent>
//                           <CarouselPrevious className="bg-transparent border-none ml-2" />
//                           <CarouselNext className="bg-transparent border-none mr-2" />
//                         </Carousel>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="absolute top-[21%] right-10  md:right-24  w-[30%]">
//               <div className="relative">
//                 <img src="/assets/images/podcast-psychologists.png" alt="" />
//               </div>
//             </div>
//           </div>

//           {/* <div>
//           <img
//             className="absolute w-[45%] -left-[1%] top-[12%]"
//             src={workshopTextHome}
//             alt="workshop"
//           />
//         </div> */}
//           {/* <div className="absolute left-0 bottom-[42%]">
//           <img
//             className="z-50 w-[15%] md:w-[30%] lg:w-2/3 cursor-pointer hover:scale-110 active:scale-105 transition-all ease-in-out duration-300"
//             src={TransformButton}
//             alt="comic button"
//           />
//         </div> */}
//           {/* <div className="">
//           <img
//             onClick={() => navigate("/mentoons-workshops?workshop=buddy")}
//             className="absolute right-[38%] top-[26%] w-[13%] hover:scale-105 cursor-pointer transition-all ease-in-out duration-300"
//             src={BuddyWorkshopHome}
//             alt="workshop poster"
//           />
//         </div>
//         <div>
//           <img
//             onClick={() => navigate("/mentoons-workshops?workshop=teen")}
//             className="absolute right-[13%] top-[30%] w-[15%] hover:scale-105 cursor-pointer rotate-2 transition-all ease-in-out duration-300"
//             src={TeenWorkshopHome}
//             alt="workshop poster"
//           />
//         </div>
//         <div>
//           <img
//             onClick={() => navigate("/mentoons-workshops?workshop=family")}
//             className="absolute right-[33%] top-[50%] w-[15%] hover:scale-105 cursor-pointer transition-all ease-in-out duration-300"
//             src={ElderWorkshopHome}
//             alt="workshop poster"
//           />
//         </div>
//         <div>
//           <img
//             onClick={() => navigate("/mentoons-workshops?workshop=family")}
//             className="absolute right-[14%] top-[50%] w-[13%] hover:scale-105 cursor-pointer transition-all ease-in-out duration-300"
//             src={ParentWorkshopHome}
//             alt="workshop poster"
//           />
//         </div> */}
//         </div>
//       </div>
//     </>
//   );
// };

// export default ComicsSection;