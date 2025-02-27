import FAQCard from "@/components/shared/FAQSection/FAQCard";
import { WORKSHOP_FAQ } from "@/constant";
import { fetchProducts } from "@/redux/productSlice";
import { AppDispatch } from "@/redux/store";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { BiSolidMessage } from "react-icons/bi";
import { IoIosCart } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { WORKSHOPS } from "../constant";
// interface IPRODUCT {
//   id: string;
//   title: string;
//   description: string;

//   imageUrl: string;
//   price: number;
//   accentColor: string;
// }
// const Store = () => {
//   const [isAtStart, setIsAtStart] = useState(true);
//   const [isAtEnd, setIsAtEnd] = useState(false);
//   const carouselRef = useRef<HTMLDivElement>(null);
//   const navigate = useNavigate();

//   const handleScroll = () => {
//     const carousel = carouselRef.current;
//     if (carousel) {
//       setIsAtStart(carousel.scrollLeft === 0);
//       setIsAtEnd(
//         carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1
//       );
//     }
//   };
//   // useEffect(() => {
//   //   const scrollCarousel = () => {
//   //     const carousel = carouselRef.current;
//   //     if (carousel) {
//   //       carousel.scrollBy({
//   //         left: 300, // Adjust scroll amount as needed
//   //         behavior: "smooth",
//   //       });
//   //     }
//   //   };
//   //   const intervalId = setInterval(scrollCarousel, 3000); // Auto scroll every 3 seconds
//   //   return () => clearInterval(intervalId); // Cleanup on unmount
//   // }, []);

//   useEffect(() => {
//     const carousel = carouselRef.current;
//     if (carousel) {
//       carousel.addEventListener("scroll", handleScroll);
//       return () => carousel.removeEventListener("scroll", handleScroll);
//     }
//   }, []);
//   return (
//     <div className="">
//       <div className="w-[90%] mx-auto my-20">
//         <div className="overflow-hidden w-full">
//           <div
//             className="flex overflow-x-auto gap-4 snap-x snap-mandatory"
//             ref={carouselRef}
//           >
//             {PRODUCT_DATA.map((product) => (
//               <div key={product.id} className="flex-none w-full snap-center">
//                 <ProductCarouselCard product={product} />
//               </div>
//             ))}
//           </div>
//         </div>
//         {/* Category section */}
//         <div className="flex flex-col justify-between mt-10">
//           <h1 className="text-2xl font-semibold text-center text-primary/80">
//             Find Products For All Age Categories
//           </h1>
//           <div className="grid grid-cols-2 gap-4 mt-4">
//             <button className="py-4 text-xl font-semibold border border-neutral-800 rounded-full bg-[#FCE83E]">
//               6-12
//             </button>
//             <button className="py-4 text-xl font-semibold border border-neutral-800 rounded-full bg-[#EF4444]">
//               13-16
//             </button>
//           </div>
//           <div className="grid grid-cols-2 gap-4 mt-4">
//             <button className="py-4 text-xl font-semibold border border-neutral-800 rounded-full bg-[#4E90FF]">
//               17-19
//             </button>
//             <button className="py-4 text-xl font-semibold border border-neutral-800 rounded-full bg-[#34A853]">
//               20+
//             </button>
//           </div>
//         </div>

