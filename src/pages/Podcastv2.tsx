import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  PODCAST_CARD_DATA,
  PODCAST_OFFERINGS,
  PODCAST_V2_CATEGORY,
} from "@/constant";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoPlay } from "react-icons/io5";

const Podcastv2 = () => {
  const [selectedCategory, setSelectedCategory] = useState("mobile addiction");
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

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

  const handleSelectedCategory = (category: string) => {
    setSelectedCategory(category);
  };
  return (
    <div className="w-[90%] mx-auto mt-16">
      {/* Hero section Start here */}
      <div className="items-start gap-8 md:flex">
        <div className="flex-1">
          <h1 className="py-8 text-5xl font-semibold text-primary md:text-6xl ">
            Trending Podcast
          </h1>
          <p className="text-xl font-semibold pb-8 w-[80%]">
            Tune in to our educational and entertaining podcasts designed
            specifically for young listeners. From fascinating facts to
            thought-provoking discussions, our podcasts make learning fun and
            accessible.
          </p>
          <div className="flex items-center justify-center ">
            <img
              src="/assets/podcastv2/hero-image.png"
              alt="Left side hero Image"
              className="w-full"
            />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="py-4 text-4xl font-semibold text-center luckiest-guy-regular text-neutral-700">
            PODCAST ONLY FOR YOU
          </h2>
          <img
            src="/assets/podcastv2/hero-image-2.png"
            alt="Right side hero image"
            className="flex items-center justify-center w-full"
          />
        </div>
      </div>

      {/* This is what you get section */}

      <div className="flex flex-col py-12">
        <h2 className="pb-12 text-3xl font-semibold text-center ">
          This is What You Get
        </h2>
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-around">
          {PODCAST_OFFERINGS.map((podcast) => (
            <div
              key={podcast.label}
              className="flex flex-col items-center gap-4 border p-4 rounded-xl w-[280px] h-[280px] justify-center"
            >
              <img
                src={podcast.imgeUrl}
                alt={podcast.label}
                className="w-24 h-24"
              />
              <p
                style={{ color: podcast.accentColor }}
                className="text-lg font-bold text-center"
              >
                {podcast.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Section */}

      <div className="flex flex-col gap-12">
        <div>
          <h2 className="py-8 text-2xl font-semibold text-center text-primary">
            CATEGORIES TO CHOOSE FROM
          </h2>
          <div className="flex flex-col-reverse items-center justify-center gap-8 md:flex-row md:gap-12">
            {PODCAST_V2_CATEGORY.map((category) => (
              <div
                key={category.id}
                className={` flex items-center gap-4 border p-2 px-4 rounded-xl border-neutral-700 bg-orange-50  ring-orange-300   hover:ring-4  transition-ring duration-200    ${
                  selectedCategory === category.lable
                    ? `ring-4 shadow-xl shadow-orange-200`
                    : ""
                } `}
                onClick={() => handleSelectedCategory(category.lable)}
              >
                <img
                  src={category.imgeUrl}
                  alt={category.lable}
                  className="w-9 "
                />
                <p className="font-semibold">{category.lable.toUpperCase()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Category Podcast Section  this is a carousel*/}
        <div className="rounded-xl">
          {/* The data here is fetched from Backend from redux store */}

          <div className=" flex flex-col md:flex-row items-start bg-[#FF6C6C]  rounded-xl ">
            <div className="flex items-center justify-center flex-1 w-full p-4 rounded-x-xl md:p-0">
              <img
                src="/assets/podcastv2/podcast-thumbnail-social.png"
                alt="social Media Podcast Thumbnail"
                className="object-cover md:w-full w-96 rounded-xl"
              />
            </div>
            <div className="flex flex-col items-center justify-center flex-1 w-full p-4 rounded-xl md:p-0">
              <h2 className="p-12 text-5xl font-semibold text-center md:pr-24 md:text-left ">
                Negative impact of Mobile phone
              </h2>
              <p className="px-12 text-3xl text-center md:pr-24 md:text-left">
                Podcast Negative Impact of Mobile Phones takes a closer look at
                the consequences of our constant connection to the digital
                world.
              </p>

              <div className="flex items-center justify-center gap-4 py-8 text-center md:text-left">
                Podcast Player Coming Soon!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Podcast  Section */}

      <div className="relative my-20 ">
        <h2 className="pb-6 text-4xl font-semibold">
          Trending Podcast For You!
        </h2>
        <div
          className="flex gap-8 overflow-x-auto scroll-smooth"
          ref={carouselRef}
        >
          {/* This data is also fetched from backend or redux store */}
          {PODCAST_CARD_DATA.map((podcast) => (
            <div
              key={podcast.id}
              className="border bg-[#3C4043] p-4 pt-4 pb-2 rounded-xl group hover:bg-primary transition-all duration-200 min-w-[250px] min-h-[350px]"
            >
              <div>
                <div className="relative">
                  <img
                    src={podcast.imageUrl}
                    alt={podcast.title}
                    className="w-full h-[210px] object-cover rounded-xl"
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="absolute flex items-center justify-center p-2 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-primary">
                        <IoPlay className="text-white text-3xl ml-[2px]" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#3C4043] p-4 w-[40%] h-[50%]">
                      <div>
                        <h3 className="text-white">{podcast.title}</h3>
                        <p>{podcast.title}</p>
                        <button>Play</button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="pt-1 pb-4 text-xl font-semibold text-white">
                  {podcast.title}
                </p>
                <p className="text-[#B3B3B3] text-[10px] group-hover:text-white">
                  {podcast.date} &#x2022; {podcast.duration}
                </p>

                <p className="pt-1 pb-0 text-sm font-semibold text-primary group-hover:text-orange-800">
                  {podcast.price
                    ? `Get it for ₹${podcast.price.toFixed(2)}`
                    : "Free"}
                </p>
              </div>
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

      {/* New Release Section */}
      <div>
        <div className="flex flex-col-reverse md:flex-row md:items-start md:gap-8 bg-gradient-to-b from-[#FF6D6D] to-white ">
          {/* This data is fetched from backend or redux store */}
          <div className="flex-1 p-12 pt-0 md:pt-12 ">
            <div className="w-full  h-[400px] ">
              <img
                src="/assets/podcastv2/electronic-gadgets-and-kids-large.jpg"
                alt="Podcast Thumbnail"
                className="object-cover object-center w-full h-full rounded-xl"
              />
            </div>

            <div>
              <h3 className="py-6 pb-4 text-4xl font-semibold">
                Electronic gadgets and Kids
              </h3>
              <p className="pb-4 text-lg text-gray-600">
                Podcast on Electronic Gadgets and Kids examines the impact of
                digital devices on children's development and daily lives. Each
                episode explores how smartphones, tablets, and other
                gadgets.....
              </p>
              <p className="text-sm text-gray-600">20 JAN &#x2022; 06 MIN </p>
            </div>

            <button className="flex items-center gap-2 px-8 py-3 mt-4 text-white rounded-full bg-primary">
              <p className="text-lg font-semibold">Play</p>
              <IoPlay className="text-2xl" />
            </button>
          </div>
          <div className="flex-1 p-12 md:mb-12">
            <h2 className="font-semibold text-center text-8xl luckiest-guy-regular">
              CHECKOUT OUR NEW RELEASE
            </h2>
            <div className="flex items-center justify-center w-full gap-4">
              <img
                src="/assets/podcastv2/new-headphones.png"
                alt="Headphone"
                className="object-cover "
              />
            </div>
          </div>
        </div>
      </div>

      {/* Podcast Contribution */}
      <div className="flex flex-col items-start gap-8 p-12 mb-16 text-white bg-primary md:flex-row">
        <div className="flex-1 ">
          <p className="tracking-wide ">
            FOR THE PEOPLE WHO WANT TO BE HEARD...
          </p>
          <p className="pt-2 pb-4 font-semibold text-7xl luckiest-guy-regular">
            WANT YOUR VOICE TO BE HEARD
          </p>
          <p className="pb-8">
            If you want to create podcast on a particular topic, Join Us! Be the
            voice of change.
          </p>
          <div className="flex items-center w-full gap-4 ">
            <form className="flex flex-col w-full gap-4">
              <div className="w-full md:pr-36">
                <textarea
                  name="message"
                  id="message"
                  placeholder="Write here"
                  className="p-4 rounded-xl text-black w-full min-h-[200px] shadow-lg"
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-12 py-3 text-lg font-semibold text-white bg-blue-600 rounded-xl w-fit"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
        <div className="flex-1 ">
          <img
            src="/assets/podcastv2/podcast-host.png"
            alt="Podcast host illustration"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Podcastv2;
