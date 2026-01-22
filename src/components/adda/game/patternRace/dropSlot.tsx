import { PatternItem } from "@/constant/adda/game/patternRace";
import { useDroppable } from "@dnd-kit/core";

const DropSlot = ({ id, item }: { id: string; item?: PatternItem }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`md:w-20 md:h-20 w-14 h-14 rounded-xl border-2 flex items-center justify-center ${
        isOver ? "border-green-500" : "border-dashed"
      }`}
    >
      {item && <img src={item.image} className="md:w-16 md:h-16 w-10 h-10" />}
    </div>
  );
};

export default DropSlot;
