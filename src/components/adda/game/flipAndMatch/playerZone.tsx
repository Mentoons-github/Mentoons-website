import { CardItem, Difficulty } from "@/types/adda/game";
import GameCard from "./gameCard";
import { useEffect, useState, useCallback } from "react";
import { createCardsForLevel } from "@/utils/game/time";
import {
  GAME_DURATION,
  PREVIEW_DURATION,
} from "@/constant/adda/game/flipAndMatch";

const MAX_MOVES = {
  easy: 15,
  medium: 20,
  hard: 25,
};

const FlipAndMatchPlayerZone = ({
  difficulty,
  onGameComplete,
}: {
  difficulty: Difficulty;
  onGameComplete: (score: number) => void;
}) => {
  const [gameCards, setGameCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<CardItem[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [gameState, setGameState] = useState<
    "preview" | "playing" | "timeup" | "movesup"
  >("preview");
  const [moves, setMoves] = useState(0);
  const [gameTimer, setGameTimer] = useState(GAME_DURATION[difficulty]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const createdCards = createCardsForLevel(difficulty);
    setGameTimer(GAME_DURATION[difficulty]);
    setGameState("preview");

    const previewCards = createdCards.map((card) => ({
      ...card,
      isFlipped: true,
    }));
    setGameCards(previewCards);
    setFlippedCards([]);
    setMoves(0);
    setScore(0);

    const previewTimer = setTimeout(() => {
      const initialCards = createdCards.map((card) => ({
        ...card,
        isFlipped: false,
      }));
      setGameCards(initialCards);
      setGameState("playing");
    }, PREVIEW_DURATION[difficulty]);

    return () => clearTimeout(previewTimer);
  }, [difficulty]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true);
      setMoves((prev) => prev + 1);

      const [card1, card2] = flippedCards;

      if (card1.emoji === card2.emoji) {
        setTimeout(() => {
          setGameCards((prevCards) =>
            prevCards.map((card) =>
              card.id === card1.id || card.id === card2.id
                ? { ...card, isMatched: true }
                : card
            )
          );
          setScore((prev) => prev + 10);
          setFlippedCards([]);
          setIsChecking(false);
        }, 500);
      } else {
        setTimeout(() => {
          setGameCards((prevCards) =>
            prevCards.map((card) =>
              card.id === card1.id || card.id === card2.id
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
          setIsChecking(false);
        }, 800);
      }
    }
  }, [flippedCards]);

  useEffect(() => {
    if (gameCards.length > 0 && gameCards.every((card) => card.isMatched)) {
      onGameComplete(score);
    }
  }, [gameCards, onGameComplete, score]);

  useEffect(() => {
    if (moves >= MAX_MOVES[difficulty] && gameState === "playing") {
      setGameState("movesup");
    }
  }, [moves, difficulty, gameState, onGameComplete, score]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;

    if (gameState === "playing" && gameTimer > 0) {
      timer = setInterval(() => {
        setGameTimer((prev) => prev - 1);
      }, 1000);
    } else if (gameState === "playing" && gameTimer === 0) {
      setGameState("timeup");
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState, gameTimer]);

  const handleCardClick = useCallback(
    (clickedCard: CardItem) => {
      if (
        gameState !== "playing" ||
        isChecking ||
        clickedCard.isMatched ||
        flippedCards.some((card) => card.id === clickedCard.id) ||
        moves >= MAX_MOVES[difficulty]
      ) {
        return;
      }

      const updatedCard = { ...clickedCard, isFlipped: true };
      setFlippedCards((prev) => [...prev, updatedCard]);

      setGameCards((prevCards) =>
        prevCards.map((card) =>
          card.id === clickedCard.id ? updatedCard : card
        )
      );
    },
    [isChecking, flippedCards, gameState, moves, difficulty]
  );

  const handleGameEndContinue = () => {
    onGameComplete(score);
  };

  const getGridClasses = () => {
    switch (difficulty) {
      case "easy":
        return "grid-cols-4";
      case "medium":
        return "grid-cols-4";
      case "hard":
        return "grid-cols-4";
      default:
        return "grid-cols-4";
    }
  };

  const gridClasses = getGridClasses();

  if (gameState === "timeup" || gameState === "movesup") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/assets/games/flipAndMatch/bg.png')] bg-cover bg-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative z-20">
          <div className="mb-6">
            <div className="text-6xl mb-4">
              {gameState === "timeup" ? "⏰" : "🛑"}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {gameState === "timeup" ? "Time's Up!" : "Moves Ended!"}
            </h2>
            <p className="text-gray-600">The game has ended</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <div className="text-sm text-gray-600 mb-2">Your Score</div>
            <div className="text-5xl font-bold text-blue-600 mb-4">{score}</div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded-lg p-3">
                <div className="text-gray-600 mb-1">Moves Used</div>
                <div className="text-xl font-semibold text-gray-800">
                  {moves}/{MAX_MOVES[difficulty]}
                </div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-gray-600 mb-1">Difficulty</div>
                <div className="text-xl font-semibold text-gray-800 capitalize">
                  {difficulty}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleGameEndContinue}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-yellow-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            View Results
          </button>
        </div>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col p-4 bg-[url('/assets/games/flipAndMatch/bg.png')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/10" />
      <div className="max-w-4xl mx-auto mb-4 w-full relative z-10">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-3 text-white">
            <div className="text-sm opacity-90 mb-1">Score</div>
            <div className="text-2xl font-bold">{score}</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg p-3 text-white">
            <div className="text-sm opacity-90 mb-1">Moves</div>
            <div className="text-2xl font-bold">
              {moves}/{MAX_MOVES[difficulty]}
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg p-3 text-white">
            <div className="text-sm opacity-90 mb-1">Time</div>
            <div className="text-2xl font-bold">{gameTimer}</div>
          </div>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center p-2 relative z-10">
        <div className="w-full max-w-sm max-h-full sm:max-h-[80vh] mx-auto">
          {gameState === "preview" ? (
            <div className="text-center text-xl font-semibold text-white mb-4 animate-pulse">
              Memorize the Cards...
            </div>
          ) : (
            <div className="text-center text-xl font-semibold text-white mb-4">
              Find the Pairs
            </div>
          )}

          <div className={`grid ${gridClasses} gap-2`}>
            {gameCards.map((card) => (
              <GameCard
                key={card.id}
                emoji={card.emoji}
                isFlipped={card.isFlipped}
                isMatched={card.isMatched}
                onClick={() => handleCardClick(card)}
                isDisabled={isChecking}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipAndMatchPlayerZone;
