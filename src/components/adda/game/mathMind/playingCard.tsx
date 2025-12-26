type CardProps = {
  value: string;
  suit: "S" | "H" | "D" | "C";
};

const suitMap = {
  S: "♠",
  H: "♥",
  D: "♦",
  C: "♣",
};

const suitColor = {
  S: "text-black",
  C: "text-black",
  H: "text-red-500",
  D: "text-red-500",
};

const PlayingCard = ({ value, suit }: CardProps) => {
  return (
    <div className="relative w-32 h-44 bg-white rounded-lg shadow-lg border-2 border-gray-300 p-2 flex flex-col">
      <div
        className={`absolute top-2 left-2 flex flex-col items-center leading-none ${suitColor[suit]}`}
      >
        <span className="text-xl font-bold">{value}</span>
        <span className="text-2xl">{suitMap[suit]}</span>
      </div>

      <div
        className={`flex-1 flex items-center justify-center ${suitColor[suit]}`}
      >
        <span className="text-6xl">{suitMap[suit]}</span>
      </div>

      <div
        className={`absolute bottom-2 right-2 flex flex-col items-center leading-none ${suitColor[suit]} rotate-180`}
      >
        <span className="text-xl font-bold">{value}</span>
        <span className="text-2xl">{suitMap[suit]}</span>
      </div>
    </div>
  );
};

export default PlayingCard;
