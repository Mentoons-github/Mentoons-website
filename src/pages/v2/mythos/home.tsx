import HelperList from "@/components/common/helperList/helperList";
import ProblemFaced from "@/components/mythos/home/problemFaced";
import AboutMythos from "@/components/mythos/home/about";
import MythosBanner from "@/components/mythos/home/banner";
import BlogsForYou from "@/components/mythos/home/blogsForYou";
import ComingSoon from "@/components/common/comingSoon/comingSoon";
// import MembershipPlans from "../../components/mythos/home/membershipPlans";
// import PersonalReport from "../../components/mythos/home/personalReport";
// import SignUpSection from "../../components/mythos/home/signUp";
// import StepsGuide from "../../components/mythos/home/stepGuide";
// import TypeOfIntelligence from "../../components/mythos/home/typeOfIntelligence";
// import GroupsSuggested from "../../components/mythos/home/groupsSuggested/groupsSuggested";

const MythosHome = () => {
  // const helps = {
  //   "Clarity, Purpose & Vision":
  //     "Establishes a clear academic, career, and life path tailored to your strengths and destiny.",
  //   "Career Session with a Psychologist":
  //     "Gain expert psychological guidance to align your aspirations with your innate potential.",
  //   "Time-Saving & Efficient":
  //     "Avoid unnecessary career experiments by making informed choices based on planetary movements and expert insights.",
  // };

  const helps = {
    "Psychology assessment":
      "a thorough assessment of your intelligence based on Howard Gardner’s (theory of 9 intelligences)",
    "Planetary impacts":
      "on your academics and career along with a detailed assessment report will be provided with necessary guidelines ",
    "Get one-on-one": "video call session with our career guides ",
  };
  return (
    <div className="relative">
      <ComingSoon />
      <MythosBanner />
      <AboutMythos />
      <ProblemFaced />
      {/* <PersonalReport />
      <TypeOfIntelligence />
      <StepsGuide /> */}
      <HelperList data={helps} label="HOW WE HELP YOU" />
      {/* <GroupsSuggested /> */}
      <BlogsForYou />
      {/* <MembershipPlans />
      <SignUpSection /> */}

      {/* Uncomment these comments when integrating it */}
    </div>
  );
};

export default MythosHome;
