import { useState } from "react";
import { FaRegCirclePlay } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

export interface VideoPopupProps {
  isOpen: boolean;
  videoSrc: string;
  onClose: () => void;
}

const WhyMentoons: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <div
        onClick={openPopup}
        className="w-fit mx-auto lg:mx-0 flex items-center justify-between gap-4"
      >
        <div>
          <FaRegCirclePlay className="text-red-500 text-6xl cursor-pointer" />
        </div>
        <button className="text-red-500 text-3xl">
          Why Choose Mentoons Comics
        </button>
      </div>
      <div className="sm:max-w-[425px] md:max-w-[600px]">
        <VideoPopup
          isOpen={isOpen}
          videoSrc="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Others/Why+Choose+Mentoons+Comics.mp4"
          onClose={closePopup}
        />
      </div>
    </div>
  );
};

export const VideoPopup: React.FC<VideoPopupProps> = ({
  isOpen,
  videoSrc,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg p-4 max-w-[425px] space-y-5">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black cursor-pointer text-xl hover:text-red-400 active:scale-50 transition-all ease-in-out duration-300"
        >
          <IoMdClose />
        </button>
        <video
          className="rounded-lg"
          src={videoSrc}
          width="1000"
          height="1000"
          loop
          autoPlay
          controls
          controlsList="nodownload"
        ></video>
      </div>
    </div>
  );
};

export default WhyMentoons;
