import ProductDisplay from "@/components/mythos/about/ProductDisplay";
import { ABOUT_HOW_IT_WORKS, ABOUT_WHAT_WE_OFFER } from "@/constant";
import { motion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";

import Team from "@/components/comics/Team";
import { FAQ_ABOUT_US } from "@/constant/faq";
import { useNavigate } from "react-router-dom";
import FAQ from "../pages/v2/user/faq/faq";

// aboutmentoon_Audio :"https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Others/about-mentoons.mp3"
const AboutMentoons = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  // const audioRef = React.useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash === "#fun-section") {
      setTimeout(() => {
        const element = document.getElementById("fun-section");
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="w-full">
      {/* hero section */}
      <div className="relative flex flex-col items-start justify-center gap-12 p-12 md:flex-row">
        <div className="w-full md:w-[50%] flex flex-col items-center md:items-start">
          <h2 className="text-3xl font-semibold text-center md:text-4xl lg:text-6xl md:text-start">
            About <span className="text-primary">Mentoons</span>
          </h2>
          <p className="mt-4 md:mt-8 text-lg md:text-xl leading-relaxed md:leading-loose w-full md:w-[75%] font-medium text-center md:text-start">
            At Mentoons, we believe that gadgets shouldn't replace goodness.
            We're on a mission to help children and families rediscover
            balance—between digital play and real-life values.
          </p>

          <p className="mt-4 md:mt-8 text-lg md:text-xl leading-relaxed md:leading-loose w-full md:w-[75%] font-medium text-center md:text-start">
            Through engaging workshops, stories, and community-led programs, we
            empower kids to be tech-smart, emotionally resilient, and culturally
            rooted.
          </p>
        </div>

        <div className="relative w-full md:w-[410px] lg:w-[500px] xl:w-[590px] h-auto flex justify-center items-center p-6 ">
          <img
            src="/assets/home/addaTV/Rectangle 285.png"
            alt="tv"
            className="w-3/4 h-auto xl:w-full"
          />

          <div
            className="absolute mentoons-video top-1/2 left-1/2 w-[65%] lg:w-[65%] xl:w-[84%] h-[70%] bg-black -translate-x-1/2 -translate-y-1/2 rounded-t-[60px] overflow-hidden flex items-center justify-center"
            style={{ clipPath: "polygon(15% 100%, 90% 100%, 100% 0%, 0% 0%)" }}
          >
            <video
              className="w-[80%] h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source
                src={`${
                  import.meta.env.VITE_STATIC_URL
                }static/Mentoons Team Video_03.mp4`}
                type="video/mp4"
              />
            </video>
          </div>
        </div>
      </div>
      <section className="p-4 py-6 pb-24 md:p-12 lg:p-24">
        <div className="flex flex-col items-start justify-center gap-6 ">
          <div>
            <h2 className="pb-4 text-4xl font-semibold text-center md:text-start">
              How It Helps Your Kids?
            </h2>
            <p className="text-xl  md:w-[75%]  text-center md:text-start">
              Today’s children are growing up online—but growing apart from
              self-awareness, empathy, and heritage. We’re here to change that.
            </p>
          </div>

          <motion.div className="flex flex-col items-center w-full gap-4 md:flex-row md:justify-between">
            {ABOUT_HOW_IT_WORKS.map((offering, index) => (
              <motion.div
                key={offering.id}
                custom={index}
                className="flex flex-col items-center gap-4 p-4 rounded-xl w-[280px] h-[280px] justify-center"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
              >
                <img
                  src={offering.imageUrl}
                  alt={offering.title}
                  className="w-24 h-24"
                />
                <p
                  style={{ color: offering.accentColor }}
                  className="text-lg font-bold text-center"
                >
                  {offering.title}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      <section className="p-4 py-6 pb-24 md:p-12 lg:p-24 ">
        <div className="flex flex-col items-start justify-center gap-6 ">
          <div className="pb-8 ">
            <h2 className="pb-4 text-4xl font-semibold text-center md:text-start">
              What We Offer?
            </h2>
            <p className="text-xl md:w-[75%] text-center md:text-start">
              Today’s children are growing up online—but growing apart from
              self-awareness, empathy, and heritage. We’re here to change that.
            </p>
          </div>

          <motion.div className="flex flex-col items-center w-full gap-4 md:flex-row md:justify-between">
            {ABOUT_WHAT_WE_OFFER.map((offering, index) => (
              <motion.div
                key={offering.id}
                custom={index}
                className="flex flex-col items-center gap-4 p-4 rounded-xl w-[280px] h-[280px] justify-center"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
                onClick={() => navigate(offering.link)}
              >
                <img
                  src={offering.imageUrl}
                  alt={offering.title}
                  className="w-full h-full"
                />
                <p
                  style={{ color: offering.accentColor }}
                  className="text-lg font-bold text-center"
                >
                  {offering.title}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      <ProductDisplay />
      <Suspense fallback={<div>Loading...</div>}>
        <Team />
      </Suspense>
      <section className="py-12">
        <FAQ data={FAQ_ABOUT_US} />
      </section>
      {/* New Mentors Section */}
      {/*<section className="bg-[#B0E0E6]">
        <div className="relative px-2 py-12 text-2xl font-semibold text-center md:py-16 md:text-4xl">
          <h2 className="relative z-20 pb-8">Meet Our Mentors</h2>
          <p className="text-3xl text-blue-700 md:text-5xl">
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
                    className="relative rounded-lg cursor-pointer group"
                    onClick={() => setSelectedVideo(video.src)}
                  >
                    <div className="relative image-wrapper rounded-2xl">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-auto transition-transform duration-300 group-hover:scale-105 rounded-2xl"
                      />
                      <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black opacity-0 bg-opacity-30 group-hover:opacity-100 rounded-2xl">
                        <div className="p-2 bg-white rounded-full">
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

          <div className="absolute left-0 z-0 -top-20">
            <img
              src="/assets/images/decorative-illustration.png"
              alt=""
              className="rounded-lg w-52 md:w-72"
            />
          </div>
        </div>
      </section> */}
      {/* Team Section
      <Suspense fallback={<div>Loading...</div>}>
        <Team />
      </Suspense> */}
      {/* Fun @ Mentoons Section */}
      {/* <div>
        <div className="flex flex-col py-10 text-white bg-mt-teal space-y-7">
          <div className="py-8 space-y-7" id="fun-section">
            <div className="space-y-4 text-start">
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
      </div> */}
      {/* Mentoons In Action Section */}
      {/* <section className="bg-[#FFDB67]">
        <div className="relative px-2 py-12 text-2xl font-semibold text-center md:py-16 md:text-4xl">
          <h2 className="relative z-20 pb-8">Mentoons In Action</h2>
          <p className="text-3xl text-orange-600 md:text-5xl">
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
                    className="relative rounded-lg cursor-pointer group"
                    onClick={() => setSelectedVideo(video.src)}
                  >
                    <div className="relative image-wrapper rounded-2xl">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-auto transition-transform duration-300 group-hover:scale-105 rounded-2xl"
                      />
                      <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black opacity-0 bg-opacity-30 group-hover:opacity-100 rounded-2xl">
                        <div className="p-2 bg-white rounded-full">
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

          <div className="absolute left-0 z-0 -top-20">
            <img
              src="/assets/images/decorative-illustration.png"
              alt=""
              className="rounded-lg w-52 md:w-72"
            />
          </div>
        </div>
      </section> */}
      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeVideoModal}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideoModal}
              className="absolute right-0 text-3xl text-white -top-10 hover:text-gray-300"
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
