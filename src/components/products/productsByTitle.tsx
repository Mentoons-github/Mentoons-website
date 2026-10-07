import { useNavigate } from "react-router-dom";
import { FaBolt, FaStar } from "react-icons/fa6";
import { ProductType } from "@/utils/enum";
import { FaShoppingCart } from "react-icons/fa";
import { ProductBase } from "@/types/productTypes";
import { useEffect, useRef, useState } from "react";

interface ProductsByTitleProps {
  products: ProductBase[];
  handleAddToCart: (
    e: React.MouseEvent<HTMLButtonElement>,
    product: ProductBase,
  ) => void | Promise<void>;
  handleBuyNow: (
    e: React.MouseEvent<HTMLButtonElement>,
    product: ProductBase,
  ) => void | Promise<void>;
  isLoading?: boolean;
}

export const POCKET_SERIES_TITLES = [
  "how to handle grief",
  "my memory journal",
  "my pets",
  "opinions journal",
  "self talk",
];

export const POCKET_SERIES_LABEL = "Pocket Series";
const COLORING_BOOKS_LABEL = "Coloring Books";

const THUMBNAIL_HOLD_MS = 2500;

export const getBaseTitle = (title: string): string => {
  const stripped = title
    .replace(/\(\s*\d+\s*[-–]\s*\d+\s*\)\s*years?/gi, "")
    .replace(/\(\s*\d+\s*\+\s*\)\s*years?/gi, "")
    .replace(/\d+\s*[-–]\s*\d+\s*years?/gi, "")
    .replace(/\d+\s*\+\s*years?/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  const strippedLower = stripped.toLowerCase();

  if (POCKET_SERIES_TITLES.includes(strippedLower)) {
    return POCKET_SERIES_LABEL;
  }

  if (strippedLower.includes("coloring book")) {
    return COLORING_BOOKS_LABEL;
  }

  return stripped;
};

const GROUP_ORDER = [
  "Conversation Starter Cards",
  "Story Re-Teller Cards",
  "Conversation Story Cards",
  "Silent Stories",
  POCKET_SERIES_LABEL,
  COLORING_BOOKS_LABEL,
];

const groupOrderValue = (baseTitle: string): number => {
  const idx = GROUP_ORDER.findIndex(
    (label) => label.toLowerCase() === baseTitle.toLowerCase(),
  );
  return idx === -1 ? GROUP_ORDER.length : idx;
};

const ageSortValue = (ageCategory: string | undefined): number => {
  if (!ageCategory) return 9999;
  if (ageCategory.includes("+")) {
    const n = parseInt(ageCategory, 10);
    return isNaN(n) ? 9998 : n + 1000;
  }
  const [min] = ageCategory.split("-").map((s) => parseInt(s, 10));
  return isNaN(min) ? 9997 : min;
};

interface TitleGroup {
  baseTitle: string;
  variants: ProductBase[];
  representativeImage?: string;
  videoUrl?: string;
  ageRangeLabel?: string;
}

const groupProductsByTitle = (products: ProductBase[]): TitleGroup[] => {
  const map = new Map<string, ProductBase[]>();

  products.forEach((product) => {
    const base = getBaseTitle(product.title);
    if (!map.has(base)) map.set(base, []);
    map.get(base)!.push(product);
  });

  const groups: TitleGroup[] = Array.from(map.entries()).map(
    ([baseTitle, variants]) => {
      const sorted = [...variants].sort(
        (a, b) => ageSortValue(a.ageCategory) - ageSortValue(b.ageCategory),
      );
      const ages = Array.from(
        new Set(sorted.map((v) => v.ageCategory).filter(Boolean)),
      ) as string[];
      return {
        baseTitle,
        variants: sorted,
        representativeImage: sorted[0]?.productImages?.[0]?.imageUrl,
        videoUrl: sorted.find((v) => v.productVideos)?.productVideos?.[0]
          ?.videoUrl,
        ageRangeLabel: ages.length ? ages.join(", ") : undefined,
      };
    },
  );

  return groups.sort((a, b) => {
    const orderDiff =
      groupOrderValue(a.baseTitle) - groupOrderValue(b.baseTitle);
    if (orderDiff !== 0) return orderDiff;
    return a.baseTitle.localeCompare(b.baseTitle);
  });
};

const getProductDetailPath = (product: ProductBase): string => {
  if (product.type === ProductType.TOONLAND) {
    return `/mentoons-store/toonland-product/${product._id}`;
  }
  return `/mentoons-store/product/${product._id}`;
};

const getDiscountInfo = (
  product: ProductBase,
): { mrp: number; sellingPrice: number; percentOff: number } | null => {
  const mrp = product.mrp;
  const sellingPrice = product.offerPrice ?? product.price;

  if (!mrp || mrp <= sellingPrice) return null;

  const percentOff = Math.round(((mrp - sellingPrice) / mrp) * 100);
  if (percentOff <= 0) return null;

  return { mrp, sellingPrice, percentOff };
};

interface HoverPayload {
  videoUrl?: string;
  thumbnail?: string;
  title: string;
}

const AgeVariantCard = ({
  product,
  onHover,
  handleAddToCart,
  handleBuyNow,
  isLoading,
}: {
  product: ProductBase;
  onHover: (payload: HoverPayload) => void;
  handleAddToCart: (
    e: React.MouseEvent<HTMLButtonElement>,
    product: ProductBase,
  ) => void | Promise<void>;
  handleBuyNow: (
    e: React.MouseEvent<HTMLButtonElement>,
    product: ProductBase,
  ) => void | Promise<void>;
  isLoading?: boolean;
}) => {
  const thumbnail = product.productImages?.[0]?.imageUrl;
  const navigate = useNavigate();

  const goToDetails = () => {
    navigate(getProductDetailPath(product));
  };

  const ownVideoUrl = product.productVideos?.[0]?.videoUrl;
  const discount = getDiscountInfo(product);

  return (
    <div
      onClick={goToDetails}
      onMouseEnter={() =>
        onHover({ videoUrl: ownVideoUrl, thumbnail, title: product.title })
      }
      className="cursor-pointer flex flex-col justify-between h-full p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-[#ff9800]/40 transition-shadow"
    >
      <div>
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-50 mb-3 flex items-center justify-center">
          {discount && (
            <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {discount.percentOff}% OFF
            </span>
          )}

          {thumbnail ? (
            <img
              src={thumbnail}
              alt={product.title}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="text-gray-300 text-xs">No image</div>
          )}
        </div>

        <span className="inline-block bg-[#ff9800]/10 text-[#ff9800] text-sm font-semibold px-2.5 py-1 rounded-full">
          {product.ageCategory ? `Age: ${product.ageCategory} yrs` : "All Ages"}
        </span>

        {typeof product.rating === "number" && (
          <div className="flex items-center gap-0.5 mt-2 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`w-3 h-3 ${
                  i < Math.round(product.rating ?? 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        )}

        <p className="mt-2 text-sm font-medium text-gray-800 line-clamp-2">
          {product.title}
        </p>
      </div>

      <div className="mt-3">
        {discount ? (
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold text-green-600 uppercase tracking-wide">
              Introductory Price
            </span>
            {/* MRP shown first (struck through), then the real/selling
                price, per requested order. */}
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-sm text-gray-400 line-through">
                ₹{discount.mrp}
              </span>
              <span className="text-lg font-semibold text-[#ff9800]">
                ₹{discount.sellingPrice}
              </span>
              <span className="text-xs font-semibold text-green-600">
                {discount.percentOff}% off
              </span>
            </div>
          </div>
        ) : (
          <span className="text-lg font-semibold text-[#ff9800]">
            ₹{product.price}
          </span>
        )}

        <div className="flex gap-2 mt-3">
          <button
            disabled={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              handleBuyNow(e, product);
            }}
            className="flex items-center justify-center gap-1 flex-1 bg-white border border-[#ff9800] text-[#ff9800] text-xs px-2 py-2 rounded-lg hover:bg-[#fff3e0] transition disabled:opacity-50"
          >
            <FaBolt className="w-3 h-3" /> Buy Now
          </button>
          <button
            disabled={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(e, product);
            }}
            className="flex items-center justify-center gap-1 flex-1 bg-[#ff9800] text-white text-xs px-2 py-2 rounded-lg hover:bg-[#e68900] transition disabled:opacity-50"
          >
            <FaShoppingCart className="w-3 h-3" /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

const VideoCard = ({
  videoUrl,
  thumbnail,
  title,
  isPlaying,
  hoverKey,
}: {
  videoUrl?: string;
  thumbnail?: string;
  title: string;
  isPlaying: boolean;
  hoverKey: number;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setShowVideo(false);

    if (isPlaying && videoUrl) {
      timerRef.current = setTimeout(() => {
        setShowVideo(true);
      }, THUMBNAIL_HOLD_MS);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, videoUrl, hoverKey]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (showVideo) {
      videoEl.currentTime = 0;
      videoEl.play().catch(() => {});
    } else {
      videoEl.pause();
    }
  }, [showVideo, videoUrl]);

  return (
    <div className="lg:sticky lg:top-24 w-full h-fit flex flex-col gap-2">
      {showVideo && videoUrl ? (
        <video
          key={videoUrl}
          ref={videoRef}
          src={videoUrl}
          className="w-full h-auto rounded-xl"
          controls
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : thumbnail ? (
        <div className="w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center text-gray-400 text-sm">
          No preview available
        </div>
      )}

      <p className="text-sm sm:text-base font-semibold text-gray-800 text-center line-clamp-2 px-1">
        {title}
      </p>
    </div>
  );
};

const ProductGroupSection = ({
  group,
  handleAddToCart,
  handleBuyNow,
  isLoading,
}: {
  group: TitleGroup;
  handleAddToCart: (
    e: React.MouseEvent<HTMLButtonElement>,
    product: ProductBase,
  ) => void | Promise<void>;
  handleBuyNow: (
    e: React.MouseEvent<HTMLButtonElement>,
    product: ProductBase,
  ) => void | Promise<void>;
  isLoading?: boolean;
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const [activeVideoUrl, setActiveVideoUrl] = useState<string | undefined>(
    undefined,
  );
  const [activeThumbnail, setActiveThumbnail] = useState<string | undefined>(
    undefined,
  );
  const [activeTitle, setActiveTitle] = useState<string | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoverKey, setHoverKey] = useState(0);

  const handleCardHover = (payload: HoverPayload) => {
    setActiveVideoUrl(payload.videoUrl ?? group.videoUrl);
    setActiveThumbnail(payload.thumbnail ?? group.representativeImage);
    setActiveTitle(payload.title);
    setIsPlaying(true);
    setHoverKey((k) => k + 1);
  };

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIsPlaying(false);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const displayedVideoUrl = activeVideoUrl ?? group.videoUrl;
  const displayedThumbnail = activeThumbnail ?? group.representativeImage;
  const displayedTitle = activeTitle ?? group.baseTitle;

  return (
    <div
      ref={sectionRef}
      className="w-full max-w-full"
      id={`product-group-${group.baseTitle.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 px-2">
        {group.baseTitle}
        {group.ageRangeLabel && (
          <span className="ml-2 text-sm sm:text-base font-normal text-gray-500">
            (Age: {group.ageRangeLabel} yrs)
          </span>
        )}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {group.variants.map((product) => (
            <AgeVariantCard
              key={product._id}
              product={product}
              onHover={handleCardHover}
              handleAddToCart={handleAddToCart}
              handleBuyNow={handleBuyNow}
              isLoading={isLoading}
            />
          ))}
        </div>

        <div className="lg:col-span-1">
          <VideoCard
            videoUrl={displayedVideoUrl}
            thumbnail={displayedThumbnail}
            title={displayedTitle}
            isPlaying={isPlaying}
            hoverKey={hoverKey}
          />
        </div>
      </div>
    </div>
  );
};

const ProductsByTitle = ({
  products,
  handleAddToCart,
  handleBuyNow,
  isLoading,
}: ProductsByTitleProps) => {
  const groups = groupProductsByTitle(products);

  if (groups.length === 0) return null;

  return (
    <div className="flex flex-col gap-10 sm:gap-14 w-full max-w-full">
      {groups.map((group) => (
        <ProductGroupSection
          key={group.baseTitle}
          group={group}
          handleAddToCart={handleAddToCart}
          handleBuyNow={handleBuyNow}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default ProductsByTitle;
