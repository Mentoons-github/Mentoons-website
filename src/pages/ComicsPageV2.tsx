import { WORKSHOP_MATTERS_POINTS } from "@/constant";
import { useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const ComicsPageV2 = () => {
  const [selectedOption, setSelectedOption] = useState("e-comics");
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleSelectedOption = (option: string) => {
    setSelectedOption(option);
  };

  const handleScroll = () => {
    const carousel = carouselRef.current;
    if (carousel) {
      setIsAtStart(carousel.scrollLeft === 0);
      setIsAtEnd(
        carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1
      );
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", handleScroll);
      return () => carousel.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div>
      {/* Hero section */}
      <div className="mt-10 md:mt-16 md:flex md:items-start ">
        <div className="flex-1 ">
          <h1 className="py-2 text-2xl font-semibold text-center text-primary md:text-6xl md:py-8 md:pb-6">
            E-Comics & Audio Comics
          </h1>
          <p className="w-3/4 px-4 py-4 mx-auto text-lg font-medium text-center md:text-left md:text-2xl ">
            Dive into colorful worlds and exciting stories that teach valuable
            lessons while entertaining young readers. Our diverse range of
            comics covers various subjects, from history and science to social
            skills and personal growth.
          </p>
        </div>
        <div className="flex-1 ">
          <h2 className="py-4 text-3xl text-center luckiest-guy-regular">
            CHOOSE COMICS BEST FOR YOU!
          </h2>
          <div>
            <img
              src="/assets/comic-V2/comic-hero-v2.png"
              alt="comic page hero Image"
            />
          </div>
        </div>
      </div>
      {/* Second Section Reading Comics and Audio comics */}
      <div className="">
        <h2 className="py-6 text-4xl font-bold text-center">
          Re-Discover the <br /> Passion of Reading
        </h2>
        <div className="flex items-center justify-center gap-6 pb-6">
          <button
            className={`flex items-center justify-center gap-3 px-5 py-2  rounded-full bg-yellow-100 border border-yellow-400 hover:ring-4 hover:ring-yellow-300 transition-all duration-200 font-medium ${
              selectedOption === "e-comics" &&
              "ring-4 ring-yellow-400 shadow-xl shadow-yellow-100"
            }`}
            onClick={() => handleSelectedOption("e-comics")}
          >
            <span className="w-1 h-1 bg-black rounded-full" />
            E-Comics
          </button>
          <button
            className={`flex items-center justify-center gap-3 px-5 py-2  rounded-full bg-rose-200 border border-rose-500  hover:ring-4 hover:ring-rose-500 transition-all duration-200  font-medium ${
              selectedOption === "audio-comics" &&
              "ring-4 ring-rose-500 shadow-xl shadow-rose-100"
            }`}
            onClick={() => handleSelectedOption("audio-comics")}
          >
            <span className="w-1 h-1 bg-black rounded-full" />
            Audio Comic
          </button>
        </div>
        <p className="pb-8 text-xs text-center text-gray-500">
          pdf format - download, print and your comic is ready!
        </p>
      </div>
      {/* //dynamic content section */}
      {selectedOption === "e-comics" && (
        <div className=" h-[600px] flex items-center justify-center w-[80%] mx-auto  mb-20 bg-[#FFE9C1] ">
          <div className="flex-[0.4] h-full relative  overflow-hidden ">
            <div
              className="bg-primary rounded-full absolute -top-[200px] -left-[700px]  w-[1000px] h-[1000px]  "
              id="circle"
            >
              <div className="w-[1000px] h-[1000px] relative">
                <img
                  src="/assets/comics/bet-your-life.jpg"
                  alt="comic 1"
                  className="absolute top-0 object-cover w-64 -translate-x-1/2 -translate-y-1/2 left-1/2"
                />
                <img
                  src="/assets/comics/choose-wisely.jpg"
                  alt="comic 1"
                  className="absolute bottom-0 object-cover w-64 -translate-x-1/2 translate-y-1/2 left-1/2"
                />
                <img
                  src="/assets/comics/dont-fade-away.jpg"
                  alt="comic 1"
                  className="absolute left-0 object-cover w-64 -translate-x-1/2 -translate-y-1/2 top-1/2"
                />
                <img
                  src="/assets/comics/one-way-trip.jpg"
                  alt="comic 1"
                  className="absolute right-0 object-cover w-64 translate-x-1/2 -translate-y-1/2 top-1/2"
                />
              </div>
            </div>
          </div>
          <div className="flex-[0.6]  px-12 py-4">
            <h2 className="py-4 text-4xl font-semibold ">Bet Your Life?</h2>
            <p className="pb-6 pr-24 text-xl ">
              ¡Bienvenidos al primero de Los Especiales de Klapaucius, el
              podcast de arqueología de los videojuegos con Nahuel Fava y Martín
              Vecchio, nuestros Lara Croft sin te... See more
            </p>
            <button className="py-3 text-xl font-semibold text-white rounded-full bg-primary px-7">
              Read More
            </button>
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                className="p-3 text-xl font-semibold text-white rounded-full bg-primary"
                onClick={() => {
                  const circle = document.getElementById("circle");
                  const images = circle?.getElementsByTagName("img");
                  if (circle && images) {
                    let currentRotation = parseInt(
                      circle.getAttribute("data-rotation") || "0"
                    );
                    currentRotation -= 90;
                    circle.style.transform = `rotate(${currentRotation}deg)`;
                    circle.style.transition = "transform 0.5s ease";
                    circle.setAttribute(
                      "data-rotation",
                      currentRotation.toString()
                    );

                    // Counter-rotate images to maintain orientation
                    Array.from(images).forEach((img) => {
                      const position = img.className.includes("top-0")
                        ? "translate(-50%, -50%)"
                        : img.className.includes("bottom-0")
                        ? "translate(-50%, 50%)"
                        : img.className.includes("left-0")
                        ? "translate(-50%, -50%)"
                        : "translate(50%, -50%)";
                      img.style.transform = `${position} rotate(${-currentRotation}deg)`;
                      img.style.transition = "transform 0.5s ease";
                    });
                  }
                }}
              >
                <IoIosArrowBack className="text-3xl" />
              </button>
              <button
                className="p-3 text-xl font-semibold text-white rounded-full bg-primary"
                onClick={() => {
                  const circle = document.getElementById("circle");
                  const images = circle?.getElementsByTagName("img");
                  if (circle && images) {
                    let currentRotation = parseInt(
                      circle.getAttribute("data-rotation") || "0"
                    );
                    currentRotation += 90;
                    circle.style.transform = `rotate(${currentRotation}deg)`;
                    circle.style.transition = "transform 0.5s ease";
                    circle.setAttribute(
                      "data-rotation",
                      currentRotation.toString()
                    );

                    // Counter-rotate images to maintain orientation
                    Array.from(images).forEach((img) => {
                      const position = img.className.includes("top-0")
                        ? "translate(-50%, -50%)"
                        : img.className.includes("bottom-0")
                        ? "translate(-50%, 50%)"
                        : img.className.includes("left-0")
                        ? "translate(-50%, -50%)"
                        : "translate(50%, -50%)";
                      img.style.transform = `${position} rotate(${-currentRotation}deg)`;
                      img.style.transition = "transform 0.5s ease";
                    });
                  }
                }}
              >
                <IoIosArrowForward className="text-3xl" />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Audio comics video */}
      {selectedOption === "audio-comics" && (
        <div className=" bg-[#FFBABA] relative h-[600px] w-[80%] mx-auto  overflow-hidden p-12 mb-20">
          <div className="w-[600px] h-[600px] rounded-full bg-[#EF4444] absolute top-[40px] -left-40 z-9" />
          <div className="w-32 h-32 rounded-full bg-[#EF4444] absolute -top-10 -right-10  z-9" />
          <div className="bg-gray-500 relative h-[510px] rounded-xl ">
            <video src={import.meta.env.VITE_STATIC_URL}></video>
          </div>
        </div>
      )}

      {/* Trending comics  Carousel  */}
      <div className="w-[90%] mx-auto mb-20 relative">
        <h2 className="pb-6 text-4xl font-semibold">
          Trending Comics For You!
        </h2>
        <div
          className="flex gap-8 overflow-x-auto scroll-smooth"
          ref={carouselRef}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((comic, index) => (
            <div
              className="flex-shrink-0 p-4 border border-gray-300 rounded-lg"
              key={comic + index}
            >
              <img
                src="/assets/comics/choose-wisely.jpg"
                alt="comic 1"
                className="object-cover w-56 rounded-lg"
              />
              <h3 className="pt-4 text-xl font-medium">Choose Wisely</h3>
            </div>
          ))}
        </div>
        {/* Navigation buttons */}
        <button
          onClick={() => {
            const carousel = carouselRef.current;
            if (carousel) {
              carousel.scrollBy({ left: -300, behavior: "smooth" });
            }
          }}
          className="absolute left-0 p-2 transition-colors -translate-y-1/2 rounded-full shadow-lg top-1/2 bg-white/80 hover:bg-white"
          style={{ display: isAtStart ? "none" : "block" }}
        >
          <IoIosArrowBack className="text-2xl" />
        </button>
        <button
          onClick={() => {
            const carousel = carouselRef.current;
            if (carousel) {
              carousel.scrollBy({ left: 300, behavior: "smooth" });
            }
          }}
          className="absolute right-0 p-2 transition-colors -translate-y-1/2 rounded-full shadow-lg top-1/2 bg-white/80 hover:bg-white"
          style={{ display: isAtEnd ? "none" : "block" }}
        >
          <IoIosArrowForward className="text-2xl" />
        </button>
      </div>

      {/* Feature of the Month Section */}

      <div className=" w-[90%] mx-auto mb-20  md:flex  gap-8  ">
        <div className="relative flex items-center justify-center flex-1 h-full ">
          <div className="flex flex-col items-center justify-center py-16 text-6xl font-semibold text-center md:py-32 md:text-7xl lg:text-9xl text-nuetural-800 luckiest-guy-regular">
            <span>FEATURE</span>
            <span>OF THE</span>
            <span>MONTH</span>
          </div>
          <img
            src="/assets/comic-V2/star-1.png "
            alt="star-1"
            className="absolute top-0 left-0 w-16 md:w-24"
          />
          <img
            src="/assets/comic-V2/star-2.png"
            alt=""
            className="absolute bottom-0 right-0 w-16 md:w-24"
          />
        </div>
        <div className="flex-1 p-6 mt-12">
          <div className="flex items-start gap-10 pb-4 ">
            <div>
              <img
                src="/assets/comics/bet-your-life.jpg"
                alt=""
                className="w-44"
              />
            </div>
            <div>
              <h2 className="pb-1 text-4xl font-semibold">
                How To Handle <br /> Relationships
              </h2>
              <h3 className="text-lg font-semibold">For Teenagers</h3>
            </div>
          </div>
          <div className="pt-4">
            <div className="pb-2 font-semibold text-gray-500 text-md">
              {" "}
              JAN 13TH &#x2022; 12 MIN
            </div>
            <p className="text-lg font-medium">
              This is a brief summary of the comic al primero de Los Especiales
              con Nahuel Fava y Martín Vecchio, nuestros Lara Croft sin te...
              See moreThis is a brief summary of the comic al primero de Los
              Especiales con Nahuel Fava y Martín Vecchio, nuestros Lara Croft
              sin te... See moreThis is a brief summary of the comic al primero
              de Los Especiales con Nahuel Fava y Martín Vecchio, nuestros Lara
              Croft sin te... See more
            </p>
            <div className="flex items-center justify-between pt-10">
              <button className="py-4 font-semibold text-white rounded-full shadow-xl bg-primary px-7">
                READ MORE
              </button>
              <button className="p-2 border border-black rounded-full">
                <BsThreeDots className="text-4xl" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* why we matter */}
      <div className="px-6  md:py-12 md:flex md:items-center md:px-20 bg-gradient-to-r from-[#FFCF7B] to[#FFFFFF]">
        <div className="flex-1 ">
          {WORKSHOP_MATTERS_POINTS.map((point) => (
            <div key={point.id} className="flex items-center gap-4 p-4">
              <figure className="">
                <img src={point.icon} alt="icon" className="w-16 md:w-16" />
              </figure>
              <div>
                <p className="text-2xl">
                  <span className="text-2xl font-bold ">{point.lable}:</span>{" "}
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="relative items-start justify-center flex-1 ">
          <h2 className="pt-4 text-8xl font-semibold text-center luckiest-guy-regular text-black [-webkit-text-stroke:_2px_black]">
            Why our workshops matter?
          </h2>
          {/* <figure className="flex items-center justify-end w-full p-4 pt-0 ">
            <img src="/assets/workshopv2/man-thinking.png" alt="" />
          </figure> */}
        </div>
      </div>
    </div>
  );
};

export default ComicsPageV2;
