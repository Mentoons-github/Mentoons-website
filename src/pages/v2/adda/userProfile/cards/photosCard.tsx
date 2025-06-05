import { useState, useMemo, useEffect } from "react";
import { Post } from "../../userProfile";

interface MediaItem {
  type?: string;
  url: string;
  caption?: string;
  key: string;
}

const PhotosCard = ({ userPosts }: { userPosts: Post[] }) => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imageMedia = useMemo<MediaItem[]>(
    () =>
      userPosts
        .filter((post) => Array.isArray(post.media) && post.media.length > 0)
        .flatMap((post, postIndex) =>
          post
            .media!.filter(
              (item) =>
                item.url &&
                (item.type === "image" ||
                  item.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i))
            )
            .map((item, mediaIndex) => ({
              type: item.type,
              url: item.url,
              caption: item.caption,
              key: `${postIndex}-${mediaIndex}-${item.url}`,
            }))
        ),
    [userPosts]
  );

  // Focus modal when it opens
  useEffect(() => {
    if (isSliderOpen) {
      const modal = document.querySelector(".modal") as HTMLDivElement | null;
      modal?.focus();
    }
  }, [isSliderOpen]);

  // Preload next and previous images
  useEffect(() => {
    const preloadImages = [
      imageMedia[currentImageIndex - 1]?.url,
      imageMedia[currentImageIndex + 1]?.url,
    ].filter(Boolean);
    preloadImages.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = url;
      document.head.appendChild(link);
      return () => document.head.removeChild(link);
    });
  }, [currentImageIndex, imageMedia]);

  const openSlider = (index: number) => {
    setCurrentImageIndex(index);
    setIsSliderOpen(true);
  };

  const closeSlider = () => {
    setIsSliderOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageMedia.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + imageMedia.length) % imageMedia.length
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeSlider();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
  };

  if (imageMedia.length === 0) return null;

  return (
    <>
      <div className="bg-white p-6 w-full md:w-1/3 shadow-lg border border-orange-100 rounded-xl hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Photos
          </h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {imageMedia.length}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {imageMedia.slice(0, 9).map((media, index) => (
            <div
              key={media.key}
              className="relative group overflow-hidden rounded-lg aspect-square cursor-pointer"
              onClick={() => openSlider(index)}
            >
              <img
                src={media.url}
                alt={media.caption || `Photo ${index + 1}`}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-75"
                loading="lazy"
                onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {imageMedia.length > 9 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => openSlider(0)}
              className="text-orange-500 hover:text-orange-600 text-sm font-medium transition-colors duration-200"
            >
              View all {imageMedia.length} photos →
            </button>
          </div>
        )}
      </div>

      {isSliderOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center modal"
          onClick={closeSlider}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label="Image slider"
        >
          <button
            onClick={closeSlider}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            aria-label="Close image slider"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 ${
              imageMedia.length <= 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={imageMedia.length <= 1}
            aria-label="Previous image"
          >
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 ${
              imageMedia.length <= 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={imageMedia.length <= 1}
            aria-label="Next image"
          >
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div
            className="max-w-4xl max-h-[90vh] mx-4 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageMedia[currentImageIndex].url}
              alt={
                imageMedia[currentImageIndex].caption ||
                `Photo ${currentImageIndex + 1}`
              }
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
            />
            {imageMedia[currentImageIndex].caption && (
              <p className="text-white text-sm mt-2 text-center">
                {imageMedia[currentImageIndex].caption}
              </p>
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full">
            {currentImageIndex + 1} / {imageMedia.length}
          </div>

          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-lg overflow-x-auto p-2">
            {imageMedia.map((media, index) => (
              <img
                key={media.key}
                src={media.url}
                alt={`Thumbnail ${index + 1}`}
                className={`w-12 h-12 object-cover rounded cursor-pointer transition-all duration-200 ${
                  index === currentImageIndex
                    ? "ring-2 ring-orange-500 opacity-100"
                    : "opacity-60 hover:opacity-80"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PhotosCard;
