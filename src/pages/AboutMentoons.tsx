import Team from "@/components/comics/Team";
import React, { Suspense, useEffect, useState } from "react";
import "../components/videoModal/";

const AboutMentoons = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (window.location.hash === "#fun-section") {
      setTimeout(() => {
        const element = document.getElementById("fun-section");
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  const toggleIntroPlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPaused(false);
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPaused(true);
      }
    }
  };

  const mentorVideos = [
    {
      title: "Sarah",
      thumbnail: "/assets/images/persona-2.jpg",
      src: "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/Flat+Image+Stories+for+Mentoons/Sarah%2C+35+Years%2C+Elementary+School+Teacher(1).mp4",
      description:
        "Discover how Sarah inspires young minds as an elementary school teacher.",
    },
    {
      title: "Raj",
      thumbnail: "/assets/images/persona-1.jpg",
      src: "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/Flat+Image+Stories+for+Mentoons/Raj%2C+42+Years%2C+IT+Manager%2C+Podcast+%26+Convo+Ca.mp4",
      description:
        "Raj shares his journey of mentorship and fostering innovation in IT.",
    },
    {
      title: "Emma",
      thumbnail: "/assets/images/persona-3.jpg",
      src: "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/Flat+Image+Stories+for+Mentoons/Emma%2C+28+Years%2C+Psychologist.mp4",
      description:
        "Emma reveals her creative approach to empowering mental well-being.",
    },
    {
      title: "Samantha",
      thumbnail: "/assets/images/persona-6.jpg",
      src: "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/Flat+Image+Stories+for+Mentoons/Samantha%2C+35+Years%2C+Elementary+School+Teacher(1).mp4",
      description:
        "Explore Samantha's impactful teaching methods in elementary education.",
    },
    {
      title: "Rajesh",
      thumbnail: "/assets/images/persona-4.jpg",
      src: "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/Flat+Image+Stories+for+Mentoons/Rajesh+K+42+Years+old+(IT+Manager).mp4",
      description:
        "Rajesh discusses how mentorship drives success in the IT world.",
    },
    {
      title: "Olivia",
      thumbnail: "/assets/images/persona-5.jpg",
      src: "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/Flat+Image+Stories+for+Mentoons/Olivia%2C+28+Years%2C+Psychologist(1).mp4",
      description:
        "Olivia shares her passion for helping others through psychology.",
    },
  ];

  const newMentorVideos = [
    {
      title: "Kumar Archit",
      thumbnail: "/assets/images/persona-1.jpg",
      src: "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/Mentors/KUMAR_SIR.mp4",
      description:
        "Exploring the transformative power of mentorship and personal growth.",
    },
    {
      title: "Nithya Raghunath",
      thumbnail: "/assets/images/persona-2.jpg",
      src: "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/Mentors/NITHYA+MA'AM.mp4",
      description:
        "Building meaningful connections and inspiring potential in others.",
    },
  ];

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <img
          src="/assets/images/about-mentoons-hero.png"
          alt=""
          className="w-full object-cover"
        />

        <div className="absolute -bottom-5 md:-bottom-16 left-1/2 transform -translate-x-1/2">
          <img
            src={`/assets/images/${isPaused ? "play.png" : "pause.png"}`}
            alt="Play Button"
            className="w-12 md:w-32 hover:scale-110 transition-all duration-300"
            onClick={toggleIntroPlayPause}
          />

          <audio
            ref={audioRef}
            typeof=".mp3"
            src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Others/about-mentoons.mp3"
          ></audio>
        </div>
      </div>

      <div>
        <img
          src="/assets/images/about-mentoons-mission.png"
          alt="Mentoons mission section"
          className="w-full object-cover"
        />
      </div>

      {/* New Mentors Section */}
      <section className="bg-[#B0E0E6]">
        <div className="py-12 px-2 md:py-16 text-center text-2xl md:text-4xl font-semibold relative">
          <h2 className="pb-8 relative z-20">Meet Our Mentors</h2>
          <p className="text-blue-700 text-3xl md:text-5xl">
            Inspiring Journeys of Guidance
          </p>
          <div className="absolute top-10 right-5 z-2 md:right-[30%]">
            <img
              src="/assets/images/persona-family.png"
              alt=""
              className="w-36 md:w-52"
            />
          </div>
        </div>

        <div className="relative">
          <div className="p-4">
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 items-center gap-4 mx-auto relative z-20 w-[80%]">
                {newMentorVideos.map((video) => (
                  <div
                    key={video.title}
                    className="group relative cursor-pointer rounded-lg"
                    onClick={() => setSelectedVideo(video.src)}
                  >
                    <div className="image-wrapper relative rounded-2xl">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-auto transition-transform duration-300 group-hover:scale-105 rounded-2xl"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl">
                        <div className="bg-white p-2 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-12 h-12 text-blue-500"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.3A1.125 1.125 0 0 1 9 15.183V8.817c0-.857.921-1.4 1.671-.983l5.603 3.3Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <h3 className="font-semibold">{video.title}</h3>
                      <p className="text-sm text-gray-700">
                        {video.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -top-20 left-0 z-0">
            <img
              src="/assets/images/decorative-illustration.png"
              alt=""
              className="w-52 md:w-72 rounded-lg"
            />
          </div>
        </div>
      </section>
      {/* Team Section */}
      <Suspense fallback={<div>Loading...</div>}>
        <Team />
      </Suspense>

      {/* Fun @ Mentoons Section */}
      <div>
        <div className="flex flex-col bg-mt-teal text-white py-10 space-y-7">
          <div className="py-8 space-y-7" id="fun-section">
            <div className="text-start space-y-4">
              <div className="text-5xl text-center lg:text-7xl w-full font-extrabold tracking-wide leading-[1.10]">
                Fun @mentoons
              </div>
            </div>
            <div className="flex items-center justify-between gap-20 rounded-2xl">
              <video
                src="https://mentoons-website.s3.ap-northeast-1.amazonaws.com/miscellaneous/Team+Celebration+Video+03.mp4"
                controls
                autoPlay
                muted
                loop
                playsInline
                className="w-[80%] mx-auto rounded-2xl"
              ></video>
            </div>
          </div>
        </div>
      </div>

      {/* Mentoons In Action Section */}
      <section className="bg-[#FFDB67]">
        <div className="py-12 px-2 md:py-16 text-center text-2xl md:text-4xl font-semibold relative">
          <h2 className="pb-8 relative z-20">Mentoons In Action</h2>
          <p className="text-orange-600 text-3xl md:text-5xl">
            Behind the Scene with our Guides
          </p>
          <div className="absolute top-10 right-5 z-2 md:right-[30%]">
            <img
              src="/assets/images/persona-family.png"
              alt=""
              className="w-36 md:w-52"
            />
          </div>
        </div>

        <div className="relative">
          <div className="p-4">
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-4 mx-auto relative z-20 w-[80%]">
                {mentorVideos.map((video) => (
                  <div
                    key={video.title}
                    className="group relative cursor-pointer rounded-lg"
                    onClick={() => setSelectedVideo(video.src)}
                  >
                    <div className="image-wrapper relative rounded-2xl">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-auto transition-transform duration-300 group-hover:scale-105 rounded-2xl"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl">
                        <div className="bg-white p-2 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-12 h-12 text-orange-500"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.3A1.125 1.125 0 0 1 9 15.183V8.817c0-.857.921-1.4 1.671-.983l5.603 3.3Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <h3 className="font-semibold">{video.title}</h3>
                      <p className="text-sm text-gray-600">
                        {video.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -top-20 left-0 z-0">
            <img
              src="/assets/images/decorative-illustration.png"
              alt=""
              className="w-52 md:w-72 rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
          onClick={closeVideoModal}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideoModal}
              className="absolute -top-10 right-0 text-white text-3xl hover:text-gray-300"
            >
              ×
            </button>
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutMentoons;
