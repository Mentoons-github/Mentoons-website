import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LandingBanner from "@/components/adda/landing/landingHero/banner";
import { FaChevronDown } from "react-icons/fa6";
import {
  LandingAchievements,
  LandingColors,
  LandingCommunities,
  LandingIssues,
  LandingItems,
  LandingParentPoints,
  LandingResults,
} from "@/constant/adda/Landing/landingItems";
import { ExternalLink } from "lucide-react";

const NewLandingPage = () => {
  const navigate = useNavigate();
  const [colorIndex, setColorIndex] = useState(0);
  const [openIssue, setOpenIssue] = useState<null | number>(null);
  const [openAchievement, setOpenAchievement] = useState<null | number>(null);
  const [openParent, setOpenParent] = useState<null | number>(null);
  const [openResults, setOpenResults] = useState<null | number>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % LandingColors.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <LandingBanner />
      <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 px-4 md:px-12 lg:px-28 pb-8 lg:py-16 space-y-10 md:space-y-14">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 flex flex-col-reverse lg:flex-col">
            <div className="flex flex-wrap gap-3 md:gap-6 mt-5 lg:mt-0">
              {LandingItems.map((item, ind) => (
                <div
                  key={ind}
                  onClick={() => navigate(item.url)}
                  className="px-3 md:px-6 py-2 md:py-3 rounded-xl border border-orange-200 
                bg-white shadow-sm md:text-lg font-semibold cursor-pointer
                transition-all duration-300
                hover:bg-orange-500 hover:text-white hover:scale-105 hover:shadow-lg"
                >
                  {item.title}
                </div>
              ))}
            </div>

            <div className="space-y-6 max-w-2xl">
              <h2 className="text-3xl lg:text-6xl font-bold leading-tight text-gray-900">
                <span style={{ color: LandingColors[colorIndex] }}>
                  Mentoring
                </span>{" "}
                Through{" "}
                <span style={{ color: LandingColors[colorIndex] }}>
                  Cartoons
                </span>
              </h2>

              <p className="text-xl text-gray-600">
                Discover how our services help families create a healthy balance
                between gadgets, social media and real-life relationships.
              </p>

              <div className="w-full flex justify-between">
                <img
                  src="/assets/home/psychologist-developed.png"
                  alt=""
                  className="h-40 md:h-60 lg:h-40"
                />
                <img
                  src="/assets/home/landing-mobile.png"
                  alt=""
                  className="h-40 md:h-60 lg:h-40 block"
                />
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 bg-orange-200 blur-2xl opacity-40 rounded-full"></div>

              <img
                src="https://mentoons-products.s3.ap-northeast-1.amazonaws.com/1234/team+Illustration+3.png"
                alt="Mentoon Team"
                className="relative w-full max-w-lg drop-shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* ISSUES SECTION */}
        <div className="space-y-8 md:space-y-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
            Are you struggling with the following issues?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8 items-start self-start">
            {LandingIssues.map((issue, ind) => {
              const isOpen = openIssue === ind;

              return (
                <div
                  key={ind}
                  onClick={() => setOpenIssue(isOpen ? null : ind)}
                  className="cursor-pointer bg-white p-4 lg:p-6 rounded-2xl shadow-md border border-gray-200
        hover:shadow-xl transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 flex items-center justify-center rounded-xl text-2xl"
                        style={{
                          color: issue.iconColor,
                          backgroundColor: `${issue.iconColor}20`,
                        }}
                      >
                        {issue.icon}
                      </div>

                      <h3 className="text-xl font-semibold text-gray-800">
                        {issue.title}
                      </h3>
                    </div>

                    <FaChevronDown
                      className={`transition-transform duration-300 text-gray-500 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-40 mt-4 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-lg font-medium text-gray-600">
                      {issue.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION BREAK */}
        <div className="relative py-10 lg:py-20">
          {/* divider line */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-40 h-[2px] bg-gradient-to-r from-orange-400 via-pink-400 to-indigo-400 rounded-full"></div>

          <div className="max-w-3xl mx-auto md:text-center space-y-6 md:px-6">
            <h2 className="text-3xl md:text-4xl text-center font-bold text-gray-800 leading-snug">
              If you're facing these challenges,
              <span className="block text-orange-500 mt-2">don't worry!</span>
            </h2>

            <p className="text-xl text-gray-600 leading-relaxed">
              We understand what families go through in today's digital world.
              That's why our programs help children develop emotional balance,
              creativity and meaningful real-world relationships.
            </p>

            <button
              onClick={() => navigate("/mentoons-workshops")}
              className="mt-4 px-10 py-4 rounded-xl bg-orange-500 text-white font-semibold text-lg shadow-md hover:bg-orange-600 transition"
            >
              Discover How →
            </button>
          </div>

          {/* bottom divider */}
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-40 h-[2px] bg-gradient-to-r from-orange-400 via-pink-400 to-indigo-400 rounded-full"></div>
        </div>

        {/* ACHIEVEMENTS */}
        <div className="space-y-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
            By choosing Mentoons as your guide you can achieve the following
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8 items-start self-start">
            {LandingAchievements.map((item, ind) => {
              const isOpen = openAchievement === ind;
              return (
                <div
                  key={ind}
                  onClick={() => setOpenAchievement(isOpen ? null : ind)}
                  className="group bg-white p-4 lg:p-6 rounded-2xl shadow-md border border-gray-100
              hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 hover:bg-[#e8eeee]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 flex items-center justify-center rounded-xl text-2xl"
                        style={{
                          color: item.color,
                          backgroundColor: `${item.color}20`,
                        }}
                      >
                        {item.icon}
                      </div>

                      <h3 className="text-xl font-semibold text-gray-800">
                        {item.title}
                      </h3>
                    </div>

                    <FaChevronDown
                      className={`transition-transform duration-300 text-gray-500 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-40 mt-4 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-lg font-medium text-gray-600">
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PARENTS SECTION */}
        <div className="relative overflow-hidden rounded-3xl py-5 lg:py-16">
          <div className="relative grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-5 md:space-y-8 bg-white shadow-md border border-gray-100 p-5 lg:p-8 rounded-3xl">
              <h2 className="text-5xl font-bold text-gray-700">PARENTS!</h2>

              <div className="space-y-1">
                <p className="text-xl text-gray-500 leading-relaxed max-w-xl">
                  Begin your journey with us today and unlock the true potential
                  of your child.
                </p>

                <button
                  className="inline-flex items-center gap-2 text-blue-700 font-medium cursor-pointer group w-fit"
                  onClick={() => navigate("/messag-from-founder")}
                >
                  <span className="relative">
                    Message from the founder
                    <span className="absolute left-0 -bottom-0.5 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </span>

                  <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>

              <div className="space-y-4">
                {LandingParentPoints.map((item, ind) => {
                  const isOpen = openParent === ind;

                  return (
                    <div
                      key={ind}
                      onClick={() => setOpenParent(isOpen ? null : ind)}
                      className="cursor-pointer bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
                    >
                      {/* header */}
                      <div className="flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                          <div
                            className={`w-12 h-12 flex items-center justify-center rounded-xl text-xl ${item.color}`}
                          >
                            {item.icon}
                          </div>

                          <p className="text-lg font-semibold text-gray-800">
                            {item.title}
                          </p>
                        </div>

                        <FaChevronDown
                          className={`transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {/* animated text */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen
                            ? "max-h-40 mt-4 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="text-gray-600 text-lg">{item.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => navigate("/")}
                className="mt-6 px-10 py-4 rounded-xl bg-orange-500 text-white text-lg font-semibold hover:bg-orange-600 transition-all shadow-md"
              >
                Start Your Journey →
              </button>
            </div>

            <div className="space-y-8 shadow-md border border-gray-100 bg-white p-5 lg:p-8 rounded-3xl">
              <h2 className="text-4xl font-bold text-gray-700">
                Join Our Community
              </h2>

              <p className="text-gray-500 text-lg">
                Be part of a growing family focused on learning, creativity and
                emotional well-being.
              </p>

              <div className="grid grid-cols-2 gap-4 md:gap-5">
                {LandingCommunities.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 md:gap-4 bg-white p-3 md:p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl text-xl ${item.color}`}
                    >
                      {item.icon}
                    </div>

                    <p className="text-lg font-semibold text-gray-700">
                      {item.name}
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/community")}
                className="mt-6 px-10 py-4 rounded-xl bg-orange-500 text-white text-lg font-semibold hover:bg-orange-600 transition-all shadow-md"
              >
                Join Now →
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS SECTION */}
        <div className="space-y-10 lg:space-y-16">
          <h2 className="text-4xl font-bold text-center text-gray-900">
            The Results You Will See
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8 items-start">
            {LandingResults.map((item, ind) => {
              const isOpen = openResults === ind;

              return (
                <div
                  key={ind}
                  onClick={() => setOpenResults(isOpen ? null : ind)}
                  className="cursor-pointer relative group rounded-3xl p-[2px] bg-gradient-to-br
          from-orange-400 via-pink-400 to-indigo-400 transition-all duration-300
          hover:scale-[1.03]"
                >
                  <div className="bg-white rounded-3xl p-4 lg:p-7 shadow-lg group-hover:shadow-2xl transition">
                    {/* HEADER */}
                    <div className="flex items-center justify-between lg:mb-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-14 h-14 flex items-center justify-center rounded-xl text-2xl"
                          style={{
                            color: item.color,
                            backgroundColor: `${item.color}20`,
                          }}
                        >
                          {item.icon}
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800">
                          {item.title}
                        </h3>
                      </div>

                      {/* Arrow */}
                      <FaChevronDown
                        className={`text-gray-500 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    {/* EXPANDABLE TEXT */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen
                          ? "max-h-40 opacity-100 mt-2"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewLandingPage;
