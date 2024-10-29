import { AudioComic, Comic } from "@/redux/comicSlice";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { Button } from "../components/ui/button";
export interface ShowButtonInterface {
  index: number | null;
  show: boolean;
}

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const comicsState = useSelector((store: RootState) => store.comics);
  const comicsData = [...comicsState.comics, ...comicsState.audioComics];
  const [input, setInput] = useState<string>("");
  const popularComics = comicsData.slice(0, 12);
  const [showButton, setShowButton] = useState<ShowButtonInterface>({
    index: null,
    show: false,
  });
  const [searchedComics, setSearchedComics] = useState<(AudioComic | Comic)[]>(
    []
  );
  const handleFilterComics = (value: string) => {
    const items = comicsData?.filter((item) => {
      return item.name.toLowerCase().includes(value.toLowerCase());
    });
    setSearchedComics(items);
  };

  const comicsToDisplay =
    searchedComics.length > 0 ? searchedComics : popularComics;

  return (
    <div className="container bg-[#019ab6] py-12 pb-24 space-y-6">
      <div className="bg-gray-50 flex items-center justify-between rounded-md py-1 px-3">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            handleFilterComics(e.target.value);
          }}
          className="bg-transparent w-full h-12 outline-none border-none"
          placeholder="Search by Comic Name"
        />
        <CiSearch className="text-2xl" />
      </div>
      {input && searchedComics.length == 0 && (
        <div className="gap-4">
          <span className="text-sm text-red-500">No comics found! </span>
          <span className="text-sm text-green-400">Explore other comics!</span>
        </div>
      )}
      <div className="grid w-full place-items-center grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8">
        {comicsToDisplay?.map((item, index) => {
          return (
            <motion.div
              key={v4()}
              onMouseEnter={() => {
                setShowButton({ index, show: true });
              }}
              onMouseLeave={() => {
                setShowButton({ index: null, show: false });
              }}
              className="relative flex flex-col items-center justify-center transition-all ease-in-out"
            >
              <img
                onClick={() => navigate("/audio-comic?comic=" + item.name)}
                className={`cursor-pointer ${
                  index === showButton?.index && "grayscale-[80%]"
                } w-[20rem] md:w-[25rem] md:h-[20rem] duration-700 rounded-md`}
                key={index}
                src={item.thumbnail}
              />
              {index === showButton?.index && showButton.show === true && (
                <Button
                  onClick={() => navigate("/audio-comic?comic=" + item.name)}
                  className="absolute left-0 font-semibold bottom-0 w-full bg-primary text-white hover:text-primary hover:bg-white duration-500 z-10"
                >
                  View Sample
                </Button>
              )}
            </motion.div>
          );
        })}
      </div>
      <button
        onClick={() => navigate("comics-list")}
        className="bg-primary font-medium hover:bg-white hover:text-primary transition-all duration-300 ease-in-out px-3 py-3 w-full text-center m-auto text-white"
      >
        View All
      </button>
    </div>
  );
};

export default SearchPage;
