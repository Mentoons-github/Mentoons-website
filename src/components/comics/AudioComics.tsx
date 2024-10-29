import React from "react";
import Wordbreak from "./Wordbreak";
import { FaCirclePlay } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AudioComic } from "@/redux/comicSlice";
import { motion } from "framer-motion";

const AudioComics: React.FC = () => {
  const navigate = useNavigate();
  const comicsData = useSelector(
    (store: RootState) => store.comics.audioComics
  );
  const comics = comicsData.slice(0, 6);

  return (
    <div className="container bg-[#62f262] space-y-5 py-14 lg:py-28">
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
          Audio Comics{" "}
        </motion.div>
        <motion.div
          initial={{ y: 50 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 1.5 }}
          className="text-5xl lg:text-7xl text-white w-full font-extrabold leading-[1.10]"
        >
          Our Top Trendy <Wordbreak /> Fun Audio Comic
        </motion.div>
      </motion.div>
      <div className="flex flex-wrap gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        {comics?.map((item: AudioComic) => {
          return (
            <motion.div
              initial={{ opacity: 0.5 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              key={v4()}
              onClick={() =>
                navigate(`/mentoons-comics/audio-comics/${item.name}`)
              }
              className="bg-white shadow-lg group cursor-pointer text-black rounded-2xl px-5 py-5 space-y-3"
            >
              <div className="overflow-hidden rounded-2xl">
                <img
                  className="w-full h-[23rem] lg:h-[16rem] rounded-2xl group-hover:scale-105 transition-all ease-in-out duration-300"
                  src={item?.thumbnail}
                  alt="comic image"
                />
              </div>
              <div className="space-y-2">
                <div className="text-xl font-semibold tracking-wide">
                  {item?.name}
                </div>
                <div className="text-black text-sm tracking-wide">
                  {item?.desc}
                </div>
              </div>
              <div className="text-end flex items-center justify-end gap-2 border-t border-gray-200 group-hover:text-red-500 group-hover:underline text-xl pt-4 cursor-pointer">
                Play Sample{" "}
                <FaCirclePlay className="text-2xl text-red-700 group-hover:text-500" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AudioComics;
