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
      <div className="w-[90%] mx-auto mt-4 md:mt-16">
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
            ref={resultsRef}
            className="my-12 md:my-0 scroll-mt-6"
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
                    stopAll();
                  } else {
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

        {filteredPodcast.length > 0 && (
          <motion.button
            type="button"
            onClick={() => setShowNewReleaseModal(true)}
            className="relative flex items-center w-full gap-6 p-6 my-10 overflow-hidden text-left text-white transition-transform shadow-2xl md:my-24 bg-gradient-to-br from-orange-400 to-pink-500 rounded-3xl hover:scale-[1.01]"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute w-40 h-40 bg-pink-200 rounded-full opacity-40 -top-16 right-10 blur-xl"></div>
            <div className="relative z-10 flex-shrink-0 w-20 h-20 overflow-hidden shadow-lg rounded-2xl md:w-28 md:h-28">
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
              <span className="inline-block py-1 px-3 mb-2 text-xs font-semibold text-green-700 bg-green-200 rounded-full">
                NEW RELEASE
              </span>
              <h3 className="text-xl font-bold md:text-3xl luckiest-guy-regular">
                CHECK OUT OUR NEW RELEASE
              </h3>
              <p className="mt-1 text-sm text-white/90 line-clamp-1 md:text-base">
                {filteredPodcast[0]?.title || "Negative impact of Mobile phone"}
              </p>
            </div>
            <div className="relative z-10 flex-shrink-0 px-5 py-2 font-semibold rounded-full shadow bg-white text-primary md:px-6 md:py-3">
              View
            </div>
          </motion.button>
        )}

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
