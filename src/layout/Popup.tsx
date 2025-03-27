import axiosInstance from "@/api/axios";
import { useUser } from "@clerk/clerk-react";
import { easeInOut, motion } from "framer-motion";
import React from "react";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "sonner";

export interface PopupProps {
  handlePopUp: (flag: boolean) => void;
  item: {
    name: string;
    image: string;
  };
}

const Popup: React.FC<PopupProps> = ({ handlePopUp, item }) => {
  const { user } = useUser();

  const sendComic = async () => {
    try {
      const userEmail = user?.emailAddresses[0].emailAddress;

      if (!userEmail) {
        toast.error("User email not found");
        return;
      }

      // Send comic to user's email
      const response = await axiosInstance.post("/email/sendEmail", {
        email: userEmail,
        data: {
          pdf: "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Comics-Pdf/Book+2+-+Electronic+gadgets+and+kids.pdf",
          thumbnail: item.image,
        },
      });

      console.log(response);
      toast.success("Comic sent successfully to your email!");
      handlePopUp(false);
    } catch (err) {
      console.error(err);
      toast.error("Error sending comic to email");
      handlePopUp(false);
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
        <div className="flex justify-end items-center">
          <IoCloseOutline
            onClick={() => handlePopUp(false)}
            className="text-2xl text-black duration-300 cursor-pointer hover:text-red-500 active:scale-75"
          />
        </div>
        <div className="px-4 space-y-3">
          <div className="w-full rounded-lg overflow-hidden h-[20rem] max-w-[35rem] max-h-[25rem]">
            <img
              className="w-full h-full rounded-2xl"
              src={item.image}
              alt={`${item.name} comic preview`}
            />
          </div>
          <div className="space-y-2 text-lg font-semibold text-center">
            <p className="text-2xl font-bold">Congratulations 🎉</p>
            <p className="text-sm font-medium">
              You have received {item.name} for free!
            </p>
            <p className="text-sm">Kindly check your email</p>
          </div>
          <button
            onClick={sendComic}
            className="px-4 py-2 w-full text-center text-white rounded-full border duration-300 cursor-pointer bg-primary border-primary hover:bg-white hover:text-primary"
          >
            Claim Your Comic
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Popup;
