export type PatternItem = {
  id: string;
  image: string;
};

export type PatternRound = {
  pattern: PatternItem[];
  blanks: number[];
  options: PatternItem[];
};

type PatternRule =
  | "ALTERNATE"
  | "PAIR_REPEAT"
  | "MIRROR"
  | "BLOCK_REPEAT"
  | "BLOCK_ALTERNATE"
  | "DOUBLE_BLOCK";

const EASY_RULES: PatternRule[] = ["ALTERNATE", "PAIR_REPEAT", "BLOCK_REPEAT"];

const MEDIUM_RULES: PatternRule[] = [
  "PAIR_REPEAT",
  "BLOCK_REPEAT",
  "BLOCK_ALTERNATE",
  "MIRROR",
];

const HARD_RULES: PatternRule[] = [
  "MIRROR",
  "BLOCK_REPEAT",
  "BLOCK_ALTERNATE",
  "DOUBLE_BLOCK",
];

const IMAGE_POOL: PatternItem[] = [
  { id: "sun", image: "/assets/games/patternRace/sun.png" },
  { id: "moon", image: "/assets/games/patternRace/moon.png" },
  { id: "star", image: "/assets/games/patternRace/star.png" },
  { id: "cloud", image: "/assets/games/patternRace/cloud.png" },
  { id: "rain", image: "/assets/games/patternRace/rain.png" },
  { id: "snow", image: "/assets/games/patternRace/snow.png" },
  { id: "leaf", image: "/assets/games/patternRace/leaf.png" },
];

function getRandomItems<T>(arr: T[], count: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
}

function buildPattern(
  symbols: PatternItem[],
  length: number,
  rule: PatternRule
): PatternItem[] {
  console.log(rule, "ruleeeee");
  const s = symbols;

  switch (rule) {
    case "ALTERNATE":
      return Array.from({ length }, (_, i) => s[i % 2]);

    case "PAIR_REPEAT":
      return Array.from({ length }, (_, i) => s[Math.floor(i / 2) % s.length]);

    case "MIRROR": {
      const half = Math.ceil(length / 2);
      const first = Array.from({ length: half }, (_, i) => s[i % s.length]);
      const second = first.slice(0, length - half).reverse();
      return [...first, ...second];
    }

    case "BLOCK_REPEAT": {
      const blockSize = Math.random() > 0.5 ? 3 : 4;

      const block: PatternItem[] = [s[0]]; // start with A
      let usedDifferent = false;

      for (let i = 1; i < blockSize; i++) {
        if (!usedDifferent) {
          block.push(s[1]);
          usedDifferent = true;
        } else {
          block.push(Math.random() > 0.5 ? block[i - 1] : s[i % s.length]);
        }
      }

      return Array.from({ length }, (_, i) => block[i % block.length]);
    }

    case "BLOCK_ALTERNATE": {
      const block1 = [s[0], s[1], s[1]]; // ABB
      const block2 = [s[0], s[2], s[2]]; // ACC
      const blockSize = block1.length;

      return Array.from({ length }, (_, i) => {
        const blockIndex = Math.floor(i / blockSize);
        const currentBlock = blockIndex % 2 === 0 ? block1 : block2;
        return currentBlock[i % blockSize];
      });
    }

    case "DOUBLE_BLOCK": {
      const blockSize = 3;

      return Array.from({ length }, (_, i) => {
        const blockIndex = Math.floor(i / blockSize);
        const shift = Math.floor(blockIndex / 2) % s.length;
        return s[(i + shift) % s.length];
      });
    }
  }
}

function getRuleByDifficulty(
  difficulty: "easy" | "medium" | "hard"
): PatternRule {
  if (difficulty === "easy") {
    return getRandomItems(EASY_RULES, 1)[0];
  }

  if (difficulty === "medium") {
    return getRandomItems(MEDIUM_RULES, 1)[0];
  }

  return getRandomItems(HARD_RULES, 1)[0];
}

export function generatePatternRound(
  difficulty: "easy" | "medium" | "hard"
): PatternRound {
  const length = difficulty === "easy" ? 12 : difficulty === "medium" ? 14 : 18;
  const blanksCount =
    difficulty === "easy" ? 2 : difficulty === "medium" ? 3 : 4;

  const symbolCount = difficulty === "easy" ? 2 : 3;

  const symbols = getRandomItems(IMAGE_POOL, symbolCount);
  const rule = getRuleByDifficulty(difficulty);

  const pattern = buildPattern(symbols, length, rule);

  // Blank positions (never all adjacent)
  const blanks = new Set<number>();
  while (blanks.size < blanksCount) {
    const i = Math.floor(Math.random() * length);
    if (!blanks.has(i)) blanks.add(i);
  }

  return {
    pattern,
    blanks: [...blanks],
    options: getRandomItems(symbols, Math.min(symbols.length, 4)),
  };
}
