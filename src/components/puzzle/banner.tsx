const PuzzleBanner = () => {
  return (
    <div className="relative h-[75vh] flex justify-center items-center px-10 bg-[url('/assets/puzzle/bg.png')] bg-cover bg-center">
      <div className="space-y-4 max-w-2xl text-start relative z-10">
        <h1 className="text-4xl md:text-9xl font-bold font-epilogue">Puzzle</h1>
        <div className="space-y-4 font-outfit">
          <div className="flex items-center gap-3">
            <p className="text-lg md:text-xl text-gray-800 max-w-64 font-semibold tracking-wider">
              Get an Amazing new play game experience
            </p>
            <button
              onClick={() => {
                const section = document.getElementById("puzzles");
                section?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-orange-500 hover:bg-orange-600 px-6 py-2 text-white rounded-sm shadow-xl transition-colors"
            >
              Play Now
            </button>
          </div>
          <p className="max-w-80 tracking-wide">
            Challenge your brain, sharpen your skills, and enjoy every puzzle
            you play.
          </p>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        id="puzzles"
      >
        <div className="w-full h-full bg-gradient-to-t from-white/100 via-white/90 via-white/75 via-white/55 via-white/35 via-white/20 via-white/10 via-white/5 to-white/0"></div>
      </div>
    </div>
  );
};

export default PuzzleBanner;
