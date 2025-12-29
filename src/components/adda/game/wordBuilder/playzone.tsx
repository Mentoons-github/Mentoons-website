import { useState, useEffect } from "react";
import WordBuilderHeader from "./header";
import UserInput from "./userInput";

interface Items {
  word: string;
  validWords: string[];
}

interface WordBuilderPlayzoneProps {
  difficulty: "easy" | "medium" | "hard";
  items: Items[];
  onGameComplete: (score: number) => void;
}

const WordBuilderPlayzone = ({
  difficulty,
  items,
  onGameComplete,
}: WordBuilderPlayzoneProps) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [mainWord, setMainWord] = useState("");
  const [validWords, setValidWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [userInputs, setUserInputs] = useState<string[]>(["", "", "", ""]);
  const [correctInputs, setCorrectInputs] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [isGameActive, setIsGameActive] = useState(true);
  const [currentWord, setCurrentWord] = useState("");
  const [showWrongAnswer, setShowWrongAnswer] = useState(false);

  const targetWords =
    difficulty === "easy" ? 4 : difficulty === "medium" ? 7 : 10;

  const longestWordLength =
    validWords.length > 0
      ? Math.max(...validWords.map((word) => word.length))
      : mainWord.length;

  useEffect(() => {
    if (items && items[currentRound]) {
      const roundData = items[currentRound];
      setMainWord(roundData.word);
      setValidWords(roundData.validWords);
      setFoundWords([]);

      const target =
        difficulty === "easy" ? 4 : difficulty === "medium" ? 7 : 10;
      setUserInputs(Array(target).fill(""));
      setCorrectInputs(Array(target).fill(false));

      setCurrentWord("");
      setShowWrongAnswer(false);
      setTimer(difficulty === "easy" ? 90 : difficulty === "medium" ? 60 : 45);
      setIsGameActive(true);
    }
  }, [currentRound, items, difficulty]);

  useEffect(() => {
    if (!isGameActive || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleRoundEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameActive, timer]);

  const canFormWord = (word: string, mainWord: string): boolean => {
    const mainLetters = mainWord.toLowerCase().split("");
    const wordLetters = word.toLowerCase().split("");

    for (const letter of wordLetters) {
      const index = mainLetters.indexOf(letter);
      if (index === -1) return false;
      mainLetters.splice(index, 1);
    }
    return true;
  };

  const handleWordSubmit = () => {
    if (!isGameActive || !currentWord.trim()) return;

    const word = currentWord.trim().toUpperCase();

    const isValid =
      validWords.includes(word) &&
      !foundWords.includes(word) &&
      canFormWord(word, mainWord);

    if (isValid) {
      const emptyIndex = userInputs.findIndex(
        (input, idx) => !input && !correctInputs[idx]
      );

      if (emptyIndex !== -1) {
        const newInputs = [...userInputs];
        newInputs[emptyIndex] = word;
        setUserInputs(newInputs);

        const newCorrectInputs = [...correctInputs];
        newCorrectInputs[emptyIndex] = true;
        setCorrectInputs(newCorrectInputs);

        const newFoundWords = [...foundWords, word];
        setFoundWords(newFoundWords);
        setScore((prev) => prev + word.length * 10);

        setCurrentWord("");

        if (newFoundWords.length >= targetWords) {
          handleRoundEnd();
        }
      }
    } else {
      setShowWrongAnswer(true);

      setTimeout(() => {
        setCurrentWord("");
        setShowWrongAnswer(false);
      }, 500);
    }
  };

  const handleRoundEnd = () => {
    setIsGameActive(false);

    setScore((prev) => prev + 10);

    setTimeout(() => {
      if (currentRound < items.length - 1) {
        setCurrentRound((prev) => prev + 1);
      } else {
        onGameComplete(score + 10);
      }
    }, 2000);
  };

  const remainingWords = validWords.filter(
    (word) => !foundWords.includes(word)
  );

  return (
    <>
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(100%) skewX(-15deg); }
        }
        .animate-shine { animation: shine 2.5s ease-in-out infinite; }
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop { animation: pop-in 0.3s ease-out; }
        @keyframes checkmark {
          0% { transform: scale(0) rotate(45deg); }
          50% { transform: scale(1.2) rotate(45deg); }
          100% { transform: scale(1) rotate(45deg); }
        }
        .animate-checkmark { animation: checkmark 0.4s ease-out; }
        @keyframes blink-red {
          0%, 100% { opacity: 1; }
          25%, 75% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .animate-blink-red { animation: blink-red 0.5s ease-in-out; }
      `}</style>

      <div className="h-screen bg-[url('/assets/games/wordBuilder/bg.png')] bg-cover bg-center overflow-hidden flex flex-col">
        <WordBuilderHeader score={score} timer={timer} />

        <div className="flex items-center justify-center h-12 sm:h-16 md:h-20 flex-shrink-0 px-4">
          <img
            src="/assets/games/wordBuilder/label.png"
            alt="label"
            className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] h-auto"
          />
        </div>

        <div className="flex items-center justify-center gap-1 sm:gap-2 flex-shrink-0 px-2">
          {mainWord.split("").map((letter, i) => {
            const letterCount = mainWord.length;
            const isLongWord = letterCount > 6;
            const isMediumWord = letterCount >= 5 && letterCount <= 6;

            const letterSize = isLongWord
              ? "w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16"
              : isMediumWord
              ? "w-9 h-9 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18"
              : "w-10 h-10 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20";

            const textSize = isLongWord
              ? "text-lg sm:text-2xl md:text-3xl lg:text-3xl"
              : isMediumWord
              ? "text-xl sm:text-2xl md:text-3xl lg:text-3xl"
              : "text-xl sm:text-3xl md:text-4xl lg:text-4xl";

            return (
              <div
                className={`${letterSize} rounded-lg sm:rounded-xl bg-gradient-to-br from-red-500 via-red-400 to-red-600 flex items-center justify-center relative overflow-hidden shadow-lg`}
                key={`${currentRound}-${i}`}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent -translate-x-full animate-shine"
                  style={{ animationDelay: `${i * 0.15}s`, width: "200%" }}
                />
                <div
                  className={`border border-red-200 border-2 sm:border-4 rounded-md sm:rounded-lg h-[85%] w-[85%] flex items-center justify-center font-extrabold ${textSize} relative z-10 bg-gradient-to-br from-red-300 to-red-100 text-red-600 shadow-inner`}
                >
                  {letter}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center mt-2 sm:mt-3 flex-shrink-0 px-4">
          <div className="px-4 sm:px-6 py-2 min-w-[250px] sm:min-w-[300px] text-center">
            {foundWords.length === 0 ? (
              <span className="text-lg sm:text-xl md:text-2xl font-extrabold bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 bg-clip-text text-transparent">
                Find words!
              </span>
            ) : (
              <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                {foundWords.map((word, index) => (
                  <span
                    key={index}
                    className="text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-green-600 to-green-400 text-white px-2 sm:px-3 py-1 rounded-full shadow-lg animate-pop"
                  >
                    {word}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-1 text-xs sm:text-sm text-slate-600 font-semibold">
              {foundWords.length} / {targetWords} words found
            </div>
          </div>
        </div>

        <UserInput
          mainWord={mainWord}
          disabled={!isGameActive}
          value={currentWord}
          onChange={setCurrentWord}
          onEnter={handleWordSubmit}
          wordLength={longestWordLength}
          showError={showWrongAnswer}
        />

        <div className="flex items-center justify-center mt-2 sm:mt-3 flex-shrink-0 px-4">
          <button
            onClick={handleWordSubmit}
            disabled={!isGameActive || !currentWord.trim()}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-sm sm:text-base px-4 sm:px-6 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            SUBMIT WORD
          </button>
        </div>

        <div className="flex items-center justify-center mt-2 sm:mt-4 px-2 sm:px-4 flex-shrink-0 overflow-y-auto max-h-[30vh] sm:max-h-[35vh]">
          <div
            className={`grid gap-1.5 sm:gap-2 md:gap-3 max-w-6xl w-full justify-items-center ${
              targetWords <= 4
                ? "grid-cols-2 lg:grid-cols-4"
                : targetWords <= 6
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
                : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
            }`}
          >
            {Array.from({ length: targetWords }).map((_, index) => {
              const isLongWord = longestWordLength > 6;
              const isMediumWord =
                longestWordLength >= 5 && longestWordLength <= 6;

              const containerWidth = isLongWord
                ? "w-36 sm:w-48 md:w-56 lg:w-64 xl:w-72"
                : isMediumWord
                ? "w-32 sm:w-44 md:w-52 lg:w-60 xl:w-64"
                : "w-28 sm:w-40 md:w-48 lg:w-56 xl:w-60";

              const containerHeight = isLongWord
                ? "h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36"
                : isMediumWord
                ? "h-18 sm:h-22 md:h-26 lg:h-30 xl:h-32"
                : "h-16 sm:h-20 md:h-24 lg:h-28 xl:h-30";

              const fontSize = isLongWord
                ? "text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl"
                : isMediumWord
                ? "text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
                : "text-base sm:text-xl md:text-xl lg:text-2xl xl:text-3xl";

              return (
                <div
                  key={index}
                  className={`relative ${containerWidth} ${containerHeight} ${
                    correctInputs[index] ? "opacity-90" : ""
                  }`}
                >
                  <img
                    src="/assets/games/wordBuilder/answer.png"
                    alt="word slot"
                    className="w-full h-full object-contain"
                  />
                  <input
                    type="text"
                    value={userInputs[index] || ""}
                    readOnly
                    disabled
                    maxLength={longestWordLength}
                    className={`absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[40%] text-center ${fontSize} font-bold bg-transparent outline-none border-none text-[#5a2e00] cursor-default ${
                      correctInputs[index] ? "opacity-100" : "opacity-40"
                    }`}
                  />
                  {correctInputs[index] && (
                    <div className="absolute top-1/2 right-0.5 sm:right-1 md:right-2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-checkmark border-2 border-white">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {!isGameActive && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] animate-pop p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl text-center max-w-xs sm:max-w-md w-full border-2 sm:border-4 border-blue-500">
              {foundWords.length >= targetWords ? (
                <>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-green-600 mb-2">
                    PERFECT!
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-3 sm:mb-4">
                    Round {currentRound + 1} Complete
                  </p>
                  <div className="bg-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border-2 border-green-200">
                    <span className="text-green-600 font-bold text-sm sm:text-base md:text-lg">
                      ✨ All {targetWords} words found! ✨
                    </span>
                    <div className="mt-2 text-green-700 font-semibold text-sm sm:text-base">
                      🎁 Round Bonus: +10 points
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-red-600 mb-2">
                    TIME'S UP!
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-3 sm:mb-4">
                    Round {currentRound + 1} Complete
                  </p>
                  <div className="bg-slate-100 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                    <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest mb-2">
                      You found {foundWords.length} / {targetWords} words
                    </p>
                    <div className="mt-2 text-slate-600 font-semibold text-xs sm:text-sm">
                      🎁 Round Bonus: +10 points
                    </div>
                    {remainingWords.length > 0 && (
                      <>
                        <p className="text-xs text-slate-400 mb-2 mt-3">
                          Some words you missed:
                        </p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                          {remainingWords.slice(0, 6).map((word, i) => (
                            <span
                              key={i}
                              className="bg-white text-blue-500 px-2 sm:px-3 py-1 rounded-lg font-bold shadow-sm text-xs sm:text-sm"
                            >
                              {word}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
              <div className="bg-blue-50 rounded-lg p-2.5 sm:p-3 mt-3 border border-blue-200">
                <div className="text-xl sm:text-2xl font-bold text-slate-800">
                  Total Score: <span className="text-green-600">{score}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Words earned:{" "}
                  {foundWords.reduce((sum, word) => sum + word.length * 10, 0)}{" "}
                  points
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WordBuilderPlayzone;
