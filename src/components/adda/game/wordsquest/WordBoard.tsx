import { WordsQuestType } from "@/types/adda/game/wordsQuestTypes";
import { useEffect, useState } from "react";

// Example fixed board (replace with your 10 boards)

interface Props {
  level: number;
  currentGame: WordsQuestType;
}

export default function WordBoard({ level, currentGame }: Props) {
  const [foundCells, setFoundCells] = useState<number[][]>([]);

  const { fixedBoard, wordsToFind } = currentGame;

  const leftWords = wordsToFind.slice(0, 5);
  const rightWords = wordsToFind.slice(5, 10);

  useEffect(() => {
    const results = findWords(fixedBoard, wordsToFind);

    const highlighted: number[][] = [];

    results.forEach(({ word, start, direction }) => {
      const [r, c] = start;
      const [dr, dc] = direction;

      for (let i = 0; i < word.length; i++) {
        highlighted.push([r + i * dr, c + i * dc]);
      }
    });

    setFoundCells(highlighted);
  }, [currentGame, level]);

  return (
    <div className="flex flex-col items-center mt-10 z-10 w-full ">
      {/* Title */}
      <h2
        className="text-3xl font-bold text-[#f1fdfb] border-2 rounded border-[#e85100] px-3 py-1 bg-[#fff000] mb-6"
        style={{ WebkitTextStroke: "1px #e85100" }}
      >
        {currentGame.title}
      </h2>

      <div className="flex items-center justify-between gap-10 w-full px-20">
        <div className="flex flex-col gap-3">
          {leftWords.map((word) => (
            <span
              key={word}
              className="px-3 py-1 bg-[#fff000] text-[#e85100] rounded-md text- font-semibold text-center"
            >
              {word}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-13 gap-1 bg-gradient-to-b from-[#feaf38] to-[#aa6e07] rounded p-1.5">
          {fixedBoard.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isFound = foundCells.some(
                ([r, c]) => r === rowIndex && c === colIndex,
              );

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-8 h-8 flex items-center justify-center text-lg font-bold
                ${isFound ? "bg-green-400 text-white" : "bg-white text-[#222020c9]"}`}
                >
                  {cell}
                </div>
              );
            }),
          )}
        </div>

        <div className="flex flex-col gap-3">
          {rightWords.map((word) => (
            <span
              key={word}
              className="px-3 py-1 bg-[#fff000] text-[#e85100] rounded-md text- font-semibold text-center"
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function findWords(board: string[][], words: string[]) {
  const rows = board.length;
  const cols = board[0].length;

  const directions = [
    [0, 1], // →
    [1, 0], // ↓
    [1, 1], // ↘
  ];

  const results = [];

  for (const word of words) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        for (const [dr, dc] of directions) {
          if (checkWord(board, word, r, c, dr, dc)) {
            results.push({
              word,
              start: [r, c],
              direction: [dr, dc],
            });
          }
        }
      }
    }
  }

  return results;
}

function checkWord(
  board: string[][],
  word: string,
  row: number,
  col: number,
  dr: number,
  dc: number,
) {
  for (let i = 0; i < word.length; i++) {
    const newRow = row + i * dr;
    const newCol = col + i * dc;

    if (
      newRow < 0 ||
      newRow >= board.length ||
      newCol < 0 ||
      newCol >= board[0].length ||
      board[newRow][newCol] !== word[i]
    ) {
      return false;
    }
  }
  return true;
}
