const MdMultiverse = () => {
    return (
        <div className="w-full h-full relative" style={{ background: 'linear-gradient(355.82deg, rgba(184, 212, 255, 0.81) -12.98%, rgba(9, 39, 84, 0.94) 76.23%)' }}>
            <img src="/assets/LandingPage/stars.png" alt="multiverse" className="w-full object-contain absolute top-0 left-0" />
            <div className="flex flex-row items-center lg:justify-start justify-center h-full p-10 lg:p-10 lg:gap-10 lg:ml-20">
                <h1 className="text-white text-4xl lg:text-7xl  font-bold">HERE'S HOW<br />
                    WE CAN HELP
                </h1>
                <figure>
                    <img src="/assets/LandingPage/md-exp.png" alt="md-multiverse" />
                </figure>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 p-10">
                <figure className="lg:w-[70%]">
                    <img
                        src="/assets/images/mentoons-offering-comic.png"
                        alt=""
                        className=" w-full object-contain md:pr-12"
                    />
                </figure>
                <figure className="lg:w-[70%]">
                    <img
                        src="/assets/images/metnoos-offering-audio-comic.png"
                        alt=""
                        className=" w-full object-contain md:pr-12"
                    />
                </figure>
                <figure className="lg:w-[70%]">
                    <img
                        src="/assets/images/mentoons-offering-podcast.png"
                        alt=""
                        className=" w-full object-contain md:pr-12"
                    />
                </figure>
                <figure className="lg:w-[70%]">
                    <img
                        src="/assets/images/mentoons-offering-workshop.png"
                        alt=""
                        className=" w-full object-contain md:pr-12"
                    />
                </figure>
            </div>
            <div className="h-full relative" style={{ background: "linear-gradient(360deg, #FFD037 0%, #FFF1CA 100%)" }}>
                <img src="/assets/LandingPage/mask.png" alt="md-multiverse" className="absolute inset-0 w-full object-cover" />
                <div className="flex flex-col lg:flex-row items-center justify-around gap-8 p-4 lg:p-10">
                    <div className="relative w-full lg:w-[50%] lg:ml-32">
                        <figure className="w-[90%] lg:w-[40%] relative top-24 lg:top-20 lg:left-5 mx-auto lg:mx-0">
                            <img src="/assets/LandingPage/mentals.png" alt="md-multiverse" className="w-full object-contain" />
                        </figure>
                        <div className="w-full lg:w-[50%] relative bg-white rounded-lg p-4 z-20 mt-4 lg:mt-0">
                            <p className="text-black text-xl lg:text-2xl font-bold text-center lg:text-left">
                                Each mentor brings years of knowledge and hands-on experience, providing invaluable insights into industry trends and best practices.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-6 lg:gap-8 w-full lg:w-auto px-4 lg:px-0">
                        <h1 className="text-3xl lg:text-4xl font-bold text-center" style={{
                            background: 'transparent',
                            backgroundImage: 'radial-gradient(50% 50% at 50% 50%, #FCBB00 0%, #513D04 100%)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            WebkitTextFillColor: 'transparent'
                        }}>MEET OUR MENTORS</h1>
                        <p className="text-black text-lg lg:text-2xl text-center lg:text-left">Our mentors are the pillars of<br className="hidden lg:block"/> wisdom, experience, and support,<br className="hidden lg:block"/> dedicated to guiding us through our<br className="hidden lg:block"/> journey. They bring valuable<br className="hidden lg:block"/> insights, encouragement, and<br className="hidden lg:block"/> constructive feedback, ensuring we<br className="hidden lg:block"/> achieve our full potential.</p>
                        <button className="bg-[#FF6403] text-white font-bold text-lg lg:text-xl px-4 py-2 rounded-lg w-full lg:w-auto">
                            Watch our videos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MdMultiverse
