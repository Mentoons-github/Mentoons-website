import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const ComicsPageV2 = () => {
  const [selectedOption, setSelectedOption] = useState("e-comics");
  const handleSelectedOption = (option: string) => {
    setSelectedOption(option);
  };
  return (
    <div>
      {/* Hero section */}
      <div className="mt-10 md:mt-16 md:flex  md:items-start ">
        <div className="flex-1 ">
          <h1 className="text-2xl font-semibold text-primary text-center py-2 md:text-4xl md:py-8">
            E-Comics & Audio Comics
          </h1>
          <p className="text-center font-medium text-lg px-4 py-4 md:text-left md:text-2xl w-3/4 mx-auto ">
            Dive into colorful worlds and exciting stories that teach valuable
            lessons while entertaining young readers. Our diverse range of
            comics covers various subjects, from history and science to social
            skills and personal growth.
          </p>
        </div>
        <div className=" flex-1">
          <h2 className="text-xl text-center font-bold py-4">
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
        <h2 className="text-2xl font-semibold text-center py-6">
          RE-Discover the <br /> Passion of Reading
        </h2>
        <div className="flex items-center justify-center gap-6 pb-6">
          <button
            className="flex items-center justify-center gap-3 px-5 py-2  rounded-full bg-yellow-300 border border-black hov"
            onClick={() => handleSelectedOption("e-comics")}
          >
            <span className="w-1 h-1 rounded-full bg-black" />
            E-Comics
          </button>
          <button
            className="flex items-center justify-center gap-3 px-5 py-2  rounded-full bg-rose-500 border border-black "
            onClick={() => handleSelectedOption("audio-comics")}
          >
            <span className="w-1 h-1 rounded-full bg-black" />
            Audio Comic
          </button>
        </div>
        <p className="text-xs text-gray-500 text-center pb-8">
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
                  className="w-64 object-cover absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
                <img
                  src="/assets/comics/choose-wisely.jpg"
                  alt="comic 1"
                  className="w-64 object-cover absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                />
                <img
                  src="/assets/comics/dont-fade-away.jpg"
                  alt="comic 1"
                  className="w-64 object-cover absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2"
                />
                <img
                  src="/assets/comics/one-way-trip.jpg"
                  alt="comic 1"
                  className="w-64 object-cover absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2"
                />
              </div>
            </div>
          </div>
          <div className="flex-[0.6]  px-12 py-4">
            <h2 className="text-4xl font-semibold py-4 ">Bet Your Life?</h2>
            <p className="pb-6 text-xl pr-24 ">
              ¡Bienvenidos al primero de Los Especiales de Klapaucius, el
              podcast de arqueología de los videojuegos con Nahuel Fava y Martín
              Vecchio, nuestros Lara Croft sin te... See more
            </p>
            <button className="bg-primary text-white  text-xl py-3 px-7 rounded-full font-semibold">
              Read More
            </button>
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                className="bg-primary text-white text-xl p-3 rounded-full font-semibold"
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
                className="bg-primary text-white text-xl p-3 rounded-full font-semibold"
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
      <div className="w-[90%] mx-auto mb-20">
        <h2 className="text-4xl  font-semibold pb-6">
          Trending Comics For You!
        </h2>
        <div className="flex gap-8 overflow-x-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((comic, index) => (
            <div
              className="border border-gray-300 rounded-lg p-4 flex-shrink-0"
              key={comic + index}
            >
              <img
                src="/assets/comics/choose-wisely.jpg"
                alt="comic 1"
                className="w-56 h- object-cover rounded-lg"
              />
              <h3 className="text-xl font-medium pt-4">Choose Wisely</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Feature of the Month Section */}

      <div className="h-[600px] w-[90%] mx-auto mb-20  flex gap-8 ">
        <div className="flex-1  flex items-center justify-center  relative  h-full">
          <img src="/assets/comic-V2/feature-of-the-month.png" alt="" />
          <img
            src="/assets/comic-V2/star-1.png"
            alt=""
            className="absolute top-0 left-0"
          />
          <img
            src="/assets/comic-V2/star-2.png"
            alt=""
            className="absolute bottom-0 right-0"
          />
        </div>
        <div className="flex-1  p-6 ">
          <div className=" flex items-start gap-10 pb-4">
            <div>
              <img
                src="/assets/comics/bet-your-life.jpg"
                alt=""
                className="w-44"
              />
            </div>
            <div>
              <h2 className="text-5xl font-semibold pb-1">
                How To Handle <br /> Relationships
              </h2>
              <h3 className="text-lg font-semibold">For Teenagers</h3>
            </div>
          </div>
          <div className="pt-4">
            <div className="text-md font-semibold text-gray-500 pb-2">
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
              <button className="bg-primary text-white px-7 py-4 rounded-full font-semibold shadow-xl">
                READ MORE
              </button>
              <button className="p-2 rounded-full  border border-black">
                <BsThreeDots className="text-4xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComicsPageV2;
