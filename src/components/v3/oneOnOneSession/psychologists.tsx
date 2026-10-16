import { ChevronRight } from "lucide-react";
import PsychologistCarousel from "./psychologistCarousal";
import { Psychologist } from "@/redux/sessionSlice";

interface PsychologistSectionProps {
  selectedPsychologistId?: string;
  onSelect: (psychologist: Psychologist) => void;
}

const PsychologistSection = ({
  selectedPsychologistId,
  onSelect,
}: PsychologistSectionProps) => {
  return (
    <section className="mt-10 w-full">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2
          className="font-comic inline-block -rotate-1 rounded-2xl border-2 border-gray-900 bg-[#FF5D8F] px-5 py-1 text-3xl tracking-wide text-white shadow-[5px_5px_0_0_#111827] sm:text-4xl"
          style={{
            WebkitTextStroke: "1px #111827",
            textShadow: "3px 3px 0 #111827",
          }}
        >
          Choose Your Psychologist
        </h2>
        <a
          href="#"
          className="font-comic-chip flex items-center gap-1 rounded-xl border-2 border-gray-900 bg-[#FFD93D] px-4 py-2 text-base tracking-wide text-gray-900 shadow-[4px_4px_0_0_#111827] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#111827] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        >
          View All Psychologists
          <ChevronRight className="h-5 w-5" strokeWidth={3} />
        </a>
      </div>

      <PsychologistCarousel
        selectedPsychologistId={selectedPsychologistId}
        onSelect={onSelect}
      />
    </section>
  );
};

export default PsychologistSection;
