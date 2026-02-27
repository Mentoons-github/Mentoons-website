import { WordsQuestType } from "@/types/adda/game/wordsQuestTypes";
import { LockKeyhole } from "lucide-react";
import { useRef } from "react";

// Example fixed board (replace with your 10 boards)

interface Props {
  currentGame: WordsQuestType;
  foundWords: string[];
  foundCells: number[][];
  selectedCells: number[][];
  handleMouseDown: (rowIndex: number, colIndex: number) => void;
  handleMouseEnter: (rowIndex: number, colIndex: number) => void;
  handleMouseUp: () => void;
  isDragging: boolean;
}

export default function WordBoard({
  currentGame,
  foundWords,
  foundCells,
  selectedCells,
  handleMouseDown,
  handleMouseEnter,
  handleMouseUp,
  isDragging,
}: Props) {
  const { fixedBoard, wordsToFind } = currentGame;
  const gridRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (!element) return;

    const cell = element.closest("[data-cell]");
    if (!cell) return;

    const row = Number(cell.getAttribute("data-row"));
    const col = Number(cell.getAttribute("data-col"));

    handleMouseEnter(row, col);
  };

  const leftWords = wordsToFind.slice(0, 5);
  const rightWords = wordsToFind.slice(5, 10);

  return (
    <div className="flex flex-col items-center mt-5 z-10 w-full ">
      <div
        className="lg:grid grid-cols-[130px_auto_130px] items-start gap-10 w-full md:px-20"
        ref={gridRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handleMouseUp}
        onPointerLeave={handleMouseUp}
      >
        <div className="hidden lg:flex flex-col gap-3 my-auto">
          {leftWords.map((word) => {
            const isFound = foundWords.includes(word);

            return (
              <div
                key={word}
                className={`relative px-3 py-1 rounded-md font-semibold text-center whitespace-nowrap
                            ${isFound ? "bg-green-400 text-white" : "bg-[#fff000] text-[#e85100]"}`}
              >
                {isFound ? (
                  <span>{word}</span>
                ) : (
                  <>
                    <span className="blur-sm">{word}</span>
                    <LockKeyhole
                      size={17}
                      className="absolute inset-0 m-auto text-red-600"
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="relative flex items-center flex-col lg:ml-10 ">
          <div className="hidden lg:hidden md:grid grid-cols-2 gap-2 ml-10">
            {wordsToFind.map((word) => {
              const isFound = foundWords.includes(word);
              return (
                <div
                  key={word}
                  className={`relative w-[130px] px-3 py-1 rounded-md font-semibold text-center whitespace-nowrap
                            ${isFound ? "bg-green-400 text-white" : "bg-[#fff000] text-[#e85100]"}`}
                >
                  {isFound ? (
                    <span>{word}</span>
                  ) : (
                    <>
                      <span className="blur-sm">{word}</span>
                      <LockKeyhole
                        size={17}
                        className="absolute inset-0 m-auto text-red-600"
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <h2
            className="md:text-3xl md:mt-10 lg:mt-0 w-[180px] md:w-auto text-center text-xl font-bold text-[#f1fdfb] border-2 rounded border-[#e85100] px-3 py-1 bg-[#fff000] mb-3"
            style={{ WebkitTextStroke: "1px #e85100" }}
          >
            {currentGame.title}
          </h2>
          <div className="grid grid-cols-13 gap-1 mt-10 md:mt-0 bg-gradient-to-b from-[#feaf38] to-[#aa6e07] rounded p-1.5">
            {fixedBoard.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    data-cell
                    data-row={rowIndex}
                    data-col={colIndex}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      handleMouseDown(rowIndex, colIndex);
                    }}
                    onPointerUp={handleMouseUp}
                    className={`w-6 h-6 md:w-9 md:h-9 lg:w-8 lg:h-8 flex items-center justify-center text-[16px] md:text-lg font-bold cursor-pointer select-none touch-none
                               ${
                                 foundCells.some(
                                   ([r, c]) => r === rowIndex && c === colIndex,
                                 )
                                   ? "bg-green-400 text-white"
                                   : selectedCells.some(
                                         ([r, c]) =>
                                           r === rowIndex && c === colIndex,
                                       )
                                     ? "bg-yellow-300"
                                     : "bg-white text-[#222020c9]"
                               }`}
                  >
                    {cell}
                  </div>
                );
              }),
            )}
          </div>
          <div className="grid md:hidden grid-cols-3 gap-1.5 mt-1">
            {wordsToFind.map((word) => {
              const isFound = foundWords.includes(word);
              return (
                <div
                  key={word}
                  className={`relative w-[120px] px-3 py-1 rounded-md font-semibold text-center whitespace-nowrap
                            ${isFound ? "bg-green-400 text-white" : "bg-[#fff000] text-[#e85100]"}`}
                >
                  {isFound ? (
                    <span>{word}</span>
                  ) : (
                    <>
                      <span className="blur-sm">{word}</span>
                      <LockKeyhole
                        size={17}
                        className="absolute inset-0 m-auto text-red-600"
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-3 my-auto">
          {rightWords.map((word) => {
            const isFound = foundWords.includes(word);

            return (
              <div
                key={word}
                className={`relative px-3 py-1 rounded-md font-semibold text-center whitespace-nowrap
                            ${isFound ? "bg-green-400 text-white" : "bg-[#fff000] text-[#e85100]"}`}
              >
                {isFound ? (
                  <span>{word}</span>
                ) : (
                  <>
                    <span className="blur-sm">{word}</span>
                    <LockKeyhole
                      size={17}
                      className="absolute inset-0 m-auto text-red-600"
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// function findWords(board: string[][], words: string[]) {
//   const rows = board.length;
//   const cols = board[0].length;

//   const directions = [
//     [0, 1], // →
//     [1, 0], // ↓
//     [1, 1], // ↘
//   ];

//   const results = [];

//   for (const word of words) {
//     for (let r = 0; r < rows; r++) {
//       for (let c = 0; c < cols; c++) {
//         for (const [dr, dc] of directions) {
//           if (checkWord(board, word, r, c, dr, dc)) {
//             results.push({
//               word,
//               start: [r, c],
//               direction: [dr, dc],
//             });
//           }
//         }
//       }
//     }
//   }

//   return results;
// }

// function checkWord(
//   board: string[][],
//   word: string,
//   row: number,
//   col: number,
//   dr: number,
//   dc: number,
// ) {
//   for (let i = 0; i < word.length; i++) {
//     const newRow = row + i * dr;
//     const newCol = col + i * dc;

//     if (
//       newRow < 0 ||
//       newRow >= board.length ||
//       newCol < 0 ||
//       newCol >= board[0].length ||
//       board[newRow][newCol] !== word[i]
//     ) {
//       return false;
//     }
//   }
//   return true;
// }
