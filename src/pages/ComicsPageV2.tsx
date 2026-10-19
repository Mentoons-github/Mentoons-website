import ComicViewer from "@/components/common/ComicViewer";
import LoginModal from "@/components/common/modal/loginModal";
import AddToCartModal from "@/components/modals/AddToCartModal";
import { WORKSHOP_MATTERS_POINTS } from "@/constant";
import { addItemCart } from "@/redux/cartSlice";
import { fetchProducts } from "@/redux/productSlice";
import { AppDispatch, RootState } from "@/redux/store";
import {
  AudioComicProduct,
  ComicProduct,
  ProductBase,
} from "@/types/productTypes";
import { formatDateString } from "@/utils/formateDate";
import { FaShoppingCart } from "react-icons/fa";
import { FaBolt } from "react-icons/fa6";
import SubscriptionLimitModal from "@/components/modals/SubscriptionLimitModal";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import ComicHero from "@/components/comics/hero";
import ScrollTextSection from "@/components/comics/scrollText";

/*
  Comic theme tokens (shared with Cart / OrderSummary / PaymentStatus)
  page   #FFFFFF   white background
  ink    #000      outlines + hard shadows
  yellow #FFD93B   banners / secondary actions
  red    #FF4D3D   primary actions
  blue   #2D6BFF   accents

  The font is applied with .comic-body only on the sections of this page, so
  ComicHero, ScrollTextSection and ComicViewer keep their own typography.
  Mobile (< lg): thinner borders, smaller shadows, no tilt, swipe-snap carousel
  (arrow buttons hidden), stacked card buttons.
*/
const comicCss = `
@import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700;900&display=swap');

.comic-body { font-family: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif; color: #000; }
.comic-title { font-family: 'Bangers', 'Impact', sans-serif; letter-spacing: 0.04em; }

.comic-panel { border: 3px solid #000; box-shadow: 4px 4px 0 #000; }
.comic-btn {
  border: 3px solid #000;
  box-shadow: 3px 3px 0 #000;
  transition: transform 0.08s ease, box-shadow 0.08s ease;
}
.comic-btn:active { transform: translate(3px, 3px); box-shadow: 0 0 0 #000; }
.comic-btn:focus-visible { outline: 4px dashed #2D6BFF; outline-offset: 3px; }
.comic-btn:disabled { opacity: 0.6; cursor: not-allowed; }

@media (min-width: 1024px) {
  .comic-panel { border-width: 4px; box-shadow: 8px 8px 0 #000; }
  .comic-btn { border-width: 4px; box-shadow: 5px 5px 0 #000; }
  .comic-btn:hover:not(:disabled) { transform: translate(-2px, -2px); box-shadow: 7px 7px 0 #000; }
  .comic-btn:active:not(:disabled) { transform: translate(5px, 5px); box-shadow: 0 0 0 #000; }
}

.comic-snap { scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
.comic-snap > * { scroll-snap-align: center; }
.comic-hide-scroll { scrollbar-width: none; }
.comic-hide-scroll::-webkit-scrollbar { display: none; }

@media (prefers-reduced-motion: reduce) {
  .comic-btn { transition: none; }
}
`;

interface DBUser {
  _id: string;
  subscription: {
    plan: string;
    startDate?: string;
  };
}

