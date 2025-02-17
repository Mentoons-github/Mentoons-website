//Get the category from url param and then base on that fetch the products from the database or from the redux store.

import FAQCard from "@/components/shared/FAQSection/FAQCard";
import { PRODUCT_DATA, WORKSHOP_FAQ } from "@/constant";
import { useState } from "react";
import { BiSolidMessage } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";

const ProductCategory = () => {
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const navigate = useNavigate();

  const { category } = useParams();
  console.log(category);
  // On getting the category form url params fetch the products from the database or from the redux store.

  return (
    <div className="w-[90%] mx-auto my-20">
      <div className="mt-12">
        <h1 className="pb-2 text-3xl font-bold sm:text-4xl md:text-6xl lg:text-8xl leading-wider line-clamp-2">
          {category?.toLocaleUpperCase()}
        </h1>
        <p className="pb-4 text-sm sm:text-lg leading-tight w-[90%] line-clamp-3">
          Help you kid overcom the fear of express themeselves
        </p>
      </div>

      {/* Age category */}
      <div className="flex flex-col justify-between mt-10">
        <h1 className="text-2xl font-semibold text-center text-primary/80">
          Find Products For All Age Categories
        </h1>
        <div className="grid grid-cols-2 gap-4 mt-4 ">
          <button className="py-4 text-xl font-semibold border border-neutral-800 rounded-full bg-[#FCE83E]">
            6-12
          </button>
          <button className="py-4 text-xl font-semibold border border-neutral-800 rounded-full bg-[#EF4444]">
            13-16
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 ">
          <button className="py-4 text-xl font-semibold border border-neutral-800 rounded-full bg-[#4E90FF]">
            17-19
          </button>
          <button className="py-4 text-xl font-semibold border border-neutral-800 rounded-full bg-[#34A853]">
            20+
          </button>
        </div>
      </div>

      {/* Browse the product from Conversation car only */}

      <div className="grid grid-cols-1 gap-6 pt-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {PRODUCT_DATA.map((product) => (
          <div
            className="flex flex-col h-[500px] cursor-pointer"
            key={product.id}
            onClick={() =>
              navigate(
                `/mentoons-store/${product.title.toLowerCase()}/${product.id}`
              )
            }
          >
            <div
              style={{
                backgroundColor: `${product.accentColor}40`,
              }}
              className="h-[300px] w-full"
            >
              <img
                src={product.imageUrl}
                alt="comic 1"
                className="object-cover w-full h-full border rounded-lg"
              />
            </div>
            <h3 className="pt-4 text-xl font-medium">{product.title}</h3>
            <p className="text-gray-500">{product.description}</p>
            <button
              className="w-full px-6 py-2 mt-auto font-semibold text-white bg-primary"
              // style={{ backgroundColor: `${product.accentColor}` }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Frequently asked questions */}
      <div className="pt-20 ">
        <h2 className="pb-6 text-2xl font-semibold md:text-4xl ">
          Frequently asked questions
        </h2>
        <div className="md:flex md:gap-8 ">
          <div className="flex flex-col flex-1 gap-4 mb-8 ">
            {WORKSHOP_FAQ.map((faq, index) => (
              <FAQCard
                key={faq.id}
                faq={faq}
                isExpanded={expandedIndex === index}
                onClick={() =>
                  setExpandedIndex(index === expandedIndex ? -1 : index)
                }
              />
            ))}
          </div>

          <div className="flex flex-col flex-1 gap-4 p-4 text-center border-2 md:mb-8 rounded-xl">
            <div className="w-[80%] mx-auto ">
              <div className="flex items-center justify-center gap-4 py-2 md:pb-6">
                <BiSolidMessage
                  className="text-5xl "
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
                    className="box-border w-full p-3 border-2 rounded-lg shadow-xl"
                    // style={{
                    //   border: `2px solid ${workshop.registerFormbgColor}`,
                    // }}
                  ></textarea>

                  <button
                    className="w-full py-3 mt-4 text-xl font-semibold text-black transition-all duration-200 border border-black rounded-lg shadow-lg "
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

export default ProductCategory;
