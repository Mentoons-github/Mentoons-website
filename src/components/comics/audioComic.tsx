import { ProductBase, AudioComicProduct, ComicProduct } from "@/types/productTypes";
import { formatDateString } from "@/utils/formateDate";
import { FaShoppingCart, FaBolt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface AudioComicCardProps {
  comic: ProductBase;
  onListenNow: (comic: ProductBase) => void;
  onAddToCart: (
    e: React.MouseEvent<HTMLButtonElement>,
    comic: ProductBase
  ) => void;
  onBuyNow: (
    e: React.MouseEvent<HTMLButtonElement>,
    comic: ProductBase
  ) => void;
  isLoading?: boolean;
}

const AudioComicCard: React.FC<AudioComicCardProps> = ({
  comic,
  onListenNow,
  onAddToCart,
  onBuyNow,
  isLoading,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting && !video.paused) {
            video.pause();
            video.currentTime = 0;
            setIsPlaying(false);
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(video);
      return () => observer.disconnect();
    }
  }, []);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (video && comic.product_type === "Free") {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    } else {
      onListenNow(comic);
    }
  };

  return (
    <motion.div
      className="flex-shrink-0 w-full h-full relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full h-full overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-xl hover:shadow-2xl">
        {/* Video/Image Section */}
        <div className="relative h-[60%] overflow-hidden">
          {(
            comic.details as
              | ComicProduct["details"]
              | AudioComicProduct["details"]
          )?.sampleUrl ? (
            <video
              ref={videoRef}
              className="object-contain w-full h-full p-2 rounded-t-xl"
              src={
                (
                  comic.details as
                    | ComicProduct["details"]
                    | AudioComicProduct["details"]
                )?.sampleUrl
              }
              poster={
                comic.productImages?.[0].imageUrl || "/placeholder-image.jpg"
              }
              onEnded={(e) => {
                e.currentTarget.load();
                setIsPlaying(false);
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              playsInline
            />
          ) : (
            <img
              src={
                comic.productImages?.[0].imageUrl || "/placeholder-image.jpg"
              }
              alt={comic.title}
              className="object-cover w-full h-full rounded-t-xl"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {/* Play Button Overlay */}
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 bg-black/30 group-hover:opacity-100"
          >
            {isPlaying ? (
              <svg
                className="w-12 h-12 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg
                className="w-12 h-12 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          {/* Badges */}
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
            <span className="px-3 py-1 text-sm font-medium rounded-lg bg-white/90">
              {formatDateString(
                (comic.details as AudioComicProduct["details"])?.releaseDate ||
                  ""
              )}
            </span>
          </div>
          {isPlaying && (
            <div className="absolute flex items-center gap-1 px-2 py-1 text-xs text-white rounded-full top-2 right-2 bg-black/50">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
              Playing
            </div>
          )}
        </div>
        {/* Content Section */}
        <div className="p-5">
          <h3 className="mb-2 text-xl font-bold text-gray-900 line-clamp-1">
            {comic.title}
          </h3>
          <p className="mb-4 text-sm text-gray-600 line-clamp-2">
            {comic.description}
          </p>
          {/* Stats */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>
                {(comic.details as AudioComicProduct["details"]).duration} min
              </span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{Math.floor(Math.random() * 20)}+ views</span>
            </div>
          </div>
          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => onListenNow(comic)}
              className="flex-1 px-4 py-2 font-medium text-white rounded-lg bg-primary hover:bg-primary/90"
            >
              Listen Now
            </button>
            {!comic.product_type && (
              <>
                <button
                  onClick={(e) => onAddToCart(e, comic)}
                  disabled={isLoading}
                  className="flex items-center flex-1 gap-2 px-4 py-2 font-medium text-white rounded-lg bg-primary hover:bg-primary/90"
                >
                  <FaShoppingCart className="w-4 h-4" />
                  {isLoading ? "Adding..." : "Add to Cart"}
                </button>
                <button
                  onClick={(e) => onBuyNow(e, comic)}
                  disabled={isLoading}
                  className="flex items-center flex-1 gap-2 px-4 py-2 font-medium text-primary border rounded-lg border-primary hover:bg-primary/10"
                >
                  <FaBolt className="w-4 h-4" />
                  {isLoading ? "Buying..." : "Buy Now"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AudioComicCard;
