interface ColorScheme {
  bg: string;
  hover: string;
  text: string;
  light: string;
  border: string;
}

export const CONTENTS = {
  Assessments: {
    description: "Take Our assessments starting at Rs 15",
    link: `${import.meta.env.VITE_STATIC_URL}assessment-page`,
    flip: {
      shouldFlip: true,
      flipTitle: "Take Our Quiz",
      link: `${import.meta.env.VITE_STATIC_URL}quiz`,
    },
  },
  "De-Addiction Workshops": {
    badge: "Launching Soon",
    tag: ["Art", "Music", "Story Telling"],
    focus: [
      "Social Media",
      "Cell-phone",
      "Gaming",
      "Porn",
      "Gambling",
      "Entertainment",
    ],
    flip: {
      shouldFlip: true,
      flipTitle: "Book a session with our psychologist",
      subtitle: "15 minutes complementary call",
      link: `${import.meta.env.VITE_STATIC_URL}bookings`,
    },
    link: `${import.meta.env.VITE_STATIC_URL}mentoons-workshops`,
  },
  comics: {
    focus: [
      "Moral values",
      "Respecting elders",
      "Revival of ancient values",
      "Emotional challenges",
      "Balanced social media usage",
    ],
    link: `${import.meta.env.VITE_STATIC_URL}mentoons-comics`,
  },
  "Shop with Mentoons": {
    focus: [
      "Comics",
      "Conversation Starter Cards",
      "Silent Stories",
      "Story Re-Teller Cards",
      "Conversation Story Cards",
    ],
    link: `${import.meta.env.VITE_STATIC_URL}products`,
  },
  podcast: {
    focus: ["Teenage Behavior", "Parenting", "Health", "Nutrition"],
    link: `${import.meta.env.VITE_STATIC_URL}mentoons-podcast`,
  },
  "Coloring Books": {
    focus: [
      "Mandala Art books",
      "Inventors and Inventions",
      "M9-Character coloring books",
    ],
    link: `${import.meta.env.VITE_STATIC_URL}product?category=6-12`,
  },
  "Free Downloads": {
    description: "Access free games and emergency contacts",
    icon: "⬇️",
    color: "blue",
    link: `${import.meta.env.VITE_STATIC_URL}free-download`,
    flip: {
      shouldFlip: true,
      flipTitle: "More about Mentoons",
      link: `${import.meta.env.VITE_STATIC_URL}about-mentoons`,
    },
  },
  "Pocket Series": {
    tags: "24 Pages",
    focus: [
      "My Memory Journal",
      "Opinion Journal",
      "How to Handle Grief",
      "Self Talk",
      "My Pets",
    ],
    link: `${import.meta.env.VITE_STATIC_URL}product?category=6-12`,
  },
  games: {
    focus: [
      "Logical thinking",
      "Numeric Ability",
      "Reasoning & focus",
      "Awareness through General Knowledge",
    ],
    link: `${import.meta.env.VITE_STATIC_URL}adda/game-lobby`,
  },
  "Our Community": {
    focus: [
      "Monthly meetups(Online and Offline)",
      "Blog",
      "Connect with Parents",
    ],
  },
};

export const COLOR_SCHEME: Record<string, ColorScheme> = {
  green: {
    bg: "bg-green-500",
    hover: "hover:bg-green-600",
    text: "text-green-700",
    light: "bg-green-50",
    border: "border-green-200",
  },
  yellow: {
    bg: "bg-yellow-500",
    hover: "hover:bg-yellow-600",
    text: "text-yellow-700",
    light: "bg-yellow-50",
    border: "border-yellow-200",
  },
  orange: {
    bg: "bg-orange-500",
    hover: "hover:bg-orange-600",
    text: "text-orange-700",
    light: "bg-orange-50",
    border: "border-orange-200",
  },
  blue: {
    bg: "bg-blue-500",
    hover: "hover:bg-blue-600",
    text: "text-blue-700",
    light: "bg-blue-50",
    border: "border-blue-200",
  },
};
