import { Psychologist } from "@/redux/sessionSlice";

interface PsychologistCardProps {
  psychologist: Psychologist;
  selected?: boolean;
  onSelect?: (psychologist: Psychologist) => void;
}

const PsychologistCard = ({
  psychologist,
  selected,
  onSelect,
}: PsychologistCardProps) => {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(psychologist)}
      className={`flex w-64 flex-shrink-0 snap-start flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
        selected
          ? "border-stone-900 bg-stone-50"
          : "border-stone-200 bg-white hover:border-stone-300"
      }`}
    >
      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-stone-100 text-lg font-semibold text-stone-500">
        {psychologist.profilePicture ? (
          <img
            src={psychologist.profilePicture}
            alt={psychologist.name}
            className="h-full w-full object-cover"
          />
        ) : (
          (psychologist.name?.charAt(0) ?? "?")
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-stone-900">
          {psychologist.name}
        </h3>
        <p className="text-xs capitalize text-stone-500">
          {psychologist.department || "Psychologist"}
        </p>
        {psychologist.place?.city && (
          <p className="mt-1 text-xs text-stone-400">
            {psychologist.place.city}
            {psychologist.place.state ? `, ${psychologist.place.state}` : ""}
          </p>
        )}
      </div>

      {selected && (
        <span className="rounded-full bg-stone-900 px-2 py-0.5 text-[10px] font-medium text-white">
          Selected
        </span>
      )}
    </button>
  );
};

export default PsychologistCard;