const ComicsPageV2 = () => {
  const { items: products } = useSelector((state: RootState) => state.products);

  const { user } = useUser();
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const trendingCarouselRef = useRef<HTMLDivElement>(null);
  const [selectedComic, setSelectedComic] = useState<ProductBase>();
  const [showComicModal, setShowComicModal] = useState(false);
  const [comicToView, setComicToView] = useState<string>("");
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [productType, setProductType] = useState<string>("");
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getToken, userId } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [hasFetchedUser, setHasFetchedUser] = useState(false);
  const [showSubscriptionLimitModal, setShowSubscriptionLimitModal] =
    useState(false);
  const [limitModalMessage, setLimitModalMessage] = useState("");
  const [limitModalTitle, setLimitModalTitle] = useState("");
  const [currentProductId, setCurrentProductId] = useState<string>("");

  const [scrollProgress, setScrollProgress] = useState(0);

  const [searchParams] = useSearchParams();
  const selectedOption = searchParams.get("option") || "comic";

  const membershipType = dbUser?.subscription.plan.toLowerCase() || "free";

  const trendingRef = useRef(null);

  useEffect(() => {
    const handleScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScrollProgress, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollProgress);
  }, []);

  const handleScroll = () => {
    const carousel = trendingCarouselRef.current;
    if (carousel) {
      setIsAtStart(carousel.scrollLeft === 0);
      setIsAtEnd(
        carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1,
      );
    }
  };

  const checkContentAccess = async (product: ProductBase): Promise<boolean> => {
    if (!user) {
      setTimeout(() => setShowLoginModal(true), 100);
      return false;
    }
    if (isLoadingUser) {
      toast.info("Loading user data, please wait...");
      return false;
    }
    if (!dbUser || !userId) {
      if (!hasFetchedUser) {
        toast.info("Loading user data...");
        fetchDBUser();
      } else {
        toast.error("Unable to verify user. Please refresh the page.");
      }
      return false;
    }
    try {
      const token = await getToken();
      const type =
        product.type === "comic"
          ? "comics"
          : product.type === "audio comic"
            ? "audioComics"
            : "podcasts";
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_PROD_URL}/subscription/access`,
        { type, itemId: product._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const { access, reason } = response.data;
      if (access) {
        return true;
      }
      if (reason === "upgrade") {
        setLimitModalTitle("Upgrade Your Plan");
        setLimitModalMessage(
          `You've reached the ${type} limit for your ${membershipType} plan. Upgrade to access more content!`,
        );
      } else if (reason === "charge") {
        setLimitModalTitle("Purchase Content");
        setLimitModalMessage(
          `You've reached the ${type} limit for your Platinum plan. Purchase this content for ₹1 to continue.`,
        );
      }
      setCurrentProductId(product._id || "");
      setShowSubscriptionLimitModal(true);
      return false;
    } catch (error) {
      console.error("Error checking access:", error);
      toast.error("Failed to verify access. Please try again.");
      return false;
    }
  };

  const openComicModal = async (
    comicLink: string,
    comic?: ProductBase | null,
    productType?: string,
  ) => {
    if (!comic) {
      setComicToView(comicLink);
      setShowComicModal(true);
      if (productType) setProductType(productType);
      document.body.style.overflow = "hidden";
      return;
    }
    const canAccess = await checkContentAccess(comic);
    if (canAccess) {
      setComicToView(comicLink);
      setCurrentProductId(comic._id || "");
      setShowComicModal(true);
      if (productType || comic.product_type)
        setProductType(productType || comic.product_type || "");
      document.body.style.overflow = "hidden";
    }
  };

  const closeComicModal = () => {
    setShowComicModal(false);
    setProductType("");
    setCurrentProductId("");
    document.body.style.overflow = "auto";
  };

  const fetchDBUser = useCallback(async () => {
    if (!user?.id) {
      setIsLoadingUser(false);
      return;
    }
    setIsLoadingUser(true);
    try {
      const token = await getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/user/user/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.status === 200) {
        setDbUser(response.data.data);
        setHasFetchedUser(true);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setIsLoadingUser(false);
    }
  }, [user?.id, getToken]);

  const handleAddtoCart = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    comic: ProductBase,
  ) => {
    e.stopPropagation();
    if (comic.product_type) {
      toast.error("This content is available only through subscription.");
      return;
    }
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token || !userId) {
        setShowLoginModal(true);
        setIsLoading(false);
        return;
      }
      const response = await dispatch(
        addItemCart({
          token,
          userId,
          productId: comic._id,
          productType: comic.type,
          title: comic.title,
          quantity: 1,
          price: comic.price,
          ageCategory: comic.ageCategory,
          productImage: comic.productImages?.[0].imageUrl,
          productDetails: comic.details,
        }),
      );
      if (response.payload) {
        setSelectedComic(comic);
        setShowAddToCartModal(true);
        toast.success("Added to cart!");
      } else {
        toast.error("Failed to add to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Error while adding to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async (
    e: React.MouseEvent<HTMLButtonElement>,
    product: ProductBase,
  ) => {
    e.stopPropagation();
    if (product.product_type) {
      toast.error("This content is available only through subscription.");
      return;
    }
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        setShowLoginModal(true);
        setIsLoading(false);
        return;
      }
      navigate(`/order-summary?productId=${product._id}`, { replace: true });
    } catch (error) {
      console.error("Error navigating to order summary:", error);
      toast.error("Error processing purchase");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    videoRefs.current.forEach((video) => {
      if (video) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) {
              video.pause();
              video.currentTime = 0;
            }
          },
          { threshold: 0.5 },
        );
        observer.observe(video);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [products]);

  useEffect(() => {
    const fetchComics = async () => {
      setIsFetchingProducts(true);
      try {
        const token = await getToken();
        await dispatch(fetchProducts({ type: selectedOption, token: token! }));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsFetchingProducts(false);
      }
    };
    fetchComics();
  }, [dispatch, selectedOption, getToken]);

  useEffect(() => {
    const carousel = trendingCarouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", handleScroll);
      return () => carousel.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    fetchDBUser();
  }, [fetchDBUser]);

  return (
    <div>
      <style>{comicCss}</style>

      {/* Scroll progress bar */}
      <div
        className="fixed left-0 right-0 top-0 z-50 h-2 origin-left border-b-2 border-black bg-[#FF4D3D] transition-all duration-150"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />

      <ComicHero />

      {/* Trending comics */}
      <div
        ref={trendingRef}
        className="comic-body animate-slide-up relative mx-auto mb-12 mt-10 w-[95%] md:w-[90%] lg:mb-20"
      >
        <h2 className="comic-title mb-6 inline-block border-[3px] border-black bg-[#FFD93B] px-4 py-1.5 text-4xl leading-none shadow-[4px_4px_0_#000] sm:text-5xl lg:-rotate-1 lg:border-4 lg:px-6 lg:py-2 lg:text-6xl lg:shadow-[6px_6px_0_#000]">
          Trending Comics For You!
        </h2>

        {isFetchingProducts ? (
          <div className="flex h-[320px] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-[5px] border-black border-t-[#FFD93B]" />
          </div>
        ) : (
          <div
            className="comic-snap comic-hide-scroll flex scroll-smooth gap-5 overflow-x-auto px-2 pb-10 pr-4 pt-2 md:gap-8 lg:pb-14"
            ref={trendingCarouselRef}
          >
            {products.map((comic: ProductBase, index) => (
              <div
                className="animate-fade-in-up group relative h-full w-[78vw] max-w-[320px] flex-shrink-0 sm:w-[320px]"
                key={comic._id}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="comic-panel relative h-full overflow-hidden rounded-xl bg-white lg:transition-transform lg:duration-200 lg:hover:-rotate-1">
                  <div className="relative h-48 overflow-hidden border-b-[3px] border-black lg:border-b-4">
                    <img
                      src={
                        comic.productImages?.[0].imageUrl ||
                        "/placeholder-image.jpg"
                      }
                      alt={comic.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      <span className="border-[3px] border-black bg-white px-3 py-0.5 text-sm font-black shadow-[2px_2px_0_#000]">
                        {formatDateString(
                          (comic.details as ComicProduct["details"])
                            ?.releaseDate || "",
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="comic-title mb-2 line-clamp-1 text-3xl leading-none">
                      {comic?.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm font-bold text-gray-700">
                      {comic?.description}
                    </p>
                    <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-black">
                      <div className="flex items-center gap-1">
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477 4.5 1.253" />
                        </svg>
                        {comic.type === "comic" && (
                          <span>
                            {(comic.details as ComicProduct["details"]).pages}{" "}
                            pages
                          </span>
                        )}
                        {comic.type === "audio comic" && (
                          <span>
                            {
                              (comic.details as AudioComicProduct["details"])
                                .duration
                            }{" "}
                            duration
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{Math.floor(Math.random() * 20)} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                        <span>{comic.rating}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {comic.product_type && (
                        <button
                          onClick={() => {
                            if ("sampleUrl" in comic.details) {
                              openComicModal(
                                comic.details.sampleUrl || "",
                                comic,
                                comic.product_type,
                              );
                            }
                          }}
                          className="comic-btn comic-title flex-1 rounded-xl bg-[#FF4D3D] px-4 py-2 text-2xl text-white [text-shadow:2px_2px_0_#000]"
                        >
                          {comic.type === "comic" ? "Read Now" : "Listen Now"}
                        </button>
                      )}
                      {!comic.product_type && (
                        <div className="flex w-full flex-col gap-3">
                          <button
                            onClick={(e) => handleAddtoCart(e, comic)}
                            disabled={isLoading}
                            className="comic-btn comic-title flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#FF4D3D] px-4 py-2 text-2xl text-white [text-shadow:2px_2px_0_#000]"
                          >
                            <FaShoppingCart className="inline-block h-4 w-4 self-center" />
                            {isLoading ? "Adding..." : "Add to Cart"}
                          </button>
                          <button
                            onClick={(e) => handleBuyNow(e, comic)}
                            disabled={isLoading}
                            className="comic-btn comic-title flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#FFD93B] px-4 py-2 text-2xl text-black"
                          >
                            <FaBolt className="inline-block h-4 w-4 self-center" />
                            {isLoading ? "Buying..." : "Buy Now"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Arrow buttons: desktop only; on mobile the carousel is swipeable */}
        <button
          onClick={() => {
            const carousel = trendingCarouselRef.current;
            if (carousel) {
              carousel.scrollBy({ left: -300, behavior: "smooth" });
            }
          }}
          aria-label="Scroll left"
          className={`comic-btn absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-[#FFD93B] p-2 ${
            isAtStart ? "hidden" : "hidden lg:block"
          }`}
        >
          <IoIosArrowBack className="text-2xl" />
        </button>
        <button
          onClick={() => {
            const carousel = trendingCarouselRef.current;
            if (carousel) {
              carousel.scrollBy({ left: 300, behavior: "smooth" });
            }
          }}
          aria-label="Scroll right"
          className={`comic-btn absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-[#FFD93B] p-2 ${
            isAtEnd ? "hidden" : "hidden lg:block"
          }`}
        >
          <IoIosArrowForward className="text-2xl" />
        </button>
      </div>

      <ScrollTextSection />

      {/* Comic modal */}
      {showComicModal && (
        <div className="animate-fade-in fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75">
          <div className="comic-body comic-panel animate-scale-in relative h-[90vh] w-[95%] items-center overflow-hidden rounded-lg bg-white">
            <button
              onClick={closeComicModal}
              aria-label="Close"
              className="comic-btn absolute right-3 top-3 z-10 rounded-full bg-[#FF4D3D] p-1.5 text-white"
            >
              <MdClose className="text-2xl" />
            </button>
            <ComicViewer
              pdfUrl={comicToView}
              productType={productType}
              productId={currentProductId}
              dbUser={dbUser}
              userPlan={membershipType}
            />
          </div>
        </div>
      )}

      <SubscriptionLimitModal
        isOpen={showSubscriptionLimitModal}
        onClose={() => setShowSubscriptionLimitModal(false)}
        message={limitModalMessage}
        title={limitModalTitle}
        planType={membershipType as "free" | "prime" | "platinum"}
        productId={currentProductId}
      />

      {/* Why our comics matter */}
      <div className="comic-body animate-fade-in flex flex-col-reverse border-t-4 border-black bg-white px-4 py-10 md:px-12 lg:flex-row lg:items-center lg:gap-10 lg:border-t-8 lg:px-20 lg:py-14">
        <div className="flex-1 space-y-5 pt-8 lg:pt-0">
          {WORKSHOP_MATTERS_POINTS.map((point, index) => (
            <div
              key={point.id}
              className="animate-slide-in-left comic-panel flex items-start gap-4 rounded-2xl bg-white p-4 md:items-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <figure className="shrink-0 rounded-full border-[3px] border-black bg-[#FFD93B] p-2">
                <img src={point.icon} alt="icon" className="w-16 md:w-20" />
              </figure>
              <div>
                <p className="text-lg font-bold md:text-xl">
                  <span className="comic-title text-3xl">{point.lable}:</span>{" "}
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="relative flex-1">
          <h2 className="comic-title mx-auto max-w-xl border-[3px] border-black bg-[#FFD93B] px-4 py-6 text-center text-5xl leading-[1.05] shadow-[4px_4px_0_#000] md:text-7xl lg:-rotate-2 lg:border-4 lg:px-8 lg:py-10 lg:text-8xl lg:shadow-[8px_8px_0_#000]">
            Why our Comics matter?
          </h2>
        </div>
      </div>

      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      )}
      {showAddToCartModal && (
        <AddToCartModal
          onClose={() => setShowAddToCartModal(false)}
          isOpen={showAddToCartModal}
          productName={selectedComic?.title || ""}
        />
      )}
    </div>
  );
};

export default ComicsPageV2;
