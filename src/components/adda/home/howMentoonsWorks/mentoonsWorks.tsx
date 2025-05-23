import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import useInView from "@/hooks/useInView";

const videos = [
  {
    id: 1,
    src: "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/how_Mentoons_Works/Sarah%2C+35+Years%2C+Elementary+School+Teacher.mp4",
    thumbnail:
      "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/how_Mentoons_Works/thumbnails/how+mentoons+works+4.jpg",
    title: "Sarah's Assessment Approach",
    description:
      "Watch Sarah, an elementary school educator, share how Mentoons helped her develop more effective assessment methods and track student growth through creative storytelling.",
  },
  {
    id: 2,
    src: "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/how_Mentoons_Works/Raj%2C+42+Years%2C+IT+Manager%2C+Podcast+%26+Convo+Ca.mp4",
    thumbnail:
      "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/how_Mentoons_Works/thumbnails/how+mentoons+works+1.jpg",
    title: "Raj's Journey with Mentoons",
    description:
      "Meet Raj, a 42-year-old IT Manager who discovered how Mentoons transformed his approach to conversations and podcasting, enhancing his communication skills both at work and home.",
  },
  {
    id: 3,
    src: "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/how_Mentoons_Works/Olivia%2C+28+Years%2C+Psychologist.mp4",
    thumbnail:
      "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/how_Mentoons_Works/thumbnails/Untitled_Artwork+47.png",
    title: "Olivia's Professional Growth",
    description:
      "Discover how Olivia, a 28-year-old psychologist, uses Mentoons to enhance her practice and connect better with clients through innovative storytelling techniques.",
  },
  {
    id: 4,
    src: "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/how_Mentoons_Works/Samantha%2C+35+Years%2C+Elementary+School+Teacher.mp4",
    thumbnail:
      "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/how_Mentoons_Works/thumbnails/how+mentoons+works+3.jpg",
    title: "Samantha's Teaching Transformation",
    description:
      "See how Samantha, a 35-year-old elementary school teacher, revolutionized her classroom dynamics using Mentoons to foster better family conversations and student engagement.",
  },
  {
    id: 5,
    src: "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/how_Mentoons_Works/Rajesh+K+42+Years+old+IT+Manager.mp4",
    thumbnail:
      "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/how_Mentoons_Works/thumbnails/how+mentoons+works+5.jpg",
    title: "Rajesh's Success Story",
    description:
      "Learn how Rajesh, an experienced IT Manager, leveraged Mentoons' comics and stories to improve team communication and leadership effectiveness in his organization.",
  },
];

