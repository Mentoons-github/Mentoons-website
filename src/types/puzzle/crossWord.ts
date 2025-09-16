export type Cell = {
  answer: string | null;
  number?: number;
  isBlocked?: boolean;
};

export type Clue = {
  number: number;
  clue: string;
  answer: string;
  startRow: number;
  startCol: number;
  direction: "across" | "down";
};
