const PlanHeader = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4 text-start">
        Workshop Plans
      </h1>
      <p className="text-xl leading-8 mt-5 text-gray-600 text-center">
        Fun, interactive workshops designed especially for kids aged 6–12.
        Learn, play, and grow with safe and engaging activities. Pick a plan
        that fits your child’s curiosity and helps them build skills step by
        step.
      </p>
    </div>
  );
};

export default PlanHeader;
