import { useState, useRef } from "react";
import { Search, X } from "lucide-react";
import "./affiliate.css";
import { useGSAP } from "@gsap/react";
import gsap, { SplitText } from "gsap/all";
import { JobApplicationForm } from "@/components/shared/FAQSection/FAQCard";
import FaqButton from "@/components/common/faqButton";

interface JobHeroSectionProps {
  title: string;
  subTitle: string;
  onSearch?: (term: string) => void;
  jobId?: string;
  setShowFAQ?: (val: boolean) => void;
}

const JobHeroSection: React.FC<JobHeroSectionProps> = ({
  onSearch,
  title,
  subTitle,
  jobId,
  setShowFAQ,
}) => {
  const [inputValue, setInputValue] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const [showApplication, setShowApplication] = useState(false);

  const decor1Ref = useRef<HTMLImageElement>(null);
  const decor2Ref = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      const titleSplit = new SplitText("#title", { type: "chars" });
      tl.from(titleSplit.chars, {
        y: 80,
        opacity: 0,
        rotateX: -90,
        filter: "blur(8px)",
        transformPerspective: 600,
        duration: 0.9,
        stagger: 0.05,
      });

      tl.from(
        "#subTitle",
        {
          y: 40,
          opacity: 0,
          filter: "blur(12px)",
          duration: 1.1,
        },
        "-=0.5",
      );

      tl.fromTo(
        "#search-input",
        {
          y: 60,
          opacity: 0,
          scale: 0.92,
          filter: "blur(6px)",
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power4.out",
        },
        "-=0.7",
      );

      tl.from(
        "#search-input",
        {
          boxShadow: "0 0 0 0 rgba(255,255,255,0.4)",
          duration: 1.5,
          ease: "sine.out",
        },
        "<",
      );

      tl.fromTo(
        "#become-mentor",
        {
          y: 55,
          scale: 0.9,
          opacity: 0,
          rotationX: 30,
          transformPerspective: 900,
          filter: "blur(8px)",
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          rotationX: 0,
          filter: "blur(0px)",
          duration: 1.5,
          ease: "power4.out",
        },
        "-=0.9",
      ).fromTo(
        "#become-mentor",
        { "--glow": "0 0 15px rgba(255,255,255,0)" },
        {
          "--glow": "0 0 35px rgba(255,255,255,0.5)",
          duration: 2,
          ease: "sine.out",
        },
        "<+=0.4",
      );

      // Fade-in for the two decorative images
      gsap.fromTo(
        [decor1Ref.current, decor2Ref.current],
        { opacity: 0, y: 40, scale: 0.85 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.8,
          stagger: 0.3,
          ease: "power3.out",
        },
        "-=1.2",
      );

      // Gentle floating animation – left image
      gsap.to(decor1Ref.current, {
        y: "-=20",
        rotation: 3,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Gentle floating animation – right image
      gsap.to(decor2Ref.current, {
        y: "+=25",
        rotation: -4,
        duration: 14,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
  }, []);

  useGSAP(() => {
    const inputContainer = searchRef.current;
    if (!inputContainer) return;

    const hoverTl = gsap.timeline({ paused: true });

    hoverTl.to(inputContainer, {
      scale: 1.03,
      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)",
      background: "rgba(255,255,255,0.28)",
      duration: 0.5,
      ease: "power2.out",
    });

    inputContainer.addEventListener("mouseenter", () => hoverTl.play());
    inputContainer.addEventListener("mouseleave", () => hoverTl.reverse());

    const input = inputContainer.querySelector<HTMLInputElement>("input");

    if (input) {
      input.addEventListener("focus", () => {
        gsap.to(inputContainer, {
          scale: 1.04,
          y: -6,
          boxShadow: "0 30px 60px -15px rgba(0,0,0,0.5)",
          background: "rgba(255,255,255,0.35)",
          duration: 0.6,
          ease: "power3.out",
        });
      });

      input.addEventListener("blur", () => {
        gsap.to(inputContainer, {
          scale: 1,
          y: 0,
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.25)",
          background: "rgba(255,255,255,0.2)",
          duration: 0.5,
          ease: "power2.inOut",
        });
      });
    }

    return () => {
      inputContainer.removeEventListener("mouseenter", () => hoverTl.play());
      inputContainer.removeEventListener("mouseleave", () => hoverTl.reverse());
      if (input) {
        input.removeEventListener("focus", () => {});
        input.removeEventListener("blur", () => {});
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (!newValue.trim() && onSearch) {
      onSearch("");
    }
  };

  const handleSearchClick = () => {
    onSearch?.(inputValue.trim());
  };

  const handleClearClick = () => {
    setInputValue("");
    onSearch?.("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <div className="relative h-screen bg-gradient-to-br from-orange-500 via-orange-400 to-red-500 overflow-hidden">
      <img
        ref={decor1Ref}
        src="/assets/hiring/collaborate/collaborate1.png"
        alt="decorative element left"
        className="absolute top-[0%] left-[6%] w-32 sm:w-40 md:w-44 opacity-100 pointer-events-none select-none"
      />

      <img
        ref={decor2Ref}
        src="/assets/hiring/collaborate/collaborate.png"
        alt="decorative element right"
        className="absolute bottom-[12%] right-[0%] w-64 sm:w-80 md:w-[28rem] lg:w-[32rem] opacity-100 rounded-full pointer-events-none select-none"
      />

      {onSearch && (
        <div className="custom-shape-divider-bottom-affiliate">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-[60px] sm:h-[80px] md:h-[100px] lg:h-[120px] rotate-180"
          >
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="shape-fill-affiliate"
            />
          </svg>
        </div>
      )}

      {setShowFAQ && <FaqButton setShowFAQ={setShowFAQ} />}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-start h-full text-white text-center px-4 sm:px-6 md:px-8">
        <h1
          id="title"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wider drop-shadow-lg mt-20 sm:mt-28 md:mt-36 lg:mt-44"
        >
          {title}
        </h1>
        <p
          id="subTitle"
          className="mt-4 text-base sm:text-lg md:text-xl opacity-90 max-w-lg sm:max-w-xl md:max-w-2xl"
        >
          {subTitle}
        </p>

        {onSearch ? (
          <div
            id="search-input"
            ref={searchRef}
            className="mt-6 sm:mt-8 md:mt-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-3xl flex items-center bg-white/20 border border-white/40 rounded-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 backdrop-blur-lg shadow-xl transition-all duration-500"
          >
            <input
              type="text"
              placeholder="Search affiliate positions..."
              className="flex-1 bg-transparent text-white placeholder-white/80 focus:outline-none text-lg sm:text-xl md:text-2xl caret-white"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <button
              className="ml-2 sm:ml-3 md:ml-4 p-2 sm:p-3 rounded-full bg-white/30 hover:bg-white/50 transition-colors duration-300"
              onClick={handleSearchClick}
              aria-label="Search"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
            {inputValue && (
              <button
                className="ml-1 sm:ml-2 p-2 sm:p-3 rounded-full bg-white/30 hover:bg-white/50 transition-colors duration-300"
                onClick={handleClearClick}
                aria-label="Clear search"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowApplication(true)}
            id="become-mentor"
            className="px-10 py-3 rounded-2xl text-xl font-semibold mt-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-600/50 hover:-translate-y-2 active:scale-95 active:shadow-inner transition-all duration-400 ease-out [box-shadow:var(--glow,0_0_15px_rgba(255,255,255,0))_inset]"
          >
            Join as Mentor
          </button>
        )}
      </div>

      {showApplication && (
        <JobApplicationForm
          id={jobId!}
          setIsFormOpen={setShowApplication}
          applicationSource="INTERNAL"
        />
      )}
    </div>
  );
};

export default JobHeroSection;
