import React from "react";
import Slider from "react-slick";
import Heading from "../common/Heading";
import { Fade, Zoom } from "react-awesome-reveal";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/slider.css";
import { FaPlay } from 'react-icons/fa';

type HomeProps = {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setVideoType: React.Dispatch<React.SetStateAction<string>>;
};

type SliderImages = {
  imgUrl: string;
  altText: string;
};

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: false,
  arrows: false,
};

const MentoonsBenifit: React.FC<HomeProps> = ({ setModalOpen, setVideoType }) => {
  const sliderImages: SliderImages[] = [
    { imgUrl: "/slide1.jpg", altText: "Slide 1" },
    { imgUrl: "/slide2.jpg", altText: "Slide 2" },
    { imgUrl: "/slide3.jpg", altText: "Slide 3" },
  ];

  return (
    <div className="h-full w-full lg:h-full py-8 bg-light-yellow relative">
      <Fade direction="up" triggerOnce>
        <Heading heading="Mentoons Benefits" />
      </Fade>

      <div className="flex flex-col lg:flex-row lg:gap-10 items-center lg:items-start">
        <div className="w-full lg:w-1/3 flex flex-col mb-16 relative">
          <img src="/clouds.png" alt="clouds asset" className="absolute top-0 left-[7rem] h-[80%] w-full object-contain" />

          <Zoom triggerOnce>
            <Slider {...sliderSettings}>
              {sliderImages.map((image, index) => (
                <div className="flex justify-center items-center" key={index}>
                  <img
                    src={image.imgUrl}
                    alt={image.altText}
                    style={{ boxShadow: '6px 6px 0px rgba(103, 102, 102, 0.2)' }}
                    className="w-80 h-80 border-4 border-men-blue object-cover rounded-full shadow-roundedSlider-shadow lg:relative lg:left-1/2 lg:transform lg:-translate-x-1/2 ml-[1.7rem] lg:ml-0 md:ml-0"
                  />
                </div>
              ))}
            </Slider>
          </Zoom>
        </div>

        <div className="w-full lg:w-2/3 flex flex-col items-center px-10">
          <Fade direction="up" triggerOnce>
            <h1 className="text-5xl font-semibold mb-6 text-center lg:text-left">Why Choose Mentoons?</h1>
          </Fade>

          <Fade delay={100} direction="up" triggerOnce>
            <ul className="text-left lg:text-pretty text-2xl list-disc font-montserrat">
              <li className="mb-2"><b>Unique Approach:</b> Combines mentoring with cartoons, making learning fun and engaging.</li>
              <li className="mb-2"><b>Proven Methods:</b> Uses evidence-based methodologies to ensure effectiveness.</li>
              <li className="mb-2"><b>Holistic Coverage:</b> Addresses a wide range of issues, from screen time reduction to building social skills.</li>
              <li className="mb-2"><b>Expert Team:</b> Diverse professionals including developers, illustrators, designers, writers, music producers, and psychologists.</li>
            </ul>
          </Fade>
                
      <div className="mt-10 flex flex-col lg:flex-row-reverse lg:items-center lg:justify-around w-full">
            <div
              className="flex items-center justify-center lg:justify-start gap-4 cursor-pointer mb-10 lg:mb-0"
              onClick={() => {
                setModalOpen(true);
                setVideoType("HERO");
              }}
            >
              <button className="playBtn flex items-center justify-center bg-men-blue text-white p-3 rounded-full">
                <FaPlay className="shadow-xl" />
              </button>
              <span className="text-black lg:text-black text-lg sm:text-2xl font-semibold">
                What we do?
              </span>
            </div>
            <div className="relative w-full lg:w-[30rem] flex justify-center">
              <video
                src='https://mentoons-website.s3.ap-northeast-1.amazonaws.com/miscellaneous/What+we+do+(Mentoons+video).mp4'
                className="w-full h-auto rounded-md"
                poster='/hero-thumb3.png'
                controls
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default MentoonsBenifit;
