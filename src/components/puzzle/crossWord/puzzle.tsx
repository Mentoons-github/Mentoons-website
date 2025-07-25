import { useState, useRef, useEffect } from "react";

type Cell = {
  answer: string | null;
  number?: number;
};

const grid: Cell[][] = [
  [
    { answer: "C", number: 1 }, // 1 Across (CAT), 3 Down (CAR)
    { answer: "A" },
    { answer: "T", number: 6 }, // 6 Down (ASK)
    { answer: null },
    { answer: null },
    { answer: null },
    { answer: null },
    { answer: null },
  ],
  [
    { answer: "A", number: 2 }, // 2 Across (ART)
    { answer: "R" },
    { answer: "T" },
    { answer: null },
    { answer: null },
    { answer: null },
    { answer: null },
    { answer: null },
  ],
  [
    { answer: "R", number: 3 }, // 3 Down (CAR)
    { answer: null },
    { answer: null },
    { answer: null },
    { answer: "N", number: 4 }, // 4 Across (SUN), 7 Down (NUT)
    { answer: "U" },
    { answer: "E", number: 8 }, // 8 Down (EYE)
    { answer: null },
  ],
  [
    { answer: null },
    { answer: null },
    { answer: null },
    { answer: null },
    { answer: "U" },
    { answer: null },
    { answer: "Y" },
    { answer: null },
  ],
  [
    { answer: null },
    { answer: null },
    { answer: null },
    { answer: "K", number: 5 }, // 5 Across (KITE)
    { answer: "T" },
    { answer: null },
    { answer: "E" },
    { answer: null },
  ],
  [
    { answer: null },
    { answer: null },
    { answer: null },
    { answer: null },
    { answer: null },
    { answer: null },
    { answer: null },
    { answer: null },
  ],
  [
    { answer: null },
    { answer: null },
    { answer: null },
    { answer: null },
    { answer: null },
    { answer: null },
    { answer: null },
    { answer: null },
  ],
];

const clues = {
  across: [
    { number: 1, clue: "A small pet that meows", answer: "CAT" },
    { number: 2, clue: "Form of creative expression", answer: "ART" },
    { number: 4, clue: "Bright star in our solar system", answer: "SUN" },
    { number: 5, clue: "Object that flies in the sky", answer: "KITE" },
  ],
  down: [
    { number: 3, clue: "A vehicle with four wheels", answer: "CAR" },
    { number: 6, clue: "To inquire or question", answer: "ASK" },
    { number: 7, clue: "Edible seed or a small fruit", answer: "NUT" },
    { number: 8, clue: "Organ of sight", answer: "EYE" },
  ],
};

type Direction = "across" | "down";

