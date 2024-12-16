import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import TestimonialCard from "./TestimonialCard";
import { WORKSHOP_FEATURES } from "@/constant";

type Category = 'Buddy Camp' | 'Teen Camp' | 'Family Camp' | 'Career Corner';

interface CategoryContent {
    title: string;
    subTitle: string;
    description: string;
    mainImage: string;
    heroImage: string;
    video: string;
    texts: string[];
    points: Array<{
        img: string;
        text: string;
    }>;
    testimonials: Array<{
        title: string;
        img: string;
        message: string;
    }>;
}

const CATEGORY_CONTENT: Record<Category, CategoryContent> = {
    'Buddy Camp': {
        title: 'MENTOONS Kids Camp',
        subTitle: 'Fun Learning Workshop For Kids (7-12 Years)',
        description: 'Nurture your child\'s creativity and learning with our engaging Kids Camp workshop.',
        mainImage: '/assets/camps/Buddy.png',
        heroImage: '/assets/camps/bdy-img.png',
        video: "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+6+-+12/Children+Common+Issues.mp4",
        texts: [
            "Creative Learning",
            "Social Skills",
            "Digital Literacy"
        ],
        points: [
            { img: "/assets/camps/teenpoints (1).png", text: "Interactive group discussions" },
            { img: "/assets/camps/teenpoints (2).png", text: "Peer learning activities" },
            { img: "/assets/camps/teenpoints (3).png", text: "Practical workshops" },
            { img: "/assets/camps/teenpoints (4).png", text: "Expert guidance" },
            { img: "/assets/camps/teenpoints (5).png", text: "Personal development" }
        ],
        testimonials: [
            {
                title: 'Mithran',
                img: "/assets/camps/img-tt.png",
                message: "As a teacher, I find Mentoons' resources invaluable."
            },
            {
                title: 'Sarah',
                img: "/assets/camps/img-tt.png",
                message: "The workshop helped my child develop better social skills and confidence."
            },
            {
                title: 'Raj',
                img: "/assets/camps/img-tt.png",
                message: "An excellent program that addresses modern challenges faced by teenagers."
            },
            {
                title: 'Priya',
                img: "/assets/camps/img-tt.png",
                message: "The interactive sessions and expert guidance made a real difference."
            }
        ]

    },
    'Teen Camp': {
        title: 'MENTOONS Teen Camp',
        subTitle: 'Identity Workshop For Teenagers (13-19 Years)',
        description: 'Help your teenager navigate the challenges of adolescence with our comprehensive Teen Camp workshop.',
        mainImage: '/assets/camps/Teen.png',
        heroImage: '/assets/camps/w-img.png',
        video: "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/Teen+Camp+Common+Issues.mp4",
        texts: [
            "Scrolling De-Addiction",
            "Hormonal Changes",
            "Substance De-Addiction"
        ],
        points: [
            { img: "/assets/camps/teenpoints (1).png", text: "Interactive group discussions" },
            { img: "/assets/camps/teenpoints (2).png", text: "Peer learning activities" },
            { img: "/assets/camps/teenpoints (3).png", text: "Practical workshops" },
            { img: "/assets/camps/teenpoints (4).png", text: "Expert guidance" },
            { img: "/assets/camps/teenpoints (5).png", text: "Personal development" }
        ],
        testimonials: [
            {
                title: 'Mithran',
                img: "/assets/camps/img-tt.png",
                message: "As a teacher, I find Mentoons' resources invaluable."
            },
            {
                title: 'Sarah',
                img: "/assets/camps/img-tt.png",
                message: "The workshop helped my child develop better social skills and confidence."
            },
            {
                title: 'Raj',
                img: "/assets/camps/img-tt.png",
                message: "An excellent program that addresses modern challenges faced by teenagers."
            },
            {
                title: 'Priya',
                img: "/assets/camps/img-tt.png",
                message: "The interactive sessions and expert guidance made a real difference."
            }
        ]

    },
    'Family Camp': {
        title: 'Family Camp',
        subTitle: 'Guiding Parents in Modern Parenting',
        description: 'Empower yourself with effective parenting strategies for the digital age.',
        mainImage: '/assets/camps/Family.png',
        heroImage: '/assets/images/family-camp-hero.png',
        video: "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+20%2B/Challenges+Parents+Face+Today.mp4",
        texts: [
            "Digital Parenting",
            "Communication Skills",
            "Child Development"
        ],
        points: [
            { img: "/assets/camps/teenpoints (1).png", text: "Interactive group discussions" },
            { img: "/assets/camps/teenpoints (2).png", text: "Peer learning activities" },
            { img: "/assets/camps/teenpoints (3).png", text: "Practical workshops" },
            { img: "/assets/camps/teenpoints (4).png", text: "Expert guidance" },
            { img: "/assets/camps/teenpoints (5).png", text: "Personal development" }
        ],
        testimonials: [
            {
                title: 'Mithran',
                img: "/assets/camps/img-tt.png",
                message: "As a teacher, I find Mentoons' resources invaluable."
            },
            {
                title: 'Sarah',
                img: "/assets/camps/img-tt.png",
                message: "The workshop helped my child develop better social skills and confidence."
            },
            {
                title: 'Raj',
                img: "/assets/camps/img-tt.png",
                message: "An excellent program that addresses modern challenges faced by teenagers."
            },
            {
                title: 'Priya',
                img: "/assets/camps/img-tt.png",
                message: "The interactive sessions and expert guidance made a real difference."
            }
        ]

    },
    'Career Corner': {
        title: 'Career Corner',
        subTitle: 'Career Guidance for Students',
        description: 'Expert guidance to help students explore and plan their career paths.',
        mainImage: '/assets/camps/Group 540.png',
        heroImage: '/assets/images/career-corner-hero-image.png',
        video: "",
        texts: [
            "Career Exploration",
            "Skill Assessment",
            "Industry Insights"
        ],
        points: [
            { img: "/assets/camps/teenpoints (1).png", text: "Interactive group discussions" },
            { img: "/assets/camps/teenpoints (2).png", text: "Peer learning activities" },
            { img: "/assets/camps/teenpoints (3).png", text: "Practical workshops" },
            { img: "/assets/camps/teenpoints (4).png", text: "Expert guidance" },
            { img: "/assets/camps/teenpoints (5).png", text: "Personal development" }
        ],
        testimonials: [
            {
                title: 'Mithran',
                img: "/assets/camps/img-tt.png",
                message: "As a teacher, I find Mentoons' resources invaluable."
            },
            {
                title: 'Sarah',
                img: "/assets/camps/img-tt.png",
                message: "The workshop helped my child develop better social skills and confidence."
            },
            {
                title: 'Raj',
                img: "/assets/camps/img-tt.png",
                message: "An excellent program that addresses modern challenges faced by teenagers."
            },
            {
                title: 'Priya',
                img: "/assets/camps/img-tt.png",
                message: "The interactive sessions and expert guidance made a real difference."
            }
        ]

    }
};

