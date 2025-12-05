import { GAMES } from "@/constant/adda/game/game";

const Games = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <div className="relative overflow-hidden pt-16 pb-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 text-center px-8">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent animate-gradient">
            Game Collection
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Sharpen your mind, boost creativity, and enhance your logical and
            numerical skills as you embark on thrilling adventures.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            <div className="h-1 w-1 bg-cyan-500 rounded-full"></div>
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center gap-5 p-8">
        {GAMES.map((game, index) => (
          <div
            key={index}
            className="group relative rounded-xl border-2 border-gray-700 w-full h-64 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 hover:border-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
          >
            <div className="absolute left-4 top-8 bottom-8 w-1 bg-gradient-to-b from-transparent via-white to-transparent opacity-60 blur-sm z-10"></div>
            <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gradient-to-b from-transparent via-white to-transparent z-10"></div>

            <div className="relative w-full h-full">
              {game.thumbnail ? (
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl font-bold">
                  {game.title}
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-white font-semibold text-lg text-center">
                  {game.title}
                </h3>
              </div>

              <a
                href={game.link}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-sm z-20"
              >
                <span className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xl rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all">
                  Play
                </span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;
