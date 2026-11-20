import ComicViewer from "@/components/common/ComicViewer";
import LoginModal from "@/components/common/modal/loginModal";
import AddToCartModal from "@/components/modals/AddToCartModal";
import NewsletterModal from "@/components/modals/NewsletterModal";
import axiosInstance from "@/api/axios";
import { WORKSHOP_MATTERS_POINTS } from "@/constant";
import { LandingColors } from "@/constant/adda/Landing/landingItems";
import { addItemCart } from "@/redux/cartSlice";
import { fetchProducts } from "@/redux/productSlice";
import { AppDispatch, RootState } from "@/redux/store";
import {
  AudioComicProduct,
  ComicProduct,
  ProductBase,
} from "@/types/productTypes";
import { formatDateString } from "@/utils/formateDate";
import { ModalMessage } from "@/utils/enum";
import {
  FaBookOpen,
  FaLightbulb,
  FaPenFancy,
  FaShoppingCart,
} from "react-icons/fa";
import { FaBolt } from "react-icons/fa6";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios, { AxiosError } from "axios";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { motion, useReducedMotion } from "framer-motion";
import ComicHero from "@/components/comics/hero";
// import ScrollTextSection from "@/components/comics/scrollText";

/*
  Comics page theme = SAME theme as the new landing page (NewLandingPage):
    - cream dotted page background           (.cm-page)
    - Bangers / Luckiest Guy fonts           (.cm-font / .cm-chip-font / .cm-text)
    - white outlined headings + color word   (.cm-title)
    - white cards with hard black shadow     (.cm-card)
    - yellow dotted panels                   (.cm-panel)
    - orange comic buttons                   (.cm-btn)
  Text sizes follow the landing page:
    section headings  text-4xl md:text-6xl
    card titles       text-3xl
    body text         text-lg / text-xl
*/
const comicCss = `
@import url('https://fonts.googleapis.com/css2?family=Bangers&family=Luckiest+Guy&display=swap');

@keyframes cm-wiggle {
  0%, 100% { transform: rotate(-2deg) scale(1.06); }
  25% { transform: rotate(3deg) scale(1.08); }
  50% { transform: rotate(-4deg) scale(1.08); }
  75% { transform: rotate(2deg) scale(1.06); }
}

.cm-page {
  background-color: #fff7e6;
  background-image: radial-gradient(rgba(249,115,22,0.18) 1.5px, transparent 2px);
  background-size: 16px 16px;
}
.cm-font {
  font-family: 'Bangers', 'Comic Sans MS', 'Chalkboard SE', cursive !important;
  font-weight: 400 !important;
  letter-spacing: 0.05em;
}
.cm-chip-font {
  font-family: 'Luckiest Guy', 'Bangers', 'Comic Sans MS', cursive !important;
  font-weight: 400 !important;
  letter-spacing: 0.04em;
}
.cm-text {
  font-family: 'Bangers', 'Comic Sans MS', 'Chalkboard SE', cursive !important;
  font-weight: 400 !important;
  letter-spacing: 0.04em;
  line-height: 1.3;
  color: #1f2937;
}
.cm-title, .cm-title * {
  font-family: 'Bangers', 'Comic Sans MS', 'Chalkboard SE', cursive !important;
  font-weight: 400 !important;
}
.cm-title {
  line-height: 1;
  letter-spacing: 0.05em;
  color: #fff;
  -webkit-text-stroke: 3px #000;
  paint-order: stroke fill;
  text-shadow: 4px 4px 0 #000;
}
.cm-title-sm {
  -webkit-text-stroke: 2px #000;
  text-shadow: 3px 3px 0 #000;
}
.cm-narration {
  background: #fff;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  border-radius: 12px;
  padding: 10px 16px;
}
.cm-card {
  background: #fff;
  border: 3px solid #000;
  box-shadow: 5px 5px 0 #000;
  border-radius: 16px;
}
.cm-lift {
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}
.cm-lift:hover {
  transform: translate(-2px, -2px);
  box-shadow: 7px 7px 0 #000;
  background: #fef9c3;
}
.cm-panel {
  background-color: #fde68a;
  background-image: radial-gradient(rgba(0,0,0,0.12) 1.6px, transparent 2px);
  background-size: 14px 14px;
  border: 4px solid #000;
  box-shadow: 8px 8px 0 #000;
  border-radius: 20px;
}
.cm-icon {
  border: 3px solid #000;
  box-shadow: 2px 2px 0 #000;
  border-radius: 12px;
}
.cm-btn {
  background: var(--btn, #f97316);
  color: #fff;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  border-radius: 12px;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  transform: rotate(-2deg);
  transition: box-shadow 0.1s ease, filter 0.1s ease;
  cursor: pointer;
}
.cm-btn:hover:not(:disabled) { filter: brightness(1.08); animation: cm-wiggle 0.4s ease-in-out; }
.cm-btn:active:not(:disabled) { box-shadow: 0 0 0 #000; transform: rotate(-2deg) translate(3px, 3px); }
.cm-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.cm-btn:focus-visible { outline: 3px solid #000; outline-offset: 3px; }

.cm-chip {
  background: var(--c, #fde047);
  color: #000;
  border: 3px solid #000;
  box-shadow: 3px 3px 0 #000;
  border-radius: 8px;
  padding: 2px 10px;
  text-transform: uppercase;
  transform: rotate(var(--rot, 0deg)) skewX(-6deg);
}
.cm-input {
  font-family: 'Bangers', 'Comic Sans MS', cursive !important;
  letter-spacing: 0.05em;
  font-size: 1.05rem;
  background: #fff;
  border: 3px solid #000 !important;
  box-shadow: 3px 3px 0 #000;
  border-radius: 10px;
  outline: none;
  transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
}
.cm-input:focus {
  background: #fef9c3;
  transform: translate(-1px, -1px);
  box-shadow: 5px 5px 0 #000;
}
.cm-arrow {
  background: #fde047;
  border: 3px solid #000;
  box-shadow: 2px 2px 0 #000;
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease;
}
.cm-arrow:hover { background: #facc15; }
.cm-arrow:active { transform: translate(2px, 2px); box-shadow: 0 0 0 #000; }

/* swipe carousel */
.cm-snap { scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
.cm-snap > * { scroll-snap-align: center; }
.cm-hide-scroll { scrollbar-width: none; }
.cm-hide-scroll::-webkit-scrollbar { display: none; }

@media (prefers-reduced-motion: reduce) {
  .cm-btn, .cm-lift { transition: none; }
  .cm-btn:hover:not(:disabled) { animation: none; }
}
`;

