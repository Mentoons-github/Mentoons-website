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
  // Add other fields as needed
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

  // State to track podcast playback behavior
  const [playbackTracking, setPlaybackTracking] =
    useState<PlaybackTrackingState | null>(null);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [quotaModalMessage, setQuotaModalMessage] = useState("");
  // Track if a modal has been shown recently to prevent multiple modals
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
      console.log(queryResponse);
      if (queryResponse.status === 201) {
        setShowEnquiryModal(true);
      }
    } catch (error) {
      toast.error("Failed to submit message");
    }
  };

  // Handle podcast completion to trigger reward
  const handlePodcastCompletion = (podcastId: string, podcastType: string) => {
    // Convert podcastType to lowercase for consistent comparison
    podcastType = podcastType.toLowerCase();

    // Only reward signed-in users with a valid subscription and within quota
    if (isSignedIn && dbUser) {
      const subscription = dbUser.subscription;

      console.log("Podcast completion:", {
        podcastId,
        podcastType,
        subscription,
      });

      // Only reward if user has proper subscription and within quota
      if (hasQuotaForPodcastType(podcastType, subscription)) {
        // Only reward if the podcast was played without skipping or pausing
        if (
          playbackTracking &&
          playbackTracking.podcastId === podcastId &&
          !playbackTracking.paused &&
          !playbackTracking.skipped
        ) {
          // Increment consumption count for appropriate content type
          if (podcastType !== "free") {
            updateContentConsumption(podcastType);
          }

          // Log for debugging
          console.log(
            "Triggering reward for podcast completion:",
            podcastId,
            podcastType
          );

          // Trigger the reward using the built-in reward system
          triggerReward(RewardEventType.LISTEN_PODCAST, podcastId);
          toast.success("You earned points for completing this podcast!");
        } else {
          console.log(
            "Podcast was paused, skipped, or tracking not initialized:",
            playbackTracking
          );
        }
      } else {
        // Show appropriate quota message
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
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSubscription(), 500);
    } else {
      scrollToSubscription();
    }
  };
  const scrollToSubscription = () =>
    document
      .getElementById("subscription")
      ?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants
  const fadeInUp = {
    initial: {
      opacity: 0,
      y: 60,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const scaleIn = {
    initial: {
      scale: 0.8,
      opacity: 0,
    },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  // Scroll based animations
  const { scrollYProgress } = useScroll();
  const { getToken } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { items: products } = useSelector((state: RootState) => state.products);
  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const token = await getToken();
        const podcast = await dispatch(
          fetchProducts({ type: ProductType.PODCAST, token: token! })
        );

        console.log("Podcast", podcast);
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
    console.log(filteredPodcast);
    setFilteredPodcast(filteredPodcast);
  }, [products, selectedCategory]);

  const fetchDBUser = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `https://mentoons-backend-zlx3.onrender.com/api/v1/user/user/${user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data);
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

  // Helper function to check if free subscription is within 3 days
  const isFreePlanValid = useCallback(
    (subscription: Subscription | undefined): boolean => {
      if (!subscription) return false;
      if (subscription.plan !== "free") return true; // Non-free plans are considered valid

      // Check validity status directly if available
      if (subscription.isActive === false) {
        console.log("Free subscription explicitly marked as inactive");
        return false;
      }

      // Check if within validity period
      if (subscription.validUntil) {
        const validUntil = new Date(subscription.validUntil);
        const now = new Date();

        // Debug log
        console.log("Free subscription validity check:", {
          validUntil: validUntil.toISOString(),
          now: now.toISOString(),
          isValid: now <= validUntil,
        });

        return now <= validUntil;
      }

      // Default to false if no validUntil date
      console.log(
        "Free subscription has no validUntil date, defaulting to invalid"
      );
      return false;
    },
    []
  );

  // Helper function to check if user has quota for podcast type
  const hasQuotaForPodcastType = useCallback(
    (podcastType: string, subscription: Subscription | undefined): boolean => {
      if (!subscription) return false;

      // Normalize both podcast type and subscription plan to lowercase for consistent comparison
      const normalizedPodcastType = podcastType.toLowerCase();
      const normalizedPlan = subscription.plan.toLowerCase();

      console.log("Checking quota for:", {
        podcastType: normalizedPodcastType,
        subscriptionPlan: normalizedPlan,
      });

      // Initialize consumedContent if not exists
      const consumedContent = subscription.consumedContent || {
        prime: 0,
        platinum: 0,
      };

      // Check if we need to reset monthly quota
      const lastResetDate = consumedContent.lastResetDate
        ? new Date(consumedContent.lastResetDate)
        : null;
      const currentDate = new Date();
      const needsReset =
        !lastResetDate ||
        lastResetDate.getMonth() !== currentDate.getMonth() ||
        lastResetDate.getFullYear() !== currentDate.getFullYear();

      if (needsReset) {
        // Would reset in the real implementation through API
        console.log("Monthly quota reset needed");
      }

      // Check quota by subscription type
      if (normalizedPlan === "free") {
        // Free users can only access free content
        const validFree = isFreePlanValid(subscription);
        console.log("Free user has valid subscription:", validFree);
        return normalizedPodcastType === "free" && validFree;
      } else if (normalizedPlan === "prime") {
        // Prime users can access free content and have quota for prime
        if (normalizedPodcastType === "free") return true;
        if (normalizedPodcastType === "prime") {
          const hasQuota = (consumedContent.prime || 0) < 5;
          console.log(
            "Prime user consuming Prime content, has quota:",
            hasQuota,
            "consumed:",
            consumedContent.prime
          );
          return hasQuota;
        }
        return false; // Cannot access Platinum
      } else if (normalizedPlan === "platinum") {
        // Platinum users can access all with quotas for Prime and Platinum
        if (normalizedPodcastType === "free") return true;
        if (normalizedPodcastType === "prime") {
          const hasQuota = (consumedContent.prime || 0) < 5;
          console.log(
            "Platinum user consuming Prime content, has quota:",
            hasQuota,
            "consumed:",
            consumedContent.prime
          );
          return hasQuota;
        }
        if (normalizedPodcastType === "platinum") {
          const hasQuota = (consumedContent.platinum || 0) < 8;
          console.log(
            "Platinum user consuming Platinum content, has quota:",
            hasQuota,
            "consumed:",
            consumedContent.platinum
          );
          return hasQuota;
        }
      }

      return false;
    },
    [isFreePlanValid]
  );

  // Helper function to get quota message for a podcast type
  const getQuotaMessage = useCallback(
    (podcastType: string, subscription: Subscription | undefined): string => {
      if (!subscription) return "Please subscribe to access this content";

      // Normalize both podcast type and subscription plan to lowercase for consistent comparison
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

  // Helper function to update content consumption
  const updateContentConsumption = useCallback(
    async (podcastType: string) => {
      if (!isSignedIn || !dbUser || !dbUser._id) return;

      try {
        // Update consumption count in localStorage
        const consumptionKey = `${dbUser._id}_consumption`;
        const storedConsumption = localStorage.getItem(consumptionKey);
        const consumption = storedConsumption
          ? JSON.parse(storedConsumption)
          : {
              prime: 0,
              platinum: 0,
            };

        if (podcastType === "prime") {
          consumption.prime += 1;
        } else if (podcastType === "platinum") {
          consumption.platinum += 1;
        }

        localStorage.setItem(consumptionKey, JSON.stringify(consumption));

        // Update local state for immediate UI feedback
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

        // Fetch the updated user data
        fetchDBUser();
      } catch (error) {
        console.error("Error updating content consumption:", error);
      }
    },
    [dbUser, isSignedIn, getToken, fetchDBUser]
  );

  // Centralized function to check subscription and control playback
  const checkAccessAndControlPlayback = useCallback(
    (podcast: ProductBase, audioElement?: HTMLAudioElement | null) => {
      const podcastId = String(podcast._id);
      // Ensure podcast_type is lowercase for consistent comparison
      const podcastType = String(podcast.product_type || "free").toLowerCase();

      console.log("Checking access for:", {
        podcastType,
        podcastTitle: podcast.title,
        userSubscription: dbUser?.subscription?.plan,
      });

      // Check if user has quota for this podcast type
      if (
        isSignedIn &&
        dbUser &&
        !hasQuotaForPodcastType(podcastType, dbUser.subscription)
      ) {
        // Only show a modal if none has been shown in the last 5 seconds
        const currentTime = Date.now();
        if (currentTime - modalShownTimestamp > 5000) {
          const message = getQuotaMessage(podcastType, dbUser.subscription);
          setQuotaModalMessage(message);
          setShowQuotaModal(true);
          setModalShownTimestamp(currentTime);
        }

        // Pause audio if element is provided
        if (audioElement && !audioElement.paused) {
          audioElement.pause();
          console.log(
            `Paused podcast due to subscription restrictions: ${podcast.title}`
          );

          // For content outside subscription tier, set a 45-second preview
          setTimeout(() => {
            if (audioElement && !audioElement.paused) {
              audioElement.pause();

              // Only show modal if none shown in last 5 seconds
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
        // For non-signed in users, always set a 45 second preview
        setTimeout(() => {
          if (audioElement && !audioElement.paused) {
            audioElement.pause();

            // Only show modal if none shown in last 5 seconds
            const timeNow = Date.now();
            if (timeNow - modalShownTimestamp > 5000) {
              setShowMembershipModal(true);
              setModalShownTimestamp(timeNow);
            }
          }
        }, 45000);
      }

      // Initialize playback tracking for valid access
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
        {/* Hero section */}

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

        {/* What you get section */}
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

        {/* Category Section */}
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

          {/* Selected Category Podcast Section with Carousel */}
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
                    {/* Decorative elements */}
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

                        {/* <h2 className="mb-4 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl"></h2> */}
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
                              // Use centralized function to check access and control playback
                              const hasAccess = checkAccessAndControlPlayback(
                                filteredPodcast[currentPodcastIndex],
                                e.currentTarget
                              );

                              // If no access, prevent playback and reset state
                              if (!hasAccess) {
                                e.currentTarget.pause();
                                setPlayingPodcastId(null);
                              }
                            }}
                            onPause={() => {
                              // Mark as paused
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
                              // Mark as skipped if user seeks
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

        {/* Trending Podcast  Section */}

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

          {/* Fun decorative elements */}
          <div className="absolute w-20 h-20 bg-orange-200 rounded-full -top-10 -left-10 opacity-70 blur-xl"></div>
          <div className="absolute w-16 h-16 bg-pink-200 rounded-full right-20 top-40 opacity-70 blur-xl"></div>

          <div
            className="flex gap-6 p-16 -mx-2 overflow-x-auto scroll-smooth snap-x"
            ref={carouselRef}
            style={{ scrollbarWidth: "none" }} /* Hide scrollbar for Firefox */
          >
            {products.map((podcast) => {
              const isPlaying = playingPodcastId === String(podcast._id);
              return (
                <div
                  key={podcast._id}
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
                      onClick={() => {
                        // If this is already playing, stop it
                        if (playingPodcastId === String(podcast._id)) {
                          setPlayingPodcastId(null);
                        } else {
                          // Otherwise stop the current one (if any) and play this one
                          setPlayingPodcastId(String(podcast._id));
                        }
                      }}
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
                          (podcast.details as PodcastProduct["details"])
                            .sampleUrl || "#"
                        }
                        autoPlay
                        controlsList="nodownload"
                        onPlay={(e) => {
                          // Use centralized function to check access and control playback
                          const hasAccess = checkAccessAndControlPlayback(
                            podcast,
                            e.currentTarget
                          );

                          // If no access, prevent playback and reset state
                          if (!hasAccess) {
                            e.currentTarget.pause();
                            setPlayingPodcastId(null);
                          }
                        }}
                        onPause={() => {
                          // Mark as paused
                          if (
                            playbackTracking &&
                            playbackTracking.podcastId === String(podcast._id)
                          ) {
                            setPlaybackTracking((prev) =>
                              prev ? { ...prev, paused: true } : null
                            );
                          }
                        }}
                        onSeeked={() => {
                          // Mark as skipped if user seeks
                          if (
                            playbackTracking &&
                            playbackTracking.podcastId === String(podcast._id)
                          ) {
                            setPlaybackTracking((prev) =>
                              prev ? { ...prev, skipped: true } : null
                            );
                          }
                        }}
                        onEnded={() => {
                          setPlayingPodcastId(null);
                          handlePodcastCompletion(
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
                          (podcast.details as PodcastProduct["details"])
                            ?.category === "mobile addiction"
                            ? "bg-gradient-to-r from-red-400 to-red-500 text-white"
                            : (podcast.details as PodcastProduct["details"])
                                ?.category === "electronic gadgets"
                            ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white"
                            : "bg-gradient-to-r from-purple-400 to-purple-500 text-white"
                        }
                      `}
                      >
                        {(podcast.details as PodcastProduct["details"])
                          ?.category || "Category"}
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
                          <svg
                            className="w-4 h-4 fill-orange-400"
                            viewBox="0 0 24 24"
                          >
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
                    <div></div>

                    <div
                      className={`flex items-center gap-2 ${
                        isPlaying ? "text-white/90" : "text-gray-500"
                      }`}
                    >
                      <div className="flex items-center justify-center w-8 h-8 overflow-hidden bg-orange-200 rounded-full">
                        <span className="text-sm font-semibold text-orange-500">
                          {(
                            podcast.details as PodcastProduct["details"]
                          )?.host?.charAt(0)}
                        </span>
                      </div>
                      <p className="text-sm font-bold">
                        {(podcast.details as PodcastProduct["details"])?.host}
                      </p>
                      {(podcast.details as PodcastProduct["details"])
                        ?.duration && (
                        <p className="flex items-center text-xs">
                          <span className="w-1 h-1 mx-1 bg-current rounded-full"></span>
                          {
                            (podcast.details as PodcastProduct["details"])
                              ?.duration
                          }{" "}
                          minutes
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
            })}
          </div>

          {/* Navigation buttons */}
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

        {/* New Release Section */}
        <motion.div
          className="relative my-24 overflow-hidden shadow-2xl bg-gradient-to-br from-orange-400 to-pink-500 rounded-3xl"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative Elements */}
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
            {/* Left Side - Podcast Details */}
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
                          (filteredPodcast as PodcastProduct["details"])
                            ?.category === "mobile addiction"
                            ? "bg-gradient-to-r from-red-400 to-red-500 text-white"
                            : (filteredPodcast as PodcastProduct["details"])
                                ?.category === "electronic gadgets"
                            ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white"
                            : "bg-gradient-to-r from-purple-400 to-purple-500 text-white"
                        }
                      `}
                    >
                      {(filteredPodcast[0].details as PodcastProduct["details"])
                        ?.category || "Category"}
                    </div>
                  </div>

                  {/* <h3 className="mb-3 text-3xl font-bold text-white drop-shadow-sm md:text-4xl">
                    {filteredPodcast[0]?.title || "Electronic gadgets and Kids"}
                  </h3> */}

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
                        // Use centralized function to check access and control playback
                        const hasAccess = checkAccessAndControlPlayback(
                          filteredPodcast[0],
                          e.currentTarget
                        );

                        // If no access, prevent playback and reset state
                        if (!hasAccess) {
                          e.currentTarget.pause();
                          setPlayingPodcastId(null);
                        }
                      }}
                      onPause={() => {
                        // Mark as paused
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
                        // Mark as skipped if user seeks
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

            {/* Right Side - Heading and Illustration */}
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

                {/* Audio wave animation decorations */}
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

        {/* Podcast Contribution */}
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
      {/* Membership Modal */}

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

      {/* Quota Modal */}
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
