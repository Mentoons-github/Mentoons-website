import {
  AudioComic,
  Comic,
  updateCurrentHoverComicReducer,
} from "@/redux/comicSlice";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import PodcastSectionSheet from "../shared/PodcastSection/PodcastSectionSheet";
import { Button } from "../ui/button";
import { SheetClose } from "../ui/sheet";
import SearchBar from "../common/SearchBar";
import { placeholders } from "@/constant/websiteConstants";
import { ShowButtonInterface } from "../../pages/SearchPage";

const SearchSidebar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const handleFilterComics = () => {
    const items = comicsData?.filter((item) => {
      return item.name.toLowerCase().includes(input.toLowerCase());
    });
    setSearchedComics(items);
  };

  const comicsToDisplay =
    searchedComics.length > 0 ? searchedComics : popularComics;

  useEffect(() => {
    return () => {
      dispatch(updateCurrentHoverComicReducer(null));
    };
  }, []);

  useEffect(() => {
    handleFilterComics();
  }, [input]);

  return (
    <>
      <div className="py-10 pb-0 space-y-6">
        <SearchBar
          input={input}
          setInput={setInput}
          placeholders={placeholders}
        />
        {input && searchedComics.length == 0 && (
          <div className="gap-4">
            <span className="text-sm text-red-500">No comics found! </span>
            <span className="text-sm text-green-400">
              Explore other comics!
            </span>
          </div>
        )}
        <div className="grid w-full place-items-center md:grid-cols-2 gap-6">
          {comicsToDisplay?.map((item, index) => {
            return (
              <motion.div
                key={v4()}
                onMouseEnter={() => {
                  setShowButton({ index, show: true });
                  dispatch(updateCurrentHoverComicReducer(item));
                }}
                onMouseLeave={() => {
                  setShowButton({ index: null, show: false });
                  dispatch(updateCurrentHoverComicReducer(null));
                }}
                className="relative flex flex-col items-center justify-center transition-all ease-in-out"
              >
                <SheetClose>
                  <img
                    onClick={() => navigate("/audio-comic?comic=" + item.name)}
                    className={`cursor-pointer ${
                      index === showButton?.index && "grayscale-[80%]"
                    } w-full md:w-[15rem] md:h-[14rem] duration-700`}
                    key={index}
                    src={item.mini_thumbnail}
                  />
                </SheetClose>
                {index === showButton?.index && showButton.show === true && (
                  <SheetClose>
                    {" "}
                    <Button
                      onClick={() =>
                        navigate("/audio-comic?comic=" + item.name)
                      }
                      className="absolute left-0 font-semibold bottom-0 w-full bg-primary text-white hover:text-primary hover:bg-white duration-500 z-[50]"
                    >
                      View Sample
                    </Button>
                  </SheetClose>
                )}
              </motion.div>
            );
          })}
        </div>
        <SheetClose asChild>
          <button
            onClick={() => navigate("comics-list")}
            className="bg-primary font-medium hover:bg-white hover:text-primary transition-all duration-300 ease-in-out px-3 py-3 w-full text-center m-auto text-white"
          >
            View All
          </button>
        </SheetClose>
      </div>
      <div className="py-10 pb-0 space-y-6">
        {/* <div className='bg-gray-50 flex items-center justify-between rounded-md py-1 px-3'>
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                handleFilterComics(e.target.value);
              }}
              className='bg-transparent w-full h-12 outline-none border-none'
              placeholder='Search by Comic Name'
            />
            <CiSearch className='text-2xl' />
          </div>
          {input && searchedComics.length == 0 && (
            <div className='gap-4'>
              <span className='text-sm text-red-500'>No comics found! </span>
              <span className='text-sm text-green-400'>
                Explore other comics!
              </span>
            </div>
          )} */}
        <h1 className="text-2xl font-bold text-primary text-center">
          Mentoon's Podcast
        </h1>
        <div className="grid w-full place-items-center md:grid-cols-1 gap-6">
          {/* {comicsToDisplay?.map((item, index) => {
              return (
                <motion.div
                  key={v4()}
                  onMouseEnter={() => {
                    setShowButton({ index, show: true });
                    dispatch(updateCurrentHoverComicReducer(item));
                  }}
                  onMouseLeave={() => {
                    setShowButton({ index: null, show: false });
                    dispatch(updateCurrentHoverComicReducer(null));
                  }}
                  className='relative flex flex-col items-center justify-center transition-all ease-in-out'
                >
                  <SheetClose>
                    <img
                      onClick={() => navigate("/audio-comic?comic=" + item.name)}
                      className={`cursor-pointer ${
                        index === showButton?.index && "grayscale-[80%]"
                      } w-full md:w-[15rem] md:h-[14rem] duration-700`}
                      key={index}
                      src={item.mini_thumbnail}
                    />
                  </SheetClose>
                  {index === showButton?.index && showButton.show === true && (
                    <SheetClose>
                      {" "}
                      <Button
                        onClick={() =>
                          navigate("/audio-comic?comic=" + item.name)
                        }
                        className='absolute left-0 font-semibold bottom-0 w-full bg-primary text-white hover:text-primary hover:bg-white duration-500 z-[50]'
                      >
                        View Sample
                      </Button>
                    </SheetClose>
                  )}
                </motion.div>
              );
            })} */}
          <PodcastSectionSheet />
        </div>
        {/* <SheetClose asChild>
            <button
              onClick={() => navigate("comics-list")}
              className='bg-primary font-medium hover:bg-white hover:text-primary transition-all duration-300 ease-in-out px-3 py-3 w-full text-center m-auto text-white'
            >
              View All
            </button>
          </SheetClose> */}
      </div>
    </>
  );
};

export default SearchSidebar;
