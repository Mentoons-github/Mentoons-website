const cards = [
  {
    title: "Assessments",
    description:
      "Understand your child better with quick, psychologist-designed assessments that reveal strengths and areas to work on.",
    path: "/assessment-page",
  },
  {
    title: "Podcast",
    description:
      "Short, expert-backed episodes on mobile addiction, gaming addiction and teen emotions for parents and kids alike.",
    path: "/mentoons-podcast",
  },
  {
    title: "Shop",
    description:
      "Story cards, journals and coloring books designed by psychologists to help kids express themselves and grow.",
    path: "/products",
  },
  {
    title: "Games",
    description:
      "Sharpen focus, memory and logic with a lobby full of quick, thrilling brain games for every age.",
    path: "/adda/game-lobby",
  },
];

const HowMentoonsHelpsYourChild = () => {
  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="py-10 px-20">
      <h1 className="text-4xl font-semibold">
        What you can do to help your child through Mentoons?
      </h1>
      <div className="flex items-center justify-center gap-8 mt-10">
        {cards.map((card) => (
          <div
            key={card.title}
            className="flex flex-col flex-1 items-center justify-center gap-3 p-3"
          >
            <div className="w-full h-48 bg-gray-400" />
            <h3 className="text-2xl">{card.title}</h3>
            <p className="text-sm text-center">{card.description}</p>
            <button
              onClick={() => handleNavigate(card.path)}
              className="w-full h-auto py-3 border border-gray-400 bg-orange-500 text-white font-medium"
            >
              Explore
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowMentoonsHelpsYourChild;
