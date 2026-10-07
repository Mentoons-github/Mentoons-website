import ProductCard from "@/components/MentoonsStore/ProductCard";
import AddToCartModal from "@/components/modals/AddToCartModal";
import EnquiryModal from "@/components/modals/EnquiryModal";
import FAQCard from "@/components/shared/FAQSection/FAQCard";
import { PRODUCT_TYPE } from "@/constant";
import { FAQ_PRODUCT_DETAILS } from "@/constant/faq";
import { addItemCart } from "@/redux/cartSlice";
import { fetchProductById, fetchProducts } from "@/redux/productSlice";
import { AppDispatch, RootState } from "@/redux/store";
import {
  AudioComicProduct,
  ComicProduct,
  PodcastProduct,
  ProductBase,
  ProductType,
} from "@/types/productTypes";
import { RewardEventType } from "@/types/rewards";
import { ModalMessage } from "@/utils/enum";
// import { formatDateString } from "@/utils/formateDate";
import { triggerReward } from "@/utils/rewardMiddleware";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

import { ChevronLeft, ChevronRight, Minus, Plus, ZoomIn } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BiSolidMessage } from "react-icons/bi";
import { FiShare2 } from "react-icons/fi";
import { IoIosCart } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { toast } from "sonner";

type MediaItem = { type: "video" | "image"; url: string };

