import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PuzzleButtons from "./toggleButtons";
import PuzzleCard from "./puzzleCardAnimation";
import { PUZZLE_DIFFICULTY } from "@/constant/puzzle/puzzleDifficulties";
import AnimatedBackground from "./animation/animatedBackground";

export type PuzzleButton = "socialMedia" | "career" | "icons";

const Puzzle = ({ puzzle }: { puzzle: "word" | "crossWord" }) => {
  const navigate = useNavigate();
  const [selectedButton, setSelectedButton] =
    useState<PuzzleButton>("socialMedia");

  const handlePlay = (difficulty: string) => {
    //change the navigation tomorrow
    navigate(
      `/puzzle/play?difficulty=${difficulty}&puzzleType=${selectedButton}`
    );
  };

  const puzzleText = {
    word: {
      heading: "Mind-Bending",
      highlight: "Word Puzzles",
      description:
        "Challenge yourself with our collection of brain-teasing word puzzles designed to sharpen your mind.",
    },
    crossWord: {
      heading: "Classic",
      highlight: "Crossword Fun",
      description:
        "Dive into the timeless world of crosswords that test your vocabulary and logic skills.",
    },
  };

  const { heading, highlight, description } = puzzleText[puzzle];

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />

      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              {heading}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                {" "}
                {highlight}
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <PuzzleButtons
              selectedButton={selectedButton}
              setSelectedButton={setSelectedButton}
            />
          </div>

          <div className="space-y-8">
            {Object.entries(PUZZLE_DIFFICULTY).map(([key, puzzle]) => {
              const content = puzzle[selectedButton];
              return (
                <PuzzleCard
                  key={key}
                  img={puzzle.img}
                  title={content.title}
                  description={content.description}
                  difficulty={puzzle.difficulty as "Easy" | "Medium" | "Hard"}
                  onPlay={() => handlePlay(puzzle.difficulty)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Puzzle;
