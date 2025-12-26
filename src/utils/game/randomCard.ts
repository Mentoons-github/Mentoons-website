import { Difficulty } from "@/types/adda/game";
import { CardProps } from "./mathMind";

interface GenerateRandomCard {
  difficulty: Difficulty;
}

interface GenerateRandomCardResult {
  cards: CardProps[];
  activeSuits: ("S" | "H" | "D" | "C")[];
}

export const generateRandomCard = ({
  difficulty,
}: GenerateRandomCard): GenerateRandomCardResult => {
  const Difficulty_Card = {
    easy: 10,
    medium: 20,
    hard: 30,
  };

  const Difficulty_Suits = {
    easy: 2, // Only 2 random suits
    medium: 3, // Only 3 random suits
    hard: 4, // All 4 suits
  };

  const cardValues = [
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

  const allSuits: ("S" | "H" | "D" | "C")[] = ["S", "H", "D", "C"];

  // Select random suits based on difficulty
  const numberOfSuits = Difficulty_Suits[difficulty];
  const shuffledSuits = [...allSuits].sort(() => Math.random() - 0.5);
  const activeSuits = shuffledSuits.slice(0, numberOfSuits);

  // Create a deck of all possible unique cards for the selected suits
  const availableCards: CardProps[] = [];
  activeSuits.forEach((suit) => {
    cardValues.forEach((value) => {
      availableCards.push({
        value,
        suit,
      });
    });
  });

  // Shuffle the available cards
  const shuffledCards = [...availableCards].sort(() => Math.random() - 0.5);

  // Pick the required number of unique cards
  const numberOfCards = Difficulty_Card[difficulty];
  const cards = shuffledCards.slice(0, numberOfCards);

  return {
    cards,
    activeSuits,
  };
};

export const getCardValue = (card: CardProps): number => {
  const valueMap: { [key: string]: number } = {
    A: 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    J: 11,
    Q: 12,
    K: 13,
  };
  return valueMap[card.value] || 0;
};

// Check if cards in a pile are in correct ascending order
export const areCardsInOrder = (cards: CardProps[]): boolean => {
  if (cards.length <= 1) return true;

  for (let i = 0; i < cards.length - 1; i++) {
    if (getCardValue(cards[i]) >= getCardValue(cards[i + 1])) {
      return false;
    }
  }
  return true;
};

// Find the correct position for a card in a sorted pile
export const findCorrectPosition = (
  pile: CardProps[],
  newCard: CardProps
): number => {
  const newCardValue = getCardValue(newCard);

  for (let i = 0; i < pile.length; i++) {
    if (getCardValue(pile[i]) > newCardValue) {
      return i; // Insert before this card
    }
  }

  return pile.length; // Insert at end
};

// Check if inserting card at position maintains order
export const isValidPosition = (
  pile: CardProps[],
  newCard: CardProps,
  position: number
): boolean => {
  const newCardValue = getCardValue(newCard);

  // Check card before (if exists)
  if (position > 0) {
    const prevCard = pile[position - 1];
    if (getCardValue(prevCard) >= newCardValue) {
      return false;
    }
  }

  // Check card after (if exists)
  if (position < pile.length) {
    const nextCard = pile[position];
    if (getCardValue(nextCard) <= newCardValue) {
      return false;
    }
  }

  return true;
};

// Insert card at specific position
export const insertCardAtPosition = (
  pile: CardProps[],
  newCard: CardProps,
  position: number
): CardProps[] => {
  const newPile = [...pile];
  newPile.splice(position, 0, newCard);
  return newPile;
};

// Remove card from specific position
export const removeCardAtPosition = (
  pile: CardProps[],
  position: number
): CardProps[] => {
  return pile.filter((_, i) => i !== position);
};