const ProductDetails = () => {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const { getToken, userId } = useAuth();
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [showShareModal, setShowShareModal] = useState(false);

  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductBase>();
  const [recommendationsFilter, setRecommendationFilter] = useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = direction === "left" ? -400 : 400;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });

    setScrollPosition(container.scrollLeft + scrollAmount);
  };

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setScrollPosition(container.scrollLeft);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      console.log("fetching product");
      try {
        if (!productId) {
          toast.error("Product ID is missing");
          return;
        }
        const productResponse = await dispatch(fetchProductById(productId));
        console.log("product response :", productResponse);

        if (
          typeof productResponse.payload === "object" &&
          productResponse.payload !== null
        ) {
          console.log(productResponse.payload);
          setProduct(productResponse.payload as ProductBase);
          setRecommendationFilter(productResponse.payload?.type);
        } else {
          toast.error("Failed to fetch product details");
        }
      } catch (error) {
        toast.error("Failed to fetch product details");
      }
    };
    fetchProduct();
  }, [dispatch, productId]);

  const {
    items: recommendedProducts,
    loading,
    error,
  } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    const RecommendedProducts = async () => {
      try {
        await dispatch(fetchProducts({}));
      } catch (error) {
        toast.error("Failed to fetch recommended products");
      }
    };
    RecommendedProducts();
  }, [product, dispatch]);

  const handleUpdateQuantity = (flag: string) => {
    const newQuantity = flag === "+" ? quantity + 1 : Math.max(1, quantity - 1);
    setQuantity(newQuantity);
  };

  const handleAddtoCart = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();

    try {
      const token = await getToken();
      if (!token) {
        toast.error("Please login to add to cart");
        return;
      }

      if (!product) {
        toast.error("Product details not available");
        return;
      }

      if (userId) {
        const response = await dispatch(
          addItemCart({
            token,
            userId,
            productId: product._id,
            productType: product.type,
            title: product.title,
            quantity: quantity || 1,
            price: product.price,
            ageCategory: product.ageCategory,
            productImage: product.productImages?.[0].imageUrl,
            productDetails: product.details,
          }),
        );
        if (response.payload) {
          setShowAddToCartModal(true);
        }
        setIsLoading(false);
      } else {
        toast.error("User ID is missing");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Error while adding to cart");
      setIsLoading(false);
    }
  };

  const handleBuyNow = async (product: ProductBase) => {
    const token = await getToken();
    if (!token) {
      toast.error("Please login to add to cart");
      setIsLoading(false);
      return;
    }
    navigate(`/order-summary?productId=${product._id}`);
  };

  const handleShare = () => {
    setShowShareModal(!showShareModal);
  };

  const handleShareCompleted = (platform: string) => {
    if (product?._id) {
      triggerReward(RewardEventType.SHARE_PRODUCT, product._id);
      toast.success(`Shared on ${platform}! You earned reward points.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const queryResponse = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/query`,
        {
          message: message,
        },
      );
      if (queryResponse.status === 201) {
        setShowEnquiryModal(true);
      }
    } catch (error) {
      toast.error("Failed to submit message");
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || !isZoomed) return;

    const { left, top, width, height } =
      imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImage(index);
  };

  const media: MediaItem[] = [
    ...(product?.productVideos?.[0]?.videoUrl
      ? [{ type: "video" as const, url: product.productVideos[0].videoUrl }]
      : []),
    ...(product?.productImages?.map((img) => ({
      type: "image" as const,
      url: img.imageUrl,
    })) ?? []),
  ];

  const navigateImage = (direction: "next" | "prev") => {
    if (!media.length) return;

    if (direction === "next") {
      setSelectedImage((prev) => (prev + 1) % media.length);
    } else {
      setSelectedImage((prev) => (prev - 1 + media.length) % media.length);
    }
  };

  const hasDiscount =
    product?.mrp !== undefined &&
    product?.mrp !== null &&
    product.mrp > product.price;
  const discountPercent =
    hasDiscount && product?.mrp
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  if (loading || !product) {
    return (
      <div className="w-[90%] mx-auto my-20 animate-pulse">
        <div className="flex flex-col md:flex-row h-auto md:h-[600px] gap-4 md:gap-8">
          <div className="flex flex-col flex-1 pb-3">
            <div className="w-32 h-8 mb-2 bg-gray-200 rounded-full"></div>
            <div className="h-16 mb-4 bg-gray-200 rounded-lg"></div>
            <div className="h-20 w-[90%] bg-gray-200 rounded-lg"></div>
          </div>
          <div className="flex-1 h-[300px] bg-gray-200 rounded-lg"></div>
        </div>

        <div className="mt-8">
          <div className="w-24 h-6 mb-4 bg-gray-200 rounded"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-8 bg-gray-200 rounded-full"></div>
              ))}
            </div>
            <div className="w-12 h-6 bg-gray-200 rounded"></div>
          </div>
          <div className="w-24 h-8 mb-8 bg-gray-200 rounded"></div>

          <div className="flex gap-4 mb-8">
            <div className="flex-1 h-12 bg-gray-200 rounded"></div>
            <div className="flex-1 h-12 bg-gray-200 rounded"></div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[90%] mx-auto my-20 text-center">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold text-red-600">
            Error Loading Product
          </h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 text-white rounded-lg bg-primary hover:bg-primary-dark"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[90%] mx-auto my-20 mt-10">
      <div className="flex flex-col-reverse justify-between md:flex-row h-auto md:h-[600px]   rounded-2xl gap-4 md:gap-8 ">
        <div className="flex flex-col flex-1 justify-between">
          <span className="px-4 py-1 mb-2 text-sm font-bold text-white rounded-full sm:px-6 sm:py-2 sm:text-lg md:text-2xl bg-primary w-fit">
            For {product?.ageCategory}
          </span>
          <h1 className="pb-2 text-2xl font-bold leading-tight sm:text-3xl md:text-5xl lg:text-6xl">
            {product?.title}
          </h1>
          <p className="pb-4 text-xs sm:text-sm md:text-base lg:text-lg w-full md:w-[90%]">
            {product?.description}
          </p>
          <div>
            <span className="font-semibold text-gray-500">Mentoons</span>

            <Rating ratings={Number(product?.rating)} />

            <div className="my-2">
              {product?.price === 0 ? (
                <span className="p-1 px-2 text-green-600 bg-green-200 rounded-sm shadow-lg">
                  Free
                </span>
              ) : (
                <div>
                  {hasDiscount && (
                    <span className="block text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
                      Introductory Price
                    </span>
                  )}
                  <div className="flex items-baseline gap-2 flex-wrap">
                    {hasDiscount && (
                      <span className="text-lg text-gray-400 line-through">
                        ₹ {product?.mrp}
                      </span>
                    )}
                    <span className="text-2xl font-semibold text-neutral-800">
                      ₹ {product?.price}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm font-bold text-green-600">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>
                </div>
              )}
              {(product?.title === "Conversation Starter Cards (6-12) years" ||
                product?.title === "Silent Stories (6-12) years") &&
                product?.ageCategory === "6-12" && (
                  <a
                    href={`${
                      product?.title ===
                      "Conversation Starter Cards (6-12) years"
                        ? "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/freeDownloads/Coversation+starter+cards+6-12+free.pdf"
                        : "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/freeDownloads/Silent+story+6-12+free.pdf"
                    }`}
                    download
                    className="inline-block mt-3 px-4 py-3 text-white transition-all duration-200 bg-green-500 rounded-full hover:opacity-55"
                  >
                    Download Free Sample
                  </a>
                )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pb-4">
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <button
                  disabled={quantity === 1}
                  onClick={() => handleUpdateQuantity("-")}
                  className="p-2 transition duration-300 border rounded-full hover:bg-black hover:text-white all disabled:opacity-50 "
                >
                  <Minus
                    className={`w-4 h-4  font-bold flex ${
                      quantity === 1 ? "text-gray-400" : ""
                    } `}
                  />
                </button>
                <span className="w-8 font-bold text-center">{quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity("+")}
                  disabled={product?.price === 0}
                  className="p-2 transition duration-300 border rounded-full hover:bg-black hover:text-white all disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 font-bold" />
                </button>
              </div>
            </div>
          </div>

          {product?.price === 0 ? (
            <div className="flex flex-col w-full gap-4 mt-4">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (product?.type === ProductType.COMIC) {
                      window.open(
                        (product.details as ComicProduct["details"]).sampleUrl,
                        "_blank",
                      );
                    } else if (product?.type === ProductType.AUDIO_COMIC) {
                      window.open(
                        (product.details as AudioComicProduct["details"])
                          .sampleUrl,
                        "_blank",
                      );
                    } else if (product?.type === ProductType.PODCAST) {
                      window.open(
                        (product.details as PodcastProduct["details"])
                          .sampleUrl,
                        "_blank",
                      );
                    }
                  }}
                  className="flex-1 px-4 py-3 font-bold tracking-wide text-white transition-all duration-200 bg-green-500 rounded-full hover:opacity-55"
                >
                  Download For Free
                </button>

                <button
                  className="px-4 py-3 font-bold tracking-wide text-white transition-all duration-200 bg-green-500 rounded-full hover:opacity-55"
                  onClick={handleShare}
                  title="Share this product"
                >
                  <FiShare2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-full gap-4 mt-4">
              <div className="flex gap-2">
                <button
                  className="flex items-center justify-center flex-1 px-4 py-2 font-medium transition-colors border rounded text-primary border-primary hover:bg-primary/10"
                  onClick={(e) => handleAddtoCart(e)}
                  disabled={isLoading}
                >
                  <IoIosCart className="w-5 h-5 mr-2" />
                  {isLoading ? "Adding..." : "Add to Cart"}
                </button>

                <button
                  className="flex items-center justify-center px-4 py-2 font-medium transition-colors border rounded text-primary border-primary hover:bg-primary/10"
                  onClick={handleShare}
                  title="Share this product"
                >
                  <FiShare2 className="w-5 h-5" />
                </button>
              </div>

              <button
                className="flex items-center justify-center w-full px-4 py-2 font-medium text-white transition-colors rounded bg-primary hover:bg-primary-dark"
                onClick={() => handleBuyNow(product)}
                disabled={isLoading}
              >
                Buy Now
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 w-full border-[0.5px] border-primary rounded-lg shadow-lg shadow-orange-600/15">
          <div
            ref={imageContainerRef}
            className="relative w-full h-[300px] md:h-[500px] overflow-hidden  rounded-lg cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            {media.length > 1 && (
              <>
                <button
                  className="absolute z-10 p-2 transform -translate-y-1/2 bg-white rounded-full shadow-md opacity-80 hover:opacity-100 left-2 top-1/2"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage("prev");
                  }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  className="absolute z-10 p-2 transform -translate-y-1/2 bg-white rounded-full shadow-md opacity-80 hover:opacity-100 right-2 top-1/2"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage("next");
                  }}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {media[selectedImage]?.type !== "video" && (
              <div className="absolute z-10 p-1 bg-white rounded-full shadow-md opacity-80 top-2 right-2">
                <ZoomIn className="w-4 h-4" />
              </div>
            )}

            {media[selectedImage]?.type === "video" ? (
              <video
                src={media[selectedImage].url}
                controls
                autoPlay
                muted
                playsInline
                className="object-contain w-full h-full"
              />
            ) : (
              <img
                src={media[selectedImage]?.url}
                alt={product?.title || "Product image"}
                className={`object-contain w-full h-full transition-transform duration-200 ${
                  isZoomed ? "scale-150" : ""
                }`}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }
                    : {}
                }
              />
            )}
          </div>

          {media.length > 0 && (
            <div className="flex justify-center mt-4 space-x-2 overflow-x-auto">
              {media.map((item, index) => (
                <div
                  key={`thumb-${index}`}
                  className={`w-16 h-16 border-2 rounded cursor-pointer ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent"
                  } hover:border-primary transition-all`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  {item.type === "video" ? (
                    <video
                      src={item.url}
                      muted
                      playsInline
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={`${product?.title} thumbnail ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-red-500 ">
        <div className="w-full h-[.5px] my-12 mb-8 bg-primary" />

        <div className="text-lg font-medium text-neutral-800">
          <h2 className="pb-4 text-2xl font-semibold">Product Details</h2>
          {product &&
            [
              {
                label: "Language",
                value:
                  "language" in product.details && product.details.language
                    ? product.details.language === "en"
                      ? "English"
                      : product.details.language
                    : "Not Available",
              },
              {
                label: "Print Length",
                value:
                  product.type === ProductType.MENTOONS_CARDS
                    ? "printLength" in product.details
                      ? `${product.details.printLength} cards`
                      : "pages" in product.details
                        ? `${product.details.pages} cards`
                        : "Not Available"
                    : "pages" in product.details && product.details.pages
                      ? `${product.details.pages} pages`
                      : "Not Available",
              },
              // {
              //   label: "Launch Date",
              //   value:
              //     product.type === ProductType.COMIC ||
              //     product.type === ProductType.AUDIO_COMIC ||
              //     product.type === ProductType.PODCAST ||
              //     product.type === ProductType.MENTOONS_BOOKS
              //       ? "releaseDate" in product.details &&
              //         product.details.releaseDate
              //         ? formatDateString(product.details.releaseDate)
              //         : "Not Available"
              //       : product.type === ProductType.WORKSHOP
              //         ? "schedule" in product.details &&
              //           product.details.schedule
              //           ? formatDateString(product.details.schedule)
              //           : "Not Available"
              //         : "Not Available",
              // },
              {
                label: "Reading Age",
                value: product.ageCategory || "Not Specified",
              },
            ].map((item, index) => (
              <div key={index} className="flex py-2">
                <div className="flex-1 font-semibold">{item.label}:</div>
                <div className="flex-1">{item.value}</div>
              </div>
            ))}
        </div>

        <div className="w-full p-4 mt-4 ">
          <div>
            <h2 className="mb-8 text-4xl font-semibold">
              You will also like this -
            </h2>
            <div className="flex flex-wrap items-center justify-start gap-6 mb-8 rounded-sm">
              {PRODUCT_TYPE.filter(
                (type) =>
                  type.value !== "audio comic" &&
                  type.value !== "podcast" &&
                  type.value !== "workshop" &&
                  type.value !== "assessment" &&
                  type.value !== "comic",
              ).map((type) => (
                <button
                  key={type.id}
                  className={`border border-primary text-primary
                          w-fit leading-none py-3 px-7 rounded  ${
                            recommendationsFilter === type.value &&
                            "bg-primary text-white shadow-sm shadow-primary/50"
                          }`}
                  onClick={() => setRecommendationFilter(type.value)}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            {scrollPosition > 0 && (
              <button
                onClick={() => handleScroll("left")}
                className="absolute left-0 z-10 p-2 -translate-y-1/2 bg-white rounded-full shadow-lg top-1/2 hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            <div
              ref={scrollContainerRef}
              onScroll={checkScrollPosition}
              className="flex py-16 overflow-x-scroll scrollbar-hide"
            >
              {recommendedProducts?.length > 0 ? (
                recommendedProducts
                  .filter((item) => item.type === recommendationsFilter)
                  .map((product) => {
                    return (
                      <div
                        className="min-w-[400px] flex justify-center"
                        key={product._id}
                      >
                        <ProductCard productDetails={product} />
                      </div>
                    );
                  })
              ) : (
                <div className="w-full p-8 text-center border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-lg font-medium text-gray-600">
                    No products found in this category
                  </p>
                  <p className="mt-2 text-sm text-gray-400">
                    Try selecting a different category
                  </p>
                </div>
              )}
            </div>

            {scrollContainerRef.current &&
              scrollPosition <
                scrollContainerRef.current.scrollWidth -
                  scrollContainerRef.current.clientWidth && (
                <button
                  onClick={() => handleScroll("right")}
                  className="absolute right-0 z-10 p-2 -translate-y-1/2 bg-white rounded-full shadow-lg top-1/2 hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
          </div>
        </div>

        <div className="pt-10 ">
          <h2 className="pb-6 text-2xl font-semibold md:text-4xl ">
            Frequently asked questions
          </h2>
          <div className="md:flex md:gap-8 ">
            <div className="flex flex-col flex-1 gap-4 mb-8 ">
              {FAQ_PRODUCT_DETAILS.map((faq, index) => (
                <FAQCard
                  key={faq.id}
                  faq={faq}
                  isExpanded={expandedIndex === index}
                  onClick={() =>
                    setExpandedIndex(index === expandedIndex ? -1 : index)
                  }
                />
              ))}
            </div>

            <div className="flex flex-col flex-1 gap-4 p-4 text-center border-2 md:mb-8 rounded-xl">
              <div className="w-[80%] mx-auto ">
                <div className="flex items-center justify-center gap-4 py-2 md:pb-6">
                  <BiSolidMessage className="text-5xl " />
                </div>
                <div>
                  <h3 className="text-xl font-bold md:text-3xl md:pb-4">
                    Have Doubts? We are here to help you!
                  </h3>
                  <p className="pt-2 pb-4 text-gray-600 md:text-xl md:pb-6">
                    Contact us for additional help regarding your assessment or
                    purchase made on this platform, We will help you!{" "}
                  </p>
                </div>
                <div className="">
                  <form
                    className="flex flex-col w-full gap-10"
                    onSubmit={(e) => handleSubmit(e)}
                  >
                    <textarea
                      name="doubt"
                      id="doubt"
                      placeholder="Enter your doubt here"
                      className="box-border w-full p-3 rounded-lg shadow-xl border-2 border-[#60C6E6]"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>

                    <button
                      className="w-full py-3 mt-4 text-xl font-semibold text-white transition-all duration-200 rounded-lg shadow-lg text- text-ellipsist-white bg-primary "
                      type="submit"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showAddToCartModal && (
        <AddToCartModal
          onClose={() => setShowAddToCartModal(false)}
          isOpen={showAddToCartModal}
          productName={product.title}
        />
      )}
      {showEnquiryModal && (
        <EnquiryModal
          isOpen={showEnquiryModal}
          onClose={() => setShowEnquiryModal(false)}
          message={ModalMessage.ENQUIRY_MESSAGE}
        />
      )}

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Share this product</h3>
              <button
                onClick={handleShare}
                className="text-xl text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <FacebookShareButton
                url={window.location.href}
                hashtag="#Mentoons"
                onShareWindowClose={() => handleShareCompleted("Facebook")}
              >
                <FacebookIcon size={50} round />
                <p className="mt-1 text-xs text-center">Facebook</p>
              </FacebookShareButton>

              <TwitterShareButton
                url={window.location.href}
                title={`Check out ${product.title} on Mentoons!`}
                onShareWindowClose={() => handleShareCompleted("Twitter")}
              >
                <TwitterIcon size={50} round />
                <p className="mt-1 text-xs text-center">Twitter</p>
              </TwitterShareButton>

              <WhatsappShareButton
                url={window.location.href}
                title={`Check out ${product.title} on Mentoons!`}
                onShareWindowClose={() => handleShareCompleted("WhatsApp")}
              >
                <WhatsappIcon size={50} round />
                <p className="mt-1 text-xs text-center">WhatsApp</p>
              </WhatsappShareButton>

              <EmailShareButton
                url={window.location.href}
                subject={`Check out ${product.title} on Mentoons!`}
                body={`I thought you might be interested in this product: ${product.title}\n\n${product.description}\n\nCheck it out here: ${window.location.href}`}
                onShareWindowClose={() => handleShareCompleted("Email")}
              >
                <EmailIcon size={50} round />
                <p className="mt-1 text-xs text-center">Email</p>
              </EmailShareButton>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">Or copy link</p>
              <div className="flex mt-2">
                <input
                  type="text"
                  value={window.location.href}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary"
                  readOnly
                />
                <button
                  className="px-4 py-2 text-white rounded-r-md bg-primary hover:bg-primary-dark"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard!");
                    handleShareCompleted("Direct Link");
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

const Rating = ({ ratings }: { ratings: number }) => {
  return (
    <div className="flex items-center gap-4 mt-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const rating = ratings;
          const filled = star <= Math.floor(rating);
          const partial = !filled && star <= Math.ceil(rating);
          const percentage = partial ? (rating % 1) * 100 : 0;

          return (
            <div key={star} className="relative">
              <svg
                className="w-8 h-8 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>

              <div
                className="absolute top-0 left-0 overflow-hidden"
                style={{ width: filled ? "100%" : `${percentage}%` }}
              >
                <svg
                  className="w-8 h-8 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
      <span className="font-semibold text-gray-500 ">{ratings}</span>
    </div>
  );
};
