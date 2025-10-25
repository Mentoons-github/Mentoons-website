import { ProductBase } from "@/types/productTypes";
import MobileProductItem from "./mobileView";

interface MobileProduct {
  products: ProductBase[];
  ageCategory: string;
  handleAddToCart: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    product: ProductBase
  ) => Promise<void>;
  handleBuyNow: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    product: ProductBase
  ) => Promise<void>;
  isLoading: boolean;
}

const MobileProductList = ({
  products,
  ageCategory,
  handleAddToCart,
  handleBuyNow,
  isLoading,
}: MobileProduct) => (
  <div className="block md:hidden px-2 sm:px-4">
    <div className="mb-4 sm:mb-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
        Age {ageCategory}
      </h2>
      <div className="space-y-3 sm:space-y-4">
        {products.map((product: ProductBase) => (
          <MobileProductItem
            key={product._id}
            product={product}
            handleAddToCart={handleAddToCart}
            handleBuyNow={handleBuyNow}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  </div>
);

export default MobileProductList;
