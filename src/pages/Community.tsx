import Feedback from "./feedback";
import JoinCommunity from "./joinCommunity";

const CommunitySection = () => {
  return (
    <section className="py-20 px-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <JoinCommunity />
        <Feedback />
      </div>
    </section>
  );
};

export default CommunitySection;
