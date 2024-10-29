import {
  AudioComic,
  Comic,
  updateCurrentHoverComicReducer,
} from "@/redux/comicSlice";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import PodcastSectionSheet from "../shared/PodcastSection/PodcastSectionSheet";
import { Button } from "../ui/button";
import { SheetClose } from "../ui/sheet";
import { workshopDetails } from "@/constant/comicsConstants";
export interface ShowButtonInterface {
  index: number | null;
  show: boolean;
}

// const Search: React.FC<{ content: string }> = ({ content }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const comicsData = useSelector((store: RootState) => store.comics.comics);
//   // const [input, setInput] = useState<string>("");
//   // const [sheetFilter, setSheetFilter] = useState<string>("Comic");
//   const popularComics = comicsData.slice(0, 12);
//   const [showButton, setShowButton] = useState<ShowButtonInterface>({
//     index: null,
//     show: false,
//   });
//   // const [searchedComics, setSearchedComics] = useState<Comic[]>([]);
//   // const handleFilterComics = (value: string) => {
//   //   const items = comicsData?.filter((item) => {
//   //     return item.name.toLowerCase().includes(value.toLowerCase());
//   //   });
//   //   setSearchedComics(items);
//   // };

//   const comicsToDisplay = popularComics;

//   useEffect(() => {
//     return () => {
//       dispatch(updateCurrentHoverComicReducer(null));
//     };
//   }, []);

//   return (
//     <>
//       <div className="py-[100px] pb-0 space-y-6 px-6">
//         {/* <div className='bg-gray-50 flex items-center justify-between rounded-md py-1 px-3'>
//           <input
//             value={input}
//             onChange={(e) => {
//               setInput(e.target.value);
//               handleFilterComics(e.target.value);
//             }}
//             className='bg-transparent w-full h-12 outline-none border-none'
//             placeholder='Search by Comic Name'
//           />
//           <CiSearch className='text-2xl' />
//         </div>
//         {input && searchedComics.length == 0 && (
//           <div className='gap-4'>
//             <span className='text-sm text-red-500'>No comics found! </span>
//             <span className='text-sm text-green-400'>
//               Explore other comics!
//             </span>
//           </div>
//         )} */}
//         {/* <div className="flex gap-2 items-center justify-center  ">
//           {SHEET_FILTER.map((item) => {
//             return (
//               <div
//                 key={item.id}
//                 className="w-full"
//                 onClick={() => setSheetFilter(item.label)}
//               >
//                 <a
//                   className={`border border-dashed rounded-xl bg-black block`}
//                   href={`#${item.label}`}
//                 >
//                   <button
//                     className={`border border-dashed  bg-[#f0ebe5] border-black px-4 py-2 bg- text-black rounded-xl hover:-translate-y-1 active:-translate-y-0 active:-translate-x-0 hover:-translate-x-1 origin-bottom-left transition-all duration-200 w-full ${
//                       sheetFilter === item.label
//                         ? item.label === "Comic"
//                           ? "bg-primary text-white"
//                           : item.label === "Podcast"
//                           ? "bg-rose-600 text-white"
//                           : item.label === "Workshop"
//                           ? "bg-green-600 text-white"
//                           : ""
//                         : ""
//                     }
//                     ${
//                       sheetFilter === item.label
//                         ? "-translate-x-1 -translate-y-1"
//                         : ""
//                     }`}
//                   >
//                     {item.label}
//                   </button>
//                 </a>
//               </div>
//             );
//           })}
//         </div> */}
//         {content=='comics' ?
//         <>
//         <div className=" bg-primary flex items-center justify-center  w-full  opacity-1 py-1">
//           <img
//             src="/assets/images/comic-title.png"
//             alt="Comic title"
//             className="w-48"
//           />
//         </div>
//         <div className="grid w-full place-items-center md:grid-cols-2 gap-6 ">
//           {comicsToDisplay?.map((item, index) => {
//             return (
//               <motion.div
//                 key={v4()}
//                 onMouseEnter={() => {
//                   setShowButton({ index, show: true });
//                   dispatch(updateCurrentHoverComicReducer(item));
//                 }}
//                 onMouseLeave={() => {
//                   setShowButton({ index: null, show: false });
//                   dispatch(updateCurrentHoverComicReducer(null));
//                 }}
//                 className="relative flex flex-col items-center justify-center transition-all ease-in-out"
//               >
//                 <SheetClose>
//                   <img
//                     onClick={() =>
//                       navigate("/mentoons-comics/audio-comics/" + item.name)
//                     }
//                     className={`cursor-pointer ${
//                       index === showButton?.index && "grayscale-[80%]"
//                     } w-full md:w-[15rem] md:h-[14rem] duration-700 `}
//                     key={index}
//                     src={item.mini_thumbnail}
//                   />
//                 </SheetClose>
//                 {index === showButton?.index && showButton.show === true && (
//                   <SheetClose>
//                     {" "}
//                     <Button
//                       onClick={() =>
//                         navigate("/mentoons-comics/audio-comics/" + item.name)
//                       }
//                       className="absolute left-0 font-semibold bottom-0 w-full bg-primary text-white hover:text-primary hover:bg-white duration-500 z-[50]"
//                     >
//                       View Sample
//                     </Button>
//                   </SheetClose>
//                 )}
//               </motion.div>
//             );
//           })}
//         </div>
//         <SheetClose asChild>
//           <button
//             onClick={() => navigate("comics-list")}
//             className="bg-primary font-medium hover:bg-white hover:text-primary transition-all duration-300 ease-in-out px-3 py-3 w-full text-center m-auto text-white rounded-xl"
//           >
//             View All
//           </button>
//         </SheetClose>
//       </> : content =='podcasts' ?
//         {/* PODCAST */}
//       <div className=" pb-0 space-y-6  px-6">
//       <div
//         className=" bg-rose-600 flex items-center justify-center my-6  py-2 "
//         id="Podcast"
//       >
//         <img src="/assets/images/podcast-logo.png" alt="" className="w-48" />
//       </div>

