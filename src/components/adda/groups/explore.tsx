import GroupCards from "../cards/cards";

const Explore = () => {
  const exploreGroups = [
    {
      img: "/groups/explore/age 2-5.png",
      mainTitle: "Ages 2 - 5",
      description:
        "Tiny Explorers Gazette: Discovering the wonders of the World for the Little Ones!",
      bg: "#F7941D",
    },
    {
      img: "/groups/explore/age 6-12.png",
      mainTitle: "Ages 6 - 12",
      description:
        "Junior Discoverers Chronicles: Unraveling the Marvels of Knowledge for Young Minds.",
      bg: "#652D90",
    },
    {
      img: "/groups/explore/age 13-19.png",
      mainTitle: "Ages 13 - 19",
      description: "Young Horizon: Breaking news and Trends for the Teens",
      bg: "#4285F4",
    },
    {
      img: "/groups/explore/20+.png",
      mainTitle: "Ages 20+",
      description: "Beyond boundaries: News for the grown up generation.",
      bg: "#F7941D",
    },
    {
      img: "/groups/explore/parents.png",
      mainTitle: "PARENTS & carers",
      description:
        "Parenting perspectives: Insights and updates for Moms & Dads",
      bg: "#652D90",
    },
  ];

  return (
    <div className="w-full px-4 py-6 md:px-8 lg:px-12">
      <h1 className="w-full text-left font-semibold text-3xl md:text-4xl">
        Explore Our <span className="text-[#F7941D]">Groups</span>
      </h1>
      <GroupCards cardData={exploreGroups} type="parents" />
    </div>
  );
};

export default Explore;
