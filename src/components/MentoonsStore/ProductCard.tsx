import { addItemCart } from "@/redux/cartSlice";
import type { AppDispatch } from "@/redux/store";
import { ProductBase } from "@/types/productTypes";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { IoIosCart } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ProductCard = ({ productDetails }: { productDetails: ProductBase }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { getToken, userId } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  console.log(
    "id contain : ",
    `product-${productDetails.title.replace(/\s*\(\d+-\d+\)\s*years/, "")}`
  );

  const handleAddtoCart = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Please login to add to cart");
        setIsLoading(false);
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
          toast.success(" Item Added to cart");
          navigate("/cart");
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

  const handleBuyNow = async (productDetail: ProductBase) => {
    const token = await getToken();
    if (!token) {
      toast.error("Please login to add to cart");
      setIsLoading(false);
      return;
    }
    navigate("/order-summary", { state: productDetail });
  };

  return (
    <div
      className="  overflow-hidden hover:shadow-xl transition-shadow duration-300 p-2"
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
        <div className="relative overflow-hidden h-64">
          <img
            src={productDetails?.productImages?.[0]?.imageUrl}
            alt={productDetails.title}
            className="object-contain w-full h-full"
          />
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold line-clamp-1">
              {productDetails.title}
            </h3>
            <span className="text-primary font-bold">
              ₹{productDetails.price}
            </span>
          </div>

          <p className="text-gray-500 text-sm mb-2 line-clamp-2">
            {productDetails?.description}
          </p>

          <div className="mb-4">
            <Rating ratings={productDetails.rating || 4.5} />
          </div>

          <div className="flex flex-col gap-2 mt-auto">
            <button
              className="flex justify-center items-center px-4 py-2 w-full font-medium text-primary border border-primary rounded hover:bg-primary/10 transition-colors"
              onClick={(e) => handleAddtoCart(e)}
              disabled={isLoading}
            >
              <IoIosCart className="mr-2 w-5 h-5" />
              {isLoading ? "Adding..." : "Add to Cart"}
            </button>

            <button
              className="flex justify-center items-center px-4 py-2 w-full font-medium text-white bg-primary rounded hover:bg-primary-dark transition-colors"
              onClick={() => handleBuyNow(productDetails)}
              disabled={isLoading}
            >
              Buy Now
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductCard;

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
