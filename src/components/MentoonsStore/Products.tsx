import { comicsData } from "@/constant/comicsConstants"
import ProductCard from "./ProductCard"


const Products = ({selectedCategory}: {selectedCategory: ""|"Comic" | "Cards" | "Posters"}) => {
  console.log(selectedCategory,"selectedCategory")
  return (
    <div className="max-w-7xl mx-auto">
      <ProductCard item={comicsData} type={selectedCategory} />
    </div>
  )
}

export default Products
