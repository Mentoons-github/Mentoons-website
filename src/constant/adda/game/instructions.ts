export interface Instructions {
  text: string;
  icon: string;
  type?: string;
  media?: string;
}

interface Games {
  game: string;
  steps: Instructions[];
}

export const GAME_INSTRUCTIONS: Games[] = [
  {
    game: "Dice",
    steps: [
      {
        text: "Look at the dice shown on the screen.",
        icon: "Eye",
        type: "image",
        media: "/assets/games/dice/instructions/Screenshot (43).png",
      },
      {
        text: "Memorize the number or pattern quickly.",
        icon: "Brain",
        type: "image",
        media: "/assets/games/dice/instructions/Screenshot (43).png",
      },
      {
        text: "When the options for dice appear, remember what you saw.",
        icon: "ListChecks",
        type: "image",
        media: "/assets/games/dice/instructions/Screenshot (44).png",
      },
    ],
  },
  {
    game: "Cartoonmoji",
    steps: [
      {
        text: "Look at the emojis given on the screen.",
        icon: "Smile",
        type: "image",
        media: "/assets/games/cartoonmoji/instructions/Screenshot (45).png",
      },
      {
        text: "Think of which cartoon / character they represent.",
        icon: "Lightbulb",
        type: "image",
        media: "/assets/games/cartoonmoji/instructions/Screenshot (45).png",
      },
      {
        text: "Type and enter the correct cartoon name to score.",
        icon: "Keyboard",
        type: "image",
        media: "/assets/games/cartoonmoji/instructions/Screenshot (46).png",
      },
    ],
  },
  {
    game: "Grid Flash",
    steps: [
      {
        text: "Study the grid pattern shown.",
        icon: "Grid3x3",
        type: "image",
        media: "/assets/games/gridFlash/instructions/Screenshot (47).png",
      },
      {
        text: "Memorize the blocks carefully.",
        icon: "Brain",
      },
      {
        text: "When the empty grid appears, recreate the same pattern.",
        icon: "Edit3",
        type: "image",
        media: "/assets/games/gridFlash/instructions/Screenshot (48).png",
      },
      {
        text: "Submit to check if you got it right.",
        icon: "CheckCircle",
        type: "image",
        media: "/assets/games/gridFlash/instructions/Screenshot (49).png",
      },
    ],
  },
  {
    game: "Brain Stack",
    steps: [
      {
        text: "Read the game card instructions carefully.",
        icon: "BookOpen",
        type: "image",
        media: "/assets/games/mindStack/instructions/Screenshot (50).png",
      },
      {
        text: "Arrange the picture cards in the correct order based on the instructions.",
        icon: "Layers",
        type: "video",
        media: "/assets/games/mindStack/instructions/gameplay.mp4",
      },
      {
        text: "Place each card accurately to complete the task.",
        icon: "Pointer",
        type: "image",
        media: "/assets/games/mindStack/instructions/Screenshot (52).png",
      },
    ],
  },
  {
    game: "Flip And Match",
    steps: [
      {
        text: "Observe the cards shown in the grid.",
        icon: "Eye",
        type: "image",
        media: "/assets/games/flipAndMatch/instructions/Screenshot (53).png",
      },
      {
        text: "Flip two cards at a time.",
        icon: "FlipVertical",
        type: "video",
        media: "/assets/games/flipAndMatch/instructions/flipping.mp4",
      },
      {
        text: "Try to find matching pairs.",
        icon: "CopyCheck",
        type: "video",
        media: "/assets/games/flipAndMatch/instructions/gameplay.mp4",
      },
      {
        text: "Match all pairs to win.",
        icon: "Trophy",
        type: "video",
        media: "/assets/games/flipAndMatch/instructions/gameplay.mp4",
      },
    ],
  },
  {
    game: "Stick Master",
    steps: [
      {
        text: "Look at the equation shown.",
        icon: "Calculator",
        type: "image",
        media: "/assets/games/stickMatch/instructions/Screenshot (54).png",
      },
      {
        text: "Move or change the position of one matchstick.",
        icon: "Move",
        type: "video",
        media: "/assets/games/stickMatch/instructions/gameplay.mp4",
      },
      {
        text: "Fix the equation to make it correct.",
        icon: "CheckCircle",
        type: "video",
        media: "/assets/games/stickMatch/instructions/gameplay.mp4",
      },
    ],
  },
  {
    game: "Quiz",
    steps: [
      { text: "Read each question carefully.", icon: "BookOpen" },
      {
        text: "Select the answer that fits you best.",
        icon: "MousePointerClick",
      },
      {
        text: "Complete all questions to see your fun result!",
        icon: "PartyPopper",
      },
    ],
  },
  {
    game: "Colour Tube",
    steps: [
      {
        text: "Tap on a tube to pick a coloured ball.",
        icon: "Hand",
        type: "video",
        media: "/assets/games/ColorTube/instructions/gameplay1.mp4",
      },
      {
        text: "Move it into another tube where the top colour matches or is empty.",
        icon: "ArrowRightLeft",
        type: "video",
        media: "/assets/games/ColorTube/instructions/gameplay2.mp4",
      },
      {
        text: "Continue until each tube has balls of only one colour.",
        icon: "Droplet",
        type: "video",
        media: "/assets/games/ColorTube/instructions/gameplay3.mp4",
      },
    ],
  },
  {
    game: "Odd One Out",
    steps: [
      {
        text: "Look at all the pictures shown.",
        icon: "Images",
        type: "image",
        media: "/assets/games/FindOddOne/instructions/Screenshot (55).png",
      },
      {
        text: "Compare them carefully.",
        icon: "Search",
        type: "video",
        media: "/assets/games/FindOddOne/instructions/gameplay1.mp4",
      },
      {
        text: "Find and tap the item that looks different.",
        icon: "BadgeAlert",
        type: "video",
        media: "/assets/games/FindOddOne/instructions/gameplay2.mp4",
      },
      {
        text: "Do it before the timer ends!",
        icon: "Timer",
        type: "image",
        media: "/assets/games/FindOddOne/instructions/Screenshot (56).png",
      },
    ],
  },
  {
    game: "Sound And Strings",
    steps: [
      {
        text: "Listen to the audio clip played.",
        icon: "Volume2",
        type: "video",
        media: "/assets/games/instruments/instructions/gameplay1.mp4",
      },
      {
        text: "Observe the instruments displayed.",
        icon: "Music",
        type: "video",
        media: "/assets/games/instruments/instructions/gameplay2.mp4",
      },
      {
        text: "Match the sound to the correct instrument.",
        icon: "Check",
        type: "video",
        media: "/assets/games/instruments/instructions/gameplay3.mp4",
      },
    ],
  },
  {
    game: "Mind of Inventions",
    steps: [
      {
        text: "Look at the inventions and inventors displayed.",
        icon: "Lightbulb",
        type: "image",
        media:
          "/assets/games/inventors/instructions/Screenshot 2025-12-16 182510.png",
      },
      {
        text: "Match the invention to its correct inventor using names and pictures.",
        icon: "UserCheck",
      },
      {
        text: "Complete all matches to finish the level.",
        icon: "CheckCircle",
      },
    ],
  },
  {
    game: "Color Clash",
    steps: [
      {
        text: "Observe the balls in each square and the centered rectangle which acts as the carrier.",
        icon: "Eye",
        type: "image",
        media: "/assets/games/colorClash/instructions/Screenshot (57).png",
      },
      {
        text: "Use arrow keys or swipe gestures to move the rectangle and pick up balls from a square.",
        icon: "Joystick",
        type: "video",
        media: "/assets/games/colorClash/instructions/gameplay1.mp4",
      },
      {
        text: "Arrange balls so that each square contains balls of the same color (all red or all white).",
        icon: "Droplet",
        type: "video",
        media: "/assets/games/colorClash/instructions/gameplay2.mp4",
      },
      {
        text: "If one ball is left unmatched, make the other two balls in the square the same color and place the leftover ball in the rectangle.",
        icon: "Layers",
        type: "image",
        media: "/assets/games/colorClash/instructions/Screenshot (58).png",
      },
      {
        text: "After attaching balls, use the recycle symbol to rotate balls inside the rectangle for proper alignment.",
        icon: "RotateCw",
        type: "video",
        media: "/assets/games/colorClash/instructions/gameplay2.mp4",
      },
      {
        text: "Complete all squares with same-colored balls and submit to finish the level!",
        icon: "Trophy",
        type: "image",
        media: "/assets/games/colorClash/instructions/Screenshot (59).png",
      },
    ],
  },
  {
    game: "Mind Math",
    steps: [
      {
        text: "Look at the cards shown on the screen. Each card has a number on it.",
        icon: "Eye",
        type: "image",
        media: "/assets/games/mindMath/instructions/Screenshot (61).png",
      },
      {
        text: "Notice the math operator displayed (Addition, Subtraction, Multiplication, or Division).",
        icon: "Plus",
        type: "image",
        media: "/assets/games/mindMath/instructions/Screenshot (62).png",
      },
      {
        text: "Mentally calculate the result by applying the operator to the card numbers.",
        icon: "Brain",
        type: "image",
        media: "/assets/games/mindMath/instructions/Screenshot (62).png",
      },
      {
        text: "Tap or enter the correct answer before the timer runs out.",
        icon: "Keyboard",
        type: "video",
        media: "/assets/games/mindMath/instructions/gameplay2.mp4",
      },
      {
        text: "Each correct answer increases your score based on the card values.",
        icon: "TrendingUp",
        type: "image",
        media: "/assets/games/mindMath/instructions/Screenshot (63).png",
      },
      {
        text: "Complete the round within the given time to move to the next level.",
        icon: "Timer",
        type: "image",
        media: "/assets/games/mindMath/instructions/Screenshot (64).png",
      },
      {
        text: "Watch the Round, Time, and Score section to track your progress.",
        icon: "BarChart3",
        type: "image",
        media: "/assets/games/mindMath/instructions/Screenshot (65).png",
      },
    ],
  },
  {
    game: "Word Builder",
    steps: [
      {
        text: "Look at the letters displayed.",
        icon: "Eye",
        type: "image",
        media: "/assets/games/wordBuilder/instructions/Screenshot (69).png",
      },
      {
        text: "Form valid words from the given letters. ",
        icon: "PuzzlePiece",
        type: "video",
        media: "/assets/games/wordBuilder/instructions/gameplay2.mp4",
      },
      {
        text: "Submit your word to earn points and unlock the next round.",
        icon: "CheckCircle",
        type: "video",
        media: "/assets/games/wordBuilder/instructions/gameplay1.mp4",
      },
      {
        text: "Complete all words in the level before time runs out.",
        icon: "Clock",
        type: "image",
        media: "/assets/games/wordBuilder/instructions/Screenshot (70).png",
      },
    ],
  },
  {
    game: "Pattern Race",
    steps: [
      {
        text: "You will see a pattern puzzle with some boxes already filled and some empty boxes.",
        icon: "TrendingUp",
        type: "image",
        media: "/assets/games/patternRace/instructions/pattern.png",
      },
      {
        text: "Drag and drop the correct image into the empty boxes to complete the pattern.",
        icon: "Hand",
        type: "video",
        media: "/assets/games/patternRace/instructions/drag.mp4",
      },
      {
        text: "Solve as many puzzles as you can before the timer ends. Each correct pattern gives you 10 points.",
        icon: "BarChart3",
        type: "image",
        media: "/assets/games/patternRace/instructions/header.png",
      },
    ],
  },
];
