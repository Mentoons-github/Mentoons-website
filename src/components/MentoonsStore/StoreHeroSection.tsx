// import { useRef, useState } from 'react'
// import { PRODUCT_DETAILS } from "@/constant";
// import { motion } from "framer-motion";
import { useState } from "react";
// import { IoIosArrowDown, IoIosSearch } from "react-icons/io";
import ComingSoonModal from "../common/ComingSoonModal";
// import FilteredProduct from "./FilteredProduct";
// import ProductCategory from "./ProductCategory";

const StoreHeroSection = () => {
  // const productsRef = useRef<HTMLDivElement>(null);
  // const [showDropDownMenu, setShowDropDownMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const scrollToProducts = () => {
  //   if (productsRef.current) {
  //     const yOffset = -50;
  //     const element = productsRef.current;
  //     const y =
  //       element.getBoundingClientRect().top + window.pageYOffset + yOffset;
  //     window.scrollTo({ top: y, behavior: "smooth" });
  //   }
  // };

  // const [searchTerm, setSearchTerm] = useState("");
  // const [filterCategory, setFilterCategory] = useState("");

  // const handleFilterAndSearch = () => {
  //   const searchTermLower = searchTerm.trim().toLowerCase();
  //   const ageMatch = searchTermLower.match(/\d+/);

  //   let ageFilter = ageMatch ? parseInt(ageMatch[0], 10) : null;
  //   if (ageFilter && ageFilter >= 20) {
  //     ageFilter = 20;
  //   }

  //   if (filterCategory && searchTermLower) {
  //     return PRODUCT_DETAILS.filter(
  //       (product) =>
  //         product.ageFilter === filterCategory ||
  //         product.productTitle.toLowerCase().includes(searchTermLower) ||
  //         (ageFilter && product.age.includes(ageFilter))
  //     );
  //   } else if (filterCategory) {
  //     return PRODUCT_DETAILS.filter(
  //       (product) => product.ageFilter === filterCategory
  //     );
  //   } else if (searchTermLower) {
  //     if (ageFilter !== null && ageFilter >= 20) {
  //       return PRODUCT_DETAILS.filter((product) => product.age.includes(20));
  //     } else {
  //       return PRODUCT_DETAILS.filter(
  //         (product) =>
  //           product.productTitle.toLowerCase().includes(searchTermLower) ||
  //           (ageFilter && product.age.includes(ageFilter))
  //       );
  //     }
  //   } else {
  //     return PRODUCT_DETAILS;
  //   }
  // };

  // const filteredAndSearchedProducts = handleFilterAndSearch();

  // const handleFilterSelection = (category: string) => {
  //   setShowDropDownMenu((prev) => !prev);
  //   setFilterCategory(category);
  // };

  return (
    <>
      {isModalOpen && <ComingSoonModal setIsModalOpen={setIsModalOpen} />}
      <div>
        <div className="bg-[linear-gradient(360deg,_#42A0CE_0%,_#034E73_100%)] ">
          <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-10">
            <div className="flex flex-col items-center md:items-start space-y-6 md:space-y-10 w-full md:w-1/2 text-center md:text-left pl-0 lg:pl-16">
              <h1 className="text-white font-bold text-4xl sm:text-6xl md:text-[82px]">
                Mentoons Store
              </h1>
              <p className="text-white text-lg lg:leading-normal sm:text-xl md:text-[30px]">
                Everyday Adventures at the Comic
                <br /> Shop: Where real kids share epic stories,
                <br /> funny mishaps, and life lessons. Step into
                <br /> the story with us.
              </p>
              <button
                // onClick={scrollToProducts}
                onClick={() => setIsModalOpen(true)}
                className="bg-white text-black px-7 py-0 rounded-md shadow-[3px_3px_5.2px_0px_#1A6B94C9,_inset_-3px_-3px_3px_0px_#5099BE9C]"
              >
                <div className="flex flex-row items-center justify-around">
                  <figure className="h-[61px] w-[66px]">
                    <img
                      src="/assets/images/shopbag.png"
                      alt="shopping icon"
                      className="h-full w-full object-contain"
                    />
                  </figure>
                  <h3>Shop Now</h3>
                </div>
              </button>
            </div>
            <div className="flex items-center justify-center w-full md:w-1/2 p-4 md:p-10">
              <img
                src="/assets/images/store-hero-image.png"
                alt="Mentoons Store"
                className="w-[80%] h-[60%] object-contain"
              />
            </div>
          </div>
        </div>
        {/* <div
          className="bg-[linear-gradient(358.67deg,_#CCFF96_36.53%,_#419ECC_100.68%)] min-h-screen"
          ref={productsRef}
        >
          <div className="w-[80%]  mx-auto ">
            
            <div className="pb-20">
              <h2 className="text-center text-white/70 text-4xl font-bold ">
                Mentoons Product
              </h2>
              <div className="relative ">
                <h1 className="text-center font-bold text-8xl  translate-y-1 translate-x-1 text-white/60">
                  Pick Your Advanture
                </h1>
                <h1 className=" absolute top-0 left-0 right-0 text-pink-500 text-center font-bold text-8xl">
                  Pick Your Advanture
                </h1>
              </div>

              <div className=" w-full md:w-[50%] mx-auto md:flex  items-center justify-center gap-6 mt-6 ">
                <div className=" w-full flex-[0.7] rounded-full md:w-[40%] flex items-center justify-between border border-white px-4 ">
                  <input
                    type="text"
                    placeholder="Search products"
                    value={searchTerm}
                    className="outline-none border-none py-3 text-white rounded-full w-full bg-transparent placeholder:text-white/50 placeholder:font-semibold mr-4 "
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <IoIosSearch className="text-3xl text-white" />
                </div>
                <div className="w-full  flex-[0.3]">
                  <div className="flex items-center justify-between border border-white px- py-[10px] rounded-full px-4 text-white/60 relative group  mt-2">
                    <h2
                      className={`group-hover:text-white font-bold whitespace-nowrap ${
                        filterCategory && "text-white"
                      }`}
                    >
                      {filterCategory ? filterCategory : "Filter"}
                    </h2>
                    <IoIosArrowDown
                      className="text-xl group-hover:scale-110 group-hover:text-white transition-all duration-300"
                      onClick={() => setShowDropDownMenu(!showDropDownMenu)}
                    />
                    {showDropDownMenu && (
                      <motion.div
                        initial={{ opacity: 0, translateY: -10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 0.3 }}
                        exit={{ opacity: 0, translateY: 20 }}
                        className="absolute border-[0.5px] top-12 w-full left-0 rounded-[24px] z-10 bg-white/20 backdrop-blur-lg"
                      >
                        {[
                          "Age (6-12)",
                          "Age (13-17)",
                          "Age (18-19)",
                          "Age (20+)",
                          "Show all",
                        ].map((item) => (
                          <div
                            key={item}
                            className=" p-2 px-4 rounded-full m-2 text-white bg-white/20 border-[0.5px] border-transparent hover:border-[0.5px] hover:border-white hover:bg-white/80 hover:text-black/50  transition-all duration-300 "
                            onClick={() => handleFilterSelection(item)}
                          >
                            {item}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          
            <section>
              {searchTerm.trim() ||
              (filterCategory !== "Show all" && filterCategory !== "") ? (
                <FilteredProduct
                  filteredProduct={filteredAndSearchedProducts}
                />
              ) : (
                <ProductCategory />
              )}
            </section>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default StoreHeroSection;
