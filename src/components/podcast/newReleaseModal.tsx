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

const halftoneDark = {
  backgroundImage:
    "radial-gradient(rgba(255,255,255,0.22) 2px, transparent 2px)",
  backgroundSize: "16px 16px",
};

const halftoneLight = {
  backgroundImage: "radial-gradient(rgba(0,0,0,0.14) 2px, transparent 2px)",
  backgroundSize: "16px 16px",
};

const comicStroke = {
  textShadow: "4px 4px 0 #000",
  WebkitTextStroke: "2px #000",
  paintOrder: "stroke fill" as const,
};

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
  const category = (newRelease.details as PodcastProduct["details"])?.category;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4"
          style={halftoneDark}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border-8 border-black shadow-[12px_12px_0_0_#000]"
            initial={{ opacity: 0, scale: 0.9, y: 40, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute z-20 p-2 text-white transition-all bg-red-500 border-4 border-black rounded-full top-4 right-4 shadow-[3px_3px_0_0_#000] hover:bg-red-400 hover:rotate-90 active:translate-y-1 active:shadow-[1px_1px_0_0_#000]"
              aria-label="Close new release modal"
            >
              <MdClose className="text-2xl" />
            </button>

            <div
              className="relative overflow-hidden bg-yellow-300"
              style={halftoneLight}
            >
              <div className="flex flex-col-reverse lg:flex-row md:items-center md:gap-8 overflow-hidden">
                <div className="relative z-10 flex-1 p-8 md:p-12">
                  <div className="w-full h-[350px] rounded-xl overflow-hidden border-4 border-black shadow-[8px_8px_0_0_#000] transform transition-all duration-300 hover:scale-[1.02] hover:-rotate-1">
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
                      <span className="font-comic-chip tracking-wider py-1 px-2 text-sm rounded-md border-2 border-black shadow-[3px_3px_0_0_#000] text-black bg-green-300 rotate-2">
                        NEW RELEASE
                      </span>
                      <div
                        className={`font-comic-chip tracking-wider py-1 px-2 text-sm rounded-md border-2 border-black shadow-[3px_3px_0_0_#000] capitalize text-black -rotate-2 ${
                          category === "mobile addiction"
                            ? "bg-red-400"
                            : category === "electronic gadgets"
                              ? "bg-blue-400"
                              : "bg-purple-400"
                        }`}
                      >
                        {category || "Category"}
                      </div>
                    </div>
                    <h2
                      className="font-comic mb-3 text-5xl tracking-wider text-white md:text-6xl leading-none"
                      style={comicStroke}
                      data-badge={newRelease.product_type || undefined}
                    >
                      {newRelease?.title || "Negative impact of Mobile phone"}
                    </h2>

                    {/* FIX: removed line-clamp-3 so the full description shows */}
                    <p className="font-comic tracking-wide mb-4 text-xl text-black bg-white border-4 border-black rounded-2xl p-3 shadow-[5px_5px_0_0_#000]">
                      {newRelease?.description ||
                        "Podcast on Electronic Gadgets and Kids examines the impact of digital devices on children's development and daily lives."}
                    </p>

                    <div className="flex items-center mb-6 text-black">
                      <div className="flex items-center justify-center w-8 h-8 overflow-hidden bg-pink-300 border-2 border-black rounded-full">
                        <span className="font-comic-chip text-sm">
                          {(
                            newRelease.details as PodcastProduct["details"]
                          )?.host?.charAt(0)}
                        </span>
                      </div>
                      <span className="font-comic tracking-wider ml-2 text-xl">
                        {(newRelease.details as PodcastProduct["details"])
                          ?.host || "Mentoons"}
                      </span>
                      <span className="mx-2 font-bold">•</span>
                      <span className="font-comic tracking-wider text-xl">
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
                      className={`font-comic-chip tracking-wider text-2xl flex items-center gap-3 px-8 py-3 rounded-xl border-4 border-black text-black transition-all duration-300 shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:shadow-[6px_10px_0_0_#000] active:translate-y-1 active:shadow-[2px_2px_0_0_#000] ${
                        playingPodcastId === "new-release"
                          ? "bg-white"
                          : "bg-pink-400 hover:bg-pink-300"
                      }`}
                    >
                      {playingPodcastId === "new-release" ? (
                        <>
                          <span>Pause</span>
                          <div className="flex items-center justify-center gap-1">
                            <span className="w-1.5 h-4 rounded-full animate-pulse bg-black"></span>
                            <span
                              className="w-1.5 h-6 rounded-full animate-pulse bg-black"
                              style={{ animationDelay: "0.2s" }}
                            ></span>
                            <span
                              className="w-1.5 h-3 rounded-full animate-pulse bg-black"
                              style={{ animationDelay: "0.4s" }}
                            ></span>
                          </div>
                        </>
                      ) : (
                        <>
                          <span>Play</span>
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
                <div className="relative flex-1 p-8 lg:p-12">
                  <h2
                    className="font-comic text-5xl text-center text-white md:text-8xl tracking-wider -rotate-2"
                    style={comicStroke}
                  >
                    CHECK OUT OUR
                    <span className="block py-2 mt-2 text-pink-400">
                      NEW RELEASE
                    </span>
                  </h2>
                  <div className="relative flex items-center justify-center">
                    <img
                      src="/assets/podcastv2/new-headphones.png"
                      alt="Headphone"
                      className="relative z-10 w-[80%] max-w-[400px] animate-float drop-shadow-[8px_8px_0_rgba(0,0,0,0.9)]"
                    />
                    <svg
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] -z-10 opacity-40"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="black"
                        strokeWidth="1"
                        strokeDasharray="2 3"
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
                        stroke="black"
                        strokeWidth="1"
                        strokeDasharray="2 3"
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
