import HelperList from "@/components/common/helperList/helperList";
import ProblemFaced from "@/components/mythos/home/problemFaced";
import AboutMythos from "@/components/mythos/home/about";
import MythosBanner from "@/components/mythos/home/banner";
import BlogsForYou from "@/components/mythos/home/blogsForYou";
import MembershipPlans from "@/components/mythos/home/membershipPlans";
import PersonalReport from "@/components/mythos/home/personalReport";
import SignUpSection from "@/components/mythos/home/signUp";
import StepsGuide from "@/components/mythos/home/stepGuide";
import TypeOfIntelligence from "@/components/mythos/home/typeOfIntelligence";
import GroupsSuggested from "@/components/mythos/home/groupsSuggested/groupsSuggested";
import { SignedOut } from "@clerk/clerk-react";

const MythosHome = () => {

  const helps = {
    "Psychology assessment":
      "a thorough assessment of your intelligence based on Howard Gardner’s (theory of 9 intelligences)",
    "Planetary impacts":
      "on your academics and career along with a detailed assessment report will be provided with necessary guidelines ",
    "Get one-on-one": "video call session with our career guides ",
  };
  return (
    <div>
      <MythosBanner />
      <AboutMythos />
      <ProblemFaced />
      <PersonalReport />
      <TypeOfIntelligence />
      <StepsGuide />
      <HelperList data={helps} label="HOW WE HELP YOU" />
      <GroupsSuggested />
      <BlogsForYou />
      <MembershipPlans />
      <SignedOut>
        <SignUpSection />
      </SignedOut>
    </div>
  );
};

export default MythosHome;
