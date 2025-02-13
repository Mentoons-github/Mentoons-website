import ContributeYourPodcast from "@/components/shared/ContributeYourPodcast";
import HeroSectionPodcast from "@/components/shared/HeroSectionPodcast";
import HomeSection from "@/components/shared/hompage/HomeSection";
import PodcastSection from "@/components/shared/PodcastSection/PodcastSection";
import Testimonial from "@/components/shared/Testimonial";

const PodCast = () => {
  return (
    <>
      <HeroSectionPodcast />
      <PodcastSection />
      <HomeSection />
      <Testimonial />
      <ContributeYourPodcast />
    </>
  );
};

export default PodCast;
