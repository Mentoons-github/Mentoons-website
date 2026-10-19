import EnquiryModal from "@/components/modals/EnquiryModal";
import SubscriptionLimitModal from "@/components/modals/SubscriptionLimitModal";
import NewReleaseModal from "@/components/podcast/newReleaseModal";
import PodcastCard from "@/components/podcast/card";
import HeroSectionPodcast from "@/components/shared/HeroSectionPodcast";
import { PODCAST_V2_CATEGORY } from "@/constant";
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

const halftoneLight = {
  backgroundImage: "radial-gradient(rgba(0,0,0,0.12) 1.5px, transparent 1.5px)",
  backgroundSize: "14px 14px",
};

const halftoneDark = {
  backgroundImage:
    "radial-gradient(rgba(255,255,255,0.22) 2px, transparent 2px)",
  backgroundSize: "16px 16px",
};

const comicStroke = {
  textShadow: "4px 4px 0 #000",
  WebkitTextStroke: "2px #000",
  paintOrder: "stroke fill" as const,
};

const comicStrokeSm = {
  textShadow: "3px 3px 0 #000",
  WebkitTextStroke: "1.5px #000",
  paintOrder: "stroke fill" as const,
};

const Podcastv2 = () => {
  const [selectedCategory, setSelectedCategory] = useState("mobile addiction");
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
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
  const [showNewReleaseModal, setShowNewReleaseModal] = useState(false);
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [playbackTracking, setPlaybackTracking] =
    useState<PlaybackTrackingState | null>(null);
  const [modalShownTimestamp, setModalShownTimestamp] = useState<number>(0);
  const [hasPlayedNewRelease, setHasPlayedNewRelease] = useState(() => {
    return sessionStorage.getItem("newReleaseAutoPlayed") === "true";
  });

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const isSwitchingRef = useRef(false);
  const resultsRef = useRef<HTMLDivElement>(null);

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

  const registerCardAudio = useCallback((audio: HTMLAudioElement) => {
    if (!audio.paused) {
      currentAudioRef.current = audio;
    }
  }, []);

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
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
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
      <div className="bg-yellow-100 pb-1" style={halftoneLight}>
        <div className="w-[90%] mx-auto pt-4 md:pt-16">
          <motion.div
            className="flex flex-col md:gap-12"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h2
                className="font-comic py-8 text-4xl md:text-6xl tracking-wider text-center text-white -rotate-1"
                style={comicStroke}
              >
                CATEGORIES TO CHOOSE FROM
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-12 lg:px-12">
                {PODCAST_V2_CATEGORY.map((category) => (
                  <div
                    key={category.id}
                    className={`flex items-center justify-center gap-4 border-4 border-black p-3 px-4 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[7px_9px_0_0_#000] ${
                      selectedCategory === category.lable
                        ? "bg-orange-400 -translate-y-1 shadow-[8px_8px_0_0_#000]"
                        : "bg-yellow-300 shadow-[5px_5px_0_0_#000]"
                    }`}
                    onClick={() => handleSelectedCategory(category.lable)}
                  >
                    <img
                      src={category.imgeUrl}
                      alt={category.lable}
                      className="w-10"
                    />
                    <p className="font-comic-chip tracking-wider text-lg md:text-xl text-black">
                      {category.lable.toUpperCase()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <motion.div
              ref={resultsRef}
              className="my-12 md:my-0 scroll-mt-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {filteredPodcast.length > 0 && (
                <div className="relative">
                  <div
                    className="relative overflow-hidden rounded-3xl border-8 border-black shadow-[10px_10px_0_0_#000] bg-orange-400"
                    style={halftoneDark}
                  >
                    <div className="flex flex-col items-start p-2 lg:flex-row md:p-8">
                      <div className="relative flex-1 p-2 md:p-4 group w-full">
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
                          className="relative z-10 object-cover w-full transition-transform duration-300 transform border-4 border-black shadow-[6px_6px_0_0_#000] rounded-2xl group-hover:scale-95 group-hover:-rotate-1"
                        />
                      </div>
                      <div className="flex-1 p-4 text-white md:p-6">
                        <div className="flex items-center mb-3">
                          <span className="font-comic-chip tracking-wider text-sm md:text-base uppercase text-black bg-white border-4 border-black rounded-lg px-3 py-1 shadow-[3px_3px_0_0_#000] -rotate-2">
                            {selectedCategory.toUpperCase()}
                          </span>
                        </div>
                        <h2
                          className="font-comic py-4 tracking-wider leading-none text-5xl md:text-6xl lg:text-7xl relative pr-2 text-white"
                          style={comicStroke}
                          data-badge={
                            filteredPodcast[currentPodcastIndex].product_type ||
                            undefined
                          }
                        >
                          {filteredPodcast[currentPodcastIndex]?.title ||
                            "Negative impact of Mobile phone"}
                        </h2>
                        <p className="font-comic tracking-wide mb-6 text-xl md:text-2xl leading-snug text-black bg-white border-4 border-black rounded-2xl p-4 shadow-[5px_5px_0_0_#000]">
                          {filteredPodcast[currentPodcastIndex]?.description ||
                            "Podcast Negative Impact of Mobile Phones takes a closer look at the consequences of our constant connection to the digital world."}
                        </p>
                        <div className="flex items-center mb-3">
                          <span
                            className="font-comic-chip tracking-wider text-2xl text-yellow-300"
                            style={comicStrokeSm}
                          >
                            {(
                              filteredPodcast[currentPodcastIndex]
                                .details as PodcastProduct["details"]
                            )?.host || "Mentoons"}
                          </span>
                        </div>
                        <div className="p-4 border-4 border-black rounded-xl audio-player bg-white shadow-[5px_5px_0_0_#000]">
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
                              switchTo(e.currentTarget);
                              setPlayingPodcastId(null);
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
                                  String(
                                    filteredPodcast[currentPodcastIndex]._id,
                                  )
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
                                  String(
                                    filteredPodcast[currentPodcastIndex]._id,
                                  )
                              ) {
                                setPlaybackTracking((prev) =>
                                  prev ? { ...prev, skipped: true } : null,
                                );
                              }
                            }}
                            onEnded={() => {
                              handlePodcastCompletion(
                                String(
                                  filteredPodcast[currentPodcastIndex]._id,
                                ),
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
                    <div className="flex justify-center gap-4 mt-2 pb-6">
                      <button
                        onClick={() =>
                          setCurrentPodcastIndex((prev) =>
                            prev > 0 ? prev - 1 : filteredPodcast.length - 1,
                          )
                        }
                        className="p-3 transition-all duration-200 bg-yellow-300 border-4 border-black rounded-full shadow-[4px_4px_0_0_#000] hover:bg-yellow-200 hover:-translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0_0_#000]"
                        aria-label="Previous podcast"
                      >
                        <IoIosArrowBack className="text-2xl text-black" />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPodcastIndex((prev) =>
                            prev < filteredPodcast.length - 1 ? prev + 1 : 0,
                          )
                        }
                        className="p-3 transition-all duration-200 bg-yellow-300 border-4 border-black rounded-full shadow-[4px_4px_0_0_#000] hover:bg-yellow-200 hover:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0_0_#000]"
                        aria-label="Next podcast"
                      >
                        <IoIosArrowForward className="text-2xl text-black" />
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
            <h2 className="font-comic relative z-10 lg:pb-6 text-4xl md:text-6xl tracking-wider">
              <span className="text-orange-400" style={comicStroke}>
                Trending Podcast
              </span>
              <span className="relative ml-3 text-white" style={comicStroke}>
                For You!
                <svg
                  className="absolute left-0 w-full -bottom-2"
                  viewBox="0 0 100 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 15 Q 25 5, 50 15 T 100 15"
                    stroke="#000"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              </span>
            </h2>
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
                      stopAll();
                    } else {
                      stopAll();
                      setPlayingPodcastId(podcastId);
                    }
                  }}
                  onCheckAccessAndControlPlayback={
                    checkAccessAndControlPlayback
                  }
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
              className="absolute left-0 p-3 transition-all duration-300 -translate-y-1/2 bg-yellow-300 border-4 border-black rounded-full shadow-[4px_4px_0_0_#000] top-1/2 hover:bg-yellow-200 hover:scale-110 hover:-translate-x-1"
              style={{ display: isAtStart ? "none" : "block" }}
              aria-label="Scroll left"
            >
              <IoIosArrowBack className="text-2xl text-black" />
            </button>
            <button
              onClick={() => {
                const carousel = carouselRef.current;
                if (carousel)
                  carousel.scrollBy({ left: 310, behavior: "smooth" });
              }}
              className="absolute right-0 p-3 transition-all duration-300 -translate-y-1/2 bg-yellow-300 border-4 border-black rounded-full shadow-[4px_4px_0_0_#000] top-1/2 hover:bg-yellow-200 hover:scale-110 hover:translate-x-1"
              style={{ display: isAtEnd ? "none" : "block" }}
              aria-label="Scroll right"
            >
              <IoIosArrowForward className="text-2xl text-black" />
            </button>
          </motion.div>

          {filteredPodcast.length > 0 && (
            <motion.button
              type="button"
              onClick={() => setShowNewReleaseModal(true)}
              className="relative flex items-center w-full gap-4 md:gap-6 p-4 md:p-6 my-10 overflow-hidden text-left text-black transition-all md:my-24 bg-pink-400 border-8 border-black shadow-[10px_10px_0_0_#000] rounded-3xl hover:-translate-y-1 hover:shadow-[12px_14px_0_0_#000] active:translate-y-1 active:shadow-[3px_3px_0_0_#000]"
              style={halftoneDark}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative z-10 flex-shrink-0 w-20 h-20 overflow-hidden border-4 border-black shadow-[4px_4px_0_0_#000] rounded-2xl md:w-28 md:h-28 -rotate-3">
                <img
                  src={
                    filteredPodcast[0]?.productImages?.[0].imageUrl ||
                    "/assets/podcastv2/electronic-gadgets-and-kids-large.jpg"
                  }
                  alt={filteredPodcast[0]?.title || "New release thumbnail"}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="relative z-10 flex-1">
                <span className="font-comic-chip tracking-wider inline-block py-1 px-3 mb-2 text-xs md:text-sm text-black bg-green-300 border-4 border-black rounded-lg shadow-[3px_3px_0_0_#000] rotate-2">
                  NEW RELEASE
                </span>
                <h3
                  className="font-comic text-3xl tracking-wider text-white md:text-6xl"
                  style={comicStroke}
                >
                  CHECK OUT OUR NEW RELEASE
                </h3>
                <p className="font-comic tracking-wide mt-2 text-lg text-black line-clamp-1 md:text-2xl">
                  {filteredPodcast[0]?.title ||
                    "Negative impact of Mobile phone"}
                </p>
              </div>
              <div className="font-comic-chip tracking-wider relative z-10 flex-shrink-0 px-5 py-2 text-lg bg-yellow-300 border-4 border-black rounded-xl shadow-[4px_4px_0_0_#000] md:px-8 md:py-3 md:text-2xl">
                View
              </div>
            </motion.button>
          )}

          <motion.div
            className="flex flex-col lg:flex-row items-start mt-10 gap-8 p-6 md:p-12 mb-16 text-white rounded-3xl bg-blue-600 border-8 border-black shadow-[10px_10px_0_0_#000]"
            style={halftoneDark}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex-1 space-y-3">
              <p className="font-comic tracking-wider text-xl md:text-2xl text-yellow-300">
                FOR THE PEOPLE WHO WANT TO BE HEARD...
              </p>
              <p
                className="font-comic pt-2 text-5xl md:text-7xl tracking-wider text-white"
                style={comicStroke}
              >
                WANT YOUR VOICE TO BE HEARD
              </p>
              <p className="font-comic tracking-wide pb-4 text-xl md:text-2xl">
                If you want to create podcast on a particular topic, Join Us! Be
                the voice of change.
              </p>
              <div className="flex items-center w-full gap-4">
                <form className="flex flex-col w-full gap-3">
                  <div className="flex flex-col w-full lg:pr-36 gap-3">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Your Name"
                      value={dbUser?.name || enquiryName}
                      onChange={(e) => setEnquiryName(e.target.value)}
                      className="font-comic tracking-wide text-xl w-full p-4 text-black border-4 border-black shadow-[5px_5px_0_0_#000] rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-300"
                    />
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Your Email"
                      value={dbUser?.email || enquiryEmail}
                      onChange={(e) => setEnquiryEmail(e.target.value)}
                      className="font-comic tracking-wide text-xl w-full p-4 text-black border-4 border-black shadow-[5px_5px_0_0_#000] rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-300"
                    />
                  </div>
                  <div className="w-full lg:pr-36">
                    <textarea
                      name="message"
                      id="message"
                      placeholder="Write here"
                      rows={3}
                      onChange={handleMessageChange}
                      className="font-comic tracking-wide text-xl w-full p-4 text-black border-4 border-black shadow-[5px_5px_0_0_#000] rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-300"
                    />
                  </div>
                  <button
                    type="submit"
                    className="font-comic-chip tracking-wider px-12 py-3 text-2xl text-black bg-yellow-300 border-4 border-black shadow-[6px_6px_0_0_#000] rounded-xl w-fit hover:bg-yellow-200 hover:-translate-y-1 hover:shadow-[6px_10px_0_0_#000] active:translate-y-1 active:shadow-[2px_2px_0_0_#000] transition-all"
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
                className="w-full drop-shadow-[6px_6px_0_rgba(0,0,0,0.9)]"
              />
            </div>
          </motion.div>
        </div>
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
      <NewReleaseModal
        isOpen={showNewReleaseModal}
        onClose={() => setShowNewReleaseModal(false)}
        filteredPodcast={filteredPodcast}
        currentPodcastIndex={currentPodcastIndex}
        playingPodcastId={playingPodcastId}
        setPlayingPodcastId={setPlayingPodcastId}
        stopAll={stopAll}
        switchTo={switchTo}
        checkAccessAndControlPlayback={checkAccessAndControlPlayback}
        handlePodcastCompletion={handlePodcastCompletion}
        playbackTracking={playbackTracking}
        setPlaybackTracking={setPlaybackTracking}
        isSwitchingRef={isSwitchingRef}
        setHasPlayedNewRelease={setHasPlayedNewRelease}
      />
    </>
  );
};

export default Podcastv2;
