import React, { useEffect, useRef } from "react";
import Slider from "react-slick";
import Heading from "../common/Heading";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/insidementoons.css";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Fade } from "react-awesome-reveal";
import { FaPlay } from "react-icons/fa6";
import { useLocation } from "react-router-dom";

interface SlideData {
  imageSrc: string;
  title: string;
  subtitle: string;
}
type HomeProps = {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setVideoType: React.Dispatch<React.SetStateAction<string>>;
};

const InsideMentoons: React.FC<HomeProps> = ({
  setModalOpen,
  setVideoType,
}) => {
  const insideMentoonsRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToInsideMentoons && insideMentoonsRef.current) {
      insideMentoonsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: (
      <MdKeyboardArrowLeft className="slick-prev absolute top-1/2 left-3 transform -translate-y-1/2 text-5xl text-[#333333] rounded-full p-2 shadow-lg cursor-pointer z-30" />
    ),
    nextArrow: (
      <MdKeyboardArrowRight className="slick-next absolute top-1/2 right-3 transform -translate-y-1/2 text-5xl text-[#333333] rounded-full p-2 shadow-lg cursor-pointer z-30" />
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const slideData: SlideData[] = [
    {
      imageSrc: "/team-01.jpg",
      title: "Mentor Mahesh",
      subtitle: "Founder",
    },
    {
      imageSrc: "/joice.jpg",
      title: "Joice Lincy",
      subtitle: "Digital Marketing",
    },
    {
      imageSrc: "/team-08.jpg",
      title: "Dhinesh Kumar.G",
      subtitle: "Graphic Designer",
    },
    {
      imageSrc: "/team-05.jpg",
      title: "Sankar P.Krishan",
      subtitle: "Illustrator",
    },
    {
      imageSrc: "/team-06.jpg",
      title: "Ajay",
      subtitle: "Video Editor",
    },
    {
      imageSrc: "/team-07.jpg",
      title: "Dhanasekar",
      subtitle: "Sketch Artist",
    },
    {
      imageSrc: "Akash.png",
      title: "Akash Gupta",
      subtitle: "Fullstack Developer",
    },
    {
      imageSrc: "Dheeraj.png",
      title: "Dheeraj Sharma",
      subtitle: "Fullstack Developer",
    },
    {
      imageSrc: "/Ankur.png",
      title: "Ankur Dutta",
      subtitle: "Fullstack Developer",
    },
  ];

  return (
    <div
      ref={insideMentoonsRef}
      id="inside-mentoons"
      className="w-full h-full bg-[#fdfbe8] py-10 md:py-20"
    >
      <Heading heading="Inside Mentoons" />
      <div className="flex justify-center">
        <div className="flex flex-col lg:flex-row items-center lg:items-start px-10 max-w-screen-2xl w-full gap-10">
          <div className="aspect-w-16 aspect-h-9 w-full lg:w-1/2">
            <video
              src="https://mentoons-website.s3.ap-northeast-1.amazonaws.com/miscellaneous/Team+Video_02.mp4"
              className="w-full h-full object-cover rounded-xl shadow-custom-complex"
              controls
              poster="/team-men.png"
            />
          </div>

          <div className="lg:w-1/2 p-4 lg:mt-[3rem]">
            <h1 className="text-2xl lg:text-3xl font-extrabold mb-4 text-[#333333]">
              Meet Us
            </h1>
            <p className="text-lg lg:text-xl text-[#333333] font-semibold">
              Mentoons is a result of the creative amalgamation of a diverse
              team coming together - our founder, talented developers, creative
              illustrators, skillful graphic designers, adept content
              writer&apos;s, melodious music producer, and experienced
              psychologists.
            </p>
            <div
              className="flex items-center justify-center lg:justify-start gap-4 cursor-pointer ml-0 lg:ml-12 mt-10"
              onClick={() => {
                setModalOpen(true);
                setVideoType("INSIDE_MENTOONS");
              }}
            >
              <button className="playBtn flex items-center justify-center bg-men-blue text-white p-3 rounded-full">
                <FaPlay className="shadow-xl" />
              </button>
              <span className="text-black lg:text-black text-lg sm:text-2xl font-semibold">
                Life inside Mentoons
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex justify-center items-center mt-10 m-auto px-10 py-3 bg-white w-full lg:w-[90%] rounded-lg shadow-lg">
        <Slider {...settings} className="w-full max-w-screen-2xl">
          {slideData.map((slide, index) => (
            <Fade key={index} delay={200} triggerOnce>
              <div className="relative p-4 flex justify-center">
                <div
                  className="w-[15rem] h-[15rem] rounded-full border-8 border-[#ec9600] bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${slide.imageSrc})`,
                    boxShadow: "6px 6px 0px rgba(103, 102, 102, 0.2)",
                  }}
                />
                <div className="absolute bottom-5 left-1/2 bg-[#ec9600] p-4 rounded-lg shadow-lg text-center">
                  <h2 className="text-sm lg:text-lg font-semibold text-[#fff] whitespace-nowrap">
                    {slide.title}
                  </h2>
                  <p className="text-white text-xs lg:text-md whitespace-nowrap">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </Fade>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default InsideMentoons;
