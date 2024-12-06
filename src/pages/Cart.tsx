// import Carts from "@/components/MentoonsStore/Carts";
// import {
//   removeFromCartReducer,
//   updateComicQuantityReducer,
// } from "@/redux/comicSlice";
// import { RootState } from "@/redux/store";
// import React, { ChangeEvent } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const Cart: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const cartData = useSelector((store: RootState) => store.comics.cart);
//   const totalPrice = cartData.reduce((acc, curr) => curr.price + acc, 0);
//   // const updateQuantity = (e: ChangeEvent<HTMLInputElement>, img: string) => {
//   //   const val = Number(e.target.value);
//   //   dispatch(updateComicQuantityReducer({ image: img, quantity: val }));
//   // };

//   // const removeComic = (image: string) => {
//   //   dispatch(removeFromCartReducer(image));
//   // };

//   return (
//     <div className="container py-10 lg:py-20 space-y-10 ">
//       <div className="text-start pb-3  border-b border-black">
//         <div className="text-5xl lg:text-7xl w-full font-extrabold leading-[1.10]">
//           Checkout Your Cart
//         </div>
//       </div>
//       <div
//         className={`relative ${
//           cartData.length > 0 && "border-b border-black"
//         } pb-14 flex flex-col justify-between w-full gap-20`}
//       >
//         {cartData.length !== 0 ? (
//           <div className="lg:absolute lg:left-[50%] top-[10%] lg:top-[80%] lg:translate-x-[-50%] lg:translate-y-[0%] text-center space-y-4">
//             <div className="text-4xl text-center lg:text-4xl font-semibold">
//               No Comics Found! 🥺
//             </div>
//             <div className="text-gray-500 text-lg">
//               Try adding some comics in wishlist
//             </div>
//             <button
//               onClick={() => navigate("/comics-list")}
//               className="bg-primary hover:scale-105 active:scale-95 transition-all ease-in-out duration-300 text-white px-6 py-3 rounded-full"
//             >
//               View Comics
//             </button>
//           </div>
//         ) : (
//           <div className="flex flex-wrap gap-4">
//             <div className="w-full flex flex-col gap-4  md:flex-[0.7]">
//               {" "}
//               <Carts />
//               <Carts />
//               <Carts />
//               <Carts />
//             </div>
//             <div className=" w-full h-48 flex  md:flex-[0.3] border  bg-white rounded-lg shadow-2xl p-4 pl-6 ">
//               <h1 className="text-2xl font-semibold ">Your Subtotal: ₹ 199</h1>
//             </div>
//           </div>
//         )}
//       </div>
//       {cartData.length > 0 && (
//         <div className="flex items-center justify-end">
//           <div className="text-white cursor-pointer hover:bg-white hover:text-primary border border-primary px-5 py-3 rounded-full bg-primary">
//             Pay Rs. {totalPrice}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;
