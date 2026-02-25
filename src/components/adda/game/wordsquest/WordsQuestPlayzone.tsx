import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";

import {
  generatePatternRound,
  PatternItem,
} from "@/constant/adda/game/patternRace";
import PatterRaceHeader from "../patternRace/header";
import DropSlot from "../patternRace/dropSlot";
import DraggableItem from "../patternRace/draggableItem";
import WordBoard from "./WordBoard";
import { WORDS_QUEST } from "@/constant/adda/game/wordsQuest";

interface PatternRacePlayzoneProps {
  difficulty: "easy" | "medium" | "hard";
  timeOver: boolean;
  timer: number;
  onGameComplete: (score: number) => void;
  increaseRoundCount: () => void;
}

const WordsQuestPlayzone = ({
  difficulty,
  timeOver,
  onGameComplete,
  timer,
  increaseRoundCount,
}: PatternRacePlayzoneProps) => {
  const [round, setRound] = useState(() => generatePatternRound(difficulty));
  const [userPattern, setUserPattern] = useState<(PatternItem | null)[]>([]);
  const [score, setScore] = useState(0);
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [level, setLevel] = useState<number>(0);

  const currentGame = WORDS_QUEST[level];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // prevents accidental scroll
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  );

  useEffect(() => {
    setUserPattern(
      round.pattern.map((item, i) => (round.blanks.includes(i) ? null : item)),
    );
    setRoundCompleted(false);
  }, [round]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const index = Number(over.id);

    // ✅ Only allow drop on blank slots (user-fillable positions)
    if (!round.blanks.includes(index)) return;

    const selected = round.options.find((o) => o.id === active.id);
    if (!selected) return;

    setUserPattern((prev) => {
      const copy = [...prev];
      copy[index] = selected;
      return copy;
    });
  };

  const isRoundComplete =
    userPattern.length > 0 &&
    round.blanks.every((i) => userPattern[i]?.id === round.pattern[i].id);

  //   useEffect(() => {
  //     if (!isRoundComplete || roundCompleted) return;

  //     setRoundCompleted(true);

  //     setScore((prev) => prev + 10);
  //     increaseRoundCount();

  //     setTimeout(() => {
  //       setRound(generatePatternRound(difficulty));
  //     }, 700);
  //   }, [isRoundComplete, roundCompleted, difficulty, increaseRoundCount]);

  //   useEffect(() => {
  //     if (timeOver) {
  //       onGameComplete(score);
  //     }
  //   }, [score, onGameComplete, timeOver]);

  return (
    <div
      className="h-screen w-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url("${currentGame.bg}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Content */}
      {/* <div className="relative z-20">
        <PatterRaceHeader score={score} timer={timer} />
      </div> */}
      <div className="relative z- flex flex-col items-center justify-center">
        <img
          src="/assets/games/wordsQuest/characters.png"
          alt=""
          className="h-screen absolute "
        />
        <WordBoard level={level} currentGame={currentGame} />
      </div>
      <div className="absolute bottom-10 right-10">
        <button
          className="bg-[#fff000] px-3 py-1 rounded text-[#e85100] border-2 border-[#e85100]"
          onClick={() => setLevel((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default WordsQuestPlayzone;
