import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import React from "react";
import { PODCAST_DETAILS, PODCAST_SLIDER } from "../../../constant";
import PodcastCardExp from "./PodcastCardExp";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
// import VoiceSampleUpload from "./VoiceUploadModal";

const PodcastSection = () => {
  const [currentlyPlaying, setCurrentlyPlaying] =
    React.useState<HTMLAudioElement | null>(null);
  const [isSubscribed, setIsSubscribed] = React.useState<boolean>(false);

  return (
    <section className='p-4 py-12  bg-[#dbdbdb]'>
      <motion.div
        initial={{ opacity: 0.5 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className='space-y-5 pb-8 text-center lg:text-start md:pl-8'
      >
        <motion.div
          initial={{ opacity: 0.5 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className=' text-3xl text-orange-900 lineBefore uppercase'
        >
          Podcasts
        </motion.div>
        <motion.div
          initial={{ y: 50 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 1.5 }}
          className='text-5xl lg:text-7xl  w-full font-bold leading-[1.10]'
        >
          Our Top Trendy Fun Podcasts
        </motion.div>
      </motion.div>

      <div className=' '>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 px-8 '>
          {PODCAST_DETAILS.map((podcast) => (
            // <PodcastCard
            //   key={podcast.id}
            //   podcast={podcast}
            //   currentlyPlaying={currentlyPlaying}
            //   setCurrentlyPlaying={setCurrentlyPlaying}
            // />
            <PodcastCardExp
              key={podcast.id}
              isSubscribed={isSubscribed}
              setIsSubscribed={setIsSubscribed}
              podcast={podcast}
              currentlyPlaying={currentlyPlaying}
              setCurrentlyPlaying={setCurrentlyPlaying}
            />
          ))}
        </div>
        {/* <div className='md:border-l border-stone-400 pt-8 md:pt-0 '>
          <div className='flex gap-4 items-start justify-center   h-fit '>
            <h1 className='text-2xl font-bold'>Passionate</h1>
            <h1 className='text-2xl font-bold'>Podcast</h1>
            <h1 className='text-2xl font-bold'>Enthusiast!</h1>
          </div>
          <div className='w-[60%]  mx-auto  '>
            <CarouselPodcast />
          </div>
          <div className='border border-stone-400 text-center text-2xl font-bold p-4 m-4 hover:scale-105 transition duration-300'>
            <button>Share your podcast</button>
          </div>
          <div className=' text-center text-2xl font-bold p-4 ml-4'>
            <button>Hiring Voice Artist</button>
          </div>
          <div className='w-[60%]  mx-auto   '>
            <CarouselPodcast />
          </div>
          <div className='border  border-stone-400 text-center text-2xl font-bold p-4 m-4 hover:scale-105 transition duration-300'>
            <VoiceSampleUpload />
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default PodcastSection;

export function CarouselPodcast() {
  const plugin = React.useRef(Autoplay({ delay: 2000 }));

  return (
    <Carousel
      plugins={[plugin.current]}
      className='w-full  mx-auto   '
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {PODCAST_SLIDER.map((item, index) => (
          <CarouselItem key={index}>
            <div className='  w-full'>
              <img
                src={`/assets/images/${item}`}
                alt=''
                className='w-full  object-contain'
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
