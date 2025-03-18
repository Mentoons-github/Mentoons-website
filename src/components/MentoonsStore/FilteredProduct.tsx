// import React from "react";
// import ProductCard from "./ProductCard";
// import { ProductBase } from "@/types/productTypes";

// interface ProductImage {
//   id: string;
//   imageSrc: string;
// }

// interface ProductVideo {
//   id: string;
//   videoSrc: string;
// }

// interface ProductReview {
//   id: string;
//   quote: string;
//   author: string;
// }

// interface DescriptionItem {
//   label: string;

//   descriptionList: [
//     {
//       description: string;
//     },
//   ];
// }

// interface Product {
//   _id: string;
//   productTitle: string;
//   productCategory: string;
//   productSummary: string;
//   minAge: number;
//   maxAge: number;
//   ageFilter: string;
//   rating: string;
//   paperEditionPrice: string;
//   printablePrice: string;
//   productImages: ProductImage[];
//   productVideos: ProductVideo[];
//   productDescription: DescriptionItem[];
//   productReview: ProductReview[];
//   // Add other properties as needed
// }

// interface FilteredProductProps {
//   filteredProduct: Product[];
// }

// const FilteredProduct: React.FC<FilteredProductProps> = ({
//   filteredProduct,
// }) => {
//   console.log("FilteredProduct received:", filteredProduct);

//   return (
//     <div className="w-full">
//       <h1 className="text-5xl text-white font-bold mb-6">Popular Products</h1>
//       {filteredProduct?.length > 0 ? (
//         <div className="pb-24 flex gap-4 items-start flex-wrap md:justify-between ">
//           {filteredProduct.map((product: ProductBase) => (
//             <ProductCard key={product._id} productDetails={product} />
//           ))}
//         </div>
//       ) : (
//         <div className="flex items-center justify-center h-80 w-full">
//           {[1, 2, 3, 4, 5].map((_, index) => (
//             <div key={index} className="animate-pulse w-full">
//               <div className="w-64 h-72 bg-gray-300 rounded-lg mb-4"></div>
//               <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
//               <div className="h-4 bg-gray-300 rounded w-1/2"></div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FilteredProduct;
