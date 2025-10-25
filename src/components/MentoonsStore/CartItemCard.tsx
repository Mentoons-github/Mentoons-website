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
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface CartItem {
  productId: string;
  productType: string;
  title: string;
  ageCategory?: string;
  productImage?: string;
  cardType?: string;
  quantity: number;
  price: number;
  productDetails?: any;
}

const CartItemCard = ({ cartItem }: { cartItem: CartItem }) => {
  const [quantity, setQuantity] = useState(cartItem?.quantity);
  const dispatch = useDispatch<AppDispatch>();
  const { getToken, userId } = useAuth();

  const handleRemoveItemFromCart = async () => {
    try {
      const token = await getToken();
      if (!token || !userId) {
        toast.error("Please login to remove the item from the cart");
        return;
      }

      await dispatch(
        removeItemFromCart({
          token,
          userId,
          productId: cartItem.productId,
        })
      ).unwrap();

      dispatch(getCart({ token, userId }));
      toast.success("Item removed from cart successfully");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove the item from the cart");
    }
  };

  const handleUpdateQuantity = async (flag: string) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Please login to update cart");
        return;
      }

      const newQuantity =
        flag === "+" ? quantity + 1 : Math.max(1, quantity - 1);

      if (newQuantity === quantity) return;

      if (userId) {
        const result = await dispatch(
          updateItemQuantity({
            token,
            userId,
            productId: cartItem.productId,
            quantity: newQuantity,
          })
        ).unwrap();

        if (result) {
          await dispatch(getCart({ token, userId }));
          setQuantity(newQuantity);
        }
      } else {
        toast.error("Please login to update the cart");
      }
    } catch (error) {
      console.error("Error while updating the cart", error);
      toast.error("Error while updating the quantity");
    }
  };

  return (
    <div className="w-full p-4 bg-white border-4 shadow-2xl rounded-3xl">
      <div className="flex flex-col items-start w-full gap-4 md:flex-row">
        <div className="relative flex items-center overflow-hidden border rounded-lg">
          <img
            src={cartItem?.productImage}
            alt="product"
            className="object-cover w-48 h-40"
          />
        </div>
        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-col items-start text-2xl font-bold text-gray-800">
            <div className="flex items-center justify-between w-full">
              <p>{cartItem?.title}</p>
              <button
                className="p-2 text-gray-400 transition duration-300 border rounded-xl hover:bg-black hover:text-white"
                onClick={handleRemoveItemFromCart}
              >
                <MdDelete />
              </button>
            </div>
            <p className="text-[16px] text-ellipsis line-clamp-2 text-neutral-400 font-normal">
              {cartItem.productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                {quantity === 1 ? (
                  <button
                    onClick={handleRemoveItemFromCart}
                    className="p-2 text-gray-400 transition duration-300 border rounded-full hover:bg-black hover:text-white"
                  >
                    <MdDelete className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateQuantity("-")}
                    className="p-2 transition duration-300 border rounded-full hover:bg-black hover:text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}
                <span className="w-8 text-center">{quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity("+")}
                  className="p-2 transition duration-300 border rounded-full hover:bg-black hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="self-end text-xl font-bold">₹ {cartItem.price}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
