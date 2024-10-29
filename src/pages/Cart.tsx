import React, { ChangeEvent } from "react";
import Wordbreak from "@/components/comics/Wordbreak";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { v4 as uuidv4 } from "uuid";
import {
  removeFromCartReducer,
  updateComicQuantityReducer,
} from "@/redux/comicSlice";
import { useNavigate } from "react-router-dom";

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartData = useSelector((store: RootState) => store.comics.cart);
  const totalPrice = cartData.reduce((acc, curr) => curr.price + acc, 0);
  const updateQuantity = (e: ChangeEvent<HTMLInputElement>, img: string) => {
    const val = Number(e.target.value);
    dispatch(updateComicQuantityReducer({ image: img, quantity: val }));
  };

  const removeComic = (image: string) => {
    dispatch(removeFromCartReducer(image));
  };

  return (
    <div className="container py-10 lg:py-20 space-y-10 lg:space-y-20">
      <div className="text-start pb-7 space-y-4 border-b border-black">
        <div className=" text-3xl lineBefore uppercase text-[#d71515]">
          Your Cart{" "}
        </div>
        <div className="text-5xl lg:text-7xl w-full font-extrabold leading-[1.10]">
          Checkout Your <Wordbreak /> Comic Books.
        </div>
      </div>
      <div
        className={`relative ${
          cartData.length > 0 && "border-b border-black"
        } pb-14 flex flex-col justify-between w-full gap-20`}
      >
        {cartData.length <= 0 ? (
          <div className="lg:absolute lg:left-[50%] top-[10%] lg:top-[80%] lg:translate-x-[-50%] lg:translate-y-[0%] text-center space-y-4">
            <div className="text-4xl text-center lg:text-4xl font-semibold">
              No Comics Found! 🥺
            </div>
            <div className="text-gray-500 text-lg">
              Try adding some comics in wishlist
            </div>
            <button
              onClick={() => navigate("/comics-list")}
              className="bg-primary hover:scale-105 active:scale-95 transition-all ease-in-out duration-300 text-white px-6 py-3 rounded-full"
            >
              View Comics
            </button>
          </div>
        ) : (
          cartData?.map((item, idx) => {
            return (
              <div
                key={uuidv4()}
                className="flex items-start justify-between gap-4"
              >
                <div className="flex w-[25%] items-center justify-between gap-8">
                  <div className="text-6xl text-red-500">0{idx + 1}</div>
                  <div>
                    <img
                      className="w-[15rem] rounded-md"
                      src={item?.thumbnail}
                      alt="comic image"
                    />
                  </div>
                </div>
                <div className="w-[30%] space-y-6">
                  <div className="text-xl font-medium text-gray-400">
                    Comic Name
                  </div>
                  <div className="text-4xl tracking-wide">{item?.name}</div>
                </div>
                <div className="w-[15%] space-y-6">
                  <div className="text-xl font-medium text-gray-400">
                    Quantity
                  </div>
                  <input
                    value={item?.quantity}
                    onChange={(e) => updateQuantity(e, item?.thumbnail)}
                    className="w-[7rem] bg-gray-100 px-2 py-4 rounded-sm outline-none border-none"
                    type="number"
                  />
                </div>
                <div className="w-[15%] space-y-6">
                  <div className="text-xl font-medium text-gray-400">Price</div>
                  <div className="text-3xl font-semibold">Rs. {item.price}</div>
                </div>
                <div className="w-[10%] space-y-6">
                  <div className="text-xl font-medium text-gray-400">
                    Action
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <div
                      onClick={() => removeComic(item?.thumbnail)}
                      className="bg-red-500 rounded-full p-2"
                    >
                      <MdDelete className="text-2xl text-white cursor-pointer" />
                    </div>
                  </div>
                </div>
                <div className="w-[10%] space-y-6">
                  <div className="text-xl font-medium text-gray-400">
                    Subtotal
                  </div>
                  <div className="text-3xl font-semibold">
                    Rs. {item?.price}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {cartData.length > 0 && (
        <div className="flex items-center justify-end">
          <div className="text-white cursor-pointer hover:bg-white hover:text-primary border border-primary px-5 py-3 rounded-full bg-primary">
            Pay Rs. {totalPrice}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
