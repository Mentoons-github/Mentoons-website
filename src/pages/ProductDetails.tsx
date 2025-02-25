import FAQCard from "@/components/shared/FAQSection/FAQCard";
import { PRODUCT_DATA, WORKSHOP_FAQ } from "@/constant";
import { getCart, updateItemQuantity } from "@/redux/cartSlice";
import { AppDispatch } from "@/redux/store";
import { useAuth } from "@clerk/clerk-react";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { BiSolidMessage } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const ProductDetails = () => {
  const cartItem = {
    productId: {
      _id: "1",
      productTitle: "Product Title",
      productSummary: "Product Summary",
      productImages: "Product Images",
    },
    price: 199,
    stock: "In Stock",
    quantity: 1,
  };
  const { productId, category } = useParams();
  const [quantity, setQuantity] = useState(cartItem.quantity);
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();
  const { getToken, userId } = useAuth();
  console.log("Cart Item", cartItem, productId);
  const navigate = useNavigate();

  // const handleRemoveItemFromCart = async () => {
  //   console.log("Remove Item from Cart", cartItem);
  //   try {
  //     const token = await getToken();
  //     if (!token) {
  //       toast.error("Please login to remove the item from the cart");
  //       return;
  //     }

  //     if (userId) {
  //       const result = await dispatch(
  //         removeItemFromCart({
  //           token,
  //           userId,
  //           productId: cartItem.productId._id,
  //         })
  //       );
  //       console.log("Remove Item Result", result);
  //       dispatch(getCart({ token, userId }));
  //     } else {
  //       toast.error("Please login to remove the item from the cart");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to remove the item from the cart");
  //   }
  // };

  const handleUpdateQuantity = async (flag: string) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Please login to add to cart");
        return;
      }
      if (userId) {
        const result = await dispatch(
          updateItemQuantity({
            token,
            userId,
            productId: cartItem.productId._id,
            flag,
          })
        );
        dispatch(getCart({ token, userId }));
        console.log("Update Quantity Result", result);
        toast.success("Item quantity updated");
      }
    } catch (error) {
      console.error("Error while updating the cart", error);
      toast.error("Error while updating the quantity");
    }
    setQuantity((prev) => {
      if (flag === "+") {
        return prev + 1;
      } else {
        if (prev === 1) {
          return prev;
        } else {
          return prev - 1;
        }
      }
    });
  };
  return (
    <div className="w-[90%] mx-auto my-20 ">
      <div
        className="flex h-[240px] sm:h-[500px] md:h-[600px] p-4 sm:p-8 md:p-12 rounded-2xl "
        // style={{ backgroundColor: product.accentColor }}
      >
        <div className="flex flex-col flex-1 pb-3 pl-1">
          <span className="px-6 py-2 mb-2 text-2xl font-bold text-white rounded-full p bg-primary w-fit">
            For 6-12
          </span>
          <h1 className="pb-2 text-3xl font-bold sm:text-4xl md:text-6xl lg:text-8xl leading-wider line-clamp-2">
            {category?.toLocaleUpperCase()}
          </h1>
          <p className="pb-4 text-sm sm:text-lg leading-tight w-[90%] line-clamp-3">
            Help you kid overcom the fear of express themeselves
          </p>
        </div>
        <div className="flex items-center justify-center flex-1 w-full">
          <img
            src="/assets/productv2/conversation-starter-cards-13-16.png"
            alt=""
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <div className="border-gray-200 rder mt">
        <span className="font-semibold text-gray-500">Creator Name</span>
        <Rating ratings={2} />
        <p className="my-2 text-lg font-semibold text-neutral-800"> ₹ 199 </p>
        <p>
          Blandit et vestibulum elementum euismod dictum eget placerat egestas
          nisi metus et, eu This is a very brief description about the product.
          All the details of the product is listed below separately{" "}
        </p>
        {/* Quantitu */}

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <button
                disabled={quantity === 1}
                onClick={() => handleUpdateQuantity("-")}
                className="p-2 transition duration-300 border rounded-full hover:bg-black hover:text-white all disabled:opacity-50 "
              >
                <Minus
                  className={`w-4 h-4 ${quantity === 1 ? "text-gray-400" : ""}`}
                />
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                onClick={() => handleUpdateQuantity("+")}
                className="p-2 transition duration-300 border rounded-full hover:bg-black hover:text-white all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="self-end text-xl font-bold">₹ {cartItem.price}</p>
        </div>

        {/* Buy Now Button */}
        <div className="w-full">
          <button className="w-full px-6 py-2 mt-4 text-xl font-semibold text-white bg-primary">
            Buy Now
          </button>
        </div>

        {/* Separator */}
        <div className="w-full h-[1.25px] my-12 mb-8 bg-primary" />

        {/* Product description */}
        <div className="text-lg font-medium utral-800">
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
        <div className="pt-20 ">
          <h3 className="pb-6 text-4xl font-semibold ">
            You will also like this -
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {PRODUCT_DATA.map((product) => (
              <div
                className="flex flex-col cursor-pointer"
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
                  className="w-full "
                >
                  <img
                    src={product.imageUrl}
                    alt="comic 1"
                    className="object-cover w-full border rounded-lg"
                  />
                </div>
                <h3 className="pt-4 text-xl font-semibold text-neutral-700">
                  {product.title}
                </h3>
                {/* <p className="pt-2 text-gray-500">{product.description}</p> */}
                <p className="py-2 text-xl font-semibold text-primary">
                  ₹ {product.price}
                </p>
                <button
                  className="w-full px-6 py-2 font-semibold text-white bg-primary"
                  // style={{ backgroundColor: `${product.accentColor}` }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
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
                  <form action=" w-full flex flex-col gap-10">
                    <textarea
                      name="doubt"
                      id="doubt"
                      placeholder="Enter your doubt here"
                      className="box-border w-full p-3 rounded-lg shadow-xl"
                      // style={{
                      //   border: `2px solid ${workshop.registerFormbgColor}`,
                      // }}
                    ></textarea>

                    <button
                      className="w-full py-3 mt-4 text-xl font-semibold transition-all duration-200 rounded-lg shadow-lg text- text-ellipsist-white "
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
      <span className="font-semibold text-gray-500 ">{ratings} / 5</span>
    </div>
  );
};
