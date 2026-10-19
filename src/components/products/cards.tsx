import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { highlightText } from "@/utils/highlightText";
import { ProductBase } from "@/types/productTypes";
import { ProductType } from "@/utils/enum";
import NewBadge from "../common/badge/new";

// Fonts come from index.css:
// .font-comic -> Bangers, .font-comic-chip -> Luckiest Guy, .font-number -> Cabin

const getDisplayPricing = (product: ProductBase) => {
  if (product.type === ProductType.TOONLAND) {
    return {
      sellingPrice: product.offerPrice ?? product.price,
      originalPrice: product.price,
    };
  }

  return {
    sellingPrice: product.price,
    originalPrice: product.mrp,
  };
};

const ProductDetailCards = ({
  ageCategory,
  productDetails,
  handleAddToCart,
  handleBuyNow,
  isLoading,
  searchQuery = "",
}: {
  ageCategory: string;
  productDetails: ProductBase[];
  handleAddToCart: (
    e: React.MouseEvent<HTMLButtonElement>,
    product: ProductBase,
  ) => void;
  handleBuyNow: (
    e: React.MouseEvent<HTMLButtonElement>,
    product: ProductBase,
  ) => void;
  isLoading: boolean;
  searchQuery?: string;
}) => {
  const navigate = useNavigate();

  // Send the shopper to the right detail page for the product's type.
  // Toonland products get routed to their own page, and the full
  // product object is passed along via router state so that page
  // never has to call the separate Toonland backend to re-fetch it.
  const handleCardClick = (product: ProductBase) => {
    if (product.type === ProductType.TOONLAND) {
      navigate(`/mentoons-store/toonland-product/${product._id}`, {
        state: { product },
      });
    } else {
      navigate(`/mentoons-store/product/${product._id}`);
    }
  };

  return (
    <div className="px-2 sm:px-4 md:px-8 py-6 sm:py-8">
      <h1 className="font-comic tracking-wider text-2xl sm:text-3xl md:text-4xl text-black mb-5 sm:mb-8">
        {ageCategory === "Toonland Products"
          ? "Toonland Products"
          : `Explore Products For ${ageCategory}`}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
        {productDetails.map((product, index) => {
          const { sellingPrice, originalPrice } = getDisplayPricing(product);
          const hasDiscount =
            originalPrice !== undefined &&
            originalPrice !== null &&
            originalPrice > sellingPrice;
          const discountPercent = hasDiscount
            ? Math.round(
                ((originalPrice! - sellingPrice) / originalPrice!) * 100,
              )
            : 0;

          return (
            <div
              className="group relative bg-white rounded-xl p-3 sm:p-4 flex flex-col border-4 border-black shadow-[6px_6px_0_0_#000] h-full min-h-[26rem] transition-all duration-200 hover:shadow-[9px_9px_0_0_#EC9600] hover:-translate-x-0.5 hover:-translate-y-1 cursor-pointer"
              key={index}
              onClick={() => handleCardClick(product)}
            >
              <div className="relative h-28 sm:h-32 flex items-center justify-center mb-2 sm:mb-3 bg-yellow-100 rounded-lg border-[3px] border-black">
                <img
                  src={
                    product?.productImages?.[0]?.imageUrl ||
                    "/placeholder-image.jpg"
                  }
                  alt={product.title}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
                {product.isNew && <NewBadge />}

                {hasDiscount && (
                  <span className="absolute -bottom-3 -left-3 z-20 px-2 py-0.5 text-xs sm:text-sm font-comic-chip tracking-wider text-black bg-yellow-300 border-[3px] border-black rounded-full shadow-[2px_2px_0_0_#000] -rotate-6">
                    {discountPercent}% OFF
                  </span>
                )}

                <div className="absolute top-1 right-1">
                  {(product?.title ===
                    "Conversation Starter Cards (6-12) years" ||
                    product?.title === "Silent Stories (6-12) years") &&
                    product?.ageCategory === "6-12" && (
                      <a
                        href={`${
                          product?.title ===
                          "Conversation Starter Cards (6-12) years"
                            ? "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/freeDownloads/Coversation+starter+cards+6-12+free.pdf"
                            : "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/freeDownloads/Silent+story+6-12+free.pdf"
                        }`}
                        download
                        onClick={(e) => e.stopPropagation()}
                        className="font-comic-chip tracking-wider px-2 sm:px-3 py-1 text-xs sm:text-sm text-black bg-green-300 border-[3px] border-black rounded-lg shadow-[2px_2px_0_0_#000] rotate-3 hover:bg-green-200 transition-colors"
                      >
                        Free Sample
                      </a>
                    )}
                </div>
              </div>

              <div className="flex flex-col flex-1">
                <div className="min-h-[3.5rem] mb-1">
                  {/* highlightText returns <span>s, and index.css sets a global
                      span font (DM Sans) that beats inheritance, so we force
                      spans inside the title to inherit the comic font. */}
                  <h3 className="font-comic tracking-wide text-lg sm:text-xl leading-tight text-black line-clamp-2 w-full [&_span]:![font-family:inherit] [&_span]:!leading-tight">
                    {highlightText(product.title, searchQuery)}
                  </h3>
                </div>

                {product.rating ? (
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.round(product.rating)
                            ? "text-yellow-400 drop-shadow-[1px_1px_0_#000]"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="font-number ml-1 text-xs text-black">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                ) : (
                  <div className="mb-1 h-4" />
                )}

                <div className="flex flex-col gap-0.5 min-h-[2.5rem]">
                  {hasDiscount && (
                    <span className="font-comic-chip text-[10px] sm:text-xs tracking-wider text-green-700">
                      Introductory Price
                    </span>
                  )}
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-number text-black font-bold text-base sm:text-lg">
                      ₹{sellingPrice}
                    </span>
                    {hasDiscount && (
                      <span className="font-number text-gray-500 text-xs sm:text-sm line-through">
                        ₹{originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 sm:gap-2 mt-auto pt-2">
                  <button
                    className="font-comic-chip tracking-wider text-black py-1.5 rounded-lg bg-[#EC9600] border-[3px] border-black shadow-[3px_3px_0_0_#000] transition-all hover:bg-[#f0a929] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-60 text-sm sm:text-base"
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={isLoading}
                  >
                    Add To Cart
                  </button>
                  <button
                    className="font-comic-chip tracking-wider bg-white hover:bg-yellow-100 border-[3px] border-black text-black py-1.5 rounded-lg shadow-[3px_3px_0_0_#000] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-60 text-sm sm:text-base"
                    onClick={(e) => handleBuyNow(e, product)}
                    disabled={isLoading}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        <img
          src="/assets/workshopv2/our-children.png"
          alt="Friendly waving orange cat - end of stories"
          className="my-auto mx-auto w-14 h-14 sm:w-16 sm:h-16 md:w-44 md:h-44 lg:w-64 lg:h-64 object-contain drop-shadow-lg hover:scale-110 transition-transform duration-300"
        />
      </div>
    </div>
  );
};

export default ProductDetailCards;
