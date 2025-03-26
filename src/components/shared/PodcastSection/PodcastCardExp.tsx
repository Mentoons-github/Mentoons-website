import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@clerk/clerk-react";

import React from "react";
import { FaAlignCenter, FaCirclePause, FaCirclePlay } from "react-icons/fa6";

export interface IPODCAST {
  id?: number;
  topic: string;
  description: string;
  audioPodcastSampleSrc?: string;
  audioPodcastSrc: string;
  thumbnail: string;
  category: string;
  age: string;
  author?: string;
  duration?: string;
}

interface PodcastCardProps {
  podcast: IPODCAST;
  currentlyPlaying: HTMLAudioElement | null;
  setCurrentlyPlaying: React.Dispatch<
    React.SetStateAction<HTMLAudioElement | null>
  >;
  isSignedIn: boolean | undefined;
  showModal?: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const PodcastCardExp = ({
  podcast,
  currentlyPlaying,
  setCurrentlyPlaying,
  isSignedIn,
  setShowModal,
}: PodcastCardProps) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const { user } = useUser();

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
        if (!isSignedIn) {
          // Check if the user is not logged in
          audioRef.current.play();
          setIsPlaying(true);
          setCurrentlyPlaying(audioRef.current);
          const currentAudioRef = audioRef.current; // Store the current audioRef
          setTimeout(() => {
            if (currentAudioRef) {
              // Check if currentAudioRef is not null
              currentAudioRef.pause(); // Pause after 45 seconds
              currentAudioRef.currentTime = 0; // Reset to start
              setIsPlaying(false);
              setCurrentlyPlaying(null);
              setShowModal(true);
            }
          }, 45000); // 45 seconds
        } else {
          // User is logged in, check membership type
          const hasPaidMembership =
            isSignedIn &&
            user?.publicMetadata?.membershipType &&
            user.publicMetadata.membershipType !== "free";

          audioRef.current.play();
          setIsPlaying(true);
          setCurrentlyPlaying(audioRef.current);

          // If user has a free membership, restrict to 45 seconds
          if (!hasPaidMembership) {
            const currentAudioRef = audioRef.current;
            setTimeout(() => {
              if (currentAudioRef && currentAudioRef === audioRef.current) {
                currentAudioRef.pause();
                currentAudioRef.currentTime = 0;
                setIsPlaying(false);
                setCurrentlyPlaying(null);
                setShowModal(true);
              }
            }, 45000); // 45 seconds
          }
          // Paid members get full audio
        }
      }
    }
  };

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
    <>
      <div className="relative p-4 w-full text-black bg-white rounded-3xl border transition-all duration-300 border-zinc-100/20 hover:scale-105">
        <div className="flex justify-between items-center mb-1 text-2xl font-bold text-black line-clamp-1">
          <span className="pb-2 truncate">{podcast.topic}</span>
          {currentlyPlaying === audioRef.current && isPlaying && (
            <span className="flex gap-2 justify-between items-center px-2 h-6 text-xs font-medium leading-tight text-black whitespace-nowrap bg-red-500 rounded-full">
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
            className="object-cover w-full"
          />
        </div>

        <p className="text-sm text-black line-clamp-3">{podcast.description}</p>
        <div className="flex gap-3 justify-between items-center my-2 mb-0 text-xs">
          <div className="flex gap-2 items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex gap-3 items-center w-6 h-6 bg-red-600 rounded-full border-2 border-primary">
                    <img
                      src={
                        podcast.author === "Kisha Kothari"
                          ? "/assets/images/kisha.jpg"
                          : "/assets/images/harris-illustration.jpg"
                      }
                      alt="Author image"
                      className="rounded-full"
                    />
                    <span className="text-base font-bold whitespace-nowrap text-primary">
                      {podcast.author}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="flex overflow-visible gap-2 items-start">
                  <div className="w-12 bg-red-600 rounded-full border-2 border-primary">
                    <img
                      src={
                        podcast.author === "Kisha Kothari"
                          ? "/assets/images/kisha.jpg"
                          : "/assets/images/harris-illustration.jpg"
                      }
                      alt="Author image"
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex flex-col gap-0 items-center">
                    <span className="text-base tracking-tighter leading-none text-primary">
                      {podcast.author}
                    </span>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex justify-between items-center">
            <button
              onClick={handleSamplePlay}
              className="flex gap-2 justify-center items-center px-4 py-2 text-white whitespace-nowrap bg-rose-600 rounded-full transition-all duration-300 hover:bg-rose-700"
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
                  isSignedIn
                    ? podcast?.audioPodcastSrc
                    : podcast?.audioPodcastSampleSrc
                }
              ></audio>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PodcastCardExp;