//       <div className="grid w-full place-items-center md:grid-cols-1 gap-6 ">
//         <PodcastSectionSheet />
//       </div>
//     </div> : <div className="grid w-full place-items-center md:grid-cols-1 gap-6">
//           {/* <PodcastSectionSheet /> */}
//           <div className="flex flex-col gap-4 rounded-lg  ">
//             {WORKSHOP.map((workshop) => {
//               return (
//                 <div className="border-4 border-white border-dashed rounded-3xl">
//                   <img
//                     src={workshop.imageURL}
//                     alt="WorkShop image"
//                     className="w-full object-cover"
//                   />
//                   <div className="p-2">
//                     {/* <button className='border w-full py-2 bg-green-600 text-base text-white font-medium rounded-2xl'>
//                       {" "}
//                       View Detailes
//                     </button> */}
//                     <SheetClose className="w-full" asChild>
//                       <div
//                         className="border border-dashed rounded-xl bg-black "
//                         onClick={() => navigate(workshop?.pageUrl)}
//                       >
//                         <button className="border border-dashed  bg-[#f0ebe5] border-black px-4 py-2 bg- text-black rounded-xl hover:-translate-y-1 active:-translate-y-0 active:-translate-x-0 hover:-translate-x-1 origin-bottom-left transition-all duration-200 w-full">
//                           View Details
//                         </button>
//                       </div>
//                     </SheetClose>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>}
//       </div>

//       <div className=" pb-0 space-y-6 px-6 ">
//         <div
//           className=" bg-green-600 flex items-center justify-center my-6 py-4"
//           id="Workshop"
//         >
//           <img
//             src="/assets/images/workshop-title.png"
//             alt=""
//             className="w-48"
//           />
//         </div>
//         {/* <SheetClose asChild>
//           <button
//             onClick={() => navigate("comics-list")}
//             className='bg-primary font-medium hover:bg-white hover:text-primary transition-all duration-300 ease-in-out px-3 py-3 w-full text-center m-auto text-white'
//           >
//             View All
//           </button>
//         </SheetClose> */}
//       </div>
//     </>
//   );
// };