const CrossWordPuzzle = () => {
  const [userInput, setUserInput] = useState(
    grid.map((row) => row.map((cell) => (cell?.answer ? "" : null)))
  );
  const [showResult, setShowResult] = useState(false);
  const [activeCell, setActiveCell] = useState<[number, number] | null>(null);
  const [direction, setDirection] = useState<Direction>("across");
  const [selectedClue, setSelectedClue] = useState<number | null>(null);
  const [hints, setHints] = useState<Set<number>>(new Set());
  const [completedWords, setCompletedWords] = useState<Set<number>>(new Set());

  const inputRefs = useRef<(HTMLInputElement | null)[][]>(
    grid.map((row) => row.map(() => null))
  );

  const handleChange = (
    row: number,
    col: number,
    val: string,
    autoAdvance = true
  ) => {
    // const updated = [...userInput];
    // updated[row][col] = val.toUpperCase().slice(0, 1);
    // setUserInput(updated);

    if (val && autoAdvance) {
      moveToNextCell(row, col);
    }

    checkWordCompletion();
  };

  const checkWordCompletion = () => {
    const newCompleted = new Set<number>();

    [...clues.across, ...clues.down].forEach((clue) => {
      const cells = getWordCells(clue.number);
      const isComplete = cells.every(([r, c]) => {
        const userAnswer = userInput[r][c];
        const correctAnswer = grid[r][c]?.answer;
        return userAnswer === correctAnswer;
      });

      if (isComplete) {
        newCompleted.add(clue.number);
      }
    });

    setCompletedWords(newCompleted);
  };

  const getWordCells = (clueNumber: number) => {
    const cells: [number, number][] = [];

    let startRow = -1,
      startCol = -1;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c]?.number === clueNumber) {
          startRow = r;
          startCol = c;
          break;
        }
      }
    }

    if (startRow === -1 || startCol === -1) return cells;

    const isAcross = clues.across.some((clue) => clue.number === clueNumber);

    if (isAcross) {
      for (
        let c = startCol;
        c < grid[startRow].length && grid[startRow][c]?.answer;
        c++
      ) {
        cells.push([startRow, c]);
      }
    } else {
      for (
        let r = startRow;
        r < grid.length && grid[r]?.[startCol]?.answer;
        r++
      ) {
        cells.push([r, startCol]);
      }
    }

    return cells;
  };

  const moveToNextCell = (row: number, col: number) => {
    let r = row;
    let c = col;

  //   while (true) {
  //     if (direction === "across") c++;
  //     else r++;

  //     if (r >= grid.length || c >= grid[0].length) return;
  //     const nextCell = grid[r]?.[c];
  //     if (nextCell && nextCell.answer) {
  //       inputRefs.current[r][c]?.focus();
  //       setActiveCell([r, c]);
  //       break;
  //     }
  //   }
  // };

  const moveToPreviousCell = (row: number, col: number) => {
    let r = row;
    let c = col;

    while (true) {
      if (direction === "across") c--;
      else r--;

      if (r < 0 || c < 0) return;
      const prevCell = grid[r]?.[c];
      if (prevCell && prevCell.answer) {
        inputRefs.current[r][c]?.focus();
        setActiveCell([r, c]);
        break;
      }
    }
  };

  const isCorrect = (row: number, col: number) => {
    const cell = grid[row][col];
    if (!cell?.answer) return true;
    return userInput[row][col] === cell.answer;
  };

  const allCorrect = grid.every((row, r) =>
    row.every((cell, c) => {
      if (!cell?.answer) return true;
      return userInput[r][c] === cell.answer;
    })
  );

  const handleCellClick = (r: number, c: number) => {
    setActiveCell([r, c]);
    inputRefs.current[r][c]?.focus();

    if (grid[r][c]?.number) {
      const num = grid[r][c]?.number;
      const isAcross = clues.across.some((clue) => clue.number === num);
      setDirection(isAcross ? "across" : "down");
      setSelectedClue(num);
    }
  };

  const handleClueClick = (clueNumber: number, dir: Direction) => {
    setSelectedClue(clueNumber);
    setDirection(dir);

    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c]?.number === clueNumber) {
          setActiveCell([r, c]);
          inputRefs.current[r][c]?.focus();
          return;
        }
      }
    }
  };

  const getHint = (clueNumber: number) => {
    const clue = [...clues.across, ...clues.down].find(
      (c) => c.number === clueNumber
    );
    if (!clue) return;

    const cells = getWordCells(clueNumber);
    const emptyCell = cells.find(([r, c]) => !userInput[r][c]);

    if (emptyCell) {
      const [r, c] = emptyCell;
      // const updated = [...userInput];
      // updated[r][c] = grid[r][c]?.answer || "";
      // setUserInput(updated);
      setHints((prev) => new Set([...prev, clueNumber]));
    }
  };

  const getCellHighlight = (r: number, c: number) => {
    if (!activeCell) return "";

    const [activeR, activeC] = activeCell;

    if (r === activeR && c === activeC) {
      return "ring-2 ring-blue-500 bg-blue-50";
    }

    if (selectedClue && grid[r][c]?.answer) {
      const wordCells = getWordCells(selectedClue);
      const isInWord = wordCells.some(([wr, wc]) => wr === r && wc === c);
      if (isInWord) {
        return "bg-blue-100";
      }
    }

    return "";
  };

  const progress = () => {
    const totalCells = grid.flat().filter((cell) => cell?.answer).length;
    const filledCells = userInput
      .flat()
      .filter((cell) => cell && cell !== "").length;
    return Math.round((filledCells / totalCells) * 100);
  };

  useEffect(() => {
    checkWordCompletion();
  }, [userInput]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">
          🧩 Balanced Crossword Puzzle
        </h1>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-medium text-gray-600">
              {progress()}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress()}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="inline-block bg-gray-800 p-2 rounded-lg shadow-lg">
              <div
                className="grid gap-[1px]"
                style={{
                  gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
                }}
              >
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const isBlock = cell?.answer === null;
                    const val = userInput[rowIndex][colIndex];
                    const highlight = getCellHighlight(rowIndex, colIndex);

                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`relative w-12 h-12 cursor-pointer transition-all duration-150 ${
                          isBlock
                            ? "bg-gray-800"
                            : `bg-white hover:bg-gray-50 border border-gray-300 ${highlight}`
                        }`}
                        onClick={() =>
                          !isBlock && handleCellClick(rowIndex, colIndex)
                        }
                      >
                        {cell?.number && !isBlock && (
                          <div className="absolute top-0.5 left-1 text-[10px] font-bold text-gray-600 z-10">
                            {cell.number}
                          </div>
                        )}

                        {!isBlock && (
                          <input
                            ref={(el) => {
                              inputRefs.current[rowIndex][colIndex] = el;
                            }}
                            type="text"
                            maxLength={1}
                            value={val ?? ""}
                            onChange={(e) =>
                              handleChange(rowIndex, colIndex, e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Backspace" && !val) {
                                moveToPreviousCell(rowIndex, colIndex);
                              }
                              if (e.key === "ArrowRight")
                                moveToNextCell(rowIndex, colIndex);
                              if (e.key === "ArrowLeft")
                                moveToPreviousCell(rowIndex, colIndex);
                            }}
                            className={`w-full h-full text-center text-lg font-bold uppercase outline-none border-none bg-transparent ${
                              showResult
                                ? isCorrect(rowIndex, colIndex)
                                  ? "text-green-700"
                                  : "text-red-700"
                                : "text-gray-800"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowResult(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md font-medium"
              >
                ✓ Check Answers
              </button>
              <button
                onClick={() => {
                  setShowResult(false);
                  setUserInput(
                    grid.map((row) =>
                      row.map((cell) => (cell?.answer ? "" : null))
                    )
                  );
                  setHints(new Set());
                  setCompletedWords(new Set());
                }}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md font-medium"
              >
                🔄 Reset
              </button>
            </div>

            {showResult && (
              <div className="text-center text-lg font-medium mt-6 p-4 rounded-lg">
                {allCorrect ? (
                  <div className="bg-green-100 text-green-800 border border-green-200 rounded-lg p-4">
                    🎉 Fantastic! You solved the entire puzzle! 🎉
                  </div>
                ) : (
                  <div className="bg-red-100 text-red-800 border border-red-200 rounded-lg p-4">
                    ❌ Some answers need work. Keep trying! You've got this! 💪
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 max-w-md">
            <div className="bg-gray-50 rounded-lg p-4 shadow-inner">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-3 text-gray-800 border-b pb-2">
                    ➡️ Across
                  </h2>
                  <div className="space-y-2">
                    {clues.across.map(({ number, clue }) => (
                      <div
                        key={number}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedClue === number && direction === "across"
                            ? "bg-blue-200 border-l-4 border-blue-500"
                            : completedWords.has(number)
                            ? "bg-green-100 border-l-4 border-green-500"
                            : "bg-white hover:bg-gray-100 border-l-4 border-transparent"
                        }`}
                        onClick={() => handleClueClick(number, "across")}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <span className="font-bold text-blue-600">
                              {number}.
                            </span>
                            <span className="ml-2 text-gray-700">{clue}</span>
                            {completedWords.has(number) && (
                              <span className="ml-2 text-green-600">✓</span>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              getHint(number);
                            }}
                            className="ml-2 px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                            title="Get a hint"
                          >
                            💡
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-3 text-gray-800 border-b pb-2">
                    ⬇️ Down
                  </h2>
                  <div className="space-y-2">
                    {clues.down.map(({ number, clue }) => (
                      <div
                        key={number}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedClue === number && direction === "down"
                            ? "bg-blue-200 border-l-4 border-blue-500"
                            : completedWords.has(number)
                            ? "bg-green-100 border-l-4 border-green-500"
                            : "bg-white hover:bg-gray-100 border-l-4 border-transparent"
                        }`}
                        onClick={() => handleClueClick(number, "down")}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <span className="font-bold text-blue-600">
                              {number}.
                            </span>
                            <span className="ml-2 text-gray-700">{clue}</span>
                            {completedWords.has(number) && (
                              <span className="ml-2 text-green-600">✓</span>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              getHint(number);
                            }}
                            className="ml-2 px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                            title="Get a hint"
                          >
                            💡
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {hints.size > 0 && (
                <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    💡 You've used hints for {hints.size} clue
                    {hints.size !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossWordPuzzle;
