import { PRODUCT_DATA } from "@/constant";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

interface IPRODUCT {
  id: string;
  title: string;
  description: string;

  imageUrl: string;
  price: number;
  accentColor: string;
}
const Store = () => {
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleScroll = () => {
    const carousel = carouselRef.current;
    if (carousel) {
      setIsAtStart(carousel.scrollLeft === 0);
      setIsAtEnd(
        carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1
      );
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", handleScroll);
      return () => carousel.removeEventListener("scroll", handleScroll);
    }
  }, []);
  return (
    <div className="">
      <div className="w-[90%] mx-auto my-20">
        <div className="w-full overflow-hidden">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory">
            {PRODUCT_DATA.map((product, i) => (
              <div key={i} className="flex-none w-full snap-center ">
                <ProductCarouselCard product={product} />
              </div>
            ))}
          </div>
        </div>
        {/* Category section */}
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

        {/* Trending Product Card */}
        <div className="relative my-12 ">
          <h3 className="pb-6 text-4xl font-semibold ">Trending Products</h3>
          <div
            className="flex gap-8 overflow-x-auto scroll-smooth"
            ref={carouselRef}
          >
            {PRODUCT_DATA.map((product) => (
              <div
                className="flex flex-col h-[500px] cursor-pointer "
                key={product.id}
                onClick={() =>
                  navigate(
                    `/mentoons-store/${product.title.toLowerCase()}/${
                      product.id
                    }`
                  )
                }
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
                    className="object-cover  rounded-lg w-96 h-[300px] "
                  />
                </div>
                <h3 className="pt-4 text-xl font-medium">{product.title}</h3>
                <p className="text-gray-500 w-[30ch]">{product.description}</p>
                <button
                  className="w-full px-6 py-2 mt-auto font-semibold text-white bg-primary "
                  // style={{ backgroundColor: `${product.accentColor}` }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
          {/* Navigation buttons */}
          <button
            onClick={() => {
              const carousel = carouselRef.current;
              if (carousel) {
                carousel.scrollBy({ left: -300, behavior: "smooth" });
              }
            }}
            className="absolute left-0 p-2 transition-colors -translate-y-1/2 rounded-full shadow-lg top-1/2 bg-white/80 hover:bg-white"
            style={{ display: isAtStart ? "none" : "block" }}
          >
            <IoIosArrowBack className="text-2xl" />
          </button>
          <button
            onClick={() => {
              const carousel = carouselRef.current;
              if (carousel) {
                carousel.scrollBy({ left: 300, behavior: "smooth" });
              }
            }}
            className="absolute right-0 p-2 transition-colors -translate-y-1/2 rounded-full shadow-lg top-1/2 bg-white/80 hover:bg-white"
            style={{ display: isAtEnd ? "none" : "block" }}
          >
            <IoIosArrowForward className="text-2xl" />
          </button>
        </div>

        {/* Normal Product card */}

        <div>
          <h3 className="pb-6 text-4xl font-semibold ">
            Browse More Products here
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {PRODUCT_DATA.map((product) => (
              <div
                className="flex flex-col h-[500px] cursor-pointer"
                key={product.id}
                onClick={() =>
                  navigate(
                    `/mentoons-store/${product.title.toLowerCase()}/${
                      product.id
                    }`
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
        </div>
      </div>
    </div>
  );
};

export default Store;

const ProductCarouselCard = ({ product }: { product: IPRODUCT }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex h-[240px] sm:h-[500px] md:h-[600px] p-4 sm:p-8 md:p-12 rounded-2xl"
      style={{ backgroundColor: product.accentColor }}
    >
      <div className="flex flex-col flex-1 pb-3 pl-1">
        <h1 className="pb-2 text-3xl font-bold sm:text-4xl md:text-6xl lg:text-8xl leading-wider line-clamp-2">
          {product.title}
        </h1>
        <p className="pb-4 text-sm sm:text-lg leading-tight w-[90%] line-clamp-3">
          {product.description}
        </p>
        <button
          className="px-6 py-2 mt-2 font-semibold bg-white rounded-full shadow-xl tex1t-lg text-primary w-fit"
          onClick={() =>
            navigate(`/mentoons-store/${product.title.toLowerCase()}`)
          }
        >
          Shop Now
        </button>
      </div>
      <div className="flex items-center justify-center flex-1 w-full">
        <img
          src={product.imageUrl}
          alt=""
          className="object-contain max-h-full"
        />
      </div>
    </div>
  );
};
