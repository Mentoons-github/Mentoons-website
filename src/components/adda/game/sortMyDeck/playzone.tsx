import { Difficulty } from "@/types/adda/game";
import CardArrange from "./arrange";
import SortCards from "./cards";
import SortDeckHeader from "./header";
import { useEffect, useState } from "react";
import { generateRandomCard } from "@/utils/game/randomCard";
import { CardProps } from "@/utils/game/mathMind";
import { CheckCircle } from "lucide-react";
import {
  getCardValue,
  insertCardAtPosition,
  removeCardAtPosition,
  isValidPosition,
} from "@/utils/game/randomCard";
interface PlayerZoneMindMathProps {
  difficulty: Difficulty;
  onGameComplete: (score: number) => void;
}

type SuitType = "S" | "H" | "D" | "C";

interface SortedCards {
  S: CardProps[];
  H: CardProps[];
  D: CardProps[];
  C: CardProps[];
}

const SortMyDeckPlayzone = ({
  difficulty,
  onGameComplete,
}: PlayerZoneMindMathProps) => {
  const Time_Duration = {
    easy: 50,
    medium: 40,
    hard: 35,
  };

  const [timer, setTimer] = useState<number>(Time_Duration[difficulty]);
  const [score, setScore] = useState<number>(0);
  const [cards, setCards] = useState<CardProps[]>([]);
  const [activeSuits, setActiveSuits] = useState<SuitType[]>([]);
  const [sortedCards, setSortedCards] = useState<SortedCards>({
    S: [],
    H: [],
    D: [],
    C: [],
  });
  const [initialSuitCounts, setInitialSuitCounts] = useState<{
    S: number;
    H: number;
    D: number;
    C: number;
  }>({
    S: 0,
    H: 0,
    D: 0,
    C: 0,
  });
  const [showTimeUpModal, setShowTimeUpModal] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] =
    useState<boolean>(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number>(3);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");

  // Main timer countdown
  useEffect(() => {
    if (timer > 0 && !gameCompleted) {
      const interval = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(interval);
    } else if (timer === 0 && !showTimeUpModal && !gameCompleted) {
      setShowTimeUpModal(true);
    }
  }, [timer, showTimeUpModal, gameCompleted]);

  // Check if game is completed (all cards sorted correctly and in order)
  useEffect(() => {
    if (gameCompleted) return;

    if (cards.length === 0) {
      const allSorted = activeSuits.every(
        (suit) => sortedCards[suit].length === initialSuitCounts[suit]
      );

      // Also check if all cards are in correct order
      const allInOrder = activeSuits.every((suit) => {
        const pile = sortedCards[suit];
        if (pile.length <= 1) return true;

        for (let i = 0; i < pile.length - 1; i++) {
          if (getCardValue(pile[i]) >= getCardValue(pile[i + 1])) {
            return false;
          }
        }
        return true;
      });

      if (allSorted && allInOrder && activeSuits.length > 0) {
        setGameCompleted(true);
        setShowCompletionModal(true);
      }
    }
  }, [cards, sortedCards, initialSuitCounts, gameCompleted, activeSuits]);

  // Redirect countdown
  useEffect(() => {
    if ((showTimeUpModal || showCompletionModal) && redirectCountdown > 0) {
      const interval = setTimeout(
        () => setRedirectCountdown(redirectCountdown - 1),
        1000
      );
      return () => clearTimeout(interval);
    } else if (
      (showTimeUpModal || showCompletionModal) &&
      redirectCountdown === 0
    ) {
      onGameComplete(score);
    }
  }, [
    showTimeUpModal,
    showCompletionModal,
    redirectCountdown,
    score,
    onGameComplete,
  ]);

  // Clear feedback
  useEffect(() => {
    if (feedback) {
      const timeout = setTimeout(() => setFeedback(""), 2000);
      return () => clearTimeout(timeout);
    }
  }, [feedback]);

  const handleGenerateCards = () => {
    const { cards: newCards, activeSuits: newActiveSuits } = generateRandomCard(
      { difficulty }
    );
    setCards(newCards);
    setActiveSuits(newActiveSuits);

    const counts = { S: 0, H: 0, D: 0, C: 0 };
    newCards.forEach((card) => {
      counts[card.suit as SuitType]++;
    });
    setInitialSuitCounts(counts);

    setSortedCards({ S: [], H: [], D: [], C: [] });
    setScore(0);
  };

  useEffect(() => {
    handleGenerateCards();
  }, [difficulty]);

  // Handle dropping card from main deck to a specific position
  const handleCardDropFromDeck = (
    cardIndex: number,
    targetSuit: SuitType,
    position: number
  ) => {
    const droppedCard = cards[cardIndex];

    // Check if suit matches
    if (droppedCard.suit !== targetSuit) {
      setScore((prev) => Math.max(0, prev - 5));
      setFeedback("❌ Wrong suit! -5 points");
      return;
    }

    // Check if position maintains order
    const currentPile = sortedCards[targetSuit];
    if (!isValidPosition(currentPile, droppedCard, position)) {
      setScore((prev) => Math.max(0, prev - 5));
      setFeedback("❌ Wrong order! -5 points");
      return;
    }

    // CORRECT! Both suit and position are right
    setSortedCards((prev) => ({
      ...prev,
      [targetSuit]: insertCardAtPosition(
        prev[targetSuit],
        droppedCard,
        position
      ),
    }));
    setCards((prev) => prev.filter((_, i) => i !== cardIndex));
    setScore((prev) => prev + 10);
    setFeedback("✅ Perfect! +10 points");
  };

  // Handle moving card between piles
  const handleCardMove = (
    fromSuit: SuitType,
    cardIndex: number,
    toSuit: SuitType,
    toPosition: number
  ) => {
    const card = sortedCards[fromSuit][cardIndex];

    // Moving within same suit
    if (fromSuit === toSuit) {
      // Remove card temporarily to check order
      const tempPile = removeCardAtPosition(sortedCards[fromSuit], cardIndex);

      // Adjust position if moving within same pile
      let adjustedPosition = toPosition;
      if (toPosition > cardIndex) {
        adjustedPosition = toPosition - 1;
      }

      // Check if new position maintains order
      if (!isValidPosition(tempPile, card, adjustedPosition)) {
        setScore((prev) => Math.max(0, prev - 3));
        setFeedback("❌ Wrong order! -3 points");
        return;
      }

      // Valid reorder within same suit
      setSortedCards((prev) => ({
        ...prev,
        [fromSuit]: insertCardAtPosition(tempPile, card, adjustedPosition),
      }));
      setScore((prev) => prev + 5);
      setFeedback("✅ Good reorder! +5 points");
      return;
    }

    // Moving to different suit
    if (card.suit !== toSuit) {
      setScore((prev) => Math.max(0, prev - 3));
      setFeedback("❌ Wrong suit! -3 points");
      return;
    }

    // Check if position maintains order in target pile
    if (!isValidPosition(sortedCards[toSuit], card, toPosition)) {
      setScore((prev) => Math.max(0, prev - 3));
      setFeedback("❌ Wrong order! -3 points");
      return;
    }

    // CORRECT! Move to different pile
    setSortedCards((prev) => ({
      ...prev,
      [fromSuit]: removeCardAtPosition(prev[fromSuit], cardIndex),
      [toSuit]: insertCardAtPosition(prev[toSuit], card, toPosition),
    }));
    setScore((prev) => prev + 5);
    setFeedback("✅ Correct move! +5 points");
  };

  return (
    <div className="bg-[url('/assets/games/sortMyDeck/bg.png')] bg-cover bg-center min-h-screen flex flex-col">
      <div className="flex-shrink-0">
        <SortDeckHeader remainingTime={timer} score={score} />
      </div>

      {feedback && (
        <div className="fixed top-20 sm:top-24 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top duration-300">
          <div
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-2xl font-bold text-sm sm:text-base ${
              feedback.includes("✅")
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {feedback}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pb-4">
        <SortCards cards={cards} />
        <CardArrange
          suitCounts={initialSuitCounts}
          sortedCards={sortedCards}
          onCardDropFromDeck={handleCardDropFromDeck}
          onCardMove={handleCardMove}
          activeSuits={activeSuits}
        />
      </div>

      {/* Instruction banner */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 max-w-md w-full px-4">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs sm:text-sm py-2 px-4 rounded-lg shadow-lg text-center font-semibold">
          💡 Place cards in order: A, 2, 3... J, Q, K
        </div>
      </div>

      {showTimeUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 max-w-md w-full text-center">
            <div className="mb-4 sm:mb-6">
              <svg
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
              Time's Up!
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-3 sm:mb-4">
              Your final score:{" "}
              <span className="font-bold text-blue-600">{score}</span>
            </p>
            <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
              Redirecting in{" "}
              <span className="font-bold text-red-500 text-xl sm:text-2xl">
                {redirectCountdown}
              </span>
              s
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(redirectCountdown / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 max-w-md w-full text-center">
            <div className="mb-4 sm:mb-6">
              <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-green-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
              Perfect! 🎉
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-2">
              All cards sorted in correct order!
            </p>
            <p className="text-lg sm:text-xl text-gray-600 mb-3 sm:mb-4">
              Your final score:{" "}
              <span className="font-bold text-green-600">{score}</span>
            </p>
            <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
              Redirecting in{" "}
              <span className="font-bold text-green-500 text-xl sm:text-2xl">
                {redirectCountdown}
              </span>
              s
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(redirectCountdown / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SortMyDeckPlayzone;
