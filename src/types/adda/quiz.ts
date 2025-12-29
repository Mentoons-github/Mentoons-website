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

export interface StaticTypes {
  artists: string;
  _id: string;
  questions: {
    _id: string;
    question: string;
    options: string[];
    answer: string;
  }[];
}

export interface QuizSetTypes {
  _id: string;
  category: string;
  type: StaticTypes[];
}
