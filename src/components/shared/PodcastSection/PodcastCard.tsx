import React, { useEffect, useRef } from "react";
import { FaCirclePause, FaCirclePlay } from "react-icons/fa6";

interface IPODCAST {
  id: number;
  topic: string;
  description: string;
  audioPodcastSampleSrc: string;
  audioPodcastSrc: string;
  thumbnail: string;
  categroy: string;
  age: string;
  author: string;
  duration: string;
}

const PodcastCard = ({
  podcast,
  currentlyPlaying,
  setCurrentlyPlaying,
}: {
  podcast: IPODCAST;
  currentlyPlaying: HTMLAudioElement | null;
  setCurrentlyPlaying: React.Dispatch<
    React.SetStateAction<HTMLAudioElement | null>
  >;
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  const handleSamplePlay = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the click event from propagating to the document
    if (currentlyPlaying && currentlyPlaying !== audioRef.current) {
      setIsPlaying(false);
      currentlyPlaying.pause();
      currentlyPlaying.currentTime = 0;
    }
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        setCurrentlyPlaying(null);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        setCurrentlyPlaying(audioRef.current);
      }
    }
  };
  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      const handleEnded = () => {
        setCurrentlyPlaying(null);
      };
      audioElement.addEventListener("ended", handleEnded);
      return () => {
        audioElement.removeEventListener("ended", handleEnded);
      };
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setCurrentlyPlaying(null);
        setIsPlaying(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [setCurrentlyPlaying]);

  return (
    <div className=' border-2 border-neutral-800 p-4 pb-0 rounded-tr-[28px] rounded-tl-[28px] group'>
      <div className=' h-[200px] rounded-tr-xl rounded-tl-xl overflow-hidden  '>
        <img
          src={podcast.thumbnail}
          alt='Podcast thumbnail'
          className='aspect-video object-cover  group-hover:scale-110 transition-all duration-300'
        />
      </div>
      <div className='pt-2'>
        <h1 className='text-left text-xl text-neutral-800 font-bold truncate'>
          {podcast.topic}
        </h1>
        <p className='text-left text-sm text-neutral-600  pb-4 '>
          {podcast.description}
        </p>
      </div>
      <div className='border-t border-black flex items-center justify-end py-2 gap-2'>
        <span
          className='border border-black  flex rounded-full px-2 py-1 gap-2 cursor-pointer hover:scale-110 transition-all duration-200'
          onClick={handleSamplePlay}
        >
          <p className='font-semibold '>Play Now</p>
          <button className='text-xl'>
            {isPlaying ? (
              <FaCirclePause color='red' />
            ) : (
              <FaCirclePlay color='red' />
            )}
          </button>
          <audio ref={audioRef} src={podcast.audioPodcastSampleSrc}></audio>
        </span>

        <span className='border border-black  flex rounded-full px-2 py-1 gap-2 cursor-pointer hover:scale-110 transition-all duration-200'>
          <p className='font-semibold '>Buy Now</p>
          <button className='text-xl'>
            <div className='w-6'>
              <img src='/assets/cart.svg' alt='Cart icon' />
            </div>
          </button>
        </span>
      </div>
    </div>
  );
};

export default PodcastCard;
