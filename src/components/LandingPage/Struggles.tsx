import { motion } from "framer-motion";
import AddictionCards from "./AddictionCards";

const Struggles = () => {
    const AddictionCardsData = [
        {
            title: "Mobile Addiction",
            description: "Digital addiction is real, and it's spreading like wildfire!",
            image: "/assets/LandingPage/mob.png",
            background: "#FED651",
            gradient: "linear-gradient(168.78deg, rgba(217, 217, 217, 0.6) 11.69%, #A6830E 91.5%)",
            text: "#6F5500"
        },
        {
            title: "Social Media Addiction",
            description: "Prolonged screen exposure may cause vision issues, mental stress, and disrupted sleep patterns.",
            image: "/assets/LandingPage/som.png",
            background: "#A3DF3C",
            gradient: "linear-gradient(168.78deg, rgba(217, 217, 217, 0.6) 11.69%, #6C981F 91.5%)",
            text: "#3E6102"
        },
        {
            title: "Excessive Gaming Addiction",
            description: "Hours spent in games can take away from real-word connections.",
            image: "/assets/LandingPage/game.png",
            background: "#83C4EE",
            gradient: "linear-gradient(168.78deg, rgba(217, 217, 217, 0.6) 11.69%, #4D85AA 91.5%)",
            text: "#07456C"
        },
        {
            title: "Difficulty in forming friendships",
            description: "Making and keeping friends isn't always easy.",
            image: "/assets/LandingPage/frnd.png",
            background: "#FF6D72",
            gradient: "linear-gradient(168.78deg, rgba(220, 193, 193, 0.6) 11.69%, #C85357 91.5%)",
            text: "#5B0205"
        },
        {
            title: "Lack of Self-Awareness",
            description: "Not understanding oneself can lead to difficulties in personal and professional life.",
            image: "/assets/LandingPage/sa.png",
            background: "#AD73A5",
            gradient: "linear-gradient(168.78deg, rgba(183, 152, 178, 0.55) 11.69%, #563852 91.5%)",
            text: "#3E0035"
        },
        {
            title: "Life's Transitions",
            description: "Navigating changes can be overwhelming.",
            image: "/assets/LandingPage/lt.png",
            background: "#FF9162",
            gradient: "linear-gradient(168.78deg, rgba(255, 183, 152, 0.32) 11.69%, #D67850 91.5%)",
            text: "#6B2100"
        }
    ];

    return (
        <div className="w-full min-h-screen bg-[#FFF2E7] p-4 sm:p-6 lg:p-10">
            <motion.div
                className="w-full md:w-[80%] lg:w-[60%] mx-auto py-5 lg:py-10 flex flex-col lg:flex-row items-center lg:gap-6"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            >
                <div className="w-full h-full space-y-2 mb-6">
                    <motion.h2
                        className="text-xl lg:text-4xl font-thin"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        We know
                    </motion.h2>
                    <motion.h1
                        className="text-3xl lg:text-6xl font-bold whitespace-nowrap"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        THE STRUGGLES
                    </motion.h1>
                    <motion.h2
                        className="text-xl lg:text-3xl font-light"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                    >
                        Our Youth is facing
                    </motion.h2>
                    <motion.p
                        className="text-md lg:text-lg font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        We all delve into the dazzling world of digital entertainment,
                        Our hands crave for devices, eyes crave for screens, and our mind craves for continuous digital stimulation.
                    </motion.p>
                    <motion.p
                        className="text-xs lg:text-sm font-light"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.9, delay: 0.6 }}
                    >
                        #Mobile Addiction, #Scrolling Addiction, #Porn Addiction,<br className="hidden sm:block" />
                        #Sex Addiction, #Performance Addiction, #Entertainment Addiction.
                    </motion.p>
                </div>
                <motion.div
                    className="w-full h-full flex justify-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <video
                        src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/struggle-we-know.mp4"
                        className="rounded-xl w-full max-w-[600px]"
                        autoPlay
                        muted
                        loop
                        playsInline
                        webkit-playsinline
                    />
                </motion.div>
            </motion.div>
            <motion.hr
                className="w-[80%] h-1 mx-auto bg-black mb-5"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            <motion.h1
                className="text-lg text-center text-bold text-black mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
            >
                Our digital lives have started to take a toll on our mental<br /> and physical health, affecting our sleep, productivity, relationships and even self-esteem.
            </motion.h1>
            <motion.div
                className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.2
                        }
                    }
                }}
            >
                {AddictionCardsData.map((card, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <AddictionCards {...card} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default Struggles;
