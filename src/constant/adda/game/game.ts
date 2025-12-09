const base_url = import.meta.env.VITE_STATIC_URL;

export const GAMES = [
  {
    title: "Dice",
    thumbnail: "/assets/adda/gameLobby/dice.jpg",
    link: `${base_url}adda/game-lobby/dice`,
  },
  {
    title: "cartoonmoji",
    thumbnail: "/assets/adda/gameLobby/cartoonmoji.png",
    link: `${base_url}adda/game-lobby/cartoonmoji`,
  },
  {
    title: "Grid Flash",
    thumbnail: "/assets/adda/gameLobby/gridFlash.png",
    link: `${base_url}adda/game-lobby/grid-flash`,
  },
  {
    title: "Mind Stack",
    thumbnail: "/assets/adda/gameLobby/mindStack.png",
    link: `${base_url}adda/game-lobby/mind-stack`,
  },
  {
    title: "Flip And Match",
    thumbnail: "/assets/adda/gameLobby/flipAndMatch.png",
    link: `${base_url}adda/game-lobby/flip-and-match`,
  },
  {
    title: "Stick Master",
    thumbnail: "/assets/adda/gameLobby/stickMaster.png",
    link: `${base_url}adda/game-lobby/stick-master`,
  },
  {
    title: "Quiz",
    thumbnail: "/assets/adda/gameLobby/image.jpg",
    link: `${base_url}quiz`,
  },
  {
    title: "Color Tube",
    thumbnail: "/assets/games/ColorTube/startBg2.jpg",
    link: `${base_url}adda/game-lobby/color-tube`,
  },
  {
    title: "Odd One Out",
    thumbnail: "/assets/games/FindOddOne/image.png",
    link: `${base_url}adda/game-lobby/odd-one-out`,
  },
  {
    title: "Sound & Strings",
    thumbnail: "/assets/games/instruments/bg1.jpg",
    link: `${base_url}adda/game-lobby/instruments`,
  },
  {
    title: "Mind of Inventions",
    thumbnail: "/assets/games/inventors/image.png",
    link: `${base_url}adda/game-lobby/inventors`,
  },
];

export const getPodiumColor = (position: number) => {
  switch (position) {
    case 1:
      return "bg-gradient-to-t from-red-600 to-red-400";
    case 2:
      return "bg-gradient-to-t from-blue-400 to-blue-300";
    case 3:
      return "bg-gradient-to-t from-orange-400 to-orange-300";
    default:
      return "bg-gradient-to-t from-green-400 to-green-300";
  }
};

export const getBorderColor = (position: number) => {
  switch (position) {
    case 1:
      return "border-red-400";
    case 2:
      return "border-blue-400";
    case 3:
      return "border-orange-400";
    default:
      return "border-green-400";
  }
};

export const getRankBadgeColor = (rank: number) => {
  if (rank <= 5) return "bg-gradient-to-r from-green-500 to-green-600";
  if (rank <= 7) return "bg-gradient-to-r from-blue-500 to-blue-600";
  return "bg-gradient-to-r from-orange-500 to-orange-600";
};
