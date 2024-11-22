// import { cardsCategory } from "@/constant/websiteConstants";
// import { useState } from "react";
// import { FaHeart, FaRegHeart, FaThumbsUp } from "react-icons/fa"

import { Link } from "react-router-dom";

// interface ProductCardProps {
//   item: {
//     name: string;
//     mini_thumbnail: string;
//   }[];
//   type: ""|'Comic' | 'Cards' | 'Posters';
// }

// const ProductCard = ({ item, type }: ProductCardProps) => {
//   const [isLiked, setIsLiked] = useState<number | null>(null);
//    const [isCardSelected, setIsCardSelected] = useState<string | null>(null);
//   const [isLoved,setIsLoved] = useState<boolean>(false);
//   const renderProductCard = (item: ProductCardProps['item'], type: ProductCardProps['type']) => {
//     switch (type) {
//       case 'Comic':
//         return (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 p-7">
//               {item.map((product, idx) => (
//                 <div className="relative group border-blue-500 border-4 rounded-lg" key={idx}>
//                   <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 lg:top-5 lg:right-5 z-10">
//                     <div
//                       className="relative cursor-pointer"
//                       onClick={() => {
//                         const likes = document.querySelectorAll(`[data-like-group="${idx}"]`);
//                         likes.forEach(like => {
//                           like.classList.remove('opacity-0');
//                           like.classList.add('animate-pop');
//                         });
//                         setTimeout(() => {
//                           likes.forEach(like => {
//                             like.classList.add('opacity-0');
//                             like.classList.remove('animate-pop');
//                           });
//                         }, 1000);
//                       }}
//                     >
//                       <FaThumbsUp data-like-group={idx} className="like-animation text-lg lg:text-2xl text-red-500 absolute -top-12 lg:-top-16 left-0 opacity-0" />
//                       <FaThumbsUp data-like-group={idx} className="like-animation text-lg sm:text-xl md:text-2xl text-red-500 absolute -top-8 left-8 lg:left-10 opacity-0" />
//                       <FaThumbsUp data-like-group={idx} className="like-animation text-lg sm:text-xl md:text-2xl text-red-500 absolute -top-8 right-8 lg:right-10 opacity-0" />
//                       <FaThumbsUp
//                         className={`text-2xl sm:text-3xl md:text-4xl ${isLiked === idx ? 'text-red-500' : 'text-white'} hover:text-red-400 transition-colors`}
//                         onClick={() => setIsLiked(isLiked === idx ? null : idx)}
//                       />
//                     </div>
//                   </div>
//                   <figure className="w-full h-[200px] sm:h-[250px] md:h-[300px] relative">
//                     <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-black/40 via-transparent to-black/40" />
//                     <img
//                       src={product.mini_thumbnail}
//                       alt={product.name}
//                       className="w-full h-full object-cover rounded-lg"
//                     />
//                   </figure>
//                 </div>
//               ))}
//             </div>
//           </>
//         );
//       case 'Cards':
//         return (
//           <>
//             <div className="grid grid-cols-3 gap-4 lg:gap-6 p-7">
//               {cardsCategory.map((card, idx) => (
//                 <div key={idx} onClick={() => setIsCardSelected(card.category)}>
//                   <img src={card.image} alt={card.category} />
//                 </div>
//               ))}
//             </div>
//             {isCardSelected && (
//               <>
//                 <div className="p-4 md:p-7 bg-[#FFD25C] flex flex-col gap-6 md:gap-10 items-center justify-center relative">
//                   <div className="relative w-full">
//                     <h1 className="text-center text-xl md:text-2xl font-semibold">Age group {isCardSelected}</h1>
//                     {isLoved ?
//                       <FaHeart
//                         className="text-xl md:text-2xl absolute top-2 right-0 lg:right-[1rem] text-red-500 cursor-pointer"
//                         onClick={() => setIsLoved(!isLoved)}
//                       /> :
//                       <FaRegHeart
//                         className="text-xl md:text-2xl absolute top-2 right-0 lg:right-[1rem] cursor-pointer"
//                         onClick={() => setIsLoved(!isLoved)}
//                       />}
//                   </div>
//                   <div className="flex flex-col lg:flex-row gap-6 md:gap-10 w-full lg:max-w-fit">
//                     <div className="flex-1 border-black border-2 rounded-lg items-center justify-center bg-[#FFF7E1]">
//                       <div className="flex items-start gap-2 justify-center mt-4">
//                         <figure className="w-5 md:w-6 h-5 md:h-6">
//                           <img src='/assets/cards/flower (2).png' alt='flower' className="w-full h-full object-contain" />
//                         </figure>
//                         <h1 className="text-center text-lg md:text-xl font-semibold">Story Re-Teller<br /> Cards</h1>
//                       </div>
//                       <figure className="w-full lg:w-[370px] h-[300px] md:h-[400px] lg:h-[510px] p-4 md:p-7">
//                         <img src='/assets/cards/convo 1.png' alt='flower' className="w-full h-full object-contain" />
//                       </figure>
//                     </div>
//                     <div className="flex-1 border-black border-2 rounded-lg bg-[#FFF7E1]">
//                       <div className="flex items-start gap-2 justify-center mt-4">
//                         <figure className="w-5 md:w-6 h-5 md:h-6">
//                           <img src='/assets/cards/flower (2).png' alt='flower' className="w-full h-full object-contain" />
//                         </figure>
//                         <h1 className="text-center text-lg md:text-xl font-semibold">Story Re-Teller<br /> Cards</h1>
//                       </div>
//                       <figure className="w-full lg:w-[370px] h-[300px] md:h-[400px] lg:h-[510px] p-4 md:p-7">
//                         <img src='/assets/cards/convo 2.png' alt='flower' className="w-full h-full object-contain" />
//                       </figure>
//                     </div>
//                   </div>
//                   <button className="bg-[#D7163F] text-white px-4 py-2 rounded-lg text-sm md:text-base">Buy Now</button>
//                   <figure className="absolute -bottom-0 left-0 w-[100px] md:w-[150px] lg:w-[200px]">
//                     <img src="/assets/cards/boy.png" alt="boy" className="w-full h-full object-contain" />
//                   </figure>
//                 </div>
//               </>
//             )}
//           </>
//         );
//       case 'Posters':
//         return (
//           <div className="p-7 text-center">No data found</div>
//         );
//       default:
//         return null;
//     }
//   }

