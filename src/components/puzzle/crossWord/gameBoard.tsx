import { Cell } from "@/types";
import React, { RefObject } from "react";

interface GameBoardProps {
  grid: Cell[][];
  userInput: (string | null)[][];
  letterPop: string;
  showResult: boolean;
  inputRefs: RefObject<(HTMLInputElement | null)[][]>;
  getCellHighlight: (row: number, col: number) => string;
  isCorrect: (row: number, col: number) => boolean;
  handleCellClick: (row: number, col: number) => void;
  handleChange: (row: number, col: number, value: string) => void;
  handleKeyDown: (
    row: number,
    col: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => void;
}

const GameBoard = ({
  grid,
  userInput,
  letterPop,
  showResult,
  inputRefs,
  getCellHighlight,
  isCorrect,
  handleCellClick,
  handleChange,
  handleKeyDown,
}: GameBoardProps) => {
  // Calculate responsive cell size based on grid dimensions and screen size
  const gridSize = Math.max(grid.length, grid[0]?.length || 0);
  const getCellSize = () => {
    if (gridSize <= 10)
      return "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14";
    if (gridSize <= 15)
      return "w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12";
    return "w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-8 lg:h-8";
  };

  const cellSizeClass = getCellSize();

  return (
    <div className="bg-gradient-to-br from-white via-yellow-50 to-saffron-50 p-3 sm:p-4 md:p-6 lg:p-8 rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl border-2 sm:border-4 border-yellow-400 backdrop-blur-sm relative overflow-hidden w-full max-w-full">
      {/* Decorative background patterns - Responsive */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 w-4 sm:w-6 lg:w-8 h-4 sm:h-6 lg:h-8 bg-saffron-400 rounded-full animate-pulse"></div>
        <div className="absolute top-4 sm:top-8 right-4 sm:right-8 w-3 sm:w-4 lg:w-6 h-3 sm:h-4 lg:h-6 bg-orange-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-2 sm:bottom-4 left-4 sm:left-8 w-5 sm:w-7 lg:w-10 h-5 sm:h-7 lg:h-10 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 sm:bottom-8 right-2 sm:right-4 w-2 sm:w-3 lg:w-4 h-2 sm:h-3 lg:h-4 bg-saffron-500 rounded-full animate-bounce"></div>
      </div>

      <div className="relative z-10 flex justify-center">
        <div
          className="inline-grid gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 xl:gap-2.5 p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 bg-gradient-to-br from-yellow-100/50 to-orange-100/50 rounded-xl lg:rounded-2xl border border-saffron-300"
          style={{
            gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${grid.length}, minmax(0, 1fr))`,
          }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isBlocked = cell?.isBlocked;
              const hasNumber = cell?.number;
              const userValue = userInput[r] ? userInput[r][c] : "";
              const isPopping =
                letterPop === `${r}-${c}` || letterPop === `${r}-${c}-hint`;
              const isHint = letterPop === `${r}-${c}-hint`;

              if (isBlocked) {
                return (
                  <div
                    key={`${r}-${c}`}
                    className={`${cellSizeClass} bg-gradient-to-br from-saffron-600 via-orange-600 to-yellow-600 rounded-md lg:rounded-lg shadow-inner border border-saffron-700`}
                  ></div>
                );
              }

              return (
                <div key={`${r}-${c}`} className="relative">
                  <input
                    ref={(el) => {
                      if (inputRefs.current && inputRefs.current[r]) {
                        inputRefs.current[r][c] = el;
                      }
                    }}
                    type="text"
                    value={userValue || ""}
                    onChange={(e) => handleChange(r, c, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(r, c, e)}
                    onClick={() => handleCellClick(r, c)}
                    className={`
                      ${cellSizeClass} text-center text-xs sm:text-sm md:text-base lg:text-lg font-black
                      border-2 rounded-md lg:rounded-lg transition-all duration-300 uppercase
                      focus:outline-none focus:scale-105 lg:focus:scale-110 cursor-pointer
                      ${getCellHighlight(r, c)}
                      ${
                        showResult
                          ? isCorrect(r, c)
                            ? "bg-gradient-to-br from-green-200 via-emerald-100 to-green-300 border-green-400 text-green-800 shadow-md lg:shadow-lg"
                            : "bg-gradient-to-br from-red-200 via-pink-100 to-red-300 border-red-400 text-red-800 shadow-md lg:shadow-lg animate-shake"
                          : "bg-gradient-to-br from-white via-yellow-50 to-orange-50 border-yellow-300 text-saffron-800 hover:shadow-md lg:hover:shadow-xl hover:border-orange-400"
                      }
                      ${
                        isPopping
                          ? isHint
                            ? "animate-bounce bg-gradient-to-br from-blue-200 to-cyan-200 border-blue-400 scale-110 lg:scale-125"
                            : "animate-pulse scale-105 lg:scale-110 shadow-lg lg:shadow-2xl"
                          : ""
                      }
                    `}
                  />
                  {hasNumber && (
                    <span className="absolute -top-0.5 sm:-top-1 -left-0.5 sm:-left-1 text-xs sm:text-sm font-black bg-gradient-to-r from-saffron-500 to-orange-500 text-orange-800 rounded-full w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 flex items-center justify-center shadow-md border border-white">
                      <span className="text-xs sm:text-sm lg:text-base leading-none">
                        {hasNumber}
                      </span>
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
