import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  ShoppingCart,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { MdCloudDownload } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";
import axiosInstance from "@/api/axios";
import ProductDetailCards from "@/components/products/cards";
import { useProductActions } from "@/hooks/useProductAction";
import AddToCartModal from "@/components/modals/AddToCartModal";
import LoginModal from "@/components/common/modal/loginModal";
import SubscriptionLimitModal from "@/components/modals/SubscriptionLimitModal";
import ComicViewer from "@/components/common/ComicViewer";
import { MdClose } from "react-icons/md";
import {
  canAccessContent,
  getUserSubscriptionLimits,
  updateUserContentAccess,
  UserSubscriptionLimits,
} from "@/utils/subscriptionAccess";
import { ProductBase, AgeCategory } from "@/types/productTypes";
import PodcastCard from "@/components/podcast/card";
import ComicCard from "@/components/comics/comicCard";
import { Friend } from "@/components/adda/searchFriend/searchFriend";
import { errorToast } from "@/utils/toastResposnse";
import FriendCard from "@/components/adda/searchFriend/friendCard";
import SearchHeader from "@/components/adda/searchFriend/searchHeader";
import FreeDownloadForm from "@/components/comics/FreeDownloadForm";
import { v4 as uuidv4 } from "uuid";
import { gamesData } from "@/constant/comicsConstants";
import { highlightText } from "@/utils/highlightText";
import { useAuthModal } from "@/context/adda/authModalContext";
import { toast } from "sonner";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  picture?: string;
  clerkId?: string;
  followStatus:
    | "self"
    | "friend"
    | "following"
    | "follow back"
    | "pending"
    | "connect"
    | "guest";
}

interface GamesData {
  name: string;
  desc: string;
  image: string;
  thumbnail_url: string;
  pdf_url: string;
  cardStyling?: string;
  imgStyling?: string;
}

interface SearchResults {
  audioComics: ProductBase[];
  podcasts: ProductBase[];
  comics: ProductBase[];
  mentoonsCards: ProductBase[];
  mentoonsBooks: ProductBase[];
  users: User[];
  freeGames: GamesData[];
}

/* ---------- Comic style tokens (fonts come from index.css) ---------- */
// .font-comic       -> Bangers      (headings, captions)
// .font-comic-chip  -> Luckiest Guy (chips, buttons, tags)
// .font-number      -> Cabin        (counts / numbers)
const PANEL = "border-4 border-black shadow-[6px_6px_0_0_#000]";
const PANEL_SM = "border-[3px] border-black shadow-[4px_4px_0_0_#000]";
const POP =
  "transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none";

const sectionTheme = {
  blue: {
    caption: "bg-blue-400",
    link: "bg-blue-300 hover:bg-blue-200",
    icon: "text-black",
  },
  red: {
    caption: "bg-red-400",
    link: "bg-red-300 hover:bg-red-200",
    icon: "text-black",
  },
  green: {
    caption: "bg-green-400",
    link: "bg-green-300 hover:bg-green-200",
    icon: "text-black",
  },
  purple: {
    caption: "bg-purple-400",
    link: "bg-purple-300 hover:bg-purple-200",
    icon: "text-black",
  },
} as const;

const viewAllClass = (theme: keyof typeof sectionTheme) =>
  `font-comic-chip tracking-wider text-black flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg text-sm md:text-lg ${PANEL_SM} ${POP} ${sectionTheme[theme].link}`;

const captionClass = (theme: keyof typeof sectionTheme) =>
  `font-comic tracking-wider text-3xl md:text-5xl text-black inline-flex items-center px-4 py-1 -rotate-1 ${PANEL} ${sectionTheme[theme].caption}`;

