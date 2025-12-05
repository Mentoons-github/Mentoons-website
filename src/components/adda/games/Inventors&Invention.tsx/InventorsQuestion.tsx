import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { InvetionTypes } from "@/constant/games/InventorSlides";

export type ReviewCard = {
  id: number;
  correctInventor: string;
  correctInventorImg: string;
  correctInvention: string;
  correctInventionImg: string;

  userInventor: string;
  userInventorImg: string;
  userInvention: string;
  userInventionImg: string;

  isCorrect: boolean;
};

type CardType = {
  id: number;
  inventor: string;
  inventorImg: string;
  invention: string;
  inventionImg: string;

  placedInventorId: number;
  placedInventorImgId: number;
  placedInventionId: number;
};

const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

const InventorsQuestion = ({
  slides,
  onFinish,
  autoSubmit,
  resetAutoSubmit,
}: {
  slides: InvetionTypes[];
  onFinish: (score: number, cards: ReviewCard[]) => void;
  autoSubmit: boolean;
  resetAutoSubmit: () => void;
}) => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [dragging, setDragging] = useState<{
    index: number;
    type: string;
    x: number;
    y: number;
  } | null>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!autoSubmit) return;
    submit();
    resetAutoSubmit();
  }, [autoSubmit, resetAutoSubmit]);

  const isCorrect = (card: CardType) =>
    card.placedInventorId === card.placedInventorImgId &&
    card.placedInventorImgId === card.placedInventionId;

  useEffect(() => {
    if (!slides.length) return;

    const nameShuffle = shuffle(slides);
    const imgShuffle = shuffle(slides);
    const invShuffle = shuffle(slides);

    const mixed: CardType[] = slides.map((s, i) => ({
      id: s.id!,
      inventor: nameShuffle[i].inventor,
      inventorImg: imgShuffle[i].inventorImg!,
      invention: invShuffle[i].invention,
      inventionImg: invShuffle[i].inventionImg!,

      placedInventorId: nameShuffle[i].id!,
      placedInventorImgId: imgShuffle[i].id!,
      placedInventionId: invShuffle[i].id!,
    }));

    setCards(mixed);
  }, [slides]);

  // Desktop drag handlers
  const onDragStart = (
    e: React.DragEvent,
    fromIndex: number,
    type: "name" | "img" | "inv"
  ) => {
    e.dataTransfer.setData("data", JSON.stringify({ fromIndex, type }));
    e.dataTransfer.effectAllowed = "move";
  };

  const onDrop = (
    e: React.DragEvent,
    toIndex: number,
    type: "name" | "img" | "inv"
  ) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("data");
    if (!data) return;

    const { fromIndex, type: dragType } = JSON.parse(data);
    if (fromIndex === toIndex || dragType !== type) return;

    performSwap(fromIndex, toIndex, type);
  };

  // Mobile/Touch drag handlers
  const handleTouchStart = (
    e: React.TouchEvent,
    index: number,
    type: "name" | "img" | "inv"
  ) => {
    const touch = e.touches[0];
    dragStartPos.current = { x: touch.clientX, y: touch.clientY };
    setDragging({ index, type, x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    setDragging({ ...dragging, x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!dragging) return;

    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    if (element) {
      const dropTarget = element.closest("[data-drop-index]");
      if (dropTarget) {
        const toIndex = parseInt(
          dropTarget.getAttribute("data-drop-index") || "-1"
        );
        const dropType = dropTarget.getAttribute("data-drop-type");

        if (
          toIndex !== -1 &&
          dropType === dragging.type &&
          toIndex !== dragging.index
        ) {
          performSwap(
            dragging.index,
            toIndex,
            dragging.type as "name" | "img" | "inv"
          );
        }
      }
    }

    setDragging(null);
    dragStartPos.current = null;
  };

  const performSwap = (
    fromIndex: number,
    toIndex: number,
    type: "name" | "img" | "inv"
  ) => {
    setCards((prev) => {
      const copy = [...prev];

      if (type === "name") {
        [copy[fromIndex].inventor, copy[toIndex].inventor] = [
          copy[toIndex].inventor,
          copy[fromIndex].inventor,
        ];
        [copy[fromIndex].placedInventorId, copy[toIndex].placedInventorId] = [
          copy[toIndex].placedInventorId,
          copy[fromIndex].placedInventorId,
        ];
      }

      if (type === "img") {
        [copy[fromIndex].inventorImg, copy[toIndex].inventorImg] = [
          copy[toIndex].inventorImg,
          copy[fromIndex].inventorImg,
        ];
        [
          copy[fromIndex].placedInventorImgId,
          copy[toIndex].placedInventorImgId,
        ] = [
          copy[toIndex].placedInventorImgId,
          copy[fromIndex].placedInventorImgId,
        ];
      }

      if (type === "inv") {
        [copy[fromIndex].invention, copy[toIndex].invention] = [
          copy[toIndex].invention,
          copy[fromIndex].invention,
        ];
        [copy[fromIndex].inventionImg, copy[toIndex].inventionImg] = [
          copy[toIndex].inventionImg,
          copy[fromIndex].inventionImg,
        ];
        [copy[fromIndex].placedInventionId, copy[toIndex].placedInventionId] = [
          copy[toIndex].placedInventionId,
          copy[fromIndex].placedInventionId,
        ];
      }

      return copy;
    });
  };

  const submit = () => {
    let score = 0;

    const review = cards.map((c) => {
      const correct =
        c.placedInventorId === c.placedInventorImgId &&
        c.placedInventorImgId === c.placedInventionId;

      if (correct) score++;

      return {
        id: c.id,
        correctInventor: slides.find((s) => s.id === c.id)!.inventor,
        correctInventorImg: slides.find((s) => s.id === c.id)!.inventorImg!,
        correctInvention: slides.find((s) => s.id === c.id)!.invention,
        correctInventionImg: slides.find((s) => s.id === c.id)!.inventionImg!,
        userInventor: c.inventor,
        userInventorImg: c.inventorImg,
        userInvention: c.invention,
        userInventionImg: c.inventionImg,
        isCorrect: correct,
      };
    });

    onFinish(score, review);
  };

  return (
    <div className="text-center">
      <div
        className={`grid gap-1 md:gap-2 lg:gap-6 ${
          slides.length === 8 ? " grid-cols-3 md:grid-cols-4" : "grid-cols-3"
        }`}
      >
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative bg-gradient-to-br from-purple-800 to-blue-900 rounded-2xl p-1 md:p-4 
                shadow-2xl border border-white/20 flex flex-col items-center 
                gap-3 transform transition-all duration-300
                ${isCorrect(card) ? "ring-2 md:ring-4 ring-green-400" : ""}`}
          >
            {isCorrect(card) && (
              <div
                className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full w-8 h-8 
                      flex items-center justify-center text-lg font-bold shadow-lg animate-bounce"
              >
                ✓
              </div>
            )}

            {/* INVENTOR IMAGE */}
            <div
              draggable
              onDragStart={(e) => onDragStart(e, i, "img")}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, i, "img")}
              onTouchStart={(e) => handleTouchStart(e, i, "img")}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              data-drop-index={i}
              data-drop-type="img"
              className={`w-20 h-20 lg:w-32 lg:h-32 rounded-full overflow-hidden border-2 shadow-lg cursor-move
                transition-all duration-200 touch-none
                ${
                  dragging?.index === i && dragging?.type === "img"
                    ? "opacity-50 scale-95"
                    : "border-white/30"
                }
                ${
                  dragging?.type === "img" && dragging?.index !== i
                    ? "ring-2 ring-yellow-400"
                    : ""
                }`}
            >
              <img
                src={card.inventorImg}
                className="w-full h-full object-cover pointer-events-none select-none"
                alt={card.inventor}
              />
            </div>

            {/* INVENTOR NAME */}
            <div
              draggable
              onDragStart={(e) => onDragStart(e, i, "name")}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, i, "name")}
              onTouchStart={(e) => handleTouchStart(e, i, "name")}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              data-drop-index={i}
              data-drop-type="name"
              className={`bg-yellow-500 text-black text-xs lg:text-lg font-bold lg:font-extrabold px-1 md:px-2 lg:px-4 py-1 lg:py-2 rounded-lg cursor-move 
                shadow-md touch-none transition-all duration-200
                ${
                  dragging?.index === i && dragging?.type === "name"
                    ? "opacity-50 scale-95"
                    : ""
                }
                ${
                  dragging?.type === "name" && dragging?.index !== i
                    ? "ring-2 ring-blue-400"
                    : ""
                }`}
            >
              {card.inventor}
            </div>

            {/* INVENTION */}
            <div
              draggable
              onDragStart={(e) => onDragStart(e, i, "inv")}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, i, "inv")}
              onTouchStart={(e) => handleTouchStart(e, i, "inv")}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              data-drop-index={i}
              data-drop-type="inv"
              className={`p-1 md:p-3 rounded-xl cursor-move w-full touch-none transition-all duration-200
                ${
                  dragging?.index === i && dragging?.type === "inv"
                    ? "opacity-50 scale-95"
                    : ""
                }
                ${
                  dragging?.type === "inv" && dragging?.index !== i
                    ? "ring-2 ring-blue-400"
                    : ""
                }`}
            >
              <img
                src={card.inventionImg}
                className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mx-auto mb-1 pointer-events-none select-none"
                alt={card.invention}
              />
              <p className="text-xs font-semibold text-white text-center select-none">
                {card.invention}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={submit}
        className={` mt-6 bg-gradient-to-r from-green-500 to-teal-500 
         text-white font-bold py-3 rounded-full shadow-lg transition-all duration-300 px-10`}
      >
        Submit & Next
      </motion.button>

      {/* Visual feedback for touch dragging */}
      {dragging && (
        <div
          className="fixed pointer-events-none z-50 opacity-80"
          style={{
            left: dragging.x - 40,
            top: dragging.y - 40,
          }}
        >
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl shadow-2xl">
            ⟳
          </div>
        </div>
      )}
    </div>
  );
};

export default InventorsQuestion;
