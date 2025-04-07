import { ProductBase } from "@/types/productTypes";
import { useNavigate } from "react-router-dom";

const ProductDetailCards = ({
  ageCategory,
  productDetails,
  handleAddToCart,
  handleBuyNow,
  isLoading,
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
}) => {
  const navigate = useNavigate();

  return (
    <div className="px-5 md:px-10 py-8">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6">
        Explore Products For {ageCategory}
      </h1>

      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productDetails.map((product, index) => (
          <div
            className="bg-white rounded-xl shadow-md p-4 flex flex-col border-2 border-gray-600 h-96 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#EC9600] hover:scale-[1.02] cursor-pointer"
            key={index}
            onClick={() => navigate(`/mentoons-store/product/${product._id}`)}
          >
            <div className="relative h-40 flex items-center justify-center mb-2">
              <img
                src={product?.productImages?.[0]?.imageUrl}
                alt={product.title}
                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
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
                      className="px-2 py-1 ml-4 text-xs text-green-700 transition-all duration-200 bg-green-200 border border-green-300 shadow-lg hover:opacity-55 rounded-xl"
                    >
                      Download Free Sample
                    </a>
                  )}
              </div>
            </div>
            <div className="flex flex-col h-48">
              <div className="h-14 overflow-hidden mb-1">
                <h3 className="text-lg font-medium line-clamp-2 w-full">
                  {product.title}
                </h3>
              </div>

              <div className="h-8">
                <span className="text-[#444] font-semibold w-full">
                  ₹{product.price}
                </span>
              </div>

              <div className="flex flex-col gap-2 w-full mt-auto">
                <button
                  className="hover:bg-yellow-600 text-white py-2 rounded-lg bg-[#EC9600] transition-all duration-300 hover:shadow-md hover:translate-y-px"
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={isLoading}
                >
                  Add To Cart
                </button>
                <button
                  className="bg-white hover:bg-gray-100 border border-[#EC9600] text-[#EC9600] py-2 rounded-lg transition-all duration-300 hover:shadow-md hover:translate-y-px hover:bg-yellow-50"
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
