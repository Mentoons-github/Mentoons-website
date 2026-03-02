import React from "react";
import { RotateCcw, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

type PatternRaceResultScreenProps = {
  score: { title: string; score: number; foundWords: string[] }[];
  onPlayAgain: () => void;
  goToLobby: () => void;
  answers: {
    title: string;
    wordsToFind: string[];
  }[];
};

const WordsQuestScoreBoard: React.FC<PatternRaceResultScreenProps> = ({
  score,
  onPlayAgain,
  goToLobby,
  answers,
}) => {
  const navigate = useNavigate();

  const totalScore = score.reduce((acc, curr) => acc + curr.score, 0);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center 
  bg-[url('/assets/games/mindStack/bg.jpg')] bg-cover bg-center p-4"
    >
      <div
        className="bg-white w-full max-w-3xl 
    rounded-2xl md:rounded-3xl shadow-2xl 
    p-4 sm:p-6 md:p-10 
    flex flex-col max-h-[95vh]"
      >
        {/* HEADER */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6">
          Final Results
        </h2>

        {/* SCROLLABLE ROUNDS */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          {answers.map((round) => {
            const roundData = score.find((s) => s.title === round.title);
            const roundScore = roundData?.score ?? 0;

            return (
              <div
                key={round.title}
                className="bg-gray-50 border rounded-xl md:rounded-2xl 
              p-4 md:p-5 shadow-sm"
              >
                {/* Round Header */}
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800">
                    {round.title}
                  </h3>

                  <span className="text-green-600 font-bold text-base sm:text-lg">
                    {roundScore} pts
                  </span>
                </div>

                {/* Words */}
                <div className="flex flex-wrap gap-2">
                  {round.wordsToFind.map((word) => {
                    const isFound = roundData?.foundWords.includes(word);

                    return (
                      <span
                        key={word}
                        className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold
                      ${
                        isFound
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                      >
                        {word}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* TOTAL SCORE */}
        <div
          className="mt-3 bg-green-600 text-white 
      rounded-xl md:rounded-2xl 
      py-3 md:py-4 text-lg md:text-xl font-bold text-center"
        >
          Total Score: {totalScore}
        </div>

        {/* BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <button
            onClick={onPlayAgain}
            className="bg-green-600 text-white font-bold 
          py-3 rounded-xl hover:bg-green-700 transition"
          >
            <RotateCcw className="inline mr-2" size={18} />
            Play Again
          </button>

          <button
            onClick={goToLobby}
            className="border-2 border-green-600 text-green-600 
          font-bold py-3 rounded-xl hover:bg-green-50 transition"
          >
            Go to Lobby
          </button>
        </div>

        {/* LEADERBOARD */}
        <button
          onClick={() => navigate("/adda/leaderboard")}
          className="mt-4 w-full bg-black text-white 
        py-3 rounded-xl font-bold hover:bg-gray-900 transition"
        >
          <Users className="inline mr-2" size={18} />
          View Leaderboard
        </button>
      </div>
    </div>
  );
};

export default WordsQuestScoreBoard;
