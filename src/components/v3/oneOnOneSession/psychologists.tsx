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
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-900">
          Choose Your Psychologist
        </h2>
        <a
          href="#"
          className="flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-stone-900"
        >
          View All Psychologists
          <ChevronRight className="h-4 w-4" />
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
