import React, { useState } from "react";
import { motion } from "framer-motion";
import Wordbreak from "@/components/comics/Wordbreak";
import { v4 } from "uuid";
import { MdCloudDownload } from "react-icons/md";
import FreeDownloadForm from "@/components/comics/FreeDownloadForm";
import { gamesData } from "@/constant/comicsConstants";

export interface GamesData {
  name: string;
  desc: string;
  image: string;
  imgStyling: string;
  cardStyling: string;
  thumbnail_url: string;
  pdf_url: string;
}

export interface SelectedComicType {
  thumbnail_url: string;
  pdf_url: string;
}

const FreeDownload: React.FC = () => {
  const [selectedComic, setSelectedComic] = useState<SelectedComicType>({
    thumbnail_url: "",
    pdf_url: "",
  });

  const [showFreeDownloadForm, setShowFreeDownloadForm] =
    useState<boolean>(false);
  return (
    <div className="container py-10 md:py-20 bg-[#00B0A5]">
      <motion.div
        initial={{ opacity: 0.5 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="space-y-5 pb-8 text-center lg:text-start"
      >
        <motion.div
          initial={{ opacity: 0.5 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className=" text-3xl text-red-500 lineBefore uppercase"
        >
          Free Download{" "}
        </motion.div>
        <motion.div
          initial={{ y: 50 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 1.5 }}
          className="text-5xl lg:text-7xl text-white w-full font-extrabold leading-[1.10]"
        >
          Our Top Trendy <Wordbreak /> Games for{" "}
          <span className="text-primary">Free!</span>{" "}
        </motion.div>
      </motion.div>
      <div className="flex flex-wrap justify-center gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        {gamesData?.map((item) => {
          return (
            <motion.div
              initial={{ opacity: 0.5 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              key={v4()}
              // onClick={() => navigate(`/mentoons-comics/audio-comics/${item.name}`)}
              className={`${
                item?.cardStyling && "bg-white"
              } shadow-2xl group cursor-pointer text-black rounded-2xl px-5 py-5 space-y-3`}
              onClickCapture={() => {
                setShowFreeDownloadForm(true);
                setSelectedComic({
                  thumbnail_url: item.thumbnail_url,
                  pdf_url: item.pdf_url,
                });
              }}
            >
              <div
                className={`${item?.imgStyling} overflow-hidden rounded-2xl`}
              >
                <img
                  className="w-full h-[23rem] lg:h-[16rem] rounded-2xl group-hover:scale-105 transition-all ease-in-out duration-300"
                  src={item?.image}
                  alt="comic image"
                />
              </div>
              <div className="space-y-2">
                <div className="text-xl font-semibold tracking-wide">
                  {item?.name}
                </div>
                <div className=" text-sm tracking-wide">{item?.desc}</div>
              </div>
              <div className="text-end flex items-center justify-end gap-2 border-t border-gray-200 group-hover:text-red-500 group-hover:underline text-xl pt-4 cursor-pointer">
                Download Now{" "}
                <MdCloudDownload className="text-2xl text-red-700 group-hover:text-500" />
              </div>
            </motion.div>
          );
        })}
      </div>
      {showFreeDownloadForm && (
        <FreeDownloadForm
          page="freedownload"
          selectedComic={selectedComic}
          setShowFreeDownloadForm={setShowFreeDownloadForm}
        />
      )}
    </div>
  );
};

export default FreeDownload;
