
const HeroSection = () => {
    return (
        <div className="w-full h-[85vh] lg:h-[97vh] relative">
            <img src="/assets/LandingPage/hero-bg-top.png" alt="hero-bg" className="absolute w-full object-top" />
            
            {/* New heading added here */}
          
            
            <div className="flex flex-col md:flex-row lg:flex-row items-center justify-between w-full py-[5vh] px-[5vw] relative z-10 lg:pt-[2vh]">
                <figure className="w-[70vw] sm:w-[50vw] md:w-[35vw] lg:w-[25vw]">
                    <img src="/assets/LandingPage/logo.png" alt="logo" className="w-full h-full object-contain" />
                </figure>
                <figure className="relative w-[90vw] sm:w-[70vw] md:w-[40vw] lg:w-[30vw]">
                    <h1 className="text-[7vw] sm:text-[4vw] md:text-[3vw] lg:text-[2vw] font-bold text-center">Transforing Lives Through</h1>
                    <h1 className="absolute top-[26%] left-1/2 -translate-x-1/2 text-[7vw] sm:text-[4vw] md:text-[3vw] lg:text-[2vw] text-white font-bold whitespace-nowrap">MENTORING AND</h1>
                    <h1 className="absolute bottom-[19%] left-[50%] text-[7vw] sm:text-[4vw] md:text-[3vw] lg:text-[2vw] text-white font-bold">CARTOONS</h1>
                    <img src="/assets/LandingPage/mentoring.png" alt="hero-text" className="w-full h-full object-contain" />
                </figure>
            </div>
            <figure className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-5 md:left-8 lg:left-10 w-[45vw] md:w-[35vw] lg:w-[20vw] z-10 lg:z-auto">
                <img src="/assets/LandingPage/psyco.png" alt="psyco" className="w-full h-full object-contain" />
            </figure>
            <h1 className="absolute top-[1/2] -translate-y-1/2 lg:top-[50%] right-[20%] text-[3vw] sm:text-[2vw] md:text-[1.8vw] lg:text-[1.5vw] text-black font-bold text-center tracking-wide z-20 animate-pulse">
                Hello teenagers, parents and<br/> everyday tech-users!
            </h1>
            <figure className="w-[70vw] sm:w-[60vw] md:w-[40vw] lg:w-[25vw] absolute bottom-[2vh] lg:bottom-[18vh] left-1/2 -translate-x-1/2 z-10 lg:z-auto">
                <img src="/assets/LandingPage/hero.png" alt="hero-text" className="w-full h-full object-contain" />
            </figure>
            <figure className="absolute bottom-0 left-0 w-full">
                <img src="/assets/LandingPage/bg-bot.png" alt="hero-bg" className="w-full h-full object-cover" />
            </figure>
            <h1 className="absolute bottom-[1vh] lg:bottom-[5vh] left-1/2 -translate-x-1/2 text-[2vw] md:text-[1.5vw] lg:text-[2vw] text-white font-semibold text-center">Dive into a fun and engaging journey to<br/> expand your knowledge             </h1>
            
            {/* Existing decorative elements */}
            <div className="absolute top-[20vh] right-[20vw] animate-float">
                <div className="w-[2vw] h-[2vw] rounded-full bg-purple-500/30"></div>
            </div>
            <div className="absolute bottom-[40vh] left-[20vw] animate-float-delayed">
                <div className="w-[3vw] h-[3vw] rotate-45 bg-blue-400/20"></div>
            </div>
            <div className="absolute top-[40vh] left-[12.5vw] animate-float-reverse">
                <div className="w-[1.5vw] h-[1.5vw] bg-pink-400/20 rounded-lg"></div>
            </div>
            <div className="absolute bottom-[60vh] right-[33.3vw] animate-float-slow">
                <div className="w-[3.3vw] h-[3.3vw] bg-yellow-300/20 rounded-full"></div>
            </div>
            <div className="absolute top-[15vh] right-[12.5vw] animate-spin-slow">
                <div className="w-[4vw] h-[1vw] bg-green-400/20 rounded-full"></div>
            </div>
            <div className="absolute top-[12.5vw] right-[33.3vw] animate-bounce-slow">
                <div className="w-[1.3vw] h-[1.3vw] border-2 border-teal-400/30 rotate-45"></div>
            </div>
        </div>
    )
}

export default HeroSection