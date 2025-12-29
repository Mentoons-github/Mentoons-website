import { CardProps } from "@/utils/game/mathMind";
import PlayingCard from "../mathMind/playingCard";

interface Cards {
  cards: CardProps[];
}

const SortCards = ({ cards }: Cards) => {
  const handleDragStart = (
    e: React.DragEvent,
    index: number,
    card: CardProps
  ) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("source", "deck");
    e.dataTransfer.setData("cardIndex", index.toString());
    e.dataTransfer.setData("suit", card.suit);

    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.5";
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
  };

  const cardDimensions = "w-12 h-16 xs:w-14 xs:h-20 sm:w-16 sm:h-24";

  return (
    <div className="p-2 sm:p-3 mx-auto w-full">
      <div className="flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 flex-wrap max-w-6xl mx-auto">
        {cards.map((data, index) => (
          <div
            key={index}
            className={`${cardDimensions} flex-shrink-0 cursor-grab active:cursor-grabbing hover:scale-105 transition-transform touch-none`}
            draggable
            onDragStart={(e) => handleDragStart(e, index, data)}
            onDragEnd={handleDragEnd}
          >
            <div className="w-full h-full">
              <PlayingCard suit={data.suit} value={data.value} />
            </div>
          </div>
        ))}
      </div>

      {cards.length === 0 && (
        <p className="text-center text-white text-sm sm:text-base mt-2 sm:mt-3 font-bold drop-shadow-lg animate-pulse">
          🎉 All cards placed! Check if they're in the right spots!
        </p>
      )}
    </div>
  );
};

export default SortCards;
