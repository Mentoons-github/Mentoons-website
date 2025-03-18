import ProductCard from "@/components/MentoonsStore/ProductCard";
import FAQCard from "@/components/shared/FAQSection/FAQCard";
import { ISSUES_FACED_BY_USERS, WORKSHOP_FAQ } from "@/constant";
import { fetchProducts } from "@/redux/productSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { BiSolidMessage } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setFilter } from "../redux/productSlice";
import { RootState } from "../redux/store";

const Store = () => {
  const [selecteCategory, setSelecteCategory] = useState("6-12");
  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [message, setMessage] = useState<string>("");

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      const queryResponse = await axios.post(
        "http://localhost:4000/api/v1/query",
        {
          message: message,
        }
      );
      console.log(queryResponse);
      if (queryResponse.status === 201) {
        toast.success("Message Submitted Successfully");
      }
    } catch (error) {
      toast.error("Failed to submit message");
    }
  };

  const {
    items: products,
    loading,
    error,
  } = useSelector((state: RootState) => state.products);

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
            <div className="flex flex-col md:flex-row gap-3 w-full px-4 items-center justify-center ">
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
                selecteCategory === "13-16" && "ring-4 ring-red-500 "
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
                selecteCategory === "parents" && "ring-4 ring-green-500 "
              }`}
              onClick={() => handleSelectedCategory("parents")}
            >
              <span className="w-4 md:w-5 h-4 md:h-5 bg-green-500 rounded-full" />
              Parents
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
          {ISSUES_FACED_BY_USERS.filter(
            (item) => item.ageCategory === selecteCategory
          ).map((issue, index) => (
            <div
              key={`${issue.title}_${index}`}
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

      <div className="bg-gradient-to-t from-[#F7941D] to-[#FFE18B] flex flex-col items-center justify-center p-12 md:flex-row md:justify-around px-4 gap-12 md:px-24">
        <div className="flex-1">
          <img
            src={
              selecteCategory === "6-12"
                ? "/assets/productv2/6-12-productWheel.png"
                : "/assets/productv2/13-16-productWheel.png"
            }
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
          <span className="py-0 pl-0 text-2xl font-semibold  md:py-12 md:px-12 md:text-3xl">
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
              ${selecteCategory === "parents" && "bg-green-500"}
            `}
            />
            {selecteCategory.toUpperCase()}
          </button>
        </div>

        <div className="w-full p-4 mt-4 ">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-12 auto-rows-auto mx-20">
            {products?.length > 0 ? (
              products.map((product) => {
                // Ensure all required properties are present before passing to ProductCard

                return (
                  <div
                    className="flex justify-center w-full"
                    key={product._id + Date.now()}
                  >
                    <ProductCard
                      key={product._id + Date.now()}
                      productDetails={product}
                    />
                  </div>
                );
              })
            ) : (
              <div>No Product found</div>
            )}
          </div>
        </div>
      </div>

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
                    onChange={(e) => handleMessageChange(e)}
                  ></textarea>

                  <button
                    className="py-3 mt-4 w-full text-xl font-semibold text-white rounded-lg shadow-lg transition-all duration-200 bg-primary"
                    onClick={(e) => handleSubmit(e)}
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
