import ComicViewer from "@/components/common/ComicViewer";
import { WORKSHOP_MATTERS_POINTS } from "@/constant";
// import { comicsData } from "@/constant/comicsConstants";
import { fetchProducts } from "@/redux/productSlice";
import { AppDispatch, RootState } from "@/redux/store";
import {
  AudioComicProduct,
  ComicProduct,
  ProductBase,
} from "@/types/productTypes";
import { formatDateString } from "@/utils/formateDate";

import { useAuth, useUser } from "@clerk/clerk-react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

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
  const option =
    new URLSearchParams(window.location.search).get("option") || "comic";
  const [selectedOption, setSelectedOption] = useState(option);

  const dispatch = useDispatch<AppDispatch>();

  const { getToken } = useAuth();
  const { user } = useUser();

  const membershipType = user?.publicMetadata?.membershipType || "free";

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

  const openComicModal = (comicLink: string) => {
    setComicToView(comicLink);
    setShowComicModal(true);
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  };

  const closeComicModal = () => {
    setShowComicModal(false);
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
        if (selectedOption ) {
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
  }, [dispatch, selectedOption, option, getToken]);

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
          <div className="flex items-center justify-center w-full p-4 pr-24">
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
        <div className="flex items-center justify-center gap-6 pb-6 w-[95%] md:w-[90%] mx-auto  h-[700px] bg-yellow-100 mb-16 relative overflow-hidden ">
          <div className="absolute  w-[1000px] h-[1000px] rounded-full bg-primary bottom-[10] -left-96 "></div>
          <div className="absolute  w-[200px] h-[200px] rounded-full bg-primary -top-16 -right-16 "></div>
          <div className="relative   w-[95%] md:w-[90%] mx-auto flex flex-col items-center justify-between  overflow-y-scroll  gap-20 h-[700px] py-20">
            {products.map((product, index) => {
              return (
                <div
                  className="flex flex-col items-start justify-between w-full gap-20 p-4 mt-8 rounded-lg md:flex-row"
                  key={product.title + index}
                >
                  <div className="flex-1 ">
                    <img
                      src={product?.productImages?.[0].imageUrl}
                      alt={product?.title}
                      className="object-cover w-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div>
                      <h2
                        className="py-4 font-bold leading-none text-8xl relative after:content-[attr(data-badge)] after:py-[4px] after:px-[6px] after:leading-none after:bg-[var(--badge-bg)] after:text-[var(--badge-text)] after:text-sm after:font-semibold after:rounded after:ml-2 after:shadow-md after:absolute after:animate-[sparkle_2s_ease-in-out_infinite] [--badge-bg:theme(colors.yellow.300)] [--badge-text:theme(colors.yellow.800)] data-[badge=Free]:[--badge-bg:theme(colors.green.300)] data-[badge=Free]:[--badge-text:theme(colors.green.800)]"
                        data-badge={product.price !== 0 ? "Premium" : "Free"}
                      >
                        {product.title}
                      </h2>

                      {/* <h2
                        className="py-4 font-bold leading-none text-8xl relative after:content-[attr(data-badge)] after:py-[4px] after:px-[6px] after:leading-none after:bg-[var(--badge-bg)] after:text-[var(--badge-text)] after:text-sm after:font-semibold after:rounded after:ml-2 after:shadow-md after:absolute [--badge-bg:theme(colors.yellow.300)] [--badge-text:theme(colors.yellow.800)] data-[badge=Free]:[--badge-bg:theme(colors.green.300)] data-[badge=Free]:[--badge-text:theme(colors.green.800)]"
                        data-badge={product.price !== 0 ? "Premium" : "Free"}
                      >
                        {product.title}
                      </h2> */}
                      <p className="pb-4 text-xl tracking-wide text-neutral-500">
                        {product.description}
                      </p>
                    </div>
                    <div>
                      <button
                        className="px-8 py-3 text-xl font-bold text-white rounded-full bg-primary "
                        onClick={() => {
                          return openComicModal(
                            (product.details as ComicProduct["details"])
                              ?.sampleUrl || ""
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
          className="bg-[#FFBABA] relative h-[800px] w-[90%] mx-auto overflow-hidden p-12 mb-20"
        >
          <div className="w-[600px] h-[800px] rounded-full bg-[#EF4444] absolute top-[40px] -left-40 z-9" />
          <div className="w-32 h-32 rounded-full bg-[#EF4444] absolute -top-10 -right-10 z-9" />

          <div className="relative h-[800px] rounded-xl overflow-hidden ">
            <div className="h-full" ref={carouselRef}>
              {products.map((comic, index) => (
                <div
                  key={comic.title + index}
                  className={`absolute inset-0 w-full h-[680px] bg-white rounded-2xl  group transition-opacity duration-300 ${
                    currentIndex === index
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  {(
                    comic.details as
                      | ComicProduct["details"]
                      | AudioComicProduct["details"]
                  )?.sampleUrl ? (
                    <video
                      className="object-cover w-full h-full py-6 rounded-2xl"
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

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 transition-opacity duration-300 opacity-0 rounded-2xl bg-black/70 group-hover:opacity-100">
                    <h3 className="mb-4 text-3xl font-bold text-center text-white">
                      {comic?.title || "Untitled Comic"}
                    </h3>
                    <p className="mb-8 text-center text-white line-clamp-3">
                      {comic?.description || "No description available"}
                    </p>

                    {(comic?.details as ComicProduct["details"])?.sampleUrl && (
                      <button
                        className="flex items-center justify-center w-16 h-16 transition-colors rounded-full bg-white/20 hover:bg-white/30"
                        onClick={(e) => {
                          e.stopPropagation();
                          const video = e.currentTarget.parentElement
                            ?.previousElementSibling as HTMLVideoElement;
                          if (video) {
                            if (video.paused) {
                              video.play();
                              setIsPlaying(true);
                            } else {
                              video.pause();
                              setIsPlaying(false);
                            }
                          }
                        }}
                      >
                        {currentIndex === index && !isPlaying ? (
                          <svg
                            className="w-8 h-8 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        ) : currentIndex === index && isPlaying ? (
                          <svg
                            className="w-8 h-8 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-8 h-8 text-white"
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

            {/* Playing indicator */}
            {isPlaying && (
              <div className="absolute flex items-center gap-1 px-3 py-1 text-sm text-white rounded-full top-4 right-4 bg-black/50">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Playing
              </div>
            )}
          </div>
          <div className="absolute flex gap-2 pt-4 bottom-4 right-12">
            <button
              onClick={() => {
                pauseAllVideos();
                setCurrentIndex((prevIndex) =>
                  prevIndex === 0 ? products.length - 1 : prevIndex - 1
                );
              }}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
            >
              <IoIosArrowBack className="text-2xl" />
            </button>
            <button
              onClick={() => {
                pauseAllVideos();
                setCurrentIndex(
                  (prevIndex) => (prevIndex + 1) % products.length
                );
              }}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
            >
              <IoIosArrowForward className="text-2xl" />
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
          className="flex gap-4 overflow-x-auto md:gap-8 scroll-smooth"
          ref={carouselRef}
        >
          {products.map((comic: ProductBase, index) => (
            <div
              className="flex-shrink-0 p-4 transition-all duration-300 border border-gray-300 rounded-lg cursor-pointer hover:shadow-lg"
              key={comic.title + index}
              onClick={() => {
                if ("sampleUrl" in comic.details) {
                  openComicModal(comic.details.sampleUrl || "");
                }
              }}
            >
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={comic.productImages?.[0].imageUrl}
                  alt={comic.title}
                  className="object-contain h-[25rem] rounded-lg transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t to-transparent from-black/70">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/80 text-gray-900 ring-1 ring-inset ring-gray-200/20 backdrop-blur-2xl">
                    {comic?.ageCategory}
                  </span>
                  <span>{comic?.type}</span>
                </div>
              </div>
              <div className="pt-4">
                <h3 className="text-xl font-medium line-clamp-1">
                  {comic?.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {comic?.description}
                </p>
              </div>
            </div>
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

            <ComicViewer pdfUrl={comicToView} />
          </motion.div>
        </motion.div>
      )}

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
        <div className="flex-1 p-6 mt-12">
          <div className="flex items-start gap-10 pb-4">
            <div>
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
              <h3 className="text-lg font-semibold">
                For {products?.[0]?.ageCategory}
              </h3>
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
                      ?.sampleUrl || ""
                  )
                }
              >
                READ MORE
              </button>
              <button className="p-2 border border-black rounded-full">
                <BsThreeDots className="text-4xl" />
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
          <h2 className="pt-8 text-7xl md:text-8xl md:pt-4 font-semibold text-center luckiest-guy-regular text-black [-webkit-text-stroke:_2px_black]">
            Why our workshops matter?
          </h2>
          {/* <figure className="flex items-center justify-end w-full p-4 pt-0">
            <img src="/assets/workshopv2/man-thinking.png" alt="" />
          </figure> */}
        </div>
      </motion.div>
    </div>
  );
};

export default ComicsPageV2;
