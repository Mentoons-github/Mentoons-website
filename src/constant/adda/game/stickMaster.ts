import { Difficulty } from "./brainStack";

export type SegmentValues = 0 | 1;

export interface PuzzleElement {
  type: "digit" | "operator";
  segments: SegmentValues[];
}

interface PuzzleData {
  id: number;
  difficulty: Difficulty;
  initial: PuzzleElement[];
  solution: string;
  hint: string;
  initialDisplay: string;
  timeLimit: number;
}

export const DIGIT_MAP: Record<number, number[]> = {
  0: [1, 1, 1, 1, 1, 1, 0],
  1: [0, 1, 1, 0, 0, 0, 0],
  2: [1, 1, 0, 1, 1, 0, 1],
  3: [1, 1, 1, 1, 0, 0, 1],
  4: [0, 1, 1, 0, 0, 1, 1],
  5: [1, 0, 1, 1, 0, 1, 1],
  6: [1, 0, 1, 1, 1, 1, 1],
  7: [1, 1, 1, 0, 0, 0, 0],
  8: [1, 1, 1, 1, 1, 1, 1],
  9: [1, 1, 1, 1, 0, 1, 1],
};

const OPERATOR_SEGMENTS = { "+": [1, 1], "-": [1, 0] };

export const SEGMENTS_TO_DIGIT = Object.entries(DIGIT_MAP).reduce(
  (a, [d, s]) => ((a[s.join("")] = d), a),
  {} as Record<string, string>
);

export const getOperator = (s: SegmentValues[]) =>
  s[0] === 1 && s[1] === 1 ? "+" : s[0] === 1 && s[1] === 0 ? "-" : "?";

