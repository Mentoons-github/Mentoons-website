import BenefitsSection from "@/components/about/benefit";
import AudienceSection from "@/components/about/audience";
import ContactSupportSection from "@/components/about/contact";
import AboutAndChallengesSection from "@/components/about/aboutAndChallenge";

const MentoonsAboutPage = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF7]">
      <AboutAndChallengesSection />
      <BenefitsSection />
      <AudienceSection />
      <ContactSupportSection />
    </div>
  );
};

export default MentoonsAboutPage;
