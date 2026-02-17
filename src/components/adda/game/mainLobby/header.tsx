const GameLobbyHeader = () => {
  return (
    <div className="relative overflow-hidden pt-16 pb-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 text-center md:px-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent animate-gradient">
          Game Lobby
        </h1>
        <p className="text-gray-400 md:text-xl max-w-2xl mx-auto">
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
  );
};

export default GameLobbyHeader;
