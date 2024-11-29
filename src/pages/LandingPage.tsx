import HeroSection from "@/components/LandingPage/HeroSection"
import Struggles from "@/components/LandingPage/Struggles"
import MdMultiverse from "@/components/LandingPage/MdMultiverse"
import ComicSection from "@/components/LandingPage/ComicSection"
import PodcastSection from "@/components/LandingPage/PodcastSection"
import WorkshopSection from "@/components/LandingPage/WorkshopSection"
const LandingPage = () => {
  return (
    <div>
      <HeroSection />
      <Struggles />
      <MdMultiverse />
      <ComicSection />
      <WorkshopSection />
      <PodcastSection />
    </div>
  )
}
export default LandingPage
