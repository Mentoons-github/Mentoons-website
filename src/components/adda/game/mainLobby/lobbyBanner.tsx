const LobbyBanner = () => {
  return (
    <div className="relative h-[60vh] p-0 flex items-center justify-center bg-white bg-[url('/assets/adda/gameLobby/bg/bg1.jpg')] bg-center bg-cover">
      <img
        src="/assets/adda/gameLobby/joystick.png"
        alt="joystick"
        className="w-1/5"
      />
      <h1
        className="font-extrabold text-8xl text-center 
             bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 
             bg-clip-text text-transparent 
             drop-shadow-[0_4px_20px_rgba(37,99,235,0.5)]
             px-8 py-4 rounded-2xl"
        style={{
          WebkitTextStroke: "2px rgba(0, 0, 0, 0.3)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        GAME
        <br />
        <span
          className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 
                   bg-clip-text text-transparent 
                   drop-shadow-[0_4px_20px_rgba(249,115,22,0.5)]"
          style={{
            WebkitTextStroke: "2px rgba(0, 0, 0, 0.3)",
          }}
        >
          LOBBY
        </span>
      </h1>
    </div>
  );
};

export default LobbyBanner;
