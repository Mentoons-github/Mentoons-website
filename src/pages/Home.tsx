import React from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { IoCloseOutline } from "react-icons/io5";
import axiosInstance from "@/api/axios";
import { errorToast, successToast } from "@/utils/toastResposnse";
import { AxiosError } from "axios";

// Import your section components
import Struggles from "@/components/LandingPage/Struggles";
import ComicSection from "@/components/LandingPage/ComicSection";
import HeroSection from "@/components/LandingPage/HeroSection";
import MdMultiverse from "@/components/LandingPage/MdMultiverse";
import PodcastSection from "@/components/LandingPage/PodcastSection";
import WorkshopSection from "@/components/LandingPage/WorkshopSection";

const Home = () => {
  const { user } = useUser();
  const [showPopup, setShowPopup] = React.useState(false);

  // Minimal animation variant
  const sectionVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Comic sending function
  const sendComic = async () => {
    try {
      const response = await axiosInstance.post(`/email/sendEmail`, {
        email: user?.emailAddresses[0].emailAddress,
        data: {
          pdf: "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Comics-Pdf/Book+2+-+Electronic+gadgets+and+kids.pdf",
          thumbnail:
            "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-13.jpg",
        },
      });
      if (response.status === 200) {
        successToast("Comic sent successfully");
        setShowPopup(false);
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      const errorMessage = axiosError.response?.data
        ? (axiosError.response.data as { message: string }).message
        : "An error occurred";
      errorToast(errorMessage);
    }
  };

  return (
    <div className="w-full">
      <HeroSection />

      {/* Sections with minimal scroll animations */}
      {[
        { Component: Struggles, key: 'struggles' },
        { Component: MdMultiverse, key: 'multiverse' },
        { Component: ComicSection, key: 'comic' },
        { Component: WorkshopSection, key: 'workshop' },
        { Component: PodcastSection, key: 'podcast' }
      ].map(({ Component, key }) => (
        <motion.div
          key={key}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <Component />
        </motion.div>
      ))}

      {/* Popup Modal - Simplified */}
      {showPopup && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white rounded-lg shadow-xl p-6"
          >
            <div className="flex justify-end">
              <button 
                onClick={() => setShowPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoCloseOutline className="text-2xl" />
              </button>
            </div>

            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Congratulations! 🎉
              </h2>
              
              <p className="text-gray-600">
                Hi {user?.firstName}, you've successfully joined!
              </p>

              <button 
                onClick={sendComic}
                className="bg-green-500 text-white px-5 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Claim Your Comic
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;