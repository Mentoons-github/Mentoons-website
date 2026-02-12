import { FaStar } from "react-icons/fa6";

interface Feedback {
  name: string;
  email?: string;
  feedback: string;
  start: number;
  picture: string;
}

interface RightSectionProps {
  feedback: Feedback;
  pos: "start" | "center" | "end";
}

const RightSection = ({ feedback, pos }: RightSectionProps) => {
  return (
    <div className={`flex items-center justify-${pos} w-full`}>
      <div className="flex items-start justify-center gap-3 sm:gap-4 lg:gap-5 w-full sm:w-5/6 lg:w-3/4 h-full p-3 sm:p-4 rounded-xl shadow-md border border-gray-300">
        <div className="rounded-full w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 overflow-hidden flex-shrink-0">
          <img
            src={feedback.picture}
            alt="user profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-2xl w-full min-w-0">
          <div className="space-y-1">
            <h1 className="text-lg sm:text-xl font-medium">{feedback.name}</h1>
            <p className="text-xs sm:text-sm font-light">{feedback.email}</p>
          </div>
          <hr className="w-1/2 h-[2px] sm:h-[2.5px] bg-gray-400 rounded-full flex-shrink-0 mt-2" />
          <p className="line-clamp-2 text-sm sm:text-md text-gray-700 mt-2">
            {feedback.feedback}
          </p>
          <div className="flex items-start justify-start gap-2 sm:gap-3 lg:gap-4 mt-3">
            {Array.from({ length: feedback.start }).map((_, i) => (
              <FaStar
                key={i}
                className="text-yellow-300 text-xl sm:text-2xl lg:text-3xl"
              />
            ))}
            {Array.from({ length: 5 - feedback.start }).map((_, i) => (
              <FaStar
                key={`empty-${i}`}
                className="text-gray-300 text-xl sm:text-2xl lg:text-3xl"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSection;
