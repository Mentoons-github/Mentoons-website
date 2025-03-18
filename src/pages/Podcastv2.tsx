import {
  PODCAST_DETAILS,
  PODCAST_OFFERINGS,
  PODCAST_V2_CATEGORY,
} from "@/constant";
import axios from "axios";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoPlay } from "react-icons/io5";
import { toast } from "sonner";

const Podcastv2 = () => {
  const [selectedCategory, setSelectedCategory] = useState("mobile addiction");
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [playingPodcastId, setPlayingPodcastId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const filteredPodcast = PODCAST_DETAILS.filter(
    (podcast) => podcast.category === selectedCategory
  );

  const [currentPodcastIndex, setCurrentPodcastIndex] = useState(0);
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
        "http://localhost:4000/api/v1/query",
        {
          message: message,
        }
      );
      console.log(queryResponse);
      if (queryResponse.status === 201) {
        toast.success("Message Submitted Successfully");
      }
    } catch (error) {
      toast.error("Failed to submit message");
    }
  };

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

  return (
    <div className="w-[90%] mx-auto mt-16">
      {/* Hero section */}
      <motion.div
        className="gap-8 items-start md:flex"
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
          <div className="flex justify-center items-center">
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
            className="flex justify-center items-center w-full"
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
          className="flex flex-col gap-4 items-center md:flex-row md:justify-around"
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
          <div className="flex flex-wrap gap-4 justify-center">
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
                <p className="font-semibold">{category.lable.toUpperCase()}</p>
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
                  <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-orange-300 rounded-full opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 md:w-48 md:h-48 bg-pink-300 rounded-full opacity-20 translate-y-1/2 -translate-x-1/2"></div>

                  <div className="flex flex-col md:flex-row items-start p-5 md:p-8">
                    <div className="flex-1 p-2 md:p-4 relative group">
                      <img
                        src={
                          filteredPodcast[currentPodcastIndex]?.thumbnail ||
                          "/assets/podcastv2/podcast-thumbnail-social.png"
                        }
                        alt={
                          filteredPodcast[currentPodcastIndex]?.topic ||
                          "Podcast Thumbnail"
                        }
                        className="object-cover rounded-2xl w-full max-w- shadow-xl transform transition-transform duration-300 group-hover:scale-95 z-10 relative"
                      />
                    </div>

                    <div className="flex-1 p-4 md:p-6 text-white">
                      <div className="flex items-center mb-3">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse mr-2"></div>
                        <span className="text-sm font-medium uppercase tracking-wider opacity-80">
                          {selectedCategory.toUpperCase()}
                        </span>
                      </div>

                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white">
                        {filteredPodcast[currentPodcastIndex]?.topic ||
                          "Negative impact of Mobile phone"}
                      </h2>

                      <p className="text-base md:text-lg mb-6 text-white/90 leading-relaxed">
                        {filteredPodcast[currentPodcastIndex]?.description ||
                          "Podcast Negative Impact of Mobile Phones takes a closer look at the consequences of our constant connection to the digital world."}
                      </p>
                      <div className="flex items-center mb-3">
                        <span className="text-md font-medium text-italic tracking-wider opacity-80 luckiest-guy-regular">
                          {filteredPodcast[currentPodcastIndex]?.author ||
                            "Mentoons"}
                        </span>
                      </div>

                      <div className="audio-player bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                        <audio
                          controls
                          className="w-full"
                          src={
                            filteredPodcast[currentPodcastIndex]
                              ?.audioPodcastSrc || "#"
                          }
                        >
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-6 gap-4">
                  <button
                    onClick={() => {
                      setCurrentPodcastIndex((prev) =>
                        prev > 0 ? prev - 1 : filteredPodcast.length - 1
                      );
                    }}
                    className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-all duration-200 hover:shadow-orange-200/50 hover:-translate-x-1"
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
                    className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-all duration-200 hover:shadow-orange-200/50 hover:translate-x-1"
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
        <h2 className="pb-6 text-4xl font-bold relative z-10 text-primary">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500">
            Trending Podcast
          </span>
          <span className="relative ml-2">
            For You!
            <svg
              className="absolute -bottom-2 left-0 w-full"
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
        <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-orange-200 opacity-70 blur-xl"></div>
        <div className="absolute top-40 right-20 w-16 h-16 rounded-full bg-pink-200 opacity-70 blur-xl"></div>

        <div
          className="flex overflow-x-auto gap-6 scroll-smooth p-16  -mx-2 snap-x  "
          ref={carouselRef}
          style={{ scrollbarWidth: "none" }} /* Hide scrollbar for Firefox */
        >
          {PODCAST_DETAILS.map((podcast) => {
            const isPlaying = playingPodcastId === String(podcast.id);
            return (
              <div
                key={podcast.id}
                className={`p-4 rounded-2xl group transition-all duration-300 min-w-[380px] max-w-[280px] snap-start
                  transform hover:-translate-y-2 hover:shadow-2xl ${
                    isPlaying
                      ? "bg-gradient-to-br from-orange-400 to-pink-500 shadow-xl shadow-orange-200/50"
                      : "bg-white hover:bg-orange-50 shadow-lg border border-gray-100"
                  }`}
              >
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img
                    src={
                      podcast.thumbnail ||
                      "/assets/podcastv2/default-podcast.png"
                    }
                    alt={podcast.topic}
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
                      if (playingPodcastId === String(podcast.id)) {
                        setPlayingPodcastId(null);
                      } else {
                        // Otherwise stop the current one (if any) and play this one
                        setPlayingPodcastId(String(podcast.id));
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
                          className="w-1 h-7 bg-orange-500 rounded-full animate-pulse"
                          style={{ animationDelay: "0.2s" }}
                        ></span>
                        <span
                          className="w-1 h-4 bg-orange-500 rounded-full animate-pulse"
                          style={{ animationDelay: "0.4s" }}
                        ></span>
                      </div>
                    ) : (
                      <IoPlay className="text-white text-2xl ml-1" />
                    )}
                  </button>

                  {/* Audio player (hidden) */}
                  {isPlaying && (
                    <audio
                      src={podcast.audioPodcastSrc}
                      autoPlay
                      onEnded={() => setPlayingPodcastId(null)}
                    />
                  )}

                  {/* Category badge */}
                  <div className="absolute top-3 left-3 bg-white/80 capitalize backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                    {podcast.category}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3
                    className={`text-lg font-bold line-clamp-2 ${
                      isPlaying ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {podcast.topic}
                  </h3>

                  <div
                    className={`flex items-center gap-2 ${
                      isPlaying ? "text-white/90" : "text-gray-500"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-orange-200 flex items-center justify-center overflow-hidden">
                      <span className="text-xs font-bold text-orange-500">
                        {podcast.author?.charAt(0)}
                      </span>
                    </div>
                    <p className="text-xs">{podcast.author}</p>
                    {podcast.duration && (
                      <p className="text-xs flex items-center">
                        <span className="w-1 h-1 bg-current rounded-full mx-1"></span>
                        {podcast.duration}
                      </p>
                    )}
                  </div>

                  {isPlaying && (
                    <div className="pt-2 flex gap-1 justify-center">
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
          className="absolute left-0 top-1/2 p-3 rounded-full shadow-xl transition-all duration-300 
            -translate-y-1/2 bg-white hover:bg-orange-100 hover:scale-110 hover:-translate-x-1"
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
          className="absolute right-0 top-1/2 p-3 rounded-full shadow-xl transition-all duration-300 
            -translate-y-1/2 bg-white hover:bg-orange-100 hover:scale-110 hover:translate-x-1"
          style={{ display: isAtEnd ? "none" : "block" }}
          aria-label="Scroll right"
        >
          <IoIosArrowForward className="text-2xl text-orange-500" />
        </button>
      </motion.div>

      {/* New Release Section */}
      <motion.div
        className="my-24 relative overflow-hidden bg-gradient-to-br from-orange-400 to-pink-500 rounded-3xl shadow-2xl"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Decorative Elements */}
        <div className="absolute -top-20 right-20 w-40 h-40 rounded-full bg-pink-200 opacity-50 blur-xl"></div>
        <div className="absolute bottom-40 left-10 w-32 h-32 rounded-full bg-orange-200 opacity-40 blur-xl"></div>
        <svg
          className="absolute top-10 left-0 text-orange-300 opacity-20 w-24 h-24"
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
          />
        </svg>
        <svg
          className="absolute bottom-10 right-10 text-pink-400 opacity-20 w-32 h-32"
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
            <div className="flex-1 p-8 md:p-12 relative z-10">
              <div className="w-full h-[350px] rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                <img
                  src={
                    filteredPodcast[0]?.thumbnail ||
                    "/assets/podcastv2/electronic-gadgets-and-kids-large.jpg"
                  }
                  alt={filteredPodcast[0]?.topic || "Podcast Thumbnail"}
                  className="object-cover object-center w-full h-full"
                />
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 text-xs font-bold bg-green-200 backdrop-blur-sm rounded-full text-green-600">
                    NEW RELEASE
                  </span>
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  </div>
                </div>

                <h3 className="text-3xl md:text-4xl font-bold mb-3 text-white drop-shadow-sm">
                  {filteredPodcast[0]?.topic || "Electronic gadgets and Kids"}
                </h3>

                <p className="text-lg text-white/90 mb-4 line-clamp-3">
                  {filteredPodcast[0]?.description ||
                    "Podcast on Electronic Gadgets and Kids examines the impact of digital devices on children's development and daily lives. Each episode explores how smartphones, tablets, and other gadgets....."}
                </p>

                <div className="flex items-center text-white/80 text-sm mb-6">
                  <span>{filteredPodcast[0]?.author || "Mentoons"}</span>
                  <span className="mx-2">•</span>
                  <span>{filteredPodcast[0]?.duration || "06 MIN"}</span>
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
                        <span className="w-1 h-4 bg-primary rounded-full animate-pulse"></span>
                        <span
                          className="w-1 h-6 bg-primary rounded-full animate-pulse"
                          style={{ animationDelay: "0.2s" }}
                        ></span>
                        <span
                          className="w-1 h-3 bg-primary rounded-full animate-pulse"
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
                    src={filteredPodcast[0]?.audioPodcastSrc || "#"}
                    autoPlay
                    onEnded={() => setPlayingPodcastId(null)}
                    className="hidden"
                  />
                )}
              </div>
            </div>
          )}

          {/* Right Side - Heading and Illustration */}
          <div className="flex-1 p-8 md:p-12 relative">
            <h2 className="text-5xl md:text-7xl font-semibold text-center luckiest-guy-regular text-black drop-shadow-lg mb-8">
              CHECK OUT OUR
              <span className="block mt-2  backdrop-blur-sm rounded-lg py-2">
                NEW RELEASE
              </span>
            </h2>

            <div className="relative flex justify-center items-center">
              <div className="absolute w-48 h-48 bg-orange-400/30 rounded-full blur-xl"></div>
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
        className="flex flex-col items-start gap-8 p-12 mb-16 text-white bg-primary md:flex-row rounded-3xl"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex-1 ">
          <p className="tracking-wide ">
            FOR THE PEOPLE WHO WANT TO BE HEARD...
          </p>
          <p className="pt-2 pb-4 font-semibold text-7xl luckiest-guy-regular">
            WANT YOUR VOICE TO BE HEARD
          </p>
          <p className="pb-8">
            If you want to create podcast on a particular topic, Join Us! Be the
            voice of change.
          </p>
          <div className="flex items-center w-full gap-4 ">
            <form className="flex flex-col w-full gap-4">
              <div className="w-full md:pr-36">
                <textarea
                  name="message"
                  id="message"
                  placeholder="Write here"
                  onChange={(e) => handleMessageChange(e)}
                  className="p-4 rounded-xl text-black w-full min-h-[200px] shadow-lg"
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
        <div className="flex-1 ">
          <img
            src="/assets/podcastv2/podcast-host.png"
            alt="Podcast host illustration"
            className="w-full"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Podcastv2;
