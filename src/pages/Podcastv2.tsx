import EnquiryModal from "@/components/modals/EnquiryModal";
import SubscriptionLimitModal from "@/components/modals/SubscriptionLimitModal";
import PodcastCard from "@/components/podcast/card";
import HeroSectionPodcast from "@/components/shared/HeroSectionPodcast";
import { PODCAST_OFFERINGS, PODCAST_V2_CATEGORY } from "@/constant";
import { fetchProducts } from "@/redux/productSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { PodcastProduct, ProductBase } from "@/types/productTypes";
import { RewardEventType } from "@/types/rewards";
import { ModalMessage, ProductType } from "@/utils/enum";
import { triggerReward } from "@/utils/rewardMiddleware";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoPlay } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

interface Subscription {
  plan: string;
  validUntil: string;
  isActive: boolean;
  consumedContent?: {
    prime?: number;
    platinum?: number;
    lastResetDate?: string;
  };
}

interface DBUser {
  _id: string;
  name: string;
  email: string;
  subscription: Subscription;
}

interface PlaybackTrackingState {
  startTime: number;
  paused: boolean;
  skipped: boolean;
  podcastId: string;
  podcastType: string;
}

const Podcastv2 = () => {
  const [selectedCategory, setSelectedCategory] = useState("mobile addiction");
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Single source of truth: which podcast id is playing in the card carousel
  // or "new-release". The featured <audio controls> player manages itself via
  // the DOM — we only track it via currentAudioRef below.
  const [playingPodcastId, setPlayingPodcastId] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [enquiryEmail, setEnquiryEmail] = useState("");
  const [enquiryName, setEnquiryName] = useState("");
  const [showSubscriptionLimitModal, setShowSubscriptionLimitModal] =
    useState(false);
  const [limitModalMessage, setLimitModalMessage] = useState("");
  const [limitModalTitle, setLimitModalTitle] = useState("");
  const [currentProductId, setCurrentProductId] = useState<string>("");
  const [filteredPodcast, setFilteredPodcast] = useState<ProductBase[]>([]);
  const [currentPodcastIndex, setCurrentPodcastIndex] = useState(0);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [playbackTracking, setPlaybackTracking] =
    useState<PlaybackTrackingState | null>(null);
  const [modalShownTimestamp, setModalShownTimestamp] = useState<number>(0);
  const [hasPlayedNewRelease, setHasPlayedNewRelease] = useState(() => {
    return sessionStorage.getItem("newReleaseAutoPlayed") === "true";
  });

  // ── Global audio manager ─────────────────────────────────────────────────
  //
  // currentAudioRef  — the <audio> element that is currently playing
  // isSwitchingRef   — true for ~100 ms during a player switch so that the
  //                    outgoing player's onPause is not treated as a user pause
  //
  // switchTo(audio) — pauses the current player (with flag set), then marks
  //                   the new audio as current. Does NOT call .play() — the
  //                   caller or the browser does that.
  //
  // stopAll()        — pauses current player and clears state
  //
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const isSwitchingRef = useRef(false);

  const switchTo = useCallback((incoming: HTMLAudioElement) => {
    const outgoing = currentAudioRef.current;
    if (outgoing && outgoing !== incoming && !outgoing.paused) {
      isSwitchingRef.current = true;
      outgoing.pause();
      setTimeout(() => {
        isSwitchingRef.current = false;
      }, 150);
    }
    currentAudioRef.current = incoming;
  }, []);

  const stopAll = useCallback(() => {
    const current = currentAudioRef.current;
    if (current && !current.paused) {
      isSwitchingRef.current = true;
      current.pause();
      setTimeout(() => {
        isSwitchingRef.current = false;
      }, 150);
    }
    currentAudioRef.current = null;
    setPlayingPodcastId(null);
  }, []);

  // Called by PodcastCard on mount so we always know every card's audio ref
  const registerCardAudio = useCallback((audio: HTMLAudioElement) => {
    // Only update currentAudioRef when this card is actually the active one;
    // for idle cards we just store a weak reference via the DOM.
    // (The card's own useEffect calls play/pause imperatively.)
    // We expose this so the featured player can pause it via switchTo().
    if (!audio.paused) {
      currentAudioRef.current = audio;
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────────────

  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { items: products } = useSelector((state: RootState) => state.products);

  const membershipType: "free" | "prime" | "platinum" = dbUser?.subscription
    ?.plan
    ? (dbUser.subscription.plan.toLowerCase() as "free" | "prime" | "platinum")
    : "free";

  const handleScroll = () => {
    const carousel = carouselRef.current;
    if (carousel) {
      setIsAtStart(carousel.scrollLeft === 0);
      setIsAtEnd(
        carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1,
      );
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSelectedCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    try {
      const queryResponse = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/query`,
        {
          message,
          name: enquiryName,
          email: enquiryEmail,
          queryType: "podcast",
        },
      );
      if (queryResponse.status === 201) {
        setShowEnquiryModal(true);
      }
    } catch (error) {
      toast.error("Failed to submit message");
    }
  };

  const fetchDBUser = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/user/user/${user?.id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.status === 200) {
        setDbUser(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [user?.id, getToken]);

  const checkAccessAndControlPlayback = useCallback(
    async (podcast: ProductBase, audioElement?: HTMLAudioElement | null) => {
      const podcastId = String(podcast._id);
      const podcastType = String(podcast.product_type || "free").toLowerCase();

      if (!isSignedIn) {
        setTimeout(() => {
          if (audioElement && !audioElement.paused) {
            audioElement.pause();
            const timeNow = Date.now();
            if (timeNow - modalShownTimestamp > 5000) {
              setLimitModalTitle("Sign In Required");
              setLimitModalMessage("Please sign in to access this podcast.");
              setShowSubscriptionLimitModal(true);
              setModalShownTimestamp(timeNow);
            }
          }
        }, 45000);
        return false;
      }

      if (!dbUser) {
        toast.info("Loading user data...");
        fetchDBUser();
        return false;
      }

      try {
        const token = await getToken();
        const response = await axios.post(
          `${import.meta.env.VITE_PROD_URL}/subscription/access`,
          { type: "podcasts", itemId: podcast._id },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const { access, reason } = response.data;
        if (access) {
          setPlaybackTracking({
            startTime: Date.now(),
            paused: false,
            skipped: false,
            podcastId,
            podcastType,
          });
          return true;
        }

        const timeNow = Date.now();
        if (timeNow - modalShownTimestamp <= 5000) {
          return false;
        }

        if (reason === "upgrade") {
          setLimitModalTitle("Upgrade Your Plan");
          setLimitModalMessage(
            `You've reached the podcast limit for your ${membershipType} plan. Upgrade to access more content!`,
          );
        } else if (reason === "charge") {
          setLimitModalTitle("Purchase Content");
          setLimitModalMessage(
            `You've reached the podcast limit for your Platinum plan. Purchase this content for ₹1 to continue.`,
          );
        }
        setCurrentProductId(podcast._id || "");
        setShowSubscriptionLimitModal(true);
        setModalShownTimestamp(timeNow);

        if (audioElement && !audioElement.paused) {
          audioElement.pause();
          setPlayingPodcastId(null);
        }
        return false;
      } catch (error) {
        console.error("Error checking access:", error);
        toast.error("Failed to verify access. Please try again.");
        return false;
      }
    },
    [
      isSignedIn,
      dbUser,
      getToken,
      modalShownTimestamp,
      membershipType,
      fetchDBUser,
    ],
  );

  const handlePodcastCompletion = (podcastId: string, podcastType: string) => {
    podcastType = podcastType.toLowerCase();
    if (
      isSignedIn &&
      dbUser &&
      playbackTracking &&
      playbackTracking.podcastId === podcastId &&
      !playbackTracking.paused &&
      !playbackTracking.skipped
    ) {
      if (podcastType !== "free") {
        updateContentConsumption(podcastType);
      }
      triggerReward(RewardEventType.LISTEN_PODCAST, podcastId);
      toast.success("You earned points for completing this podcast!");
    }
  };

  const updateContentConsumption = useCallback(
    async (podcastType: string) => {
      if (!isSignedIn || !dbUser || !dbUser._id) return;
      try {
        const consumptionKey = `${dbUser._id}_consumption`;
        const storedConsumption = localStorage.getItem(consumptionKey);
        const consumption = storedConsumption
          ? JSON.parse(storedConsumption)
          : { prime: 0, platinum: 0 };

        if (podcastType === "prime") {
          consumption.prime += 1;
        } else if (podcastType === "platinum") {
          consumption.platinum += 1;
        }

        localStorage.setItem(consumptionKey, JSON.stringify(consumption));

        const updatedUser = { ...dbUser };
        const consumedContent = dbUser.subscription.consumedContent || {
          prime: 0,
          platinum: 0,
        };
        if (podcastType === "prime") {
          updatedUser.subscription.consumedContent = {
            ...consumedContent,
            prime: (consumedContent.prime || 0) + 1,
          };
        } else if (podcastType === "platinum") {
          updatedUser.subscription.consumedContent = {
            ...consumedContent,
            platinum: (consumedContent.platinum || 0) + 1,
          };
        }
        setDbUser(updatedUser);
        fetchDBUser();
      } catch (error) {
        console.error("Error updating content consumption:", error);
      }
    },
    [dbUser, isSignedIn, fetchDBUser],
  );

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const token = await getToken();
        await dispatch(
          fetchProducts({ type: ProductType.PODCAST, token: token! }),
        );
      } catch (error) {
        console.error("Error fetching podcast data:", error);
      }
    };
    fetchPodcast();
  }, [dispatch, getToken]);

  useEffect(() => {
    const filtered = products.filter(
      (podcast) =>
        (podcast?.details as PodcastProduct["details"])?.category ===
        selectedCategory,
    );
    setFilteredPodcast(filtered);
  }, [products, selectedCategory]);

  useEffect(() => {
    fetchDBUser();
  }, [fetchDBUser, user?.id]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", handleScroll);
      return () => carousel.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    if (playingPodcastId === "new-release" && !hasPlayedNewRelease) {
      setHasPlayedNewRelease(true);
      sessionStorage.setItem("newReleaseAutoPlayed", "true");
    }
  }, [playingPodcastId, hasPlayedNewRelease]);

  return (
    <>
      <HeroSectionPodcast />
      <div className="w-[90%] mx-auto mt-4 md:mt-16">
        <motion.div
          className="items-start gap-8 lg:flex"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex-1">
            <h1 className="py-4 md:py-8 text-3xl font-semibold text-primary md:text-6xl">
              Trending Podcast
            </h1>
            <p className="md:text-xl font-semibold pb-8 md:w-[80%]">
              Tune in to our educational and entertaining podcasts designed
              specifically for young listeners. From fascinating facts to
              thought-provoking discussions, our podcasts make learning fun and
              accessible.
            </p>
            <div className="flex items-center justify-center">
              <img
                src="/assets/podcastv2/hero-image.png"
                alt="Left side hero Image"
                className="w-full"
              />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="py-4 text-2xl md:text-4xl font-semibold text-center luckiest-guy-regular text-neutral-700">
              PODCAST ONLY FOR YOU
            </h2>
            <img
              src="/assets/podcastv2/hero-image-2.png"
              alt="Right side hero image"
              className="flex items-center justify-center w-full"
            />
          </div>
        </motion.div>
        <motion.div
          className="flex flex-col py-6 md:py-12"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="pb-5 md:pb-8 lg:pb-12 text-3xl font-semibold text-center">
            This is What You Get
          </h2>
          <div className=" gap-4 lg:gap-14 grid grid-cols-2 md:grid-cols-4">
            {PODCAST_OFFERINGS.map((podcast) => (
              <motion.div
                key={podcast.label}
                className="flex flex-col items-center  gap-4 border p-4 md:p-6 lg:p-10 rounded-xl  justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={podcast.imgeUrl}
                  alt={podcast.label}
                  className="w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24"
                />
                <p
                  style={{ color: podcast.accentColor }}
                  className="text-lg font-bold text-center"
                >
                  {podcast.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div
          className="flex flex-col md:gap-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="py-8 text-xl md:text-2xl font-semibold text-center text-primary">
              CATEGORIES TO CHOOSE FROM
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-14 lg:px-12">
              {PODCAST_V2_CATEGORY.map((category) => (
                <div
                  key={category.id}
                  className={`flex items-center justify-center gap-4 border p-2 px-4 rounded-xl border-neutral-700 bg-orange-50 hover:ring-4 hover:ring-orange-300 cursor-pointer transition-all duration-200 ${
                    selectedCategory === category.lable
                      ? `ring-4 ring-orange-300 shadow-xl shadow-orange-200`
                      : ""
                  }`}
                  onClick={() => handleSelectedCategory(category.lable)}
                >
                  <img
                    src={category.imgeUrl}
                    alt={category.lable}
                    className="w-9"
                  />
                  <p className="font-semibold">
                    {category.lable.toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <motion.div
            className="my-12 md:my-0"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {filteredPodcast.length > 0 && (
              <div className="relative">
                <div className="relative overflow-hidden rounded-3xl shadow-lg bg-gradient-to-br from-orange-400 via-[#FF6C6C] to-pink-500">
                  <div className="absolute top-0 right-0 w-32 h-32 translate-x-1/2 -translate-y-1/2 bg-orange-300 rounded-full opacity-20 md:w-64 md:h-64"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 -translate-x-1/2 translate-y-1/2 bg-pink-300 rounded-full opacity-20 md:w-48 md:h-48"></div>
                  <div className="flex flex-col items-start p-2 lg:flex-row md:p-8">
                    <div className="relative flex-1 p-2 md:p-4 group">
                      <img
                        src={
                          filteredPodcast[currentPodcastIndex]
                            ?.productImages?.[0].imageUrl ||
                          "/assets/podcastv2/podcast-thumbnail-social.png"
                        }
                        alt={
                          filteredPodcast[currentPodcastIndex]?.title ||
                          "Podcast Thumbnail"
                        }
                        className="relative z-10 object-cover w-full transition-transform duration-300 transform shadow-xl rounded-2xl max-w- group-hover:scale-95"
                      />
                    </div>
                    <div className="flex-1 p-4 text-white md:p-6">
                      <div className="flex items-center mb-3">
                        <div className="w-2 h-2 mr-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium tracking-wider uppercase opacity-80">
                          {selectedCategory.toUpperCase()}
                        </span>
                      </div>
                      <h2
                        className="py-4 font-bold leading-none text-4xl sm:text-4xl md:text-5xl lg:text-6xl relative pr-2"
                        data-badge={
                          filteredPodcast[currentPodcastIndex].product_type ||
                          undefined
                        }
                      >
                        {filteredPodcast[currentPodcastIndex]?.title ||
                          "Negative impact of Mobile phone"}
                      </h2>
                      <p className="mb-6 text-base leading-relaxed md:text-lg text-white/90">
                        {filteredPodcast[currentPodcastIndex]?.description ||
                          "Podcast Negative Impact of Mobile Phones takes a closer look at the consequences of our constant connection to the digital world."}
                      </p>
                      <div className="flex items-center mb-3">
                        <span className="font-medium tracking-wider opacity-80 text-md text-italic luckiest-guy-regular">
                          {(
                            filteredPodcast[currentPodcastIndex]
                              .details as PodcastProduct["details"]
                          )?.host || "Mentoons"}
                        </span>
                      </div>
                      <div className="p-4 border rounded-xl backdrop-blur-sm audio-player bg-white/10 border-white/20">
                        {/*
                          Featured <audio controls> — browser-native controls.
                          On play: call switchTo() synchronously to pause any
                          card/new-release audio via the DOM *before* React
                          state updates, so this starts on the first click.
                        */}
                        <audio
                          key={currentPodcastIndex}
                          className="w-full"
                          controls
                          controlsList="nodownload"
                          preload="metadata"
                          src={
                            (
                              filteredPodcast[currentPodcastIndex]
                                .details as PodcastProduct["details"]
                            )?.sampleUrl || "#"
                          }
                          onPlay={async (e) => {
                            // 1. Synchronously pause any other audio via DOM
                            switchTo(e.currentTarget);
                            // 2. Clear card / new-release React state
                            setPlayingPodcastId(null);
                            // 3. Check access
                            const hasAccess =
                              await checkAccessAndControlPlayback(
                                filteredPodcast[currentPodcastIndex],
                                e.currentTarget,
                              );
                            if (!hasAccess) {
                              e.currentTarget.pause();
                            }
                          }}
                          onPause={() => {
                            if (isSwitchingRef.current) return;
                            if (
                              playbackTracking &&
                              playbackTracking.podcastId ===
                                String(filteredPodcast[currentPodcastIndex]._id)
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
                                String(filteredPodcast[currentPodcastIndex]._id)
                            ) {
                              setPlaybackTracking((prev) =>
                                prev ? { ...prev, skipped: true } : null,
                              );
                            }
                          }}
                          onEnded={() => {
                            handlePodcastCompletion(
                              String(filteredPodcast[currentPodcastIndex]._id),
                              String(
                                filteredPodcast[currentPodcastIndex]
                                  .product_type || "free",
                              ),
                            );
                          }}
                        >
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      onClick={() =>
                        setCurrentPodcastIndex((prev) =>
                          prev > 0 ? prev - 1 : filteredPodcast.length - 1,
                        )
                      }
                      className="p-3 transition-all duration-200 bg-white rounded-full shadow-lg hover:bg-gray-100 hover:shadow-orange-200/50 hover:-translate-x-1"
                      aria-label="Previous podcast"
                    >
                      <IoIosArrowBack className="text-2xl text-orange-500" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPodcastIndex((prev) =>
                          prev < filteredPodcast.length - 1 ? prev + 1 : 0,
                        )
                      }
                      className="p-3 transition-all duration-200 bg-white rounded-full shadow-lg hover:bg-gray-100 hover:shadow-orange-200/50 hover:translate-x-1"
                      aria-label="Next podcast"
                    >
                      <IoIosArrowForward className="text-2xl text-orange-500" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
        <motion.div
          className="relative md:my-20"
          style={{
            scale: useTransform(
              useScroll().scrollYProgress,
              [0.4, 0.8],
              [1, 1],
            ),
            opacity: useTransform(
              useScroll().scrollYProgress,
              [0.4, 0.8],
              [1, 1],
            ),
          }}
        >
          <h2 className="relative z-10 lg:pb-6 text-2xl md:text-4xl font-bold text-primary">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
              Trending Podcast
            </span>
            <span className="relative ml-2">
              For You!
              <svg
                className="absolute left-0 w-full -bottom-2"
                viewBox="0 0 100 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 15 Q 25 5, 50 15 T 100 15"
                  stroke="#FF6C6C"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </span>
          </h2>
          <div className="absolute w-20 h-20 bg-orange-200 rounded-full -top-10 -left-10 opacity-70 blur-xl"></div>
          <div className="absolute w-16 h-16 bg-pink-200 rounded-full right-20 top-40 opacity-70 blur-xl"></div>
          <div
            className="flex gap-6 p-16 -mx-2 overflow-x-auto scroll-smooth snap-x"
            ref={carouselRef}
            style={{ scrollbarWidth: "none" }}
          >
            {products.map((podcast) => (
              <PodcastCard
                key={podcast._id}
                podcast={podcast}
                isPlaying={playingPodcastId === String(podcast._id)}
                onPlayToggle={(podcastId) => {
                  if (playingPodcastId === podcastId) {
                    // User paused this card
                    stopAll();
                  } else {
                    // Stop featured / new-release audio synchronously via DOM,
                    // then update state — card's useEffect will call .play()
                    stopAll();
                    setPlayingPodcastId(podcastId);
                  }
                }}
                onCheckAccessAndControlPlayback={checkAccessAndControlPlayback}
                onPlaybackTrackingUpdate={setPlaybackTracking}
                onPodcastCompletion={handlePodcastCompletion}
                playbackTracking={playbackTracking}
                onRegisterAudio={registerCardAudio}
                isSwitchingRef={isSwitchingRef}
              />
            ))}
          </div>
          <button
            onClick={() => {
              const carousel = carouselRef.current;
              if (carousel)
                carousel.scrollBy({ left: -310, behavior: "smooth" });
            }}
            className="absolute left-0 p-3 transition-all duration-300 -translate-y-1/2 bg-white rounded-full shadow-xl top-1/2 hover:bg-orange-100 hover:scale-110 hover:-translate-x-1"
            style={{ display: isAtStart ? "none" : "block" }}
            aria-label="Scroll left"
          >
            <IoIosArrowBack className="text-2xl text-orange-500" />
          </button>
          <button
            onClick={() => {
              const carousel = carouselRef.current;
              if (carousel)
                carousel.scrollBy({ left: 310, behavior: "smooth" });
            }}
            className="absolute right-0 p-3 transition-all duration-300 -translate-y-1/2 bg-white rounded-full shadow-xl top-1/2 hover:bg-orange-100 hover:scale-110 hover:translate-x-1"
            style={{ display: isAtEnd ? "none" : "block" }}
            aria-label="Scroll right"
          >
            <IoIosArrowForward className="text-2xl text-orange-500" />
          </button>
        </motion.div>
        <motion.div
          className="relative lg:my-24 overflow-hidden shadow-2xl bg-gradient-to-br from-orange-400 to-pink-500 rounded-3xl"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
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
            {filteredPodcast.length > 0 && (
              <div className="relative z-10 flex-1 p-8 md:p-12">
                <div className="w-full h-[350px] rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                  <img
                    src={
                      filteredPodcast[0]?.productImages?.[0].imageUrl ||
                      "/assets/podcastv2/electronic-gadgets-and-kids-large.jpg"
                    }
                    alt={filteredPodcast[0]?.title || "Podcast Thumbnail"}
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
                        (
                          filteredPodcast[0]
                            .details as PodcastProduct["details"]
                        )?.category === "mobile addiction"
                          ? "bg-gradient-to-r from-red-400 to-red-500 text-white"
                          : (
                                filteredPodcast[0]
                                  .details as PodcastProduct["details"]
                              )?.category === "electronic gadgets"
                            ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white"
                            : "bg-gradient-to-r from-purple-400 to-purple-500 text-white"
                      }`}
                    >
                      {(filteredPodcast[0].details as PodcastProduct["details"])
                        ?.category || "Category"}
                    </div>
                  </div>
                  <h2
                    className="mb-3 text-3xl font-bold text-white drop-shadow-sm md:text-4xl"
                    data-badge={
                      filteredPodcast[currentPodcastIndex].product_type ||
                      undefined
                    }
                  >
                    {filteredPodcast[currentPodcastIndex]?.title ||
                      "Negative impact of Mobile phone"}
                  </h2>
                  <p className="mb-4 text-lg text-white/90 line-clamp-3">
                    {filteredPodcast[0]?.description ||
                      "Podcast on Electronic Gadgets and Kids examines the impact of digital devices on children's development and daily lives."}
                  </p>
                  <div className="flex items-center mb-6 text-sm text-white/80">
                    <div className="flex items-center justify-center w-6 h-6 overflow-hidden bg-orange-200 rounded-full">
                      <span className="text-sm font-semibold text-orange-500">
                        {(
                          filteredPodcast[0]
                            .details as PodcastProduct["details"]
                        )?.host?.charAt(0)}
                      </span>
                    </div>
                    <span className="ml-2 text-sm font-bold">
                      {(filteredPodcast[0].details as PodcastProduct["details"])
                        ?.host || "Mentoons"}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="text-sm font-bold">
                      {(filteredPodcast[0].details as PodcastProduct["details"])
                        ?.duration || "05 MIN"}{" "}
                      minutes
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (playingPodcastId === "new-release") {
                        stopAll();
                      } else {
                        // Stop anything currently playing via DOM first
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
                        <IoPlay className="text-2xl" />
                      </>
                    )}
                  </button>
                  {playingPodcastId === "new-release" && (
                    <audio
                      src={
                        (
                          filteredPodcast[0]
                            .details as PodcastProduct["details"]
                        )?.sampleUrl || "#"
                      }
                      autoPlay
                      ref={(el) => {
                        if (el) switchTo(el);
                      }}
                      onPlay={async (e) => {
                        setHasPlayedNewRelease(true);
                        switchTo(e.currentTarget);
                        const hasAccess = await checkAccessAndControlPlayback(
                          filteredPodcast[0],
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
                            String(filteredPodcast[0]._id)
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
                            String(filteredPodcast[0]._id)
                        ) {
                          setPlaybackTracking((prev) =>
                            prev ? { ...prev, skipped: true } : null,
                          );
                        }
                      }}
                      onEnded={() => {
                        setPlayingPodcastId(null);
                        if (filteredPodcast[0]) {
                          handlePodcastCompletion(
                            String(filteredPodcast[0]._id),
                            String(filteredPodcast[0].product_type || "free"),
                          );
                        }
                      }}
                      className="hidden"
                    />
                  )}
                </div>
              </div>
            )}
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
        </motion.div>
        <motion.div
          className="flex flex-col lg:flex-row items-start mt-10 gap-8 p-6 md:p-12 mb-16 text-white rounded-3xl bg-primary "
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex-1 space-y-3">
            <p className="tracking-wide">
              FOR THE PEOPLE WHO WANT TO BE HEARD...
            </p>
            <p className="pt-2 text-4xl md:text-6xl font-semibold luckiest-guy-regular">
              WANT YOUR VOICE TO BE HEARD
            </p>
            <p className="pb-4">
              If you want to create podcast on a particular topic, Join Us! Be
              the voice of change.
            </p>
            <div className="flex items-center w-full gap-4">
              <form className="flex flex-col w-full gap-2">
                <div className="flex flex-col w-full lg:pr-36">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Your Name"
                    value={dbUser?.name || enquiryName}
                    onChange={(e) => setEnquiryName(e.target.value)}
                    className="w-full p-4 mb-2 text-black shadow-lg rounded-xl"
                  />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Your Email"
                    value={dbUser?.email || enquiryEmail}
                    onChange={(e) => setEnquiryEmail(e.target.value)}
                    className="w-full p-4 text-black shadow-lg rounded-xl"
                  />
                </div>
                <div className="w-full lg:pr-36">
                  <textarea
                    name="message"
                    id="message"
                    placeholder="Write here"
                    rows={3}
                    onChange={handleMessageChange}
                    className="w-full p-4 text-black shadow-lg rounded-xl"
                  />
                </div>
                <button
                  type="submit"
                  className="px-12 py-3 text-lg font-semibold text-primary bg-white rounded-xl w-fit hover:bg-white/90"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
          <div className="flex-1">
            <img
              src="/assets/podcastv2/podcast-host.png"
              alt="Podcast host illustration"
              className="w-full"
            />
          </div>
        </motion.div>
      </div>
      {showSubscriptionLimitModal && (
        <SubscriptionLimitModal
          isOpen={showSubscriptionLimitModal}
          onClose={() => setShowSubscriptionLimitModal(false)}
          message={limitModalMessage}
          title={limitModalTitle}
          planType={membershipType}
          productId={currentProductId}
        />
      )}
      {showEnquiryModal && (
        <EnquiryModal
          isOpen={showEnquiryModal}
          onClose={() => setShowEnquiryModal(false)}
          message={ModalMessage.ENQUIRY_MESSAGE}
        />
      )}
    {/* <PlayPauseButton /> */}
    </>
  );
};

export default Podcastv2;
