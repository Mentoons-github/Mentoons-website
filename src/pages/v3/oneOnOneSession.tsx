import { useState } from "react";
import HeroSection from "@/components/v3/oneOnOneSession/heroSection";
import PsychologistSection from "@/components/v3/oneOnOneSession/psychologists";
import BookingSection from "@/components/v3/oneOnOneSession/bookingSection";
import { Psychologist } from "@/redux/sessionSlice";

const OneOnOneSessionPage = () => {
  const [selectedPsychologist, setSelectedPsychologist] =
    useState<Psychologist | null>(null);

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <HeroSection />
      </div>

      <div className="px-4 py-8 sm:px-6 lg:px-14">
        <PsychologistSection
          selectedPsychologistId={selectedPsychologist?._id}
          onSelect={setSelectedPsychologist}
        />
      </div>

      <div className="px-4 py-8 sm:px-6 lg:px-14">
        <BookingSection selectedPsychologist={selectedPsychologist} />
      </div>
    </div>
  );
};

export default OneOnOneSessionPage;
