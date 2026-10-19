import { ProductBase, PodcastProduct } from "@/types/productTypes";
import { IoPlay } from "react-icons/io5";
import React, { useEffect, useRef } from "react";

interface PodcastCardProps {
  podcast: ProductBase;
  isPlaying: boolean;
  onPlayToggle: (podcastId: string) => void;
  onCheckAccessAndControlPlayback: (
    podcast: ProductBase,
    audioElement?: HTMLAudioElement | null,
  ) => boolean | Promise<boolean>;
  onPlaybackTrackingUpdate: (update: (prev: any) => any) => void;
  onPodcastCompletion: (podcastId: string, podcastType: string) => void;
  playbackTracking: any;
  onRegisterAudio?: (audio: HTMLAudioElement) => void;
  isSwitchingRef?: React.MutableRefObject<boolean>;
}

const PodcastCard: React.FC<PodcastCardProps> = ({
  podcast,
  isPlaying,
  onPlayToggle,
  onCheckAccessAndControlPlayback,
  onPlaybackTrackingUpdate,
  onPodcastCompletion,
  playbackTracking,
  onRegisterAudio,
  isSwitchingRef,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const productType = podcast.product_type
    ? ((podcast.product_type.charAt(0).toUpperCase() +
        podcast.product_type.slice(1).toLowerCase()) as
        "Free" | "Prime" | "Platinum")
    : "Free";

  useEffect(() => {
    if (audioRef.current) {
      if (onRegisterAudio) {
        onRegisterAudio(audioRef.current);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      if (onRegisterAudio) {
        onRegisterAudio(audio);
      }
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      if (!audio.paused) {
        if (isSwitchingRef) {
          isSwitchingRef.current = true;
          audio.pause();
          setTimeout(() => {
            isSwitchingRef.current = false;
          }, 100);
        }
      }
      audio.currentTime = 0;
    }
  }, [isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

  const category = (podcast.details as PodcastProduct["details"])?.category;

  return (
    <div
      className={`p-4 rounded-2xl group transition-all duration-300 min-w-[280px] max-w-[280px] snap-start border-4 border-black transform hover:-translate-y-2 hover:shadow-[8px_12px_0_0_#000] ${
        isPlaying
          ? "bg-yellow-300 shadow-[8px_8px_0_0_#000] -rotate-1"
          : "bg-white shadow-[6px_6px_0_0_#000] hover:bg-orange-100"
      }`}
    >
      <div className="relative mb-4 overflow-hidden border-4 border-black rounded-xl">
        <img
          src={
            podcast?.productImages?.[0].imageUrl ||
            "/assets/podcastv2/default-podcast.png"
          }
          alt={podcast.title}
          className={`w-full h-[280px] object-cover transition-transform duration-500 ${
            isPlaying ? "scale-105" : "group-hover:scale-105"
          }`}
        />
        <div
          className={`absolute inset-0 bg-black opacity-0 transition-opacity duration-300 ${
            isPlaying ? "opacity-20" : "group-hover:opacity-10"
          }`}
        ></div>
        <button
          onClick={() => onPlayToggle(String(podcast._id))}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-14 h-14 rounded-full border-4 border-black shadow-[3px_3px_0_0_#000] transition-all duration-300 ${
            isPlaying
              ? "bg-pink-500"
              : "bg-pink-400 group-hover:bg-pink-500 scale-90 group-hover:scale-100"
          }`}
          aria-label={isPlaying ? "Pause podcast" : "Play podcast"}
        >
          {isPlaying ? (
            <div className="flex items-center justify-center gap-1">
              <span className="w-1 h-5 bg-white rounded-full animate-pulse"></span>
              <span
                className="w-1 h-7 bg-white rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="w-1 h-4 bg-white rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </div>
          ) : (
            <IoPlay className="ml-1 text-2xl text-white" />
          )}
        </button>

        <audio
          ref={audioRef}
          src={(podcast.details as PodcastProduct["details"]).sampleUrl || "#"}
          controlsList="nodownload"
          onPlay={async (e) => {
            if (onRegisterAudio) {
              onRegisterAudio(e.currentTarget);
            }
            const granted = await Promise.resolve(
              onCheckAccessAndControlPlayback(podcast, e.currentTarget),
            );
            if (!granted) {
              e.currentTarget.pause();
              onPlayToggle("");
            }
          }}
          onPause={() => {
            if (isSwitchingRef?.current) return;
            if (
              playbackTracking &&
              playbackTracking.podcastId === String(podcast._id)
            ) {
              onPlaybackTrackingUpdate((prev: any) =>
                prev ? { ...prev, paused: true } : null,
              );
            }
          }}
          onSeeked={() => {
            if (
              playbackTracking &&
              playbackTracking.podcastId === String(podcast._id)
            ) {
              onPlaybackTrackingUpdate((prev: any) =>
                prev ? { ...prev, skipped: true } : null,
              );
            }
          }}
          onEnded={() => {
            onPlayToggle("");
            onPodcastCompletion(String(podcast._id), productType);
          }}
        />

        <div className="absolute flex items-center gap-2 bottom-2 left-2">
          <div
            className={`font-comic-chip tracking-wider py-[3px] px-2 text-sm rounded-md border-2 border-black shadow-[2px_2px_0_0_#000] capitalize -rotate-2 ${
              category === "mobile addiction"
                ? "bg-red-400 text-black"
                : category === "electronic gadgets"
                  ? "bg-blue-400 text-black"
                  : "bg-purple-400 text-black"
            }`}
          >
            {category || "Category"}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-start justify-between mb-2 gap-2">
          <h3 className="font-comic tracking-wider text-2xl leading-tight line-clamp-2 text-black">
            {podcast.title}
          </h3>
          <div className="font-comic-chip flex items-center gap-1 text-sm text-black bg-orange-300 border-2 border-black rounded-md px-1.5 py-0.5 shadow-[2px_2px_0_0_#000]">
            <svg
              className="w-4 h-4 fill-yellow-400 stroke-black"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {podcast.rating || "4.5"}
          </div>
        </div>

        <p className="font-comic tracking-wide text-base text-black line-clamp-2">
          {podcast.description ||
            "Podcast Negative Impact of Mobile Phones takes a closer look at the consequences of our constant connection to the digital world."}
        </p>

        <div className="flex items-center gap-2 text-black">
          <div className="flex items-center justify-center w-8 h-8 overflow-hidden bg-pink-300 border-2 border-black rounded-full">
            <span className="font-comic-chip text-sm">
              {(podcast.details as PodcastProduct["details"])?.host?.charAt(0)}
            </span>
          </div>
          <p className="font-comic tracking-wider text-lg">
            {(podcast.details as PodcastProduct["details"])?.host}
          </p>
          {(podcast.details as PodcastProduct["details"])?.duration && (
            <p className="font-comic tracking-wide flex items-center text-sm">
              <span className="w-1.5 h-1.5 mx-1 bg-black rounded-full"></span>
              {(podcast.details as PodcastProduct["details"])?.duration} minutes
            </p>
          )}
        </div>

        {isPlaying && (
          <div className="flex justify-center gap-1 pt-2">
            <span className="w-1.5 h-3 bg-black rounded-full animate-bounce"></span>
            <span
              className="w-1.5 h-3 bg-black rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></span>
            <span
              className="w-1.5 h-3 bg-black rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></span>
            <span
              className="w-1.5 h-3 bg-black rounded-full animate-bounce"
              style={{ animationDelay: "0.6s" }}
            ></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PodcastCard;