const SearchResultsPage = () => {
  const [activeFilter, setActiveFilter] = useState<
    | "all"
    | "users"
    | "comics"
    | "audioComics"
    | "podcasts"
    | "mentoonsCards"
    | "mentoonsBooks"
    | "freeGames"
  >("all");
  const [searchResults, setSearchResults] = useState<SearchResults>({
    audioComics: [],
    podcasts: [],
    comics: [],
    mentoonsCards: [],
    mentoonsBooks: [],
    users: [],
    freeGames: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showComicModal, setShowComicModal] = useState(false);
  const [comicToView, setComicToView] = useState<string>("");
  const [productType, setProductType] = useState<string>("");
  const [currentProductId, setCurrentProductId] = useState<string>("");
  const [showSubscriptionLimitModal, setShowSubscriptionLimitModal] =
    useState(false);
  const [limitModalMessage, setLimitModalMessage] = useState("");
  const [limitModalTitle, setLimitModalTitle] = useState("");
  const [cartProductTitle, setCartProductTitle] = useState("");
  const [playingPodcastId, setPlayingPodcastId] = useState<string | null>(null);
  const [playbackTracking, setPlaybackTracking] = useState<any>(null);
  const [dbUser, setDbUser] = useState<any>(null);
  const [userLimits, setUserLimits] = useState<UserSubscriptionLimits | null>(
    null,
  );
  const [modalShownTimestamp, setModalShownTimestamp] = useState<number>(0);
  const { isSignedIn } = useUser();
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [showFreeDownloadForm, setShowFreeDownloadForm] =
    useState<boolean>(false);
  const [selectedComic, setSelectedComic] = useState<{
    thumbnail_url: string;
    pdf_url: string;
  }>({ thumbnail_url: "", pdf_url: "" });
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("q") ?? "";
  const { getToken, userId } = useAuth();
  const { openAuthModal } = useAuthModal();
  const { handleAddToCart, handleBuyNow, isLoading } = useProductActions({
    setShowLoginModal,
    setShowAddToCartModal,
    setCartProductTitle,
  });
  const carouselRef = useRef<HTMLDivElement>(null);

  const defaultAgeCategory: AgeCategory = AgeCategory.CHILD;

  const mapAgeCategory = (apiAgeCategory: string | undefined): AgeCategory => {
    const validCategories: Record<string, AgeCategory> = {
      "6-12": AgeCategory.CHILD,
      "13-16": AgeCategory.TEEN,
      "17-19": AgeCategory.YOUNG_ADULT,
      "20+": AgeCategory.ADULT,
      parents: AgeCategory.PARENTS,
      "13-19": AgeCategory.TEEN,
    };
    return validCategories[apiAgeCategory || ""] || defaultAgeCategory;
  };

  const mapUserToFriend = (user: User): Friend => ({
    _id: user._id,
    name: user.name,
    picture: user.picture || "/default-avatar.png",
    status:
      user.clerkId === userId
        ? "self"
        : user.followStatus === "friend"
          ? "friends"
          : user.followStatus === "following"
            ? "pendingSent"
            : user.followStatus === "follow back"
              ? "followBack"
              : user.followStatus === "pending"
                ? "pendingReceived"
                : user.followStatus === "connect"
                  ? "connect"
                  : "guest",
  });

  const onSendRequest = useCallback(
    async (friendId: string) => {
      setIsConnecting(true);
      try {
        const token = await getToken();
        if (!token) {
          openAuthModal("sign-in");
          return;
        }
        const response = await axiosInstance.post(
          `/user/friend-request`,
          { friendId },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (response.data.success) {
          setSearchResults((prev) => ({
            ...prev,
            users: prev.users.map((user) =>
              user._id === friendId
                ? { ...user, followStatus: "pending" }
                : user,
            ),
          }));
        } else {
          errorToast("Failed to send friend request");
        }
      } catch (error) {
        errorToast("Failed to send friend request");
      } finally {
        setIsConnecting(false);
      }
    },
    [getToken],
  );

  const onCancelRequest = useCallback(
    async (friendId: string) => {
      setIsConnecting(true);
      try {
        const token = await getToken();
        const response = await axiosInstance.delete(
          `/user/friend-request/${friendId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (response.data.success) {
          setSearchResults((prev) => ({
            ...prev,
            users: prev.users.map((user) =>
              user._id === friendId
                ? { ...user, followStatus: "connect" }
                : user,
            ),
          }));
        } else {
          errorToast("Failed to cancel friend request");
        }
      } catch (error) {
        errorToast("Failed to cancel friend request");
      } finally {
        setIsConnecting(false);
      }
    },
    [getToken],
  );

  const fetchDBUser = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_PROD_URL}/user/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        const userData = response.data.data;
        setDbUser(userData);
        const limits = getUserSubscriptionLimits(userData);
        setUserLimits(limits);
      }
    } catch (error) {
      console.log(error);
    }
  }, [userId, getToken]);

  const updateUserSubscriptionLimits = async (
    updatedLimits: UserSubscriptionLimits,
  ) => {
    try {
      const token = await getToken();
      if (!userId || !token) return;

      await axiosInstance.patch(
        `${import.meta.env.VITE_PROD_URL}/user/user/${userId}`,
        {
          subscriptionLimits: updatedLimits,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUserLimits(updatedLimits);
    } catch (error) {
      console.error("Error updating subscription limits:", error);
    }
  };

  const checkContentAccess = (comic: ProductBase): boolean => {
    if (!userLimits || !userId) {
      setShowLoginModal(true);
      return false;
    }

    const membershipType = dbUser?.subscription.plan || "free";
    const accessResult = canAccessContent(comic, membershipType, userLimits);

    if (!accessResult.canAccess) {
      setLimitModalTitle(accessResult.title);
      setLimitModalMessage(accessResult.message);
      setShowSubscriptionLimitModal(true);
      return false;
    }

    if (comic.product_type !== "Free") {
      const updatedLimits = updateUserContentAccess(comic, userLimits);
      updateUserSubscriptionLimits(updatedLimits);
    }

    return true;
  };

  const openComicModal = (
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

    if (checkContentAccess(comic)) {
      setComicToView(comicLink);
      setCurrentProductId(comic._id || "");
      setShowComicModal(true);
      if (productType) setProductType(productType);
      document.body.style.overflow = "hidden";
    }
  };

  const closeComicModal = () => {
    setShowComicModal(false);
    setProductType("");
    setCurrentProductId("");
    document.body.style.overflow = "auto";
  };

  const fetchResult = useCallback(async () => {
    if (!searchQuery) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await axiosInstance.get(
        `/products/search?search=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const transformProduct = (item: any): ProductBase => ({
        ...item,
        ageCategory: mapAgeCategory(item.ageCategory),
        productImages: item.productImages ?? [],
        price: item.price ?? 0,
        type: item.type ?? "PODCAST",
        product_type: item.product_type ?? "free",
        details: item.details ?? {
          category: "",
          host: "",
          duration: 0,
          sampleUrl: "",
        },
      });
      const transformContentItem = (item: any): ProductBase => ({
        ...item,
        ageCategory: mapAgeCategory(item.ageCategory),
        productImages: item.productImages ?? [],
      });

      const cleanedQuery = searchQuery.toLowerCase().trim();

      const freeGames =
        cleanedQuery.includes("free") || cleanedQuery.includes("games")
          ? gamesData
          : gamesData.filter((data) =>
              cleanedQuery.includes(data.name.toLowerCase()),
            );

      const transformedResults = {
        audioComics: response.data.audioComics.map(transformContentItem),
        podcasts: response.data.podcasts.map(transformProduct),
        comics: response.data.comics.map(transformContentItem),
        mentoonsCards: response.data.mentoonsCards.map(transformProduct),
        mentoonsBooks: response.data.mentoonsBooks.map(transformProduct),
        users: response.data.users,
        freeGames,
      };
      setActiveFilter("all");
      setSearchResults(transformedResults);
    } catch (err) {
      setError("Failed to fetch search results. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, getToken]);

  useEffect(() => {
    if (searchQuery) {
      fetchResult();
    }
  }, [searchQuery, fetchResult]);

  useEffect(() => {
    fetchDBUser();
  }, [fetchDBUser]);

  const onPlayToggle = useCallback((podcastId: string) => {
    setPlayingPodcastId((prev) => (prev === podcastId ? null : podcastId));
  }, []);

  const checkAccessAndControlPlayback = useCallback(
    async (podcast: ProductBase, audioElement?: HTMLAudioElement | null) => {
      const podcastId = String(podcast._id);
      const podcastType = String(podcast.product_type || "free").toLowerCase();

      if (!isSignedIn) {
        setTimeout(() => {
          if (audioElement && !audioElement.paused) {
            audioElement.pause();
            const timeNow = Date.now();
            if (timeNow - modalShownTimestamp > 5000) {
              setLimitModalTitle("Sign In Required");
              setLimitModalMessage("Please sign in to access this podcast.");
              setShowSubscriptionLimitModal(true);
              setModalShownTimestamp(timeNow);
            }
          }
        }, 45000);
        return false;
      }

      if (!dbUser) {
        toast.info("Loading user data...");
        fetchDBUser();
        return false;
      }

      try {
        const token = await getToken();
        const response = await axios.post(
          `${import.meta.env.VITE_PROD_URL}/subscription/access`,
          { type: "podcasts", itemId: podcast._id },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const { access, reason } = response.data;
        if (access) {
          setPlaybackTracking({
            startTime: Date.now(),
            paused: false,
            skipped: false,
            podcastId,
            podcastType,
          });
          return true;
        }

        const timeNow = Date.now();
        if (timeNow - modalShownTimestamp <= 5000) {
          return false;
        }

        if (reason === "upgrade") {
          setLimitModalTitle("Upgrade Your Plan");
          setLimitModalMessage(
            `You've reached the podcast limit. Upgrade to access more content!`,
          );
        } else if (reason === "charge") {
          setLimitModalTitle("Purchase Content");
          setLimitModalMessage(
            `You've reached the podcast limit for your Platinum plan. Purchase this content for ₹1 to continue.`,
          );
        }
        setCurrentProductId(podcast._id || "");
        setShowSubscriptionLimitModal(true);
        setModalShownTimestamp(timeNow);

        if (audioElement && !audioElement.paused) {
          audioElement.pause();
          setPlayingPodcastId(null);
        }
        return false;
      } catch (error) {
        toast.error("Failed to verify access. Please try again.");
        return false;
      }
    },
    [isSignedIn, dbUser, getToken, modalShownTimestamp, fetchDBUser],
  );

  const onPlaybackTrackingUpdate = useCallback((update: (prev: any) => any) => {
    setPlaybackTracking((prev: any) => update(prev));
  }, []);

  const onPodcastCompletion = useCallback(() => {
    setPlayingPodcastId(null);
    setPlaybackTracking(null);
  }, []);

  const filteredResults = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();

    if (normalizedQuery === "free games") {
      return {
        audioComics: [],
        podcasts: [],
        comics: [],
        mentoonsCards: [],
        mentoonsBooks: [],
        users: [],
        freeGames: searchResults.freeGames.filter(
          (game) => game.name !== "Emergency Contact Numbers",
        ),
      };
    }
    return {
      audioComics: searchResults.audioComics,
      podcasts: searchResults.podcasts,
      comics: searchResults.comics,
      mentoonsCards: searchResults.mentoonsCards,
      mentoonsBooks: searchResults.mentoonsBooks,
      users: searchResults.users.filter((user) => user.clerkId !== userId),
      freeGames: searchResults.freeGames.filter(
        (game) => game.name !== "Emergency Contact Numbers",
      ),
    };
  }, [searchResults, searchQuery, userId]);

  const totalResults = Object.values(filteredResults)
    .flat()
    .filter((item) => item !== undefined).length;

  const filters = [
    {
      id: "all" as const,
      label: "All Results",
      count: totalResults,
      icon: TrendingUp,
      color: "bg-yellow-400",
    },
    {
      id: "users" as const,
      label: "Users",
      count: filteredResults.users.length,
      icon: Users,
      color: "bg-blue-400",
    },
    {
      id: "comics" as const,
      label: "Comics",
      count: filteredResults.comics.length,
      icon: BookOpen,
      color: "bg-red-400",
    },
    {
      id: "audioComics" as const,
      label: "Audio Comics",
      count: filteredResults.audioComics.length,
      icon: BookOpen,
      color: "bg-red-400",
    },
    {
      id: "podcasts" as const,
      label: "Podcasts",
      count: filteredResults.podcasts.length,
      icon: BookOpen,
      color: "bg-red-400",
    },
    {
      id: "mentoonsCards" as const,
      label: "Mentoons Cards",
      count: filteredResults.mentoonsCards.length,
      icon: ShoppingCart,
      color: "bg-green-400",
    },
    {
      id: "mentoonsBooks" as const,
      label: "Mentoons Books",
      count: filteredResults.mentoonsBooks.length,
      icon: ShoppingCart,
      color: "bg-green-400",
    },
    {
      id: "freeGames" as const,
      label: "Free Games",
      count: filteredResults.freeGames.length,
      icon: MdCloudDownload,
      color: "bg-purple-400",
    },
  ];

  return (
    <div
      className="min-h-screen bg-[#FFF6D6]"
      style={{
        backgroundImage:
          "radial-gradient(rgba(0,0,0,0.13) 1.4px, transparent 1.4px)",
        backgroundSize: "16px 16px",
      }}
    >
      <SearchHeader searchQuery={searchQuery} totalResults={totalResults} />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-8">
        {loading && (
          <div className="text-center py-12 md:py-20">
            <p
              className={`font-comic tracking-widest text-3xl md:text-5xl text-black inline-block px-6 py-2 rotate-1 bg-yellow-300 animate-pulse ${PANEL}`}
            >
              Loading...
            </p>
          </div>
        )}
        {error && (
          <div className="text-center py-12 md:py-20">
            <p
              className={`font-comic tracking-widest text-2xl md:text-4xl text-white inline-block px-6 py-3 -rotate-1 bg-red-500 ${PANEL}`}
            >
              {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex flex-wrap gap-3 md:gap-4 mb-8 md:mb-12">
              {filters.map((filter) => {
                if (filter.count === 0 && filter.id !== "all") return null;
                const Icon = filter.icon;
                const isActive = activeFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`font-comic-chip tracking-wider text-black flex items-center space-x-1 sm:space-x-2 md:space-x-3 px-3 sm:px-4 md:px-5 py-2 md:py-3 rounded-lg text-sm sm:text-base md:text-xl ${PANEL_SM} ${POP} ${
                      isActive
                        ? `${filter.color} -rotate-2 scale-105`
                        : "bg-white hover:bg-yellow-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    <span className="hidden sm:inline">{filter.label}</span>
                    <span className="sm:hidden">
                      {filter.label.split(" ")[0]}
                    </span>
                    <span
                      className={`font-number px-2 sm:px-3 py-0.5 rounded-full text-xs sm:text-sm border-2 border-black ${
                        isActive ? "bg-white text-black" : "bg-yellow-300"
                      }`}
                    >
                      {filter.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-10 md:space-y-20">
              {(activeFilter === "all" || activeFilter === "users") &&
                filteredResults.users.length > 0 && (
                  <section>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 md:mb-10 gap-4">
                      <h2 className={captionClass("blue")}>
                        <Users
                          className={`w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 ${sectionTheme.blue.icon}`}
                        />
                        Users ({filteredResults.users.length})
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                      {filteredResults.users.map((user, index) => (
                        <FriendCard
                          key={user._id}
                          friend={mapUserToFriend(user)}
                          index={index}
                          onSendRequest={onSendRequest}
                          onCancelRequest={onCancelRequest}
                          isConnecting={isConnecting}
                          searchQuery={searchQuery}
                        />
                      ))}
                    </div>
                  </section>
                )}

              {(activeFilter === "all" || activeFilter === "comics") &&
                filteredResults.comics.length > 0 && (
                  <section>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 md:mb-10 gap-4">
                      <h2 className={captionClass("red")}>
                        <BookOpen
                          className={`w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 ${sectionTheme.red.icon}`}
                        />
                        Comics ({filteredResults.comics.length})
                      </h2>
                      <NavLink
                        to="/mentoons-comics"
                        className={viewAllClass("red")}
                      >
                        <span>View all</span>
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                      </NavLink>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 lg:gap-8">
                      {filteredResults.comics.map((comic) => (
                        <ComicCard
                          key={comic._id}
                          products={[comic]}
                          carouselRef={carouselRef}
                          openComicModal={openComicModal}
                          searchQuery={searchQuery}
                        />
                      ))}
                    </div>
                  </section>
                )}

              {(activeFilter === "all" || activeFilter === "audioComics") &&
                filteredResults.audioComics.length > 0 && (
                  <section>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 md:mb-10 gap-4">
                      <h2 className={captionClass("red")}>
                        <BookOpen
                          className={`w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 ${sectionTheme.red.icon}`}
                        />
                        Audio Comics ({filteredResults.audioComics.length})
                      </h2>
                      <NavLink
                        to="/mentoons-comics?option=audio+comic"
                        className={viewAllClass("red")}
                      >
                        <span>View all</span>
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                      </NavLink>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 lg:gap-8">
                      {filteredResults.audioComics.map((audioComic) => (
                        <ComicCard
                          key={audioComic._id}
                          products={[audioComic]}
                          carouselRef={carouselRef}
                          openComicModal={openComicModal}
                          searchQuery={searchQuery}
                        />
                      ))}
                    </div>
                  </section>
                )}

              {(activeFilter === "all" || activeFilter === "podcasts") &&
                filteredResults.podcasts.length > 0 && (
                  <section>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 md:mb-10 gap-4">
                      <h2 className={captionClass("red")}>
                        <BookOpen
                          className={`w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 ${sectionTheme.red.icon}`}
                        />
                        Podcasts ({filteredResults.podcasts.length})
                      </h2>
                      <NavLink
                        to="/mentoons-podcast"
                        className={viewAllClass("red")}
                      >
                        <span>View all</span>
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                      </NavLink>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                      {filteredResults.podcasts.map((podcast) => (
                        <PodcastCard
                          key={podcast._id}
                          podcast={podcast}
                          isPlaying={playingPodcastId === podcast._id}
                          onPlayToggle={onPlayToggle}
                          onCheckAccessAndControlPlayback={
                            checkAccessAndControlPlayback
                          }
                          onPlaybackTrackingUpdate={onPlaybackTrackingUpdate}
                          onPodcastCompletion={onPodcastCompletion}
                          playbackTracking={
                            playingPodcastId === podcast._id
                              ? playbackTracking
                              : null
                          }
                          // searchQuery={searchQuery}
                        />
                      ))}
                    </div>
                  </section>
                )}

              {(activeFilter === "all" || activeFilter === "mentoonsCards") &&
                filteredResults.mentoonsCards.length > 0 && (
                  <section>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 md:mb-10 gap-4">
                      <h2 className={captionClass("green")}>
                        <ShoppingCart
                          className={`w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 ${sectionTheme.green.icon}`}
                        />
                        Mentoons Cards ({filteredResults.mentoonsCards.length})
                      </h2>
                      <NavLink to="/products" className={viewAllClass("green")}>
                        <span>View all</span>
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                      </NavLink>
                    </div>
                    <ProductDetailCards
                      ageCategory="Mentoons Cards"
                      productDetails={filteredResults.mentoonsCards}
                      handleAddToCart={handleAddToCart}
                      handleBuyNow={handleBuyNow}
                      isLoading={isLoading}
                      searchQuery={searchQuery}
                    />
                  </section>
                )}

              {(activeFilter === "all" || activeFilter === "mentoonsBooks") &&
                filteredResults.mentoonsBooks.length > 0 && (
                  <section>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 md:mb-10 gap-4">
                      <h2 className={captionClass("green")}>
                        <ShoppingCart
                          className={`w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 ${sectionTheme.green.icon}`}
                        />
                        Mentoons Books ({filteredResults.mentoonsBooks.length})
                      </h2>
                      <NavLink
                        to="/products?productType=mentoons+books#product"
                        className={viewAllClass("green")}
                      >
                        <span>View all</span>
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                      </NavLink>
                    </div>
                    <ProductDetailCards
                      ageCategory="Mentoons Books"
                      productDetails={filteredResults.mentoonsBooks}
                      handleAddToCart={handleAddToCart}
                      handleBuyNow={handleBuyNow}
                      isLoading={isLoading}
                      searchQuery={searchQuery}
                    />
                  </section>
                )}

              {(activeFilter === "all" || activeFilter === "freeGames") &&
                filteredResults.freeGames.length > 0 && (
                  <section>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 md:mb-10 gap-4">
                      <h2 className={captionClass("purple")}>
                        <MdCloudDownload
                          className={`w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 ${sectionTheme.purple.icon}`}
                        />
                        Free Games ({filteredResults.freeGames.length})
                      </h2>
                      <NavLink
                        to="/free-download"
                        className={viewAllClass("purple")}
                      >
                        <span>View all</span>
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                      </NavLink>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                      {filteredResults.freeGames.map((item) => (
                        <motion.div
                          initial={{ opacity: 0.5 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          key={uuidv4()}
                          className={`${
                            item.cardStyling || "bg-white"
                          } ${PANEL} ${POP} group cursor-pointer text-black rounded-xl px-3 md:px-5 py-3 md:py-5 space-y-3`}
                          onClick={() => {
                            setShowFreeDownloadForm(true);
                            setSelectedComic({
                              thumbnail_url: item.thumbnail_url,
                              pdf_url: item.pdf_url,
                            });
                          }}
                        >
                          <div
                            className={`${
                              item.imgStyling || ""
                            } overflow-hidden rounded-lg border-[3px] border-black`}
                          >
                            <img
                              className="w-full h-[14rem] sm:h-[16rem] md:h-[18rem] lg:h-[20rem] group-hover:scale-105 transition-all ease-in-out duration-300 object-cover object-top"
                              src={item.image}
                              alt="game image"
                            />
                          </div>
                          <div className="space-y-1 md:space-y-2">
                            <div className="font-comic text-xl md:text-3xl tracking-wider [&_span]:![font-family:inherit]">
                              {highlightText(item.name, searchQuery)}
                            </div>
                            <div className="text-xs md:text-sm line-clamp-2">
                              {highlightText(item.desc, searchQuery)}
                            </div>
                          </div>
                          <a
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            className="font-comic-chip tracking-wider flex items-center justify-end gap-2 pt-2 md:pt-4 text-sm md:text-xl border-t-4 border-dashed border-black cursor-pointer group-hover:text-red-600"
                          >
                            Download Now
                            <MdCloudDownload className="text-lg md:text-2xl text-red-600 group-hover:text-red-500" />
                          </a>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}

              {totalResults === 0 && activeFilter === "all" && (
                <div className="text-center py-12 md:py-20">
                  <div
                    className={`w-32 h-32 md:w-40 md:h-40 bg-yellow-300 rounded-full flex items-center justify-center mx-auto mb-8 ${PANEL}`}
                  >
                    <BookOpen className="w-16 h-16 md:w-20 md:h-20 text-black" />
                  </div>
                  {/* speech bubble */}
                  <div
                    className={`relative inline-block bg-white rounded-3xl px-6 md:px-10 py-5 md:py-6 max-w-md mx-auto ${PANEL}`}
                  >
                    <h3 className="font-comic tracking-wider text-3xl md:text-5xl text-black mb-2 md:mb-3">
                      No results found!
                    </h3>
                    <p className="font-comic-chip tracking-wide text-black text-base md:text-xl">
                      We couldn't find anything matching your search. Try
                      different keywords.
                    </p>
                    <span className="absolute -top-[14px] left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-l-4 border-t-4 border-black rotate-45" />
                  </div>
                </div>
              )}
            </div>

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
                  className="relative w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] h-[80vh] md:h-[90vh] bg-white rounded-xl border-4 border-black shadow-[8px_8px_0_0_#FFD60A] overflow-hidden"
                >
                  <button
                    onClick={closeComicModal}
                    aria-label="Close comic viewer"
                    className="absolute z-50 p-1.5 md:p-2 text-white bg-red-500 border-[3px] border-black rounded-full shadow-[3px_3px_0_0_#000] top-2 md:top-4 right-2 md:right-4 hover:bg-red-400 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                  >
                    <MdClose className="text-xl md:text-2xl" />
                  </button>
                  <ComicViewer
                    pdfUrl={comicToView}
                    productType={productType}
                    productId={currentProductId}
                  />
                </motion.div>
              </motion.div>
            )}

            {showAddToCartModal && (
              <AddToCartModal
                onClose={() => setShowAddToCartModal(false)}
                isOpen={showAddToCartModal}
                productName={cartProductTitle}
              />
            )}

            {showLoginModal && (
              <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
              />
            )}

            {showSubscriptionLimitModal && (
              <SubscriptionLimitModal
                isOpen={showSubscriptionLimitModal}
                onClose={() => setShowSubscriptionLimitModal(false)}
                message={limitModalMessage}
                title={limitModalTitle}
                planType={dbUser?.subscription.plan || "free"}
                productId={"sample"}
              />
            )}

            {showFreeDownloadForm && (
              <FreeDownloadForm
                page="freedownload"
                selectedComic={selectedComic}
                setShowFreeDownloadForm={setShowFreeDownloadForm}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
