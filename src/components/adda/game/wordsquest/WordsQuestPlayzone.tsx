import { useEffect, useState } from "react";

import WordBoard from "./WordBoard";
import { WORDS_QUEST } from "@/constant/adda/game/wordsQuest";
import PatterRaceHeader from "../patternRace/header";
import { ArrowRight } from "lucide-react";

interface PatternRacePlayzoneProps {
  timeOver: boolean;
  timer: number;
  onGameComplete: (roundScores: {
    title: string;
    score: number;
    foundWords: string[];
  }) => void;
  increaseRoundCount: () => void;
  decreaswRoundCount?: () => void;
  roundCount: number;
  resetTimer: () => void;
}

const WordsQuestPlayzone = ({
  timeOver,
  onGameComplete,
  timer,
  increaseRoundCount,
  // decreaswRoundCount,
  roundCount,
  resetTimer,
}: PatternRacePlayzoneProps) => {
  // const [level, setLevel] = useState<number>(0);
  const [foundCells, setFoundCells] = useState<number[][]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCells, setSelectedCells] = useState<number[][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!timeOver) return;
    handleNext();
    resetTimer();
  }, [timeOver]);

  // console.log(decreaswRoundCount);

  const currentGame = WORDS_QUEST[roundCount];

  const { fixedBoard, wordsToFind } = currentGame;

  const handleMouseDown = (row: number, col: number) => {
    setIsDragging(true);
    setSelectedCells([[row, col]]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isDragging) return;

    setSelectedCells((prev) => {
      const alreadySelected = prev.some(([r, c]) => r === row && c === col);
      if (alreadySelected) return prev;

      return [...prev, [row, col]];
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    const selectedWord = selectedCells
      .map(([r, c]) => fixedBoard[r][c])
      .join("");

    const reversedWord = selectedWord.split("").reverse().join("");

    const matchedWord = wordsToFind.find(
      (w) => w === selectedWord || w === reversedWord,
    );

    if (matchedWord) {
      setFoundWords((prev) => {
        if (prev.includes(matchedWord)) return prev;

        setFoundCells((cells) => [...cells, ...selectedCells]);
        setScore((score) => score + 1);

        return [...prev, matchedWord];
      });
    }

    setSelectedCells([]);
  };

  const handleNext = () => {
    const roundData = {
      title: currentGame.title,
      score,
      foundWords,
    };

    if (roundCount + 1 >= WORDS_QUEST.length) {
      onGameComplete(roundData);
      return;
    }

    onGameComplete(roundData); // send every round up
    increaseRoundCount();

    setScore(0);
    setSelectedCells([]);
    setFoundCells([]);
    setFoundWords([]);
    resetTimer();
  };

  // const handlePrevious = () => {
  //   decreaswRoundCount();
  // };
  

  return (
    <div
      className="h-screen w-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url("${currentGame.bg}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-20">
        <PatterRaceHeader score={score} timer={timer} roundCount={roundCount} />
      </div>
      <div className="relative flex flex-col items-center justify-center">
        <img
          src="/assets/games/wordsQuest/characters1.png"
          alt=""
          className="block absolute -top-14 md:-top-20 -bottom-5 left-1/2 -translate-x-1/2 w-full  lg:w-[85%] lg:h-auto lg:object-contain"
        />
        <WordBoard
          currentGame={currentGame}
          foundCells={foundCells}
          foundWords={foundWords}
          handleMouseDown={handleMouseDown}
          handleMouseEnter={handleMouseEnter}
          handleMouseUp={handleMouseUp}
          selectedCells={selectedCells}
          isDragging={isDragging}
        />
      </div>
      <div className="absolute bottom-4  lg:top-28 right-10 z-10">
        <button
          className="bg-[#c66930] flex items-center justify-center gap-2 px-3 py-1 rounded text-lg font-bold text-white border-2 border-white hover:scale-105 active:scale-95 transition-all duration-200 flex-shrink-0"
          onClick={handleNext}
        >
          {roundCount === WORDS_QUEST.length - 1 ? "Finish" : "Next"}
          <ArrowRight />
        </button>
      </div>
      <div className="absolute bottom-4  lg:top-28 left-10 z-10">
        {/* <button
          className="bg-[#c66930] flex items-center justify-center gap-2 px-3 py-1 rounded text-lg font-bold text-white border-2 border-white hover:scale-105 active:scale-95 transition-all duration-200 flex-shrink-0"
          // onClick={handlePrevious}
        >
          <ArrowLeft />
          Previous
        </button> */}
      </div>
    </div>
  );
};

export default WordsQuestPlayzone;
