const MindMathLobby = ({
  showDifficultyModal,
}: {
  showDifficultyModal: () => void;
}) => {
  return (
    <div className="h-screen flex items-center justify-center bg-[url('/assets/games/mindMath/bg.jpg')] bg-cover bg-center">
      <button onClick={showDifficultyModal} className="group relative">
        <div className="absolute -inset-3 bg-gradient-to-r from-red-600 via-rose-500 to-red-600 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse"></div>

        <div className="relative px-16 py-6 bg-gradient-to-br from-red-600 via-red-500 to-rose-600 rounded-3xl shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-red-500/50 group-active:scale-95 border-2 border-white/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent"></div>

          <div className="relative flex items-center gap-3">
            <span className="text-4xl font-black text-white tracking-wider drop-shadow-2xl">
              PLAY
            </span>
            <svg
              className="w-8 h-8 text-white transform transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110 drop-shadow-lg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Corner highlights */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/50 rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/50 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/50 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/50 rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
    </div>
  );
};

export default MindMathLobby;
