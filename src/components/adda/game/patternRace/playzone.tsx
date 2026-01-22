import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import DropSlot from "./dropSlot";
import DraggableItem from "./draggableItem";
import {
  generatePatternRound,
  PatternItem,
} from "@/constant/adda/game/patternRace";
import PatterRaceHeader from "./header";

interface PatternRacePlayzoneProps {
  difficulty: "easy" | "medium" | "hard";
  timeOver: boolean;
  timer: number;
  onGameComplete: (score: number) => void;
  increaseRoundCount: () => void;
}

const PatternRacePlayzone = ({
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
    })
  );

  useEffect(() => {
    setUserPattern(
      round.pattern.map((item, i) => (round.blanks.includes(i) ? null : item))
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

  useEffect(() => {
    if (!isRoundComplete || roundCompleted) return;

    setRoundCompleted(true);

    setScore((prev) => prev + 10);
    increaseRoundCount();

    setTimeout(() => {
      setRound(generatePatternRound(difficulty));
    }, 700);
  }, [isRoundComplete, roundCompleted, difficulty, increaseRoundCount]);

  useEffect(() => {
    if (timeOver) {
      onGameComplete(score);
    }
  }, [score, onGameComplete, timeOver]);

  return (
    <div
      className="h-screen w-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/assets/games/FindOddOne/bg.png')" }}
    >
      {/* Only overlay on background */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-20">
        <PatterRaceHeader score={score} timer={timer} />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center mt-24">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex justify-center flex-wrap gap-2 md:gap-4 md:mt-16">
            {userPattern.map((item, i) => (
              <DropSlot key={i} id={i.toString()} item={item as PatternItem} />
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-12">
            {round.options.map((img) => (
              <DraggableItem key={img.id} item={img} />
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default PatternRacePlayzone;
