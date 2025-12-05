import { useEffect, useState } from "react";

interface StickMasterLobbyInterface {
  setDifficulty: () => void;
}

const StickMasterLobby = ({ setDifficulty }: StickMasterLobbyInterface) => {
  const [sticks, setSticks] = useState<
    Array<{
      id: number;
      x: number;
      delay: number;
      duration: number;
      rotation: number;
    }>
  >([]);
  const [isBurning, setIsBurning] = useState(true);

  useEffect(() => {
    const newSticks = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 4,
      rotation: Math.random() * 360,
    }));
    setSticks(newSticks);

    const timer = setTimeout(() => {
      setIsBurning(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[url('/assets/games/stickMatch/bg.png')] bg-cover bg-center bg-no-repeat overflow-hidden relative">
      {sticks.map((stick) => (
        <div
          key={stick.id}
          className="absolute w-1 h-12 bg-gradient-to-b from-red-500 to-amber-700 rounded-full opacity-20"
          style={{
            left: `${stick.x}%`,
            animation: `float ${stick.duration}s infinite ease-in-out`,
            animationDelay: `${stick.delay}s`,
            transform: `rotate(${stick.rotation}deg)`,
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-8 animate-bounce-slow relative">
          <img
            src="/assets/games/stickMatch/title.png"
            alt="Stick Master"
            className={`w-96 drop-shadow-2xl ${
              isBurning ? "animate-burning" : ""
            }`}
          />
          <p className="text-center text-black text-xl font-semibold tracking-wide mt-2 drop-shadow-lg">
            Move • Remove • Solve
          </p>
        </div>

        <button
          onClick={setDifficulty}
          className="w-1/2 py-4 bg-purple-300 text-xl font-bold border-4 border-purple-900 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 hover:brightness-110 relative overflow-hidden group"
        >
          <span className="relative z-10">PLAY NOW</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 group-hover:animate-shimmer"></div>
        </button>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(100vh) rotate(0deg);
          }
          50% {
            transform: translateY(-20vh) rotate(180deg);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes wiggle {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-5deg);
          }
          75% {
            transform: rotate(5deg);
          }
        }
        
        @keyframes pulse-fast {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes burning {
          0% {
            filter: brightness(3) contrast(2) saturate(4);
            opacity: 0.3;
          }
          25% {
            filter: brightness(1.5) contrast(1.3) saturate(2) hue-rotate(5deg);
            opacity: 0.6;
          }
          50% {
            filter: brightness(2) contrast(1.5) saturate(3) hue-rotate(-10deg);
            opacity: 0.8;
          }
          75% {
            filter: brightness(1.5) contrast(1.3) saturate(2) hue-rotate(10deg);
            opacity: 0.9;
          }
          100% {
            filter: brightness(1) contrast(1) saturate(1);
            opacity: 1;
          }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-wiggle {
          animation: wiggle 1.5s ease-in-out infinite;
        }
        
        .animate-pulse-fast {
          animation: pulse-fast 0.5s ease-in-out infinite;
        }

        .animate-burning {
          animation: burning 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default StickMasterLobby;
