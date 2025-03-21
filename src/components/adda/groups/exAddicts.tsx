import GroupCards from "../cards/cards";

const ExAddicts = () => {
  const ExAddicts = [
    {
      img: "/assets/adda/groups/support/Ex addict 1.png",
      mainTitle: "EX-ADDICTS SUPPORT",
      subTitle: "Ex-Addicts Support Groups",
      description:
        "Share recovery journeys and build resilience with like-minded individuals.",
      bg: "#652D90",
    },
    {
      img: "/assets/adda/groups/support/Professional growth 1.png",
      mainTitle: "PROFESSIONAL GROWTH",
      subTitle: "Professional Growth",
      description:
        "Career Corner: Network, seek advice, and explore new opportunities.",
      bg: "#FF9414",
    },
    {
      img: "/assets/adda/groups/support/parentGuidance.png",
      mainTitle: "PARENTING GUIDANCE",
      subTitle: "Parenting Guidance",
      description:
        "Learn and share strategies for effective and compassionate parenting.",
      bg: "#4285F4",
    },
  ];

  return (
    <div className="w-full px-4 py-6 md:px-8 lg:px-12 mt-20">
      <h1 className="w-full text-left font-semibold text-3xl md:text-4xl">
        Ex- Addicts Support Groups
      </h1>
      <GroupCards cardData={ExAddicts} type="specializedRole" />
    </div>
  );
};

export default ExAddicts;
