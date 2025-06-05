import EnquiryModal from "@/components/modals/EnquiryModal";
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
import { IoCloseCircleOutline, IoPlay } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PodcastCard from "@/components/podcast/card";

// Interface for database user
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

// Type to track podcast playback behavior
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
  const navigate = useNavigate();
  const [playingPodcastId, setPlayingPodcastId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [enquiryEmail, setEnquiryEmail] = useState("");
  const [enquiryName, setEnquiryName] = useState("");
  const [showMembershipModal, setShowMembershipModal] =
    useState<boolean>(false);
  const { isSignedIn, user } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);

  console.log(isScrolled);
  const [filteredPodcast, setFilteredPodcast] = useState<ProductBase[]>([]);
  const [currentPodcastIndex, setCurrentPodcastIndex] = useState(0);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [playbackTracking, setPlaybackTracking] =
    useState<PlaybackTrackingState | null>(null);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [quotaModalMessage, setQuotaModalMessage] = useState("");
  const [modalShownTimestamp, setModalShownTimestamp] = useState<number>(0);

  const handleScroll = () => {
    const carousel = carouselRef.current;
    if (carousel) {
      setIsAtStart(carousel.scrollLeft === 0);
      setIsAtEnd(
        carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1
      );
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", handleScroll);
      return () => carousel.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleSelectedCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      const queryResponse = await axios.post(
        "https://mentoons-backend-zlx3.onrender.com/api/v1/query",
        {
          message: message,
          name: enquiryName,
          email: enquiryEmail,
          queryType: "podcast",
        }
      );
      if (queryResponse.status === 201) {
        setShowEnquiryModal(true);
      }
    } catch (error) {
      toast.error("Failed to submit message");
    }
  };

  const handlePodcastCompletion = (podcastId: string, podcastType: string) => {
    podcastType = podcastType.toLowerCase();
    if (isSignedIn && dbUser) {
      const subscription = dbUser.subscription;
      if (hasQuotaForPodcastType(podcastType, subscription)) {
        if (
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
      } else {
        const message = getQuotaMessage(podcastType, subscription);
        setQuotaModalMessage(message);
        setShowQuotaModal(true);
      }
    }
  };

  const handleBrowsePlansClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    navigate("/membership");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } },
  };

  const scaleIn = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.6 } },
  };

  const { scrollYProgress } = useScroll();
  const { getToken } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { items: products } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const token = await getToken();
        await dispatch(
          fetchProducts({ type: ProductType.PODCAST, token: token! })
        );
      } catch (error) {
        console.error("Error fetching podcast data:", error);
      }
    };
    fetchPodcast();
  }, [dispatch, getToken]);

  useEffect(() => {
    const filteredPodcast = products.filter(
      (podcast) =>
        (podcast?.details as PodcastProduct["details"])?.category ===
        selectedCategory
    );
    setFilteredPodcast(filteredPodcast);
  }, [products, selectedCategory]);

  const fetchDBUser = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `https://mentoons-backend-zlx3.onrender.com/api/v1/user/user/${user?.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setDbUser(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [user?.id, getToken]);

  useEffect(() => {
    fetchDBUser();
  }, [fetchDBUser, user?.id, getToken]);

  const isFreePlanValid = useCallback(
    (subscription: Subscription | undefined): boolean => {
      if (!subscription) return false;
      if (subscription.plan !== "free") return true;
      if (subscription.isActive === false) return false;
      if (subscription.validUntil) {
        const validUntil = new Date(subscription.validUntil);
        const now = new Date();
        return now <= validUntil;
      }
      return false;
    },
    []
  );

  const hasQuotaForPodcastType = useCallback(
    (podcastType: string, subscription: Subscription | undefined): boolean => {
      if (!subscription) return false;
      const normalizedPodcastType = podcastType.toLowerCase();
      const normalizedPlan = subscription.plan.toLowerCase();
      const consumedContent = subscription.consumedContent || {
        prime: 0,
        platinum: 0,
      };
      const lastResetDate = consumedContent.lastResetDate
        ? new Date(consumedContent.lastResetDate)
        : null;
      const currentDate = new Date();
      const needsReset =
        !lastResetDate ||
        lastResetDate.getMonth() !== currentDate.getMonth() ||
        lastResetDate.getFullYear() !== currentDate.getFullYear();

      if (needsReset) {
        console.log("Monthly quota reset needed");
      }

      if (normalizedPlan === "free") {
        return (
          normalizedPodcastType === "free" && isFreePlanValid(subscription)
        );
      } else if (normalizedPlan === "prime") {
        if (normalizedPodcastType === "free") return true;
        if (normalizedPodcastType === "prime") {
          return (consumedContent.prime || 0) < 5;
        }
        return false;
      } else if (normalizedPlan === "platinum") {
        if (normalizedPodcastType === "free") return true;
        if (normalizedPodcastType === "prime") {
          return (consumedContent.prime || 0) < 5;
        }
        if (normalizedPodcastType === "platinum") {
          return (consumedContent.platinum || 0) < 8;
        }
      }
      return false;
    },
    [isFreePlanValid]
  );

  const getQuotaMessage = useCallback(
    (podcastType: string, subscription: Subscription | undefined): string => {
      if (!subscription) return "Please subscribe to access this content";
      const normalizedPodcastType = podcastType.toLowerCase();
      const normalizedPlan = subscription.plan.toLowerCase();

      if (normalizedPlan === "free") {
        if (
          normalizedPodcastType === "prime" ||
          normalizedPodcastType === "platinum"
        ) {
          return `Upgrade to ${normalizedPodcastType} subscription to access this content`;
        }
        if (!isFreePlanValid(subscription)) {
          return "Your free trial has expired. Please upgrade to continue accessing content.";
        }
      } else if (normalizedPlan === "prime") {
        if (normalizedPodcastType === "platinum") {
          return "Upgrade to Platinum subscription to access this premium content";
        }
        if (
          normalizedPodcastType === "prime" &&
          (subscription.consumedContent?.prime || 0) >= 5
        ) {
          return "You've reached your monthly limit of 5 Prime podcasts. Please wait for next month or upgrade to Platinum.";
        }
      } else if (normalizedPlan === "platinum") {
        if (
          normalizedPodcastType === "prime" &&
          (subscription.consumedContent?.prime || 0) >= 5
        ) {
          return "You've reached your monthly limit of 5 Prime podcasts. Please wait for next month.";
        }
        if (
          normalizedPodcastType === "platinum" &&
          (subscription.consumedContent?.platinum || 0) >= 8
        ) {
          return "You've reached your monthly limit of 8 Platinum podcasts. Please wait for next month.";
        }
      }
      return "";
    },
    [isFreePlanValid]
  );

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

        if (dbUser.subscription) {
          const consumedContent = dbUser.subscription.consumedContent || {
            prime: 0,
            platinum: 0,
          };
          const updatedUser = { ...dbUser };
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
        }
        fetchDBUser();
      } catch (error) {
        console.error("Error updating content consumption:", error);
      }
    },
    [dbUser, isSignedIn, getToken, fetchDBUser]
  );

  const checkAccessAndControlPlayback = useCallback(
    (podcast: ProductBase, audioElement?: HTMLAudioElement | null) => {
      const podcastId = String(podcast._id);
      const podcastType = String(podcast.product_type || "free").toLowerCase();

      if (
        isSignedIn &&
        dbUser &&
        !hasQuotaForPodcastType(podcastType, dbUser.subscription)
      ) {
        const currentTime = Date.now();
        if (currentTime - modalShownTimestamp > 5000) {
          const message = getQuotaMessage(podcastType, dbUser.subscription);
          setQuotaModalMessage(message);
          setShowQuotaModal(true);
          setModalShownTimestamp(currentTime);
        }
        if (audioElement && !audioElement.paused) {
          audioElement.pause();
          setTimeout(() => {
            if (audioElement && !audioElement.paused) {
              audioElement.pause();
              const timeNow = Date.now();
              if (timeNow - modalShownTimestamp > 5000) {
                const message = getQuotaMessage(
                  podcastType,
                  dbUser.subscription
                );
                setQuotaModalMessage(message);
                setShowQuotaModal(true);
                setModalShownTimestamp(timeNow);
              }
            }
          }, 45000);
          return false;
        }
        return false;
      } else if (!isSignedIn && audioElement) {
        setTimeout(() => {
          if (audioElement && !audioElement.paused) {
            audioElement.pause();
            const timeNow = Date.now();
            if (timeNow - modalShownTimestamp > 5000) {
              setShowMembershipModal(true);
              setModalShownTimestamp(timeNow);
            }
          }
        }, 45000);
      }

      if (isSignedIn) {
        setPlaybackTracking({
          startTime: Date.now(),
          paused: false,
          skipped: false,
          podcastId,
          podcastType,
        });
      }
      return true;
    },
    [
      dbUser,
      getQuotaMessage,
      hasQuotaForPodcastType,
      isSignedIn,
      modalShownTimestamp,
    ]
  );

  return (
    <>
      <HeroSectionPodcast />
      <div className="w-[90%] mx-auto mt-16">
        <motion.div
          className="items-start gap-8 md:flex"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="flex-1" variants={fadeInUp}>
            <h1 className="py-8 text-5xl font-semibold text-primary md:text-6xl">
              Trending Podcast
            </h1>
            <p className="text-xl font-semibold pb-8 w-[80%]">
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
          </motion.div>
          <motion.div className="flex-1" variants={fadeInUp}>
            <h2 className="py-4 text-4xl font-semibold text-center luckiest-guy-regular text-neutral-700">
              PODCAST ONLY FOR YOU
            </h2>
            <img
              src="/assets/podcastv2/hero-image-2.png"
              alt="Right side hero image"
              className="flex items-center justify-center w-full"
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="flex flex-col py-12"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeInUp}
            className="pb-12 text-3xl font-semibold text-center"
          >
            This is What You Get
          </motion.h2>
          <motion.div
            className="flex flex-col items-center gap-4 md:flex-row md:justify-around"
            variants={staggerContainer}
          >
            {PODCAST_OFFERINGS.map((podcast) => (
              <motion.div
                key={podcast.label}
                variants={scaleIn}
                className="flex flex-col items-center gap-4 border p-4 rounded-xl w-[280px] h-[280px] justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={podcast.imgeUrl}
                  alt={podcast.label}
                  className="w-24 h-24"
                />
                <p
                  style={{ color: podcast.accentColor }}
                  className="text-lg font-bold text-center"
                >
                  {podcast.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="flex flex-col gap-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="py-8 text-2xl font-semibold text-center text-primary">
              CATEGORIES TO CHOOSE FROM
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {PODCAST_V2_CATEGORY.map((category) => (
                <div
                  key={category.id}
                  className={`flex items-center gap-4 border p-2 px-4 rounded-xl border-neutral-700 bg-orange-50 hover:ring-4 hover:ring-orange-300 cursor-pointer transition-all duration-200 ${
                    selectedCategory === category.lable
                      ? `ring-4 ring-orange-300 shadow-xl shadow-orange-200`
                      : ""
                  } `}
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
            className="my-12"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              {filteredPodcast.length > 0 && (
                <div className="relative">
                  <div className="relative overflow-hidden rounded-3xl shadow-lg bg-gradient-to-br from-orange-400 via-[#FF6C6C] to-pink-500 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 translate-x-1/2 -translate-y-1/2 bg-orange-300 rounded-full opacity-20 md:w-64 md:h-64"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 -translate-x-1/2 translate-y-1/2 bg-pink-300 rounded-full opacity-20 md:w-48 md:h-48"></div>
                    <div className="flex flex-col items-start p-5 md:flex-row md:p-8">
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
                          className="py-4 font-bold leading-none text-4xl sm:text-4xl md:text-5xl lg:text-6xl relative pr-2 after:content-[attr(data-badge)]
                          after:hidden
                          data-[badge]:after:inline-block
                          after:py-[4px]
                          after:px-[6px]
                          after:leading-none
                          after:text-white
                          after:text-sm
                          after:font-semibold
                          after:rounded
                          after:ml-2
                          after:shadow-md
                          after:absolute
                          after:animate-[sparkle_2s_ease-in-out_infinite]
                          [--badge-bg:theme(colors.yellow.300)]
                          [--badge-text:theme(colors.yellow.800)]
                          data-[badge=Free]:after:bg-gradient-to-r
                          data-[badge=Free]:after:from-green-400
                          data-[badge=Free]:after:to-green-500
                          data-[badge=free]:after:bg-gradient-to-r
                          data-[badge=free]:after:from-green-400
                          data-[badge=free]:after:to-green-500
                          data-[badge=Prime]:after:bg-gradient-to-r
                          data-[badge=Prime]:after:from-yellow-400
                          data-[badge=Prime]:after:to-orange-500
                          data-[badge=prime]:after:bg-gradient-to-r
                          data-[badge=prime]:after:from-yellow-400
                          data-[badge=prime]:after:to-orange-500
                          data-[badge=Platinum]:after:bg-gradient-to-r
                          data-[badge=Platinum]:after:from-gray-400
                          data-[badge=Platinum]:after:to-gray-500
                          data-[badge=platinum]:after:bg-gradient-to-r
                          data-[badge=platinum]:after:from-gray-400
                          data-[badge=platinum]:after:to-gray-500"
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
                        <div className="p-4 border rounded-xl backdrop-blur-sm audio-player bg-white/10 border-white/20 ">
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
                            onPlay={(e) => {
                              const hasAccess = checkAccessAndControlPlayback(
                                filteredPodcast[currentPodcastIndex],
                                e.currentTarget
                              );
                              if (!hasAccess) {
                                e.currentTarget.pause();
                                setPlayingPodcastId(null);
                              }
                            }}
                            onPause={() => {
                              if (
                                playbackTracking &&
                                playbackTracking.podcastId ===
                                  String(
                                    filteredPodcast[currentPodcastIndex]._id
                                  )
                              ) {
                                setPlaybackTracking((prev) =>
                                  prev ? { ...prev, paused: true } : null
                                );
                              }
                            }}
                            onSeeked={() => {
                              if (
                                playbackTracking &&
                                playbackTracking.podcastId ===
                                  String(
                                    filteredPodcast[currentPodcastIndex]._id
                                  )
                              ) {
                                setPlaybackTracking((prev) =>
                                  prev ? { ...prev, skipped: true } : null
                                );
                              }
                            }}
                            onEnded={() => {
                              setPlayingPodcastId(null);
                              handlePodcastCompletion(
                                String(
                                  filteredPodcast[currentPodcastIndex]._id
                                ),
                                String(
                                  filteredPodcast[currentPodcastIndex]
                                    .product_type || "free"
                                )
                              );
                            }}
                          >
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      onClick={() => {
                        setCurrentPodcastIndex((prev) =>
                          prev > 0 ? prev - 1 : filteredPodcast.length - 1
                        );
                      }}
                      className="p-3 transition-all duration-200 bg-white rounded-full shadow-lg hover:bg-gray-100 hover:shadow-orange-200/50 hover:-translate-x-1"
                      aria-label="Previous podcast"
                    >
                      <IoIosArrowBack className="text-2xl text-orange-500" />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPodcastIndex((prev) =>
                          prev < filteredPodcast.length - 1 ? prev + 1 : 0
                        );
                      }}
                      className="p-3 transition-all duration-200 bg-white rounded-full shadow-lg hover:bg-gray-100 hover:shadow-orange-200/50 hover:translate-x-1"
                      aria-label="Next podcast"
                    >
                      <IoIosArrowForward className="text-2xl text-orange-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative my-20"
          style={{
            scale: useTransform(scrollYProgress, [0.4, 0.8], [1, 1]),
            opacity: useTransform(scrollYProgress, [0.4, 0.8], [1, 1]),
          }}
        >
          <h2 className="relative z-10 pb-6 text-4xl font-bold text-primary">
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
                    setPlayingPodcastId(null);
                  } else {
                    setPlayingPodcastId(podcastId);
                  }
                }}
                onCheckAccessAndControlPlayback={checkAccessAndControlPlayback}
                onPlaybackTrackingUpdate={setPlaybackTracking}
                onPodcastCompletion={handlePodcastCompletion}
                playbackTracking={playbackTracking}
              />
            ))}
          </div>
          <button
            onClick={() => {
              const carousel = carouselRef.current;
              if (carousel) {
                carousel.scrollBy({ left: -310, behavior: "smooth" });
              }
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
              if (carousel) {
                carousel.scrollBy({ left: 310, behavior: "smooth" });
              }
            }}
            className="absolute right-0 p-3 transition-all duration-300 -translate-y-1/2 bg-white rounded-full shadow-xl top-1/2 hover:bg-orange-100 hover:scale-110 hover:translate-x-1"
            style={{ display: isAtEnd ? "none" : "block" }}
            aria-label="Scroll right"
          >
            <IoIosArrowForward className="text-2xl text-orange-500" />
          </button>
        </motion.div>

        <motion.div
          className="relative my-24 overflow-hidden shadow-2xl bg-gradient-to-br from-orange-400 to-pink-500 rounded-3xl"
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
          <div className="flex flex-col-reverse md:flex-row md:items-center md:gap-8 bg-gradient-to-br from-[#FF6D6D]/90 via-orange-300/80 to-white rounded-3xl shadow-2xl overflow-hidden">
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
                    <span
                      className="py-[3px] 
                        px-[5px] 
                        text-xs 
                        font-semibold 
                        rounded 
                        shadow-md
                        capitalize text-green-600 bg-green-200 backdrop-blur-sm"
                    >
                      NEW RELEASE
                    </span>
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
                        }
                      `}
                    >
                      {(filteredPodcast[0].details as PodcastProduct["details"])
                        ?.category || "Category"}
                    </div>
                  </div>
                  <h2
                    className="mb-3 text-3xl font-bold text-white drop-shadow-sm md:text-4xl after:content-[attr(data-badge)]
                    after:hidden
                    data-[badge]:after:inline-block
                    after:py-[4px]
                    after:px-[6px]
                    after:leading-none
                    after:text-white
                    after:text-sm
                    after:font-semibold
                    after:rounded
                    after:ml-2
                    after:shadow-md
                    after:absolute
                    after:animate-[sparkle_2s_ease-in-out_infinite]
                    [--badge-bg:theme(colors.yellow.300)]
                    [--badge-text:theme(colors.yellow.800)]
                    data-[badge=Free]:after:bg-gradient-to-r
                    data-[badge=Free]:after:from-green-400
                    data-[badge=Free]:after:to-green-500
                    data-[badge=free]:after:bg-gradient-to-r
                    data-[badge=free]:after:from-green-400
                    data-[badge=free]:after:to-green-500
                    data-[badge=Prime]:after:bg-gradient-to-r
                    data-[badge=Prime]:after:from-yellow-400
                    data-[badge=Prime]:after:to-orange-500
                    data-[badge=prime]:after:bg-gradient-to-r
                    data-[badge=prime]:after:from-yellow-400
                    data-[badge=prime]:after:to-orange-500
                    data-[badge=Platinum]:after:bg-gradient-to-r
                    data-[badge=Platinum]:after:from-gray-400
                    data-[badge=Platinum]:after:to-gray-500
                    data-[badge=platinum]:after:bg-gradient-to-r
                    data-[badge=platinum]:after:from-gray-400
                    data-[badge=platinum]:after:to-gray-500"
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
                      "Podcast on Electronic Gadgets and Kids examines the impact of digital devices on children's development and daily lives. Each episode explores how smartphones, tablets, and other gadgets....."}
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
                        setPlayingPodcastId(null);
                      } else {
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
                      onPlay={(e) => {
                        const hasAccess = checkAccessAndControlPlayback(
                          filteredPodcast[0],
                          e.currentTarget
                        );
                        if (!hasAccess) {
                          e.currentTarget.pause();
                          setPlayingPodcastId(null);
                        }
                      }}
                      onPause={() => {
                        if (
                          playbackTracking &&
                          playbackTracking.podcastId ===
                            String(filteredPodcast[0]._id)
                        ) {
                          setPlaybackTracking((prev) =>
                            prev ? { ...prev, paused: true } : null
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
                            prev ? { ...prev, skipped: true } : null
                          );
                        }
                      }}
                      onEnded={() => {
                        setPlayingPodcastId(null);
                        if (filteredPodcast[0]) {
                          handlePodcastCompletion(
                            String(filteredPodcast[0]._id),
                            String(filteredPodcast[0].product_type || "free")
                          );
                        }
                      }}
                      className="hidden"
                    />
                  )}
                </div>
              </div>
            )}
            <div className="relative flex-1 p-8 md:p-12">
              <h2 className="mb-8 text-5xl font-semibold text-center text-black drop-shadow-lg md:text-7xl luckiest-guy-regular">
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
          className="flex flex-col items-start gap-8 p-12 mb-16 text-white rounded-3xl bg-primary md:flex-row"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex-1">
            <p className="tracking-wide">
              FOR THE PEOPLE WHO WANT TO BE HEARD...
            </p>
            <p className="pt-2 text-6xl font-semibold luckiest-guy-regular">
              WANT YOUR VOICE TO BE HEARD
            </p>
            <p className="pb-4">
              If you want to create podcast on a particular topic, Join Us! Be
              the voice of change.
            </p>
            <div className="flex items-center w-full gap-4">
              <form className="flex flex-col w-full gap-2">
                <div className="flex flex-col w-full md:pr-36">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Your Name"
                    value={enquiryName}
                    onChange={(e) => setEnquiryName(e.target.value)}
                    className="w-full p-4 mb-2 text-black shadow-lg rounded-xl"
                  />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Your Email"
                    value={enquiryEmail}
                    onChange={(e) => setEnquiryEmail(e.target.value)}
                    className="w-full p-4 text-black shadow-lg rounded-xl"
                  />
                </div>
                <div className="w-full md:pr-36">
                  <textarea
                    name="message"
                    id="message"
                    placeholder="Write here"
                    rows={3}
                    onChange={(e) => handleMessageChange(e)}
                    className="w-full p-4 text-black shadow-lg rounded-xl"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="px-12 py-3 text-lg font-semibold text-white bg-blue-600 rounded-xl w-fit"
                  onClick={(e) => handleSubmit(e)}
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
      {showMembershipModal && (
        <div
          className="fixed inset-0 z-[999] bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setShowMembershipModal(false)}
        >
          <div
            className="bg-white p-8 rounded-lg relative sm:max-w-[425px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-0 right-0 m-4 text-3xl rounded text-muted-foreground"
              onClick={() => setShowMembershipModal(false)}
            >
              <IoCloseCircleOutline />
            </button>
            <div className="py-4 space-y-4">
              <p className="text-2xl font-bold text-center text-muted-foreground">
                To listen more, buy Mentoons membership
              </p>
              <p className="text-center text-md text-muted-foreground">
                Get unlimited access to our complete library of audio content
                and exclusive features.
              </p>
            </div>
            <a
              href={"#subscription"}
              className="block w-full px-4 py-3 text-lg font-semibold text-center text-white transition-all duration-300 bg-primary hover:scale-105"
              onClick={(e) => {
                setShowMembershipModal(false);
                handleBrowsePlansClick(e);
              }}
            >
              View Membership Plans
            </a>
          </div>
        </div>
      )}
      {showEnquiryModal && (
        <EnquiryModal
          isOpen={showEnquiryModal}
          onClose={() => setShowEnquiryModal(false)}
          message={ModalMessage.ENQUIRY_MESSAGE}
        />
      )}
      {showQuotaModal && (
        <div
          className="fixed inset-0 z-[999] bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setShowQuotaModal(false)}
        >
          <div
            className="bg-white p-8 rounded-lg relative sm:max-w-[425px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-0 right-0 m-4 text-3xl rounded text-muted-foreground"
              onClick={() => setShowQuotaModal(false)}
            >
              <IoCloseCircleOutline />
            </button>
            <div className="py-4 space-y-4">
              <p className="text-2xl font-bold text-center text-muted-foreground">
                Subscription Limit Reached
              </p>
              <p className="text-center text-md text-muted-foreground">
                {quotaModalMessage}
              </p>
            </div>
            <a
              href={"#subscription"}
              className="block w-full px-4 py-3 text-lg font-semibold text-center text-white transition-all duration-300 bg-primary hover:scale-105"
              onClick={(e) => {
                setShowQuotaModal(false);
                handleBrowsePlansClick(e);
              }}
            >
              View Subscription Plans
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Podcastv2;