//   return (
//     <>
//     <h1 className="text-center text-4xl font-bold text-black [-webkit-text-stroke:2px_yellow]">{type}</h1>
//       {renderProductCard(item, type)}
//     </>
//   )
// };

// export default ProductCard

interface Thumbnail {
  id: string;
  media: string;
}

interface DescriptionItem {
  id: string;
  label: string;
  fatureList?: { id: string; description: string }[]; // Optional for features
  advantageList?: { id: string; description: string }[]; // Optional for advantages
  benefitsList?: { id: string; description: string }[]; // Optional for benefits
}

interface ProductDetail {
  id: string;
  categoryTitle: string;
  productTitle: string;
  age: number[];
  ageFilter: string;
  productSummary: string;
  rating: string;
  paperEditionPrice: string;
  printablePrice: string;
  productType: string;
  thumbnails: Thumbnail[];
  description: DescriptionItem[];
}

const ProductCard = ({ productDetails }: { productDetails: ProductDetail }) => {
  return (
    <Link to={`/mentoons-store/product/${productDetails.id}`} className="flex">
      <div className=" p-2 py-3 border-[0.5px] border-transparent hover:border-[0.5px] hover:border-white/50  hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl bg-amber-50">
        <div>
          <img
            src="/assets/images/product-card-thumbnail.png"
            alt=""
            className=""
          />
          <div className=" ">
            <div className="w-72 p-2  flex flex-col  justify-between">
              <div className="flex  items-start justify-between">
                <h1 className="text-2xl font-bold ">
                  {productDetails.productTitle}
                </h1>
                <p className="font-bold text-lg text-zinc-700 whitespace-nowrap">
                  {productDetails.paperEditionPrice}
                </p>
              </div>
              <h2 className="text-zinc-700 w-full  ">
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
            <div className="flex items-center  justify-between gap-4 p-2">
              <button className="px-5 py-2  border font-semibold border-black/30 rounded-full bg-white/60">
                Add to cart
              </button>
              <button className="px-5 py-2 border font-semibold bg-green-300 rounded-full border-green-200">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
