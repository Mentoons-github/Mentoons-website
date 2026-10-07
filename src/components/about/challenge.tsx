const challenges = [
  "Family Bonding",
  "Social Balance",
  "Digital Addiction",
  "Relationship Challenges",
  "Emotional Disconnect",
  "Academic Distraction",
  "Job And Careers",
  "Gaming Addiction",
];

const ChallengesSection = () => {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-4xl font-semibold text-[#1A1A1A]">
        If you're facing these challenges, don't worry!
      </h2>

      <div className="flex flex-wrap gap-3">
        {challenges.map((label) => (
          <span
            key={label}
            className="rounded-full bg-[#D9D9D9] px-5 py-2.5 text-base text-[#333333]"
          >
            {label}
          </span>
        ))}
      </div>

      <p className="max-w-3xl text-base leading-relaxed text-[#4A4A4A]">
        We understand what families go through in today's digital world. Our
        programs help children build emotional balance, creativity, and
        meaningful real-life relationships.
      </p>
    </div>
  );
};

export default ChallengesSection;
