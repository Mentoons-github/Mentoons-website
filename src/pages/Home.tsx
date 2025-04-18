import axiosInstance from "@/api/axios";
// import AddaSection from "@/components/LandingPage/addaSection";
import Community from "@/components/LandingPage/benefits/community/community";
import HeroSection from "@/components/LandingPage/hero/HeroSection";
import { errorToast, successToast } from "@/utils/toastResposnse";
import { useUser } from "@clerk/clerk-react";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
// import NewSection from "@/components/LandingPage/NewSection";
import Membership from "@/components/LandingPage/membership/membership";
import NewsAndMentor from "@/components/LandingPage/newsAndMentor/newsAndMentor";
import ComicViewer from "@/components/common/ComicViewer";
import { MdClose } from "react-icons/md";

const Home = () => {
  const { user } = useUser();
  const [showPopup, setShowPopup] = React.useState(false);
  const [showComicModal, setShowComicModal] = useState(false);
  const [comicToView, setComicToView] = useState<string>("");

  const openComicModal = (comicLink: string) => {
    setComicToView(comicLink);
    setShowComicModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeComicModal = () => {
    setShowComicModal(false);
    document.body.style.overflow = "auto";
  };
  
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
      <motion.div>
        <Community openComicModal={openComicModal} />
      </motion.div>
      {[
        { Component: Membership, key: "membership" },
        { Component: NewsAndMentor, key: "newsSubscription" },
      ].map(({ Component, key }) => (
        <motion.div key={key}>
          <Component />
        </motion.div>
      ))}

      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
          >
            <div className="flex justify-end">
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoCloseOutline className="text-2xl" />
              </button>
            </div>

            <div className="space-y-4 text-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                Congratulations! 🎉
              </h2>

              <p className="text-gray-600">
                Hi {user?.firstName}, you've successfully joined!
              </p>

              <button
                onClick={sendComic}
                className="px-5 py-2 text-white transition-colors bg-green-500 rounded-md hover:bg-green-600"
              >
                Claim Your Comic
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      {showComicModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-[95%] h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden items-center"
          >
            <button
              onClick={closeComicModal}
              className="absolute z-50 p-2 text-gray-600 transition-colors top-4 right-4 hover:text-gray-900"
            >
              <MdClose className="text-2xl" />
            </button>

            <ComicViewer pdfUrl={comicToView} />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
