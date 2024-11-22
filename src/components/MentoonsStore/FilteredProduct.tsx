import ProductCard from "./ProductCard";

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

interface FilteredProductProps {
  filteredProduct: ProductDetail[];
}

const FilteredProduct = ({ filteredProduct }: FilteredProductProps) => {
  return (
    <section>
      <div>
        <h1 className="text-5xl text-white font-bold mb-6">Popular Products</h1>
        {filteredProduct.length > 0 ? (
          <div className="pb-24 flex gap-4 items-center justify-center  md:justify-between flex-wrap">
            {filteredProduct.map((product) => (
              <ProductCard productDetails={product} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-80">
            <h1>No Product found</h1>
          </div>
        )}
      </div>
    </section>
  );
};

export default FilteredProduct;
