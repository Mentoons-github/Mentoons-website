import FAQCard from "@/components/shared/FAQSection/FAQCard";
import { PRODUCT_DATA, WORKSHOP_FAQ, WORKSHOPS } from "@/constant";
import { motion } from "framer-motion";
import { useState } from "react";
import { BiSolidMessage } from "react-icons/bi";
import { IoIosCart } from "react-icons/io";
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

const Store = () => {
  const [selecteCategory, setSelecteCategory] = useState("6-12");
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  // const handleClick = () => {
  //   setIsExpanded(!isExpanded);
  // };
  

  const handleSelectedCategory = (category: string) => {
    setSelecteCategory(category);
  };
  return (
    <div>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t via-transparent from-neutral-800" />
        <img
          src="/assets/productv2/mentoon-store-hero-banner.png"
          alt=""
          className="w-full"
        />
        <div className="flex absolute inset-0 flex-col gap-6 justify-end items-center py-10">
          <motion.h1
            className="text-7xl font-bold text-white"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            Mentoons Store
          </motion.h1>
          <div className="flex-col gap-12 justify-end items-center text-2xl font-semibold md:flex md:flex-row">
            <button
              className={`flex items-center justify-start text-yellow-500 px-3 gap-3 w-32 py-[7px] rounded-full bg-yellow-100 border border-yellow-400 hover:ring-4 hover:ring-yellow-300 transition-all duration-200 ${
                selecteCategory === "6-12" && "ring-4 ring-yellow-400 "
              }`}
              onClick={() => handleSelectedCategory("6-12")}
            >
              <span className="w-5 h-5 bg-yellow-500 rounded-full" />
              6-12
            </button>
            <button
              className={`flex items-center justify-start gap-3 text-rose-600 w-32  px-3 py-[7px] rounded-full bg-red-200 border border-red-500 hover:ring-4 hover:ring-red-500 transition-all duration-200 ${
                selecteCategory === "13-19" && "ring-4 ring-red-500 "
              }`}
              onClick={() => handleSelectedCategory("13-19")}
            >
              <span className="w-5 h-5 bg-rose-500 rounded-full" />
              13-19
            </button>

            <button
              className={`flex items-center justify-start gap-3 text-blue-500  w-32 px-3 py-[7px]  rounded-full bg-blue-200 border border-blue-500  hover:ring-4 hover:ring-blue-500 transition-all duration-200  ${
                selecteCategory === "20+" && "ring-4 ring-blue-500 "
              }`}
              onClick={() => handleSelectedCategory("20+")}
            >
              <span className="w-5 h-5 bg-blue-500 rounded-full" />
              20+
            </button>
            <button
              className={`flex items-center justify-start gap-3 text-green-500 w-32 px-3 py-2  rounded-full bg-green-200 border border-green-500  hover:ring-4 hover:ring-green-500 transition-all duration-200  ${
                selecteCategory === "parent" && "ring-4 ring-green-500 "
              }`}
              onClick={() => handleSelectedCategory("parent")}
            >
              <span className="w-5 h-5 bg-green-500 rounded-full" />
              Parent
            </button>
          </div>
        </div>

        {/* Challenges face by */}
      </div>
      <div className="flex flex-col p-12 py-16">
        <h2 className="pb-16 text-4xl font-semibold text-center">
          Challenges faced by Parents
        </h2>
        <div className="flex flex-col gap-4 items-center md:flex-row md:justify-around">
          {WORKSHOPS.filter((workshop) => workshop.category === selecteCategory)
            .flatMap((workshop) => workshop.addressedIssues)
            .map((issue) => (
              <div
                key={issue.id}
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
            ))}
        </div>
      </div>
      <div className="flex flex-col items-center pb-12 mx-auto bg-amber-50">
        <button
          className="px-4 py-2 mt-10 mb-4 font-semibold text-black bg-yellow-500 rounded-full transition-all duration-200 hover:bg-yellow-600"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? "Collapse All" : "Expand All"}
        </button>

        <div className="flex gap-8 px-24 w-full">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className={`overflow-hidden transition-all duration-300 border-2 cursor-pointer hover:border-[var(--hover-border-color)] w-[90%] mx-auto ${
                isExpanded ? "" : "border-neutral-200"
              }`}
            >
              <div className="flex items-center justify-between w-full p-4 text-black bg-[#FABB05]">
                <span className="text-xl font-semibold transition-colors duration-300">
                  Conversation Starter Cards
                </span>
                {/* <span
                  className={`p-1 rounded-full border-2 flex items-center transition-all duration-300 ease-in-out transform ${
                    isExpanded
                      ? "rotate-45"
                      : "hover:bg-[var(--hover-bg-color)] hover:border-[var(--hover-border-color)]"
                  }`}
                >
                  <IoAdd
                    className={`text-xl transition-colors duration-300 ${
                      isExpanded ? "":"text-neutral-800"}`}
                  />
                </span> */}
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
                    <ul className="flex flex-col gap-4 p-12">
                      <li className="flex gap-8 items-center">
                        <span className="flex items-center justify-center p-2 px-[10px] text-xl border-2 border-black rounded-full">
                          01
                        </span>
                        <span className="text-xl font-semibold">
                          Learn easily oldest format of communication
                        </span>
                      </li>
                      <li className="flex gap-8 items-center">
                        <span className="flex items-center justify-center p-2 px-[10px] text-xl border-2 border-black rounded-full">
                          02
                        </span>
                        <span className="text-xl font-semibold">
                          Developed by Psychologists and Educators
                        </span>
                      </li>
                      <li className="flex gap-8 items-center">
                        <span className="flex items-center justify-center p-2 px-[10px] text-xl border-2 border-black rounded-full">
                          03
                        </span>
                        <span className="text-xl font-semibold">
                          Age appropriate content
                        </span>
                      </li>
                      <li className="flex gap-8 items-center">
                        <span className="flex items-center justify-center p-2 px-[10px] text-xl border-2 border-black rounded-full">
                          04
                        </span>
                        <span className="text-xl font-semibold">
                          Beautifully illustrated
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-t from-[#F7941D] to-[#FFE18B] flex flex-col items-center justify-center p-12 md:flex-row md:justify-around px-24">
        <div className="flex-1">
          <img
            src="/assets/productv2/mentoons-product-wheel.png"
            alt="Mentoons Product wheel"
          />
        </div>
        <div className="flex-1">
          <video
            src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Others/Why+Choose+Mentoons+Comics.mp4s"
            autoPlay
            controls
            muted
            playsInline
            webkit-playInline
            className="w-full rounded-xl"
          ></video>
        </div>
      </div>

      <div className="pb-16">
        <div className="flex gap-8 items-center">
          <span className="py-12 pl-12 text-3xl font-semibold">
            {" "}
            Product Specifically designed for
          </span>
          <button
            className={`flex items-center justify-start px-2 pr-3 gap-2 w-30 py-[5px] rounded-full transition-all duration-200 font-semibold text-xl
              ${
                selecteCategory === "6-12" &&
                "text-yellow-500 bg-yellow-100 border-yellow-400 ring-4 ring-yellow-400"
              }
              ${
                selecteCategory === "13-19" &&
                "text-rose-600 bg-red-100 border-red-500 ring-4 ring-red-500"
              }
              ${
                selecteCategory === "20+" &&
                "text-blue-500 bg-blue-100 border-blue-500 ring-4 ring-blue-500"
              } 
              ${
                selecteCategory === "parent" &&
                "text-green-500 bg-green-100 border-green-500 ring-4 ring-green-500"
              }
              border hover:ring-4
              ${selecteCategory === "6-12" && "hover:ring-yellow-300"}
              ${selecteCategory === "13-19" && "hover:ring-red-300"}
              ${selecteCategory === "20+" && "hover:ring-blue-300"}
              ${selecteCategory === "parent" && "hover:ring-green-300"}
            `}
            onClick={() => handleSelectedCategory(selecteCategory)}
          >
            <span
              className={`w-5 h-5 rounded-full
              ${selecteCategory === "6-12" && "bg-yellow-500"}
              ${selecteCategory === "13-19" && "bg-rose-500"}
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
          className="flex gap-4 justify-around items-center"
          // ref={carouselRef}
        >
          {PRODUCT_DATA.filter(
            (product) =>
              (product.title.includes("Conversation Starter Cards") ||
                product.title.includes("Story Re-teller Cards") ||
                product.title.includes("Silent Stories")) &&
              product.age === selecteCategory
          ).map((product) => (
            <motion.div
              className="flex flex-col h-[500px] cursor-pointer"
              key={product.id}
              onClick={() =>
                navigate(
                  `/mentoons-store/${product.title.toLowerCase()}/${product.id}`
                )
              }
              whileHover={{ scale: 1.05 }} // Scale up on hover
              transition={{ type: "spring", stiffness: 300 }} // Spring animation
            >
              <div
                style={{
                  backgroundColor: `${product.accentColor}40`,
                }}
                className=""
              >
                <img
                  src={product.imageUrl}
                  alt="comic 1"
                  className="object-cover rounded-lg w-96 h-[300px]"
                />
              </div>
              <div className="flex justify-between items-center pt-4 text-xl font-semibold">
                <span> {product.title}</span>
                <span className="text-primary">₹ 199</span>{" "}
              </div>
              <p className="text-gray-500 w-[30ch]">{product.description}</p>
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
