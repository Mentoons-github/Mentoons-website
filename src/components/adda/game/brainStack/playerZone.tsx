import React, { useState, useEffect, DragEvent } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { setInitialTime } from "@/utils/game/time";

type Item = {
  id: string;
  name: string;
  icon: any;
  color: string;
};

type Round = {
  questions: string[];
  correctOrder: string[];
};

type Difficulty = "easy" | "medium" | "hard";

type PlayerZoneProps = {
  difficulty: Difficulty;
  items: Item[];
  rounds: Round[];
  onGameComplete: (finalScore: number) => void;
};

const PlayerZone: React.FC<PlayerZoneProps> = ({
  difficulty,
  items,
  rounds,
  onGameComplete,
}) => {
  const totalSlots =
    difficulty === "hard" ? 6 : difficulty === "medium" ? 5 : 4;

  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(setInitialTime({ difficulty }));
  const [timeUp, setTimeUp] = useState(false);
  const [availableCards, setAvailableCards] = useState<Item[]>([...items]);
  const [dropZones, setDropZones] = useState<(Item | null)[]>(
    Array(totalSlots).fill(null)
  );
  const [draggedItem, setDraggedItem] = useState<{
    item: Item;
    source: any;
  } | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | "">("");
  const [solvedQuestions, setSolvedQuestions] = useState<boolean[]>([]);
  const [showClues, setShowClues] = useState(false);

  useEffect(() => {
    const initial = rounds[currentRound].questions.map(() => false);
    setSolvedQuestions(initial);
  }, [currentRound, rounds]);

  useEffect(() => {
    if (timer > 0 && !timeUp) {
      const id = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(id);
    }
  }, [timer, timeUp]);

  useEffect(() => {
    if (timer === 0 && !timeUp) {
      setTimeUp(true);
      setFeedback("");
    }
  }, [timer, timeUp]);

  useEffect(() => {
    if (timeUp) {
      const timeout = setTimeout(() => {
        if (currentRound < rounds.length - 1) {
          setCurrentRound((r) => r + 1);
          resetRound();
        } else {
          onGameComplete(score);
        }
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [timeUp, currentRound, score, rounds.length, onGameComplete]);

  useEffect(() => {
    checkSolvedQuestions();
  }, [dropZones, currentRound]);

  const checkSolvedQuestions = () => {
    const correctIds = rounds[currentRound].correctOrder;
    const newSolved = rounds[currentRound].questions.map(() => false);

    dropZones.forEach((item, index) => {
      if (item && correctIds[index] === item.id) {
        const clueIndex = index;
        if (clueIndex !== -1 && clueIndex < newSolved.length) {
          newSolved[clueIndex] = true;
        }
      }
    });

    setSolvedQuestions(newSolved);
  };

  const handleDragStart = (e: DragEvent, item: Item, source: any) => {
    setDraggedItem({ item, source });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropToZone = (e: DragEvent, zoneIndex: number) => {
    e.preventDefault();
    if (!draggedItem) return;

    const newZones = [...dropZones];
    const newAvailable = [...availableCards];

    if (draggedItem.source === "available") {
      if (newZones[zoneIndex]) newAvailable.push(newZones[zoneIndex]!);
      newZones[zoneIndex] = draggedItem.item;
      const idx = newAvailable.findIndex((c) => c.id === draggedItem.item.id);
      if (idx > -1) newAvailable.splice(idx, 1);
    } else if (draggedItem.source?.source === "zone") {
      const oldIdx = draggedItem.source.index;
      const target = newZones[zoneIndex];
      if (target) {
        newZones[zoneIndex] = draggedItem.item;
        newZones[oldIdx] = target;
      } else {
        newZones[zoneIndex] = draggedItem.item;
        newZones[oldIdx] = null;
      }
    }

    setDropZones(newZones);
    setAvailableCards(newAvailable);
    setDraggedItem(null);
  };

  const handleDropToAvailable = (e: DragEvent) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.source === "available") return;
    if (draggedItem.source?.source === "zone") {
      const newZones = [...dropZones];
      const newAvailable = [...availableCards];
      newAvailable.push(draggedItem.item);
      newZones[draggedItem.source.index] = null;
      setDropZones(newZones);
      setAvailableCards(newAvailable);
    }
    setDraggedItem(null);
  };

  const handleSubmit = () => {
    const currentAnswer = dropZones.filter(Boolean).map((i) => i!.id);
    const correctAnswer = rounds[currentRound].correctOrder;

    if (JSON.stringify(currentAnswer) === JSON.stringify(correctAnswer)) {
      setFeedback("correct");
      setScore((s) => s + 10);
      setSolvedQuestions(rounds[currentRound].questions.map(() => true));

      setTimeout(() => {
        if (currentRound < rounds.length - 1) {
          setCurrentRound((r) => r + 1);
          resetRound();
        } else {
          onGameComplete(score + 10);
        }
      }, 3000);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback(""), 2000);
    }
  };

  const resetRound = () => {
    setAvailableCards([...items]);
    setDropZones(Array(totalSlots).fill(null));
    setFeedback("");
    setTimer(setInitialTime({ difficulty }));
    setTimeUp(false);
    setShowClues(false);
  };

  const getPositionLabel = (index: number) => {
    if (index === 0) return "First";
    if (index === totalSlots - 1) return "Last";
    const suffixes = ["st", "nd", "rd"];
    const suffix = suffixes[index - 1] || "th";
    return `${index + 1}${suffix}`;
  };

  const isCorrectPosition = (index: number) => {
    const correctAnswer = rounds[currentRound].correctOrder;
    return dropZones[index] && correctAnswer[index] === dropZones[index]!.id;
  };

  const getCardSize = () => {
    if (difficulty === "easy") return "w-20 h-20 md:w-28 md:h-28";
    if (difficulty === "medium")
      return "w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24";
    return "w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20";
  };

  const getDropZoneSize = () => {
    if (difficulty === "easy") return "w-20 h-24 md:w-32 md:h-36";
    if (difficulty === "medium")
      return "w-16 h-20 md:w-24 md:h-28 lg:w-28 lg:h-32";
    return "w-14 h-18 md:w-20 md:h-24 lg:w-24 lg:h-28";
  };

  const getDropZoneCardSize = () => {
    if (difficulty === "easy") return "w-16 h-16 md:w-24 md:h-24";
    if (difficulty === "medium")
      return "w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20";
    return "w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16";
  };

  const getIconSize = () => {
    if (difficulty === "easy") return "w-8 h-8 md:w-12 md:h-12";
    if (difficulty === "medium") return "w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10";
    return "w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8";
  };

  const getDropZoneIconSize = () => {
    if (difficulty === "easy") return "w-6 h-6 md:w-10 md:h-10";
    if (difficulty === "medium") return "w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8";
    return "w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6";
  };

  if (feedback === "correct") {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center z-50">
        <div className="text-center animate-bounce">
          <div className="text-9xl mb-8">🎉</div>
          <h1 className="text-6xl md:text-9xl font-bold text-white drop-shadow-2xl mb-6">
            CORRECT!
          </h1>
          <p className="text-3xl md:text-5xl text-white font-semibold drop-shadow-lg">
            +10 Points!
          </p>
          <div className="mt-8 text-2xl md:text-3xl text-white/90">
            Loading next round...
          </div>
        </div>
      </div>
    );
  }

  if (timeUp) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="text-center animate-pulse">
          <h1 className="text-6xl md:text-9xl font-bold text-red-600 drop-shadow-lg">
            Time's Up!
          </h1>
          <p className="text-2xl md:text-4xl text-white mt-8">
            Moving to next round in 5 seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/assets/games/mindStack/bg.jpg')] bg-cover bg-center p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="lg:hidden mb-4 flex flex-wrap gap-2 md:gap-3">
          <div className="flex-1 min-w-[90px] bg-white rounded-xl shadow-lg p-2 md:p-3 border-2 border-yellow-300">
            <h3 className="text-xs font-bold text-gray-600 mb-1">Score</h3>
            <div className="text-xl md:text-2xl font-bold text-yellow-600">
              {score}
            </div>
          </div>
          <div className="flex-1 min-w-[90px] bg-white rounded-xl shadow-lg p-2 md:p-3 border-2 border-red-300">
            <h3 className="text-xs font-bold text-gray-600 mb-1">Timer</h3>
            <div
              className={`text-xl md:text-2xl font-bold ${
                timer < 10 ? "text-red-600 animate-pulse" : "text-red-500"
              }`}
            >
              {timer}s
            </div>
          </div>
          <div className="flex-1 min-w-[90px] bg-white rounded-xl shadow-lg p-2 md:p-3 border-2 border-purple-300">
            <h3 className="text-xs font-bold text-gray-600 mb-1">Round</h3>
            <div className="text-xl md:text-2xl font-bold text-purple-600">
              {currentRound + 1}/{rounds.length}
            </div>
          </div>
        </div>

        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowClues(!showClues)}
            className="w-full bg-white rounded-xl shadow-lg p-3 md:p-4 flex justify-between items-center hover:bg-purple-50 transition"
          >
            <h2 className="text-base md:text-lg font-bold text-purple-800">
              Clues ({solvedQuestions.filter(Boolean).length}/
              {rounds[currentRound].questions.length})
            </h2>
            {showClues ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          {showClues && (
            <div className="mt-2 bg-white rounded-xl shadow-lg p-3 md:p-4 border-2 border-purple-400">
              <ul className="space-y-2">
                {rounds[currentRound].questions.map((q, i) => (
                  <li
                    key={i}
                    className={`text-xs md:text-sm p-2 md:p-3 rounded-lg transition-all ${
                      solvedQuestions[i]
                        ? "bg-green-500 text-white font-semibold line-through"
                        : "bg-purple-50 text-gray-800 border-2 border-purple-200"
                    }`}
                  >
                    {q}
                    {solvedQuestions[i] && <span className="ml-2">Check</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          <div className="hidden lg:block w-80 bg-black/20 backdrop-blur-xl rounded-2xl shadow-xl p-6 border-4 border-purple-400">
            <h2 className="text-xl font-bold text-white mb-4 text-center">
              Clues
            </h2>
            <ul className="space-y-3">
              {rounds[currentRound].questions.map((q, i) => (
                <li
                  key={i}
                  className={`text-sm p-3 rounded-lg transition-all ${
                    solvedQuestions[i]
                      ? "bg-green-500 text-white font-semibold line-through"
                      : "bg-purple-50 text-gray-800 border-2 border-purple-200"
                  }`}
                >
                  {q}
                  {solvedQuestions[i] && <span className="ml-2">Check</span>}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6 border-2 md:border-4 border-green-400">
            <h2 className="text-xl md:text-2xl font-bold text-green-800 mb-4 md:mb-6 text-center">
              Arrange the Items
            </h2>

            <div className="mb-6 md:mb-8">
              <h3 className="text-sm md:text-lg font-semibold mb-2 md:mb-3 text-gray-700">
                Available Items:
              </h3>
              <div
                className="flex flex-wrap gap-2 md:gap-3 p-3 md:p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 min-h-24 md:min-h-32 justify-center"
                onDragOver={handleDragOver}
                onDrop={handleDropToAvailable}
              >
                {availableCards.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item, "available")}
                      className={`${
                        item.color
                      } ${getCardSize()} p-2 md:p-3 lg:p-4 rounded-xl shadow-lg cursor-move hover:scale-110 transition-transform flex flex-col items-center justify-center`}
                    >
                      <Icon className={`${getIconSize()} text-white mb-1`} />
                      <span className="text-xs font-semibold text-white text-center leading-tight">
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mb-6 md:mb-8">
              <h3 className="text-sm md:text-lg font-semibold mb-2 md:mb-3 text-gray-700">
                Your Answer:
              </h3>
              <div className="flex flex-wrap lg:flex-nowrap gap-2 md:gap-3 lg:gap-4 justify-center overflow-x-auto pb-2">
                {dropZones.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center flex-shrink-0"
                  >
                    <div
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropToZone(e, i)}
                      className={`${getDropZoneSize()} border-2 md:border-4 border-dashed rounded-xl flex items-center justify-center hover:border-green-500 transition-colors ${
                        isCorrectPosition(i)
                          ? "border-green-500 bg-green-100"
                          : "border-green-300 bg-green-50"
                      }`}
                    >
                      {item ? (
                        <div
                          draggable
                          onDragStart={(e) =>
                            handleDragStart(e, item, {
                              source: "zone",
                              index: i,
                            })
                          }
                          className={`${
                            item.color
                          } ${getDropZoneCardSize()} p-2 md:p-3 rounded-xl shadow-lg cursor-move hover:scale-105 transition-transform flex flex-col items-center justify-center`}
                        >
                          {React.createElement(item.icon, {
                            className: `${getDropZoneIconSize()} text-white mb-1`,
                          })}
                          <span className="text-xs font-semibold text-white text-center leading-tight">
                            {item.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-lg md:text-xl lg:text-2xl font-bold">
                          {i + 1}
                        </span>
                      )}
                    </div>
                    <span className="mt-1 md:mt-2 text-xs md:text-sm font-semibold text-gray-600">
                      {getPositionLabel(i)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={
                  dropZones.filter(Boolean).length !== totalSlots || timeUp
                }
                className="px-6 md:px-10 py-3 md:py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-base md:text-xl shadow-lg transition w-full md:w-auto"
              >
                Check Answer
              </button>
              {feedback === "wrong" && (
                <div className="mt-3 md:mt-4 text-base md:text-xl font-bold text-red-600 animate-pulse">
                  Not quite right. Try again!
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block w-64 bg-black/20 backdrop-blur-xl rounded-2xl shadow-xl p-6 border-4 border-blue-400">
            <h2 className="text-xl font-bold text-white mb-6 text-center">
              Stats
            </h2>
            <div className="flex flex-col gap-6">
              <div className="text-center p-4 bg-yellow-50 rounded-xl border-2 border-yellow-300">
                <h3 className="text-sm font-bold text-gray-600 mb-2">Score</h3>
                <div className="text-5xl font-bold text-yellow-600">
                  {score}
                </div>
              </div>
              <hr className="border-2 border-gray-200" />
              <div className="text-center p-4 bg-red-50 rounded-xl border-2 border-red-300">
                <h3 className="text-sm font-bold text-gray-600 mb-2">Timer</h3>
                <div
                  className={`text-5xl font-bold ${
                    timer < 10 ? "text-red-600 animate-pulse" : "text-red-500"
                  }`}
                >
                  {timer}s
                </div>
              </div>
              <hr className="border-2 border-gray-200" />
              <div className="text-center p-4 bg-purple-50 rounded-xl border-2 border-purple-300">
                <h3 className="text-sm font-bold text-gray-600 mb-2">Round</h3>
                <div className="text-5xl font-bold text-blue-600">
                  {currentRound + 1}/{rounds.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerZone;
