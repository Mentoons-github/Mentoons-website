import { useNavigate } from "react-router-dom";
import { highlightText } from "@/utils/highlightText";
import { ProductBase } from "@/types/productTypes";
import NewBadge from "../common/badge/new";

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
    product: ProductBase
  ) => void;
  handleBuyNow: (
    e: React.MouseEvent<HTMLButtonElement>,
    product: ProductBase
  ) => void;
  isLoading: boolean;
  searchQuery?: string;
}) => {
  const navigate = useNavigate();

  return (
    <div className="px-2 sm:px-4 md:px-8 py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-6">
        Explore Products For {ageCategory}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {productDetails.map((product, index) => (
          <div
            className="bg-white rounded-xl shadow-md p-3 sm:p-4 flex flex-col border-2 border-gray-600 h-80 sm:h-96 transition-all duration-300 hover:shadow-xl hover:border-[#EC9600] hover:scale-[1.02] cursor-pointer"
            key={index}
            onClick={() => navigate(`/mentoons-store/product/${product._id}`)}
          >
            <div className="relative h-32 sm:h-40 flex items-center justify-center mb-2 sm:mb-3">
              <img
                src={
                  product?.productImages?.[0]?.imageUrl ||
                  "/placeholder-image.jpg"
                }
                alt={product.title}
                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
              {product.isNew && <NewBadge />}
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
                      className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-green-700 transition-all duration-200 bg-green-200 border border-green-300 shadow-md hover:opacity-55 rounded-xl"
                    >
                      Free Sample
                    </a>
                  )}
              </div>
            </div>
            <div className="flex flex-col flex-1">
              <div className="h-12 sm:h-14 overflow-hidden mb-1 sm:mb-2">
                <h3 className="text-base sm:text-lg font-medium line-clamp-2 w-full">
                  {highlightText(product.title, searchQuery)}
                </h3>
              </div>

              <div className="h-6 sm:h-8">
                <span className="text-[#444] font-semibold text-sm sm:text-base">
                  ₹{product.price}
                </span>
              </div>

              <div className="flex flex-col gap-2 sm:gap-3 mt-auto">
                <button
                  className="hover:bg-yellow-600 text-white py-1.5 sm:py-2 rounded-lg bg-[#EC9600] transition-all duration-300 hover:shadow-md text-xs sm:text-sm"
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={isLoading}
                >
                  Add To Cart
                </button>
                <button
                  className="bg-white hover:bg-gray-100 border border-[#EC9600] text-[#EC9600] py-1.5 sm:py-2 rounded-lg transition-all duration-300 hover:shadow-md text-xs sm:text-sm"
                  onClick={(e) => handleBuyNow(e, product)}
                  disabled={isLoading}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetailCards;