const WorkshopMain = () => {
    const [selectedCategory, setSelectedCategory] = useState<Category>('Teen Camp');
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

    const handleNextTestimonial = () => {
        setCurrentTestimonialIndex((prev) =>
            prev === content.testimonials.length - 1 ? 0 : prev + 1
        );
    };

    const handlePrevTestimonial = () => {
        setCurrentTestimonialIndex((prev) =>
            prev === 0 ? content.testimonials.length - 1 : prev - 1
        );
    };

    const content = CATEGORY_CONTENT[selectedCategory];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTextIndex((prevIndex) =>
                prevIndex === content.texts.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [selectedCategory, content.texts.length]);

    return (
        <div className="overflow-x-hidden">
            {/* Category Selector */}
            <div className="bg-[#FDF7EE] pb-7 pt-12 relative">
                {/* Career Corner Image */}
                <div className="absolute -right-4 lg:g:right-2 top-1/2 -translate-y-1/2 cursor-pointer z-10" onClick={() => setSelectedCategory("Career Corner")}>
                    <img
                        src="/assets/images/career-corner.png"
                        alt="Career Corner"
                        className="w-24 h-20 lg:w-full lg:h-44 hover:scale-105 transition-duration-300"
                    />
                </div>

                {/* All Categories Including Career Corner */}
                <div className="w-[95%] lg:w-[90%] mx-auto flex lg:justify-center gap-4 lg:gap-24 flex-nowrap">
                    {(Object.keys(CATEGORY_CONTENT) as Category[]).filter(category => category !== 'Career Corner').map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-1 lg:px-4 
                py-1 lg:py-4 
                text-sm lg:text-lg
                rounded-lg transition-all duration-300 
                [clip-path:polygon(0%_20.3%,100%_0.3%,100%_100%,0%_84.5%)]
                shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)]
                hover:shadow-[0_6px_8px_-1px_rgba(0,0,0,0.3)]
                ${selectedCategory === category
                                    ? 'bg-[#765EED] text-white'
                                    : 'bg-[#CEC4FF] hover:bg-[#4395DD]'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
            {/* Hero Section */}
            <section className="h-full w-full py-16 bg-[#FDF7EE]">
                <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-[60%] space-y-8">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="w-1/2 h-1/2">
                                    <figure className="w-full h-full">
                                        <img
                                            src={content.mainImage}
                                            alt="workshop title"
                                            className="h-full w-full object-contain"
                                        />
                                    </figure>
                                </div>
                                <div className="text-center md:text-left">
                                    <h1 className="text-4xl md:text-5xl font-bold">
                                        <span className="block text-2xl">Welcome to</span>
                                        <span className="block mt-2">{content.title}</span>
                                    </h1>
                                    <p className="mt-4 text-gray-600 text-lg">
                                        {content.subTitle}<br />
                                        <p className="text-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-bold">
                                            {content.texts[currentTextIndex]}
                                        </p>
                                    </p>
                                </div>
                            </div>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                {content.description}
                            </p>
                        </div>

                        <div className="lg:w-[40%]">
                            <figure className="transform hover:scale-105 transition-transform duration-300">
                                <img
                                    src={content.heroImage}
                                    alt="workshop img"
                                    className="h-full w-full object-contain"
                                />
                            </figure>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-[url(/assets/camps/cc.png)] w-full min-h-screen pt-32 bg-no-repeat bg-cover lg:bg-repeat">
                <div className="w-full flex flex-wrap lg:flex-nowrap gap-8 px-4 md:px-8">
                    {/* Left Column */}
                    <div className="w-full lg:w-1/2">
                        <div className="p-6 md:p-12">
                            <img
                                src="/assets/images/career-corner-section-headline.png"
                                alt=""
                                className="w-full max-w-[400px] mx-auto object-contain"
                            />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6">
                            {WORKSHOP_FEATURES.map((feature) => (
                                <div key={feature.id} className="max-w-[200px] mx-auto">
                                    <Dialog>
                                        <div className="relative">
                                            <DialogTrigger asChild>
                                                <img
                                                    src={feature.imageUrl}
                                                    alt="portfolio management"
                                                    className="w-full h-auto object-cover hover:scale-105 transition-all duration-300"
                                                />
                                            </DialogTrigger>
                                            <div className="absolute top-2 left-2">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4"
                                                />
                                            </div>
                                        </div>
                                        <DialogContent className="bg-white flex flex-col items-center justify-center border-none w-[95%] md:w-[60%] lg:w-[30%] p-0 rounded-[20px]">
                                            {/* Dialog content */}
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="w-full lg:w-1/2">
                        <div className="flex flex-col items-center justify-center p-6 md:p-12">
                            <div className="max-w-[500px] w-full relative">
                                <img
                                    src="/assets/camps/video-bg (2).png"
                                    alt="Career corner video"
                                    className="w-full h-auto object-contain mb-6"
                                />
                                <div>
                                    <video
                                        playsInline
                                        webkit-playsinline
                                        src={content.video}
                                        className=" w-[60%] h-[60%] absolute top-[10%] left-[18%] rounded-lg shadow-lg"
                                        autoPlay
                                        controls
                                        muted
                                    ></video>
                                </div>
                            </div>
                            <p className="text-center text-lg max-w-xl px-4 text-white">
                                Our workshops provides essential knowledge and skills for teenagers navigating
                                the complexities of adolescence. It offers a supportive space for young people
                                to learn, grow, and connect with others facing similar challenges.
                            </p>
                        </div>
                    </div>
                </div>
                <h1 className="text-4xl text-white md:text-5xl font-bold text-center mt-20">What to expect from teen camp?</h1>
            </section>

            {/* Points Section */}
            <section className="px-4 py-6 bg-[#4395DD]">
                <div className="flex gap-20 p-20 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                    {content.points.map((point, index) => (
                        <div
                            key={index}
                            className="min-w-[250px] flex-none snap-center px-2 transform hover:scale-105 transition-all duration-300"
                        >
                            <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 flex flex-col items-center space-y-4">
                                <img
                                    src={point.img}
                                    alt={point.text}
                                    className="w-[70%] aspect-square object-cover rounded-lg shadow-xl"
                                />
                                <p className="text-center text-lg text-white font-medium">
                                    {point.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Testimonials Section */}
                <div className="mt-10 md:mt-20 mb-6 md:mb-10">
                    <h1 className="text-3xl md:text-4xl text-center text-white font-semibold mb-8 md:mb-12 px-4">
                        What People Say About Us
                    </h1>
                    <div className="relative w-full max-w-4xl mx-auto px-2 md:px-4">
                        {/* Testimonials Slider */}
                        <div className="overflow-hidden">
                            <div className="flex transition-transform duration-500 ease-in-out"
                                style={{
                                    transform: `translateX(-${currentTestimonialIndex * 100}%)`,
                                }}>
                                {content.testimonials.map((testimonial, index) => (
                                    <div key={index} className="w-full flex-shrink-0 px-2 md:px-4">
                                        <TestimonialCard testimonial={testimonial} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Dots */}
                        <div className="flex justify-center gap-1.5 md:gap-2 mt-4 md:mt-6">
                            {content.testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentTestimonialIndex(index)}
                                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 
                        ${currentTestimonialIndex === index
                                            ? 'bg-white scale-125'
                                            : 'bg-white/50 hover:bg-white/70'}`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={handlePrevTestimonial}
                            className="absolute -left-2 md:left-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-1.5 md:p-2 rounded-full backdrop-blur-sm transition-all duration-300"
                            aria-label="Previous testimonial"
                        >
                            <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={handleNextTestimonial}
                            className="absolute -right-2 md:right-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-1.5 md:p-2 rounded-full backdrop-blur-sm transition-all duration-300"
                            aria-label="Next testimonial"
                        >
                            <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>



                {/* Registration Section */}
                <div className="backdrop-blur-md bg-white/90 w-[80%] mx-auto text-center p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <h1 className="mb-4 text-3xl font-bold bg-gradient-to-r from-[#765EED] to-[#4395DD] bg-clip-text text-transparent">
                        Register Now
                    </h1>
                    <p className="mb-6 text-xl text-gray-700">Join {selectedCategory} today!</p>
                    <button className="bg-gradient-to-r from-[#FF8C1E] to-[#FF6B1E] px-6 py-3 rounded-xl text-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300">
                        Get Started
                    </button>
                </div>
            </section>
        </div>
    );
};

export default WorkshopMain;