// {/* Trending Product Card */}
// <div className="relative my-12">
//   <h3 className="pb-6 text-4xl font-semibold">Trending Products</h3>
//   <div
//     className="flex overflow-x-auto gap-8 scroll-smooth"
//     ref={carouselRef}
//   >
//     {PRODUCT_DATA.map((product) => (
//       <div
//         className="flex flex-col h-[500px] cursor-pointer "
//         key={product.id}
//         onClick={() =>
//           navigate(
//             `/mentoons-store/${product.title.toLowerCase()}/${
//               product.id
//             }`
//           )
//         }
//       >
//         <div
//           style={{
//             backgroundColor: `${product.accentColor}40`,
//           }}
//           className=""
//         >
//           <img
//             src={product.imageUrl}
//             alt="comic 1"
//             className="object-cover  rounded-lg w-96 h-[300px] "
//           />
//         </div>
//         <h3 className="pt-4 text-xl font-medium">{product.title}</h3>
//         <p className="text-gray-500 w-[30ch]">{product.description}</p>
//         <button
//           className="px-6 py-2 mt-auto w-full font-semibold text-white bg-primary"
//           // style={{ backgroundColor: `${product.accentColor}` }}
//         >
//           Add to Cart
//         </button>
//       </div>
//     ))}
//   </div>
//   {/* Navigation buttons */}
//   <button
//     onClick={() => {
//       const carousel = carouselRef.current;
//       if (carousel) {
//         carousel.scrollBy({ left: -300, behavior: "smooth" });
//       }
//     }}
//     className="absolute left-0 top-1/2 p-2 rounded-full shadow-lg transition-colors -translate-y-1/2 bg-white/80 hover:bg-white"
//     style={{ display: isAtStart ? "none" : "block" }}
//   >
//     <IoIosArrowBack className="text-2xl" />
//   </button>
//   <button
//     onClick={() => {
//       const carousel = carouselRef.current;
//       if (carousel) {
//         carousel.scrollBy({ left: 300, behavior: "smooth" });
//       }
//     }}
//     className="absolute right-0 top-1/2 p-2 rounded-full shadow-lg transition-colors -translate-y-1/2 bg-white/80 hover:bg-white"
//     style={{ display: isAtEnd ? "none" : "block" }}
//   >
//     <IoIosArrowForward className="text-2xl" />
//   </button>
// </div>

//         {/* Normal Product card */}

//         <div>
//           <h3 className="pb-6 text-4xl font-semibold">
//             Browse More Products here
//           </h3>
//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {PRODUCT_DATA.map((product) => (
//               <div
//                 className="flex flex-col h-[500px] cursor-pointer"
//                 key={product.id}
//                 onClick={() =>
//                   navigate(
//                     `/mentoons-store/${product.title.toLowerCase()}/${
//                       product.id
//                     }`
//                   )
//                 }
//               >
//                 <div
//                   style={{
//                     backgroundColor: `${product.accentColor}40`,
//                   }}
//                   className="h-[300px] w-full"
//                 >
//                   <img
//                     src={product.imageUrl}
//                     alt="comic 1"
//                     className="object-cover w-full h-full rounded-lg border"
//                   />
//                 </div>
//                 <h3 className="pt-4 text-xl font-medium">{product.title}</h3>
//                 <p className="text-gray-500">{product.description}</p>
//                 <button
//                   className="px-6 py-2 mt-auto w-full font-semibold text-white bg-primary"
//                   // style={{ backgroundColor: `${product.accentColor}` }}
//                 >
//                   Add to Cart
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//       <Store2 />
//     </div>
//   );
// };

// export default Store;

// const ProductCarouselCard = ({ product }: { product: IPRODUCT }) => {
//   const navigate = useNavigate();

//   return (
//     <div
//       className="flex h-[240px] sm:h-[500px] md:h-[600px] p-4 sm:p-8 md:p-12 rounded-2xl"
//       style={{ backgroundColor: product.accentColor }}
//     >
//       <div className="flex flex-col flex-1 pb-3 pl-1">
//         <h1 className="pb-2 text-3xl font-bold sm:text-4xl md:text-6xl lg:text-8xl leading-wider line-clamp-2">
//           {product.title}
//         </h1>
//         <p className="pb-4 text-sm sm:text-lg leading-tight w-[90%] line-clamp-3">
//           {product.description}
//         </p>
//         <button
//           className="px-6 py-2 mt-2 font-semibold bg-white rounded-full shadow-xl tex1t-lg text-primary w-fit"
//           onClick={() =>
//             navigate(`/mentoons-store/${product.title.toLowerCase()}`)
//           }
//         >
//           Shop Now
//         </button>
//       </div>
//       <div className="flex flex-1 justify-center items-center w-full">
//         <img
//           src={product.imageUrl}
//           alt=""
//           className="object-contain max-h-full"
//         />
//       </div>
//     </div>
//   );
// };
import { useSelector } from "react-redux";
import { setFilter } from "../redux/productSlice";
import { RootState } from "../redux/store";

