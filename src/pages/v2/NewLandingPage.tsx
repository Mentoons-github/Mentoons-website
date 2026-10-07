import { useNavigate } from "react-router-dom";
import { useEffect, useState, type CSSProperties } from "react";
import LandingBanner from "@/components/adda/landing/landingHero/banner";
import { FaChevronDown } from "react-icons/fa6";
import { FaGamepad, FaSmile, FaBook } from "react-icons/fa";
import {
  LandingAchievements,
  LandingColors,
  LandingCommunities,
  LandingIssues,
  LandingParentPoints,
} from "@/constant/adda/Landing/landingItems";
import { Baby, Users } from "lucide-react";
import { BiSolidMessage } from "react-icons/bi";
import { toast } from "sonner";
import axios from "axios";
import { User } from "@/types";
import EnquiryModal from "@/components/modals/EnquiryModal";
import { ModalMessage } from "@/utils/enum";
import ProductVideoShowCase from "@/components/Home/newVersion/productVideoShowcase";
import { getUserDetails } from "@/api";
import { useAsyncEffect } from "@/hooks/shared/useAsyncEffect";

const quickLinks = [
  { label: "Workshops", url: "/mentoons-workshops" },
  { label: "Podcasts", url: "/mentoons-podcast" },
  { label: "Comics", url: "/mentoons-comics" },
  { label: "Products", url: "/products" },
  { label: "Games", url: "/adda/game-lobby" },
  { label: "Blog", url: "/adda" },
];

const chipColors = [
  "#fb923c",
  "#4ade80",
  "#c084fc",
  "#f87171",
  "#60a5fa",
  "#fde047",
];

const LandingChildrenPoints = [
  {
    title: "Fun & Engaging Learning",
    icon: <FaGamepad />,
    color: "bg-orange-100 text-orange-600",
    text: "Comics, podcasts and games designed to make learning about emotions and real-life skills genuinely fun for kids.",
  },
  {
    title: "Emotional Growth",
    icon: <FaSmile />,
    color: "bg-yellow-100 text-yellow-600",
    text: "Age-appropriate content that helps children recognise, understand and express their feelings in healthy ways.",
  },
  {
    title: "Real-Life Skills",
    icon: <FaBook />,
    color: "bg-purple-100 text-purple-600",
    text: "Workshops and stories that build confidence, friendship skills and independence away from the screen.",
  },
];

const burstPoints = Array.from({ length: 16 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 16;
  const radius = i % 2 === 0 ? 48 : 33;
  return `${50 + radius * Math.cos(angle)},${50 + radius * Math.sin(angle)}`;
}).join(" ");

const ComicBurst = ({
  word,
  fill,
  size,
  rot,
  className,
}: {
  word: string;
  fill: string;
  size: number;
  rot: number;
  className?: string;
}) => (
  <div
    className={`pointer-events-none absolute z-10 ${className ?? ""}`}
    style={{ width: size, height: size }}
    aria-hidden="true"
  >
    <div
      className="cm-bob"
      style={{ position: "absolute", inset: 0, transform: `rotate(${rot}deg)` }}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        style={{ overflow: "visible", filter: "drop-shadow(3px 3px 0 #000)" }}
      >
        <polygon
          points={burstPoints}
          fill={fill}
          stroke="#000"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="cm-font"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: `${size * 0.26}px`,
          color: "#000",
        }}
      >
        {word}
      </span>
    </div>
  </div>
);