const Search: React.FC<{ content: string }> = ({ content }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const comicsData = useSelector(
    (store: RootState) => store.comics.audioComics
  );
  const popularComics = comicsData.slice(0, 12);
  const [showButton, setShowButton] = useState<ShowButtonInterface>({
    index: null,
    show: false,
  });

  const comicsToDisplay = popularComics;

  useEffect(() => {
    return () => {
      dispatch(updateCurrentHoverComicReducer(null));
    };
  }, []);

  return (
    <>
      <div className="py-[100px] pb-6 space-y-6 px-6">
        {content === "comics" ? (
          <>
            <div className="bg-primary flex items-center justify-center w-full opacity-1 py-1">
              <img
                src="/assets/images/comic-title.png"
                alt="Comic title"
                className="w-48"
              />
            </div>
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
                        onClick={() =>
                          navigate("/mentoons-comics/audio-comics/" + item.name)
                        }
                        className={`cursor-pointer ${
                          index === showButton?.index && "grayscale-[80%]"
                        } w-full md:w-[15rem] md:h-[14rem] duration-700`}
                        key={index}
                        src={item.mini_thumbnail}
                      />
                    </SheetClose>
                    {index === showButton?.index &&
                      showButton.show === true && (
                        <SheetClose>
                          <Button
                            onClick={() =>
                              navigate(
                                "/mentoons-comics/audio-comics/" + item.name
                              )
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
                onClick={() => navigate("/mentoons-comics")}
                className="bg-primary font-medium hover:bg-white hover:text-primary transition-all duration-300 ease-in-out px-3 py-3 w-full text-center m-auto text-white rounded-xl"
              >
                View All
              </button>
            </SheetClose>
          </>
        ) : content === "podcasts" ? (
          <div className="pb-0 space-y-6 px-6">
            <div
              className="bg-rose-600 flex items-center justify-center my-6 py-2"
              id="Podcast"
            >
              <img
                src="/assets/images/podcast-logo.png"
                alt="Podcast logo"
                className="w-48"
              />
            </div>
            <div className="grid w-full place-items-center md:grid-cols-1 gap-6">
              <PodcastSectionSheet />
            </div>
          </div>
        ) : (
          <div className="grid w-full place-items-center md:grid-cols-1 gap-6">
            <div className="flex flex-col gap-4 rounded-lg">
              {workshopDetails.map((workshop) => {
                return (
                  <div
                    key={new Date().toString()}
                    className="border-4 border-white border-dashed rounded-3xl"
                  >
                    <img
                      src={workshop.img}
                      alt="Workshop image"
                      className="w-full object-cover"
                    />
                    <div className="p-2">
                      <SheetClose className="w-full" asChild>
                        <div
                          className="border border-dashed rounded-xl bg-black"
                          onClick={() => navigate(workshop.pageUrl)}
                        >
                          <button className="border border-dashed bg-[#f0ebe5] border-black px-4 py-2 text-black rounded-xl hover:-translate-y-1 active:-translate-y-0 active:-translate-x-0 hover:-translate-x-1 origin-bottom-left transition-all duration-200 w-full">
                            View Details
                          </button>
                        </div>
                      </SheetClose>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {/* {content !== "workshops" && (
        <div className="pb-0 space-y-6 px-6">
          <div
            className="bg-green-600 flex items-center justify-center my-6 py-4"
            id="Workshop"
          >
            <img
              src="/assets/images/workshop-title.png"
              alt="Workshop title"
              className="w-48"
            />
          </div>
        </div>
      )} */}
    </>
  );
};

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const audioComics = useSelector(
    (store: RootState) => store.comics.audioComics
  );
  const comics = useSelector((store: RootState) => store.comics.comics);
  const comicsData = [...audioComics, ...comics];
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

export default Search;
