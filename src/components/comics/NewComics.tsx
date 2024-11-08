import React from "react";
import Wordbreak from "./Wordbreak";
import { FaRegEye } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { useSelector } from "react-redux";
// import { addToCartReducer, addToWishlistReducer } from "@/redux/comicSlice";
import { v4 as uuidv4 } from "uuid";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { RootState } from "@/redux/store";
import { useState } from "react";
import ComingSoonModal from "../common/ComingSoonModal";
const NewComics: React.FC = () => {
  // const dispatch = useDispatch();
  const comicData = useSelector((store: RootState) => store.comics.comics);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleComingSoon = () => {
    setIsModalOpen(true);
  };

  // const addToWishlist = (image: string, type: string) => {
  //   dispatch(addToWishlistReducer({ image, type }));
  // };

  // const addToCart = (image: string) => {
  //   const item = comicData?.find((comic) => {
  //     return comic.thumbnail == image;
  //   });
  //   dispatch(addToCartReducer(item));
  // };

  return (
    <>
      {isModalOpen && <ComingSoonModal setIsModalOpen={setIsModalOpen} />}
      <div className="bg-primary text-white pt-20 pb-14 lg:pb-0">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0.5 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-[#d71515] text-3xl lineBefore"
            >
              New Comics
            </motion.div>
            <motion.div
              initial={{ opacity: 0.5 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-4xl lg:text-7xl w-full font-extrabold leading-[1.10]"
            >
              Enjoy Newest <Wordbreak /> Comic Books.
            </motion.div>
          </div>
          <div className="flex flex-wrap flex-row lg:space-y-8 items-center justify-between gap-6">
            {comicData?.map((item, idx) => {
              return (
                <motion.div
                  initial={{ opacity: 0.2 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  key={uuidv4()}
                  className={`bg-white m-auto shadow-sm w-[20rem] md:w-[45%] lg:w-[30%] relative ${
                    idx != 1 ? "lg:top-[5rem]" : "lg:top-[1.5rem]"
                  } rounded-xl group px-4 py-6 space-y-3`}
                >
                  <div className="relative">
                    <img
                      className="group-hover:grayscale transition-all duration-500 ease-in-out h-[20rem] md:h-[30rem] w-full rounded-2xl"
                      src={item?.mini_thumbnail}
                      alt="new comics"
                    />
                    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div
                              // onClick={() =>
                                
                              //   addToWishlist(item.thumbnail, item.type)
                              // }
                              onClick={handleComingSoon}
                              className=" hidden group-hover:block cursor-pointer p-4 bg-primary rounded-full"
                            >
                              <FaHeart className="text-2xl text-white active:text-red-500" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#59B2DC] text-white">
                            <p className="font-semibold">Add to Wishlist</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-black">
                    <div className="space-y-1">
                      <h2 className="font-bold text-2xl italic tracking-wide">
                        {item?.name}
                      </h2>
                      <p className="flex items-center gap-2 text-medium text-gray-500 text-xl">
                        <FaRegEye />
                        250.6K Views
                      </p>
                    </div>
                    <div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div
                              // onClick={() => addToCart(item.thumbnail)}
                              onClick={handleComingSoon}
                              className="border-2 cursor-pointer hover:rotate-[360deg] transition-all duration-1000 ease-in-out bg-primary active:scale-95 p-3 rounded-full"
                            >
                              <FaCartShopping className="text-2xl text-white transition-all duration-300 ease-in-out" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#59B2DC] text-white">
                            <p className="font-semibold">Add to library</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewComics;
