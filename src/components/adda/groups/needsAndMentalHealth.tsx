import GroupCards from "../cards/cards";

const NeedsAndMentalHealth = () => {
  const specializedRole = [
    {
      img: "/groups/specialNeeds/autisticKids.png",
      mainTitle: "AUTISTIC KIDS",
      subTitle: "Autistic Kids",
      description:
        "Discuss care routines, milestones, and health with parents who are raising infants",
      bg: "#F7941D",
    },
    {
      img: "/groups/specialNeeds/Depression .png",
      mainTitle: "Depression",
      subTitle: "Depression and Anxiety Support",
      description:
        "Discuss care routines, milestones, and health with parents who are raising Toddlers",
      bg: "#4285F4",
    },
    {
      img: "/groups/specialNeeds/stressManagement.png",
      mainTitle: "Stress Managment",
      subTitle: "Stress Management",
      description:
        "Discuss care routines, milestones, and health with parents who are raising Pre-teen kids.",
      bg: "#652D90",
    },
  ];

  return (
    <div className="w-full px-4 py-6 md:px-8 lg:px-12 mt-20">
      <h1 className="w-full text-left font-semibold text-3xl md:text-4xl">
        Special Needs and Mental Health
      </h1>
      <GroupCards cardData={specializedRole} type="specializedRole" />
    </div>
  );
};

export default NeedsAndMentalHealth;
