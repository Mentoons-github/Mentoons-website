import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const HeroSection = () => {
    // Define animation variants
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1 } },
    };

    const slideInLeft = {
        hidden: { x: '-100%', opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 1 } },
    };


    const bounce = {
        hidden: { y: 0 },
        visible: {
            y: [0, -20, 0],
            transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
        },
    };

    const float = {
        hidden: { y: 0 },
        visible: {
            y: [0, -10, 0],
            transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
        },
    };
    const words = ["teenagers", "parents", "everyday tech-users"];
    const [currentWord, setCurrentWord] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prevWord) => (prevWord + 1) % words.length);
        }, 2000); // Change word every 2 seconds
        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []); 
    return (
        <div className="w-full h-[85vh] lg:h-[97vh] relative overflow-hidden">
            {/* Background image */}
            <motion.img
                src="/assets/LandingPage/hero-bg-top.png"
                alt="hero-bg"
                className="absolute w-full object-top"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
            />

            {/* Logo Section */}
            <motion.div
                className="flex flex-col md:flex-row lg:flex-row items-center justify-between w-full py-[5vh] px-[5vw] relative z-10 lg:pt-[2vh]"
                variants={slideInLeft}
                initial="hidden"
                animate="visible"
            >
                <figure className="w-[70vw] sm:w-[50vw] md:w-[35vw] lg:w-[25vw]">
                    <img src="/assets/LandingPage/logo.png" alt="logo" className="w-full h-full object-contain" />
                </figure>
                <figure className="relative w-[90vw] sm:w-[70vw] md:w-[40vw] lg:w-[30vw]">
                    <motion.h1
                        className="text-[7vw] sm:text-[4vw] md:text-[3vw] lg:text-[2vw] font-bold text-center"
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                    >
                        Transforming Lives Through
                    </motion.h1>
                    <motion.h1
                        className="absolute top-[26%] left-1/2 -translate-x-1/2 text-[7vw] sm:text-[4vw] md:text-[3vw] lg:text-[2vw] text-white font-bold whitespace-nowrap"
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.3 }}
                    >
                        MENTORING AND
                    </motion.h1>
                    <motion.h1
                        className="absolute bottom-[19%] left-[50%] text-[7vw] sm:text-[4vw] md:text-[3vw] lg:text-[2vw] text-white font-bold"
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.6 }}
                    >
                        CARTOONS
                    </motion.h1>
                    <img src="/assets/LandingPage/mentoring.png" alt="hero-text" className="w-full h-full object-contain" />
                </figure>
            </motion.div>

            {/* Psyco Image */}
            <figure
                className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-5 md:left-8 lg:left-10 w-[45vw] md:w-[35vw] lg:w-[20vw] z-10 lg:z-auto"
            >
                <img src="/assets/LandingPage/psyco.png" alt="psyco" className="w-full h-full object-contain" />
            </figure>

            {/* Attention-grabbing Text */}
            <motion.h1
                className="absolute top-[50%] lg:top-[35%] right-[15%] text-[1rem] lg:text-[1.8rem] text-black font-bold text-left tracking-wide z-20 w-[40%] lg:w-[20%]"
                variants={bounce}
                initial="hidden"
                animate="visible"
            >
                <span className="text-black">Hello</span><br/>
                <AnimatePresence mode="wait">
                    <motion.span
                        key={currentWord}
                        className="text-purple-500"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                    >
                        {words[currentWord]}
                    </motion.span>
                </AnimatePresence>
            </motion.h1>

            {/* Hero Illustration */}
            <motion.figure
                className="w-[70vw] sm:w-[60vw] md:w-[40vw] lg:w-[25vw] absolute bottom-[2vh] lg:bottom-[18vh] left-1/2 -translate-x-1/2 z-10 lg:z-auto"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1 }}
            >
                <img src="/assets/LandingPage/hero.png" alt="hero-text" className="w-full h-full object-contain" />
            </motion.figure>

            {/* Bottom Background */}
            <motion.figure
                className="absolute bottom-0 left-0 w-full"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.5 }}
            >
                <img src="/assets/LandingPage/bg-bot.png" alt="hero-bg" className="w-full h-full object-cover" />
            </motion.figure>

            {/* Decorative Elements */}
            <motion.div
                className="absolute top-[20vh] right-[20vw]"
                variants={float}
                initial="hidden"
                animate="visible"
            >
                <div className="w-[2vw] h-[2vw] rounded-full bg-purple-500/30"></div>
            </motion.div>
            <motion.h1
            className="absolute bottom-[1vh] lg:bottom-[5vh] left-1/2 -translate-x-1/2 text-[2vw] md:text-[1.5vw] lg:text-[2vw] text-white font-semibold text-center animate-in ease-in ">
            Dive into a fun and engaging journey to<br/> expand your knowledge</motion.h1>
            <motion.div
                className="absolute bottom-[40vh] left-[20vw]"
                variants={float}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5 }}
            >
                <div className="w-[3vw] h-[3vw] rotate-45 bg-blue-400/20"></div>
            </motion.div>
        </div>
    );
};

export default HeroSection;
