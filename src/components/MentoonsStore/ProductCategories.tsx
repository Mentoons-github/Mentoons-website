import { ProductType } from "./ProductsContainer";

interface ProductCategoriesProps {
    setSelectedCategory: (category: ProductType) => void;
}

const ProductCategories = ({ setSelectedCategory }: ProductCategoriesProps) => {
    interface productCategories {
        categoryImage: string;
        categoryTitle: string;
    }

    const categories: productCategories[] = [
        {
            categoryImage: "/assets/images/comicCat.png",
            categoryTitle: "Comic"
        },
        {
            categoryImage: "/assets/images/cardsCat.png",
            categoryTitle: "Cards"
        },
        {
            categoryImage: "/assets/images/statueCat.png",
            categoryTitle: "Posters"
        },
    ]

    return (
        <div className="flex flex-row justify-around gap-4 w-full">
            {categories.map((items, index) => (
                <div 
                    key={index} 
                    className="flex-1 min-w-[50px] max-w-[100px] lg:max-w-[350px] p-2 cursor-pointer transform transition-transform duration-300 hover:scale-105" 
                    onClick={() => setSelectedCategory(items.categoryTitle as ProductType)}
                >
                    <figure className="relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black opacity-75 z-5 transition-opacity duration-300 hover:opacity-60"></div>
                        <h1 className="absolute left-1/2 -translate-x-1/2 bottom-2 z-10 text-[10px] lg:text-[24px] font-semibold text-white transition-transform duration-300 group-hover:scale-110">
                            {items.categoryTitle}
                        </h1>
                        <img 
                            src={items.categoryImage} 
                            alt={items.categoryImage} 
                            className="h-full w-full object-contain transition-transform duration-300" 
                        />
                    </figure>
                </div>
            ))}
        </div>
    )
}

export default ProductCategories
