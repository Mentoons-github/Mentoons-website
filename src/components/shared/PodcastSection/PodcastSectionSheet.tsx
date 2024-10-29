import React from "react";
import { PODCAST_DETAILS } from "../../../constant";
import PodcastCardExp from "./PodcastCardExp";

const PodcastSectionSheet = () => {
  const [currentlyPlaying, setCurrentlyPlaying] =
    React.useState<HTMLAudioElement | null>(null);
  const [isSubscribed, setIsSubscribed] = React.useState<boolean>(false);

  return (
    // <section className='p-4 pt-0'>
    //   <div className='grid grid-cols-1 gap-4  md:grid-cols-2  md:px-8 lg:grid-cols-3'>
    <>
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
    </>
    //   </div>
    // </section>
  );
};

export default PodcastSectionSheet;