interface DBUser {
  _id: string;
  subscription: {
    plan: string;
    startDate?: string;
  };
}

interface ApiResponse {
  success: boolean;
  data?: unknown;
  message?: string;
}

interface NewsletterFormValues {
  email: string;
}

const newsletterSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

// Stable "views" number per comic (the old Math.random() would change on every re-render,
// and this page re-renders every second for the color-changing headings).
const viewsFor = (id: string) =>
  [...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 20;

/* ---------- Age group filter ---------- */
type AgeFilter = "all" | "6-12" | "13-19";

const AGE_FILTERS: { key: AgeFilter; label: string }[] = [
  { key: "all", label: "All Ages" },
  { key: "6-12", label: "Ages 6-12" },
  { key: "13-19", label: "Ages 13-19" },
];

// "13-16" -> first number 13 -> belongs to the 13-19 group
// "20+"   -> first number 20 -> not in 6-12 or 13-19 (only shows under "All")
const matchesAgeFilter = (
  ageCategory: string | undefined,
  filter: AgeFilter,
) => {
  if (filter === "all") return true;
  const nums = (ageCategory || "").match(/\d+/g)?.map(Number);
  if (!nums || nums.length === 0) return true; // e.g. "All ages" -> show everywhere
  const min = nums[0];
  return filter === "6-12" ? min <= 12 : min >= 13 && min <= 19;
};

/* ---------- Benefits of reading comics ---------- */
const COMIC_BENEFITS = [
  {
    id: "vocabulary-imagination",
    title: "Vocabulary & Imagination",
    description:
      "Pictures and short dialogue help kids pick up new words in context, while the gaps between panels let their imagination fill in the story.",
    Icon: FaBookOpen,
    color: "#fde047",
  },
  {
    id: "writing-skills",
    title: "Writing Skills",
    description:
      "Following a story panel by panel teaches sequencing, dialogue and storytelling, which helps children structure their own stories and write with confidence.",
    Icon: FaPenFancy,
    color: "#fdba74",
  },
  {
    id: "situation-handling",
    title: "Situation Handling",
    description:
      "Characters face real situations like peer pressure, screen time and online safety. Kids see how choices play out and learn calm ways to handle similar moments.",
    Icon: FaLightbulb,
    color: "#93c5fd",
  },
];

const ComicsPageV2 = () => {
  const { items: products } = useSelector((state: RootState) => state.products);

  const [ageFilter, setAgeFilter] = useState<AgeFilter>("all");
  const reduceMotion = useReducedMotion();

  const filteredProducts = useMemo(
    () =>
      products.filter((c: ProductBase) =>
        matchesAgeFilter(c.ageCategory, ageFilter),
      ),
    [products, ageFilter],
  );

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

  // Keep the latest getToken in a ref so effects don't re-run (and re-call the
  // APIs) whenever Clerk returns a new function identity on re-render.
  const getTokenRef = useRef(getToken);
  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [currentProductId, setCurrentProductId] = useState<string>("");
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  // scroll progress bar is updated through a ref (no re-render on every scroll)
  const progressRef = useRef<HTMLDivElement>(null);
  // same color-changing highlight word as the landing page
  const [colorIndex, setColorIndex] = useState(0);

  const [searchParams] = useSearchParams();
  const selectedOption = searchParams.get("option") || "comic";

  const membershipType = dbUser?.subscription.plan.toLowerCase() || "free";

  const trendingRef = useRef(null);

  // go back to the first card when the filter changes
  useEffect(() => {
    trendingCarouselRef.current?.scrollTo({ left: 0 });
    setIsAtStart(true);
  }, [ageFilter]);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % LandingColors.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScrollProgress = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
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

  // Opens the viewer only for logged-in users (no subscription / limit check)
  const openComicModal = (
    comicLink: string,
    comic?: ProductBase | null,
    productType?: string,
  ) => {
    if (!user) {
      setTimeout(() => setShowLoginModal(true), 100);
      return;
    }
    setComicToView(comicLink);
    setCurrentProductId(comic?._id || "");
    setShowComicModal(true);
    if (productType || comic?.product_type) {
      setProductType(productType || comic?.product_type || "");
    }
    document.body.style.overflow = "hidden";
  };

  const closeComicModal = () => {
    setShowComicModal(false);
    setProductType("");
    setCurrentProductId("");
    document.body.style.overflow = "auto";
  };

  const fetchDBUser = useCallback(async () => {
    if (!user?.id) return;
    try {
      const token = await getTokenRef.current();
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/user/user/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.status === 200) {
        setDbUser(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    }
  }, [user?.id]);

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

  // Wellness subscription (moved here from the Footer)
  const handleNewsletterSubmit = async (
    values: NewsletterFormValues,
    { setSubmitting, resetForm }: FormikHelpers<NewsletterFormValues>,
  ) => {
    try {
      const response = await axiosInstance.post<ApiResponse>(
        "email/subscribeToNewsletter",
        { email: values.email },
      );

      const res: ApiResponse = response.data;
      if (res.success) {
        setShowNewsletterModal(true);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      toast(` ${error.response?.data?.error ?? "Something went wrong"}`);
    } finally {
      resetForm();
      setSubmitting(false);
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
        const token = await getTokenRef.current();
        await dispatch(fetchProducts({ type: selectedOption, token: token! }));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsFetchingProducts(false);
      }
    };
    fetchComics();
  }, [dispatch, selectedOption]);

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

  const highlight = LandingColors[colorIndex];

  return (
    <div className="cm-page">
      <style>{comicCss}</style>

      {/* Scroll progress bar */}
      <div
        ref={progressRef}
        className="fixed left-0 right-0 top-0 z-50 h-2 origin-left scale-x-0 border-b-2 border-black bg-[#f97316]"
      />

      <ComicHero />

      {/* Trending comics */}
      <div
        id="comics"
        ref={trendingRef}
        className="relative mx-auto mb-14 mt-12 w-[95%] text-black md:w-[90%] lg:mb-20"
      >
        <h2 className="cm-title mb-6 text-4xl md:text-6xl">
          Trending <span style={{ color: highlight }}>Comics</span> For You!
        </h2>

        {/* Age group filter */}
        <div className="mb-8 flex flex-wrap items-center gap-3 md:gap-4">
          {AGE_FILTERS.map((f) => {
            const active = ageFilter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setAgeFilter(f.key)}
                aria-pressed={active}
                className="cm-btn cm-font px-6 py-2 text-xl uppercase md:text-2xl"
                style={
                  {
                    ["--btn" as string]: active ? "#f97316" : "#3b82f6",
                    ...(active
                      ? { transform: "rotate(-2deg) scale(1.1)" }
                      : {}),
                  } as CSSProperties
                }
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {isFetchingProducts ? (
          <div className="flex h-[320px] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-[5px] border-black border-t-[#f97316]" />
          </div>
        ) : (
          <div
            className="cm-snap cm-hide-scroll flex scroll-smooth gap-5 overflow-x-auto px-2 pb-10 pr-6 pt-3 md:gap-8"
            ref={trendingCarouselRef}
          >
            {filteredProducts.length === 0 && (
              <motion.p
                key={`empty-${ageFilter}`}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="cm-narration cm-text text-xl"
              >
                No comics in this age group yet. Try another one!
              </motion.p>
            )}
            {filteredProducts.map((comic: ProductBase, index: number) => (
              <motion.div
                // the age filter is part of the key, so cards re-mount and
                // play the pop-in animation every time the age group changes
                key={`${ageFilter}-${comic._id}`}
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, y: 40, scale: 0.85, rotate: -4 }
                }
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: Math.min(index, 8) * 0.07,
                }}
                className="group relative h-full w-[78vw] max-w-[320px] flex-shrink-0 sm:w-[320px]"
              >
                <div className="cm-card cm-lift relative h-full overflow-hidden">
                  <div className="relative h-48 overflow-hidden border-b-[3px] border-black">
                    <img
                      src={
                        comic.productImages?.[0].imageUrl ||
                        "/placeholder-image.jpg"
                      }
                      alt={comic.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      <span
                        className="cm-chip cm-chip-font text-xs md:text-sm"
                        style={
                          {
                            ["--c" as string]: "#ffffff",
                            ["--rot" as string]: "-3deg",
                          } as CSSProperties
                        }
                      >
                        {formatDateString(
                          (comic.details as ComicProduct["details"])
                            ?.releaseDate || "",
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="cm-font mb-2 line-clamp-1 text-3xl text-gray-900">
                      {comic?.title}
                    </h3>
                    <p className="cm-text mb-4 line-clamp-2 text-lg">
                      {comic?.description}
                    </p>
                    <div className="cm-text mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-base">
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
                        <span>{viewsFor(comic._id)} views</span>
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
                          className="cm-btn cm-font flex-1 px-4 py-2 text-xl uppercase"
                          style={
                            { ["--btn" as string]: "#ef4444" } as CSSProperties
                          }
                        >
                          {comic.type === "comic" ? "Read Now" : "Listen Now"}
                        </button>
                      )}
                      {!comic.product_type && (
                        <div className="flex w-full flex-col gap-3">
                          <button
                            onClick={(e) => handleAddtoCart(e, comic)}
                            disabled={isLoading}
                            className="cm-btn cm-font flex w-full items-center justify-center gap-2 whitespace-nowrap px-4 py-2 text-xl uppercase"
                            style={
                              {
                                ["--btn" as string]: "#f97316",
                              } as CSSProperties
                            }
                          >
                            <FaShoppingCart className="inline-block h-4 w-4 self-center" />
                            {isLoading ? "Adding..." : "Add to Cart"}
                          </button>
                          <button
                            onClick={(e) => handleBuyNow(e, comic)}
                            disabled={isLoading}
                            className="cm-btn cm-font flex w-full items-center justify-center gap-2 whitespace-nowrap px-4 py-2 text-xl uppercase"
                            style={
                              {
                                ["--btn" as string]: "#3b82f6",
                              } as CSSProperties
                            }
                          >
                            <FaBolt className="inline-block h-4 w-4 self-center" />
                            {isLoading ? "Buying..." : "Buy Now"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
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
          className={`cm-arrow absolute left-0 top-1/2 -translate-y-1/2 rounded-full p-2 ${
            isAtStart ? "hidden" : "hidden lg:block"
          }`}
        >
          <IoIosArrowBack className="text-2xl text-black" />
        </button>
        <button
          onClick={() => {
            const carousel = trendingCarouselRef.current;
            if (carousel) {
              carousel.scrollBy({ left: 300, behavior: "smooth" });
            }
          }}
          aria-label="Scroll right"
          className={`cm-arrow absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-2 ${
            isAtEnd ? "hidden" : "hidden lg:block"
          }`}
        >
          <IoIosArrowForward className="text-2xl text-black" />
        </button>
      </div>

      {/* <ScrollTextSection /> */}

      {/* Benefits of reading comics */}
      <section className="mx-auto mb-14 w-[95%] text-black md:w-[90%] lg:mb-20">
        <h2 className="cm-title mb-8 text-4xl md:text-6xl">
          Benefits of Reading <span style={{ color: highlight }}>Comics</span>
        </h2>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {COMIC_BENEFITS.map(({ id, title, description, Icon, color }) => (
            <div key={id} className="cm-card cm-lift flex flex-col gap-4 p-5">
              <figure
                className="cm-icon flex h-16 w-16 shrink-0 items-center justify-center"
                style={{ backgroundColor: color }}
              >
                <Icon className="text-3xl text-black" aria-hidden="true" />
              </figure>
              <h3 className="cm-font text-3xl text-gray-900">{title}</h3>
              <p className="cm-text text-lg md:text-xl">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Wellness Subscription (moved from the Footer) */}
      <section className="mx-auto mb-14 w-[95%] text-black md:w-[90%] lg:mb-20">
        <div className="cm-panel px-5 py-10 md:px-10 lg:px-14 lg:py-14">
          <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-5 text-center lg:text-left">
              <h2 className="cm-title text-4xl md:text-6xl">
                Wellness <span style={{ color: highlight }}>Subscription</span>
              </h2>
              <p className="cm-narration cm-text text-xl md:text-2xl">
                Get free comics, self help books, relationships, menstrual cycle
                and friendship guides straight to your inbox.
              </p>
            </div>

            <Formik
              initialValues={{ email: "" }}
              validationSchema={newsletterSchema}
              onSubmit={handleNewsletterSubmit}
            >
              {({ isSubmitting, isValid, dirty }) => (
                <Form className="cm-card flex w-full flex-col gap-4 p-5 md:p-6">
                  <div>
                    <Field
                      name="email"
                      type="email"
                      aria-label="Email address"
                      placeholder="Enter your email"
                      className="cm-input w-full p-3"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="cm-text mt-2 text-base text-red-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid || !dirty}
                    className="cm-btn cm-font w-full py-3 text-3xl uppercase"
                    style={{ ["--btn" as string]: "#ef4444" } as CSSProperties}
                  >
                    {isSubmitting ? "Subscribing..." : "Get Notified"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </section>

      {/* Comic modal */}
      {showComicModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75">
          <div className="cm-card relative h-[90vh] w-[95%] items-center overflow-hidden bg-white text-black">
            <button
              onClick={closeComicModal}
              aria-label="Close"
              className="cm-btn absolute right-3 top-3 z-10 rounded-full p-1.5"
              style={{ ["--btn" as string]: "#ef4444" } as CSSProperties}
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

      {/* Why our comics matter */}
      <div className="flex flex-col-reverse px-4 pb-14 pt-4 text-black md:px-12 lg:flex-row lg:items-center lg:gap-10 lg:px-20 lg:pb-20">
        <div className="flex-1 space-y-5 pt-8 lg:pt-0">
          {WORKSHOP_MATTERS_POINTS.map((point) => (
            <div
              key={point.id}
              className="cm-card cm-lift flex items-start gap-4 p-4 md:items-center"
            >
              <figure className="cm-icon shrink-0 bg-yellow-200 p-2">
                <img src={point.icon} alt="icon" className="w-14 md:w-16" />
              </figure>
              <div>
                <p className="cm-text text-lg md:text-xl">
                  <span className="cm-font text-2xl text-gray-900 md:text-3xl">
                    {point.lable}:
                  </span>{" "}
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="relative flex-1">
          <div className="cm-panel mx-auto max-w-xl px-4 py-8 text-center lg:-rotate-2 lg:px-8 lg:py-12">
            <h2 className="cm-title text-5xl md:text-7xl lg:text-8xl">
              Why our <span style={{ color: highlight }}>Comics</span> matter?
            </h2>
          </div>
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
      {showNewsletterModal && (
        <NewsletterModal
          isOpen={showNewsletterModal}
          onClose={() => setShowNewsletterModal(false)}
          message={ModalMessage.NEWSLETTER_MESSAGE}
        />
      )}
    </div>
  );
};

export default ComicsPageV2;
