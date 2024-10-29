import React from "react";
import { Fade } from "react-awesome-reveal";
import Cards from "./Cards";

type CardsData = {
  url: string;
  boxUrl: string;
  cardText: string;
  linkUrl: string;
  dsecription: string;
};

const WhatWeOffer = () => {
  const [showVideo, setShowVideo] = React.useState<boolean>(false);
  const cards: CardsData[] = [
    {
      url: "/assets/home/workshop-n.png",
      boxUrl: "/assets/home/workshop-btn.png",
      cardText: "Workshops",
      linkUrl: "/mentoons-workshops",
      dsecription:
        "Interactive sessions led by industry experts, designed to enhance mentoring skills and foster personal growth.",
    },
    {
      url: "/assets/home/Comic-n.png",
      boxUrl: "/assets/home/comic-btn.png",
      cardText: "Comics",
      linkUrl: "/mentoons-comics",
      dsecription:
        "Our flagship offering, featuring beautifully illustrated stories that tackle various mentoring themes.",
    },
    {
      url: "/assets/home/audioComic.png",
      boxUrl: "/assets/home/acomic-btn.png",
      cardText: "Audio comics",
      linkUrl: "/mentoons-comics/audio-comics",
      dsecription:
        "An innovative fusion of traditional comics and audio storytelling, perfect for on-the-go learning.",
    },
    {
      url: "/assets/home/Podcast-n.png",
      boxUrl: "/assets/home/pod-btn.png",
      cardText: "Podcasts",
      linkUrl: "/mentoons-podcast",
      dsecription:
        '"Mentor Moments," our weekly podcast, featuring inspiring conversations with mentors from various fields.',
    },
  ];
  const handleShowVideo = () => {
    setShowVideo(!showVideo);
  };

  return (
    <div className="w-full bg-[url('/assets/home/Bg.png')] bg-no-repeat bg-top bg-contain pt-20 lg:pt-[28rem] ">
      <div className='w-full h-full flex flex-col gap-20 relative bg-[#ff6c6c] px-10 py-10'>
        {/* <div className="flex flex-col lg:flex-row z-30 items-center lg:text-left">
          <div>
            <Slide direction="left">
              <h1 className="text-4xl md:text-5xl lg:text-8xl text-white font-bold mb-4 text-center lg:text-left">
                What we offer?
              </h1>
              <h3 className="bg-men-blue text-white text-lg md:text-2xl lg:text-3xl px-4 sm:px-6 md:px-8 py-2 rounded-full max-w-fit">
                Why choose mentoons?
              </h3>
            </Slide>
          </div>
        </div> */}
        {!showVideo && (
          <figure className='w-4/5 sm:w-3/4 md:w-1/2 m-auto relative'>
            <img
              src='/assets/home/baloon.png'
              alt='balloons'
              className='w-full h-auto'
            />
            <div className='absolute top-1/2 left-4 sm:left-6 md:left-10 transform -translate-y-1/2'>
              <h1 className='text-left text-xl lg:text-6xl md:text-4xl font-bold mb-2 sm:mb-4 md:mb-6 leading-tight text-[#9e7300]'>
                ENGAGING
                <br /> MENTORING FOR
                <br /> YOUR CHILD
              </h1>
              <p className='text-left text-white text-base sm:text-lg md:text-xl lg:text-2xl'>
                Made fun and effective
              </p>
            </div>
            <button
              className='h-8 w-8 lg:h-28 lg:w-28 absolute bottom-8 right-12'
              onClick={handleShowVideo}
            >
              <img
                src='/assets/home/btn-yellow.png'
                alt='blue-btn'
                className='h-full w-full object-contain'
              />
            </button>
          </figure>
        )}

        {showVideo && (
          <div className='w-[60%] mx-auto'>
            <video
              src='https://mentoons-website.s3.ap-northeast-1.amazonaws.com/miscellaneous/What+we+do+(Mentoons+video).mp4'
              className='w-full h-auto rounded-md'
              poster='/hero-thumb3.png'
              controls
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 z-30 relative'>
          {cards.map((item, index) => (
            <Fade key={index} delay={index * 100}>
              <Cards indexValue={index} items={item} />
            </Fade>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatWeOffer;
