import ComicsSection from "@/components/Home/ComicsSection";
// import FeelFree from "@/components/Home/FeelFree";
import HeroBanner from "@/components/Home/HeroBanner";
// import MdMultiverse from "@/components/Home/MdMultiverse";
import Struggles from "@/components/Home/Struggles";
import { audioComicsData, comicsData } from "@/constant/comicsConstants";
import { errorToast, successToast } from "@/utils/toastResposnse";
import { useUser, } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { easeInOut } from "framer-motion";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";

// import PricingPlan from "@/components/shared/Pricing-Plan";
// import WhatWeOffer from "@/components/Home/WhatWeOffer";

const Home = () => {
  const [searchParams] = useSearchParams();
  const paramData = searchParams.get("openModal");
  const [showPopup, setShowPopup] = useState<boolean>(paramData === "true");
  const { user } = useUser();
  console.log(user, 'user')
  const sendComic = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/api/v1/email/sendEmailToUser`, {
        email: user?.emailAddresses[0].emailAddress,
        data: {
          pdf: "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Comics-Pdf/Book+2+-+Electronic+gadgets+and+kids.pdf",
          thumbnail: "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-13.jpg",
        }
      });
      if (response.status === 200) {
        successToast("Comic sent successfully");
        console.log("send comic");
        setShowPopup(false);
      };
    } catch (error: any) {
      errorToast(error.response.data.message);
      console.log(error);
    }
  };
  return (
    <>
      <div className="h-full w-full">
        <HeroBanner />
        <Struggles />
        {/* <MdMultiverse /> */}
        {/* <WhatWeOffer /> */}
        {/* <FeelFree /> */}
        <ComicsSection />
        {/* <section id='pricing'>
        <PricingPlan />
      </section> */}
      </div>
      {showPopup && (
        <div className="w-screen h-screen bg-black/60 fixed top-0 left-0 flex items-center justify-center z-[999999] ">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5, ease: easeInOut }}
            className="w-full max-w-[90%] md:max-w-[35rem] min-h-[35rem] px-2 pt-2 pb-3 rounded-md backdrop-blur-sm z-[9999] transition-all ease-in-out space-y-2 bg-[#00AEEF]"
            style={{ boxShadow: "2px 3px 4px 0px #90E1FF4A inset, -3px -3px 6px 0px #046D949E inset" }}
          >
            <div className="flex items-center justify-end">
              <IoCloseOutline
                onClick={() => setShowPopup(false)}
                className="cursor-pointer text-2xl text-black hover:text-red-500 duration-300 active:scale-75"
              />
            </div>
            <div className="space-y-6 flex flex-col items-center justify-center">
              <h1 className="text-2xl font-semibold text-center text-white">Congratulations! 🎉</h1>
              <figure className="w-[20rem] h-[20rem]">
              <img
                  className="w-full h-full rounded-2xl"
                  src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-13.jpg"
                  alt="gadgets and you"
                />
              </figure>
              <div className="bg-white rounded-xl p-5 flex flex-col items-center justify-center relative">
                <figure className="w-[52px] h-[72px] absolute -top-6 left-10">
                  <img src="/assets/cards/klement.png" alt="Klement" className="w-full h-full object-contain" />
                </figure>
                <h1 className="text-xl font-semibold text-center">Hi {user?.firstName},</h1>
                <p className="text-lg text-center">You've successfully joined, check<br /> your email for a welcome Gift!</p>
              </div>
              <button 
                className="bg-[#66BE55] px-4 py-2 rounded-lg text-white text-md font-semibold" 
                style={{
                  boxShadow: "2px 2px 6.3px 0px #B8FFAA82 inset, -2px -2px 4px 0px #11660099 inset"
                }}
                onClick={() => sendComic()}
              >
                Claim your Comic
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Home;
