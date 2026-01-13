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
          background: `radial-gradient(circle at 80% 50%, #fdf081ff 0%, #fff98dff 10%, #FF9900 40%)`,
          clipPath: "ellipse(100% 90% at 50% 0%)",
          WebkitClipPath: "ellipse(100% 90% at 50% 0%)",
          minHeight: "75vh",
        }}
      >
        <div className="flex items-start justify-start md:pt-20">
          <img
            src="/assets/assesments/quiz/bannerBG.png"
            alt="Quiz Banner Background"
            className="absolute  bottom-10  right-[10%] lg:w-[30%] xl:w-[45%]  lg:right-[6%] xl:right-[15%] object-contain pointer-events-none z-0"
          />

          <div className="ml-6 md:ml-20 space-y-6 max-w-3xl p-6 relative z-10 ">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Challenge Your Mind with Fun Quizzes!
            </h1>
            <p className="text-lg md:text-2xl font-medium text-white opacity-90">
              Test your knowledge, sharpen your logic, and enjoy hours of
              engaging quizzes designed for all ages.
            </p>
          </div>
        </div>
      </div>
      <div
        className="relative -mt-32 md:-mt-48 z-20"
        style={{ marginTop: "-7rem" }}
      >
        <QuizCardGrid categories={categories} />
      </div>
    </div>
  );
};

export default QuizBanner;
