import { useNavigate } from "react-router-dom";
import {
  FaMobileAlt,
  FaUsers,
  FaHeart,
  FaUserFriends,
  FaBrain,
  FaExclamationCircle,
  FaBook,
  FaSmile,
  FaHandsHelping,
  FaBalanceScale,
  FaComments,
  FaShieldAlt,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import LandingBanner from "@/components/adda/landing/landingHero/banner";

const colors = [
  "#F97316", // orange
  "#6366F1", // indigo
  "#10B981", // green
  "#06B6D4", // cyan
  "#c00d0dec",
  "#dfe61aec",
];

const items = [
  {
    title: "Workshops 6-12",
    url: "/mentoons-workshops?category=Instant%20Katha",
  },
  {
    title: "Workshops 13-19",
    url: "/mentoons-workshops?category=Instant%20Katha",
  },
  { title: "Products 6-12", url: "/products?category=6-12" },
  { title: "Products 13-16", url: "/products?category=13-16" },
  { title: "Products 17-19", url: "/products?category=17-19" },
  { title: "Products 20+", url: "/products?category=20%2B" },
  { title: "Audio Comics", url: "/mentoons-comics?option=audio+comic" },
  { title: "E-Comics", url: "/mentoons-comics?option=comic" },
  { title: "Blogs", url: "/" },
];

const issues = [
  {
    title: "Academic Distraction",
    text: "Lack of focus on studies due to excessive usage of gadgets and social media.",
    icon: <FaMobileAlt />,
    iconColor: "#6366F1",
  },
  {
    title: "Social Balance",
    text: "Difficulty balancing social media with real-life interactions.",
    icon: <FaUsers />,
    iconColor: "#14B8A6",
  },
  {
    title: "Family Bonding",
    text: "Decreased family bonding and limited quality family time.",
    icon: <FaHeart />,
    iconColor: "#EC4899",
  },
  {
    title: "Friendship Challenges",
    text: "Depending on online friends rather than building real friendships.",
    icon: <FaUserFriends />,
    iconColor: "#F59E0B",
  },
  {
    title: "Emotional Disconnect",
    text: "Reduced emotional interaction between parents and children.",
    icon: <FaBrain />,
    iconColor: "#8B5CF6",
  },
  {
    title: "Digital Addiction",
    text: "Dependence on gadgets and social media causing addictive behaviour.",
    icon: <FaExclamationCircle />,
    iconColor: "#06B6D4",
  },
];

const achievements = [
  {
    title: "Balanced Lifestyle",
    text: "Well balanced kids who excel both culturally and digitally.",
    icon: <FaBalanceScale />,
    color: "#6366F1",
  },
  {
    title: "Better Academic Focus",
    text: "Kids with higher IQ and improved study focus.",
    icon: <FaBook />,
    color: "#10B981",
  },
  {
    title: "Real Friendships",
    text: "Strong friendships and respectful behaviour towards parents.",
    icon: <FaUserFriends />,
    color: "#3B82F6",
  },
  {
    title: "Emotional Intelligence",
    text: "Mindful kids with gratitude and emotional bonding.",
    icon: <FaSmile />,
    color: "#EC4899",
  },
  {
    title: "Reduced Gadget Dependency",
    text: "Less dependence on gadgets and social media.",
    icon: <FaMobileAlt />,
    color: "#F59E0B",
  },
  {
    title: "Open Communication",
    text: "Better parent-child interaction and openness.",
    icon: <FaComments />,
    color: "#8B5CF6",
  },
];

const results = [
  {
    title: "Safe Kids",
    text: "Protection from online predators and unsafe digital environments.",
    icon: <FaShieldAlt />,
    color: "#22C55E",
  },
  {
    title: "Digital De-Addiction",
    text: "Support to overcome gaming, gambling and social media addiction.",
    icon: <FaMobileAlt />,
    color: "#F97316",
  },
  {
    title: "Better Study Focus",
    text: "Improved academic focus with early goal setting.",
    icon: <FaBook />,
    color: "#6366F1",
  },
];

const NewLandingPage = () => {
  const navigate = useNavigate();
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <LandingBanner />
      <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 px-6 md:px-20 lg:px-28 py-16 space-y-24">
        {/* HERO SECTION */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div className="flex flex-wrap gap-6 ">
              {items.map((item, ind) => (
                <div
                  key={ind}
                  onClick={() => navigate(item.url)}
                  className="px-6 py-3 rounded-xl border border-orange-200 
                bg-white shadow-sm text-lg font-semibold cursor-pointer
                transition-all duration-300
                hover:bg-orange-500 hover:text-white hover:scale-105 hover:shadow-lg"
                >
                  {item.title}
                </div>
              ))}
            </div>

            <div className="space-y-6 max-w-2xl">
              <h2 className="text-4xl lg:text-6xl font-bold leading-tight text-gray-900">
                <span style={{ color: colors[colorIndex] }}>Mentoring</span>{" "}
                Through{" "}
                <span style={{ color: colors[colorIndex] }}>Cartoons</span>
              </h2>

              <p className="text-xl text-gray-600">
                Discover how our services help families create a healthy balance
                between gadgets, social media and real-life relationships.
              </p>

              <p className="text-xl font-medium text-gray-700">
                ➜ All products are developed by psychologists
              </p>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
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

        <div className="space-y-12">
          <h2 className="text-4xl font-bold text-center text-gray-800">
            Are you struggling with the following issues?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {issues.map((issue, ind) => (
              <div
                key={ind}
                className="group bg-white p-6 rounded-2xl shadow-md border border-gray-200
              hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 hover:bg-[#e8eeee]"
              >
                <div
                  className="w-14 h-14 flex items-center justify-center rounded-xl mb-4 text-2xl"
                  style={{
                    color: issue.iconColor,
                    backgroundColor: `${issue.iconColor}20`,
                  }}
                >
                  {issue.icon}
                </div>

                <h3 className="text-2xl font-semibold text-gray-800 mb-2 ">
                  {issue.title}
                </h3>

                <p className="text-lg font-medium text-gray-600">
                  {issue.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold text-orange-500">
            If you're facing these challenges, don't worry!
          </h2>

          <h3 className="text-2xl font-semibold text-gray-700">
            We understand and we're here to help.
          </h3>
        </div>

        {/* ACHIEVEMENTS */}

        <div className="space-y-12">
          <h2 className="text-4xl font-bold text-center text-gray-800">
            By choosing Mentoons as your guide you can achieve the following
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((item, ind) => (
              <div
                key={ind}
                className="group bg-white p-6 rounded-2xl shadow-md border border-gray-100
              hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 hover:bg-[#e8eeee]"
              >
                <div
                  className="w-14 h-14 flex items-center justify-center rounded-xl mb-4 text-2xl"
                  style={{
                    color: item.color,
                    backgroundColor: `${item.color}20`,
                  }}
                >
                  {item.icon}
                </div>

                <h3 className="text-2xl font-semibold text-gray-800 mb-2 ">
                  {item.title}
                </h3>

                <p className="text-lg font-medium text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PARENTS SECTION */}

        {/* PARENTS SECTION */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-teal-50 border border-gray-200 shadow-xl px-10 py-16">
          {/* background decoration */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-200 rounded-full blur-3xl opacity-20"></div>

          <div className="relative grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT SIDE */}

            <div className="space-y-8">
              <h2 className="text-5xl font-bold text-gray-900">
                PARENTS <span className="text-indigo-600">!</span>
              </h2>

              <p className="text-xl text-gray-700 leading-relaxed max-w-xl">
                Begin your journey with us today and unlock the true potential
                of your child.
              </p>

              <div className="space-y-6">
                <div className="flex gap-5 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 text-xl">
                    <FaHandsHelping />
                  </div>
                  <p className="text-gray-600 text-lg">
                    As parents ourselves, we understand the challenges you face
                    in today's digital age. We have experienced the same
                    struggles and have successfully guidede numerous families
                    towards a balanced & fulfilling life.
                  </p>
                </div>

                <div className="flex gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-pink-100 text-pink-500 text-xl">
                    <FaHeart />
                  </div>
                  <p className="text-gray-600 text-lg">
                    You can trust us to provede the guidance and support you
                    need to overcome thesse challenges
                  </p>
                </div>

                <div className="flex gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-teal-100 text-teal-600 text-xl">
                    <FaUsers />
                  </div>
                  <p className="text-gray-600 text-lg">
                    Our team & psychologists are dedicated to helping you and
                    your child succeed.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/mentoons-workshops")}
                className="mt-6 px-10 py-4 rounded-xl bg-indigo-600 text-white text-lg font-semibold
        hover:bg-indigo-700 transition-all shadow-md hover:shadow-xl"
              >
                Start Your Journey →
              </button>
            </div>

            {/* RIGHT SIDE IMAGE */}

            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-6 bg-indigo-200 blur-3xl opacity-30 rounded-full"></div>

                <img
                  src="https://mentoons-products.s3.ap-northeast-1.amazonaws.com/1234/team+Illustration+3.png"
                  alt="Parents guidance"
                  className="relative w-[420px] drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS SECTION */}

        <div className="space-y-14">
          <h2 className="text-4xl font-bold text-center text-gray-900">
            The Results You Will See
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {results.map((item, ind) => (
              <div
                key={ind}
                className="relative group rounded-3xl p-[2px] bg-gradient-to-br from-orange-400 via-pink-400 to-indigo-400
        hover:scale-105 transition-all duration-300"
              >
                <div className="bg-white rounded-3xl p-8 h-full shadow-lg group-hover:shadow-2xl transition">
                  <div
                    className="w-16 h-16 flex items-center justify-center rounded-2xl text-2xl mb-6"
                    style={{
                      color: item.color,
                      backgroundColor: `${item.color}20`,
                    }}
                  >
                    {item.icon}
                  </div>

                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                    {item.title}
                  </h3>

                  <p className=" text-gray-600 text-lg leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewLandingPage;
