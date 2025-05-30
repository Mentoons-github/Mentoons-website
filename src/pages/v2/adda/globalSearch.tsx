import { useState, useMemo, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  Users,
  BookOpen,
  ShoppingCart,
  ArrowRight,
  Filter,
  Clock,
  TrendingUp,
  Heart,
  Share2,
  Eye,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import axiosInstance from "@/api/axios";
import ProductDetailCards from "@/components/products/cards";
import { useProductActions } from "@/hooks/useProductAction";
import AddToCartModal from "@/components/modals/AddToCartModal";
import LoginModal from "@/components/common/modal/loginModal";
import { ProductBase, AgeCategory } from "@/types/productTypes";
import PodcastCard from "@/components/podcast/card";

// Define interfaces for data models
interface ContentItem {
  _id: string;
  title: string;
  thumbnail?: string;
  ageCategory?: string;
  description?: string;
  tags?: string[];
  episodes?: number;
  views?: string;
  rating?: number;
  isNew?: boolean;
  orignalProductSrc?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  followStatus:
    | "self"
    | "friend"
    | "following"
    | "follow back"
    | "pending"
    | "connect";
}

interface SearchResults {
  audioComics: ContentItem[];
  podcasts: ProductBase[]; // Changed to ProductBase
  comics: ContentItem[];
  mentoonsCards: ProductBase[];
  mentoonsBooks: ProductBase[];
  users: User[];
}

const SearchResultsPage = () => {
  const [activeFilter, setActiveFilter] = useState<
    | "all"
    | "users"
    | "comics"
    | "audioComics"
    | "podcasts"
    | "mentoonsCards"
    | "mentoonsBooks"
  >("all");
  const [sortBy, setSortBy] = useState<
    "relevance" | "popular" | "recent" | "rating"
  >("relevance");
  const [searchResults, setSearchResults] = useState<SearchResults>({
    audioComics: [],
    podcasts: [],
    comics: [],
    mentoonsCards: [],
    mentoonsBooks: [],
    users: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [cartProductTitle, setCartProductTitle] = useState("");
  const [playingPodcastId, setPlayingPodcastId] = useState<string | null>(null);
  const [playbackTracking, setPlaybackTracking] = useState<any>(null);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("q") ?? "";
  const { getToken } = useAuth();
  const { handleAddToCart, handleBuyNow, isLoading } = useProductActions({
    setShowLoginModal,
    setShowAddToCartModal,
    setCartProductTitle,
  });

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
        }
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
      const transformContentItem = (item: any): ContentItem => ({
        ...item,
        ageCategory: mapAgeCategory(item.ageCategory),
        productImages: item.productImages ?? [],
      });

      setSearchResults({
        ...response.data,
        mentoonsCards: response.data.mentoonsCards.map(transformProduct),
        mentoonsBooks: response.data.mentoonsBooks.map(transformProduct),
        podcasts: response.data.podcasts.map(transformProduct), // Use transformProduct
        comics: response.data.comics.map(transformContentItem),
        audioComics: response.data.audioComics.map(transformContentItem),
      });

      console.log(response.data);
    } catch (err) {
      console.error("Fetch Error:", err);
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

  // PodcastCard Handlers
  const onPlayToggle = useCallback((podcastId: string) => {
    setPlayingPodcastId((prev) => (prev === podcastId ? null : podcastId));
  }, []);

  const onCheckAccessAndControlPlayback = useCallback(
    (podcast: ProductBase, audioElement?: HTMLAudioElement | null): boolean => {
      const hasAccess = true; // Replace with actual auth logic
      if (!hasAccess && audioElement) {
        audioElement.pause();
        setShowLoginModal(true);
        return false;
      }
      return true;
    },
    [setShowLoginModal]
  );

  const onPlaybackTrackingUpdate = useCallback((update: (prev: any) => any) => {
    setPlaybackTracking((prev: any) => update(prev));
  }, []);

  const onPodcastCompletion = useCallback(
    (podcastId: string, podcastType: string) => {
      console.log(`Podcast ${podcastId} (${podcastType}) completed`);
      setPlayingPodcastId(null);
      setPlaybackTracking(null);
    },
    []
  );

  const filteredResults = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const filterItems = <T extends ContentItem | ProductBase>(
      items: T[]
    ): T[] =>
      items.filter(
        (item) =>
          item.title?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.tags?.some((tag: string) => tag.toLowerCase().includes(query)) ||
          (item.ageCategory?.toLowerCase().includes(query) ?? false)
      );

    const filterUsers = (users: User[]): User[] =>
      users.filter(
        (user) =>
          user.name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query)
      );

    return {
      audioComics: filterItems(searchResults.audioComics),
      podcasts: filterItems(searchResults.podcasts),
      comics: filterItems(searchResults.comics),
      mentoonsCards: filterItems(searchResults.mentoonsCards),
      mentoonsBooks: filterItems(searchResults.mentoonsBooks),
      users: filterUsers(searchResults.users),
    };
  }, [searchResults, searchQuery]);

  const totalResults = Object.values(filteredResults)
    .flat()
    .filter((item) => item !== undefined).length;

  // Friend Card
  const FriendCard = ({ user }: { user: User }) => (
    <div className="group bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-100 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <img
            src={user.avatar || "/api/placeholder/40/40"}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover ring-3 ring-blue-200 group-hover:ring-blue-400 transition-all"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-black text-lg truncate group-hover:text-blue-600 transition-colors">
            {user.name}
          </h3>
          <p className="text-sm tevxt-gray-700 mb-2 font-medium">
            {user.followStatus === "self"
              ? "You"
              : user.followStatus === "friend"
              ? "Friend"
              : user.followStatus === "following"
              ? "Following"
              : user.followStatus === "follow back"
              ? "Follows You"
              : user.followStatus === "pending"
              ? "Request Pending"
              : "Connect"}
          </p>
          <div className="flex space-x-2">
            {user.followStatus !== "self" && (
              <button
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-bold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
                disabled={
                  user.followStatus === "pending" ||
                  user.followStatus === "friend"
                }
              >
                {user.followStatus === "pending"
                  ? "Pending"
                  : user.followStatus === "friend"
                  ? "Friends"
                  : user.followStatus === "following"
                  ? "Unfollow"
                  : user.followStatus === "follow back"
                  ? "Follow Back"
                  : "Add Friend"}
              </button>
            )}
            <button className="px-3 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all transform hover:scale-110 shadow-md">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ComicCard = ({ item, type }: { item: ContentItem; type: string }) => (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-red-100 hover:shadow-2xl hover:border-red-400 transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={item.orignalProductSrc || "/api/placeholder/100/120"}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {item.isNew && (
            <span className="bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce">
              NEW
            </span>
          )}
          <span className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {item.ageCategory || type}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          ⭐ {item.rating || 4.5}
        </div>
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <div className="flex items-center justify-between text-white text-sm font-semibold">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-black/50 px-2 py-1 rounded-full">
                <Eye className="w-4 h-4" />
                <span>{item.views || "N/A"}</span>
              </div>
              {item.episodes && (
                <div className="flex items-center space-x-1 bg-black/50 px-2 py-1 rounded-full">
                  <BookOpen className="w-4 h-4" />
                  <span>{item.episodes} eps</span>
                </div>
              )}
            </div>
            <Heart className="w-6 h-6 hover:fill-red-500 hover:text-red-500 transition-colors transform hover:scale-125" />
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-black text-lg mb-2 group-hover:text-red-600 transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 font-medium">
          {item.episodes
            ? `${item.episodes} episodes`
            : item.ageCategory || type}{" "}
          • {item.views || "N/A"} views
        </p>
        <button className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 hover:shadow-xl">
          {type === "mentoonsBooks" || type === "mentoonsCards"
            ? "View Now"
            : "Read Now"}
        </button>
      </div>
    </div>
  );

  // Define filters
  const filters = [
    {
      id: "all" as const,
      label: "All Results",
      count: totalResults,
      icon: TrendingUp,
      color: "from-blue-600 to-blue-700",
    },
    {
      id: "users" as const,
      label: "Users",
      count: filteredResults.users.length,
      icon: Users,
      color: "from-blue-600 to-blue-700",
    },
    {
      id: "comics" as const,
      label: "Comics",
      count: filteredResults.comics.length,
      icon: BookOpen,
      color: "from-red-600 to-red-700",
    },
    {
      id: "audioComics" as const,
      label: "Audio Comics",
      count: filteredResults.audioComics.length,
      icon: BookOpen,
      color: "from-red-600 to-red-700",
    },
    {
      id: "podcasts" as const,
      label: "Podcasts",
      count: filteredResults.podcasts.length,
      icon: BookOpen,
      color: "from-red-600 to-red-700",
    },
    {
      id: "mentoonsCards" as const,
      label: "Mentoons Cards",
      count: filteredResults.mentoonsCards.length,
      icon: ShoppingCart,
      color: "from-green-600 to-green-700",
    },
    {
      id: "mentoonsBooks" as const,
      label: "Mentoons Books",
      count: filteredResults.mentoonsBooks.length,
      icon: ShoppingCart,
      color: "from-green-600 to-green-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-blue-600 shadow-xl border-b-4 border-orange-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
                Search Results for "
                <span className="text-orange-300">{searchQuery}</span>"
              </h1>
              <div className="flex items-center space-x-4 text-blue-100">
                <span className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="font-bold">
                    Found {totalResults} results
                  </span>
                </span>
                <span className="text-blue-200">•</span>
                <span className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span className="font-semibold">Updated just now</span>
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-3 bg-white border-2 border-orange-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-400 font-semibold text-black shadow-lg"
              >
                <option value="relevance">Most Relevant</option>
                <option value="popular">Most Popular</option>
                <option value="recent">Most Recent</option>
                <option value="rating">Highest Rated</option>
              </select>
              <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105 font-bold shadow-xl">
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-20">
            <p className="text-2xl font-bold text-black">Loading...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-20">
            <p className="text-2xl font-bold text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-4 mb-10">
              {filters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg ${
                      activeFilter === filter.id
                        ? `bg-gradient-to-r ${filter.color} text-white shadow-2xl border-2 border-white`
                        : "bg-white text-black hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-lg">{filter.label}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        activeFilter === filter.id
                          ? "bg-white/30 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {filter.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Results Sections */}
            <div className="space-y-16">
              {/* Users Results */}
              {(activeFilter === "all" || activeFilter === "users") &&
                filteredResults.users.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-3xl font-bold text-black flex items-center">
                        <Users className="w-8 h-8 mr-4 text-blue-600" />
                        Users ({filteredResults.users.length})
                      </h2>
                      <button className="text-blue-700 hover:text-blue-800 font-bold flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-xl hover:bg-blue-200 transition-all">
                        <span>View all</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {filteredResults.users.map((user) => (
                        <FriendCard key={user._id} user={user} />
                      ))}
                    </div>
                  </section>
                )}

              {/* Comics Results */}
              {(activeFilter === "all" || activeFilter === "comics") &&
                filteredResults.comics.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-3xl font-bold text-black flex items-center">
                        <BookOpen className="w-8 h-8 mr-4 text-red-600" />
                        Comics ({filteredResults.comics.length})
                      </h2>
                      <button className="text-red-700 hover:text-red-800 font-bold flex items-center space-x-2 bg-red-100 px-4 py-2 rounded-xl hover:bg-red-200 transition-all">
                        <span>View all</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      {filteredResults.comics.map((comic) => (
                        <ComicCard key={comic._id} item={comic} type="Comics" />
                      ))}
                    </div>
                  </section>
                )}

              {/* Audio Comics Results */}
              {(activeFilter === "all" || activeFilter === "audioComics") &&
                filteredResults.audioComics.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-3xl font-bold text-black flex items-center">
                        <BookOpen className="w-8 h-8 mr-4 text-red-600" />
                        Audio Comics ({filteredResults.audioComics.length})
                      </h2>
                      <button className="text-red-700 hover:text-red-800 font-bold flex items-center space-x-2 bg-red-100 px-4 py-2 rounded-xl hover:bg-red-200 transition-all">
                        <span>View all</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      {filteredResults.audioComics.map((audioComic) => (
                        <ComicCard
                          key={audioComic._id}
                          item={audioComic}
                          type="Audio Comics"
                        />
                      ))}
                    </div>
                  </section>
                )}

              {/* Podcasts Results */}
              {(activeFilter === "all" || activeFilter === "podcasts") &&
                filteredResults.podcasts.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-3xl font-bold text-black flex items-center">
                        <BookOpen className="w-8 h-8 mr-4 text-red-600" />
                        Podcasts ({filteredResults.podcasts.length})
                      </h2>
                      <button className="text-red-700 hover:text-red-800 font-bold flex items-center space-x-2 bg-red-100 px-4 py-2 rounded-xl hover:bg-red-200 transition-all">
                        <span>View all</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredResults.podcasts.map((podcast) => (
                        <PodcastCard
                          key={podcast._id}
                          podcast={podcast}
                          isPlaying={playingPodcastId === podcast._id}
                          onPlayToggle={onPlayToggle}
                          onCheckAccessAndControlPlayback={
                            onCheckAccessAndControlPlayback
                          }
                          onPlaybackTrackingUpdate={onPlaybackTrackingUpdate}
                          onPodcastCompletion={onPodcastCompletion}
                          playbackTracking={
                            playingPodcastId === podcast._id
                              ? playbackTracking
                              : null
                          }
                        />
                      ))}
                    </div>
                  </section>
                )}

              {/* Mentoons Cards Results */}
              {(activeFilter === "all" || activeFilter === "mentoonsCards") &&
                filteredResults.mentoonsCards.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-3xl font-bold text-black flex items-center">
                        <ShoppingCart className="w-8 h-8 mr-4 text-green-600" />
                        Mentoons Cards ({filteredResults.mentoonsCards.length})
                      </h2>
                      <button className="text-green-700 hover:text-green-800 font-bold flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-xl hover:bg-green-200 transition-all">
                        <span>View all</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                    <ProductDetailCards
                      ageCategory="Mentoons Cards"
                      productDetails={filteredResults.mentoonsCards}
                      handleAddToCart={handleAddToCart}
                      handleBuyNow={handleBuyNow}
                      isLoading={isLoading}
                    />
                  </section>
                )}

              {/* Mentoons Books Results */}
              {(activeFilter === "all" || activeFilter === "mentoonsBooks") &&
                filteredResults.mentoonsBooks.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-3xl font-bold text-black flex items-center">
                        <ShoppingCart className="w-8 h-8 mr-4 text-green-600" />
                        Mentoons Books ({filteredResults.mentoonsBooks.length})
                      </h2>
                      <button className="text-green-700 hover:text-green-800 font-bold flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-xl hover:bg-green-200 transition-all">
                        <span>View all</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                    <ProductDetailCards
                      ageCategory="Mentoons Books"
                      productDetails={filteredResults.mentoonsBooks}
                      handleAddToCart={handleAddToCart}
                      handleBuyNow={handleBuyNow}
                      isLoading={isLoading}
                    />
                  </section>
                )}

              {/* No Results */}
              {totalResults === 0 && (
                <div className="text-center py-20">
                  <div className="w-40 h-40 bg-gradient-to-br from-red-200 via-orange-200 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <BookOpen className="w-20 h-20 text-red-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-black mb-4">
                    No results found
                  </h3>
                  <p className="text-gray-700 mb-10 max-w-md mx-auto text-lg font-medium">
                    We couldn't find anything matching your search. Try
                    different keywords or explore our suggestions below.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    {[
                      "comics",
                      "audio comics",
                      "podcasts",
                      "mentoons cards",
                      "mentoons books",
                      "friends",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:from-blue-700 hover:to-red-700 transition-all transform hover:scale-105 font-bold text-lg shadow-lg"
                      >
                        Try "{suggestion}"
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Modals */}
        {showAddToCartModal && (
          <AddToCartModal
            onClose={() => setShowAddToCartModal(false)}
            isOpen={showAddToCartModal}
            productName={cartProductTitle}
          />
        )}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      </div>
    </div>
  );
};

export default SearchResultsPage;
