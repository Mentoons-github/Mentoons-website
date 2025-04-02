import ProductCard from "@/components/MentoonsStore/ProductCard";
import AddToCartModal from "@/components/modals/AddToCartModal";
import EnquiryModal from "@/components/modals/EnquiryModal";
import FAQCard from "@/components/shared/FAQSection/FAQCard";
import { WORKSHOP_FAQ } from "@/constant";
import { addItemCart, getCart, updateItemQuantity } from "@/redux/cartSlice";
import { fetchProductById, fetchProducts } from "@/redux/productSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { ProductBase } from "@/types/productTypes";
import { ModalMessage } from "@/utils/enum";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { BiSolidMessage } from "react-icons/bi";
import { IoIosCart } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const ProductDetails = () => {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();
  const { getToken, userId } = useAuth();
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [message, setMessage] = useState<string>("");

  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductBase>();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) {
          toast.error("Product ID is missing");
          return;
        }
        const productResponse = await dispatch(fetchProductById(productId));
        console.log("ProductResponse", productResponse.payload);
        if (
          typeof productResponse.payload === "object" &&
          productResponse.payload !== null
        ) {
          setProduct(productResponse.payload as ProductBase);
        } else {
          console.error(
            "Invalid product data received",
            productResponse.payload
          );
          toast.error("Failed to fetch product details");
        }
      } catch (error) {
        console.error("Error fetching product details", error);
        toast.error("Failed to fetch product details");
      }
    };
    fetchProduct();
  }, [dispatch, productId]);

  const {
    items: recommendedProducts,
    loading,
    error,
  } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    const RecommendedProducts = async () => {
      try {
        const recommendedProducts = await dispatch(fetchProducts({}));
        console.log("Recommended Products", recommendedProducts.payload);
      } catch (error) {
        console.error("Error fetching recommended products", error);
        toast.error("Failed to fetch recommended products");
      }
    };
    RecommendedProducts();
  }, [product, dispatch]);

  const handleUpdateQuantity = async (flag: string, id: string) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Please login to update cart");
        return;
      }

      // Calculate new quantity
      const newQuantity =
        flag === "+" ? quantity + 1 : Math.max(1, quantity - 1);

      // If no change in quantity (trying to decrease below 1), return early
      if (newQuantity === quantity) return;

      if (userId) {
        const result = await dispatch(
          updateItemQuantity({
            token,
            userId,
            productId: id,
            quantity: newQuantity,
          })
        ).unwrap();

        // Check if the update was successful
        if (result.payload) {
          // Refresh cart data
          await dispatch(getCart({ token, userId }));
          setQuantity(newQuantity);
          toast.success("Cart updated successfully");
        } else {
          toast.error("Failed to update cart");
        }
      } else {
        toast.error("Please login to update the cart");
      }
    } catch (error) {
      console.error("Error while updating the cart", error);
      toast.error("Error while updating the quantity");
    }
  };
  const handleAddtoCart = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();

    try {
      const token = await getToken();
      if (!token) {
        toast.error("Please login to add to cart");
        return;
      }

      if (!product) {
        toast.error("Product details not available");
        return;
      }

      if (userId) {
        const response = await dispatch(
          addItemCart({
            token,
            userId,
            productId: product._id,
            productType: product.type,
            title: product.title,
            quantity: 1,
            price: product.price,
            ageCategory: product.ageCategory,
            productImage: product.productImages?.[0].imageUrl,
            productDetails: product.details,
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

  const handleBuyNow = async (product: ProductBase) => {
    const token = await getToken();
    if (!token) {
      toast.error("Please login to add to cart");
      setIsLoading(false);
      return;
    }
    // handleAddtoCart(event)
    navigate(`/order-summary?productId=${product._id}`, { replace: true });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const queryResponse = await axios.post(
        "https://mentoons-backend-zlx3.onrender.com/api/v1/query", // Fixed the endpoint URL
        {
          message: message,
        }
      );
      console.log(queryResponse);
      if (queryResponse.status === 201) {
        setShowEnquiryModal(true);
      }
    } catch (error) {
      toast.error("Failed to submit message");
    }
  };

  if (loading || !product) {
    return (
      <div className="w-[90%] mx-auto my-20 animate-pulse">
        <div className="flex flex-col md:flex-row h-auto md:h-[600px] gap-4 md:gap-8">
          <div className="flex flex-col flex-1 pb-3">
            <div className="w-32 h-8 mb-2 bg-gray-200 rounded-full"></div>
            <div className="h-16 mb-4 bg-gray-200 rounded-lg"></div>
            <div className="h-20 w-[90%] bg-gray-200 rounded-lg"></div>
          </div>
          <div className="flex-1 h-[300px] bg-gray-200 rounded-lg"></div>
        </div>

        <div className="mt-8">
          <div className="w-24 h-6 mb-4 bg-gray-200 rounded"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-8 bg-gray-200 rounded-full"></div>
              ))}
            </div>
            <div className="w-12 h-6 bg-gray-200 rounded"></div>
          </div>
          <div className="w-24 h-8 mb-8 bg-gray-200 rounded"></div>

          <div className="flex gap-4 mb-8">
            <div className="flex-1 h-12 bg-gray-200 rounded"></div>
            <div className="flex-1 h-12 bg-gray-200 rounded"></div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[90%] mx-auto my-20 text-center">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold text-red-600">
            Error Loading Product
          </h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 text-white rounded-lg bg-primary hover:bg-primary-dark"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[90%] mx-auto my-20 ">
      <div className="flex flex-col md:flex-row h-auto md:h-[600px]   rounded-2xl gap-4 md:gap-8 ">
        <div className="flex flex-col flex-1 pb-3">
          <span className="px-4 py-1 mb-2 text-sm font-bold text-white rounded-full sm:px-6 sm:py-2 sm:text-lg md:text-2xl bg-primary w-fit">
            For {product?.ageCategory}
          </span>
          <h1 className="pb-2 text-2xl font-bold leading-tight sm:text-3xl md:text-5xl lg:text-6xl">
            {product?.title}
          </h1>
          <p className="pb-4 text-xs sm:text-sm md:text-base lg:text-lg w-full md:w-[90%]">
            {product?.description}
          </p>
        </div>
        <div className="flex items-center justify-center flex-1 w-full h-[200px] sm:h-[300px] md:h-auto ">
          <img
            src={product?.productImages?.[0]?.imageUrl}
            alt={product?.title || "Product image"}
            className="object-contain w-full h-full md:object-cover"
          />
        </div>
      </div>

      <div className="border-gray-200">
        <span className="font-semibold text-gray-500">Mentoons</span>

        <Rating ratings={Number(product?.rating)} />
        <p className="my-2 text-lg font-semibold text-neutral-800">
          {" "}
          ₹ {product?.price}{" "}
          {(product?.title === "Conversation Starter Cards (6-12) years" ||
            product?.title === "Silent Stories (6-12) years") &&
            product?.ageCategory === "6-12" && (
              <a
                href={`${
                  product?.title === "Conversation Starter Cards (6-12) years"
                    ? "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/freeDownloads/Coversation+starter+cards+6-12+free.pdf"
                    : "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/freeDownloads/Silent+story+6-12+free.pdf"
                }`}
                download
                className="px-4 py-3 ml-4 text-white transition-all duration-200 bg-orange-500 rounded-full hover:opacity-55"
              >
                Download Free Sample
              </a>
            )}
        </p>

        {/* <p>{product?.description}</p> */}
        {/* Quantitu */}

        <div className="flex items-center justify-between gap-2 pb-4">
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <button
                disabled={quantity === 1}
                onClick={() => handleUpdateQuantity("-", product._id)}
                className="p-2 transition duration-300 border rounded-full hover:bg-black hover:text-white all disabled:opacity-50 "
              >
                <Minus
                  className={`w-4 h-4  font-bold flex${
                    quantity === 1 ? "text-gray-400" : ""
                  } `}
                />
              </button>
              <span className="w-8 font-bold text-center">{quantity}</span>
              <button
                onClick={() => handleUpdateQuantity("+", product._id)}
                className="p-2 transition duration-300 border rounded-full hover:bg-black hover:text-white all"
              >
                <Plus className="w-4 h-4 font-bold" />
              </button>
            </div>
          </div>
        </div>

        {/* Buy Now Button */}
        <div className="flex flex-col w-full gap-4 mt-4">
          <button
            className="flex items-center justify-center w-full px-4 py-2 font-medium transition-colors border rounded text-primary border-primary hover:bg-primary/10"
            onClick={(e) => handleAddtoCart(e)}
            disabled={isLoading}
          >
            <IoIosCart className="w-5 h-5 mr-2" />
            {isLoading ? "Adding..." : "Add to Cart"}
          </button>

          <button
            className="flex items-center justify-center w-full px-4 py-2 font-medium text-white transition-colors rounded bg-primary hover:bg-primary-dark"
            onClick={() => handleBuyNow(product)}
            disabled={isLoading}
          >
            Buy Now
          </button>
        </div>

        {/* Separator */}
        <div className="w-full h-[1.25px] my-12 mb-8 bg-primary" />

        {/* Product description */}
        <div className="text-lg font-medium text-neutral-800">
          {/* use map here */}
          <div className="flex ">
            <div className="flex-1 ">Language:</div>
            <div className="flex-1">English</div>
          </div>
          <div className="flex pt-2 ">
            <div className="flex-1">Print Length:</div>
            <div className="flex-1">10 pages</div>
          </div>
          <div className="flex pt-2 ">
            <div className="flex-1">Launch date:</div>
            <div className="flex-1">January 3, 2025</div>
          </div>
          <div className="flex pt-2 ">
            <div className="flex-1 ">Reading age:</div>
            <div className="flex-1">17 - 19</div>
          </div>
          <div className="flex py-2">
            <div className="flex-1">Dimensions:</div>
            <div className="flex-1">6 x 18 x 9 inches</div>
          </div>
        </div>

        {/* You may also like this section */}

        <div className="w-full p-4 mt-4 ">
          <h2 className="mb-8 text-4xl font-semibold">
            You will also like this -
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-auto">
            {recommendedProducts?.length > 0 ? (
              recommendedProducts.map((product) => {
                // Ensure all required properties are present before passing to ProductCard

                return (
                  <div className="flex justify-center w-full" key={product._id}>
                    <ProductCard productDetails={product} />
                  </div>
                );
              })
            ) : (
              <div>No Product found</div>
            )}
          </div>
        </div>

        {/* Frequently asked questions */}
        <div className="pt-10 ">
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
                  <form
                    className="flex flex-col w-full gap-10"
                    onSubmit={(e) => handleSubmit(e)}
                  >
                    <textarea
                      name="doubt"
                      id="doubt"
                      placeholder="Enter your doubt here"
                      className="box-border w-full p-3 rounded-lg shadow-xl border-2 border-[#60C6E6]"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      // style={{
                      //   border: `2px solid ${workshop.registerFormbgColor}`,
                      // }}
                    ></textarea>

                    <button
                      className="w-full py-3 mt-4 text-xl font-semibold text-white transition-all duration-200 rounded-lg shadow-lg text- text-ellipsist-white bg-primary "
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
      {showAddToCartModal && (
        <AddToCartModal
          onClose={() => setShowAddToCartModal(false)}
          isOpen={showAddToCartModal}
          productName={product.title}
        />
      )}
      {showEnquiryModal && (
        <EnquiryModal
          isOpen={showEnquiryModal}
          onClose={() => setShowEnquiryModal(false)}
          message={ModalMessage.ENQUIRY_MESSAGE}
        />
      )}
    </div>
  );
};

export default ProductDetails;

const Rating = ({ ratings }: { ratings: number }) => {
  return (
    <div className="flex items-center gap-4 mt-2">
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
      <span className="font-semibold text-gray-500 ">{ratings}</span>
    </div>
  );
};
