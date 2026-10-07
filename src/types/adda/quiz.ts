export interface Option {
  text: string;
  score: number;
  isCorrect?: boolean;
}
export interface Question {
  _id: string;
  question: string;
  options: Option[];
  answer?: string;
  image?: string;
  icon?: string;
}
export interface ResultRange {
  minScore: number;
  maxScore: number;
  message: string;
}

export interface QuizData {
  _id: string;
  category: string;
  quizType?: "score" | "knowledge";
  questions: Question[];
  results: ResultRange[];
}

export interface QuizOptions {
  a: string;
  b: string;
  c: string;
  d: string;
}

export interface QuizQuestion {
  q: string;
  options: QuizOptions;
  answer: "a" | "b" | "c" | "d";
  image?: string;
}

export interface QuizCategory {
  quizId: string;
  category: string;
  questions: QuizQuestion[];
}

export interface QuizGame {
  _id: string;
  title: string;
  category: QuizCategory[];
}
