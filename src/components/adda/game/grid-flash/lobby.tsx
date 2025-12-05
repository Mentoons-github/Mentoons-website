import { useEffect, useRef, useState } from "react";

const GridFlashLobby = ({
  selectDifficulty,
}: {
  selectDifficulty: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (videoLoaded) {
      setTimeout(() => setShowTitle(true), 800);
    }
  }, [videoLoaded]);

  const handlePlayClick = () => {
    selectDifficulty();
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        src="/assets/games/gridFlash/bg/bd transistion.mp4"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setVideoLoaded(true)}
      />

      <div
        className={`relative z-10 flex flex-col items-center gap-2 -space-y-8 transition-all duration-1500 ease-out ${
          showTitle
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-75 -translate-y-12"
        }`}
      >
        <img
          src="/assets/games/gridFlash/image.png"
          className="drop-shadow-2xl animate-float -mb-12"
          alt="title"
          style={{ filter: "drop-shadow(0 0 30px rgba(139, 92, 246, 0.6))" }}
        />

        <button
          onClick={handlePlayClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`group relative px-12 py-3 
                  bg-gradient-to-r from-blue-400 to-blue-600 
                  rounded-full text-white font-bold text-2xl shadow-2xl
                  transition-all duration-200 ease-out
                  
                  border-l-4 border-b-8 border-r-4 border-black/40
    
                  active:border-l-0 active:border-r-0 active:border-b-0 active:translate-y-1
    
                  hover:scale-110 hover:shadow-purple-500/50 
                  ${showTitle ? "animate-bounce-in" : "opacity-0"}`}
        >
          <span className="flex items-center gap-3">
            <svg
              className="w-8 h-8 transition-transform duration-300 group-hover:translate-x-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            PLAY
          </span>

          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 
                    transition-all duration-300 
                    ${
                      isHovered ? "scale-110 opacity-30" : "scale-100 opacity-0"
                    }`}
            style={{ filter: "blur(10px)" }}
          />
        </button>
      </div>

      {showTitle && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                opacity: 0.3 + Math.random() * 0.3,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px) scale(1); }
              50% { transform: translateY(-8px) scale(1.01); }
            }
    
            @keyframes particle {
              0% { transform: translateY(0) scale(0); opacity: 0; }
              50% { opacity: 0.6; transform: scale(1); }
              100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
            }
    
            @keyframes bounce-in {
              0% { transform: scale(0.8) translateY(5px); opacity: 0; }
              50% { transform: scale(1.1); }
              100% { transform: scale(1) translateY(0); opacity: 1; }
            }
    
            .animate-float { animation: float 3s ease-in-out infinite; }
            .animate-particle { animation: particle 4s linear infinite; }
            .animate-bounce-in {
              animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
              opacity: 0;
            }
          `}</style>
    </div>
  );
};

export default GridFlashLobby;
