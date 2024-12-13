import { WORKSHOP_FEATURES } from "@/constant"
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog"
import { useEffect, useState } from "react";
import TestimonialCard from "./TestimonialCard";

const WorkshopMain = () => {
    const teenPoints = [
        {
            img: "/assets/camps/teenpoints (1).png",
            text: "Interactive group discussions",
        },
        {
            img: "/assets/camps/teenpoints (2).png",
            text: "Interactive group discussions",
        },
        {
            img: "/assets/camps/teenpoints (3).png",
            text: "Interactive group discussions",
        },
        {
            img: "/assets/camps/teenpoints (4).png",
            text: "Interactive group discussions",
        },
        {
            img: "/assets/camps/teenpoints (5).png",
            text: "Interactive group discussions",
        }

    ]
    const testimonials = [
        {
            title: 'Mithran',
            img: "/assets/camps/img-tt.png",
            message: "As a teacher, I find Mentoons' resources invaluable. They perfectly complement my curriculum and keep students engaged"

        }
    ]
    const texts = [
        "Scrolling De-Addiction",
        "Hormonal Changes",
        "Substance De-Addiction"
    ];

    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTextIndex((prevIndex) =>
                prevIndex === texts.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);
    return (
        <div>
            <section className="min-h-screen w-full bg-gradient-to-br from-white to-gray-50 py-16 bg-[#FDF7EE]" >
                <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-[60%] space-y-8">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="w-1/2 h-1/2">
                                    <figure className="w-full h-full">
                                        <img
                                            src="/assets/camps/teen.png"
                                            alt="workshop title"
                                            className="h-full w-full object-contain"
                                        />
                                    </figure>
                                </div>
                                <div className="text-center md:text-left">
                                    <h1 className="text-4xl md:text-5xl font-bold">
                                        <span className="block text-2xl">Welcome to</span>
                                        <span className="block mt-2">MENTOONS</span>
                                        <span className="block text-4xl">Teen Camp</span>
                                    </h1>
                                    <p className="mt-4 text-gray-600 text-lg">
                                        Identity Workshop For Teenagers (13-19 Years)<br />
                                        <p className="text-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-bold">
                                            {texts[currentTextIndex]}
                                        </p>
                                    </p>

                                </div>
                            </div>

                            <p className="text-lg text-gray-700 leading-relaxed">
                                Help your teenager navigate the challenges of adolescence with our comprehensive Teen Camp workshop.<br />
                                Designed for young people aged 13-19, Teen Camp program addresses crucial topics that impact today's youth.</p>
                        </div>

                        <div className="lg:w-[40%]">
                            <figure className="transform hover:scale-105 transition-transform duration-300">
                                <img
                                    src="/assets/camps/w-img.png"
                                    alt="workshop img"
                                    className="h-full w-full object-contain"
                                />
                            </figure>
                        </div>
                    </div>
                </div>
            </section>
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
                            <div className="max-w-[500px] w-full">
                                <img
                                    src="/assets/images/career-corner-video-bg.png"
                                    alt="Career corner video"
                                    className="w-full h-auto object-contain mb-6"
                                />
                            </div>
                            <p className="text-center text-lg max-w-xl px-4">
                                Our workshops provides essential knowledge and skills for teenagers navigating
                                the complexities of adolescence. It offers a supportive space for young people
                                to learn, grow, and connect with others facing similar challenges.
                            </p>
                        </div>
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-center mt-20">What to expect from teen camp?</h1>
            </section>
            <section className="px-4 py-6 bg-[#4395DD]">
                <div className="flex gap-20 p-20 overflow-x-auto snap-x snap-mandatory scrollbar-hide items-center justify-around">
                    {teenPoints.map((point, index) => (
                        <div
                            key={index}
                            className="min-w-[10px] flex-none snap-center px-2"
                        >
                            <div className="flex flex-col items-center space-y-4">
                                <img
                                    src={point.img}
                                    alt={point.text}
                                    className="w-[70%] aspect-square object-cover rounded-lg"
                                />
                                <p className="text-center text-base text-white">
                                    {point.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="relative">
                    <figure className="h-12 w-12 absolute -top-14 left-[27%]">
                        <img src="/assets/camps/“.png" alt="teenpoints" className="w-full h-full object-cover" />
                    </figure>
                    <p className="text-xl text-center text-white">Say goodbye to uncontrolled screen time, liberate yourself from digital dependence and<br /> rediscover the joy of real-life experiences.</p>
                </div>

                <div className="mt-32">
                    <h1 className="text-4xl text-center text-white font-semibold">Testimonials</h1>
                    <div className="flex items-center justify-center p-20">
                    {
                        testimonials.map((testimonial, index) => (
                            <TestimonialCard testimonial={testimonial} key={index} />
                        ))
                    
                    }
                    </div>

                </div>
                <div className="bg-white w-[80%] mx-auto text-center p-4 rounded-lg shadow-lg"> 
                    <h1 className="mb-7 text-2xl">To register</h1>
                    <p className="mb-7 text-xl">Teen Camp today and help them build a strong foundation for their future.</p>
                    <button className="bg-[#FF8C1E] px-3 py-2 rounded-lg text-2xl font-semibold text-white">Click here</button>
                </div>
            </section>


        </div>
    )
}

export default WorkshopMain
