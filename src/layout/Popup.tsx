import React from "react";
import { IoCloseOutline } from "react-icons/io5";
import { easeInOut, motion } from "framer-motion";
import axiosInstance from "@/api/axios";
import { toast } from "sonner";

export interface PopupProps {
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  item: {
    name: string;
    image: string;
  };
}
const Popup: React.FC<PopupProps> = ({ setShowPopup, item }) => {
  const sendComic = async () => {
    try {
      const data = await axiosInstance.post("whatsapp/sendComic", {
        number: localStorage.getItem("phoneNumber") || "+918777328451",
      });
      console.log(data);
      setShowPopup(false);
      toast("Comic sent successfully on whatsapp!");
    } catch (err) {
      setShowPopup(false);
      console.log(err);
    }
  };

  return (
    <div className="w-screen h-screen bg-black/60 fixed top-0 left-0 flex items-center justify-center z-[999999]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5, ease: easeInOut }}
        className="max-w-[25rem] px-2 pt-2 pb-3 rounded-md bg-white backdrop-blur-sm z-[9999] transition-all ease-in-out space-y-2"
      >
        <div className="flex items-center justify-end">
          <IoCloseOutline
            onClick={() => setShowPopup(false)}
            className="cursor-pointer text-2xl text-black hover:text-red-500 duration-300 active:scale-75"
          />
        </div>
        <div className="px-4 space-y-3">
          <div className="w-full rounded-lg overflow-hidden h-[20rem] max-w-[35rem] max-h-[25rem]">
            <img
              className="w-full h-full rounded-2xl"
              src={item.image}
              alt=""
            />
          </div>
          <div className="font-semibold text-lg text-center space-y-2">
            <p className="font-bold text-2xl">Congratulations 🎉</p>
            <p className="text-sm font-medium">
              You have received {item.name} for free!
            </p>
            <p className="text-sm">Kindly check your mail</p>
          </div>
          <div
            onClick={() => sendComic()}
            className="bg-primary text-white rounded-full border border-primary text-center cursor-pointer px-4 py-2 duration-300 hover:bg-white hover:text-primary"
          >
            Claim Your Comic
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Popup;
