const Role = () => {
  const ROLES = [
    {
      name: "Employees",
      gradient: "from-blue-500 to-blue-700",
      icon: "💼",
    },
    {
      name: "Teachers",
      gradient: "from-red-500 to-red-700",
      icon: "📚",
    },
    {
      name: "Psychologists",
      gradient: "from-green-500 to-green-700",
      icon: "🧠",
    },
    {
      name: "Freelancers",
      gradient: "from-yellow-500 to-yellow-700",
      icon: "✨",
    },
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Header - Floating on top */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-white/95 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl px-8 py-4">
          <img
            src="/assets/common/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
            alt="Mentoons logo"
            className="w-36 h-12 mx-auto mb-2"
          />
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-transparent bg-clip-text text-center tracking-tight">
            Welcome to Mentoons
          </h1>
        </div>
      </div>

      {/* 2x2 Grid filling entire screen */}
      <div className="grid grid-cols-2 h-full w-full">
        {ROLES.map((role, i) => (
          <button
            key={i}
            className={`group relative overflow-hidden bg-gradient-to-br ${role.gradient} 
              border-2 border-white/20 hover:border-white/40
              transition-all duration-500 hover:scale-[1.02] active:scale-95
              flex items-center justify-center`}
          >
            {/* Overlay for hover effect */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

            {/* Content Container */}
            <div className="relative flex flex-col items-center justify-center space-y-6 p-8">
              {/* Icon */}
              <div className="text-9xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 drop-shadow-2xl">
                {role.icon}
              </div>

              {/* Role Name */}
              <h2 className="text-6xl font-black text-white drop-shadow-lg text-center group-hover:scale-105 transition-transform duration-300">
                {role.name}
              </h2>

              {/* Animated Arrow */}
              <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                <svg
                  className="w-12 h-12 text-white drop-shadow-lg animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </div>

            {/* Shine Effect on Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>

            {/* Corner Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        ))}
      </div>

      {/* Decorative floating elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />
    </div>
  );
};

export default Role;
