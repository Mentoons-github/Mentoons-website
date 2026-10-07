import { PodcastProduct, ProductBase } from "@/types/productTypes";
import { AnimatePresence, motion } from "framer-motion";
import { MdClose } from "react-icons/md";

interface PlaybackTrackingState {
  startTime: number;
  paused: boolean;
  skipped: boolean;
  podcastId: string;
  podcastType: string;
}

interface NewReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  filteredPodcast: ProductBase[];
  currentPodcastIndex: number;
  playingPodcastId: string | null;
  setPlayingPodcastId: (id: string | null) => void;
  stopAll: () => void;
  switchTo: (audio: HTMLAudioElement) => void;
  checkAccessAndControlPlayback: (
    podcast: ProductBase,
    audioElement?: HTMLAudioElement | null,
  ) => Promise<boolean>;
  handlePodcastCompletion: (podcastId: string, podcastType: string) => void;
  playbackTracking: PlaybackTrackingState | null;
  setPlaybackTracking: React.Dispatch<
    React.SetStateAction<PlaybackTrackingState | null>
  >;
  isSwitchingRef: React.MutableRefObject<boolean>;
  setHasPlayedNewRelease: (val: boolean) => void;
}

const NewReleaseModal = ({
  isOpen,
  onClose,
  filteredPodcast,
  playingPodcastId,
  setPlayingPodcastId,
  stopAll,
  switchTo,
  checkAccessAndControlPlayback,
  handlePodcastCompletion,
  playbackTracking,
  setPlaybackTracking,
  isSwitchingRef,
  setHasPlayedNewRelease,
}: NewReleaseModalProps) => {
  if (!filteredPodcast.length) return null;

  const newRelease = filteredPodcast[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute z-20 p-2 text-white transition-colors rounded-full top-4 right-4 bg-black/30 hover:bg-black/50"
              aria-label="Close new release modal"
            >
              <MdClose className="text-2xl" />
            </button>

            <div className="relative overflow-hidden shadow-2xl bg-gradient-to-br from-orange-400 to-pink-500 rounded-3xl">
              <div className="absolute w-40 h-40 bg-pink-200 rounded-full opacity-50 -top-20 right-20 blur-xl"></div>
              <div className="absolute w-32 h-32 bg-orange-200 rounded-full left-10 bottom-40 opacity-40 blur-xl"></div>
              <svg
                className="absolute left-0 w-24 h-24 text-orange-300 top-10 opacity-20"
                viewBox="0 0 100 100"
                fill="none"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="10 15"
                >
                  <animate
                    attributeName="r"
                    from="40"
                    to="65"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.8"
                    to="0"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
              <svg
                className="absolute w-32 h-32 text-pink-400 right-10 bottom-10 opacity-20"
                viewBox="0 0 100 100"
                fill="none"
              >
                <path
                  d="M20,50 Q50,10 80,50 T20,50"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                />
              </svg>
              <div className="flex flex-col-reverse lg:flex-row md:items-center md:gap-8 bg-gradient-to-br from-[#FF6D6D]/90 via-orange-300/80 to-yellow-400 rounded-3xl shadow-2xl overflow-hidden">
                <div className="relative z-10 flex-1 p-8 md:p-12">
                  <div className="w-full h-[350px] rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                    <img
                      src={
                        newRelease?.productImages?.[0].imageUrl ||
                        "/assets/podcastv2/electronic-gadgets-and-kids-large.jpg"
                      }
                      alt={newRelease?.title || "Podcast Thumbnail"}
                      className="object-cover object-center w-full h-full"
                    />
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="py-[3px] px-[5px] text-xs font-semibold rounded shadow-md capitalize text-green-600 bg-green-200 backdrop-blur-sm">
                        NEW RELEASE
                      </span>
                      <div
                        className={`py-[3px] px-[5px] text-xs font-semibold rounded shadow-md capitalize ${
                          (newRelease.details as PodcastProduct["details"])
                            ?.category === "mobile addiction"
                            ? "bg-gradient-to-r from-red-400 to-red-500 text-white"
                            : (newRelease.details as PodcastProduct["details"])
                                  ?.category === "electronic gadgets"
                              ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white"
                              : "bg-gradient-to-r from-purple-400 to-purple-500 text-white"
                        }`}
                      >
                        {(newRelease.details as PodcastProduct["details"])
                          ?.category || "Category"}
                      </div>
                    </div>
                    <h2
                      className="mb-3 text-3xl font-bold text-white drop-shadow-sm md:text-4xl"
                      data-badge={newRelease.product_type || undefined}
                    >
                      {newRelease?.title || "Negative impact of Mobile phone"}
                    </h2>
                    <p className="mb-4 text-lg text-white/90 line-clamp-3">
                      {newRelease?.description ||
                        "Podcast on Electronic Gadgets and Kids examines the impact of digital devices on children's development and daily lives."}
                    </p>
                    <div className="flex items-center mb-6 text-sm text-white/80">
                      <div className="flex items-center justify-center w-6 h-6 overflow-hidden bg-orange-200 rounded-full">
                        <span className="text-sm font-semibold text-orange-500">
                          {(
                            newRelease.details as PodcastProduct["details"]
                          )?.host?.charAt(0)}
                        </span>
                      </div>
                      <span className="ml-2 text-sm font-bold">
                        {(newRelease.details as PodcastProduct["details"])
                          ?.host || "Mentoons"}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="text-sm font-bold">
                        {(newRelease.details as PodcastProduct["details"])
                          ?.duration || "05 MIN"}{" "}
                        minutes
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (playingPodcastId === "new-release") {
                          stopAll();
                        } else {
                          stopAll();
                          setPlayingPodcastId("new-release");
                        }
                      }}
                      className={`flex items-center gap-3 px-8 py-3 rounded-full transition-all duration-300 ${
                        playingPodcastId === "new-release"
                          ? "bg-white text-primary"
                          : "bg-primary text-white hover:bg-primary/90 hover:scale-105"
                      }`}
                    >
                      {playingPodcastId === "new-release" ? (
                        <>
                          <span className="font-semibold">Pause</span>
                          <div className="flex items-center justify-center gap-1">
                            <span className="w-1 h-4 rounded-full animate-pulse bg-primary"></span>
                            <span
                              className="w-1 h-6 rounded-full animate-pulse bg-primary"
                              style={{ animationDelay: "0.2s" }}
                            ></span>
                            <span
                              className="w-1 h-3 rounded-full animate-pulse bg-primary"
                              style={{ animationDelay: "0.4s" }}
                            ></span>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="font-semibold">Play</span>
                        </>
                      )}
                    </button>
                    {playingPodcastId === "new-release" && (
                      <audio
                        src={
                          (newRelease.details as PodcastProduct["details"])
                            ?.sampleUrl || "#"
                        }
                        autoPlay
                        ref={(el) => {
                          if (el) switchTo(el);
                        }}
                        onPlay={async (e) => {
                          setHasPlayedNewRelease(true);
                          switchTo(e.currentTarget);
                          const hasAccess = await checkAccessAndControlPlayback(
                            newRelease,
                            e.currentTarget,
                          );
                          if (!hasAccess) {
                            e.currentTarget.pause();
                            setPlayingPodcastId(null);
                          }
                        }}
                        onPause={() => {
                          if (isSwitchingRef.current) return;
                          if (
                            playbackTracking &&
                            playbackTracking.podcastId ===
                              String(newRelease._id)
                          ) {
                            setPlaybackTracking((prev) =>
                              prev ? { ...prev, paused: true } : null,
                            );
                          }
                        }}
                        onSeeked={() => {
                          if (
                            playbackTracking &&
                            playbackTracking.podcastId ===
                              String(newRelease._id)
                          ) {
                            setPlaybackTracking((prev) =>
                              prev ? { ...prev, skipped: true } : null,
                            );
                          }
                        }}
                        onEnded={() => {
                          setPlayingPodcastId(null);
                          if (newRelease) {
                            handlePodcastCompletion(
                              String(newRelease._id),
                              String(newRelease.product_type || "free"),
                            );
                          }
                        }}
                        className="hidden"
                      />
                    )}
                  </div>
                </div>
                <div className="relative flex-1 p-8 lg:p-12 ">
                  <h2 className=" text-3xl font-semibold text-center text-black drop-shadow-lg md:text-7xl luckiest-guy-regular">
                    CHECK OUT OUR
                    <span className="block py-2 mt-2 rounded-lg backdrop-blur-sm">
                      NEW RELEASE
                    </span>
                  </h2>
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-48 h-48 rounded-full blur-xl bg-orange-400/30"></div>
                    <img
                      src="/assets/podcastv2/new-headphones.png"
                      alt="Headphone"
                      className="relative z-10 w-[80%] max-w-[400px] animate-float drop-shadow-2xl"
                    />
                    <svg
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] -z-10 opacity-20"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="white"
                        strokeWidth="0.5"
                        strokeDasharray="1 3"
                      >
                        <animate
                          attributeName="r"
                          from="45"
                          to="65"
                          dur="3s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.8"
                          to="0"
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke="white"
                        strokeWidth="0.5"
                        strokeDasharray="1 3"
                      >
                        <animate
                          attributeName="r"
                          from="35"
                          to="55"
                          dur="3s"
                          begin="0.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.8"
                          to="0"
                          dur="3s"
                          begin="0.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewReleaseModal;
