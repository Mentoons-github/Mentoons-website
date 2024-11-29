export const letters = ['M', 'E', 'N', 'T', 'O', 'O', 'N', 'S'];
export const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'purple', 'purple'];
const ComicSection = () => {
    return (
        <div className="w-full relative z-10" style={{ background: "linear-gradient(177.47deg, #FAFDEE 93.25%, #8CB301 108.11%)" }}>
            <img
                src="/assets/LandingPage/clouds.png"
                alt="comic-bg"
                className="absolute top-0 left-0 w-full object-contain z-20"
            />
            <div className="flex justify-center items-center w-[80%] mx-auto">
                <figure className="max-w-fit relative left-[8%]">
                    <img src="/assets/LandingPage/comic-bnr.png" alt="comic" className="w-full h-full object-contain abolute" /> 
                    <div className="absolute bottom-[30%] top-1/2 left-[28%] transform -translate-x-1/2 flex flex-col items-center justify-center">
                        <h1 className="text-[0.63rem] lg:text-3xl whitespace-nowrap text-center">
                            COMIC BASED<br />
                            <div className="flex justify-center">
                                {letters.map((letter, index) => (
                                    <span key={index} className={`text-${colors[index]}-500 hover:scale-110 transition-transform`}>
                                        {letter}
                                    </span>
                                ))}
                            </div>
                        </h1>
                    </div>
                </figure>
                <figure className="w-[40rem]">
                    <img src="/assets/LandingPage/plane.png" alt="plane" className="w-full h-full object-contain" />
                </figure>
            </div>

            <img
                src="/assets/LandingPage/grass.png"
                alt="comic-bg"
                className="absolute bottom-0 left-0 w-full object-contain z-20"
            />
        </div>
    )
}

export default ComicSection
