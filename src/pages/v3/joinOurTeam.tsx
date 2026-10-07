import OpenPositions from "@/components/v3/joinUs/joinOurTeam";

const JoinOurTeam = () => {
  return (
    <div>
      <div className="flex w-full flex-col items-center gap-6 overflow-hidden rounded-2xl bg-gray-50 px-5 py-8 text-center sm:px-8 sm:py-10 md:flex-row md:gap-8 md:px-14 md:text-left">
        {/* text side */}
        <div className="w-full md:max-w-md md:shrink-0">
          <h1 className="mt-2 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-5xl">
            Let's Make a Bigger
            <br className="hidden sm:block" /> Impact Together
          </h1>
          <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
            At Mentoons, we create meaningful experiences for children, teens
            and families. Join our team and be part of a purpose-driven journey.
          </p>
        </div>

        {/* illustration side */}
        <div className="flex w-full flex-1 items-center justify-center">
          <img
            src="/assets/v3/joinOurTeam/jointeam.png"
            alt="Team members collaborating around a laptop"
            className="w-full max-w-xs object-contain sm:max-w-sm md:max-w-sm lg:max-w-md"
          />
        </div>
      </div>

      <OpenPositions />
    </div>
  );
};

export default JoinOurTeam;
