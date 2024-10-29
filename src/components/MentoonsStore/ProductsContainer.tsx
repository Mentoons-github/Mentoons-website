import { useState } from "react";
import ProductCategories from "./ProductCategories"
import Products from "./Products"

export type ProductType = ""|'Comic' | 'Cards' | 'Posters';

const ProductsContainer = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProductType>('');

  const handleCategoryChange = (category: ProductType) => {
    setSelectedCategory(category);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl w-[80%] m-auto relative -top-16 py-12 flex flex-col space-y-4 lg:space-y-16">
      <div className="relative">
        <figure className="absolute -top-10 lg:left-[36%] lg:-translate-x-[36%]">
        <img src="/assets/images/boyImg.png" alt="boy image" className="h-full w-full object-contain"/>
        </figure>
      <div className="bg-[#B3DB89] rounded-xl w-3/6 lg:w-3/12 mx-auto p-4 text-center ">
        <h1 className="lg:text-[18px] font-semibold text-center">Recent Trending in Mentoons</h1>
      </div>
      </div>
      <div className="">
        <ProductCategories setSelectedCategory={handleCategoryChange} />
      </div>
      <div>
        <Products selectedCategory={selectedCategory}/>
      </div>
    </div>
  )
}

export default ProductsContainer
