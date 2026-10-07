import { Category } from "@/pages/quiz/quizHome";
import QuizCardGrid from "./quizCardGrid";

interface QuizBanner {
  categories: Category[];
}

const QuizBanner = ({ categories }: QuizBanner) => {
  return (
    <div className="relative">
      <div
        className="relative overflow-hidden"
        style={{
          clipPath: "ellipse(100% 90% at 50% 0%)",
          WebkitClipPath: "ellipse(100% 90% at 50% 0%)",
          minHeight: "75vh",
        }}
      >
        <div
          className="absolute inset-0 block md:hidden"
          style={{
            background: `radial-gradient(circle at 80% 50%, #fdf081ff 0%, #fff98dff 10%, #FF9900 40%)`,
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(110deg, #e07000 0%, #f08800 30%, #f59500 55%, #fdb830 75%, #fdd060 100%)`,
          }}
        />

        <div className="relative z-10 flex items-start justify-start pt-10 md:pt-20">
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

          <div className="ml-5 sm:ml-10 md:ml-16 lg:ml-20 space-y-4 md:space-y-6 w-[90%] sm:w-auto max-w-[92%] sm:max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-3xl p-4 sm:p-5 md:p-6 relative z-10">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight"
              style={{
                textShadow:
                  "0 2px 14px rgba(160,80,0,0.5), 0 1px 3px rgba(0,0,0,0.2)",
              }}
            >
              Challenge Your Mind with Mentoons Quizzes!
            </h1>
            <p
              className="text-base sm:text-base md:text-xl lg:text-2xl font-medium text-white opacity-90"
              style={{ textShadow: "0 1px 8px rgba(140,70,0,0.45)" }}
            >
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