const Store = () => {
  const [selecteCategory, setSelecteCategory] = useState("6-12");
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const [cardType, setCardType] = useState("Conversation Starter Cards");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const handleCardType = (type: string) => {
    setCardType(type);
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  // const handleClick = () => {
  //   setIsExpanded(!isExpanded);
  // };
  const {
    items: products,
    loading,
    error,
    total,
    page: currentPage,
    search,
    filter,
  } = useSelector((state: RootState) => state.products);

  console.log("Product", products);
  console.log("total", total);
  console.log("page", currentPage);
  console.log("search", search);
  console.log("filter", filter);

  const handleSelectedCategory = (category: string) => {
    setSelecteCategory(category);

    dispatch(setFilter({ ageCategory: category }));
  };
  useEffect(() => {
    const fetchMentoonsCard = async () => {
      try {
        dispatch(
          setFilter({ type: "mentoons cards", ageCategory: selecteCategory })
        );
        const cards = await dispatch(fetchProducts() as any);
        console.log(cards.payload);
        console.log(cards.payload.itmes);
      } catch (error: unknown) {
        console.error(error);
      }
    };
    fetchMentoonsCard();
  }, [dispatch, selecteCategory]);

  if (loading) {
    return (
      <div className="animate-pulse">
        {/* Hero Skeleton */}
        <div className="relative bg-gray-200 md:min-h-[600px]">
          <div className="flex md:min-h-[600px] relative flex-col gap-4 md:gap-6 justify-end items-center py-6 md:py-10">
            <div className="h-16 bg-gray-300 rounded w-3/4 mb-8"></div>
            <div className="flex flex-col md:flex-row gap-3 w-full px-4">
              <div className="h-10 bg-gray-300 rounded-full w-full md:w-32 mb-2"></div>
              <div className="h-10 bg-gray-300 rounded-full w-full md:w-32 mb-2"></div>
              <div className="h-10 bg-gray-300 rounded-full w-full md:w-32 mb-2"></div>
              <div className="h-10 bg-gray-300 rounded-full w-full md:w-32 mb-2"></div>
              <div className="h-10 bg-gray-300 rounded-full w-full md:w-32"></div>
            </div>
          </div>
        </div>

        {/* Challenges Section Skeleton */}
        <div className="flex flex-col p-12 py-16">
          <div className="h-10 bg-gray-300 rounded w-1/2 mx-auto mb-16"></div>
          <div className="flex flex-col gap-4 items-center md:flex-row md:justify-around">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex flex-col gap-6 items-center">
                <div className="w-72 h-72 bg-gray-300 rounded-xl"></div>
                <div className="h-8 bg-gray-300 rounded w-40"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Products Section Skeleton */}
        <div className="pb-16">
          <div className="flex gap-4 items-start p-4 md:items-center">
            <div className="h-8 bg-gray-300 rounded w-64"></div>
            <div className="h-8 bg-gray-300 rounded-full w-32"></div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-around items-center p-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex flex-col w-full md:w-96 h-[500px]"
              >
                <div className="bg-gray-300 rounded-lg h-[300px] w-full"></div>
                <div className="flex justify-between items-center pt-4">
                  <div className="h-6 bg-gray-300 rounded w-40"></div>
                  <div className="h-6 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-full mt-3"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mt-2"></div>
                <div className="flex gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      className="w-8 h-8 bg-gray-300 rounded-full"
                    ></div>
                  ))}
                </div>
                <div className="h-10 bg-gray-300 rounded w-full mt-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="/assets/error-icon.png"
            alt="Error"
            className="w-32 h-32 mb-6 mx-auto opacity-80"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://img.icons8.com/clouds/100/000000/error.png";
            }}
          />
        </motion.div>

        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Oops! Something went wrong
        </motion.h2>

        <motion.p
          className="text-lg text-gray-600 mb-8 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          We couldn't load the products. Error: {error}
        </motion.p>

        <motion.button
          onClick={() => navigate("/")}
          className="px-8 py-3 font-semibold text-white rounded-lg bg-primary hover:bg-primary/90 transition-all duration-200 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Home
        </motion.button>
      </div>
    );
  }

  return (
    <div>
      <div
        className="relative bg-cover bg-center md:min-h-[600px]"
        style={{
          backgroundImage:
            "url('/assets/productv2/mentoon-store-hero-banner.png')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t via-transparent from-neutral-800" />
        <div className="flex md:min-h-[600px] relative flex-col gap-4 md:gap-6 justify-end items-center py-6 md:py-10">
          <motion.h1
            className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold text-center px-4 mb-4 text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: 1,
              y: 0,
              textShadow: "0px 2px 4px rgba(0,0,0,0.2)",
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            whileInView={{
              scale: [1, 1.1, 1],
              transition: {
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
          >
            Mentoons Store
          </motion.h1>
          <div className="flex flex-col md:flex-row gap-3 md:gap-6 justify-center items-center text-lg md:text-xl lg:text-2xl font-semibold w-full px-4">
            <button
              className={`flex items-center justify-start text-yellow-500 px-3 gap-2 w-full md:w-32 py-[7px] rounded-full bg-yellow-100 border border-yellow-400 hover:ring-4 hover:ring-yellow-300 transition-all duration-200 mb-2 md:mb-0 ${
                selecteCategory === "6-12" && "ring-4 ring-yellow-400 "
              }`}
              onClick={() => handleSelectedCategory("6-12")}
            >
              <span className="w-4 md:w-5 h-4 md:h-5 bg-yellow-500 rounded-full" />
              6-12
            </button>
            <button
              className={`flex items-center justify-start gap-2 text-rose-600 w-full md:w-32 px-3 py-[7px] rounded-full bg-red-200 border border-red-500 hover:ring-4 hover:ring-red-500 transition-all duration-200 mb-2 md:mb-0 ${
                selecteCategory === "13-19" && "ring-4 ring-red-500 "
              }`}
              onClick={() => handleSelectedCategory("13-16")}
            >
              <span className="w-4 md:w-5 h-4 md:h-5 bg-rose-500 rounded-full" />
              13-16
            </button>
            <button
              className={`flex items-center justify-start gap-2 text-purple-600 w-full md:w-32 px-3 py-[7px] rounded-full bg-purple-200 border border-purple-500 hover:ring-4 hover:ring-purple-500 transition-all duration-200 mb-2 md:mb-0 ${
                selecteCategory === "17-19" && "ring-4 ring-purple-500 "
              }`}
              onClick={() => handleSelectedCategory("17-19")}
            >
              <span className="w-4 md:w-5 h-4 md:h-5 bg-purple-500 rounded-full" />
              17-19
            </button>

            <button
              className={`flex items-center justify-start gap-2 text-blue-500 w-full md:w-32 px-3 py-[7px] rounded-full bg-blue-200 border border-blue-500 hover:ring-4 hover:ring-blue-500 transition-all duration-200 mb-2 md:mb-0 ${
                selecteCategory === "20+" && "ring-4 ring-blue-500 "
              }`}
              onClick={() => handleSelectedCategory("20+")}
            >
              <span className="w-4 md:w-5 h-4 md:h-5 bg-blue-500 rounded-full" />
              20+
            </button>
            <button
              className={`flex items-center justify-start gap-2 text-green-500 w-full md:w-32 px-3 py-[7px] rounded-full bg-green-200 border border-green-500 hover:ring-4 hover:ring-green-500 transition-all duration-200 ${
                selecteCategory === "parent" && "ring-4 ring-green-500 "
              }`}
              onClick={() => handleSelectedCategory("parents")}
            >
              <span className="w-4 md:w-5 h-4 md:h-5 bg-green-500 rounded-full" />
              Parent
            </button>
          </div>
        </div>
      </div>

      {/* Challenges faced by Parents */}
      <div className="flex flex-col p-12 py-16">
        <h2 className="pb-16 text-4xl font-semibold text-center">
          Challenges faced by{" "}
          {selecteCategory === "6-12"
            ? "Children"
            : selecteCategory === "13-16"
            ? "Teenagers"
            : selecteCategory === "17-19"
            ? "Young Adults"
            : selecteCategory === "20+"
            ? "Adults"
            : "Parents"}
        </h2>
        <div className="flex flex-col gap-4 items-center md:flex-row md:justify-around">
          {((products[0]?.details as any)?.addressedIssues || []).map(
            (
              issue: { id: string | number; title: string; imageUrl: string },
              index: number
            ) => (
              <div
                key={`${issue.id}_${index}`}
                className="flex flex-col gap-12 justify-center items-center rounded-xl transition-all duration-200 hover:scale-110"
              >
                <img
                  src={issue.imageUrl}
                  alt={issue.title}
                  className="object-cover w-72"
                />
                <p className="text-2xl font-bold text-center whitespace-nowrap">
                  {issue.title.toLocaleUpperCase()}
                </p>
              </div>
            )
          )}
        </div>
      </div>
      <div className="flex flex-col items-center pb-12 mx-auto bg-amber-50">
        <button
          className="px-4 py-2 mt-10 mb-4 font-semibold text-black bg-yellow-500 rounded-full transition-all duration-200 hover:bg-yellow-600"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? "Collapse All" : "Expand All"}
        </button>

        <div className="flex gap-8 px-1 w-full flex-col md:flex-row md:px-24">
          {products
            .filter((product) => {
              // Extract card type from product title
              const matchCardType = product.title.includes(cardType);
              return matchCardType;
            })
            .map((product) => {
              interface ProductDetails {
                cardType:
                  | "conversation starter cards"
                  | "story re-teller cards"
                  | "silent stories"
                  | "conversation story cards"; // Types of self-help cards
                accentColor?: string; // Color theme for the card
                addressedIssues: {
                  title: string;
                  description: string;
                  issueIllustrationUrl: string;
                }[];
                productDescription: {
                  label: string;
                  descriptionList: { _id: string; description: string }[];
                }[];
              }
              return (
                <React.Fragment key={product._id}>
                  {(product.details as ProductDetails).productDescription.map(
                    (description) => (
                      <div
                        key={description.label}
                        className={`overflow-hidden transition-all duration-300 border-2 cursor-pointer hover:border-[var(--hover-border-color)] w-[90%] mx-auto ${
                          isExpanded ? "" : "border-neutral-200"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full p-4 text-black bg-[#FABB05]">
                          <span className="text-xl font-semibold transition-colors duration-300">
                            {description.label}
                          </span>
                        </div>
                        <div
                          className={`grid transition-all duration-300 ease-in-out ${
                            isExpanded
                              ? "opacity-100 grid-rows-[1fr]"
                              : "opacity-0 grid-rows-[0fr]"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="p-4 pt-0 text-neutral-600">
                              <ul className="flex flex-col gap-4 p-2 md:p-12 pt-4">
                                {description?.descriptionList.map(
                                  (item, index) => (
                                    <li
                                      key={item._id}
                                      className="flex gap-8 items-start md:items-center "
                                    >
                                      {" "}
                                      {/* Added key prop */}
                                      <span className="flex items-center justify-center p-2 px-[10px] text-xl border-2 border-black rounded-full ">
                                        {index + 1}{" "}
                                        {/* Changed to show correct index */}
                                      </span>
                                      <span className="text-xl font-semibold">
                                        {item.description}{" "}
                                        {/* Fixed to show correct description */}
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </React.Fragment>
              );
            })}
        </div>
      </div>

      <div className="bg-gradient-to-t from-[#F7941D] to-[#FFE18B] flex flex-col items-center justify-center p-12 md:flex-row md:justify-around px-4 gap-12 md:px-24">
        <div className="flex-1">
          <img
            src="/assets/productv2/mentoons-product-wheel.png"
            alt="Mentoons Product wheel"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="relative overflow-hidden border rounded-xl group">
            {products.map((product, index) => (
              <div
                key={product._id}
                className="w-full transition-opacity duration-500"
                style={{
                  display: index === currentVideoIndex ? "block" : "none",
                }}
              >
                <video
                  src={product?.productVideos?.[0]?.videoUrl}
                  autoPlay
                  controls
                  muted
                  playsInline
                  webkit-playsinline
                  className="w-full rounded-xl"
                ></video>
              </div>
            ))}

            {/* Navigation buttons */}
            {products.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentVideoIndex((prev) =>
                      prev === 0 ? products.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-opacity opacity-0 group-hover:opacity-100 z-10"
                  aria-label="Previous video"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    setCurrentVideoIndex((prev) => (prev + 1) % products.length)
                  }
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-opacity opacity-0 group-hover:opacity-100 z-10"
                  aria-label="Next video"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Indicators */}
          {products.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentVideoIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentVideoIndex ? "bg-primary" : "bg-gray-300"
                  }`}
                  aria-label={`Go to video ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pb-16">
        <div className="flex gap-4 items-start p-4  md:items-center ">
          <span className="py-0 pl-0 text-2xl font-semibold  md:py-12 md:text-3xl">
            {" "}
            Product Specifically designed for
          </span>
          <button
            className={`flex items-center justify-start px-2 pr-3 gap-2 w-fit md:w-30 py-[5px] rounded-full transition-all duration-200 font-semibold text-xl whitespace-nowrap
              ${
                selecteCategory === "6-12" &&
                "text-yellow-500 bg-yellow-100 border-yellow-400 ring-4 ring-yellow-400"
              }
              ${
                selecteCategory === "13-16" &&
                "text-rose-600 bg-red-100 border-red-500 ring-4 ring-red-500"
              }
              ${
                selecteCategory === "17-19" &&
                "text-purple-600 bg-purple-100 border-purple-500 ring-4 ring-purple-500"
              }
              ${
                selecteCategory === "20+" &&
                "text-blue-500 bg-blue-100 border-blue-500 ring-4 ring-blue-500"
              } 
              ${
                selecteCategory === "parents" &&
                "text-green-500 bg-green-100 border-green-500 ring-4 ring-green-500"
              }
              border hover:ring-4
              ${selecteCategory === "6-12" && "hover:ring-yellow-300"}
              ${selecteCategory === "13-16" && "hover:ring-red-300"}
              ${selecteCategory === "17-19" && "hover:ring-purple-300"}
              ${selecteCategory === "20+" && "hover:ring-blue-300"}
              ${selecteCategory === "parents" && "hover:ring-green-300"}
            `}
            onClick={() => handleSelectedCategory(selecteCategory)}
          >
            <span
              className={`w-5 h-5 rounded-full
              ${selecteCategory === "6-12" && "bg-yellow-500"}
              ${selecteCategory === "13-16" && "bg-rose-500"}
              ${selecteCategory === "17-19" && "bg-purple-500"}
              ${selecteCategory === "20+" && "bg-blue-500"}
              ${selecteCategory === "parent" && "bg-green-500"}
            `}
            />
            {selecteCategory.toUpperCase()}
          </button>
        </div>
        {/* <div className="flex gap-4 justify-center items-center">
          <div className="flex flex-col gap-0 items-center p-4">
            <img
              src="/assets/productv2/conversation-starter-cards-6-12.png"
              alt=""
            />
            <span className="text-xl font-semibold">Stage I</span>
          </div>
          <div className="flex flex-col gap-0 items-center p-4">
            <img
              src="/assets/productv2/story-re-teller-cards-6-12.png"
              alt=""
            />
            <span className="text-xl font-semibold">Stage II</span>
          </div>{" "}
          <div className="flex flex-col gap-0 items-center p-4">
            <img src="/assets/productv2/silent-stories-6-12.png" alt="" />
            <span className="text-xl font-semibold">Stage III</span>
          </div>
        </div> */}
        <div
          className="flex flex-col md:flex-row gap-4 justify-around items-center p-4"
          // ref={carouselRef}
        >
          {products.map((product) => (
            <motion.div
              className="flex flex-col h-[500px] cursor-pointer"
              key={product._id}
              onClick={() => {
                handleCardType(product.type);
                navigate(
                  `/mentoons-store/${product.title.toLowerCase()}/${
                    product._id
                  }`
                );
              }}
              whileHover={{ scale: 1.05 }} // Scale up on hover
              transition={{ type: "spring", stiffness: 300 }} // Spring animation
            >
              <div
                style={{
                  backgroundColor: `${product?.accentColor}40`,
                }}
                className=""
              >
                <img
                  src={product?.productImages?.[0]?.imageUrl}
                  alt="comic 1"
                  className="object-cover rounded-lg w-96 h-[300px]"
                />
              </div>
              <div className="flex justify-between items-center pt-4 text-xl font-semibold">
                <span> {product.title}</span>
                <span className="text-primary">₹ 199</span>{" "}
              </div>
              <p className="text-gray-500 w-[30ch] line-clamp-3">
                {product?.description}
              </p>{" "}
              {/* Added optional chaining for safety */}
              <div className="">
                <Rating ratings={4.5} />
              </div>
              <button className="flex justify-center items-center px-6 py-2 mt-auto w-full font-semibold text-white bg-primary">
                <IoIosCart className="mr-2 w-5 h-5" />
                Add to Cart
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* <div className="bg-[#FABB05] flex flex-col items-center justify-center p-24  md:justify-around">
        <div className="flex gap-12 justify-center items-start pb-6">
          <div className="px-6 py-3 text-2xl font-semibold rounded-full border-2 border-black">
            Conversation starter cards
          </div>
          <div className="px-6 py-3 text-2xl font-semibold rounded-full border-2 border-black">
            How Kids will Benefit?
          </div>
          <div className="px-6 py-3 text-2xl font-semibold rounded-full border-2 border-black">
            How Parents will Benefit?
          </div>
        </div>
        <div className="flex gap-4 justify-center items-center w-full">
          <ul className="flex flex-col gap-4 p-12 w-[70%] bg-white">
            <li className="flex gap-8 items-center">
              <span className="w-[64px] h-[64px] pt-1 border-4 flex items-center justify-center text-4xl font-semibold   border-black rounded-full">
                {" "}
                01
              </span>
              <span className="text-4xl font-semibold">
                Learn easily oldest format of communication
              </span>
            </li>
            <li className="flex gap-8 items-center">
              <span className="w-[64px] h-[64px] pt-1 border-4 flex items-center justify-center text-4xl font-semibold   border-black rounded-full">
                {" "}
                02
              </span>
              <span className="text-4xl font-semibold">
                Developed by Psychologists and Educators
              </span>
            </li>
            <li className="flex gap-8 items-center">
              <span className="w-[64px] h-[64px] pt-1 border-4 flex items-center justify-center text-4xl font-semibold   border-black rounded-full">
                {" "}
                03
              </span>
              <span className="text-4xl font-semibold">
                Age appropriate content
              </span>
            </li>
            <li className="flex gap-8 items-center">
              <span className="w-[64px] h-[64px] pt-1 border-4 flex items-center justify-center text-4xl font-semibold   border-black rounded-full">
                {" "}
                04
              </span>
              <span className="text-4xl font-semibold">
                Beautifully illustrated
              </span>
            </li>
          </ul>
        </div>
      </div> */}

      <div className="p-8 md:px-28">
        <h2 className="pb-6 text-2xl font-semibold">
          Frequently asked questions
        </h2>
        <div className="md:flex md:gap-8">
          <div className="flex flex-col flex-1 gap-4 mb-8">
            {WORKSHOP_FAQ.map((faq, index) => (
              <FAQCard
                key={faq.id}
                faq={faq}
                isExpanded={expandedIndex === index}
                // color={workshop.registerFormbgColor}
                onClick={() =>
                  setExpandedIndex(index === expandedIndex ? -1 : index)
                }
              />
            ))}
          </div>

          <div className="flex flex-col flex-1 gap-4 p-4 text-center rounded-xl border-2 md:mb-8">
            <div className="w-[80%] mx-auto ">
              <div className="flex gap-4 justify-center items-center py-2 md:pb-6">
                <BiSolidMessage
                  className="text-5xl"
                  // style={{ color: workshop.registerFormbgColor }}
                />
              </div>
              <div>
                <h3
                  className="text-xl font-bold md:text-3xl md:pb-4"
                  // style={{ color: workshop.registerFormbgColor }}
                >
                  Have Doubts? We are here to help you!
                </h3>
                <p className="pt-2 pb-4 text-gray-600 md:text-xl md:pb-6">
                  Contact us for additional help regarding your assessment or
                  purchase made on this platform, We will help you!{" "}
                </p>
              </div>
              <div className="">
                <form action=" w-full flex flex-col gap-10">
                  <textarea
                    name="doubt"
                    id="doubt"
                    placeholder="Enter your doubt here"
                    className="box-border p-3 w-full rounded-lg border-2 shadow-xl border-primary"
                    // style={{
                    //   border: `2px solid ${workshop.registerFormbgColor}`,
                    // }}
                  ></textarea>

                  <button
                    className="py-3 mt-4 w-full text-xl font-semibold text-white rounded-lg shadow-lg transition-all duration-200 bg-primary"
                    // style={{
                    //   backgroundColor: workshop.registerFormbgColor,
                    // }}
                    type="submit"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;

const Rating = ({ ratings }: { ratings: number }) => {
  return (
    <div className="flex gap-4 justify-between items-center mt-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const rating = ratings; // This can be passed as a prop
          const filled = star <= Math.floor(rating);
          const partial = !filled && star <= Math.ceil(rating);
          const percentage = partial ? (rating % 1) * 100 : 0;

          return (
            <div key={star} className="relative">
              {/* Empty star (background) */}
              <svg
                className="w-8 h-8 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>

              {/* Filled star (overlay) */}
              <div
                className="overflow-hidden absolute top-0 left-0"
                style={{ width: filled ? "100%" : `${percentage}%` }}
              >
                <svg
                  className="w-8 h-8 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
      <span className="font-semibold text-gray-500">{ratings}</span>
    </div>
  );
};
