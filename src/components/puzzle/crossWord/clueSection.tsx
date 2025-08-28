import { Clue } from "@/types";
import { useState, useMemo } from "react";
import debounce from "lodash/debounce"; // Add lodash for debouncing

interface ClueSectionProps {
  title: string;
  clues: Clue[];
  selectedClue: number | null;
  direction: "across" | "down";
  completedWords: Set<string>;
  handleClueClick: (clueNumber: number, direction: "across" | "down") => void;
  getHint: (clueNumber: number) => void;
  currentDirection: "across" | "down";
}

const ClueSection = ({
  title,
  clues,
  selectedClue,
  direction,
  completedWords,
  handleClueClick,
  getHint,
  currentDirection,
}: ClueSectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedClues, setExpandedClues] = useState<Set<number>>(new Set());

  // Debounced search term update
  const debouncedSetSearchTerm = useMemo(
    () =>
      debounce((value: string) => {
        setSearchTerm(value);
      }, 300),
    []
  );

  // Memoize filtered clues
  const filteredClues = useMemo(
    () =>
      clues.filter(
        (clue) =>
          clue.clue.toLowerCase().includes(searchTerm.toLowerCase()) ||
          clue.number.toString().includes(searchTerm)
      ),
    [clues, searchTerm]
  );

  const completedCount = clues.filter((clue) =>
    completedWords.has(`${clue.number}-${clue.direction}`)
  ).length;

  const progressPercentage = (completedCount / clues.length) * 100;

  const toggleExpanded = (clueNumber: number) => {
    const newExpanded = new Set(expandedClues);
    if (newExpanded.has(clueNumber)) {
      newExpanded.delete(clueNumber);
    } else {
      newExpanded.add(clueNumber);
    }
    setExpandedClues(newExpanded);
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-yellow-200 h-fit sticky top-2 lg:top-4">
      {/* Header with progress - Responsive */}
      <div className="mb-4 lg:mb-6 text-center">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 lg:mb-3 text-orange-700">
          {title}
        </h2>

        {/* Progress bar - Responsive */}
        <div className="relative mb-3 lg:mb-4">
          <div className="h-2 lg:h-3 bg-yellow-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs lg:text-sm font-semibold text-orange-700 mt-1">
            <span>{completedCount} done</span>
            <span>{clues.length} total</span>
          </div>
        </div>

        {/* Search bar - Responsive */}
        <div className="relative mb-3 lg:mb-4">
          <input
            type="text"
            placeholder="Search clues..."
            onChange={(e) => debouncedSetSearchTerm(e.target.value)}
            className="w-full px-3 lg:px-4 py-2 pl-8 lg:pl-10 bg-white border border-yellow-200 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-yellow-100 outline-none text-xs lg:text-sm font-medium transition-all duration-200"
          />
          <div className="absolute left-2 lg:left-3 top-1/2 transform -translate-y-1/2 text-orange-400 text-sm lg:text-base">
            🔍
          </div>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                debouncedSetSearchTerm("");
              }}
              className="absolute right-2 lg:right-3 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-600 text-sm lg:text-base transition-colors duration-200"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Clues list - Responsive */}
      <div className="space-y-2 max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto">
        {filteredClues.length === 0 ? (
          <div className="text-center py-6 lg:py-8 text-orange-500">
            <div className="text-2xl lg:text-4xl mb-2">🔍</div>
            <p className="text-sm lg:text-base">No clues found</p>
          </div>
        ) : (
          filteredClues.map((clue) => {
            const isCompleted = completedWords.has(
              `${clue.number}-${clue.direction}`
            );
            const isSelected =
              selectedClue === clue.number && direction === currentDirection;
            const isExpanded = expandedClues.has(clue.number);

            return (
              <div
                key={`${clue.number}-${clue.direction}`}
                className={`
                  relative rounded-lg border p-3 lg:p-4 cursor-pointer transition-all duration-200
                  ${
                    isSelected
                      ? "bg-orange-50 border-orange-400 shadow-md"
                      : isCompleted
                      ? "bg-green-50 border-green-400 shadow-sm"
                      : "bg-white hover:bg-orange-50 hover:border-orange-300 border-gray-200"
                  }
                `}
                onClick={() => handleClueClick(clue.number, clue.direction)}
              >
                <div className="flex items-start justify-between gap-2 lg:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 lg:gap-3 mb-2">
                      <span
                        className={`
                          w-6 h-6 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center text-xs lg:text-sm font-bold border relative
                          ${
                            isCompleted
                              ? "bg-green-400 text-white border-green-500"
                              : isSelected
                              ? "bg-orange-500 text-white border-orange-600"
                              : "bg-yellow-100 text-orange-700 border-yellow-300"
                          }
                        `}
                      >
                        {clue.number}
                        {isCompleted && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 lg:w-3 lg:h-3 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-[6px] lg:text-[8px] text-white">
                              ✓
                            </span>
                          </div>
                        )}
                      </span>
                    </div>

                    <p
                      className={`
                        text-xs lg:text-sm font-medium leading-relaxed
                        ${
                          isCompleted
                            ? "text-green-800"
                            : isSelected
                            ? "text-orange-800"
                            : "text-orange-700"
                        }
                      `}
                      style={{
                        display:
                          isExpanded || clue.clue.length <= 80
                            ? "block"
                            : "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {clue.clue}
                    </p>

                    {clue.clue.length > 80 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpanded(clue.number);
                        }}
                        className="mt-1 lg:mt-2 text-xs text-orange-600 hover:text-orange-800 transition-colors duration-200"
                      >
                        {isExpanded ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>

                  {/* Action buttons - Responsive */}
                  <div className="flex flex-col gap-1 lg:gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        getHint(clue.number);
                      }}
                      className={`
                        p-1.5 lg:p-2 rounded-lg transition-all duration-200 text-center
                        ${
                          isCompleted
                            ? "bg-green-400 text-white border-green-300"
                            : "bg-yellow-400 text-white border-yellow-300 hover:bg-orange-500 hover:border-orange-400 hover:scale-105"
                        }
                      `}
                      title="Get a hint"
                    >
                      <span className="text-xs lg:text-base">💡</span>
                    </button>
                  </div>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-lg border-2 border-orange-400 pointer-events-none" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ClueSection;
