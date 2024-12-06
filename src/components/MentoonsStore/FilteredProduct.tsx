import React from "react";
import ProductCard from "./ProductCard";

interface ProductImage {
  id: string;
  imageSrc: string;
}

interface ProductVideo {
  id: string;
  videoSrc: string;
}

interface ProductReview {
  id: string;
  quote: string;
  author: string;
}

interface DescriptionItem {
  label: string;

  descriptionList: [
    {
      description: string;
    }
  ];
}

interface Product {
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
  productVideos: ProductVideo[];
  productDescription: DescriptionItem[];
  productReview: ProductReview[];
  // Add other properties as needed
}

interface FilteredProductProps {
  filteredProduct: Product[];
}

const FilteredProduct: React.FC<FilteredProductProps> = ({
  filteredProduct,
}) => {
  console.log("FilteredProduct received:", filteredProduct);

  return (
    <section>
      <div>
        <h1 className="text-5xl text-white font-bold mb-6">Popular Products</h1>
        {filteredProduct?.length > 0 ? (
          <div className="pb-24 flex gap-4 items-start justify-center  md:justify-between flex-wrap">
            {filteredProduct.map((product) => (
              <ProductCard key={product._id} productDetails={product} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-80">
            <h1 className="text-2xl font-semibold">No Product found</h1>
          </div>
        )}
      </div>
    </section>
  );
};

export default FilteredProduct;
