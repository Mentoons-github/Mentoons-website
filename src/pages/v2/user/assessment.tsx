import AssessmentCards from "@/components/assessment/assessmentCards";
import DiscoverYourself from "@/components/assessment/discoverYourself";
import SampleReport from "@/components/assessment/sampleRepoert";
import FAQ from "./faq/faq";
import { FAQ_PRODUCT } from "@/constant/faq";
import WeAreHiring from "@/components/assessment/weAreHiring";
import { useEffect, useState } from "react";
import { HIRING } from "@/constant/constants";
import { Hiring } from "@/types";

const Assessment = () => {
  const [hiring, setHiring] = useState<Hiring[] | []>([]);
  useEffect(() => {
    setHiring(HIRING);
  }, []);

  return (
    <>
      <DiscoverYourself />
      <SampleReport />
      <div className="flex flex-col lg:flex-row justify-between items-start mt-20 p-5 md:p-10 lg:p-15 gap-10">
        <div className="w-full lg:w-3/4">
          <AssessmentCards />
        </div>
        <div className="w-full lg:w-1/4 p-3 flex flex-col justify-start items-center gap-10">
          <WeAreHiring hiring={hiring} />
        </div>
      </div>
      <FAQ data={FAQ_PRODUCT} />
    </>
  );
};

export default Assessment;
