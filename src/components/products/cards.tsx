import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { highlightText } from "@/utils/highlightText";
import { ProductBase } from "@/types/productTypes";
import { ProductType } from "@/utils/enum";
import NewBadge from "../common/badge/new";

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
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-6">
        {ageCategory === "Toonland Products"
          ? "Toonland Products"
          : `Explore Products For ${ageCategory}`}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
              className="group relative bg-white rounded-2xl shadow-sm p-3 sm:p-4 flex flex-col border border-gray-200 h-80 sm:h-[22rem] transition-all duration-300 hover:shadow-xl hover:border-[#EC9600] hover:-translate-y-1 cursor-pointer"
              key={index}
              onClick={() => handleCardClick(product)}
            >
              <div className="relative h-28 sm:h-32 flex items-center justify-center mb-2 sm:mb-3 bg-gray-50 rounded-xl">
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
                  <span className="absolute bottom-1 left-1 z-20 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-white bg-red-500 rounded-full shadow-sm">
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
                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-green-700 transition-all duration-200 bg-green-200 border border-green-300 shadow-md hover:opacity-55 rounded-xl"
                      >
                        Free Sample
                      </a>
                    )}
                </div>
              </div>

              <div className="flex flex-col flex-1">
                <div className="h-11 sm:h-12 overflow-hidden mb-1">
                  <h3 className="text-sm sm:text-base font-medium line-clamp-2 w-full">
                    {highlightText(product.title, searchQuery)}
                  </h3>
                </div>

                {product.rating ? (
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.round(product.rating)
                            ? "text-yellow-400"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-[11px] text-gray-500">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                ) : (
                  <div className="mb-1 h-4" />
                )}

                <div className="flex flex-col gap-0.5 h-9 sm:h-10">
                  {hasDiscount && (
                    <span className="text-[9px] sm:text-[10px] font-semibold text-green-600 uppercase tracking-wide">
                      Introductory Price
                    </span>
                  )}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[#333] font-bold text-sm sm:text-base">
                      ₹{sellingPrice}
                    </span>
                    {hasDiscount && (
                      <span className="text-gray-400 text-xs sm:text-sm line-through">
                        ₹{originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 sm:gap-2 mt-auto pt-2">
                  <button
                    className="text-white py-1.5 rounded-lg bg-gradient-to-r from-[#EC9600] to-[#f0a929] transition-all duration-300 hover:shadow-md hover:brightness-105 text-xs sm:text-sm font-medium"
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={isLoading}
                  >
                    Add To Cart
                  </button>
                  <button
                    className="bg-white hover:bg-orange-50 border border-[#EC9600] text-[#EC9600] py-1.5 rounded-lg transition-all duration-300 hover:shadow-md text-xs sm:text-sm font-medium"
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
