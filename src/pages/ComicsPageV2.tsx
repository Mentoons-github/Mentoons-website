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
import {
  canAccessContent,
  getUserSubscriptionLimits,
  updateUserContentAccess,
  UserSubscriptionLimits,
} from "@/utils/subscriptionAccess";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { motion, useScroll, useSpring } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ComicsPageV2 = () => {
  const {
    items: products,
    // loading,
    // error,
  } = useSelector((state: RootState) => state.products);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [selectedComic, setSelectedComic] = useState<ProductBase>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showComicModal, setShowComicModal] = useState(false);
  const [comicToView, setComicToView] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  // const [ageCategory, setAgeCategory] = useState<string>("");
  const [productType, setProductType] = useState<string>("");
  const option =
    new URLSearchParams(window.location.search).get("option") || "comic";
  const [selectedOption, setSelectedOption] = useState(option);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getToken, userId } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useUser();
  const [userLimits, setUserLimits] = useState<UserSubscriptionLimits | null>(
    null
  );
  const [dbUser, setDbUser] = useState<any>(null);

  const membershipType = dbUser?.subscription.plan;
  const [currentProductId, setCurrentProductId] = useState<string>("");

  // Subscription limit modal state
  const [showSubscriptionLimitModal, setShowSubscriptionLimitModal] =
    useState(false);
  const [limitModalMessage, setLimitModalMessage] = useState("");
  const [limitModalTitle, setLimitModalTitle] = useState("");

  const maxComicsToRead = membershipType === "platinum" ? 5 : products.length;
  const accessibleComics = products.slice(0, maxComicsToRead);

  console.log(accessibleComics);
  console.log(selectedComic);
  // Add refs for scroll animations
  const heroRef = useRef(null);
  const trendingRef = useRef(null);
  const featureRef = useRef(null);

  // Scroll progress animations
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const handleSelectedOption = (option: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("option", option);
    window.history.pushState(null, "", `?${searchParams.toString()}`);
    setSelectedOption(option);
  };

  // const handleAgeCategory = (category: string) => {
  //   setAgeCategory(category);
  // };

  const handleScroll = () => {
    const carousel = carouselRef.current;
    if (carousel) {
      setIsAtStart(carousel.scrollLeft === 0);
      setIsAtEnd(
        carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1
      );
    }
  };

  const handleAddtoCart = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    comic: ProductBase
  ) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        setIsLoading(false);
        setShowLoginModal(true);
        return;
      }

      if (userId) {
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
          })
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
      console.error("Error while adding to cart", error);
      toast.error("Error while adding to cart");
      setIsLoading(false);
    }
  };

  const handleBuyNow = async (
    e: React.MouseEvent<HTMLButtonElement>,
    product: ProductBase
  ) => {
    e.stopPropagation();
    const token = await getToken();
    if (!token) {
      setIsLoading(false);
      setShowLoginModal(true);
      return;
    }
    // handleAddtoCart(event)
    navigate(`/order-summary?productId=${product._id}`, { replace: true });
  };

  const openComicModal = (
    comicLink: string,
    comic?: ProductBase | null,
    productType?: string
  ) => {
    if (!comic) {
      // For backwards compatibility - allow opening comics without checking access
      setComicToView(comicLink);
      setShowComicModal(true);
      if (productType) setProductType(productType);
      document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
      return;
    }

    // Check user access before opening comic
    if (checkContentAccess(comic)) {
      setComicToView(comicLink);
      setCurrentProductId(comic._id || ""); // Set the current product ID for reward tracking
      setShowComicModal(true);
      if (productType) setProductType(productType);
      document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    }
  };

  const closeComicModal = () => {
    setShowComicModal(false);
    setProductType("");
    setCurrentProductId("");
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", handleScroll);
      return () => carousel.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Function to pause all videos
  const pauseAllVideos = () => {
    videoRefs.current.forEach((video) => {
      if (video && !video.paused) {
        video.pause();
      }
    });
    setIsPlaying(false);
  };

  console.log(selectedComic);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        // Fetch products with the current filters
        const token = await getToken();
        if (selectedOption) {
          const cards = await dispatch(
            fetchProducts({
              type: selectedOption,
              // ageCategory: ageCategory,
              token: token!,
            })
          );
          console.log(cards.payload);
          console.log("Product", products);
          setSelectedComic(products[0]);
          // setTimeout(() => {
          //   if (productSectionRef.current) {
          //     productSectionRef.current.scrollIntoView({
          //       behavior: "smooth",
          //       block: "start",
          //     });
          //   }
          // }, 100);
        } else {
          await dispatch(fetchProducts({}));
        }
      } catch (error: unknown) {
        console.error("Error fetching products:", error);
      }
    };

    fetchComics();
  }, [dispatch, selectedOption, option, getToken, products]);

  const fetchDBUser = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `https://mentoons-backend-zlx3.onrender.com/api/v1/user/user/${user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data);
      if (response.status === 200) {
        const userData = response.data.data;
        setDbUser(userData);

        // Initialize or retrieve subscription limits
        const limits = getUserSubscriptionLimits(userData);
        setUserLimits(limits);
      }
    } catch (error) {
      console.log(error);
    }
  }, [user?.id, getToken]);

  // Update user subscription limits in the database
  const updateUserSubscriptionLimits = async (
    updatedLimits: UserSubscriptionLimits
  ) => {
    try {
      const token = await getToken();
      if (!userId || !token) return;

      await axios.patch(
        `https://mentoons-backend-zlx3.onrender.com/api/v1/user/user/${user?.id}`,
        {
          subscriptionLimits: updatedLimits,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserLimits(updatedLimits);
    } catch (error) {
      console.error("Error updating subscription limits:", error);
    }
  };

  // Check if user can access content and handle limitations
  const checkContentAccess = (comic: ProductBase): boolean => {
    if (!userLimits || !user) {
      setShowLoginModal(true);
      return false;
    }

    const accessResult = canAccessContent(comic, membershipType, userLimits);

    if (!accessResult.canAccess) {
      setLimitModalTitle(accessResult.title);
      setLimitModalMessage(accessResult.message);
      setShowSubscriptionLimitModal(true);
      return false;
    }

    // If accessible, update limits for premium content
    if (comic.product_type !== "Free") {
      const updatedLimits = updateUserContentAccess(comic, userLimits);
      updateUserSubscriptionLimits(updatedLimits);
    }

    return true;
  };

  useEffect(() => {
    fetchDBUser();
  }, [fetchDBUser, user?.id, getToken]);

  return (
    <div>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 h-1 origin-left bg-primary"
        style={{ scaleX }}
      />

      {/* Hero section */}
      <motion.div
        ref={heroRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-10 md:mt-16 md:flex md:items-start"
      >
        <div className="flex-1">
          <h1 className="py-2 text-2xl font-semibold text-center text-primary md:text-6xl md:py-8 md:pb-6">
            E-Comics & Audio Comics
          </h1>
          <p className="w-3/4 px-4 py-4 mx-auto text-lg font-medium text-center md:text-left md:text-2xl">
            Dive into colorful worlds and exciting stories that teach valuable
            lessons while entertaining young readers. Our diverse range of
            comics covers various subjects, from history and science to social
            skills and personal growth.
          </p>
        </div>
        <div className="flex-1">
          <h2 className="py-4 text-3xl text-center luckiest-guy-regular">
            CHOOSE COMICS BEST FOR YOU!
          </h2>
          <div className="flex items-center justify-center w-full p-4 lg:pr-24">
            <img
              src="/assets/comic-V2/comic-hero-v2.png"
              alt="comic page hero Image"
              className="w-full h-auto "
            />
          </div>
        </div>
      </motion.div>

      {/* Second Section Reading Comics and Audio comics */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className=""
      >
        <h2 className="py-6 text-4xl font-bold text-center">
          Re-Discover the <br /> Passion of Reading
        </h2>
        <div className="flex items-center justify-center gap-6 pb-6">
          <button
            className={`flex items-center justify-center gap-3 px-5 py-2  rounded-full bg-yellow-100 border border-yellow-400 hover:ring-4 hover:ring-yellow-300 transition-all duration-200 font-medium ${
              selectedOption === "comic" &&
              "ring-4 ring-yellow-400 shadow-xl shadow-yellow-100"
            }`}
            onClick={() => handleSelectedOption("comic")}
          >
            <span className="w-1 h-1 bg-black rounded-full" />
            E-Comics
          </button>
          <button
            className={`flex items-center justify-center gap-3 px-5 py-2  rounded-full bg-rose-200 border border-rose-500  hover:ring-4 hover:ring-rose-500 transition-all duration-200  font-medium ${
              selectedOption === "audio comic" &&
              "ring-4 ring-rose-500 shadow-xl shadow-rose-100"
            }`}
            onClick={() => handleSelectedOption("audio comic")}
          >
            <span className="w-1 h-1 bg-black rounded-full" />
            Audio Comic
          </button>
        </div>
        <p className="pb-8 text-xs text-center text-gray-500">
          pdf format - download, print and your comic is ready!
        </p>
      </motion.div>

      {/* //dynamic content section */}
      {selectedOption === "comic" && (
        <div className="flex items-center justify-center pb-6 w-[95%] md:w-[90%] mx-auto h-[700px] md:h-[800px] bg-yellow-100 mb-16 relative overflow-hidden">
          <div className="absolute w-[800px] h-[800px] md:w-[1000px] md:h-[1000px] rounded-full bg-primary -bottom-50 -left-[300px] md:-left-96"></div>
          <div className="absolute w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-full bg-primary -top-8 -right-8 md:-top-16 md:-right-16"></div>
          <div className="relative w-[95%] md:w-[90%] mx-auto flex flex-col items-center justify-between overflow-y-scroll overflow-x-hidden gap-10 md:gap-20 h-full py-10 md:py-20">
            {products.map((product, index) => {
              return (
                <div
                  className="flex flex-col items-start justify-between w-full gap-8 p-4 mt-4 duration-200 rounded-lg md:gap-20 md:mt-8 md:flex-row group trnasition-all "
                  key={product.title + index}
                >
                  <div className="relative flex-1 w-full">
                    <div className="absolute inset-0 border-4 border-yellow-300" />
                    <motion.img
                      src={product?.productImages?.[0].imageUrl}
                      alt={product?.title}
                      className="relative object-cover w-full h-auto"
                      initial={{
                        x: window.innerWidth < 768 ? -12 : -24,
                        y: window.innerWidth < 768 ? -12 : -24,
                      }}
                      whileHover={{
                        x: 0,
                        y: 0,
                        transition: { duration: 0.2 },
                      }}
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <div>
                      <h2
                        className="py-4 font-bold leading-none text-4xl sm:text-4xl md:text-5xl lg:text-6xl relative pr-2 after:content-[attr(data-badge)]
              after:hidden
              data-[badge]:after:inline-block
              after:py-[4px]
              after:px-[6px]
              after:leading-none
              after:text-white
              after:text-sm
              after:font-semibold
              after:rounded
              after:ml-2
              after:shadow-md
              after:absolute
              after:animate-[sparkle_2s_ease-in-out_infinite]
              [--badge-bg:theme(colors.yellow.300)]
              [--badge-text:theme(colors.yellow.800)]

              data-[badge=Free]:after:bg-gradient-to-r
              data-[badge=Free]:after:from-green-400
              data-[badge=Free]:after:to-green-500
              

              data-[badge=Prime]:after:bg-gradient-to-r
              data-[badge=Prime]:after:from-yellow-400
              data-[badge=Prime]:after:to-orange-500

              data-[badge=Platinum]:after:bg-gradient-to-r
              data-[badge=Platinum]:after:from-gray-400
              data-[badge=Platinum]:after:to-gray-500"
                        data-badge={product.product_type || undefined}
                      >
                        {product.title}
                      </h2>

                      <p className="pb-4 text-base md:text-xl tracking-wide text-neutral-700 w-full md:w-[80%] ">
                        {product.description}
                      </p>
                    </div>
                    <div>
                      <button
                        className="px-6 py-2 text-lg font-bold text-white transition-all rounded-full shadow-xl md:px-8 md:py-3 md:text-xl bg-primary hover:scale-110 dauration-200"
                        onClick={() => {
                          return openComicModal(
                            (product.details as ComicProduct["details"])
                              ?.sampleUrl || "",
                            product
                          );
                        }}
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Audio comics video */}
      {selectedOption === "audio comic" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="bg-[#FFBABA] relative min-h-[400px] md:h-[800px] w-[95%] md:w-[90%] mx-auto overflow-hidden p-4 md:p-12 mb-20"
        >
          {/* Background circles - made responsive */}
          <div className="absolute w-[300px] h-[300px] md:w-[1000px] md:h-[1000px] rounded-full bg-[#EF4444] -bottom-24 -left-[150px] md:-left-96"></div>
          <div className="absolute w-[100px] h-[100px] md:w-[200px] md:h-[200px] rounded-full bg-[#EF4444] -top-8 -right-8 md:-top-16 md:-right-16"></div>

          {/* Main content container */}
          <div className="relative h-[400px] md:h-[800px] rounded-xl overflow-hidden">
            <div className="h-full" ref={carouselRef}>
              {products.map((comic, index) => (
                <div
                  key={comic.title + index}
                  className={`absolute inset-0 w-full h-[350px] md:h-[680px] bg-white rounded-2xl group transition-opacity duration-300 shadow-xl border-2 md:border-4 border-rose-500 ${
                    currentIndex === index
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  {/* Video/Image container with responsive sizing */}
                  {(
                    comic.details as
                      | ComicProduct["details"]
                      | AudioComicProduct["details"]
                  )?.sampleUrl ? (
                    <video
                      className="object-contain w-full h-full p-2 md:py-6 rounded-2xl"
                      src={
                        (
                          comic.details as
                            | ComicProduct["details"]
                            | AudioComicProduct["details"]
                        )?.sampleUrl
                      }
                      poster={
                        comic.productImages?.[0].imageUrl ||
                        "/placeholder-image.jpg"
                      }
                      onEnded={(e) => {
                        e.currentTarget.load();
                        setIsPlaying(false);
                      }}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      playsInline
                      ref={(el) => {
                        videoRefs.current[index] = el;
                        if (el) {
                          const observer = new IntersectionObserver(
                            ([entry]) => {
                              if (!entry.isIntersecting) {
                                el.pause();
                                el.currentTime = 0;
                                setIsPlaying(false);
                              }
                            },
                            { threshold: 0.5 }
                          );
                          observer.observe(el);
                        }
                      }}
                    />
                  ) : (
                    <img
                      src={
                        comic.productImages?.[0].imageUrl ||
                        "/placeholder-image.jpg"
                      }
                      alt={comic.title}
                      className="object-cover w-full h-full rounded-2xl"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-image.jpg";
                        e.currentTarget.alt = "Placeholder image";
                      }}
                    />
                  )}

                  {/* Hover Overlay - responsive text sizes */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 transition-opacity duration-300 opacity-0 md:p-8 rounded-2xl bg-black/70 group-hover:opacity-100">
                    <h3 className="mb-2 text-xl font-bold text-center text-white md:mb-4 md:text-3xl">
                      {comic?.title || "Untitled Comic"}
                    </h3>
                    <p className="mb-4 text-sm text-center text-white md:mb-8 md:text-base line-clamp-3">
                      {comic?.description || "No description available"}
                    </p>

                    {(comic?.details as ComicProduct["details"])?.sampleUrl && (
                      <button
                        className="flex items-center justify-center w-12 h-12 transition-colors rounded-full md:w-16 md:h-16 bg-white/20 hover:bg-white/30"
                        onClick={(e) => {
                          e.stopPropagation();
                          const video = e.currentTarget.parentElement
                            ?.previousElementSibling as HTMLVideoElement;
                          if (video && comic.product_type === "Free") {
                            if (video.paused) {
                              video.play();
                              setIsPlaying(true);
                            } else {
                              video.pause();
                              setIsPlaying(false);
                            }
                          } else {
                            openComicModal(
                              (comic.details as ComicProduct["details"])
                                ?.sampleUrl || "",
                              comic
                            );
                          }
                        }}
                      >
                        {currentIndex === index && !isPlaying ? (
                          <svg
                            className="w-6 h-6 text-white md:w-8 md:h-8"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        ) : currentIndex === index && isPlaying ? (
                          <svg
                            className="w-6 h-6 text-white md:w-8 md:h-8"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-6 h-6 text-white md:w-8 md:h-8"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Playing indicator - made responsive */}
            {isPlaying && (
              <div className="absolute flex items-center gap-1 px-2 py-1 text-xs text-white rounded-full md:px-3 md:text-sm top-2 md:top-4 right-2 md:right-4 bg-black/50">
                <span className="w-1.5 md:w-2 h-1.5 md:h-2 bg-red-500 rounded-full animate-pulse"></span>
                Playing
              </div>
            )}
          </div>

          {/* Navigation buttons - made responsive */}
          <div className="absolute flex gap-1 pt-2 md:gap-2 md:pt-4 bottom-2 md:bottom-4 right-4 md:right-12">
            <button
              onClick={() => {
                pauseAllVideos();
                setCurrentIndex((prevIndex) =>
                  prevIndex === 0 ? products.length - 1 : prevIndex - 1
                );
              }}
              className="p-1 bg-white rounded-full shadow-lg md:p-2 hover:bg-gray-100"
            >
              <IoIosArrowBack className="text-xl md:text-2xl" />
            </button>
            <button
              onClick={() => {
                pauseAllVideos();
                setCurrentIndex(
                  (prevIndex) => (prevIndex + 1) % products.length
                );
              }}
              className="p-1 bg-white rounded-full shadow-lg md:p-2 hover:bg-gray-100"
            >
              <IoIosArrowForward className="text-xl md:text-2xl" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Trending comics  Carousel  */}
      <motion.div
        ref={trendingRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="w-[95%] md:w-[90%] mx-auto mb-20 relative"
      >
        <h2 className="pb-6 text-3xl font-semibold md:text-4xl">
          Trending Comics For You!
        </h2>
        <div
          className="flex gap-4 px-6 pb-20 overflow-x-auto md:gap-8 scroll-smooth"
          ref={carouselRef}
        >
          {products.map((comic: ProductBase, index) => (
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
                      comic.productImages?.[0].imageUrl ||
                      "/placeholder-image.jpg"
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
                        (comic.details as ComicProduct["details"])
                          ?.releaseDate || ""
                      )}
                    </span>
                    {/* Rating Badge */}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5">
                  <h3 className="mb-2 text-xl font-bold text-gray-900 line-clamp-1 ">
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
                  <div className="flex gap-2 ">
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
                        className="flex-1 px-4 py-2 font-medium text-white transition-colors rounded-lg bg-primary hover:bg-primary/90 "
                      >
                        {comic.type === "comic" ? "Read Now" : "Listen Now"}
                      </button>
                    )}

                    {!comic.product_type && (
                      <>
                        <button
                          onClick={(e) => handleAddtoCart(e, comic)}
                          disabled={isLoading}
                          className="flex items-center flex-1 gap-2 px-4 py-2 font-medium text-white transition-colors rounded-lg bg-primary hover:bg-primar whitespace-nowrap"
                        >
                          <FaShoppingCart className="self-center inline-block w-4 h-4 " />
                          {isLoading ? "Adding..." : "Add to Cart"}
                        </button>
                        <button
                          onClick={(e) => handleBuyNow(e, comic)}
                          disabled={isLoading}
                          className="flex items-center flex-1 gap-2 px-4 py-2 font-medium transition-colors border rounded-lg text-primary hover:bg-primary/10 whitespace-nowrap border-primary"
                        >
                          <FaBolt className="self-center inline-block w-4 h-4 " />
                          {isLoading ? "Buying..." : "Buy Now"}
                        </button>
                        {showAddToCartModal && (
                          <AddToCartModal
                            onClose={() => setShowAddToCartModal(false)}
                            isOpen={showAddToCartModal}
                            productName={comic.title}
                          />
                        )}
                        {
                          <LoginModal
                            isOpen={showLoginModal}
                            onClose={() => setShowLoginModal(false)}
                          />
                        }
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Navigation buttons */}
        <button
          onClick={() => {
            const carousel = carouselRef.current;
            if (carousel) {
              carousel.scrollBy({ left: -300, behavior: "smooth" });
            }
          }}
          className="absolute left-0 p-2 transition-colors -translate-y-1/2 rounded-full shadow-lg top-1/2 bg-white/80 hover:bg-white"
          style={{ display: isAtStart ? "none" : "block" }}
        >
          <IoIosArrowBack className="text-2xl" />
        </button>
        <button
          onClick={() => {
            const carousel = carouselRef.current;
            if (carousel) {
              carousel.scrollBy({ left: 300, behavior: "smooth" });
            }
          }}
          className="absolute right-0 p-2 transition-colors -translate-y-1/2 rounded-full shadow-lg top-1/2 bg-white/80 hover:bg-white"
          style={{ display: isAtEnd ? "none" : "block" }}
        >
          <IoIosArrowForward className="text-2xl" />
        </button>
      </motion.div>

      {/* Comic Viewer Modal */}
      {showComicModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-[95%] h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden items-center"
          >
            <button
              onClick={closeComicModal}
              className="absolute z-50 p-2 text-gray-600 transition-colors top-4 right-4 hover:text-gray-900"
            >
              <MdClose className="text-2xl" />
            </button>

            <ComicViewer
              pdfUrl={comicToView}
              productType={productType}
              productId={currentProductId}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Subscription Limit Modal */}
      <SubscriptionLimitModal
        isOpen={showSubscriptionLimitModal}
        onClose={() => setShowSubscriptionLimitModal(false)}
        message={limitModalMessage}
        title={limitModalTitle}
        planType={"free"} // Fall back to 'free' if membershipType causes type issues
      />

      {/* Feature of the Month Section */}
      <motion.div
        ref={featureRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="w-[95%] md:w-[90%] mx-auto mb-20 flex flex-col md:flex-row gap-8"
      >
        <div className="relative flex items-center justify-center flex-1 h-full">
          <div className="flex flex-col items-center justify-center py-16 text-6xl font-semibold text-center md:py-32 md:text-7xl lg:text-9xl text-nuetural-800 luckiest-guy-regular">
            <span>FEATURE</span>
            <span>OF THE</span>
            <span>MONTH</span>
          </div>
          <img
            src="/assets/comic-V2/star-1.png "
            alt="star-1"
            className="absolute top-0 left-0 w-16 md:w-24"
          />
          <img
            src="/assets/comic-V2/star-2.png"
            alt=""
            className="absolute bottom-0 right-0 w-16 md:w-24"
          />
        </div>
        <div className="flex-1 p-6 mt-12 ">
          <div className="items-start flex-1 gap-10 pb-4 sm:flex ">
            <div className="mb-4">
              <img
                src={
                  products?.[0]?.productImages?.[0].imageUrl ||
                  "/placeholder-image.jpg"
                }
                alt={products?.[0]?.title}
                className="w-96"
              />
            </div>
            <div>
              <h2 className="pb-1 text-4xl font-semibold">
                {products?.[0]?.title}
              </h2>
            </div>
          </div>
          <div className="pt-4">
            <div className="pb-2 font-semibold text-gray-500 text-md">
              {" "}
              {formatDateString(
                (products?.[0]?.details as ComicProduct["details"])
                  ?.releaseDate || ""
              )}
            </div>
            <p className="text-lg font-medium">{products[0]?.description}</p>
            <div className="flex items-center justify-between pt-10">
              <button
                className="py-4 font-semibold text-white rounded-full shadow-xl px-7 bg-primary"
                onClick={() =>
                  openComicModal(
                    (products[0].details as ComicProduct["details"])
                      ?.sampleUrl || "",
                    products[0]
                  )
                }
              >
                READ MORE
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* why we matter */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="px-6 py-10 md:py-12 md:flex md:items-center md:px-20 bg-gradient-to-r from-[#FFCF7B] to-[#FFFFFF]"
      >
        <div className="flex-1">
          {WORKSHOP_MATTERS_POINTS.map((point, index) => (
            <motion.div
              key={point.id}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start gap-4 p-4 md:items-center"
            >
              <figure className="">
                <img src={point.icon} alt="icon" className="w-24 md:w-24" />
              </figure>
              <div>
                <p className="text-2xl">
                  <span className="text-2xl font-bold">{point.lable}:</span>{" "}
                  {point.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="relative items-start justify-center flex-1">
          <h2 className="pt-8 text-6xl md:text-8xl md:pt-4 font-semibold text-center luckiest-guy-regular text-black [-webkit-text-stroke:_2px_black] pr-8">
            Why our workshops matter?
          </h2>
          {/* <figure className="flex items-center justify-end w-full p-4 pt-0">
            <img src="/assets/workshopv2/man-thinking.png" alt="" />
          </figure> */}
        </div>
      </motion.div>

      {/* Modals */}
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

      {showSubscriptionLimitModal && (
        <SubscriptionLimitModal
          isOpen={showSubscriptionLimitModal}
          onClose={() => setShowSubscriptionLimitModal(false)}
          message={limitModalMessage}
          title={limitModalTitle}
          planType={"free"} // Fall back to 'free' if membershipType causes type issues
        />
      )}
    </div>
  );
};

export default ComicsPageV2;
