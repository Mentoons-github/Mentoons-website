import {
  getCart,
  removeItemFromCart,
  updateItemQuantity,
} from "@/redux/cartSlice";
import { AppDispatch } from "@/redux/store";
import { useAuth } from "@clerk/clerk-react";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
// import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface CartItem {
  productId: {
    _id: string;
    productTitle: string;
    productSummary: string;
    productImage: string;
  };
  price: number;
  stock: "In Stock" | "Out of Stock";
  quantity: number;
}

const CartItemCard = ({ cartItem }: { cartItem: CartItem }) => {
  const [quantity, setQuantity] = useState(cartItem.quantity);
  const dispatch = useDispatch<AppDispatch>();
  const { getToken, userId } = useAuth();

  const handleRemoveItemFromCart = async () => {
    console.log("Remove Item from Cart", cartItem);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Please login to remove the item from the cart");
        return;
      }

      if (userId) {
        const result = await dispatch(
          removeItemFromCart({
            token,
            userId,
            productId: cartItem.productId._id,
          })
        );
        console.log("Remove Item Result", result);
      } else {
        toast.error("Please login to remove the item from the cart");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove the item from the cart");
    }
  };

 

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
            flag
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
    }
      );
  
  };

  return (
    <div className="p-4 bg-white shadow-2xl rounded-3xl w-full border-4">
      {/* <!-- Product Card --> */}
      <div className="flex flex-col md:flex-row gap-4 items-start w-full">
        <div className="relative border rounded-lg overflow-hidden flex items-center">
          <img
            src="https://via.placeholder.com/400x300"
            alt="product"
            className="w-48 h-40 object-cover"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="text-2xl font-bold text-gray-800 flex flex-col items-start">
            <div className="flex items-center justify-between w-full">
              <p>{cartItem?.productId?.productTitle}</p>

              <button
                className=" p-2 text-gray-400 border rounded-xl hover:bg-black hover:text-white transition duration-300"
                onClick={handleRemoveItemFromCart}
              >
                <MdDelete />
              </button>
            </div>
            <p className="text-[16px] text-ellipsis line-clamp-2 text-neutral-400 font-normal">
              {cartItem.productId.productSummary}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-2">
                <button
                  disabled={quantity === 1}
                  onClick={()=>handleUpdateQuantity("-")}
                  className="p-2 rounded-full border hover:bg-black hover:text-white transition all duration-300 disabled:opacity-50  "
                >
                  <Minus
                    className={`w-4 h-4 ${
                      quantity === 1 ? "text-gray-400" : "text-black"
                    }`}
                  />
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                  onClick={()=>handleUpdateQuantity("+")}
                  className="p-2 rounded-full border hover:bg-black hover:text-white transition all duration-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="self-end font-bold text-xl">₹ {cartItem.price}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
