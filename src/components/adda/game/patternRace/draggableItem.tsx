import { PatternItem } from "@/constant/adda/game/patternRace";
import { useDraggable } from "@dnd-kit/core";

const DraggableItem = ({ item }: { item: PatternItem }) => {
  const { setNodeRef, listeners, attributes, transform } = useDraggable({
    id: item.id,
  });

  return (
    <img
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      src={item.image}
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
      className="md:w-16 md:h-16 w-10 h-10 cursor-grab touch-none"
    />
  );
};

export default DraggableItem;
