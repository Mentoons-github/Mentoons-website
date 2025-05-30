import { motion } from "framer-motion";
import { FaShoppingCart, FaBolt } from "react-icons/fa";
import {
  ComicProduct,
  AudioComicProduct,
  ProductBase,
} from "@/types/productTypes";
import { formatDateString } from "@/utils/formateDate";
import AddToCartModal from "@/components/modals/AddToCartModal";
import LoginModal from "@/components/common/modal/loginModal";
import { useState } from "react";

interface ComicCardProps {
  comic: ProductBase;
  index: number;
  handleAddtoCart: (
    e: React.MouseEvent<HTMLButtonElement>,
    comic: ProductBase
  ) => void;
  handleBuyNow: (
    e: React.MouseEvent<HTMLButtonElement>,
    comic: ProductBase
  ) => void;
  openComicModal: (
    comicLink: string,
    comic?: ProductBase | null,
    productType?: string
  ) => void;
  isLoading: boolean;
  showAddToCartModal: boolean;
  setShowAddToCartModal: (value: boolean) => void;
  showLoginModal: boolean;
  setShowLoginModal: (value: boolean) => void;
}

const ComicCard = ({
  comic,
  index,
  handleAddtoCart,
  handleBuyNow,
  openComicModal,
  isLoading,
  showAddToCartModal,
  setShowAddToCartModal,
  showLoginModal,
  setShowLoginModal,
}: ComicCardProps) => {
  return (
    <>
      <motion.div
        className="flex-shrink-0 w-[320px] h-full relative group"
        key={comic.title + index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <div className="relative w-full h-full overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-xl hover:shadow-2xl">
          {/* Main Image with Gradient Overlay */}
          <div className="relative h-[60%] overflow-hidden">
            <img
              src={
                comic.productImages?.[0].imageUrl || "/placeholder-image.jpg"
              }
              alt={comic.title}
              className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            {/* Product Type Badge */}
            <div className="absolute flex gap-2 bottom-4 left-4">
              {comic.product_type && (
                <span
                  className={`
                    inline-block py-[4px] px-[6px] text-sm font-semibold rounded-lg ml-2 shadow-md text-white animate-[sparkle_2s_ease-in-out_infinite]
                    ${
                      comic.product_type === "Free"
                        ? "bg-gradient-to-r from-green-400 to-green-500"
                        : comic.product_type === "Prime"
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                        : comic.product_type === "Platinum"
                        ? "bg-gradient-to-r from-gray-400 to-gray-500"
                        : "bg-gray-700"
                    }
                  `}
                >
                  {comic.product_type}
                </span>
              )}
              {/* Release Date Badge */}
              <span className="px-3 py-1 text-sm font-medium rounded-lg bg-white/90">
                {formatDateString(
                  (comic.details as ComicProduct["details"])?.releaseDate || ""
                )}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-5">
            <h3 className="mb-2 text-xl font-bold text-gray-900 line-clamp-1">
              {comic?.title}
            </h3>

            <p className="mb-4 text-sm text-gray-600 line-clamp-2">
              {comic?.description}
            </p>

            {/* Stats Row */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {comic.type === "comic" && (
                  <span>
                    {(comic.details as ComicProduct["details"]).pages} pages
                  </span>
                )}
                {comic.type === "audio comic" && (
                  <span>
                    {(comic.details as AudioComicProduct["details"]).duration}{" "}
                    duration
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{Math.floor(Math.random() * 20)}+ views</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                <span>{comic.rating}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {comic.product_type && (
                <button
                  onClick={() => {
                    if ("sampleUrl" in comic.details) {
                      openComicModal(
                        comic.details.sampleUrl || "",
                        comic,
                        comic.product_type
                      );
                    }
                  }}
                  className="flex-1 px-4 py-2 font-medium text-white transition-colors rounded-lg bg-primary hover:bg-primary/90"
                >
                  {comic.type === "comic" ? "Read Now" : "Listen Now"}
                </button>
              )}

              {!comic.product_type && (
                <>
                  <button
                    onClick={(e) => handleAddtoCart(e, comic)}
                    disabled={isLoading}
                    className="flex items-center flex-1 gap-2 px-4 py-2 font-medium text-white transition-colors rounded-lg bg-primary hover:bg-primary whitespace-nowrap"
                  >
                    <FaShoppingCart className="self-center inline-block w-4 h-4" />
                    {isLoading ? "Adding..." : "Add to Cart"}
                  </button>
                  <button
                    onClick={(e) => handleBuyNow(e, comic)}
                    disabled={isLoading}
                    className="flex items-center flex-1 gap-2 px-4 py-2 font-medium transition-colors border rounded-lg text-primary hover:bg-primary/10 whitespace-nowrap border-primary"
                  >
                    <FaBolt className="self-center inline-block w-4 h-4" />
                    {isLoading ? "Buying..." : "Buy Now"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      {showAddToCartModal && (
        <AddToCartModal
          onClose={() => setShowAddToCartModal(false)}
          isOpen={showAddToCartModal}
          productName={comic.title}
        />
      )}
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </>
  );
};

export default ComicCard;
