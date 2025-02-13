import { addItemCart, getCart } from "@/redux/cartSlice";
import type { AppDispatch } from "@/redux/store";
import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface ProductImage {
  imageSrc: string;
}
export interface ProductReviews {
  id: string;
  quote: string;
  author: string;
}

export interface ProductVidoes {
  videoSrc: string;
}

export interface DescriptionItem {
  label: string;
  descriptionList: [{ description: string }];
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
  productVideos: ProductVidoes[];
  productDescription: DescriptionItem[];
  productReview: ProductReviews[];
}

const ProductCard = ({ productDetails }: { productDetails: ProductDetail }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { getToken, userId } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddtoCart = async () => {
    console.log("add to cart called");
    try {
      if (isLoading) return;

      const token = await getToken();
      if (!token) {
        toast.error("Please login to add to cart");
        return;
      }

      if (userId) {
        setIsLoading(true);
        const result = await dispatch(
          addItemCart({
            token,
            userId,
            productId: productDetails._id,
            quantity: 1,
            price: parseInt(productDetails.paperEditionPrice),
          }),
        ).unwrap();

        console.log("Add to Cart Result", result);

        if (result) {
          toast.success("Item Added to cart");
          dispatch(getCart({ token, userId }));
        } else {
          toast.error("Failed to add to cart");
        }
      } else {
        toast.error("User ID is missing");
      }
    } catch (error) {
      console.error("Error while adding to cart", error);
      toast.error("Error while adding to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = () => {
    handleAddtoCart();
    navigate("/cart");
  };

  return (
    <div className="bg-amber-50 border-[4px] group hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl  ">
      <Link
        to={`/mentoons-store/product/${productDetails?._id}`}
        state={{ productDetails }}
        className="flex"
      >
        <div className=" p-2 py-3 rounded-2xl ">
          <div>
            <div className="border-2 rounded-xl flex items-center justify-center ">
              <img
                src={productDetails.productImages[0]?.imageSrc}
                alt=""
                className="w-64 object-cover "
              />
            </div>
            <div className=" ">
              <div className="w-72 p-2  flex flex-col  justify-between">
                <div className="flex  items-start justify-between gap-4">
                  <h1 className="text-2xl font-bold ">
                    {productDetails.productTitle}
                  </h1>
                  <p className="font-bold text-lg text-black whitespace-nowrap">
                    ₹ {productDetails.paperEditionPrice}
                  </p>
                </div>
                <h2 className="text-zinc-700 w-full line-clamp-5 ">
                  {productDetails.productSummary}
                </h2>
              </div>
              <div className="flex items-center justify-between p-2">
                <span className="text-md font-semibold text-zinc-700">
                  {" "}
                  Rating: ⭐️⭐️⭐️⭐️
                </span>
                <span className="text-md font-semibold text-zinc-700">
                  {productDetails.rating}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <div className="flex items-center  justify-between gap-2 px-3 pb-3 ">
        <button
          className="px-5 py-3  border font-semibold border-black/30 rounded-full bg-white/60"
          onClick={handleAddtoCart}
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add to cart"}
        </button>
        <button
          className="px-5 py-3 border font-semibold bg-green-300 rounded-full border-green-300"
          onClick={handleBuyNow}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
