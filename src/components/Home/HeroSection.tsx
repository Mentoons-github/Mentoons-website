import React, { useState, useRef } from "react";
import { BsArrowsFullscreen } from "react-icons/bs";
import { FaPlay, FaArrowLeft } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
// import Sidebar from "../comics/Sidebar";

const HeroSection: React.FC = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handlePlayClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsVideoPlaying(true);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsVideoPlaying(false);
  };

  return (
    <section className="relative bg-white dark:bg-gray-900 h-full">
      <div className="absolute top-1/2 transform -translate-y-1/2 right-0 z-50 hidden lg:block">
        <div className="relative group">
          <div className="bg-primary text-white w-8 h-40 rounded-l-lg flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:w-14 group-hover:rounded-lg">
            <div className="flex flex-col items-center group-hover:items-start transition-all duration-300 ">
              {/* <Sidebar className="hidden md:block" /> */}
            </div>
          </div>
          <div className="absolute top-[10.2rem] right-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black text-white text-xs font-bold py-2 px-4 rounded-lg shadow-lg whitespace-nowrap">
              View Sidebar
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full h-full lg:h-screen bg-[#fff]">
        {!isVideoPlaying ? (
          <div className="relative w-full h-full flex justify-center items-center">
            <figure className="w-full h-full relative">
              <img
                src="/hero-img.jpg"
                alt="Video Thumbnail"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-black bg-opacity-5"></div>
              <button
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center z-10 border-4 rounded-full border-white py-3 lg:pl-5 px-3 shadow-xl transition-transform transform hover:scale-110"
                onClick={handlePlayClick}
              >
                <FaPlay className="text-white text-3xl lg:text-6xl text-center" />
              </button>
            </figure>
          </div>
        ) : (
          <div className="relative w-full h-full lg:h-screen">
            <video className="w-full h-full object-cover" controls autoPlay>
              <source
                src="https://mentoons-website.s3.ap-northeast-1.amazonaws.com/miscellaneous/Mentor+genie+animation.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>

      <div
        className={`bg-[#000000] lg:absolute lg:top-1/2 lg:transform lg:-translate-y-1/2 left-3 flex ${
          isVideoPlaying ? "flex-col-reverse" : "flex-col-reverse lg:flex-row"
        } lg:bg-transparent justify-between lg:w-full lg:relative`}
      >
        <div
          className={`lg:hidden text-left w-full lg:w-[40%] p-8 flex flex-col gap-4 font-montserrat ${
            !isVideoPlaying ? "lg:opacity-100" : "lg:opacity-0"
          }`}
        >
          <p className="text-[#fff] text-md lg:text-lg lg:font-bold">
            Carefully crafted by Psychologists
          </p>
          <p className="text-[#fff] text-2xl lg:text-3xl lg:font-bold">
            <span className="text-primary animate-glow">Comics</span> &#9679;{" "}
            <span className="text-primary animate-glow">Podcasts</span> &#9679;{" "}
            <span className="text-primary animate-glow">Workshops</span>
          </p>
          <h2 className="text-white text-md lg:text-xl lg:font-bold">
            Engaging Mentoring for Your Child, Made Fun and Effective. Give your
            child the gift of growth with Mentoons. A unique platform that
            combines enriching mentorship with the captivating power of
            cartoons.
          </h2>
          <div className="flex flex-col items-center lg:items-start gap-4">
            <span className="text-white text-lg lg:text-2xl whitespace-nowrap font-semibold">
              Start today and see the difference.
            </span>
            <button
              type="button"
              className="whitespace-nowrap text-white bg-primary hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-yellow-900 transition-colors"
            >
              Join Now
            </button>
          </div>
        </div>
        <div
          className={`flex items-center gap-4 justify-around px-10 lg:flex-col-reverse ${
            !isVideoPlaying ? "lg:opacity-100" : "lg:opacity-0"
          } lg:absolute lg:bottom-20 right-0`}
        >
          <button
            className="bg-transparent p-2 rounded-full flex flex-col items-center gap-1 transition-transform transform hover:scale-110"
            onClick={openModal}
          >
            <BsArrowsFullscreen className="text-white lg:text-black text-2xl lg:text-6xl" />
            <span className="text-white lg:text-black text-sm">
              Cinema Mode
            </span>
          </button>
          <button
            className="bg-transparent p-2 rounded-full flex flex-col items-center gap-1 transition-transform transform hover:scale-110"
            onClick={(e) => e.stopPropagation()}
          >
            <MdOutlineWatchLater className="text-white lg:text-black text-2xl lg:text-6xl" />
            <span className="text-white lg:text-black text-sm">
              Watch Later
            </span>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative w-full h-full" ref={modalRef}>
            <video
              className="w-full h-full object-contain lg:object-cover"
              controls
              autoPlay
            >
              <source
                src="https://mentoons-website.s3.ap-northeast-1.amazonaws.com/miscellaneous/Mentor+genie+animation.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <button
              className="absolute top-[2rem] lg:top-[6rem] left-4 text-white lg:text-black text-2xl z-50 transition-transform transform hover:scale-110"
              onClick={closeModal}
            >
              <FaArrowLeft />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