const HowMentoonsWork = () => {
  const isMobile = window.innerWidth < 768;
  const { ref: sectionRef, isInView } = useInView(isMobile ? 0.1 : 0.3, false);
  const navigate = useNavigate();
  const location = useLocation();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean[]>(
    Array(videos.length).fill(false)
  );
  const [isHovered, setIsHovered] = useState<boolean[]>(
    Array(videos.length).fill(false)
  );

  const scrollToSubscription = () => {
    document
      .getElementById("subscription")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBrowsePlansClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (location.pathname !== "/mentoons") {
      navigate("/mentoons");
      setTimeout(scrollToSubscription, 500);
    } else {
      scrollToSubscription();
    }
  };

  const handlePlayClick = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      videoRefs.current.forEach((otherVideo, otherIndex) => {
        if (otherIndex !== index && otherVideo && isPlaying[otherIndex]) {
          otherVideo.pause();
        }
      });
      video.play().catch((error: unknown) => {
        console.error(`Failed to play video: ${(error as Error).message}`);
      });
      setIsPlaying(() => {
        const newState = Array(videos.length).fill(false);
        newState[index] = true;
        return newState;
      });
    }
  };

  const handlePauseClick = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
      setIsPlaying((prev) => {
        const newState = [...prev];
        newState[index] = false;
        return newState;
      });
    }
  };

  const handleFullscreenClick = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen().catch((error: unknown) => {
          console.error(
            `Failed to enter fullscreen: ${(error as Error).message}`
          );
        });
      }
    }
  };

  const handleMouseEnter = (index: number) => {
    setIsHovered((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  const handleMouseLeave = (index: number) => {
    setIsHovered((prev) => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
  };

  const handleTouchStart = (index: number) => {
    setIsHovered((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
    setTimeout(() => {
      setIsHovered((prev) => {
        const newState = [...prev];
        newState[index] = false;
        return newState;
      });
    }, 3000);
  };

  const videoVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, delay: index * 0.2, ease: "easeOut" },
    }),
  };

  const headingVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.4 } },
  };

  return (
    <section
      ref={sectionRef}
      className="relative p-6 md:p-12 flex flex-col items-center bg-white min-h-screen"
    >
      <motion.div
        className="absolute top-0 left-0 w-64 h-64 bg-[#FFF1B3] rounded-full z-0 opacity-50"
        animate={{ y: [0, 10, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-80 h-80 bg-[#FFD89C] rounded-full z-0 opacity-50"
        animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.h1
        variants={headingVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="text-3xl md:text-4xl lg:text-5xl z-10 font-semibold text-gray-800 mb-10 text-center font-inter"
      >
        How Mentoons Work
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full z-10 px-4">
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            custom={index}
            variants={videoVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex flex-col items-center bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            onTouchStart={() => handleTouchStart(index)}
          >
            <div className="relative w-full h-56">
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={video.src}
                poster={video.thumbnail}
                controls
                className="w-full h-full object-cover"
                aria-label={`Video: ${video.title}`}
                aria-describedby={`video-desc-${video.id}`}
                playsInline
                preload="metadata"
                onError={() =>
                  console.error(`Failed to load video: ${video.src}`)
                }
                onPlay={() =>
                  setIsPlaying(() => {
                    const newState = Array(videos.length).fill(false);
                    newState[index] = true;
                    return newState;
                  })
                }
                onPause={() =>
                  setIsPlaying((prev) => {
                    const newState = [...prev];
                    newState[index] = false;
                    return newState;
                  })
                }
              >
                <source src={video.src} type="video/mp4" />
                {video.src.includes(".mp4") && (
                  <source
                    src={video.src.replace(".mp4", ".webm")}
                    type="video/webm"
                  />
                )}
                <p>Your browser does not support this video format.</p>
              </video>
              {isHovered[index] && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.2 } }}
                >
                  <div className="flex space-x-4">
                    {isPlaying[index] ? (
                      <button
                        onClick={() => handlePauseClick(index)}
                        className="w-12 h-12 text-gray-900 bg-white bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-white rounded-full hover:scale-110 transition-transform"
                        aria-label={`Pause video: ${video.title}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-12 h-12"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 9v6m4-6v6"
                          />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePlayClick(index)}
                        className="w-12 h-12 text-gray-900 bg-white bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-white rounded-full hover:scale-110 transition-transform"
                        aria-label={`Play video: ${video.title}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-12 h-12"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-6.586-3.793A1 1 0 007 8.293v7.414a1 1 0 001.166.918l6.586-3.793a1 1 0 000-1.836z"
                          />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => handleFullscreenClick(index)}
                      className="w-12 h-12 text-gray-900 bg-white bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-white rounded-full hover:scale-110 transition-transform"
                      aria-label={`Enter fullscreen for video: ${video.title}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-12 h-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 7h5m0 0v5m0-5l-7 7M9 17H4m0 0v-5m0 5l7-7"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
            <div className="p-5 text-center">
              <h2 className="text-xl font-semibold text-gray-800 font-inter mb-2">
                {video.title}
              </h2>
              <p
                id={`video-desc-${video.id}`}
                className="text-gray-600 font-inter text-sm"
              >
                {video.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={buttonVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="mt-12 z-10"
      >
        <button
          onClick={handleBrowsePlansClick}
          className="inline-flex items-center px-6 py-3 bg-gray-500 text-white font-semibold rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
          aria-label="Back to membership plans"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back to Membership</span>
        </button>
      </motion.div>
    </section>
  );
};

export default HowMentoonsWork;
