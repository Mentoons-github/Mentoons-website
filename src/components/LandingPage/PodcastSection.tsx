import { useState } from "react";
import { FaPlay } from "react-icons/fa";


export const PODCAST_DATA = [
    {
        title: "Where It All Began?",
        description: "",
        videoSrc:
            "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/where-it-all-begin.mp4",
        category: "6-12"
    },
    {
        title: "Parents Want To Buy Peace",
        description: "",
        videoSrc:
            "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/parent-want-to-buy-peace.mp4",
        category: "6-12"
    },
    {
        title: "How To Use Gadgets Effectively",
        description: "",
        videoSrc:
            "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/how-to-use-gadgets.mp4",
        category: "6-12"
    },
    {
        title: "How to build Confidence",
        description: "",
        videoSrc:
            "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+6+-+12/Build+Confidence.mp4",
        category: "6-12"
    },
    {
        title: "Performance Addiction",
        description: "",
        videoSrc:
            "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+6+-+12/Performance+Addiction+6-12.mp4",
        category: "6-12"
    },
    {
        title: "Entertainment Addiction",
        description: "",
        videoSrc:
            "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+6+-+12/Copy+of+ENTERTAINMENT_ADDICTION_01.mp4",
        category: "6-12"
    },
    {
        title: "A Day With and Without a Phone",
        description: "",
        videoSrc:
            "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+6+-+12/A+Day+Without+Phone+June+12.mp4",
        category: "6-12"
    },

    // 13-19
    {
        title:
            "Statistic of (Teenage suicide rate Teen pregnancy Gaming Addiction Social media addiction)",
        description: "",
        videoSrc: "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/teenage-statistics.mp4",
        category: "13-19"
    },
    {
        title: "How AI Impacts Our Learning and Focus",
        description: "",
        videoSrc: "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/how-ai-impact-our-learning.mp4",
        category: "13-19"
    },
    {
        title: "Performance Addiction",
        description: "",
        videoSrc: "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/Performance+Addiction+13-19.mp4",
        category: "13-19"
    },
    {
        title: "Entertainment Addiction",
        description: "",
        videoSrc: "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/Entertainment+Addiction+01.mp4",
        category: "13-19"
    },
    // 20+ & Parent's
    {
        title: "Why work from home is preferred",
        description: "",
        videoSrc: "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/work-from-home.mp4",
        category: "20+ & Parent's"
    },
    {
        title: "Pornography De-Addiction",
        description: "",
        videoSrc: "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/pornography-de-addiction.mp4",
        category: "20+ & Parent's"
    },
];

interface Podcast {
    title: string;
    description: string;
    videoSrc: string;
    category: string;
}

const PodcastSection = () => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>("6-12");
    const filteredPodcasts = PODCAST_DATA.filter((podcast) => podcast.category === selectedCategory)
    const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(filteredPodcasts[0])
    const PodcastCategories = ["6-12", "13-19", "20+ & Parent's"]
    return (
        <div className="w-full min-h-screen relative pb-10" style={{
            background: "linear-gradient(161.68deg, #F3343B 49.1%, #FF9599 80.21%)"
        }}>
            <img
                src="/assets/LandingPage/abc1.png"
                alt="clouds"
                className="absolute -top-1 left-0 w-full object-cover"
            />
            <div className="w-full flex flex-col lg:flex-row justify-center items-center pt-20">
                <div className="w-full lg:w-1/2 px-4 lg:px-0 mb-8 lg:mb-0">
                    <h1 className="text-white text-center text-lg md:text-4xl lg:text-3xl">Children's podcasts are audio shows that<br /> entertain and educate young listeners through<br /> stories and fun learning. They spark<br /> imagination and curiosity.</h1>
                </div>
                <div className="w-full lg:w-1/2 flex justify-center relative">
                    <img src="/assets/LandingPage/podcast img.png" alt="toonla" className="w-[60%] h-auto object-contain relative z-10" />
                    <img src="/assets/LandingPage/headphone.png" alt="clouds" className="absolute bottom-0 left-[25%] w-[8rem] md:w-[12rem] lg:w-[16rem] h-auto object-bottom z-[20]" />
                    <h1 className="absolute top-[60%] left-[50%] text-white text-lg md:text-4xl lg:text-3xl z-20" style={{
                        WebkitTextStroke: "1px white",
                        WebkitTextFillColor: "transparent",
                        textShadow: "0 0 10px #F2D705"
                    }}>Podcasts</h1>
                    <p className="absolute top-[70%] left-[50%] text-black font-semibold text-sm md:text-xl z-20">narrated by<br />
                        psycologist
                    </p>
                </div>
            </div>
            <div className="w-full flex flex-col lg:flex-row justify-center items-center px-4 lg:px-0">
                <div className="w-full lg:w-1/2">
                    <div className="relative lg:w-[80%]">
                        <img src="/assets/images/mentoons-tv.png" alt="TV Frame" className="w-full" />
                        <video
                            src={selectedPodcast?.videoSrc}
                            className="w-[55%] absolute top-[33%] left-[22%]"
                            autoPlay
                            controls
                            muted
                            playsInline
                        />
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex justify-center items-center gap-4 mb-10 px-6">
                        {
                            PodcastCategories.map((category) => (
                                <div key={category}>
                                    <button
                                        className={`px-6 py-3 rounded-full transition-colors whitespace-nowrap duration-200 text-sm lg:text-base ${selectedCategory === category
                                                ? "bg-white text-red-500"
                                                : "bg-transparent text-white border border-red-500 hover:bg-red-500 hover:text-white"
                                            }`}
                                        onClick={() => setSelectedCategory(category)}
                                    >
                                        {category}
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                    <div className="lg:w-[60%] mx-auto flex flex-col gap-4 items-left h-[400px] overflow-y-auto 
                        [&::-webkit-scrollbar]:w-2 
                        [&::-webkit-scrollbar-track]:bg-white/10 
                        [&::-webkit-scrollbar-thumb]:bg-white/40
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        hover:[&::-webkit-scrollbar-thumb]:bg-white/60">
                        {filteredPodcasts.map((podcast) => (
                            <div
                                key={podcast.title}
                                className={`flex items-center gap-4 cursor-pointer p-2 rounded-md w-full ${selectedPodcast?.title === podcast.title
                                        ? "bg-white/20"
                                        : "hover:bg-white/10"
                                    }`}
                                onClick={() => setSelectedPodcast(podcast)}
                            >
                                <div className="min-w-10 h-10 flex justify-center items-center rounded-full bg-white">
                                    <FaPlay className="text-red-500" />
                                </div>
                                <h1 className={`transition-colors duration-200 truncate ${selectedPodcast?.title === podcast.title
                                        ? "text-white font-semibold"
                                        : "text-white/80 hover:text-white"
                                    }`}>{podcast.title}</h1>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PodcastSection
