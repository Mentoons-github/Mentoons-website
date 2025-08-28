import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Faq = {
  question: string;
  answer: string;
};

type FaqData = {
  category: string;
  faqs: Faq[];
  icon: string;
  color: string;
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("About Our Services");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const categories = [
    "All",
    "About Our Services",
    "Programs and Workshops",
    "General Inquiries",
    "Post-Registration",
    "Additional Resources",
  ];

  const faqData: FaqData[] = [
    {
      category: "About Our Services",
      icon: "🎯",
      color: "from-yellow-400 to-orange-500",
      faqs: [
        {
          question: "What exactly is Mentoons?",
          answer:
            "Mentoons is a unique platform that blends mentoring with the art of cartoons. We aim to address issues like social media addiction and enhance skills like self-awareness through interactive workshops and resources. Our programs are designed for children, teenagers, and adults who seek meaningful personal development in a creative and engaging way.",
        },
        {
          question: "How can Mentoons help with social media addiction?",
          answer:
            "At Mentoons, we tackle social media addiction by offering specially designed workshops that focus on building real-world connections and healthier habits. Participants engage in creative activities that foster a sense of community and connectivity without relying on digital interactions.",
        },
      ],
    },
    {
      category: "Programs and Workshops",
      icon: "🎨",
      color: "from-orange-400 to-red-500",
      faqs: [
        {
          question: "How do I choose the right workshop or program?",
          answer:
            "Visit our website and browse through the various programs offered. Each listing includes details that help you understand the focus of the workshop and whom it's best suited for, whether you're a parent looking to engage your child or a professional seeking self-development.",
        },
        {
          question: "How do I sign up for a workshop?",
          answer:
            "Signing up is easy: Visit our enrollment page, choose your desired workshop, click on 'Enroll Now' or fill out the application form, and complete your registration with the necessary details and payment.",
        },
        {
          question: "What should I expect after registering for a workshop?",
          answer:
            "You will receive access to the necessary materials and resources for the workshop. Engage with the content at scheduled times or at your own pace, depending on the format. Experience interactive learning designed to encourage personal growth and community interaction.",
        },
      ],
    },
    {
      category: "General Inquiries",
      icon: "❓",
      color: "from-yellow-300 to-orange-400",
      faqs: [
        {
          question: "Who can benefit most from Mentoons?",
          answer:
            "Our programs are ideal for anyone looking to overcome digital addiction issues, enhance personal skills like communication and creativity, and develop meaningful social connections. This includes children, teenagers, families, and professionals.",
        },
        {
          question:
            "What makes Mentoons different from other personal development programs?",
          answer:
            "Unlike traditional methods, Mentoons uses a combination of mentoring and cartoon-based storytelling to make the learning process enjoyable and effective. Our method is evidence-based, focusing on real-world outcomes and improvements in behavior and personal interaction skills.",
        },
      ],
    },
    {
      category: "Post-Registration",
      icon: "📋",
      color: "from-red-400 to-orange-600",
      faqs: [
        {
          question: "What happens if I miss a live session?",
          answer:
            "Don't worry! All live sessions are recorded, allowing you to catch up at your convenience. Plus, our instructors are always available for questions during their office hours.",
        },
      ],
    },
    {
      category: "Additional Resources",
      icon: "📚",
      color: "from-orange-300 to-yellow-500",
      faqs: [
        {
          question: "Are there resources available aside from the workshops?",
          answer:
            "Absolutely! Mentoons provides additional resources such as articles, cartoons, and interactive tools available through our platform to reinforce your learning and development.",
        },
        {
          question:
            "How can I stay updated with new workshops and Mentoons news?",
          answer:
            "To stay updated, subscribe to our newsletter, check our website regularly, and follow us on social media. We continually announce upcoming workshops and new content that could benefit you and your family.",
        },
      ],
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getFilteredFaqs = () => {
    let faqs =
      selectedCategory === "All"
        ? faqData.flatMap((category) => category.faqs)
        : faqData.find((faq) => faq.category === selectedCategory)?.faqs || [];

    if (searchTerm) {
      faqs = faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return faqs;
  };

  const filteredFaqs = getFilteredFaqs();
  const selectedCategoryData = faqData.find(
    (cat) => cat.category === selectedCategory
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const cardVariants = {
    closed: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      scale: 1,
      transition: { duration: 0.3 },
    },
    open: {
      backgroundColor: "rgba(255, 255, 255, 1)",
      scale: 1.02,
      transition: { duration: 0.3 },
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.section
      className="py-20 min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full opacity-20 blur-xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-orange-400 to-red-500 rounded-full opacity-30 blur-xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-red-300 to-orange-400 rounded-full opacity-15 blur-2xl"
          animate={{
            x: [0, 120, 0],
            y: [0, -80, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Additional Floating Elements */}
        <motion.div
          className="absolute top-60 left-1/3 w-20 h-20 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full opacity-25 blur-lg"
          animate={{
            x: [0, -60, 0],
            y: [0, 40, 0],
            scale: [1, 1.3, 1],
            rotate: [0, -180, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        <motion.div
          className="absolute bottom-60 right-1/3 w-28 h-28 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full opacity-20 blur-xl"
          animate={{
            x: [0, 90, 0],
            y: [0, -70, 0],
            scale: [1, 0.7, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />

        {/* Geometric Shapes */}
        <motion.div
          className="absolute top-1/4 right-10 w-16 h-16 bg-gradient-to-r from-orange-300 to-red-300 opacity-30 blur-sm"
          style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-20 w-12 h-12 bg-gradient-to-r from-yellow-300 to-orange-300 opacity-40 blur-sm rotate-45"
          animate={{
            rotate: [45, 405],
            scale: [1, 1.4, 1],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.5,
          }}
        />

        {/* Animated Lines/Particles */}
        <motion.div
          className="absolute top-1/3 left-1/2 w-1 h-20 bg-gradient-to-b from-yellow-400 to-transparent opacity-30"
          animate={{
            scaleY: [1, 2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/2 w-16 h-1 bg-gradient-to-r from-red-400 to-transparent opacity-30"
          animate={{
            scaleX: [1, 2.5, 1],
            opacity: [0.3, 0.7, 0.3],
            rotate: [0, -45, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6,
          }}
        />

        {/* Pulsing Dots */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full opacity-40"
            style={{
              top: `${20 + i * 10}%`,
              left: `${10 + i * 11}%`,
            }}
            animate={{
              scale: [0.5, 1.2, 0.5],
              opacity: [0.2, 0.8, 0.2],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.7,
            }}
          />
        ))}

        {/* Spiral Elements */}
        <motion.div
          className="absolute top-1/2 left-10 w-6 h-6 border-2 border-yellow-400 rounded-full opacity-30"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.5, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 7,
          }}
        />
        <motion.div
          className="absolute top-3/4 right-20 w-8 h-8 border-2 border-red-400 rounded-full opacity-25"
          animate={{
            rotate: [0, -360],
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8,
          }}
        />

        {/* Question Mark Symbols */}
        <motion.div
          className="absolute top-10 right-1/4 text-6xl text-orange-300 opacity-10 select-none"
          animate={{
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        >
          ?
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-1/4 text-4xl text-red-300 opacity-15 select-none"
          animate={{
            rotate: [0, -20, 20, 0],
            scale: [1, 1.2, 1],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        >
          ?
        </motion.div>

        {/* Glowing Stars */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute text-yellow-400 opacity-30 select-none"
            style={{
              top: `${15 + i * 15}%`,
              right: `${5 + i * 8}%`,
              fontSize: `${12 + i * 2}px`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.3, 0.8],
              rotate: [0, 180, 0],
            }}
            transition={{
              duration: 3 + i * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.2,
            }}
          >
            ✨
          </motion.div>
        ))}

        {/* Wavy Lines */}
        <motion.div
          className="absolute top-1/2 left-0 w-full h-px opacity-20"
          style={{
            background:
              "linear-gradient(90deg, transparent, #f59e0b, #ef4444, transparent)",
          }}
          animate={{
            x: [-100, 100],
            opacity: [0, 0.3, 0],
            scaleX: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full mb-8 shadow-2xl"
            variants={itemVariants}
            whileHover={{
              rotate: 360,
              scale: 1.1,
              transition: { duration: 0.6 },
            }}
          >
            <motion.span
              className="text-3xl"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ❓
            </motion.span>
          </motion.div>

          <motion.h6
            className="text-lg font-bold text-orange-600 mb-4 tracking-widest uppercase"
            variants={itemVariants}
          >
            Frequently Asked Questions
          </motion.h6>

          <motion.h1
            className="text-6xl md:text-7xl font-black bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent leading-tight mb-8"
            variants={itemVariants}
          >
            Looking for answers?
          </motion.h1>

          <motion.p
            className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Welcome to the FAQ section of Mentoons, where we've gathered the
            most asked questions to help you understand our services and their
            incredible value.
          </motion.p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <motion.svg
                className="h-6 w-6 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </motion.svg>
            </div>
            <input
              type="text"
              className="w-full pl-16 pr-6 py-5 border-2 border-orange-200 rounded-3xl focus:ring-4 focus:ring-orange-300 focus:border-orange-500 bg-white/90 backdrop-blur-sm shadow-xl transition-all duration-300 text-lg placeholder-orange-400 font-medium"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <motion.div
              className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-0 -z-10"
              whileHover={{ opacity: 0.1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex justify-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <div className="inline-flex bg-white/80 backdrop-blur-md rounded-3xl p-3 shadow-2xl border-2 border-orange-100">
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => {
                const categoryData = faqData.find(
                  (cat) => cat.category === category
                );
                return (
                  <motion.button
                    key={category}
                    className={`py-4 px-8 rounded-2xl font-bold text-sm whitespace-nowrap transition-all duration-500 relative overflow-hidden ${
                      selectedCategory === category
                        ? "text-white shadow-xl transform scale-105"
                        : "text-orange-700 hover:text-white"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${
                        categoryData?.color || "from-yellow-400 to-orange-500"
                      } ${
                        selectedCategory === category
                          ? "opacity-100"
                          : "opacity-0 hover:opacity-100"
                      }`}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10 flex items-center">
                      {categoryData?.icon && (
                        <motion.span
                          className="mr-2 text-lg"
                          animate={{
                            rotate:
                              selectedCategory === category ? [0, 360] : 0,
                          }}
                          transition={{ duration: 0.6 }}
                        >
                          {categoryData.icon}
                        </motion.span>
                      )}
                      {category}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Image Section */}
          <motion.div
            className="w-full lg:w-2/5"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <div className="sticky top-8">
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  className="absolute -inset-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-3xl blur-xl opacity-30"
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-orange-200">
                  <motion.img
                    src="/md.png"
                    alt="FAQ illustration"
                    className="w-full h-auto"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-orange-500/20 via-transparent to-yellow-500/10"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>

              {/* Category Info Card */}
              <AnimatePresence mode="wait">
                {selectedCategory !== "All" && selectedCategoryData && (
                  <motion.div
                    key={selectedCategory}
                    className="mt-8 p-8 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-orange-200"
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="flex items-center mb-4">
                      <motion.span
                        className="text-4xl mr-4"
                        animate={{
                          rotate: [0, 15, -15, 0],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      >
                        {selectedCategoryData.icon}
                      </motion.span>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        {selectedCategory}
                      </h3>
                    </div>
                    <motion.div
                      className={`h-2 bg-gradient-to-r ${selectedCategoryData.color} rounded-full mb-4`}
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                    <p className="text-gray-700 font-medium text-lg">
                      {selectedCategoryData.faqs.length} question
                      {selectedCategoryData.faqs.length !== 1 ? "s" : ""} in
                      this category
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            className="w-full lg:w-3/5"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <AnimatePresence mode="wait">
              {filteredFaqs.length === 0 ? (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="text-8xl mb-6"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    🔍
                  </motion.div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    No questions found
                  </h3>
                  <p className="text-gray-600 text-xl">
                    Try adjusting your search or selecting a different category.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredFaqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="group"
                      layout
                    >
                      <motion.div
                        className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border-2 border-orange-100 overflow-hidden h-full"
                        variants={cardVariants}
                        initial="closed"
                        animate={openIndex === index ? "open" : "closed"}
                        whileHover="hover"
                      >
                        <motion.button
                          className="w-full text-left p-6 focus:outline-none focus:ring-4 focus:ring-orange-300 relative overflow-hidden"
                          onClick={() => handleToggle(index)}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-orange-500/10 to-red-500/10 opacity-0"
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />

                          <div className="flex items-start justify-between relative z-10">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 pr-4 group-hover:text-orange-600 transition-colors duration-300 leading-tight">
                              {faq.question}
                            </h3>
                            <motion.div
                              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                                openIndex === index
                                  ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                                  : "bg-orange-100 group-hover:bg-orange-200"
                              }`}
                              animate={{
                                rotate: openIndex === index ? 180 : 0,
                                scale: openIndex === index ? 1.1 : 1,
                              }}
                              transition={{ duration: 0.4 }}
                            >
                              <svg
                                className={`w-5 h-5 transition-colors duration-300 ${
                                  openIndex === index
                                    ? "text-white"
                                    : "text-orange-600"
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </motion.div>
                          </div>
                        </motion.button>

                        <AnimatePresence>
                          {openIndex === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.5, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6">
                                <motion.div
                                  className="h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full mb-4"
                                  initial={{ width: 0 }}
                                  animate={{ width: "100%" }}
                                  transition={{ duration: 0.8, delay: 0.2 }}
                                />
                                <motion.p
                                  className="text-gray-700 leading-relaxed text-base font-medium"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                  {faq.answer}
                                </motion.p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center justify-center p-12 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-3xl shadow-2xl relative overflow-hidden"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <div className="text-white relative z-10">
              <motion.h3
                className="text-3xl font-black mb-4"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                Still have questions?
              </motion.h3>
              <p className="text-orange-100 mb-6 text-xl font-medium">
                We're here to help! Reach out to our amazing support team.
              </p>
              <motion.button
                className="bg-white text-orange-600 px-10 py-4 rounded-2xl font-black text-lg hover:bg-orange-50 transition-colors duration-300 shadow-xl"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Support 🚀
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FAQ;
