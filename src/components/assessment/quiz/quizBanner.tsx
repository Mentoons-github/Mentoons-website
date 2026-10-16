import { Category } from "@/pages/quiz/quizHome";
import QuizCardGrid from "./quizCardGrid";

interface QuizBanner {
  categories: Category[];
}

const HALFTONE_BG = {
  backgroundColor: "#F5F5F4",
  backgroundImage: "radial-gradient(#d6d3d1 1.2px, transparent 1.2px)",
  backgroundSize: "16px 16px",
};

const HALFTONE_OVERLAY = {
  backgroundImage:
    "radial-gradient(rgba(17,24,39,0.16) 1.6px, transparent 1.6px)",
  backgroundSize: "16px 16px",
};

const QuizBanner = ({ categories }: QuizBanner) => {
  return (
    <div className="relative pb-16" style={HALFTONE_BG}>
      <div
        className="relative overflow-hidden border-b-4 border-gray-900 bg-[#ff9800]"
        style={{ minHeight: "75vh" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={HALFTONE_OVERLAY}
        />

        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full border-4 border-gray-900 bg-[#FFD93D] opacity-70" />

        {/* Psychologists badge - top right, responsive */}
        <div className="absolute right-3 top-3 z-20 w-16 sm:right-4 sm:top-4 sm:w-20 md:right-6 md:top-5 md:w-28 lg:right-8 lg:top-6 lg:w-36 xl:w-40 drop-shadow-[4px_4px_0_rgba(17,24,39,0.9)] transition-transform duration-300 hover:rotate-3 hover:scale-105">
          <img
            src="/assets/LandingPage/psyco.png"
            alt="Carefully crafted by psychologists"
            className="h-auto w-full object-contain"
          />
        </div>

        <div className="relative z-10 flex items-start justify-start pt-24 sm:pt-10 md:pt-20 pb-28 sm:pb-32 md:pb-44 lg:pb-52 xl:pb-56">
          <img
            src="/assets/assesments/quiz/bannerBG.png"
            alt="Quiz Banner Background"
            className="
    absolute 
    bottom-0 right-0 
    w-[70%] sm:w-[55%] md:w-[45%] lg:w-[38%] xl:w-[42%]
    max-w-[600px]
    object-contain 
    pointer-events-none 
    opacity-80 sm:opacity-100
    z-0
  "
          />

          <div className="ml-5 sm:ml-10 md:ml-16 lg:ml-20 space-y-5 md:space-y-7 w-[90%] sm:w-auto max-w-[92%] sm:max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-3xl p-4 sm:p-5 md:p-6 relative z-10">
            <h1
              className="font-comic text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-wide text-white"
              style={{
                WebkitTextStroke: "2px #111827",
                textShadow: "5px 5px 0 #111827",
              }}
            >
              Challenge Your Mind with Mentoons Quizzes!
            </h1>
            <p className="inline-block -rotate-1 rounded-2xl border-2 border-gray-900 bg-white px-5 py-3 text-base font-medium text-gray-900 shadow-[5px_5px_0_0_#111827] sm:text-base md:text-xl lg:text-2xl">
              Test your knowledge, sharpen your logic, and enjoy hours of
              engaging quizzes designed for all ages.
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-20 -mt-20 sm:-mt-24 md:-mt-36 lg:-mt-44 xl:-mt-48">
        <QuizCardGrid categories={categories} />
      </div>
    </div>
  );
};

export default QuizBanner;
