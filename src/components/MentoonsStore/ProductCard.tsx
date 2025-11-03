import { addItemCart } from "@/redux/cartSlice";
import type { AppDispatch } from "@/redux/store";
import { ProductBase, ProductType } from "@/types/productTypes";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { FaBolt } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LoginModal from "../common/modal/loginModal";
import AddToCartModal from "../modals/AddToCartModal";

const ProductCard = ({ productDetails }: { productDetails: ProductBase }) => {
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { getToken, userId } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddtoCart = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        setIsLoading(false);
        setShowLoginModal(true);
        return;
      }

      if (userId) {
        const response = await dispatch(
          addItemCart({
            token,
            userId,
            productId: productDetails._id,
            productType: productDetails.type,
            title: productDetails.title,
            quantity: 1,
            price: productDetails.price,
            ageCategory: productDetails.ageCategory,
            productImage: productDetails.productImages?.[0].imageUrl,
            productDetails: productDetails.details,
          })
        );
        if (response.payload) {
          setShowAddToCartModal(true);
        }
        setIsLoading(false);
      } else {
        toast.error("User ID is missing");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error while adding to cart", error);
      toast.error("Error while adding to cart");
      setIsLoading(false);
    }
  };

  const handleBuyNow = async (
    e: React.MouseEvent<HTMLButtonElement>,
    product: ProductBase
  ) => {
    e.stopPropagation();
    const token = await getToken();
    if (!token) {
      setIsLoading(false);
      setShowLoginModal(true);
      return;
    }
    // handleAddtoCart(event)
    navigate(`/order-summary?productId=${product._id}`, { replace: true });
  };

  return (
    <div
      className="p-2 overflow-hidden transition-shadow duration-300 hover:shadow-xl"
      id={`product-${productDetails.title.replace(
        /\s*\(\d+-\d+\)\s*years/,
        ""
      )}`}
      onClick={() => navigate(`/mentoons-store/product/${productDetails._id}`)}
    >
      <motion.div
        className="flex flex-col h-full cursor-pointer"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="relative h-64 overflow-hidden">
          <img
            src={productDetails?.productImages?.[0]?.imageUrl}
            alt={productDetails.title}
            className="object-contain w-full h-full"
          />
          <div className="absolute bottom-0 right-1">
            {(productDetails?.title ===
              "Conversation Starter Cards (6-12) years" ||
              productDetails?.title === "Silent Stories (6-12) years") &&
              productDetails?.ageCategory === "6-12" && (
                <a
                  href={`${
                    productDetails?.title ===
                    "Conversation Starter Cards (6-12) years"
                      ? "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/freeDownloads/Coversation+starter+cards+6-12+free.pdf"
                      : "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/freeDownloads/Silent+story+6-12+free.pdf"
                  }`}
                  download
                  className="px-2 py-1 ml-4 text-xs font-bold text-green-700 transition-all duration-200 bg-green-200 border border-green-300 rounded-sm shadow-lg hover:opacity-55"
                >
                  Download Free Sample
                </a>
              )}
            {productDetails.type === "comic" ? (
              <span className="px-2 py-1 text-sm text-yellow-700 bg-yellow-300 rounded w-fit">
                E-comic
              </span>
            ) : (
              productDetails.type === "audio comic" && (
                <span className="px-2 py-1 text-sm rounded bg-rose-300 text-rose-700 w-fit">
                  Audio comic
                </span>
              )
            )}
            {productDetails.type === ProductType.PODCAST && (
              <span className="px-2 py-1 text-sm text-orange-600 bg-orange-200 rounded w-fit">
                Podcast
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-grow p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold line-clamp-1">
              {productDetails.title}
            </h3>

            <p className="font-bold text-primary whitespace-nowrap">
              {productDetails.price === 0 ? (
                <span className="p-1 px-2 text-green-600 bg-green-200 rounded-sm shadow-lg">
                  Free
                </span>
              ) : (
                `₹ ${productDetails.price}`
              )}
            </p>
          </div>

          <p className="mb-2 text-sm text-gray-500 line-clamp-2">
            {productDetails?.description}
          </p>

          <div className="mb-4">
            <Rating ratings={productDetails.rating || 4.5} />
          </div>

          {productDetails.price === 0 ? (
            <button
              onClick={() => {
                if ("sampleUrl" in productDetails.details) {
                  window.open(productDetails.details.sampleUrl, "_blank");
                }
              }}
              className="flex justify-center w-full py-2 mt-20 font-medium text-white transition-colors bg-green-500 rounded items-cnerter pcenterx-4 hover:bg-primary-dark"
            >
              Download For Free
            </button>
          ) : (
            <div className="flex flex-col gap-2 mt-auto">
              <button
                className="flex items-center justify-center gap-4  w-full px-4 py-2 font-medium transition-colors border rounded bg-[#ff9800] text-white hover:bg-[#e68900]"
                onClick={(e) => handleAddtoCart(e)}
                disabled={isLoading}
              >
                <FaShoppingCart className="w-4 h-4 inline-block self-center " />
                {isLoading ? "Adding..." : "Add to Cart"}
              </button>

              <button
                className="flex items-center justify-center gap-4 w-full px-4 py-2 font-medium transition-colors rounded text-[#ff9800] border border-[#ff9800] hover:bg-[#fff3e0]  duration-200"
                onClick={(e) => handleBuyNow(e, productDetails)}
                disabled={isLoading}
              >
                <FaBolt className="w-4 h-4 inline-block self-center " />
                {isLoading ? "Buying..." : "Buy Now"}
              </button>
            </div>
          )}
        </div>
      </motion.div>
      {showAddToCartModal && (
        <AddToCartModal
          onClose={() => setShowAddToCartModal(false)}
          isOpen={showAddToCartModal}
          productName={productDetails.title}
        />
      )}
      {
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      }
    </div>
  );
};

export default ProductCard;

const Rating = ({ ratings }: { ratings: number }) => {
  return (
    <div className="flex items-center justify-between gap-4 mt-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const rating = ratings;
          const filled = star <= Math.floor(rating);
          const partial = !filled && star <= Math.ceil(rating);
          const percentage = partial ? (rating % 1) * 100 : 0;

          return (
            <div key={star} className="relative">
              <svg
                className="w-8 h-8 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>

              <div
                className="absolute top-0 left-0 overflow-hidden"
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
