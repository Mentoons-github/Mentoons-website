import { Difficulty } from "@/constant/adda/game/brainStack";
import { LEVEL_CONFIG } from "@/constant/adda/game/flipAndMatch";
import { CardItem } from "@/types/adda/game";

export const setInitialTime = ({ difficulty }: { difficulty: Difficulty }) => {
  switch (difficulty) {
    case "easy":
      return 160;
    case "medium":
      return 140;
    default:
      return 100;
  }
};

const shuffleArray = <T>(array: T[]): T[] => {
  return array
    .map((v) => ({ v, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((item) => item.v);
};

export const createCardsForLevel = (level: Difficulty): CardItem[] => {
  const { pairs, emojis } = LEVEL_CONFIG[level];

  const selected = emojis.slice(0, pairs);

  const cards: CardItem[] = [];

  selected.forEach((emoji, index) => {
    cards.push({
      id: `${index}-a`,
      emoji,
      isFlipped: false,
      isMatched: false,
    });

    cards.push({
      id: `${index}-b`,
      emoji,
      isFlipped: false,
      isMatched: false,
    });
  });

  return shuffleArray(cards);
};
