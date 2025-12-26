import { Heart, Spade, Diamond, Club } from "lucide-react";
import { CardProps } from "@/utils/game/mathMind";
import PlayingCard from "../mathMind/playingCard";
import { getCardValue } from "@/utils/game/randomCard";

type SuitType = "S" | "H" | "D" | "C";

interface CardArrangeProps {
  suitCounts: {
    S: number;
    H: number;
    D: number;
    C: number;
  };
  sortedCards: {
    S: CardProps[];
    H: CardProps[];
    D: CardProps[];
    C: CardProps[];
  };
  onCardDropFromDeck: (
    cardIndex: number,
    targetSuit: SuitType,
    position: number
  ) => void;
  onCardMove: (
    fromSuit: SuitType,
    cardIndex: number,
    toSuit: SuitType,
    toPosition: number
  ) => void;
  activeSuits: SuitType[];
}

const CardArrange = ({
  suitCounts,
  sortedCards,
  onCardDropFromDeck,
  onCardMove,
  activeSuits,
}: CardArrangeProps) => {
  const allSuits: { key: SuitType; name: string; Icon: any; color: string }[] =
    [
      { key: "S", name: "Spades", Icon: Spade, color: "text-black" },
      { key: "H", name: "Hearts", Icon: Heart, color: "text-red-500" },
      { key: "D", name: "Diamonds", Icon: Diamond, color: "text-red-500" },
      { key: "C", name: "Clubs", Icon: Club, color: "text-black" },
    ];

  const suits = allSuits.filter((suit) => activeSuits.includes(suit.key));

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Handle drop on a specific socket position (both filled and empty)
  const handleDropOnSocket = (
    e: React.DragEvent,
    targetSuit: SuitType,
    socketPosition: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const dragSource = e.dataTransfer.getData("source");

    // Find the actual insertion position in the sorted cards array
    // This accounts for empty sockets before this position
    const currentPile = sortedCards[targetSuit];
    const insertPosition = Math.min(socketPosition, currentPile.length);

    if (dragSource === "deck") {
      const cardIndex = parseInt(e.dataTransfer.getData("cardIndex"));
      if (!isNaN(cardIndex)) {
        onCardDropFromDeck(cardIndex, targetSuit, insertPosition);
      }
    } else if (dragSource === "sorted") {
      const fromSuit = e.dataTransfer.getData("fromSuit") as SuitType;
      const cardIndex = parseInt(e.dataTransfer.getData("cardIndex"));

      if (!isNaN(cardIndex) && fromSuit) {
        onCardMove(fromSuit, cardIndex, targetSuit, insertPosition);
      }
    }
  };

  // Handle drop on empty pile or after all cards
  const handleDropOnPile = (e: React.DragEvent, targetSuit: SuitType) => {
    e.preventDefault();

    const dragSource = e.dataTransfer.getData("source");
    const position = sortedCards[targetSuit].length; // End of pile

    if (dragSource === "deck") {
      const cardIndex = parseInt(e.dataTransfer.getData("cardIndex"));
      if (!isNaN(cardIndex)) {
        onCardDropFromDeck(cardIndex, targetSuit, position);
      }
    } else if (dragSource === "sorted") {
      const fromSuit = e.dataTransfer.getData("fromSuit") as SuitType;
      const cardIndex = parseInt(e.dataTransfer.getData("cardIndex"));

      if (!isNaN(cardIndex) && fromSuit) {
        onCardMove(fromSuit, cardIndex, targetSuit, position);
      }
    }
  };

  const handleSortedCardDragStart = (
    e: React.DragEvent,
    suit: SuitType,
    index: number
  ) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("source", "sorted");
    e.dataTransfer.setData("fromSuit", suit);
    e.dataTransfer.setData("cardIndex", index.toString());

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

  const gridClasses =
    activeSuits.length === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : activeSuits.length === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2";

  return (
    <div
      className={`grid ${gridClasses} place-items-center gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 max-w-6xl mx-auto w-full`}
    >
      {suits.map(({ key, name, Icon, color }) => (
        <div
          key={key}
          className="relative border-2 border-gray-800 p-1 sm:p-1.5 rounded-lg bg-white w-full max-w-[500px]"
        >
          <div
            className="rounded-lg border-2 border-dashed border-gray-400 w-full bg-gray-50 p-1.5 sm:p-2 min-h-[100px] xs:min-h-[110px] sm:min-h-[130px] flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropOnPile(e, key)}
          >
            {Array.from({ length: suitCounts[key] }).map((_, index) => {
              const card = sortedCards[key][index];

              if (card) {
                // Filled slot - show the card
                return (
                  <div
                    key={index}
                    className={`${cardDimensions} flex-shrink-0 overflow-hidden cursor-grab active:cursor-grabbing hover:scale-105 transition-transform touch-none relative group`}
                    draggable
                    onDragStart={(e) =>
                      handleSortedCardDragStart(e, key, index)
                    }
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnSocket(e, key, index)}
                  >
                    <div className="w-full h-full">
                      <PlayingCard suit={card.suit} value={card.value} />
                    </div>
                    {/* Drop zone indicator before this card */}
                    <div className="absolute -left-1 top-0 bottom-0 w-2 bg-blue-500/0 group-hover:bg-blue-500/50 transition-colors" />
                    {/* Card value label */}
                    <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[8px] px-1 rounded-tl opacity-0 group-hover:opacity-100 transition-opacity">
                      {getCardValue(card)}
                    </div>
                  </div>
                );
              } else {
                // Empty slot - show placeholder
                return (
                  <div
                    key={index}
                    className={`${cardDimensions} flex-shrink-0 border-2 border-dashed border-gray-300 rounded bg-white/70 flex items-center justify-center hover:bg-gray-100/70 transition-colors cursor-pointer`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnSocket(e, key, index)}
                  >
                    <span className="text-gray-400 text-[8px] xs:text-[9px] sm:text-xs font-medium">
                      Drop
                    </span>
                  </div>
                );
              }
            })}
          </div>

          <div
            className={`absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-white flex items-center gap-1.5 sm:gap-2 border-2 ${color} shadow-lg`}
          >
            <Icon size={14} className="sm:w-5 sm:h-5" />
            <h1 className="text-sm sm:text-lg md:text-xl font-extrabold">
              {name}
            </h1>
            <span className="text-[9px] sm:text-xs bg-gray-200 px-1.5 py-0.5 rounded font-bold">
              {sortedCards[key].length}/{suitCounts[key]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardArrange;
