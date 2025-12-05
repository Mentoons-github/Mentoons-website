import {
  getOperator,
  PUZZLE_DATA,
  PuzzleElement,
  SEGMENTS_TO_DIGIT,
  SegmentValues,
} from "@/constant/adda/game/stickMaster";
import { Difficulty } from "@/types/adda/game";
import React, { useCallback, useEffect, useMemo, useState } from "react";

interface Props {
  difficulty: Difficulty;
  onGameComplete: (score: number, totalRounds: number) => void;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

const computeEquation = (puz: PuzzleElement[]) => {
  const parts = puz.map((el) =>
    el.type === "operator"
      ? el.segments.length === 0
        ? "="
        : getOperator(el.segments)
      : SEGMENTS_TO_DIGIT[el.segments.join("") || ""] || "?"
  );
  return parts.join("");
};

const isValid = (eq: string) => {
  const m = eq.match(/^(\d+)([+-])(\d+)=(-?\d+)$/);
  if (!m) return false;
  const [, a, op, b, c] = m;
  const x = parseInt(a),
    y = parseInt(b),
    r = parseInt(c);
  const result = op === "+" ? x + y : x - y;
  return result === r;
};

const Digit = React.memo(({ el, i, click, picked }: any) => {
  const cls = ["h", "v", "v", "h", "v", "v", "h"];
  return (
    <div className="digit-container">
      {el.segments.map((on: number, j: number) => {
        const isPickable = on === 1 && !picked;
        const isPlaceable =
          on === 0 && picked && !(picked.pos === i && picked.seg === j);
        const isHighlighted = picked?.pos === i && picked?.seg === j;

        return (
          <div
            key={j}
            className={`segment ${cls[j]} ${on ? "active-stick" : "off"} ${
              isHighlighted ? "picked-stick" : ""
            } ${isPickable ? "pickable" : ""} ${
              isPlaceable ? "placeable" : ""
            }`}
            onClick={() => click(i, j, on as SegmentValues)}
          />
        );
      })}
    </div>
  );
});

const Op = React.memo(({ el, i, click, picked }: any) => {
  const h = el.segments[0] === 1;
  const v = el.segments[1];
  const isPickable = v === 1 && !picked;
  const isPlaceable =
    v === 0 && picked && !(picked.pos === i && picked.seg === 1);
  const isHighlighted = picked?.pos === i && picked?.seg === 1;

  return (
    <div className="operator-container">
      <div className={`operator-segment h-op ${h ? "active-stick" : "off"}`} />
      <div
        className={`operator-segment v-op ${v === 1 ? "active-stick" : "off"} ${
          isHighlighted ? "picked-stick" : ""
        } ${isPickable ? "pickable" : ""} ${isPlaceable ? "placeable" : ""}`}
        onClick={() => click(i, 1, v)}
      />
    </div>
  );
});

const StickMasterPlayzone: React.FC<Props> = ({
  difficulty,
  onGameComplete,
  score,
  setScore,
}) => {
  const puzzles = PUZZLE_DATA.filter((p) => p.difficulty === difficulty);

  const [idx, setIdx] = useState(0);
  const [puz, setPuz] = useState<PuzzleElement[]>([]);
  const [picked, setPicked] = useState<{ pos: number; seg: number } | null>(
    null
  );
  const [msg, setMsg] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [active, setActive] = useState(true);
  const [gameCompleted, setGameCompleted] = useState(false);

  const current = puzzles[idx];
  const eq = useMemo(() => computeEquation(puz), [puz]);

  const loadPuzzle = useCallback(
    (i: number) => {
      if (i >= puzzles.length) {
        setGameCompleted(true);
        onGameComplete(score, puzzles.length);
        return;
      }
      const p = puzzles[i];
      setIdx(i);
      setPuz(
        p.initial.map((el) => ({
          ...el,
          segments: [...el.segments] as SegmentValues[],
        }))
      );
      setPicked(null);
      setMsg(`Move exactly ONE stick to fix the equation`);
      setTimeLeft(p.timeLimit);
      setActive(true);
    },
    [puzzles, score, onGameComplete]
  );

  useEffect(() => {
    if (puzzles.length > 0 && !gameCompleted) {
      loadPuzzle(0);
    }
  }, [difficulty]);

  useEffect(() => {
    if (!active || timeLeft <= 0 || gameCompleted) return;
    const t = setInterval(
      () =>
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setActive(false);
            setMsg("Time's up! Moving to next puzzle...");
            setTimeout(() => loadPuzzle(idx + 1), 1500);
            return 0;
          }
          return prev - 1;
        }),
      1000
    );
    return () => clearInterval(t);
  }, [active, timeLeft, idx, loadPuzzle, gameCompleted]);

  const handleClick = useCallback(
    (pos: number, seg: number, on: SegmentValues) => {
      if (!active || gameCompleted) return;

      if (!picked) {
        if (on === 0) return setMsg("Click a glowing stick to pick it up");
        if (pos === 3) return setMsg("Cannot move the equals sign");
        if (pos === 1 && seg === 0)
          return setMsg("Only the vertical stick of +/− can be moved");

        setPuz((prev) =>
          prev.map((el, i) =>
            i === pos
              ? {
                  ...el,
                  segments: el.segments.map((s, j) =>
                    j === seg ? 0 : s
                  ) as SegmentValues[],
                }
              : el
          )
        );
        setPicked({ pos, seg });
        setMsg("Stick picked! Now click an empty slot to place it");
        return;
      }

      if (picked.pos === pos && picked.seg === seg) {
        setPuz((prev) =>
          prev.map((el, i) =>
            i === pos
              ? {
                  ...el,
                  segments: el.segments.map((s, j) =>
                    j === seg ? 1 : s
                  ) as SegmentValues[],
                }
              : el
          )
        );
        setPicked(null);
        setMsg("Stick unselected");
        return;
      }

      if (on === 1) return setMsg("That slot already has a stick!");

      const newPuz = puz.map((el, i) =>
        i === pos
          ? {
              ...el,
              segments: el.segments.map((s, j) =>
                j === seg ? 1 : s
              ) as SegmentValues[],
            }
          : el
      );

      setPuz(newPuz);
      setPicked(null);
      setActive(false);
      setMsg("Checking your solution...");

      const finalEq = computeEquation(newPuz);

      setTimeout(() => {
        if (isValid(finalEq)) {
          const points = 10;

          if (idx === puzzles.length - 1) {
            setScore((s) => {
              const finalScore = s + points;
              setMsg(`Correct! +${points} pts → ${finalEq}`);

              setTimeout(() => {
                onGameComplete(finalScore, puzzles.length);
                setGameCompleted(true);
              }, 2000);

              return finalScore;
            });
          } else {
            setScore((s) => s + points);
            setMsg(`Correct! +${points} pts → ${finalEq}`);
            setTimeout(() => loadPuzzle(idx + 1), 1500);
          }
        } else {
          setMsg(`Not quite right → ${finalEq}`);
          setTimeout(() => loadPuzzle(idx + 1), 2000);
        }
      }, 800);
    },
    [
      puz,
      picked,
      active,
      idx,
      loadPuzzle,
      onGameComplete,
      puzzles.length,
      gameCompleted,
    ]
  );

  const styles = `
  .digit-container, .operator-container {
    position: relative;
    width: 60px;
    height: 100px;
    margin: 0 8px;
  }
  .segment, .operator-segment {
    position: absolute;
    background: #dc2626;
    border-radius: 4px;
    transition: all 0.3s ease;
    cursor: pointer;
  }
  .active-stick {
    background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
    box-shadow: 0 0 20px rgba(251, 146, 60, 0.7), 0 4px 12px rgba(251, 146, 60, 0.4);
  }
  .off { background: #374151; opacity: 0.3; cursor: default; }
  .pickable { cursor: pointer; animation: pulse 2s infinite; }
  .pickable:hover { transform: scale(1.08); box-shadow: 0 0 30px rgba(251, 146, 60, 1), 0 6px 18px rgba(251, 146, 60, 0.6); }
  .placeable { background: #374151 !important; border: 2px dashed #fbbf24; opacity: 0.6 !important; cursor: pointer; animation: placeable-pulse 1.5s infinite; }
  .placeable:hover { opacity: 0.9 !important; border-color: #fcd34d; background: #4b5563 !important; }
  .picked-stick { opacity: 0.3 !important; border: 2px solid #ef4444; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
  @keyframes placeable-pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 0.8; } }
  .h { width: 48px; height: 8px; }
  .v { width: 8px; height: 48px; }
  .digit-container > div:nth-child(1) { top: 4px; left: 6px; }
  .digit-container > div:nth-child(2) { top: 8px; right: 0; }
  .digit-container > div:nth-child(3) { bottom: 8px; right: 0; }
  .digit-container > div:nth-child(4) { bottom: 4px; left: 6px; }
  .digit-container > div:nth-child(5) { bottom: 8px; left: 0; }
  .digit-container > div:nth-child(6) { top: 8px; left: 0; }
  .digit-container > div:nth-child(7) { top: 46px; left: 6px; }
  .h-op { width: 48px; height: 8px; top: 50%; left: 50%; transform: translate(-50%, -50%); }
  .v-op { width: 8px; height: 48px; top: 50%; left: 50%; transform: translate(-50%, -50%); }
  .eq { font-size: 4rem; color: #fb923c; padding: 0 20px; font-weight: 700; }
  @media(max-width: 768px) {
    .digit-container, .operator-container { width: 45px; height: 75px; margin: 0 6px; }
    .h { width: 36px; height: 6px; }
    .v { width: 6px; height: 36px; }
    .digit-container > div:nth-child(7) { top: 34px; }
    .eq { font-size: 3rem; padding: 0 12px; }
  }
  @media(max-width: 480px) {
    .digit-container, .operator-container { width: 35px; height: 60px; margin: 0 4px; }
    .h { width: 28px; height: 5px; }
    .v { width: 5px; height: 28px; }
    .digit-container > div:nth-child(1) { top: 3px; left: 4px; }
    .digit-container > div:nth-child(4) { bottom: 3px; left: 4px; }
    .digit-container > div:nth-child(7) { top: 27px; left: 4px; }
    .h-op { width: 28px; height: 5px; }
    .v-op { width: 5px; height: 28px; }
    .eq { font-size: 2.5rem; padding: 0 8px; }
  }
  `;

  if (!current || gameCompleted) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-3 sm:p-6 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-base sm:text-xl font-bold">
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 px-4 py-2 sm:px-6 sm:py-3 rounded-xl border border-yellow-500/30 backdrop-blur">
                <span className="text-gray-300">Score:</span>{" "}
                <span className="text-yellow-400 text-xl sm:text-2xl">
                  {score}
                </span>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 px-4 py-2 sm:px-6 sm:py-3 rounded-xl border border-cyan-500/30 backdrop-blur">
                <span className="text-gray-300">Round:</span>{" "}
                <span className="text-cyan-400 text-xl sm:text-2xl">
                  {idx + 1}/{puzzles.length}
                </span>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 px-4 py-2 sm:px-6 sm:py-3 rounded-xl border border-green-500/30 backdrop-blur">
                <span className="text-gray-300">Time:</span>{" "}
                <span
                  className={`text-xl sm:text-2xl ${
                    timeLeft <= 10
                      ? "text-red-500 animate-pulse"
                      : "text-green-400"
                  }`}
                >
                  {timeLeft}s
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl border-2 border-orange-500/30">
            <div className="text-center text-4xl sm:text-6xl lg:text-7xl font-mono text-orange-400 tracking-widest mb-6 sm:mb-8 font-bold">
              {eq}
            </div>

            <div className="flex justify-center items-center gap-2 sm:gap-4 flex-wrap mb-6">
              {puz.map((el, i) =>
                el.type === "digit" ? (
                  <Digit
                    key={i}
                    el={el}
                    i={i}
                    click={handleClick}
                    picked={picked}
                  />
                ) : i === 1 ? (
                  <Op
                    key={i}
                    el={el}
                    i={i}
                    click={handleClick}
                    picked={picked}
                  />
                ) : (
                  <div key={i} className="eq">
                    =
                  </div>
                )
              )}
            </div>

            <div className="text-center mt-6">
              <div className="bg-gray-950/70 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700 min-h-[80px] flex items-center justify-center">
                <p className="text-lg sm:text-2xl font-bold text-gray-100">
                  {msg}
                </p>
              </div>

              {picked && (
                <div className="mt-4 bg-yellow-500/20 border-2 border-yellow-500 rounded-lg sm:rounded-xl p-3 sm:p-4 animate-pulse">
                  <p className="text-base sm:text-xl text-yellow-400 font-semibold">
                    Click an empty slot (dashed outline) to place the stick or
                    click the picked stick again to unselect!
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 sm:mt-6 text-center text-gray-400 text-xs sm:text-sm">
            <p>
              Click a glowing stick to pick it up • Click a dashed slot to place
              it • Click picked stick again to unselect
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default StickMasterPlayzone;
