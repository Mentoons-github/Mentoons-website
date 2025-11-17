export interface Option {
  text: string;
  score: number;
}

export interface Question {
  _id: string;
  question: string;
  options: Option[];
}

export interface ResultRange {
  minScore: number;
  maxScore: number;
  message: string;
}

export interface QuizData {
  _id: string;
  category: string;
  questions: Question[];
  results: ResultRange[];
}