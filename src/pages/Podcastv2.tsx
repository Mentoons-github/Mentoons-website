import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  PODCAST_CARD_DATA,
  PODCAST_OFFERINGS,
  PODCAST_V2_CATEGORY,
} from "@/constant";
import { useState } from "react";
import { IoPlay } from "react-icons/io5";

const Podcastv2 = () => {
  const [selectedCategory, setSelectedCategory] = useState("mobile addiction");

  const handleSelectedCategory = (category: string) => {
    setSelectedCategory(category);
  };
  return (
    <div className="w-[90%] mx-auto mt-12">
      {/* Hero section Start here */}
      <div className="flex items-start gap-8">
        <div className="flex-1">
          <h1 className="text-6xl text-primary font-bold py-8">
            Trending Podcast
          </h1>
          <p className="text-md font-semibold pb-8">
            Tune in to our educational and entertaining podcasts designed
            specifically for young listeners. From fascinating facts to
            thought-provoking discussions, our podcasts make learning fun and
            accessible.
          </p>
          <div>
            <img
              src="/assets/podcastv2/hero-image.png"
              alt="Left side hero Image"
            />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-center py-4 text-xl font-semibold ">
            PODCAST ONLY FOR YOU
          </h2>
          <img
            src="/assets/podcastv2/hero-image-2.png"
            alt="Right side hero image"
          />
        </div>
      </div>

      {/* This is what you get section */}

      <div className="flex flex-col py-12">
        <h2 className=" text-3xl font-semibold  text-center pb-12">
          This is What You Get
        </h2>
        <div className="flex items-center justify-around ">
          {PODCAST_OFFERINGS.map((podcast) => (
            <div
              key={podcast.label}
              className="flex flex-col items-center gap-4"
            >
              <img src={podcast.imgeUrl} alt={podcast.label} />
              <p
                style={{ color: podcast.accentColor }}
                className="font-bold text-lg"
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
          <h2 className="text-2xl font-semibold text-primary py-8 text-center">
            CATEGORIES TO CHOOSE FROM
          </h2>
          <div className="flex gap-12 items-center justify-center">
            {PODCAST_V2_CATEGORY.map((category) => (
              <div
                key={category.id}
                className={` flex items-center gap-4 border p-2 px-4 rounded-xl border-neutral-700 bg-orange-50  ring-orange-300   hover:ring-4  transition-ring duration-200   ${
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

          <div className=" flex items-start bg-[#FF6C6C]  rounded-xl ">
            <div className=" flex-1 rounded-x-xl ">
              <img
                src="/assets/podcastv2/podcast-thumbnail-social.png"
                alt="social Media Podcast Thumbnail"
                className=" object-cover rounded-xl"
              />
            </div>
            <div className=" flex-1 rounded-xl ">
              <h2 className="text-5xl font-semibold py-12 pr-24 tex">
                Negative impact of Mobile phone
              </h2>
              <p className="text-3xl  pr-24">
                Podcast Negative Impact of Mobile Phones takes a closer look at
                the consequences of our constant connection to the digital
                world.
              </p>

              <div className="flex items-center gap-4 py-8">
                Podcast Player Comming Soon!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Podcast  Section */}

      <div className="py-12">
        <h2 className="text-3xl font-semibold pb-12 ">
          Trending Podcast For You!
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* This data is also fetched from backend or redux store */}
          {PODCAST_CARD_DATA.map((podcast) => (
            <div
              key={podcast.id}
              className="border bg-[#3C4043] p-3 pt-4 pb-2 rounded-xl"
            >
              <div>
                <div className=" relative">
                  <img
                    src={podcast.imageUrl}
                    alt={podcast.title}
                    className="w-full"
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary p-2 rounded-full flex items-center justify-center ">
                        <IoPlay className="text-white text-3xl ml-[2px] " />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#3C4043] p-4 w-[40%] h-[50%]">
                      <div>
                        <h3 className="text-white ">{podcast.title}</h3>
                        <p>{podcast.title}</p>
                        <button>Play</button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-white font-semibold text-xl pb-4 pt-1">
                  {podcast.title}
                </p>
                <p className=" text-[#B3B3B3] text-[10px]">
                  {podcast.date} &#x2022; {podcast.duration}{" "}
                </p>

                <p className="text-primary font-semibold text-sm pb-0">
                  {podcast.price ? `Get form ₹ ${podcast.price}` : "Free"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Release Section */}
      <div>
        <div className="flex items-start gap-8 bg-gradient-to-b from-[#FF6D6D] to-white">
          {/* This data is fetched from backend or redux store */}
          <div className="flex-1  p-12">
            <div className="w-full  h-[400px] ">
              <img
                src="/assets/podcastv2/electronic-gadgets-and-kids-large.jpg"
                alt="Podcast Thumbnail"
                className=" w-full h-full object-cover rounded-xl object-center"
              />
            </div>

            <div>
              <h3 className="text-4xl font-semibold py-6 pb-4">
                Electronic gadgets and Kids
              </h3>
              <p className="text-gray-600 text-lg pb-4">
                Podcast on Electronic Gadgets and Kids examines the impact of
                digital devices on children's development and daily lives. Each
                episode explores how smartphones, tablets, and other
                gadgets.....
              </p>
              <p className="text-gray-400 text-sm">20 JAN &#x2022; 06 MIN </p>
            </div>

            <button className="flex items-center gap-2 bg-primary px-8 py-3 rounded-full mt-4 text-white">
              <p className="font-semibold text-lg">Play</p>
              <IoPlay className="text-2xl" />
            </button>
          </div>
          <div className="flex-1  p-12 mb-12">
            <h2 className="text-center text-3xl font-semibold ">
              CHECKOUT OUR NEW RELEASE
            </h2>
            <img
              src="/assets/podcastv2/new-headphones.png"
              alt="Headphone"
              className="w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Podcast Contribution */}
      <div className="p-12 bg-primary text-white mb-16 flex items-start gap-8">
        <div className="flex-1 ">
          <p className="tracking-wide py-1">
            FOR THE PEOPLE WHO WANT TO BE HEARD...
          </p>
          <p className="text-5xl pb-1 font-semibold">
            WANT YOUR VOICE TO BE HEARD
          </p>
          <p className="pb-8">
            If you want to create podcast on a particular topic, Join Us! Be the
            voice of change.
          </p>
          <div className="flex items-center gap-4 w-full ">
            <form className="flex flex-col gap-4 w-full">
              <div className="w-full pr-36">
                <textarea
                  name="message"
                  id="message"
                  placeholder="Write here"
                  className="p-4 rounded-xl  text-black w-full min-h-[200px] block  border border-black shadow-lg  "
                ></textarea>
              </div>
              <button
                type="submit"
                className=" text-white bg-blue-600 font-semibold px-8 py-2 rounded-xl w-fit "
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
