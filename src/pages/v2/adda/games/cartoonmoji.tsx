import { useEffect, useState } from "react";
import CartoonmojiLobby from "@/components/adda/game/cartoonmoji/lobby";
import PlayerSpace from "@/components/adda/game/cartoonmoji/playerSpace";
import GameDifficultyModal from "@/components/adda/game/difficultyModal";
import { CARTOONMOJI_QUESTIONS } from "@/constant/adda/game";
import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { CurrentState, Difficulty, Questions } from "@/types/adda/game";
import { useAuth } from "@clerk/clerk-react";
import { useStatusModal } from "@/context/adda/statusModalContext";
import postScore from "@/api/game/postScore";

const Cartoonmoji = () => {
  const [currentState, setCurrentState] = useState<CurrentState>("lobby");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<Questions[]>([]);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { showStatus } = useStatusModal();
  const gameId = `cartoonmoji_${difficulty}`;

  useEffect(() => {
    if (difficulty) {
      setQuestions(CARTOONMOJI_QUESTIONS[difficulty]);
    }
  }, [difficulty]);

  const handleGameOver = async () => {
    try {
      const token = await getToken();
      if (token)
        await postScore({ body: { score, gameId, difficulty }, token });
    } catch (error: unknown) {
      showStatus("error", error as string);
    }
    setCurrentState("lobby");
  };

  return (
    <>
      <button
        onClick={() => navigate("/adda/game-lobby")}
        className="absolute left-6 top-6 w-10 h-10 rounded-full flex items-center justify-center bg-white/30 backdrop-blur-sm shadow-md z-[999]"
      >
        <FaChevronLeft className="text-white text-2xl" />
      </button>

      {currentState === "lobby" && (
        <CartoonmojiLobby
          selectTheDifficulty={() => {
            setIsModalOpen(true);
          }}
        />
      )}

      {currentState === "play" && (
        <PlayerSpace
          score={score}
          setScore={setScore}
          difficulty={difficulty}
          questions={questions}
          onGameOver={handleGameOver}
        />
      )}

      {isModalOpen && (
        <GameDifficultyModal
          isClose={() => setIsModalOpen(false)}
          setDifficulty={(val: Difficulty) => {
            setDifficulty(val);
            setIsModalOpen(false);
            setCurrentState("play");
          }}
        />
      )}
    </>
  );
};

export default Cartoonmoji;
