import {
  Carrot,
  Pizza,
  Apple,
  Cherry,
  Dog,
  Cat,
  Rabbit,
  Bird,
  Fish,
  Bug,
  Zap,
  Hammer,
  Swords,
  Shield,
  Eye,
} from "lucide-react";

export type Difficulty = "easy" | "medium" | "hard";

export type Item = {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
};

export type Round = {
  questions: string[];
  correctOrder: string[];
};

export const gameData = {
  easy: {
    items: [
      { id: "carrot", name: "Carrot", icon: Carrot, color: "bg-orange-500" },
      { id: "pizza", name: "Pizza", icon: Pizza, color: "bg-yellow-500" },
      { id: "apple", name: "Apple", icon: Apple, color: "bg-red-500" },
      { id: "cherry", name: "Cherry", icon: Cherry, color: "bg-blue-500" },
    ] as Item[],
    rounds: [
      {
        questions: [
          "Carrot is not last",
          "Pizza comes after Carrot",
          "Apple is between Pizza and Cherry",
          "Cherry is last",
        ],
        correctOrder: ["carrot", "pizza", "apple", "cherry"],
      },
      {
        questions: [
          "Apple is first",
          "Cherry right after Apple",
          "Pizza between Cherry & Carrot",
          "Carrot is last",
        ],
        correctOrder: ["apple", "cherry", "pizza", "carrot"],
      },
      {
        questions: [
          "Pizza is first",
          "Carrot right after Pizza",
          "Cherry before Apple",
          "Apple is last",
        ],
        correctOrder: ["pizza", "carrot", "cherry", "apple"],
      },
      {
        questions: [
          "Cherry is first",
          "Apple second",
          "Carrot third",
          "Pizza last",
        ],
        correctOrder: ["cherry", "apple", "carrot", "pizza"],
      },
      {
        questions: [
          "Carrot first",
          "Pizza before Cherry",
          "Apple not last",
          "Cherry after Apple",
        ],
        correctOrder: ["carrot", "pizza", "apple", "cherry"],
      },
    ] as Round[],
  },

  medium: {
    items: [
      { id: "dog", name: "Dog", icon: Dog, color: "bg-amber-600" },
      { id: "cat", name: "Cat", icon: Cat, color: "bg-gray-700" },
      { id: "rabbit", name: "Rabbit", icon: Rabbit, color: "bg-green-400" },
      { id: "bird", name: "Bird", icon: Bird, color: "bg-cyan-500" },
      { id: "fish", name: "Fish", icon: Fish, color: "bg-blue-600" },
    ] as Item[],
    rounds: [
      {
        questions: [
          "Exactly one animal between Dog and Fish",
          "Cat is not first or last",
          "Bird and Rabbit are neighbors",
          "Rabbit is after Bird",
          "Dog is before Cat",
        ],
        correctOrder: ["dog", "bird", "rabbit", "cat", "fish"],
      },
      {
        questions: [
          "Cat and Dog are at opposite ends",
          "Exactly two animals between Bird and Rabbit",
          "Fish is between Cat and Bird",
          "Rabbit is last",
        ],
        correctOrder: ["cat", "fish", "bird", "dog", "rabbit"],
      },
      {
        questions: [
          "Bird is somewhere after Rabbit",
          "Cat and Fish are not adjacent",
          "Dog has exactly two animals to its right",
          "Rabbit is immediately before Fish",
        ],
        correctOrder: ["dog", "cat", "rabbit", "fish", "bird"],
      },
      {
        questions: [
          "No animal is in its 'natural' order position (Dog≠1, Cat≠2, Rabbit≠3, Bird≠4, Fish≠5)",
          "Fish is immediately after Rabbit",
          "Cat is before Dog",
          "Bird is somewhere between Cat and Fish",
        ],
        correctOrder: ["cat", "bird", "dog", "rabbit", "fish"],
      },
      {
        questions: [
          "The order is completely reversed compared to alphabetical order (Bird, Cat, Dog, Fish, Rabbit)",
          "Fish is not first",
          "Rabbit and Bird are adjacent",
        ],
        correctOrder: ["rabbit", "fish", "dog", "cat", "bird"],
      },
    ] as Round[],
  },

  hard: {
    items: [
      { id: "spiderman", name: "Spider-Man", icon: Bug, color: "bg-red-600" },
      { id: "ironman", name: "Iron Man", icon: Zap, color: "bg-orange-600" },
      { id: "thor", name: "Thor", icon: Hammer, color: "bg-yellow-600" },
      { id: "hulk", name: "Hulk", icon: Swords, color: "bg-green-600" },
      {
        id: "captain",
        name: "Captain America",
        icon: Shield,
        color: "bg-blue-700",
      },
      { id: "widow", name: "Black Widow", icon: Eye, color: "bg-black" },
    ] as Item[],
    rounds: [
      {
        questions: [
          "Exactly two heroes between Spider-Man and Captain America",
          "Thor and Hulk are not adjacent",
          "Iron Man is immediately before or after Black Widow",
          "Hulk is somewhere after Thor",
          "Captain America is not last",
          "Black Widow is before Spider-Man",
        ],
        correctOrder: [
          "thor",
          "ironman",
          "widow",
          "hulk",
          "spiderman",
          "captain",
        ],
      },
      {
        questions: [
          "Hulk and Thor are at the ends (one first, one last)",
          "Exactly one hero between Iron Man and Black Widow",
          "Spider-Man is third",
          "Captain America is after Black Widow",
          "Iron Man is not next to Captain",
        ],
        correctOrder: [
          "hulk",
          "captain",
          "spiderman",
          "widow",
          "ironman",
          "thor",
        ],
      },
      {
        questions: [
          "The Avengers are lined up in reverse power ranking order (strongest → weakest: Hulk > Thor > Captain > Iron Man > Spider-Man > Widow)",
          "No two 'original six' members are adjacent (Hulk, Thor, Captain, Iron Man)",
          "Spider-Man is somewhere between Iron Man and Black Widow",
        ],
        correctOrder: [
          "widow",
          "spiderman",
          "ironman",
          "captain",
          "thor",
          "hulk",
        ],
      },
      {
        questions: [
          "Black Widow and Iron Man have exactly three heroes between them",
          "Thor is immediately before Hulk",
          "Spider-Man is not in the first three positions",
          "Captain America is right after Spider-Man or right before him",
          "Hulk is last",
        ],
        correctOrder: [
          "widow",
          "captain",
          "spiderman",
          "ironman",
          "thor",
          "hulk",
        ],
      },
      {
        questions: [
          "If Thor is before Hulk, then Captain is between them",
          "Spider-Man and Black Widow are neighbors",
          "Iron Man is somewhere after Hulk",
          "No one is between Thor and Captain America",
          "The first and last heroes wear primarily red or black",
        ],
        correctOrder: [
          "spiderman",
          "widow",
          "thor",
          "captain",
          "hulk",
          "ironman",
        ],
      },
      {
        questions: [
          "The order is the exact reverse of their movie debut order (Iron Man → Hulk → Thor → Captain → Widow → Spider-Man)",
          "Hulk and Spider-Man are not adjacent",
          "Thor is exactly in the middle (3rd or 4th)",
        ],
        correctOrder: [
          "spiderman",
          "widow",
          "captain",
          "thor",
          "hulk",
          "ironman",
        ],
      },
    ] as Round[],
  },
};
