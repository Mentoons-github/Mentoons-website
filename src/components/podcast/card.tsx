import { ProductBase } from "@/types/productTypes";
import { PodcastProduct } from "@/types/productTypes";
import { IoPlay } from "react-icons/io5";

interface PodcastCardProps {
  podcast: ProductBase;
  isPlaying: boolean;
  onPlayToggle: (podcastId: string) => void;
  onCheckAccessAndControlPlayback: (
    podcast: ProductBase,
    audioElement?: HTMLAudioElement | null
  ) => boolean;
  onPlaybackTrackingUpdate: (update: (prev: any) => any) => void;
  onPodcastCompletion: (podcastId: string, podcastType: string) => void;
  playbackTracking: any;
}

const PodcastCard: React.FC<PodcastCardProps> = ({
  podcast,
  isPlaying,
  onPlayToggle,
  onCheckAccessAndControlPlayback,
  onPlaybackTrackingUpdate,
  onPodcastCompletion,
  playbackTracking,
}) => {
  return (
    <div
      className={`p-4 rounded-2xl group transition-all duration-300 min-w-[380px] max-w-[280px] snap-start
      transform hover:-translate-y-2 hover:shadow-2xl ${
        isPlaying
          ? "bg-gradient-to-br from-orange-400 to-pink-500 shadow-xl shadow-orange-200/50"
          : "bg-white border border-gray-100 shadow-lg hover:bg-orange-50"
      }`}
    >
      <div className="relative mb-4 overflow-hidden rounded-xl">
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
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          flex justify-center items-center w-14 h-14 rounded-full shadow-lg transition-all duration-300
          ${
            isPlaying
              ? "bg-white scale-90"
              : "bg-primary group-hover:bg-orange-600 scale-85 group-hover:scale-100"
          }`}
          aria-label={isPlaying ? "Pause podcast" : "Play podcast"}
        >
          {isPlaying ? (
            <div className="flex items-center justify-center gap-1">
              <span className="w-1 h-5 bg-orange-500 rounded-full animate-pulse"></span>
              <span
                className="w-1 bg-orange-500 rounded-full h-7 animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="w-1 h-4 bg-orange-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </div>
          ) : (
            <IoPlay className="ml-1 text-2xl text-white" />
          )}
        </button>

        {/* Audio player (hidden) */}
        {isPlaying && (
          <audio
            src={
              (podcast.details as PodcastProduct["details"]).sampleUrl || "#"
            }
            autoPlay
            controlsList="nodownload"
            onPlay={(e) => {
              const hasAccess = onCheckAccessAndControlPlayback(
                podcast,
                e.currentTarget
              );
              if (!hasAccess) {
                e.currentTarget.pause();
                onPlayToggle(""); // Reset playing state
              }
            }}
            onPause={() => {
              if (
                playbackTracking &&
                playbackTracking.podcastId === String(podcast._id)
              ) {
                onPlaybackTrackingUpdate((prev) =>
                  prev ? { ...prev, paused: true } : null
                );
              }
            }}
            onSeeked={() => {
              if (
                playbackTracking &&
                playbackTracking.podcastId === String(podcast._id)
              ) {
                onPlaybackTrackingUpdate((prev) =>
                  prev ? { ...prev, skipped: true } : null
                );
              }
            }}
            onEnded={() => {
              onPlayToggle("");
              onPodcastCompletion(
                String(podcast._id),
                String(podcast.product_type || "free")
              );
            }}
          />
        )}

        {/* Category badge */}
        <div className="absolute flex items-center gap-2 bottom-2 left-2">
          <div
            className={`
              py-[3px] 
              px-[5px] 
              text-xs 
              font-semibold 
              rounded 
              shadow-md
              capitalize
              ${
                (podcast.details as PodcastProduct["details"])?.category ===
                "mobile addiction"
                  ? "bg-gradient-to-r from-red-400 to-red-500 text-white"
                  : (podcast.details as PodcastProduct["details"])?.category ===
                    "electronic gadgets"
                  ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white"
                  : "bg-gradient-to-r from-purple-400 to-purple-500 text-white"
              }
            `}
          >
            {(podcast.details as PodcastProduct["details"])?.category ||
              "Category"}
          </div>
          <div
            className={`
              py-[3px] 
              px-[5px] 
              text-xs 
              font-semibold 
              rounded 
              shadow-md
              capitalize
              data-[type=Free]:bg-gradient-to-r
              data-[type=Free]:from-green-400 
              data-[type=Free]:to-green-500
              data-[type=Free]:text-white
              data-[type=free]:bg-gradient-to-r
              data-[type=free]:from-green-400 
              data-[type=free]:to-green-500
              data-[type=free]:text-white
              data-[type=Prime]:bg-gradient-to-r
              data-[type=Prime]:from-yellow-400
              data-[type=Prime]:to-orange-500 
              data-[type=Prime]:text-white
              data-[type=prime]:bg-gradient-to-r
              data-[type=prime]:from-yellow-400
              data-[type=prime]:to-orange-500 
              data-[type=prime]:text-white
              data-[type=Platinum]:bg-gradient-to-r
              data-[type=Platinum]:from-gray-400
              data-[type=Platinum]:to-gray-500
              data-[type=Platinum]:text-white
              data-[type=platinum]:bg-gradient-to-r
              data-[type=platinum]:from-gray-400
              data-[type=platinum]:to-gray-500
              data-[type=platinum]:text-white
            `}
            data-type={podcast.product_type || undefined}
          >
            {podcast.product_type || ""}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-start justify-between mb-2">
          <h3
            className={`text-lg font-bold line-clamp-2 ${
              isPlaying ? "text-white" : "text-gray-800"
            }`}
          >
            {podcast.title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-orange-500">
            <div className="flex gap-0.5">
              <svg className="w-4 h-4 fill-orange-400" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            {podcast.rating || "4.5"}
          </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">
          {podcast.description ||
            "Podcast Negative Impact of Mobile Phones takes a closer look at the consequences of our constant connection to the digital world."}
        </p>
        <div
          className={`flex items-center gap-2 ${
            isPlaying ? "text-white/90" : "text-gray-500"
          }`}
        >
          <div className="flex items-center justify-center w-8 h-8 overflow-hidden bg-orange-200 rounded-full">
            <span className="text-sm font-semibold text-orange-500">
              {(podcast.details as PodcastProduct["details"])?.host?.charAt(0)}
            </span>
          </div>
          <p className="text-sm font-bold">
            {(podcast.details as PodcastProduct["details"])?.host}
          </p>
          {(podcast.details as PodcastProduct["details"])?.duration && (
            <p className="flex items-center text-xs">
              <span className="w-1 h-1 mx-1 bg-current rounded-full"></span>
              {(podcast.details as PodcastProduct["details"])?.duration} minutes
            </p>
          )}
        </div>
        {isPlaying && (
          <div className="flex justify-center gap-1 pt-2">
            <span className="w-1 h-3 bg-white rounded-full animate-bounce"></span>
            <span
              className="w-1 h-3 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></span>
            <span
              className="w-1 h-3 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></span>
            <span
              className="w-1 h-3 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0.6s" }}
            ></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PodcastCard;
