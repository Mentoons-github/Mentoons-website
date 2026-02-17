// export interface ScoringSystem {
//   heading: string;
//   point: number;
//   sub: {
//     heading: string;
//     point: number;
//     main?: string;
//     questions: {
//       question: string;
//       point: number;
//     }[];
//   }[];
// }

// Question
export interface ScoringQuestion {
  question: string;
  point: number;
}

export interface ScoringCategory {
  heading: string;
  point: number;
  questions: ScoringQuestion[];
}

export interface ScoringProgram {
  [programName: string]: ScoringCategory[];
}

export type ScoringSystem = ScoringProgram[];
