import FilterComics from "@/components/comics/FilterComics";
import { motion } from "framer-motion"; // Add framer-motion for animations
import { useNavigate } from "react-router-dom";


const AssesmentPage: React.FC = () => {
    const assesmentData = [
        {
            id: 1,
            name: "The Career Development Assesment",
            desc: "Valuable insights into maintaining professional behavior and building career success.",
            thumbnail: "/assets/assesments/career.png",
            credits: "Bulbul",
        },
        {
            id: 2,
            name: "Personality type assesment",
            desc: "Uncover your strengths, traits, and behaviors to better understand yourself.",
            thumbnail: "/assets/assesments/personality.png",
            credits: "Bulbul",
        },
        {
            id: 3,
            name: "Social-Emotional Learning",
            desc: "Evaluate your emotional intelligence and social skills for better relationships and interactions.",
            thumbnail: "/assets/assesments/social.png",
            credits: "Bulbul",
        },  
        {
            id: 1,
            name: "The Career Development Assesment",
            desc: "Valuable insights into maintaining professional behavior and building career success.",
            thumbnail: "/assets/assesments/career.png",
            credits: "Bulbul",
        },
        {
            id: 2,
            name: "Personality type assesment",
            desc: "Uncover your strengths, traits, and behaviors to better understand yourself.",
            thumbnail: "/assets/assesments/personality.png",
            credits: "Bulbul",
        },
        {
            id: 3,
            name: "Social-Emotional Learning",
            desc: "Evaluate your emotional intelligence and social skills for better relationships and interactions.",
            thumbnail: "/assets/assesments/social.png",
            credits: "Bulbul",
        },
        {
            id: 1,
            name: "The Career Development Assesment",
            desc: "Valuable insights into maintaining professional behavior and building career success.",
            thumbnail: "/assets/assesments/career.png",
            credits: "Bulbul",
        },
        {
            id: 2,
            name: "Personality type assesment",
            desc: "Uncover your strengths, traits, and behaviors to better understand yourself.",
            thumbnail: "/assets/assesments/personality.png",
            credits: "Bulbul",
        },
        {
            id: 3,
            name: "Social-Emotional Learning",
            desc: "Evaluate your emotional intelligence and social skills for better relationships and interactions.",
            thumbnail: "/assets/assesments/social.png",
            credits: "Bulbul",
        }, 

    ];
const navigate = useNavigate();


    return (
        <motion.div 
            className="py-8 px-4 md:py-16 md:px-5 lg:py-20 space-y-6 md:space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="space-y-5 md:space-y-7">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <motion.div 
                        className="text-2xl md:text-3xl text-red-500 lineBefore uppercase"
                        initial={{ x: -20 }}
                        animate={{ x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        ASSESSMENTS
                    </motion.div>
                    <div className="hidden lg:block">
                        <FilterComics />
                    </div>
                </div>

                <motion.div 
                    className="font-medium space-y-4 md:space-y-8"
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h1 className="font-extrabold text-xl md:text-2xl lg:text-6xl">
                        Empower yourself with the{" "}
                        <span className="text-primary md:block md:tracking-widest">
                            knowledge to become
                        </span>{" "}
                        the best version of yourself
                    </h1>
                    <p className="text-base md:text-lg lg:text-xl">
                        Discover your true potential with our psychologist-developed assessments. Designed to provide actionable insights, these assessments are your first step towards personal and professional growth.
                    </p>
                </motion.div>
            </div>

            <div>
                {assesmentData.length > 0 && (
                    <>
                        <div className="w-full text-center block lg:hidden mb-6">
                            <FilterComics />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12">
                            {assesmentData?.map((item, index) => (
                                <motion.div
                                key={index}
                                className="bg-white shadow-lg group text-black rounded-2xl p-4 md:p-5 space-y-3 w-full max-w-md mx-auto" // Added max-width and center alignment
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="overflow-hidden rounded-2xl">
                                   <figure className="w-full h-[23rem] lg:h-[16rem] rounded-2xl group-hover:scale-105 transition-all ease-in-out duration-300 cursor-pointer">
                                    <img src={item.thumbnail} alt={item.name}  className="h-full w-full object-contain"/>
                                   </figure>
                                </div>
                                    <div className="space-y-2">
                                        <div className="text-lg md:text-xl font-semibold tracking-wide">
                                            {item?.name}
                                        </div>
                                        <div className="text-black text-sm tracking-wide">
                                            {item?.desc}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            className="text-end flex items-center justify-end gap-2 group-hover:text-red-500 group-hover:underline text-base md:text-xl cursor-pointer"
                                        >
                                            Take Sample Test
                                        </motion.div>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="border-2 cursor-pointer bg-primary border-primary px-5 py-1 rounded-full text-white font-semibold text-sm md:text-base"
                                        onClick={() => navigate(`/assesment-questions`)}
                                        >
                                            TEST NOW
                                        </motion.div>
                                    </div>
                                    <div className="text-xs md:text-sm text-rose-500">
                                        Credit: {item.credits}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default AssesmentPage;
