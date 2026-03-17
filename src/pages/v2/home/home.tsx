import HomeBanner from "@/components/Home/newVersion/banner";
import CommonIssue from "@/components/Home/newVersion/commonIssue";
import Join from "@/components/Home/newVersion/join";
import MentoonsHelp from "@/components/Home/newVersion/mentoonsHelp";
import MoreWeHave from "@/components/Home/newVersion/moreWeHave";
import HowCanWeSolveSection from "@/components/Home/newVersion/solution";
import StatisticVideo from "@/components/Home/newVersion/statisticVideo";

const NewHome = () => {
  return (
    <div className="overflow-hidden">
      <HomeBanner />
      <StatisticVideo />
      <CommonIssue />
      <HowCanWeSolveSection />
      <MentoonsHelp />
      <MoreWeHave />
      <Join />
    </div>
  );
};

export default NewHome;
