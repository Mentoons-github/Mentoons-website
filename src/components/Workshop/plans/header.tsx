const PlanHeader = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1
        className="font-comic-chip text-5xl md:text-7xl text-[#ffd93d] -rotate-2 tracking-wide"
        style={{
          WebkitTextStroke: "3px #000",
          paintOrder: "stroke fill",
          textShadow: "5px 5px 0 #000",
        }}
      >
        Workshop Plans
      </h1>

      {/* Speech bubble */}
      <div className="relative mt-8 max-w-3xl bg-white border-4 border-black shadow-[6px_6px_0_#000] px-5 py-4 md:px-8 md:py-6">
        <p className="text-base md:text-xl leading-8 text-gray-800">
          Fun, interactive workshops designed especially for kids aged 6–12.
          Learn, play, and grow with safe and engaging activities. Pick a plan
          that fits your child’s curiosity and helps them build skills step by
          step.
        </p>
        {/* bubble tail */}
        <span className="absolute -top-[22px] left-10 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[22px] border-b-black" />
        <span className="absolute -top-[14px] left-[42px] w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[18px] border-b-white" />
      </div>
    </div>
  );
};

export default PlanHeader;
