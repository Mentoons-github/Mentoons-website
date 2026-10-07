import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PsychologistCard from "./psychologistCard";
import { useAuth } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchPsychologists, Psychologist } from "@/redux/sessionSlice";

interface PsychologistCarouselProps {
  selectedPsychologistId?: string;
  onSelect: (psychologist: Psychologist) => void;
}

const PsychologistCarousel = ({
  selectedPsychologistId,
  onSelect,
}: PsychologistCarouselProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { getToken } = useAuth();
  const { psychologists, psychologistsLoading, psychologistsError } =
    useSelector((root: RootState) => root.session);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      const token = await getToken();
      if (token) dispatch(fetchPsychologists(token));
    };
    load();
  }, []);

  const scrollByCard = (direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;
    const amount = 272;
    track.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (psychologistsLoading) {
    return <p className="text-sm text-stone-400">Loading psychologists...</p>;
  }

  if (psychologistsError) {
    return <p className="text-sm text-red-500">{psychologistsError}</p>;
  }

  if (psychologists.length === 0) {
    return (
      <p className="text-sm text-stone-400">
        No psychologists available right now.
      </p>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scrollByCard("left")}
        aria-label="Previous psychologists"
        className="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-stone-200 bg-white p-2 shadow-sm hover:bg-stone-50"
      >
        <ChevronLeft className="h-4 w-4 text-stone-600" />
      </button>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {psychologists.map((psychologist) => (
          <PsychologistCard
            key={psychologist._id}
            psychologist={psychologist}
            selected={selectedPsychologistId === psychologist._id}
            onSelect={onSelect}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollByCard("right")}
        aria-label="Next psychologists"
        className="absolute right-0 top-1/2 z-10 translate-x-1/2 -translate-y-1/2 rounded-full border border-stone-200 bg-white p-2 shadow-sm hover:bg-stone-50"
      >
        <ChevronRight className="h-4 w-4 text-stone-600" />
      </button>
    </div>
  );
};

export default PsychologistCarousel;