export const PUZZLE_DATA: PuzzleData[] = [
  {
    id: 1,
    difficulty: "easy" as const,
    initial: [
      { type: "digit", segments: [...DIGIT_MAP[9]] as SegmentValues[] },
      {
        type: "operator",
        segments: [...OPERATOR_SEGMENTS["-"]] as SegmentValues[],
      },
      { type: "digit", segments: [...DIGIT_MAP[1]] as SegmentValues[] },
      { type: "operator", segments: [] as SegmentValues[] },
      { type: "digit", segments: [...DIGIT_MAP[4]] as SegmentValues[] },
    ],
    initialDisplay: "9 - 1 = 4",
    solution: "3 + 1 = 4",
    hint: "Move the bottom-left vertical stick from the 9 → turns it into a 3, and place it as the vertical stick on the minus → turns it into a plus",
    timeLimit: 60,
  },
  {
    id: 2,
    difficulty: "easy",
    initial: [
      { type: "digit", segments: [...DIGIT_MAP[6]] as SegmentValues[] },
      {
        type: "operator",
        segments: [...OPERATOR_SEGMENTS["+"]] as SegmentValues[],
      },
      { type: "digit", segments: [...DIGIT_MAP[4]] as SegmentValues[] },
      { type: "operator", segments: [] as SegmentValues[] },
      { type: "digit", segments: [...DIGIT_MAP[4]] as SegmentValues[] },
    ],
    initialDisplay: "6 + 4 = 4",
    solution: "5+4=9",
    hint: "Move the bottom-left stick from 6 and place it on top of the last 4",
    timeLimit: 70,
  },
  {
    id: 3,
    difficulty: "easy",
    initial: [
      { type: "digit", segments: [...DIGIT_MAP[9]] as SegmentValues[] },
      {
        type: "operator",
        segments: [...OPERATOR_SEGMENTS["+"]] as SegmentValues[],
      },
      { type: "digit", segments: [...DIGIT_MAP[9]] as SegmentValues[] },
      { type: "operator", segments: [] as SegmentValues[] },
      { type: "digit", segments: [...DIGIT_MAP[9]] as SegmentValues[] },
    ],
    initialDisplay: "9 + 9 = 9",
    solution: "9+0=9",
    hint: "Remove middle & bottom horizontal from the last 9 → makes 0",
    timeLimit: 60,
  },
  {
    id: 4,
    difficulty: "easy",
    initial: [
      { type: "digit", segments: [...DIGIT_MAP[8]] as SegmentValues[] },
      {
        type: "operator",
        segments: [...OPERATOR_SEGMENTS["-"]] as SegmentValues[],
      },
      { type: "digit", segments: [...DIGIT_MAP[3]] as SegmentValues[] },
      { type: "operator", segments: [] as SegmentValues[] },
      { type: "digit", segments: [...DIGIT_MAP[3]] as SegmentValues[] },
    ],
    initialDisplay: "8 + 3 = 3",
    solution: "0+3=3",
    hint: "Move middle horizontal from 8 → add to - to make 6, and it becomes 7 automatically",
    timeLimit: 90,
  },
  {
    id: 5,
    difficulty: "medium",
    initial: [
      { type: "digit", segments: [...DIGIT_MAP[3]] as SegmentValues[] },
      {
        type: "operator",
        segments: [...OPERATOR_SEGMENTS["+"]] as SegmentValues[],
      },
      { type: "digit", segments: [...DIGIT_MAP[3]] as SegmentValues[] },
      { type: "operator", segments: [] as SegmentValues[] },
      { type: "digit", segments: [...DIGIT_MAP[5]] as SegmentValues[] },
    ],
    initialDisplay: "3 + 3 = 5",
    solution: "2+3=5",
    hint: "Move bottom right vertical from 3 → add to bottom left horizontal to make 2",
    timeLimit: 90,
  },
  {
    id: 6,
    difficulty: "medium",
    initial: [
      { type: "digit", segments: [...DIGIT_MAP[6]] as SegmentValues[] },
      {
        type: "operator",
        segments: [...OPERATOR_SEGMENTS["+"]] as SegmentValues[],
      },
      { type: "digit", segments: [...DIGIT_MAP[3]] as SegmentValues[] },
      { type: "operator", segments: [] as SegmentValues[] },
      { type: "digit", segments: [...DIGIT_MAP[8]] as SegmentValues[] },
    ],
    initialDisplay: "6 + 3 = 8",
    solution: "6+3=9",
    hint: "Move one stick from 8 to make it 9",
    timeLimit: 90,
  },
  {
    id: 7,
    difficulty: "medium",
    initial: [
      { type: "digit", segments: [...DIGIT_MAP[1]] as SegmentValues[] },
      {
        type: "operator",
        segments: [...OPERATOR_SEGMENTS["-"]] as SegmentValues[],
      },
      { type: "digit", segments: [...DIGIT_MAP[2]] as SegmentValues[] },
      { type: "operator", segments: [] as SegmentValues[] },
      { type: "digit", segments: [...DIGIT_MAP[9]] as SegmentValues[] },
    ],
    initialDisplay: "1 - 2 = 9",
    solution: "1+2=3",
    hint: "Move one stick from 9 to make it 3",
    timeLimit: 90,
  },
  {
    id: 8,
    difficulty: "medium",
    initial: [
      { type: "digit", segments: [...DIGIT_MAP[4]] as SegmentValues[] },
      {
        type: "operator",
        segments: [...OPERATOR_SEGMENTS["+"]] as SegmentValues[],
      },
      { type: "digit", segments: [...DIGIT_MAP[9]] as SegmentValues[] },
      { type: "operator", segments: [] as SegmentValues[] },
      { type: "digit", segments: [...DIGIT_MAP[1]] as SegmentValues[] },
    ],
    initialDisplay: "4 + 9 = 1",
    solution: "4+3=7",
    hint: "Move one stick from 9 to make it 3",
    timeLimit: 90,
  },
  {
    id: 9,
    difficulty: "medium",
    initial: [
      { type: "digit", segments: [...DIGIT_MAP[2]] as SegmentValues[] },
      {
        type: "operator",
        segments: [...OPERATOR_SEGMENTS["+"]] as SegmentValues[],
      },
      { type: "digit", segments: [...DIGIT_MAP[4]] as SegmentValues[] },
      { type: "operator", segments: [] as SegmentValues[] },
      { type: "digit", segments: [...DIGIT_MAP[0]] as SegmentValues[] },
    ],
    initialDisplay: "2 + 4 = 0",
    solution: "2+4=6",
    hint: "Move one stick from 0 to make it 6",
    timeLimit: 90,
  },
  {
    id: 10,
    difficulty: "medium",
    initial: [
      { type: "digit", segments: [...DIGIT_MAP[4]] as SegmentValues[] },
      {
        type: "operator",
        segments: [...OPERATOR_SEGMENTS["-"]] as SegmentValues[],
      },
      { type: "digit", segments: [...DIGIT_MAP[2]] as SegmentValues[] },
      { type: "operator", segments: [] as SegmentValues[] },
      { type: "digit", segments: [...DIGIT_MAP[8]] as SegmentValues[] },
    ],
    initialDisplay: "4 - 2 = 8",
    solution: "4+2=6",
    hint: "Move one stick from 8 to make it 6",
    timeLimit: 90,
  },
  {
    id: 11,
    difficulty: "medium",
    initial: [
      { type: "digit", segments: [...DIGIT_MAP[1]] as SegmentValues[] },
      {
        type: "operator",
        segments: [...OPERATOR_SEGMENTS["+"]] as SegmentValues[],
      },
      { type: "digit", segments: [...DIGIT_MAP[5]] as SegmentValues[] },
      { type: "operator", segments: [] as SegmentValues[] },
      { type: "digit", segments: [...DIGIT_MAP[4]] as SegmentValues[] },
    ],
    initialDisplay: "1 + 5 = 4",
    solution: "1+3=4",
    hint: "Move one stick from 5",
    timeLimit: 90,
  },
  {
    id: 12,
    difficulty: "hard",
    initial: [
      { type: "digit", segments: [...DIGIT_MAP[8]] as SegmentValues[] },
      {
        type: "operator",
        segments: [...OPERATOR_SEGMENTS["+"]] as SegmentValues[],
      },
      { type: "digit", segments: [...DIGIT_MAP[3]] as SegmentValues[] },
      { type: "operator", segments: [] as SegmentValues[] },
      { type: "digit", segments: [...DIGIT_MAP[3]] as SegmentValues[] },
    ],
    initialDisplay: "8 + 3 = 3",
    solution: "6+3=9",
    hint: "Move one stick from 8 to make it 6",
    timeLimit: 90,
  },
  {
    id: 13,
    difficulty: "hard",
    initial: [
      { type: "digit", segments: [...DIGIT_MAP[8]] as SegmentValues[] },
      {
        type: "operator",
        segments: [...OPERATOR_SEGMENTS["+"]] as SegmentValues[],
      },
      { type: "digit", segments: [...DIGIT_MAP[8]] as SegmentValues[] },
      { type: "operator", segments: [] as SegmentValues[] },
      { type: "digit", segments: [...DIGIT_MAP[1]] as SegmentValues[] },
    ],
    initialDisplay: "8 + 8 = 1",
    solution: "8+0=8",
    hint: "Remove two sticks from the right 8 to turn it into 0, and move one to make left 8 into something valid (wait — better one below)",
    timeLimit: 120,
  },
  {
    id: 14,
    difficulty: "hard",
    initial: [
      { type: "digit", segments: [...DIGIT_MAP[7]] as SegmentValues[] },
      {
        type: "operator",
        segments: [...OPERATOR_SEGMENTS["-"]] as SegmentValues[],
      },
      { type: "digit", segments: [...DIGIT_MAP[5]] as SegmentValues[] },
      { type: "operator", segments: [] as SegmentValues[] },
      { type: "digit", segments: [...DIGIT_MAP[7]] as SegmentValues[] },
    ],
    initialDisplay: "7 - 5 = 7",
    solution: "7-6=1",
    hint: "Remove two sticks from the right 8 to turn it into 0, and move one to make left 8 into something valid (wait — better one below)",
    timeLimit: 120,
  },
  {
    id: 15,
    difficulty: "hard",
    initial: [
      { type: "digit", segments: [...DIGIT_MAP[7]] as SegmentValues[] },
      {
        type: "operator",
        segments: [...OPERATOR_SEGMENTS["+"]] as SegmentValues[],
      },
      { type: "digit", segments: [...DIGIT_MAP[2]] as SegmentValues[] },
      { type: "operator", segments: [] as SegmentValues[] },
      { type: "digit", segments: [...DIGIT_MAP[3]] as SegmentValues[] },
    ],
    initialDisplay: "7 - 2 = 3",
    solution: "1-2=3",
    hint: "Make one stick from 7",
    timeLimit: 120,
  },
  {
    id: 16,
    difficulty: "hard",
    initial: [
      { type: "digit", segments: [...DIGIT_MAP[7]] as SegmentValues[] },
      {
        type: "operator",
        segments: [...OPERATOR_SEGMENTS["+"]] as SegmentValues[],
      },
      { type: "digit", segments: [...DIGIT_MAP[7]] as SegmentValues[] },
      { type: "operator", segments: [] as SegmentValues[] },
      { type: "digit", segments: [...DIGIT_MAP[0]] as SegmentValues[] },
    ],
    initialDisplay: "7 + 7 = 0",
    solution: "7+1=8",
    hint: "Make one stick from 7",
    timeLimit: 120,
  },
  {
    id: 17,
    difficulty: "hard",
    initial: [
      { type: "digit", segments: [...DIGIT_MAP[0]] as SegmentValues[] },
      {
        type: "operator",
        segments: [...OPERATOR_SEGMENTS["+"]] as SegmentValues[],
      },
      { type: "digit", segments: [...DIGIT_MAP[0]] as SegmentValues[] },
      { type: "operator", segments: [] as SegmentValues[] },
      { type: "digit", segments: [...DIGIT_MAP[6]] as SegmentValues[] },
    ],
    initialDisplay: "0 + 0 = 6",
    solution: "0+0=0",
    hint: "Move one stick from 0",
    timeLimit: 120,
  },
  {
    id: 18,
    difficulty: "hard",
    initial: [
      { type: "digit", segments: [...DIGIT_MAP[0]] as SegmentValues[] },
      {
        type: "operator",
        segments: [...OPERATOR_SEGMENTS["+"]] as SegmentValues[],
      },
      { type: "digit", segments: [...DIGIT_MAP[0]] as SegmentValues[] },
      { type: "operator", segments: [] as SegmentValues[] },
      { type: "digit", segments: [...DIGIT_MAP[6]] as SegmentValues[] },
    ],
    initialDisplay: "0 + 0 = 6",
    solution: "0+6=6",
    hint: "Move one stick from 0",
    timeLimit: 120,
  },
  {
    id: 19,
    difficulty: "hard",
    initial: [
      { type: "digit", segments: [...DIGIT_MAP[2]] as SegmentValues[] },
      {
        type: "operator",
        segments: [...OPERATOR_SEGMENTS["-"]] as SegmentValues[],
      },
      { type: "digit", segments: [...DIGIT_MAP[3]] as SegmentValues[] },
      { type: "operator", segments: [] as SegmentValues[] },
      { type: "digit", segments: [...DIGIT_MAP[9]] as SegmentValues[] },
    ],
    initialDisplay: "2 - 3 = 9",
    solution: "2+3=5",
    hint: "Move one stick from 9",
    timeLimit: 120,
  },
  {
    id: 20,
    difficulty: "hard",
    initial: [
      { type: "digit", segments: [...DIGIT_MAP[4]] as SegmentValues[] },
      {
        type: "operator",
        segments: [...OPERATOR_SEGMENTS["+"]] as SegmentValues[],
      },
      { type: "digit", segments: [...DIGIT_MAP[6]] as SegmentValues[] },
      { type: "operator", segments: [] as SegmentValues[] },
      { type: "digit", segments: [...DIGIT_MAP[3]] as SegmentValues[] },
    ],
    initialDisplay: "4 + 6 = 3",
    solution: "4+5=9",
    hint: "Move one stick from 6",
    timeLimit: 120,
  },
];
