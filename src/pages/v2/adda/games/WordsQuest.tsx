import { CurrentState } from "@/types/adda/game";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import HowToPlay from "@/components/adda/game/howToPlay/howToPlay";
import { FaChevronLeft } from "react-icons/fa6";
import { BiBulb } from "react-icons/bi";
import { useStatusModal } from "@/context/adda/statusModalContext";
import RewardPointsModal from "@/components/modals/candyCoin";
import postScore from "@/api/game/postScore";
import { GAME_INSTRUCTIONS } from "@/constant/adda/game/instructions";
import WordsQuestLobby from "@/components/adda/game/wordsquest/WordsQuestLobby";
import WordsQuestPlayzone from "@/components/adda/game/wordsquest/WordsQuestPlayzone";
import { WORDS_QUEST } from "@/constant/adda/game/wordsQuest";
import WordsQuestScoreBoard from "@/components/adda/game/wordsquest/WordsQuestScoreBoard";
import { useNavigate } from "react-router-dom";

interface RoundScore {
  title: string;
  score: number;
  foundWords: string[];
}

const WordsQuest = () => {
  const GAME_TIME = 300;

  const [timer, setTimer] = useState(GAME_TIME);
  const { showStatus } = useStatusModal();
  const [currentState, setCurrentState] = useState<CurrentState>("lobby");
  const [finalScore, setFinalScore] = useState<RoundScore[]>([]);
  const [rewardPoints, setRewardPoints] = useState<number | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [isInstructionOpen, setInstructionOpen] = useState(false);
  const [roundCount, setRoundCount] = useState<number>(0);
  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentState !== "play") return;
    if (timer === 0) return;
    if (isInstructionOpen) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentState, isInstructionOpen, timer]);

  const gameId = `words_quest_`;

  const gameInstructions = GAME_INSTRUCTIONS.find(
    (inst) =>
      inst.game.toLowerCase().replace(/_/g, "").replace(/\s+/g, "") ===
      "wordsquest",
  );

  const handleGameComplete = (roundData: RoundScore) => {
    setFinalScore((prev) => {
      const updated = [...prev, roundData];

      if (updated.length === WORDS_QUEST.length) {
        finishGame(updated);
      }

      return updated;
    });
  };

  const finishGame = async (roundScores: RoundScore[]) => {
    setCurrentState("result");
    setRoundCount(0);

    const totalScore = roundScores.reduce((sum, r) => sum + r.score, 0);

    try {
      const token = await getToken();
      if (token) {
        const success = totalScore > 80;

        const response = await postScore({
          body: {
            score: totalScore,
            gameId,
            difficulty: "noDifficulty",
            success,
          },
          token,
        });

        if (response?.rewardPoints) {
          setRewardPoints(response.rewardPoints);
          setShowRewardModal(true);
        }
      }
    } catch (error: unknown) {
      showStatus("error", error as string);
    }
  };

  const handleCloseRewardModal = () => {
    setShowRewardModal(false);
    setRewardPoints(null);
  };

  const handlePlayAgain = () => {
    setFinalScore([]);
    setCurrentState("lobby");
  };

  const startGame = () => {
    setTimer(GAME_TIME);
    setFinalScore([]);
    setCurrentState("play");
  };

  const goToLobby = () => {
    setCurrentState("lobby");
  };

  const handleBack = () => {
    if (currentState == "lobby") {
      navigate("/adda/game-lobby");
    } else {
      setCurrentState("lobby");
    }
  };

  return (
    <div className="h-screen">
      <HowToPlay
        instructions={gameInstructions?.steps || []}
        isModalOpen={isInstructionOpen}
        setClose={() => setInstructionOpen(false)}
      />

      <div className="absolute top-10 md:top-14 lg:top-10 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 z-50 flex items-center justify-between gap-2">
        <button
          onClick={handleBack}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-sm shadow-md hover:bg-black/40 transition-all flex-shrink-0"
        >
          <FaChevronLeft className="text-white text-xl sm:text-2xl" />
        </button>

        <button
          onClick={() => setInstructionOpen(true)}
          className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-md text-white font-bold py-2 px-3 sm:py-2.5 sm:px-4 md:px-6 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-lg cursor-pointer hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border border-blue-400/30 hover:from-blue-400 hover:via-blue-500 hover:to-blue-600 flex-shrink-0"
        >
          <span className="hidden xs:inline sm:inline">How To Play</span>
          <span className="inline xs:hidden sm:hidden">Help</span>
          <BiBulb className="text-base sm:text-xl animate-pulse" />
        </button>
      </div>

      {currentState === "lobby" && (
        <WordsQuestLobby showDifficultyModal={() => startGame()} />
      )}

      {currentState === "play" && (
        <WordsQuestPlayzone
          timer={timer}
          timeOver={timer <= 0}
          onGameComplete={handleGameComplete}
          increaseRoundCount={() => setRoundCount((prev) => prev + 1)}
          decreaswRoundCount={() => setRoundCount((pre) => pre - 1)}
          roundCount={roundCount}
          resetTimer={() => setTimer(GAME_TIME)}
        />
      )}

      {currentState === "result" && (
        <WordsQuestScoreBoard
          score={finalScore}
          onPlayAgain={handlePlayAgain}
          goToLobby={goToLobby}
          answers={WORDS_QUEST}
        />
      )}

      {showRewardModal && rewardPoints !== null && (
        <RewardPointsModal
          rewardPoints={rewardPoints}
          onClose={handleCloseRewardModal}
        />
      )}
    </div>
  );
};

export default WordsQuest;
