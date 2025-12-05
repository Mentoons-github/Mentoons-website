import {
  XMarkIcon,
  FireIcon,
  BoltIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

type Difficulty = "easy" | "medium" | "hard";

const GameDifficultyModal = ({
  isClose,
  setDifficulty,
}: {
  isClose: () => void;
  setDifficulty: (val: Difficulty) => void;
}) => {
  const difficulties = [
    {
      level: "easy" as Difficulty,
      icon: SparklesIcon,
      color: "from-green-500 to-emerald-600",
      description: "Perfect for beginners",
      age: "6 – 12",
    },
    {
      level: "medium" as Difficulty,
      icon: BoltIcon,
      color: "from-yellow-500 to-orange-600",
      description: "A balanced challenge",
      age: "13 – 19",
    },
    {
      level: "hard" as Difficulty,
      icon: FireIcon,
      color: "from-red-500 to-rose-600",
      description: "For the brave",
      age: "20+",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-4xl bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-2xl">
        <button
          onClick={isClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-600 transition-colors bg-white rounded-full hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-300"
          aria-label="Close modal"
        >
          <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="p-6 sm:p-8 md:p-10">
          <div className="mb-6 text-center sm:mb-8 md:mb-10">
            <h2 className="mb-2 text-2xl font-bold text-gray-800 sm:text-3xl md:text-4xl lg:text-5xl">
              Choose Your Challenge
            </h2>
            <p className="text-sm text-gray-600 sm:text-base md:text-lg lg:text-xl">
              Select a difficulty level to begin
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 md:hidden">
            {difficulties.map((difficulty) => {
              const Icon = difficulty.icon;
              return (
                <button
                  key={difficulty.level}
                  onClick={() => setDifficulty(difficulty.level)}
                  aria-label={`Select ${difficulty.level} difficulty (recommended for ages ${difficulty.age})`}
                  className="group relative overflow-hidden rounded-xl p-4 sm:p-5 transition-all bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-300"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${difficulty.color} opacity-0 transition-opacity group-hover:opacity-5`}
                  />

                  <div className="relative z-10 flex items-center justify-between gap-3 sm:gap-4">
                    <div
                      className={`flex-shrink-0 p-2 sm:p-3 rounded-full bg-gradient-to-br ${difficulty.color}`}
                    >
                      <Icon className="w-6 h-6 text-white sm:w-8 sm:h-8" />
                    </div>

                    <div className="flex-1 text-left">
                      <p className="text-xs text-gray-600 sm:text-sm">
                        {difficulty.description}
                      </p>
                      <p className="mt-1 text-xs font-medium text-gray-500 sm:text-sm">
                        Ages:{" "}
                        <span className="font-semibold text-gray-700">
                          {difficulty.age}
                        </span>
                      </p>
                    </div>

                    <div
                      className={`flex-shrink-0 px-4 py-2 sm:px-6 sm:py-2.5 font-bold text-white text-sm sm:text-base capitalize transition-all bg-gradient-to-r ${difficulty.color} rounded-full group-hover:shadow-lg`}
                    >
                      {difficulty.level}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="hidden grid-cols-3 gap-6 md:grid lg:gap-8">
            {difficulties.map((difficulty) => {
              const Icon = difficulty.icon;
              return (
                <button
                  key={difficulty.level}
                  onClick={() => setDifficulty(difficulty.level)}
                  aria-label={`Select ${difficulty.level} difficulty (recommended for ages ${difficulty.age})`}
                  className="group relative overflow-hidden rounded-xl p-6 lg:p-8 transition-all bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-300"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${difficulty.color} opacity-0 transition-opacity group-hover:opacity-5`}
                  />

                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`mb-4 lg:mb-6 p-3 lg:p-4 rounded-full bg-gradient-to-br ${difficulty.color}`}
                    >
                      <Icon className="w-10 h-10 text-white lg:w-12 lg:h-12" />
                    </div>

                    <h3 className="mb-2 text-2xl font-bold text-gray-800 capitalize lg:text-3xl">
                      {difficulty.level}
                    </h3>

                    <p className="mb-4 text-sm text-gray-600 lg:text-base lg:mb-6">
                      {difficulty.description}
                    </p>

                    <div className="mb-4 lg:mb-6">
                      <span className="text-xs font-medium text-gray-500 uppercase lg:text-sm">
                        Suitable for:
                      </span>
                      <p className="mt-1 text-base font-semibold text-gray-700 lg:text-lg">
                        {difficulty.age}
                      </p>
                    </div>

                    <div
                      className={`px-6 py-2 lg:px-8 lg:py-3 font-semibold text-white transition-all bg-gradient-to-r ${difficulty.color} rounded-full group-hover:shadow-lg`}
                    >
                      Select
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDifficultyModal;
