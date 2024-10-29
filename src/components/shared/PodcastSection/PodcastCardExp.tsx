import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";
import { FaAlignCenter, FaCirclePause, FaCirclePlay } from "react-icons/fa6";
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

const PodcastCardExp = ({
  podcast,
  currentlyPlaying,
  setCurrentlyPlaying,
  isSubscribed,
}: // setIsSubscribed,
{
  podcast: IPODCAST;
  currentlyPlaying: HTMLAudioElement | null;
  setCurrentlyPlaying: React.Dispatch<
    React.SetStateAction<HTMLAudioElement | null>
  >;
  isSubscribed: boolean;
  setIsSubscribed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  const handleSamplePlay = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the click event from propagating to the document
    if (currentlyPlaying && currentlyPlaying !== audioRef.current) {
      currentlyPlaying.pause();
      currentlyPlaying.currentTime = 0;
      setIsPlaying(!isPlaying);
      setCurrentlyPlaying(null);
    }
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(!isPlaying);
        setCurrentlyPlaying(null);
      } else {
        audioRef.current.play();
        setIsPlaying(!isPlaying);
        setCurrentlyPlaying(audioRef.current);
      }
    }
  };

  // const handleIsSubscribed = () => {
  //   setIsSubscribed(!isSubscribed);
  // };
  React.useEffect(() => {
    const audioElement = audioRef.current;

    if (audioElement) {
      const handleEnded = () => {
        audioElement.currentTime = 0;
        setIsPlaying(!isPlaying);
        setCurrentlyPlaying(null);
      };
      audioElement.addEventListener("ended", handleEnded);
      return () => {
        audioElement.removeEventListener("ended", handleEnded);
      };
    }
  }, [isPlaying, setCurrentlyPlaying]);

  React.useEffect(() => {
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
    <div className="relative  bg-white w-full border border-zinc-100/20 rounded-3xl   p-4 transition-all text-black  hover:scale-105  duration-300">
      {/* <div className=' absolute h-full w-full top-0 left-0 bg-[#ffffff76] opacity-0  transition-all duration-300 hover:opacity-100 hover:backdrop-blur-sm '> */}
      {/* <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2   text-sm font-semibold text-center flex gap-4 items-center justify-center '>
          <button
            onClick={handleSamplePlay}
            className=' bg-rose-600  rounded-full px-4 py-2 text-white  flex gap-2 items-center justify-center whitespace-nowrap'
          >
            {isPlaying ? "Pause" : "Play Now"}
            {currentlyPlaying === audioRef.current && isPlaying ? (
              <FaCirclePause />
            ) : (
              <FaCirclePlay />
            )}
            <audio
              ref={audioRef}
              src={
                isSubscribed
                  ? podcast?.audioPodcastSrc
                  : podcast?.audioPodcastSampleSrc
              }
            ></audio>
          </button>
          {!isSubscribed && (
            <button
              className=' bg-rose-600 rounded-full px-4 py-2 text-white flex items-center justify-center gap-2 whitespace-nowrap'
              onClick={handleIsSubscribed}
            >
              Subscribe
              <FaBell />
            </button>
          )}
        </div> */}
      {/* </div> */}
      <div className="text-2xl font-bold text-black mb-1 line-clamp-1 flex items-center justify-between ">
        <span className="truncate pb-2 ">{podcast.topic}</span>
        {currentlyPlaying === audioRef.current && isPlaying && (
          <span
            className=" px-2 h-6 text-xs text-black bg-red-500 leading-tight font-medium flex gap-2 items-center justify-between
            rounded-full whitespace-nowrap"
          >
            <div className="rotate-90">
              <FaAlignCenter />
            </div>
          </span>
        )}
      </div>
      <div className="h-48 overflow-hidden rounded-[12px] mb-3 ">
        <img
          src={podcast.thumbnail}
          alt="Podcast thumbnail"
          className="w-full object-cover"
        />
      </div>

      <p className="text-sm text-black line-clamp-3">{podcast.description}</p>
      <div className=" flex gap-3 items-center  justify-between text-xs my-2 mb-0">
        <div className="flex items-center gap-2 ">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-6 h-6 rounded-full bg-red-600 border-2 border-primary  flex gap-3 items-center ">
                  <img
                    src={
                      podcast.author === "Kisha Kothari"
                        ? "/assets/images/kisha.jpg"
                        : "/assets/images/harris-illustration.jpg"
                    }
                    alt="Author image"
                    className=" rounded-full"
                  />
                  <span className="text-primary font-bold  text-base whitespace-nowrap">
                    {podcast.author}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="overflow-visible flex items-start gap-2   ">
                <div className="w-12 rounded-full bg-red-600 border-2 border-primary ">
                  <img
                    src={
                      podcast.author === "Kisha Kothari"
                        ? "/assets/images/kisha.jpg"
                        : "/assets/images/harris-illustration.jpg"
                    }
                    alt="Author image"
                    className=" rounded-full"
                  />
                </div>
                <div className="flex flex-col gap-0  items-center">
                  <span className="text-primary text-base tracking-tighter leading-none">
                    {podcast.author}
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center justify-between ">
          <button
            onClick={handleSamplePlay}
            className=" bg-rose-600  rounded-full px-4 py-2 text-white  flex gap-2 items-center justify-center whitespace-nowrap hover:bg-rose-700 transition-all duration-300"
          >
            {isPlaying ? "Pause" : "Listen Now"}
            {currentlyPlaying === audioRef.current && isPlaying ? (
              <FaCirclePause />
            ) : (
              <FaCirclePlay />
            )}
            <audio
              ref={audioRef}
              src={
                isSubscribed
                  ? podcast?.audioPodcastSrc
                  : podcast?.audioPodcastSampleSrc
              }
            ></audio>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PodcastCardExp;
