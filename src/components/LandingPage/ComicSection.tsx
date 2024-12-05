import React from 'react';
import { motion } from 'framer-motion';

export const letters = ['M', 'E', 'N', 'T', 'O', 'O', 'N', 'S'];
export const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'purple', 'purple'];

const ComicSection = () => {
    return (
        <div className="w-full relative z-10" style={{ background: "linear-gradient(177.47deg, #FAFDEE 93.25%, #8CB301 108.11%)" }}>
            <motion.img
                src="/assets/LandingPage/clouds.png"
                alt="comic-bg"
                className="absolute top-0 left-0 w-full object-contain z-20"
                style={{ opacity: 0.5 }}
                initial={{ x: -100, opacity: 0.3 }}
                animate={{
                    x: [0, 50, -50, 0],
                    opacity: 0.5
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
            <motion.div
                className="flex justify-center items-center w-[80%] mx-auto"
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ 
                    x: 0, 
                    opacity: 1,
                    transition: {
                        type: "tween",
                        duration: 3,
                        ease: "easeInOut"
                    }
                }}
            >
                <figure className="max-w-fit relative left-[8%]">
                    <img src="/assets/LandingPage/comic-bnr.png" alt="comic" className="w-full h-full object-contain abolute" />
                    <div className="absolute bottom-[30%] top-1/2 left-[28%] transform -translate-x-1/2 flex flex-col items-center justify-center">
                        <h1 className="text-[0.63rem] lg:text-3xl whitespace-nowrap text-center">
                            COMIC BASED<br />
                            <div className="flex justify-center">
                                {letters.map((letter, index) => (
                                    <motion.span
                                        key={index}
                                        className={`text-${colors[index]}-500 hover:scale-110 transition-transform`}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </div>
                        </h1>
                    </div>
                </figure>
                <figure className="w-[40rem]">
                    <img src="/assets/LandingPage/plane.png" alt="plane" className="w-full h-full object-contain" />
                </figure>
            </motion.div>
            <img
                src="/assets/LandingPage/grass.png"
                alt="comic-bg"
                className="absolute bottom-0 left-0 w-full object-contain z-20"
            />
        </div>
    )
}

export default ComicSection;