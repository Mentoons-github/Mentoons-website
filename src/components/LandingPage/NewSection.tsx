import { useState } from "react";
import { PODCAST_DATA } from "./PodcastSection";
import { FaPlay } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NewSection = () => {
    const navigate = useNavigate()
    const [selectedCategory, setSelectedCategory] = useState<string>("6-12");
    const filteredPodcasts = PODCAST_DATA.filter((podcast) => podcast.category === selectedCategory);
    const [selectedPodcast, setSelectedPodcast] = useState(filteredPodcasts[0]);
   

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    const scaleVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    const slideVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <motion.div
            className="w-full mx-auto p-6 bg-[#F9FFEB] relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
        >
            <img src="/assets/NewSection/Ellipse-blue.png" alt="New Section Background" className="absolute right-0 top-0 hidden lg:block" />
            <img src="/assets/NewSection/Ellipse-green.png" alt="New Section Background 2" className="absolute left-0 bottom-0 hidden lg:block" />

            <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
                {/* Main Content Column */}
                <div className="flex-1 space-y-6">
                    {/* Top Grid */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-12 gap-6"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={containerVariants}
                    >
                        {/* Comic Based Mentoring */}
                        <motion.div
                            className="md:col-span-3 bg-yellow-100 p-6 rounded-lg flex items-center justify-center flex-col"
                            variants={scaleVariants}
                            whileHover={{ scale: 1.02 }}
                            viewport={{ once: true }}
                        >
                            {/* Content remains the same */}
                            <h2 className="text-2xl font-bold">Comic</h2>
                            <h2 className="text-2xl font-bold">Based</h2>
                            <div className="font-bold text-center text-xl">
                                <span className="text-red-500">M</span>
                                <span className="text-blue-500">E</span>
                                <span className="text-green-500">N</span>
                                <span className="text-yellow-500">T</span>
                                <span className="text-purple-500">O</span>
                                <span className="text-red-500">R</span>
                                <span className="text-blue-500">I</span>
                                <span className="text-green-500">N</span>
                                <span className="text-yellow-500">G</span>
                            </div>
                        </motion.div>

                        {/* Making Mentoring */}
                        <motion.div
                            className="md:col-span-4 bg-teal-500 p-6 rounded-lg flex flex-row items-start"
                            variants={scaleVariants}
                            whileHover={{ scale: 1.02 }}
                            viewport={{ once: true }}
                        >
                            {/* Content remains the same */}
                            <div className="bg-white p-2 rounded-lg w-1/2 mr-4">
                                <img src="/assets/NewSection/fam-big.png" alt="Mentoring illustration" className="w-full h-auto" />
                            </div>
                            <div className="text-white">
                                <h2 className="text-2xl font-bold">Making</h2>
                                <div className="font-bold text-xl">
                                    <span>M</span>
                                    <span>E</span>
                                    <span>N</span>
                                    <span>T</span>
                                    <span>O</span>
                                    <span>R</span>
                                    <span>I</span>
                                    <span>N</span>
                                    <span>G</span>
                                </div>
                                <p className="text-sm mt-2">
                                    Accessible,<br />
                                    Engaging and<br />
                                    Impactful for<br />
                                    All
                                </p>
                            </div>
                        </motion.div>

                        {/* Workshops */}
                        <motion.div
                            className="md:col-span-5 bg-orange-200 p-6 rounded-lg"
                            variants={scaleVariants}
                            whileHover={{ scale: 1.02 }}
                            viewport={{ once: true }}
                        >
                            {/* Content remains the same */}
                            <h2 className="text-2xl font-bold mb-4">Workshops For All</h2>
                            <div className="bg-white p-3 rounded-lg mb-4">
                                <img src="/assets/NewSection/fam.png" alt="Workshop illustration" className="w-full h-auto" />
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                <div
                                    className="bg-green-500 p-2 rounded text-white text-center text-sm transition-all duration-300 transform hover:scale-105 hover:bg-green-600 active:scale-95 active:bg-green-700 whitespace-nowrap"
                                    onClick={() => navigate(`/mentoons-workshops?workshop=6-12`)}
                                >
                                    6 - 12
                                </div>
                                <div
                                    className="bg-yellow-500 p-2 rounded text-white text-center text-sm transition-all duration-300 transform hover:scale-105 hover:bg-yellow-600 active:scale-95 active:bg-yellow-700 whitespace-nowrap"
                                    onClick={() => navigate(`/mentoons-workshops?workshop=13-19`)}
                                >
                                    13 - 19
                                </div>
                                <div
                                    className="bg-blue-500 p-2 rounded text-white text-center text-sm transition-all duration-300 transform hover:scale-105 hover:bg-blue-600 active:scale-95 active:bg-blue-700 whitespace-nowrap"
                                    onClick={() => navigate(`/mentoons-workshops?workshop=20+`)}
                                >
                                    20 +
                                </div>
                                <div
                                    className="bg-purple-500 p-2 rounded text-white text-center text-sm transition-all duration-300 transform hover:scale-105 hover:bg-purple-600 active:scale-95 active:bg-purple-700 whitespace-nowrap"
                                    onClick={() => navigate(`/mentoons-workshops?workshop=parents`)}
                                >
                                    Parents
                                </div>

                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Bottom Grid */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        variants={containerVariants}
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <motion.div
                            className="bg-green-200 p-6 rounded-lg flex items-center justify-center flex-col"
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                        >
                            <img src="/assets/NewSection/new pod.png" alt="Podcast" className="w-32 h-32 mb-4" />
                            <h2 className="text-3xl font-bold">PODCAST</h2>
                        </motion.div>

                        <motion.div
                            className="bg-pink-200 p-6 rounded-lg relative h-48"
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="flex items-center h-full">
                                <figure className="w-40 absolute left-4 bottom-0">
                                    <img src="/assets/LandingPage/podcast img.png" alt="Listen illustration" />
                                </figure>
                                <div className="text-center ml-auto mr-8">
                                    <h2 className="text-2xl font-bold">Listen to Us</h2>
                                    <p className="text-xl">Daily</p>
                                    <span className="text-2xl">🎵</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* TV Section */}
                <motion.div
                    className="lg:w-1/3 bg-yellow-100 p-6 rounded-lg h-[35rem] overflow-hidden"
                    variants={slideVariants}
                    viewport={{ once: true }}
                >
                    <div className="relative w-full max-w-md mx-auto">
                        <img src="/assets/images/mentoons-tv.png" alt="TV Frame" className="w-full" />
                        {selectedPodcast && (
                            <video
                                src={selectedPodcast.videoSrc}
                                className="absolute top-[33%] left-[22%] w-[55%]"
                                autoPlay
                                controls
                                muted
                                playsInline
                            />
                        )}
                    </div>
                    <div className="flex justify-center gap-3 mt-6">
                        {["6-12", "13-19", "20+ & Parent's"].map((category) => (
                            <motion.button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition-all ${selectedCategory === category
                                        ? 'bg-blue-500 text-white font-bold'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {category}
                            </motion.button>
                        ))}
                    </div>
                    <motion.div
                        className="mt-6 overflow-y-auto h-64 space-y-3 px-2"
                        variants={containerVariants}
                        viewport={{ once: true }}
                    >
                        {filteredPodcasts.map((podcast) => (
                            <motion.div
                                key={podcast.title}
                                className={`flex items-center gap-4 p-3 rounded-md cursor-pointer ${selectedPodcast?.title === podcast.title
                                        ? "bg-white/20"
                                        : "hover:bg-white/10"
                                    }`}
                                onClick={() => setSelectedPodcast(podcast)}
                            >
                                <div className="min-w-12 h-12 flex justify-center items-center rounded-full bg-white">
                                    <FaPlay className="text-red-500" />
                                </div>
                                <h1 className={`truncate ${selectedPodcast?.title === podcast.title
                                        ? "text-blue font-semibold"
                                        : "text-gray-700"
                                    }`}>
                                    {podcast.title}
                                </h1>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default NewSection;