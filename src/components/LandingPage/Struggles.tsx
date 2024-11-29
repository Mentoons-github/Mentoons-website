import AddictionCards from "./AddictionCards";                              

const Struggles = () => {
    const AddictionCardsData =[
        {
            title: "Mobile Addiction",
            description:"Endlessly scrolling through social media feeds, new articles or videos.",
            image:"/assets/LandingPage/mob.png",
            background:"#FED651",
            gradient:"linear-gradient(168.78deg, rgba(217, 217, 217, 0.6) 11.69%, #A6830E 91.5%)",
            text:"#6F5500"
        },
        {
            title: "Social Media Addiction",
            description:"Constant scrolling and checking feeds can be exhausting.",
            image:"/assets/LandingPage/som.png",
            background:"#A3DF3C",
            gradient:"linear-gradient(168.78deg, rgba(217, 217, 217, 0.6) 11.69%, #6C981F 91.5%)",
            text:"#3E6102"
        },
        {
            title: "Excessive Gaming Addiction",
            description:"Hours spent in games can take away from real-word connections.",
            image:"/assets/LandingPage/game.png",
            background:"#83C4EE",
            gradient:"linear-gradient(168.78deg, rgba(217, 217, 217, 0.6) 11.69%, #4D85AA 91.5%)",
            text:"#07456C"
        },
        {
            title: "Difficulty in forming friendships",
            description:"Making and kepping friends isn’t always easy.",
            image:"/assets/LandingPage/frnd.png",
            background:"#FF6D72",
            gradient:"linear-gradient(168.78deg, rgba(220, 193, 193, 0.6) 11.69%, #C85357 91.5%)",
            text:"#5B0205"
        },
        {
            title: "Lack of Self-Awareness",
            description:"Not understanding oneself can lead to difficulties in personal and professional life.",
            image:"/assets/LandingPage/sa.png",
            background:"#AD73A5",
            gradient:"linear-gradient(168.78deg, rgba(183, 152, 178, 0.55) 11.69%, #563852 91.5%)",
            text:"#3E0035"
        },
        {
            title: "Life’s Transitions",
            description:"Navigating changes can be overwhelming.",
            image:"/assets/LandingPage/lt.png",
            background:"#FF9162",
            gradient:"linear-gradient(168.78deg, rgba(255, 183, 152, 0.32) 11.69%, #D67850 91.5%)",
            text:"#6B2100"
        }
    ]
    return (
        <div className="w-full min-h-screen bg-[#FFF2E7] p-4 sm:p-6 lg:p-10">
            <div className="w-full md:w-[80%] lg:w-[60%] mx-auto py-5 lg:py-10 flex flex-col lg:flex-row items-center lg:gap-6">
                <div className="w-full h-full space-y-2 mb-6">
                    <h2 className="text-xl lg:text-4xl font-thin">We know</h2>
                    <h1 className="text-3xl lg:text-6xl font-bold">THE STRUGGLES</h1>
                    <h2 className="text-xl lg:text-3xl font-light">Our Youth is facing</h2>
                    <p className="text-xs lg:text-sm font-light">
                        Mobile Addiction, Scrolling Addiction, Porn Addiction,<br className="hidden sm:block" />
                        Sex Addiction, Performance Addiction, Entertainment Addiction.
                    </p>
                </div>
                <div className="w-full h-full flex justify-center">
                    <video
                        src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/struggle-we-know.mp4"
                        className="rounded-xl w-full max-w-[600px]"
                        autoPlay
                        muted
                        loop
                        playsInline
                        webkit-playsinline
                    />
                </div>
            </div>
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
                {AddictionCardsData.map((card, index) => (
                    <AddictionCards key={index} {...card} />
                ))}
            </div>
        </div>
    )
}

export default Struggles
