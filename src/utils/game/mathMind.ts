import { Difficulty } from "@/types/adda/game";

export type CardProps = {
  value: string;
  suit: "S" | "H" | "D" | "C";
};

export type Round = {
  cards: CardProps[];
  targetSum: number;
  operation?: "sum" | "difference" | "product";
};

function generateRandomCard(): CardProps {
  const values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  const suits: ("S" | "H" | "D" | "C")[] = ["S", "H", "D", "C"];

  return {
    value: values[Math.floor(Math.random() * values.length)],
    suit: suits[Math.floor(Math.random() * suits.length)],
  };
}

export const generateRounds = (difficulty: Difficulty): Round[] => {
  let numRounds = 0;
  let cardsPerRound = 0;
  let operations: ("sum" | "difference" | "product")[] = ["sum"];

  switch (difficulty) {
    case "easy":
      numRounds = 10;
      cardsPerRound = 2;
      operations = ["sum"];
      break;
    case "medium":
      numRounds = 12;
      cardsPerRound = 3;
      operations = ["sum", "difference"];
      break;
    case "hard":
      numRounds = 15;
      cardsPerRound = 4;
      operations = ["sum", "difference", "product"];
      break;
  }

  const rounds: Round[] = [];

  for (let i = 0; i < numRounds; i++) {
    const cards: CardProps[] = [];
    const numCards =
      difficulty === "hard" && Math.random() > 0.5
        ? cardsPerRound + 1
        : cardsPerRound;

    for (let j = 0; j < numCards; j++) {
      cards.push(generateRandomCard());
    }

    const operation = operations[Math.floor(Math.random() * operations.length)];

    rounds.push({
      cards,
      targetSum: 0,
      operation,
    });
  }

  return rounds;
};
