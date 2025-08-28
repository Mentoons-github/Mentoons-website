import { WordPosition } from "@/pages/v2/puzzle/puzzleContent";
import { motion } from "framer-motion";

interface GameGridProps {
  grid: string[][];
  handleMouseDown: (rowIndex: number, colIndex: number) => void;
  handleMouseEnter: (rowIndex: number, colIndex: number) => void;
  handleMouseUp: () => void;
  wordPositions: Record<string, WordPosition>;
  foundWords: Set<string>;
  currentDragPath: string[];
  getWordPositions: (
    row: number,
    col: number,
    direction: "horizontal" | "vertical",
    length: number
  ) => [number, number][];
}

const GameGrid = ({
  grid,
  handleMouseDown,
  handleMouseEnter,
  handleMouseUp,
  wordPositions,
  foundWords,
  currentDragPath,
  getWordPositions,
}: GameGridProps) => {
  const isCellInFoundWord = (row: number, col: number): boolean => {
    return Array.from(foundWords).some((word) => {
      const pos = wordPositions[word];
      if (!pos) return false;
      const positions = getWordPositions(
        pos.row,
        pos.col,
        pos.direction,
        word.length
      );
      return positions.some(([r, c]) => r === row && c === col);
    });
  };

  const isCellInCurrentDrag = (row: number, col: number): boolean => {
    return currentDragPath.includes(`${row}-${col}`);
  };

  const getCellStyle = (row: number, col: number): string => {
    if (isCellInFoundWord(row, col)) {
      return "bg-gradient-to-br from-green-300 to-green-500 border-green-600 text-white shadow-xl";
    }
    if (isCellInCurrentDrag(row, col)) {
      return "bg-gradient-to-br from-yellow-300 to-orange-400 border-orange-600 text-white shadow-xl transform scale-110";
    }
    return "bg-gradient-to-br from-yellow-50 to-orange-100 border-orange-300 text-orange-800 hover:from-yellow-200 hover:to-orange-200 hover:border-orange-500 shadow-md";
  };

  // Adjust cell size responsively
  const cellSize =
    grid.length <= 10
      ? 48
      : grid.length <= 12
      ? 40
      : grid.length <= 15
      ? 32
      : 28;

  return (
    <motion.div
      className="w-full flex justify-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
    >
      <div className="bg-gradient-to-br from-white/90 to-orange-100/90 backdrop-blur-lg rounded-3xl p-4 md:p-6 shadow-2xl border-4 border-yellow-400 max-w-full">
        <div className="overflow-auto max-w-full max-h-[80vh]">
          <motion.div
            className="grid gap-1 md:gap-2"
            style={{
              gridTemplateColumns: `repeat(${grid.length}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${grid.length}, ${cellSize}px)`,
            }}
            onMouseLeave={handleMouseUp}
          >
            {grid.map((row, rowIndex) =>
              row.map((letter, colIndex) => (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                  }}
                  className={`rounded-md md:rounded-xl border-2 text-base md:text-xl font-bold cursor-pointer flex items-center justify-center select-none transition-all duration-200 ${getCellStyle(
                    rowIndex,
                    colIndex
                  )}`}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                  onMouseUp={handleMouseUp}
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: (rowIndex + colIndex) * 0.03,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{ scale: 1.1, z: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {letter}
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameGrid;
