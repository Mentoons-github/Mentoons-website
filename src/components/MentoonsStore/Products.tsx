import { addItemCart } from "@/redux/cartSlice";
import type { AppDispatch } from "@/redux/store";
import { useAuth } from "@clerk/clerk-react";
import { Dialog } from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { useState } from "react";
import { BsPlayCircleFill } from "react-icons/bs";
import { FaHandPointRight } from "react-icons/fa";
import { IoShareSocialSharp } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Testimonial from "../common/Testimonial";
import { DialogContent, DialogTrigger } from "../ui/dialog";
interface ProductImage {
  id: number;
  imageSrc: string;
}

interface ProductVideos {
  id: number;
  videoSrc: string;
}
interface ProductReviews {
  id: string;
  quote: string;
  author: string;
}

interface DescriptionItem {
  _id: string;
  label: string;
  descriptionList: [{ _id: string; description: string }];
}

export interface ProductDetail {
  _id: string;
  productTitle: string;
  productCategory: string;
  productSummary: string;
  minAge: number;
  maxAge: number;
  ageFilter: string;
  rating: string;
  paperEditionPrice: string;
  printablePrice: string;
  productImages: ProductImage[];
  productVideos: ProductVideos[];
  productDescription: DescriptionItem[];
  productReview: ProductReviews[];
}
const Product = () => {
  const [quantity, setQuantity] = useState(0);
  const location = useLocation();
  const productDetails = location.state?.productDetails;
  const [activeProdcutImage, setActiveProductImage] = useState(
    productDetails?.productImages[0]?.imageSrc
  );
  const dispatch = useDispatch<AppDispatch>();
  const { userId, getToken } = useAuth();

  //orderDetails
  const handleQuantityDecrement = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const navigate = useNavigate();

  const handlesQuantityIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleAddtoCart = async () => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Please login to add to cart");
        return;
      }
      if (userId) {
        await dispatch(
          addItemCart({
            token,
            userId,
            productId: productDetails._id,
            quantity: quantity,
            price: parseInt(productDetails.paperEditionPrice),
          })
        );
        toast.success("Item Added to cart");
        navigate("/cart");
        //when you click on the buy now the an order summary should be displayed with that product only and also navigate to the order summary page
      } else {
        toast.error("User ID is missing");
      }
    } catch (error) {
      console.error("Error while adding to cart", error);
      toast.error("Error while adding to cart");
    }
  };

  const handleBuyNow = () => {
    handleAddtoCart();
    navigate("/cart");
  };

  return (
    <section className="bg-[linear-gradient(360deg,_#42A0CE_0%,_#034E73_100%)] min-h-screen py-14 pb-0">
      <div className="w-[80%] h-full bg-amber-50  mx-auto p-4 rounded-3xl pb-12">
        <div className=" md:flex">
          <div className="flex-1 gap-2  md:flex md:flex-row-reverse">
            <div className="  flex flex-[0.85] md:py-0 md:pl-0 border-4  border-[#3a2901] items-center justify-center rounded-2xl">
              <img
                src={activeProdcutImage}
                alt="product image"
                className="object-cover w-full"
              />
              {/* <div>
                <ImageMagnifier
                  src={activeProdcutImage}
                  width={100}
                  height={100}
                  magnifierHeight={600}
                  magnifierWidth={600}
                  zoomLevel={1.5}
                />
              </div> */}
            </div>

            <div className="  flex gap-2 flex-[0.15] p-2 md:px-0  overflow-y-auto md:flex-col">
              {productDetails.productImages.map((item: ProductImage) => (
                <div
                  key={item.id + Date.now().toString()}
                  className="border rounded-xl border-[#3a2901] cursor-pointer overflow-hidden w-16 h-16 flex items-center justify-center"
                  onClick={() => setActiveProductImage(item.imageSrc)}
                >
                  <img
                    src={item.imageSrc}
                    alt="product thumbnail"
                    className=""
                  />
                </div>
              ))}
              {productDetails.productVideos.map((item: ProductVideos) => (
                <div key={item.id} className="relative w-full">
                  <Dialog>
                    <DialogTrigger className="relative w-16 h-16 flex items-center justify-center border border-[#3a2901] rounded-xl">
                      <img
                        src="/assets/images/product-card-thumbnail.png"
                        alt=""
                        className="object-cover w-full"
                      />
                      <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                        <BsPlayCircleFill className="text-4xl text-white transition-all duration-300 hover:scale-110 " />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="w-[95%]  md:w-[50%] p-[2px]">
                      <video
                        src={item.videoSrc}
                        controls
                        className="rounded-md"
                      ></video>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 px-2 0 md:px-4">
            <div className="flex items-start justify-between gap-4 py-1 ">
              <h2 className="text-2xl font-bold md:text-5xl">
                {productDetails.productTitle}
              </h2>
              <IoShareSocialSharp className="text-xl md:text-2xl xl:text-4xl" />{" "}
              {/* Add share link  copytoClipboard*/}
            </div>
            <div className="pb-4 md:pt-2">
              <p className="font-semibold text-md md:text-xl">
                Age group : {productDetails.ageFilter}
              </p>
              <div className="flex items-start justify-between md:pt-1">
                <div className="flex items-center gap-3 ">
                  <input type="checkbox" className="" />
                  <span className="md:text-lg">Paper Edition </span>
                </div>
                <p className="font-semibold text-red-600 text-md md:text-xl">
                  ₹ {productDetails.paperEditionPrice}
                </p>
              </div>
              <div className="flex items-center justify-between md:pt-1">
                <div className="flex items-center gap-3 ">
                  <input type="checkbox" />
                  <span className="md:text-xl">Download PDF </span>
                </div>
                <p className="font-semibold text-red-600 text-md md:text-xl ">
                  ₹ {productDetails.printablePrice}
                </p>
              </div>
              <div className="flex items-start justify-between md:pt-1">
                <div className="flex items-start gap-3 ">
                  <FaHandPointRight className="text-2xl" />
                  <p className="md:text-xl">
                    <span className="text-green-500 ">
                      Download 6 cards for free.
                    </span>{" "}
                    Includes total of 30 cards{"  "}
                  </p>
                </div>

                <p className="text-xl font-semibold text-red-600 text-md whitespace-nowrap">
                  ₹ 00.00
                </p>
              </div>
              <div className="flex items-center justify-between pb-6 text-2xl">
                <h2 className="text-xl font-bold">
                  Rating: {productDetails.rating}
                </h2>
                <p> ⭐️⭐️⭐️⭐️ </p>
              </div>
            </div>

            <div className="flex items-start justify-between gap-6 pb-6">
              <div className="flex flex-col p-1 ">
                <p className="font-bold  md:text-xl">Quantity : </p>
                <div className="flex items-center justify-between gap-4 p-1 pt-2 rounded-full">
                  <button
                    className="px-4 font-bold border rounded-full text-md md:text-xl"
                    onClick={handlesQuantityIncrement}
                  >
                    {" "}
                    +{" "}
                  </button>
                  <span className="font-bold text-md md:text-xl">
                    {quantity}
                  </span>
                  <button
                    className="px-4 font-bold border rounded-full  text-md md:text-xl"
                    onClick={handleQuantityDecrement}
                  >
                    {" "}
                    -{" "}
                  </button>
                </div>
              </div>

              <div className="">
                <div className="relative flex flex-col items-center justify-end ">
                  <button className="self-end p-2 py-1 mr-4 text-xs font-semibold text-center border-2 border-purple-600 rounded-lg ">
                    Gift your friend
                  </button>
                  <p className="text-xs text-center md:w-[50%]  mt-1 self-end">
                    Click the above button to send a gift to your friend
                  </p>

                  <motion.div
                    className="absolute right-0 w-12 -top-8"
                    animate={{ scale: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <img
                      src="/assets/images/gift-icon.png"
                      alt="Gift Icon"
                      className="object-cover w-full"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-8 p-1 pb-4 ">
              <button
                className="flex-1 py-2 text-lg font-bold text-white rounded-lg bg-stone-500 md:text-xl"
                onClick={handleAddtoCart}
              >
                Add to Cart
              </button>
              <button
                className="flex-1 py-2 text-lg font-bold text-white bg-red-600 rounded-lg md:text-xl"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>

            <div>
              <p className="text-2xl font-bold md:text-3xl">Description : </p>
              <p className="pb-4 md:text-lg ">
                {productDetails.productSummary}
              </p>
            </div>
          </div>
        </div>
        <div className="">
          <div className="">
            <h2 className="py-6 text-4xl font-bold text-center md:py-12 md:text-5xl md:pb-6">
              {" "}
              How {productDetails.productTitle} helps.
            </h2>
            <div className="mb-6  md:mx-12">
              {/*Add video src */}
              <video
                src={productDetails.productVideos[0].videoSrc}
                autoPlay
                muted
                controls
                playsInline
                webkit-playinline
                className="rounded-3xl border-4 border-[#3a2901]"
              ></video>
            </div>
            <div className="flex flex-col gap-4 px-4 md:flex-row md:gap-4 md:items-start md:justify-center ">
              {productDetails?.productDescriptions &&
                productDetails.productDescriptions.map(
                  (item: DescriptionItem) => (
                    <div
                      className=" flex-1 rounded-xl  md:shadow-2xl bg-gradient-to-bl from-amber-200 to-yellow-500 border-4 border-[#3a2901] relative"
                      key={item._id}
                    >
                      <div className="absolute z-0 top-2 left-32">
                        <img src="/assets/images/kart-star.png" alt="" />
                      </div>
                      <div className="absolute z-0 top-40 left-52">
                        <img
                          src="/assets/images/kart-message-bubble.png"
                          alt=""
                        />
                      </div>
                      <h3 className="text-center text-3xl font-bold text-[#3a2901] py-4  relative z-1">
                        {item.label}
                      </h3>
                      <ul className="relative flex flex-col gap-2 p-2 py-4 pt-0 z-1">
                        {item?.descriptionList?.map(
                          (descriptionItem, index) => (
                            <li
                              className="flex items-start gap-4 px-3 "
                              key={descriptionItem._id}
                            >
                              <img
                                src={`/assets/images/${
                                  index + 1
                                }-illustration.png`}
                                alt=""
                                className=""
                              />
                              <p className="text-xl">
                                {descriptionItem.description}
                              </p>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )
                )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 border border-black">
        <Testimonial />
      </div>
    </section>
  );
};

export default Product;
