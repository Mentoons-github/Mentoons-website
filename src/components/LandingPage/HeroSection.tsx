const HeroSection = () => {
    return (
        <div className="w-full h-[86vh] lg:h-[92vh]">
            <div className="w-full h-full relative bg-[url('/assets/LandingPage/fullbg.png')] bg-cover bg-bottom bg-no-repeat">
                <div className="flex flex-col lg:flex-row items-center justify-between w-full py-10 md:py-10 px-4 md:px-20 relative z-10">
                    <figure className="w-full h-full">
                        <img src="/assets/LandingPage/logo.png" alt="hero-bg" className="mx-auto md:mx-0 w-32 sm:w-40 md:w-40 lg:w-auto" />
                    </figure>
                    <div className="mt-2 md:mt-0 relative">
                        <h1 className="text-black text-lg sm:text-xl md:text-xl lg:text-4xl font-bold text-center animate-fade-in">
                            Transforming Lives Through
                        </h1>
                        <figure className="relative w-[14rem] md:w-[22rem] lg:w-[30rem]">
                            <h1 className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white text-lg sm:text-xl md:text-2xl lg:text-5xl font-bold whitespace-nowrap animate-slide-in">
                                MENTORING AND
                            </h1>
                            <h1 className="absolute top-[50%] left-[40%] text-white text-lg sm:text-xl md:text-2xl lg:text-5xl font-bold whitespace-nowrap animate-bounce-in">
                                CARTOONS
                            </h1>
                            <img src="/assets/LandingPage/mentoring.png" alt="hero-text" className="w-full h-full" />
                        </figure>
                    </div>
                </div>
                <figure className="absolute lg:top-1/2 transform -translate-y-1/2 top-[35%] md:top-[35%] left-6 md:left-16 w-[8rem] md:w-[12rem] lg:w-[20rem] transition-transform hover:scale-105 z-10">
                    <img src="/assets/LandingPage/psyco.png" alt="hero-image" className="w-full h-full" />
                </figure>
                <figure className="absolute left-1/2 transform -translate-x-1/2 w-[20rem] md:w-[28rem] lg:w-[40rem] bottom-20 md:bottom-24 lg:bottom-40 transition-transform hover:-translate-y-2">
                    <img src="/assets/LandingPage/hero.png" alt="hero-image" className="w-full h-full" />
                </figure>
                <h1 className="absolute bottom-10 lg:bottom-16 left-1/2 transform -translate-x-1/2 text-white text-[14px] md:text-xl lg:text-3xl font-bold whitespace-nowrap animate-fade-in">
                    Dive into a fun and engaging journey to expand your knowledge
                </h1>
                <div className="absolute top-20 right-20 animate-float hidden md:block">
                    <div className="w-8 h-8 rounded-full bg-purple-500/30"></div>
                </div>
                <div className="absolute bottom-40 left-20 animate-float-delayed hidden md:block">
                    <div className="w-12 h-12 rotate-45 bg-blue-400/20"></div>
                </div>
                <div className="absolute top-40 left-1/4 animate-float-reverse hidden md:block">
                    <div className="w-6 h-6 bg-pink-400/20 rounded-lg"></div>
                </div>
                <div className="absolute bottom-60 right-1/3 animate-float-slow hidden md:block">
                    <div className="w-10 h-10 bg-yellow-300/20 rounded-full"></div>
                </div>
                <div className="absolute top-1/3 right-1/4 animate-spin-slow hidden md:block">
                    <div className="w-16 h-4 bg-green-400/20 rounded-full"></div>
                </div>
                <div className="absolute top-1/4 right-1/3 animate-bounce-slow hidden md:block">
                    <div className="w-4 h-4 border-2 border-teal-400/30 rotate-45"></div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection
