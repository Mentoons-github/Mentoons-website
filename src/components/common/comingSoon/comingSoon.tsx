const ComingSoon = () => {
  return (
    <div className="fixed inset-0 flex grid place-items-center backdrop-blur-md bg-white/30 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 flex flex-col items-center text-center animate-fade-in transform transition-transform hover:scale-105 duration-300">
        <h1 className="font-akshar text-3xl sm:text-4xl text-blue-600 font-bold tracking-wide mb-2">
          Stay Tuned
        </h1>
        <p className="text-gray-700 text-xs sm:text-sm max-w-xs sm:max-w-sm leading-snug">
          Exciting updates are coming soon!
        </p>
        <img
          src="/assets/upcoming/comingsoon/Coming soon illustration.png"
          alt="coming-soon"
          className="h-80 sm:h-[32rem] w-auto mt-4 sm:mt-6"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default ComingSoon;
