import ExAddicts from "@/components/adda/groups/exAddicts";
import Explore from "@/components/adda/groups/explore";
import NeedsAndMentalHealth from "@/components/adda/groups/needsAndMentalHealth";
import Parents from "@/components/adda/groups/parents";
import SocialInterest from "@/components/adda/groups/socialInterest";
import Specialized from "@/components/adda/groups/specializedRole";

const Groups = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="flex flex-col justify-center items-center w-full">
        <Parents />
        <Explore />
        <Specialized />
        <SocialInterest />
        <NeedsAndMentalHealth />
        <ExAddicts />
      </div>
    </div>
  );
};

export default Groups;
