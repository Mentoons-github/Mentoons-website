import FAQ from "@/components/mythos/about/FAQ";
import CreateGroupSection from "@/components/mythos/groups/CreateGroupSection";
import GroupsCardSection from "@/components/mythos/groups/GroupsCardSection";
import GroupsHeroSection from "@/components/mythos/groups/GroupsHeroSection";
import GroupsSunshineCardSection from "@/components/mythos/groups/GroupsSunshineCardSection";
const MythosGroups = () => {
  return (
    <div>
      <GroupsHeroSection />
      <GroupsCardSection />
      <GroupsSunshineCardSection />
      <CreateGroupSection />
      <FAQ />
    </div>
  );
};

export default MythosGroups;
