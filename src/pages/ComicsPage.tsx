// import { useAuthHook } from "@/hooks/useAuth";
// import {
//   addToCartReducer,
//   AudioComic,
//   Comic,
//   updateSelectedFilterReducer,
// } from "@/redux/comicSlice";
// import { RootState } from "@/redux/store";
// import React from "react";
// import { FaCartShopping, FaCirclePlay } from "react-icons/fa6";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { v4 } from "uuid";
// import FilterComics from "../components/comics/FilterComics";

// const ComicsPage: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { isLoggedIn } = useAuthHook();
//   const { comics, audioComics, selectedFilter } = useSelector(
//     (store: RootState) => store.comics,
//   );
//   const comicsData = [...comics, ...audioComics];
//   const selectedFilterVariable = selectedFilter;
//   const filteredComics = comicsData?.filter((item: AudioComic | Comic) => {
//     return item.category == selectedFilterVariable;
//   });
//   const comicsToShow = selectedFilter ? filteredComics : comicsData;

//   const addToCart = (image: string) => {
//     const item = comicsData?.find((comic: AudioComic | Comic) => {
//       return comic.thumbnail == image;
//     });
//     dispatch(addToCartReducer(item));
//   };

//   return (
//     <div className="px-5 py-16 space-y-8 md:py-20">
//       <div className="space-y-7">
//         <div className="flex items-center justify-between">
//           {/* <div className="flex items-center gap-1 px-2 py-1 text-black rounded-md shadow-sm bg-gray-50 ">
//           <div
//             onClick={(e: React.MouseEvent<HTMLDivElement>) =>
//               handleChangeComic(e)
//             }
//             className={cn(
//               ` cursor-pointer text-gray-400 px-2 py-1 ${
//                 activeComic === "Audio Comics" && "bg-white text-black"
//               }  rounded-md transition-all ease-in-out duration-300`
//             )}
//           >
//             Audio Comics
//           </div>
//           <div
//             onClick={(e: React.MouseEvent<HTMLDivElement>) =>
//               handleChangeComic(e)
//             }
//             className={cn(
//               ` cursor-pointer text-gray-400 ${
//                 activeComic === "Comics" && "bg-white text-black"
//               } px-2 py-1 rounded-md transition-all ease-in-out duration-300`
//             )}
//           >
//             Comics
//           </div>
//         </div> */}
//           {/* <div className="px-4 py-2 font-semibold text-gray-600 bg-green-200 border-2 border-green-500 rounded-md">
//           Audio Comics
//         </div> */}
//           <div className="text-3xl text-red-500 uppercase lineBefore">
//             Audio Comics
//           </div>
//           <div className="hidden lg:block">
//             <FilterComics />
//           </div>
//         </div>
//         <div className="space-y-8 text-3xl font-medium">
//           <h1 className="text-3xl font-extrabold lg:text-7xl">
//             Experience the magic of{" "}
//             <span className="text-primary md:block md:tracking-widest">
//               storytelling
//             </span>{" "}
//             like never before!
//           </h1>
//           <p className="text-xl md:text-2xl">
//             Our audio comics bring illustrations to life with professional voice
//             acting, sound effects, and music, creating an immersive experience
//             that enhances listening skills and imagination.
//           </p>
//         </div>
//       </div>
//       <div>
//         {comicsToShow.length > 0 ? (
//           <>
//             <div className="block w-full text-center lg:hidden">
//               <FilterComics />
//             </div>
//             <div className="flex flex-wrap gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
//               {comicsToShow?.map((item: AudioComic | Comic) => {
//                 return (
//                   <div
//                     key={v4()}
//                     className="px-5 py-5 space-y-3 text-black bg-white shadow-lg group rounded-2xl"
//                   >
//                     <div className="overflow-hidden rounded-2xl">
//                       <img
//                         // onClick={() =>
//                         //   navigate(`/mentoons-comics/audio-comics/${item.name}`)
//                         // }
//                         className="w-full h-[23rem] lg:h-[16rem] rounded-2xl group-hover:scale-105 transition-all ease-in-out duration-300 cursor-pointer"
//                         src={item?.thumbnail}
//                         alt="comic image"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <div className="text-xl font-semibold tracking-wide">
//                         {item?.name}
//                       </div>
//                       <div className="text-sm tracking-wide text-black">
//                         {item?.desc}
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-between pt-2 border-t border-gray-200">
//                       <div
//                         // onClick={() =>
//                         //   navigate(`/audio-comic?comic=${item.name}`)
//                         // }
//                         className="flex items-center justify-end gap-2 text-xl cursor-pointer text-end group-hover:text-red-500 group-hover:underline"
//                       >
//                         Play Sample{" "}
//                         <FaCirclePlay
//                           className="text-2xl text-red-700 group-hover:text-500"
//                           onClick={() =>
//                             isLoggedIn
//                               ? navigate(
//                                   `/mentoons-comics/audio-comics/${item.name}`,
//                                 )
//                               : navigate("/sign-in")
//                           }
//                         />
//                       </div>
//                       <div
//                         onClick={(e) => {
//                           addToCart(item.thumbnail);
//                           e.stopPropagation();
//                         }}
//                         className="border-2 cursor-pointer hover:rotate-[360deg] transition-all ease-in-out duration-1000 bg-primary active:scale-95 border-primary p-3 rounded-full"
//                       >
//                         <FaCartShopping className="text-2xl text-white transition-all duration-300 ease-in-out" />
//                       </div>
//                     </div>
//                     <div className="text-sm text-rose-500 mt-[2px]">
//                       Credit : Ajay
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </>
//         ) : (
//           <div className="space-y-4 text-center ">
//             <div className="text-4xl font-semibold">Comics Coming Soon! 🥺</div>
//             <div className="text-lg text-gray-500">
//               Explore Out Other Popular Collections
//             </div>
//             <button
//               onClick={() => {
//                 navigate("/comics-list?filter=groupSmall");
//                 dispatch(updateSelectedFilterReducer("groupSmall"));
//               }}
//               className="px-6 py-3 text-white transition-all duration-300 ease-in-out rounded-full bg-primary hover:scale-105 active:scale-95"
//             >
//               View Comics
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ComicsPage;
