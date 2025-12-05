export interface CardItem {
  id: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export type CurrentState = "lobby" | "play" | "result";
export type Difficulty = "easy" | "medium" | "hard";
export interface Questions {
  emoji: string;
  answer: string;
}
