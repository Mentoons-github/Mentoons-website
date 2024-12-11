import { useNavigate } from "react-router-dom";


const WorkshopSection = () => {
    const navigate = useNavigate();
    const letters = ['M', 'E', 'N', 'T', 'O', 'R', 'I','N','G'];
    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'purple', 'purple','green'];
    return (
        <div className="w-full min-h-screen relative z-10" style={{ background: "linear-gradient(180deg, #A4CC13 12.08%, #FFEE67 100%)" }}>
            <img src="/assets/LandingPage/workshop-ass.png" alt="workshop assets" className="absolute top-0 left-0 w-full object-contain" />
            <div className="flex flex-col lg:flex-row justify-center items-center w-full px-4 md:px-6 lg:px-8 mx-auto py-8 lg:py-16">
                <div className="w-full md:w-3/4 lg:w-1/2 mx-auto mb-8 lg:mb-0">
                    <figure className="w-full max-w-[30rem] mx-auto relative">
                        <img src="/assets/LandingPage/note.png" alt="notebook" className="w-full h-auto object-contain" />
                        <img src="/assets/LandingPage/pin.png" alt="podcast" className="absolute top-[10%] left-1/2 transform -translate-x-1/2 w-6 md:w-8 lg:w-10 object-contain" />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <h1 className="text-[4vw] lg:text-3xl whitespace-nowrap text-left">
                                Making<br />
                                <div className="flex">
                                    {letters.map((letter, index) => (
                                        <span key={index} className={`text-${colors[index]}-500 hover:scale-110 transition-transform`}>
                                            {letter}
                                        </span>
                                    ))}
                                </div>
                                Accessible<br />
                                Engaging and<br />
                                Impactful for All
                            </h1>
                        </div>
                    </figure>
                </div>
                <div className="w-full md:w-3/4 lg:w-1/2">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 lg:mb-8">Workshop for all</h1>
                    <figure className="w-full max-w-[40rem] mx-auto relative z-40">
                        <img src="/assets/LandingPage/tv.png" alt="tv" className="w-full h-auto object-contain" />
                        <figure className="absolute top-[10%] left-[20%] w-[18%] md:w-[4.5rem] lg:w-[20%]">
                            <div className="relative">
                                <img
                                    src="/assets/LandingPage/6.png"
                                    alt="pin"
                                    className="w-full h-auto cursor-pointer"
                                    onClick={() => navigate("/mentoons-workshops?workshop=6-12")}
                                />
                                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-md font-bold lg:text-xl cursor-pointer">6-12</p>
                            </div>
                        </figure>
                        <figure className="absolute top-[10%] right-[20%] w-[18%] md:w-[4.5rem] lg:w-[20%]">
                            <div className="relative">
                                <img
                                    src="/assets/LandingPage/13.png"
                                    alt="pin"
                                    className="w-full h-auto cursor-pointer"
                                    onClick={() => navigate("/mentoons-workshops?workshop=13-19")}
                                />
                                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-md font-bold lg:text-xl cursor-pointer">13-19</p>
                            </div>
                        </figure>
                        <figure className="absolute bottom-[15%] left-[20%] w-[18%] md:w-[4.5rem] lg:w-[20%]">
                            <div className="relative">
                                <img
                                    src="/assets/LandingPage/20.png"
                                    alt="pin"
                                    className="w-full h-auto cursor-pointer"
                                    onClick={() => navigate("/mentoons-workshops?workshop=20+")}
                                />
                                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-md font-bold lg:text-xl cursor-pointer">20+</p>
                            </div>
                        </figure>
                        <figure className="absolute bottom-[15%] right-[20%] w-[18%] md:w-[4.5rem] lg:w-[20%]">
                            <div className="relative">
                                <img
                                    src="/assets/LandingPage/parents.png"
                                    alt="pin"
                                    className="w-full h-auto cursor-pointer"
                                    onClick={() => navigate("/mentoons-workshops?workshop=parents")}
                                />
                                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-md font-bold lg:text-xl cursor-pointer">Parents</p>
                            </div>
                        </figure>
                    </figure>
                </div>
            </div>
            <img src="/assets/LandingPage/abc7.png" alt="clouds" className="absolute -bottom-4 left-0 w-full h-auto object-bottom" />
            <img src="/assets/LandingPage/men-art.png" alt="men art" className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[10rem] md:w-[14rem] lg:w-[18rem] h-auto object-bottom z-20 hidden lg:block" />
            <h1 className="absolute bottom-0 left-[25%] text-[#864403] font-semibold text-lg md:text-4xl lg:text-3xl z-20 hidden lg:block">Listen to us<br />Daily</h1>
        </div>
    )
}

export default WorkshopSection
