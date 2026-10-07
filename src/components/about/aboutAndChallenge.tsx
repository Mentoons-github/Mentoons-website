import AboutHeroSection from "./hero";
import ChallengesSection from "./challenge";

const AboutAndChallengesSection = () => {
  return (
    <section className="grid grid-cols-1 gap-10 px-6 py-12 md:grid-cols-2 md:px-16">
      <div className="flex flex-col justify-center gap-10">
        <AboutHeroSection />
        <ChallengesSection />
      </div>

      <div className="min-h-[420px] rounded-md bg-[#D9D9D9] md:min-h-0" />
    </section>
  );
};

export default AboutAndChallengesSection;