const ComicStar = ({
  size,
  fill,
  className,
  delay,
}: {
  size: number;
  fill: string;
  className?: string;
  delay?: number;
}) => (
  <div
    className={`pointer-events-none absolute cm-star ${className ?? ""}`}
    style={{ animationDelay: `${delay ?? 0}s` }}
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      style={{ overflow: "visible" }}
    >
      <polygon
        points="12,1 15,9 23,9 17,14 19,22 12,17 5,22 7,14 1,9 9,9"
        fill={fill}
        stroke="#000"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const NewLandingPage = () => {
  const navigate = useNavigate();
  const [colorIndex, setColorIndex] = useState(0);
  const [openIssue, setOpenIssue] = useState<null | number>(null);
  const [openAchievement, setOpenAchievement] = useState<null | number>(null);
  const [openParentPoint, setOpenParentPoint] = useState<null | number>(null);
  const [openChildPoint, setOpenChildPoint] = useState<null | number>(null);
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [enquiryEmail, setEnquiryEmail] = useState("");
  const [enquiryName, setEnquiryName] = useState("");
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % LandingColors.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".cm-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("cm-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useAsyncEffect(
    async () => {
      const response = await getUserDetails();
      if (response.status !== 200) {
        throw new Error("Failed to fetch user details");
      }
      setUser(response.data.data);
    },
    [],
    { showToast: false },
  );

  const handleDoubtSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (enquiryMessage.trim().length < 50) {
      toast.error("Message must be at least 50 characters long.");
      return;
    }

    try {
      const queryResponse = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/query`,
        {
          message: enquiryMessage,
          name: enquiryName,
          email: enquiryEmail,
          queryType: "general",
        },
      );
      if (queryResponse.status === 201) {
        setEnquiryMessage("");
        setShowEnquiryModal(true);
      }
    } catch (error: any) {
      setEnquiryMessage("");
      toast.error(error?.response?.data?.message || "Failed to submit message");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Luckiest+Guy&display=swap');

        @keyframes cm-slam {
          0%   { transform: translateY(50px) scale(0.8) rotate(-4deg); opacity: 0; }
          60%  { transform: translateY(-6px) scale(1.04) rotate(1deg); opacity: 1; }
          100% { transform: none; opacity: 1; }
        }
        @keyframes cm-bob {
          0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
          50% { transform: translateY(-8px) rotate(calc(var(--r, 0deg) + 3deg)); }
        }
        @keyframes cm-star {
          0%   { transform: scale(0.6) rotate(-14deg); opacity: 0.6; }
          50%  { transform: scale(1.25) rotate(14deg); opacity: 1; }
          100% { transform: scale(0.6) rotate(-14deg); opacity: 0.6; }
        }
        @keyframes cm-wiggle {
          0%, 100% { transform: rotate(-2deg) scale(1.06); }
          25% { transform: rotate(3deg) scale(1.08); }
          50% { transform: rotate(-4deg) scale(1.08); }
          75% { transform: rotate(2deg) scale(1.06); }
        }

        .cm-bob { animation: cm-bob 1.4s steps(4) infinite; }
        .cm-star { animation: cm-star 1.4s steps(3) infinite; }
        .cm-reveal { opacity: 0; }
        .cm-reveal.cm-in {
          opacity: 1;
          animation: cm-slam 0.5s cubic-bezier(.2,.8,.3,1) backwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .cm-reveal { opacity: 1; }
          .cm-reveal.cm-in, .cm-bob, .cm-star { animation: none; }
        }

        .cm-page {
          background-color: #fff7e6;
          background-image: radial-gradient(rgba(249,115,22,0.18) 1.5px, transparent 2px);
          background-size: 16px 16px;
        }
        .cm-font {
          font-family: 'Bangers', 'Comic Sans MS', 'Chalkboard SE', cursive !important;
          font-weight: 400 !important;
          letter-spacing: 0.05em;
        }
        .cm-chip-font {
          font-family: 'Luckiest Guy', 'Bangers', 'Comic Sans MS', cursive !important;
          font-weight: 400 !important;
          letter-spacing: 0.04em;
        }
        .cm-text {
          font-family: 'Bangers', 'Comic Sans MS', 'Chalkboard SE', cursive !important;
          font-weight: 400 !important;
          letter-spacing: 0.04em;
          line-height: 1.3;
          color: #1f2937;
        }
        .cm-title, .cm-title * {
          font-family: 'Bangers', 'Comic Sans MS', 'Chalkboard SE', cursive !important;
          font-weight: 400 !important;
        }
        .cm-title {
          line-height: 1;
          letter-spacing: 0.05em;
          color: #fff;
          -webkit-text-stroke: 3px #000;
          paint-order: stroke fill;
          text-shadow: 4px 4px 0 #000;
        }
        .cm-title-sm {
          -webkit-text-stroke: 2px #000;
          text-shadow: 3px 3px 0 #000;
        }
        .cm-narration {
          background: #fff;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          border-radius: 12px;
          padding: 10px 16px;
        }
        .cm-tag {
          background: #fde047;
          color: #000;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 8px;
          padding: 2px 12px;
          transform: rotate(-2deg) skewX(-6deg);
          display: inline-block;
        }
        .cm-card {
          background: #fff;
          border: 3px solid #000;
          box-shadow: 5px 5px 0 #000;
          border-radius: 16px;
        }
        .cm-tilt {
          transform: rotate(var(--tilt, 0deg));
          transition: transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease, background 0.2s ease;
        }
        .cm-tilt:hover {
          transform: rotate(0deg) translate(-3px, -3px) scale(1.03);
          box-shadow: 9px 9px 0 #000;
          background: #fef9c3;
        }
        .cm-lift {
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        }
        .cm-lift:hover {
          transform: translate(-2px, -2px);
          box-shadow: 7px 7px 0 #000;
          background: #fef9c3;
        }
        .cm-panel {
          background-color: #fde68a;
          background-image: radial-gradient(rgba(0,0,0,0.12) 1.6px, transparent 2px);
          background-size: 14px 14px;
          border: 4px solid #000;
          box-shadow: 8px 8px 0 #000;
          border-radius: 20px;
        }
        .cm-icon {
          border: 3px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 12px;
        }
        .cm-frame {
          border: 4px solid #000;
          box-shadow: 8px 8px 0 #000;
          border-radius: 12px;
          background: #fff;
          transform: rotate(2deg);
        }
        .cm-btn {
          background: var(--btn, #f97316);
          color: #fff;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          border-radius: 12px;
          text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
          transform: rotate(-2deg);
          transition: box-shadow 0.1s ease, filter 0.1s ease;
          cursor: pointer;
        }
        .cm-btn:hover { filter: brightness(1.08); animation: cm-wiggle 0.4s ease-in-out; }
        .cm-btn:active { box-shadow: 0 0 0 #000; transform: rotate(-2deg) translate(3px, 3px); }
        .cm-chip {
          background: #fff;
          color: #000;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 8px;
          padding: 4px 12px;
          text-transform: uppercase;
          transform: rotate(var(--rot, 0deg)) skewX(-6deg);
          transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
        }
        .cm-chip:hover {
          background: var(--c, #fde047);
          transform: rotate(0deg) skewX(-6deg) translate(-2px, -2px) scale(1.08);
          box-shadow: 5px 5px 0 #000;
        }
        .cm-bubble {
          position: relative;
          background: #fde047;
          color: #000;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          border-radius: 16px;
        }
        .cm-bubble::before,
        .cm-bubble::after {
          content: "";
          position: absolute;
          border-style: solid;
          border-color: transparent;
        }
        .cm-bubble::before {
          top: -19px;
          left: 28px;
          border-width: 0 12px 19px 12px;
          border-bottom-color: #000;
        }
        .cm-bubble::after {
          top: -12px;
          left: 31px;
          border-width: 0 9px 14px 9px;
          border-bottom-color: #fde047;
        }
        .cm-input {
          font-family: 'Bangers', 'Comic Sans MS', cursive !important;
          letter-spacing: 0.05em;
          font-size: 1.05rem;
          background: #fff;
          border: 3px solid #000 !important;
          box-shadow: 3px 3px 0 #000;
          border-radius: 10px;
          outline: none;
          transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
        }
        .cm-input:focus {
          background: #fef9c3;
          transform: translate(-1px, -1px);
          box-shadow: 5px 5px 0 #000;
        }
        .cm-row { border-bottom: 3px solid #000; }
        .cm-row:last-child { border-bottom: 0; }
      `}</style>

      <LandingBanner />
      <div className="cm-page min-h-screen px-4 md:px-12 lg:px-28 pt-10 pb-12 space-y-14 md:space-y-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 flex flex-col-reverse lg:flex-col">
            <div className="space-y-6 max-w-2xl">
              <h2 className="cm-title cm-reveal text-5xl lg:text-7xl">
                <span style={{ color: LandingColors[colorIndex] }}>
                  Mentoring
                </span>{" "}
                Through{" "}
                <span style={{ color: LandingColors[colorIndex] }}>
                  Cartoons
                </span>
              </h2>

              <p
                className="cm-narration cm-text cm-reveal text-xl md:text-2xl"
                style={{ animationDelay: "0.1s", transform: "rotate(1deg)" }}
              >
                Discover how our services help families create a healthy balance
                between gadgets, social media and real-life relationships.
              </p>

              <div className="w-full flex justify-between items-center gap-3">
                <img
                  src="/assets/home/psychologist-developed.png"
                  alt=""
                  className="h-40 md:h-60 lg:h-40 hidden sm:block drop-shadow-[4px_4px_0_#000]"
                />

                <div className="flex flex-wrap justify-center gap-3">
                  {quickLinks.map((item, ind) => (
                    <button
                      key={ind}
                      onClick={() => navigate(item.url)}
                      className="cm-chip cm-chip-font text-xs md:text-sm cm-reveal"
                      style={
                        {
                          ["--c" as string]:
                            chipColors[ind % chipColors.length],
                          ["--rot" as string]: `${ind % 2 === 0 ? -3 : 3}deg`,
                          animationDelay: `${0.15 + ind * 0.08}s`,
                        } as CSSProperties
                      }
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <img
                  src="/assets/home/landing-mobile.png"
                  alt=""
                  className="h-40 md:h-60 lg:h-40 hidden sm:block drop-shadow-[4px_4px_0_#000]"
                />
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-center lg:justify-end">
            <div className="relative cm-reveal">
              <ComicBurst
                word="FUN!"
                fill="#fde047"
                size={96}
                rot={10}
                className="-top-8 -right-6"
              />
              <ComicStar
                size={26}
                fill="#fde047"
                className="-bottom-4 -left-4"
              />
              <div className="cm-frame p-2">
                <img
                  src="https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1783594514947-27275b14-8f64-4d0f-810a-b8442e6db018.png"
                  alt="Mentoon Team"
                  className="relative w-full max-w-lg rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
        <ProductVideoShowCase />

        <div className="cm-panel relative py-14 lg:py-20 overflow-visible">
          <ComicBurst
            word="OOPS!"
            fill="#f9a8d4"
            size={92}
            rot={-10}
            className="-top-9 -right-4"
          />
          <ComicStar
            size={24}
            fill="#ffffff"
            className="top-6 left-6"
            delay={0.3}
          />
          <ComicStar
            size={20}
            fill="#ef4444"
            className="bottom-6 right-10"
            delay={0.7}
          />

          <div className="grid lg:grid-cols-5 gap-10 items-center max-w-6xl mx-auto px-6">
            <div className="lg:col-span-2 space-y-5">
              <span className="cm-tag cm-chip-font text-sm uppercase cm-reveal">
                {LandingIssues.length} common challenges
              </span>

              <div className="cm-card w-full overflow-hidden cm-reveal">
                {LandingIssues.map((issue, ind) => {
                  const isOpen = openIssue === ind;

                  return (
                    <div
                      key={ind}
                      className={`cm-row ${
                        isOpen ? "bg-yellow-100" : "bg-white"
                      } transition-colors duration-200`}
                    >
                      <div
                        onClick={() => setOpenIssue(isOpen ? null : ind)}
                        className="cursor-pointer px-4 py-3 flex items-center gap-3 hover:bg-yellow-50 transition-colors duration-200"
                      >
                        <div
                          className="cm-icon w-10 h-10 flex-shrink-0 flex items-center justify-center text-lg"
                          style={{
                            color: issue.iconColor,
                            backgroundColor: `${issue.iconColor}30`,
                          }}
                        >
                          {issue.icon}
                        </div>

                        <h3 className="cm-font text-lg text-gray-900 flex-1">
                          {issue.title}
                        </h3>

                        <FaChevronDown
                          className={`flex-shrink-0 text-sm transition-transform duration-300 text-black ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="cm-text text-base px-4 pb-3 pl-16">
                          {issue.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <h2 className="cm-title cm-reveal text-4xl md:text-5xl lg:text-6xl">
                If you're facing these challenges,
                <span className="cm-bubble cm-font text-3xl md:text-4xl lg:text-5xl inline-block mt-6 px-6 py-2">
                  <span
                    style={{
                      WebkitTextStroke: "0",
                      textShadow: "none",
                      color: "#000",
                    }}
                  >
                    don't worry!
                  </span>
                </span>
              </h2>

              <p className="cm-narration cm-text cm-reveal text-xl md:text-2xl">
                We understand what families go through in today's digital world.
                Our programs help children build emotional balance, creativity,
                and meaningful real-life relationships.
              </p>

              <button
                onClick={() => navigate("/mentoons-workshops")}
                className="cm-btn cm-font inline-flex items-center gap-2 px-8 py-3 text-2xl uppercase"
              >
                Discover How →
              </button>

              <div className="flex justify-center lg:justify-start pt-2">
                <img
                  src="/assets/home/help.png"
                  alt="Help Illustration"
                  className="cm-bob w-[240px] md:w-[300px] drop-shadow-[5px_5px_0_#000]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <h2 className="cm-title cm-reveal text-4xl md:text-6xl text-center max-w-5xl mx-auto">
            By choosing{" "}
            <span style={{ color: LandingColors[colorIndex] }}>Mentoons</span>{" "}
            as your guide you can achieve the following
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-9 items-start self-start">
            {LandingAchievements.map((item, ind) => {
              const isOpen = openAchievement === ind;
              return (
                <div
                  key={ind}
                  onClick={() => setOpenAchievement(isOpen ? null : ind)}
                  className="cm-card cm-tilt cm-reveal group cursor-pointer p-4 lg:p-6"
                  style={
                    {
                      ["--tilt" as string]: `${ind % 2 === 0 ? -1.5 : 1.5}deg`,
                      animationDelay: `${(ind % 3) * 0.1}s`,
                    } as CSSProperties
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="cm-icon w-14 h-14 flex items-center justify-center text-2xl"
                        style={{
                          color: item.color,
                          backgroundColor: `${item.color}30`,
                        }}
                      >
                        {item.icon}
                      </div>

                      <h3 className="cm-font text-2xl text-gray-900">
                        {item.title}
                      </h3>
                    </div>

                    <FaChevronDown
                      className={`transition-transform duration-300 text-black ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-40 mt-4 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="cm-text text-lg">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative py-5 lg:py-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12">
            <div className="cm-card cm-reveal flex flex-col gap-6 p-6 lg:p-8">
              <div className="flex flex-col items-center text-center gap-4">
                <div
                  className="cm-icon w-16 h-16 flex items-center justify-center bg-orange-200 text-orange-600"
                  style={{ transform: "rotate(-4deg)" }}
                >
                  <Users className="w-8 h-8" />
                </div>

                <h2
                  className="cm-title cm-title-sm text-5xl"
                  style={{ color: "#f97316" }}
                >
                  For Parents
                </h2>

                <p className="cm-text text-xl">
                  Begin your journey with us today and unlock the true potential
                  of your child with tools built by psychologists and mentors.
                </p>
              </div>

              <div className="space-y-4">
                {LandingParentPoints.map((item, ind) => {
                  const isOpen = openParentPoint === ind;

                  return (
                    <div
                      key={ind}
                      onClick={() => setOpenParentPoint(isOpen ? null : ind)}
                      className={`cm-card cm-lift cursor-pointer p-4 ${
                        isOpen ? "!bg-yellow-100" : ""
                      }`}
                      style={{ boxShadow: "3px 3px 0 #000" }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                          <div
                            className={`cm-icon w-12 h-12 flex items-center justify-center text-xl ${item.color}`}
                          >
                            {item.icon}
                          </div>

                          <p className="cm-font text-xl text-gray-900">
                            {item.title}
                          </p>
                        </div>

                        <FaChevronDown
                          className={`transition-transform duration-300 text-black ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen
                            ? "max-h-40 mt-4 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="cm-text text-lg">{item.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => navigate("/")}
                className="cm-btn cm-font inline-flex items-center gap-2 px-8 py-3 text-2xl uppercase self-center"
              >
                Start Your Journey →
              </button>
            </div>

            <div
              className="cm-card cm-reveal flex flex-col gap-6 p-6 lg:p-8"
              style={{ animationDelay: "0.12s" }}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div
                  className="cm-icon w-16 h-16 flex items-center justify-center bg-blue-200 text-blue-600"
                  style={{ transform: "rotate(4deg)" }}
                >
                  <Baby className="w-8 h-8" />
                </div>

                <h2
                  className="cm-title cm-title-sm text-5xl"
                  style={{ color: "#3b82f6" }}
                >
                  For Children
                </h2>

                <p className="cm-text text-xl">
                  Comics, podcasts, games and workshops designed to help kids
                  build emotional balance and real-life connection.
                </p>
              </div>

              <div className="space-y-4">
                {LandingChildrenPoints.map((item, ind) => {
                  const isOpen = openChildPoint === ind;

                  return (
                    <div
                      key={ind}
                      onClick={() => setOpenChildPoint(isOpen ? null : ind)}
                      className={`cm-card cm-lift cursor-pointer p-4 ${
                        isOpen ? "!bg-yellow-100" : ""
                      }`}
                      style={{ boxShadow: "3px 3px 0 #000" }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                          <div
                            className={`cm-icon w-12 h-12 flex items-center justify-center text-xl ${item.color}`}
                          >
                            {item.icon}
                          </div>

                          <p className="cm-font text-xl text-gray-900">
                            {item.title}
                          </p>
                        </div>

                        <FaChevronDown
                          className={`transition-transform duration-300 text-black ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen
                            ? "max-h-40 mt-4 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="cm-text text-lg">{item.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => navigate("/adda/game-lobby")}
                className="cm-btn cm-font inline-flex items-center gap-2 px-8 py-3 text-2xl uppercase self-center"
                style={{ ["--btn" as string]: "#3b82f6" } as CSSProperties}
              >
                Explore Now →
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-14 items-start">
          <div className="cm-card cm-reveal space-y-8 p-5 lg:p-8">
            <h2
              className="cm-title cm-title-sm text-5xl"
              style={{ color: "#22c55e" }}
            >
              Join Our Community
            </h2>

            <p className="cm-text text-xl">
              Be part of a growing family focused on learning, creativity and
              emotional well-being.
            </p>

            <div className="grid grid-cols-2 gap-4 md:gap-5">
              {LandingCommunities.map((item, i) => (
                <div
                  key={i}
                  className="cm-card cm-lift flex items-center gap-3 md:gap-4 p-3 md:p-4"
                  style={{ boxShadow: "3px 3px 0 #000" }}
                >
                  <div
                    className={`cm-icon w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-xl ${item.color}`}
                  >
                    {item.icon}
                  </div>

                  <p className="cm-font text-xl text-gray-900">{item.name}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/community")}
              className="cm-btn cm-font inline-flex items-center gap-2 px-8 py-3 text-2xl uppercase"
              style={{ ["--btn" as string]: "#22c55e" } as CSSProperties}
            >
              Join Now →
            </button>
          </div>

          <div
            className="cm-panel cm-reveal relative flex flex-col gap-6 p-8 text-center"
            style={{ animationDelay: "0.12s" }}
          >
            <ComicBurst
              word="HELP!"
              fill="#86efac"
              size={88}
              rot={12}
              className="-top-9 -left-5"
            />
            <div className="md:px-4 lg:px-8 mx-auto">
              <div className="flex items-center justify-center gap-4 py-2 md:pb-6">
                <div
                  className="cm-icon w-20 h-20 bg-white flex items-center justify-center rounded-full"
                  style={{ borderRadius: "999px" }}
                >
                  <BiSolidMessage
                    className="text-5xl"
                    style={{ color: "#f97316" }}
                  />
                </div>
              </div>
              <div>
                <h3 className="cm-title cm-title-sm text-3xl md:text-5xl md:pb-4">
                  Have Doubts? We are here to help you!
                </h3>
                <p className="cm-narration cm-text pt-2 pb-2 text-lg md:text-xl mt-3">
                  Contact us for additional help regarding your workshop or
                  purchase made on this platform, We will help you!
                </p>
              </div>
              <div className="mt-6">
                <form
                  className="flex flex-col w-full gap-5"
                  onSubmit={(e) => handleDoubtSubmission(e)}
                >
                  <div className="flex gap-4">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Your Name"
                      value={user?.name || enquiryName}
                      onChange={(e) => setEnquiryName(e.target.value)}
                      className="cm-input w-full p-3"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={user?.email || enquiryEmail}
                      onChange={(e) => setEnquiryEmail(e.target.value)}
                      placeholder="Your Email"
                      className="cm-input w-full p-3"
                      required
                    />
                  </div>
                  <textarea
                    required
                    name="doubt"
                    id="doubt"
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    placeholder="Enter your doubt here"
                    className="cm-input w-full p-3 min-h-[120px]"
                  ></textarea>
                  <button
                    className="cm-btn cm-font w-full py-3 text-3xl uppercase"
                    style={{ ["--btn" as string]: "#ef4444" } as CSSProperties}
                    type="submit"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        {showEnquiryModal && (
          <EnquiryModal
            isOpen={showEnquiryModal}
            onClose={() => setShowEnquiryModal(false)}
            message={ModalMessage.ENQUIRY_MESSAGE}
          />
        )}
      </div>
    </>
  );
};

export default NewLandingPage;
