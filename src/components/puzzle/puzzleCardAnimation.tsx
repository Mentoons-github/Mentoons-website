import { Play } from "lucide-react";

type PuzzleCardProps = {
  img: string;
  title: string;
  description: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  onPlay?: () => void;
};

const PuzzleCard = ({
  img,
  title,
  description,
  difficulty = "Medium",
  onPlay,
}: PuzzleCardProps) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
      <div className="p-6 flex flex-col md:flex-row items-start gap-6">
        <div className="relative overflow-hidden rounded-lg flex-shrink-0">
          <img
            src={img}
            alt={title}
            className="w-full md:w-48 h-32 md:h-36 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(
                difficulty
              )}`}
            >
              {difficulty}
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
            {title} Puzzle
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
            {description}
          </p>

          <button
            onClick={onPlay}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Play size={16} className="fill-current" />
            Play Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PuzzleCard;
