import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  UserPlus,
  ChevronRight,
  BookOpen,
  Users,
  MessageSquare,
  Sparkle,
  Star,
  Heart,
} from "lucide-react";
import { useState, useEffect } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 9,
    },
  },
};

const heroVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const WelcomeLogin = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const features = [
    {
      title: "Community Stories",
      description:
        "Share your adventures and read exciting stories from friends around the world",
      icon: <BookOpen className="text-orange-600" size={26} />,
      color: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      title: "Find Friends",
      description:
        "Connect with peers who share your interests and make lasting friendships",
      icon: <Users className="text-amber-600" size={26} />,
      color: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      title: "Chat & Create (Upcoming)",
      description:
        "Join discussions, share ideas, and collaborate on creative projects together",
      icon: <MessageSquare className="text-yellow-600" size={26} />,
      color: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="w-full bg-white rounded-xl overflow-hidden mb-4 shadow-lg border border-orange-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500 p-5">
        <div className="flex items-center gap-4">
          <motion.div
            className="h-14 w-14 bg-white rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ rotate: 10, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img
              src="https://mentoons-website.s3.ap-northeast-1.amazonaws.com/logo/ec9141ccd046aff5a1ffb4fe60f79316.png "
              alt="Mentoons"
              className="w-15 h-15 object-contain"
            />
          </motion.div>
          <div>
            <h3 className="font-bold text-xl text-white">Mentoons Adda</h3>
            <div className="flex items-center gap-3 text-orange-100">
              <span className="flex items-center text-xs">
                <span className="h-2 w-2 rounded-full bg-green-400 mr-1 animate-pulse"></span>
                <span>Online now</span>
              </span>
              <span className="flex items-center text-xs">
                <Heart size={12} className="mr-1" />
                <span>10k+ members</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-orange-600"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-amber-600"></div>
          <div className="absolute top-40 right-10 w-20 h-20 rounded-full bg-yellow-600"></div>
        </div>
        <motion.div
          className="p-6 sm:p-8 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <motion.span
              className="inline-block text-3xl mb-2"
              animate={{
                rotate: [0, 10, 0, -10, 0],
                scale: [1, 1.2, 1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              👋
            </motion.span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
              Welcome to your creative community!
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Mentoons Adda is a safe, fun space where young minds connect,
              share stories, and discover amazing content crafted especially for
              you.
            </p>
          </motion.div>
          <motion.div
            className="relative h-64 sm:h-80 md:h-96 mb-10 rounded-xl overflow-hidden"
            variants={heroVariants}
          >
            <motion.div
              className="absolute top-10 right-10 z-10"
              animate={{
                y: [0, -15, 0],
                rotate: 360,
              }}
              transition={{
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              }}
            >
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Star className="text-amber-500" size={24} />
              </div>
            </motion.div>
            <motion.div
              className="absolute bottom-10 left-10 z-10"
              animate={{
                y: [0, 15, 0],
                rotate: -360,
              }}
              transition={{
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              }}
            >
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Sparkle className="text-orange-500" size={20} />
              </div>
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-orange-50 to-amber-50 rounded-xl"></div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.img
                src="https://mentoons-website.s3.ap-northeast-1.amazonaws.com/logo/ec9141ccd046aff5a1ffb4fe60f79316.png "
                alt="icon-post"
                className="h-5/6 object-contain drop-shadow-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </motion.div>
          </motion.div>
          <motion.div className="mb-10" variants={itemVariants}>
            <motion.div
              className={`p-6 rounded-xl shadow-md ${features[currentFeature].color} border ${features[currentFeature].borderColor}`}
              key={currentFeature}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="p-3 bg-white rounded-full shadow-sm">
                  {features[currentFeature].icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {features[currentFeature].title}
                  </h3>
                  <p className="text-gray-600">
                    {features[currentFeature].description}
                  </p>
                </div>
              </div>
            </motion.div>
            <div className="flex justify-center mt-4 gap-2">
              {features.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full ${
                    currentFeature === index ? "bg-orange-600" : "bg-orange-200"
                  }`}
                  onClick={() => setCurrentFeature(index)}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10"
            variants={containerVariants}
          >
            {[
              {
                title: "Make Friends",
                desc: "Connect with like-minded peers",
                icon: <Users size={22} className="text-amber-600" />,
                color: "bg-amber-50",
                border: "border-amber-200",
              },
              {
                title: "Share Stories",
                desc: "Express yourself in a safe space",
                icon: <MessageSquare size={22} className="text-orange-600" />,
                color: "bg-orange-50",
                border: "border-orange-200",
              },
              {
                title: "Learn & Grow",
                desc: "Discover fun educational content",
                icon: <BookOpen size={22} className="text-yellow-600" />,
                color: "bg-yellow-50",
                border: "border-yellow-200",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`${feature.color} border ${feature.border} p-5 rounded-xl flex flex-col items-center shadow-sm`}
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  boxShadow: "0 15px 30px rgba(234, 88, 12, 0.15)",
                }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="bg-white p-3 rounded-full shadow-sm mb-4">
                  {feature.icon}
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-600 text-center">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
              Join our creative community today!
            </h2>
            <p className="text-gray-600 mb-2">
              Sign in to start posting, connect with friends, and unlock
              exclusive content created just for you!
            </p>
          </motion.div>
        </motion.div>
      </div>
      <motion.div
        className="relative p-8 flex flex-col sm:flex-row gap-5 justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100 via-amber-100 to-yellow-100"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-300 to-orange-300 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-300 to-yellow-300 rounded-full blur-3xl opacity-20 translate-y-1/3 -translate-x-1/4"></div>
        <div className="relative z-10 w-full flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Link to="/sign-in" className="w-full sm:w-auto">
            <motion.button
              className="w-full py-4 px-10 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-medium flex items-center justify-center shadow-lg"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 15px 25px -5px rgba(234, 88, 12, 0.5)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg">Login Now</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="ml-2"
              >
                <ChevronRight size={20} />
              </motion.span>
            </motion.button>
          </Link>
          <Link to="/sign-up" className="w-full sm:w-auto">
            <motion.button
              className="w-full py-4 px-10 bg-white border-2 border-orange-300 text-orange-700 rounded-xl font-medium flex items-center justify-center gap-2 shadow-md"
              whileHover={{
                scale: 1.03,
                borderColor: "#EA580C",
                boxShadow: "0 15px 25px -5px rgba(234, 88, 12, 0.2)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <UserPlus size={20} />
              <span className="text-lg">Register Now</span>
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeLogin;
