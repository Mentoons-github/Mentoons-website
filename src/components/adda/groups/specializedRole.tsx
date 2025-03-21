import GroupCards from "../cards/cards";

const Specialized = () => {
  const specializedRole = [
    {
      img: "/assets/adda/groups/explore/Man helping friend to stand up.png",
      mainTitle: "NGOs",
      subTitle: "NGOs",
      description: "Collaborate on social impact projects and initiatives.",
      bg: "#F7941D",
    },
    {
      img: "/assets/adda/groups/explore/Psychologist.png",
      mainTitle: "Psychologists",
      subTitle: "Psychologists Group",
      description:
        "Exchange insights and advice with mental health professionals.",
      bg: "#4285F4",
    },
    {
      img: "/assets/adda/groups/explore/teachers.png",
      mainTitle: "Academic Teachers",
      subTitle: "Academic Teachers",
      description: "Discuss teaching strategies and educational trends.",
      bg: "#652D90",
    },
  ];

  return (
    <div className="w-full px-4 py-6 md:px-8 lg:px-12 mt-20">
      <h1 className="w-full text-left font-semibold text-3xl md:text-4xl">
        Specialized Roles
      </h1>
      <GroupCards cardData={specializedRole} type="specializedRole" />
    </div>
  );
};

export default Specialized;
