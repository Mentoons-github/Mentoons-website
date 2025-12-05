import { useState, useEffect } from "react";

const BrainStackLobby = ({
  showDifficultyModal,
}: {
  showDifficultyModal: () => void;
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-5 bg-[url('/assets/games/mindStack/bg.jpg')] bg-cover bg-center">
      <div
        className={`transform transition-all duration-1000 ${
          showContent
            ? "translate-y-0 opacity-100"
            : "-translate-y-20 opacity-0"
        }`}
      >
        <img
          src="/assets/games/mindStack/title.png"
          alt="title"
          className="w-full max-w-md mx-auto"
        />
      </div>

      <div
        className={`transform transition-all duration-1000 delay-300 ${
          showContent
            ? "translate-y-0 opacity-100"
            : "-translate-y-20 opacity-0"
        }`}
      >
        <button
          onClick={showDifficultyModal}
          className="relative px-12 py-4 text-3xl font-bold text-white bg-gradient-to-b from-green-400 to-green-600 rounded-lg shadow-lg hover:from-green-500 hover:to-green-700 active:scale-95 transition-all border-4 border-green-300 hover:border-green-200"
        >
          <span className="relative z-10">START GAME</span>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
        </button>
      </div>
    </div>
  );
};

export default BrainStackLobby;
