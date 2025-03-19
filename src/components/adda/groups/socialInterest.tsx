import GroupCards from "../cards/cards";

const SocialInterest = () => {
  const interests = [
    {
      img: "/groups/socialInterests/Social media on different devices.png",
      mainTitle: "Social Media Enthusiasts",
      subTitle: "Social Media Enthusiasts",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      bg: "#F7941D",
    },
    {
      img: "/groups/socialInterests/Gaming .png",
      mainTitle: "Gamers and Influencers",
      subTitle: "Gamers and Influencers",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      bg: "#652D90",
    },
    {
      img: "/groups/socialInterests/flavors exploration illustration.png",
      mainTitle: "Cooking Enthusiasts",
      subTitle: "Cooking Enthusiasts",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      bg: "#4285F4",
    },
  ];

  return (
    <div className="w-full px-4 py-6 md:px-8 lg:px-12 mt-20">
      <h1 className="w-full text-left font-semibold text-3xl md:text-4xl">
        Social Interests
      </h1>
      <GroupCards cardData={interests} type="specializedRole" />
    </div>
  );
};

export default SocialInterest;
