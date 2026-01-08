import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProductNavProps {
  searchTerm: string;
  productType: string | undefined;
  cardType: string | undefined;
  selectedCategory?: string;
}

const ProductNav = ({
  searchTerm,
  productType,
  cardType,
  selectedCategory = "all",
}: ProductNavProps) => {
  const [activeCategory, setActiveCategory] = useState(selectedCategory);
  const navigate = useNavigate();

  useEffect(() => {
    setActiveCategory(selectedCategory);
  }, [selectedCategory]);

  const ageCategories = [
    {
      age: "all",
      label: "All Ages",
      imageUrl:
        "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/all-ages-placeholder.png",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      age: "6-12",
      label: "Ages 6-12",
      imageUrl:
        "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/Conversation+Starter+Cards+6-12.png",
      gradient: "from-blue-400 to-cyan-400",
    },
    {
      age: "13-16",
      label: "Ages 13-16",
      imageUrl:
        "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/Silent+stories+13-16+.png",
      gradient: "from-green-400 to-emerald-400",
    },
    {
      age: "17-19",
      label: "Ages 17-19",
      imageUrl:
        "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/Story+reteller+cards+front+17-19.png",
      gradient: "from-orange-400 to-red-400",
    },
    {
      age: "20+",
      label: "Ages 20+",
      imageUrl:
        "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/Conversation_Story_Cards_20%2B/Conversation+Story+Cards+20%2B.png",
      gradient: "from-indigo-400 to-purple-400",
    },
  ];

  const handleCategoryClick = (category: string) => {
    console.log("Category clicked:", category);
    setActiveCategory(category);

    const searchParams = new URLSearchParams();

    if (searchTerm) {
      searchParams.set("search", searchTerm);
    } else if (category !== "all") {
      searchParams.set("category", category);
    }

    if (productType) {
      searchParams.set("productType", productType);
    }
    if (cardType) {
      searchParams.set("cardType", cardType);
    }

    navigate({ search: searchParams.toString() });
  };

  return (
    <div className="sticky top-[65px] border-b border-gray-300 shadow-sm z-20 md:hidden bg-white">
      <div className="px-4 py-1">
        <h3 className="text-sm font-semibold text-gray-800 mb-1">
          Shop by Age Group
        </h3>

        <div className="flex overflow-x-auto pb-2 scrollbar-hide">
          {ageCategories.map(({ age, label, imageUrl, gradient }) => {
            const isActive = activeCategory === age;

            return (
              <div
                key={age}
                className="flex-shrink-0 flex flex-col items-center p-2"
              >
                <button
                  className={`group relative w-20 h-20 rounded-2xl  overflow-hidden transition-all duration-200 ${
                    isActive
                      ? "ring-2 ring-orange-500 shadow-lg"
                      : "shadow-md hover:shadow-lg"
                  }`}
                  onClick={() => handleCategoryClick(age)}
                  aria-label={`View products for ${label}`}
                >
                  <div className="absolute inset-0">
                    {age === "all" ? (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${gradient}`}
                      />
                    ) : (
                      <img
                        src={imageUrl}
                        alt={label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>

                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200 flex items-center justify-center">
                    <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center px-1">
                      {age === "all" ? "ALL" : age}
                    </span>
                  </div>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .scrollbar-hide {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
      `}</style>
    </div>
  );
};

export default ProductNav;
