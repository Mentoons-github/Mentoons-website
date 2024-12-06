import { getAllProducts } from "@/redux/cardProductSlice";
import { AppDispatch } from "@/redux/store";

import { PRODUT_CAROUSEL_ITEM } from "@/constant";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown, IoIosSearch } from "react-icons/io";
import { useDispatch } from "react-redux";
import { A11y, Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ComingSoonModal from "../common/ComingSoonModal";
import FilteredProduct from "./FilteredProduct";

const StoreHeroSection = () => {
  const productsRef = useRef<HTMLDivElement>(null);
  const [showDropDownMenu, setShowDropDownMenu] = useState(false);
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
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  console.log("filterCategory", filterCategory);
  console.log("searchTerm", searchTerm);

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
  const [products, setProducts] = useState([]);

  const handleFilterSelection = (category: string) => {
    console.log("category", category);
    setShowDropDownMenu((prev) => !prev);
    setFilterCategory(category);
  };
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await dispatch(
          getAllProducts({
            search: searchTerm,
            filtercategory: filterCategory === "all" ? "" : filterCategory,
          })
        );
        const data = response.payload?.data;
        if (data) {
          console.log("ThuckActionResult", data);
          setProducts(data.allProduct);
        } else {
          console.error("No data found");
        }
      } catch (error) {
        console.error("Failed to fetch all the product", error);
      }
    };

    const debounce = setTimeout(() => {
      fetchProduct();
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, filterCategory, dispatch]);

  return (
    <>
      {isModalOpen && <ComingSoonModal setIsModalOpen={setIsModalOpen} />}
      <div>
        <div className="bg-[linear-gradient(360deg,_#42A0CE_0%,_#034E73_100%)] h-full">
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
            <div className="flex items-center justify-start w-full md:w-1/2 p-4 md:p-10 mt-12 ">
              <Swiper
                // install Swiper modules
                modules={[Navigation, Pagination, A11y, Autoplay]}
                spaceBetween={10}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                loop={true} // Enable infinite looping
                navigation={false}
                className=""
                breakpoints={{
                  // Up to 767px (mobile size)
                  0: {
                    slidesPerView: 1, // Show only 1 card on mobile
                  },
                  // From to 767px (mobile size)
                  767: {
                    slidesPerView: 1,
                  },
                  1024: {
                    slidesPerView: 1,
                  },
                }}
              >
                {PRODUT_CAROUSEL_ITEM.map((item) => (
                  <SwiperSlide key={item.id}>
                    <motion.div
                      initial={{ scale: 0.6 }}
                      whileInView={{ scale: 1 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                      }}
                      className="w-full  "
                    >
                      <div className="">
                        <div className=" ">
                          <img
                            className="w-full h-full object-cover"
                            src={item.imageURL}
                            alt="Product Image"
                          />
                        </div>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
        <div
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
                <div className=" w-full flex-[0.7] rounded-full md:w-[40%] flex items-center justify-start border border-white group px-4 gap-2 ">
                  <IoIosSearch className="text-3xl font-semibold  text-white/50 group-hover:text-white focus:text-white" />
                  <input
                    type="text"
                    placeholder="Search products"
                    value={searchTerm}
                    className="outline-none border-none py-3 text-white rounded-full w-full bg-transparent placeholder:text-white/50 placeholder:font-semibold mr-4 "
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full  flex-[0.3]">
                  <div className="flex items-center justify-between border border-white px- py-[10px] rounded-full px-4 text-white/60 relative group  mt-2">
                    <h2
                      className={`group-hover:text-white font-bold whitespace-nowrap ${
                        filterCategory && "text-white"
                      }`}
                    >
                      {filterCategory
                        ? filterCategory !== "all"
                          ? filterCategory + " years"
                          : "Filter"
                        : "Filter"}
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
                        {["6-12", "13-16", "17-19", "20+", "all"].map(
                          (item) => (
                            <div
                              key={item}
                              className="p-2 px-4 rounded-full m-2 text-white bg-white/20 border-[0.5px] border-transparent hover:border-[0.5px] hover:border-white hover:bg-white/80 hover:text-black/50 transition-all duration-300"
                              onClick={() => handleFilterSelection(item)}
                            >
                              {item !== "all" ? `${item} years` : item}
                            </div>
                          )
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <section>
              <FilteredProduct filteredProduct={products} />
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoreHeroSection;
