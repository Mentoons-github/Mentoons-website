import React from "react";
import { RotateCcw, Award, Users, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HiLightningBolt } from "react-icons/hi";

type PatternRaceResultScreenProps = {
  score: number;
  difficulty: "easy" | "medium" | "hard";
  totalRounds: number;
  totalTime: number; // total game time (seconds)
  onPlayAgain: () => void;
  goToLobby: () => void;
};

const PatternRaceResultScreen: React.FC<PatternRaceResultScreenProps> = ({
  score,
  difficulty,
  totalRounds,
  totalTime,
  onPlayAgain,
  goToLobby,
}) => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[url('/assets/games/mindStack/bg.jpg')] bg-cover bg-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-6 sm:p-10 text-center">
        {/* ICON */}
        <div className="flex justify-center mb-4">
          <Clock className="w-16 h-16 text-yellow-500" />
        </div>

        {/* TITLE */}
        <h1 className={`text-3xl sm:text-4xl font-extrabold text-green-700`}>
          Time is Over
        </h1>

        {/* SUMMARY */}
        <p className="text-gray-700 mt-3 text-lg">
          You completed <span className="font-bold">{totalRounds}</span> rounds
          and scored <span className="font-bold">{score}</span> in{" "}
          <span className="font-bold">{totalTime}s</span>
        </p>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {/* SCORE */}
          <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
            <Award className="mx-auto text-green-600 mb-2" />
            <p className="text-sm text-gray-600">Score</p>
            <p className="text-2xl font-bold text-green-700">{score}</p>
          </div>

          <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
            <HiLightningBolt className="mx-auto text-green-600 mb-2" />
            <p className="text-sm text-gray-600">Difficulty</p>
            <p className="text-2xl font-bold text-green-700">
              {difficulty.toUpperCase()}
            </p>
          </div>

          {/* TIME */}
          <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
            <Clock className="mx-auto text-green-600 mb-2" />
            <p className="text-sm text-gray-600">Time Used</p>
            <p className="text-2xl font-bold text-green-700">{totalTime}s</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <button
            onClick={onPlayAgain}
            className="bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition"
          >
            <RotateCcw className="inline mr-2" />
            Play Again
          </button>

          <button
            onClick={goToLobby}
            className="border-2 border-green-600 text-green-600 font-bold py-3 rounded-xl hover:bg-green-50 transition"
          >
            Go to Lobby
          </button>
        </div>

        {/* LEADERBOARD */}
        <button
          onClick={() => navigate("/adda/leaderboard")}
          className="mt-5 w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition"
        >
          <Users className="inline mr-2" />
          View Leaderboard
        </button>
      </div>
    </div>
  );
};

export default PatternRaceResultScreen;
