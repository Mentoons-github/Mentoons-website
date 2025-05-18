import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/api/axios";
import { errorToast, successToast } from "@/utils/toastResposnse";
import { useAuth } from "@clerk/clerk-react";

interface Friend {
  _id: string;
  name: string;
  picture: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

interface FriendCardProps {
  friend: Friend;
  onSendRequest: (friendId: string) => void;
  isConnecting: boolean;
  index: number;
}

const FriendCard = ({
  friend,
  onSendRequest,
  isConnecting,
  index,
}: FriendCardProps) => {
  return (
    <motion.div
      key={index}
      variants={itemVariants}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col"
    >
      <div className="p-3 flex-1 flex flex-col items-center text-center">
        <div className="mb-2">
          <img
            src={friend.picture}
            alt={friend.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-orange-200"
          />
        </div>
        <h3 className="font-medium text-gray-800 text-sm mb-2 line-clamp-1">
          {friend.name}
        </h3>
        <button
          onClick={() => onSendRequest(friend._id)}
          disabled={isConnecting}
          className={`mt-auto w-full px-3 py-1 text-sm font-medium text-white ${
            isConnecting
              ? "bg-orange-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          } rounded-full transition-colors duration-200`}
        >
          {isConnecting ? (
            <div className="flex items-center justify-center gap-1">
              <div className="w-3 h-3 border-2 rounded-full border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
              <span>Connecting...</span>
            </div>
          ) : (
            "Connect"
          )}
        </button>
      </div>
    </motion.div>
  );
};

const FriendSearch = () => {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Friend[]>([]);
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(true);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
  const [connectingIds, setConnectingIds] = useState<string[]>([]);

  const navigate = useNavigate();
  const observer = useRef<IntersectionObserver | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setSearchResults([]);
      setIsSearchMode(false);
      return;
    }

    setIsSearchMode(true);
    setLoadingSearch(true);

    const performSearch = async () => {
      try {
        const results = await searchFriends(debouncedQuery);
        setSearchResults(results);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoadingSearch(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  const fetchSuggestions = useCallback(async () => {
    if (loadingSuggestions && page > 1) return;

    setLoadingSuggestions(true);

    try {
      const token = await getToken();
      const response = await axiosInstance.get(
        `/adda/requestSuggestions?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { suggestions: newSuggestions, hasMore: moreAvailable } =
        response.data.data;

      setHasMore(moreAvailable);

      if (newSuggestions && newSuggestions.length > 0) {
        setSuggestions((prev) =>
          page === 1 ? newSuggestions : [...prev, ...newSuggestions]
        );

        if (moreAvailable) {
          setPage((prev) => prev + 1);
        }
      } else if (!newSuggestions || newSuggestions.length === 0) {
        if (page === 1) {
          setSuggestions([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      errorToast("Failed to load friend suggestions");
    } finally {
      setLoadingSuggestions(false);
    }
  }, [page, loadingSuggestions, getToken]);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const searchFriends = async (searchQuery: string): Promise<Friend[]> => {
    if (!searchQuery.trim()) return [];

    try {
      const token = await getToken();
      const response = await axiosInstance.get(
        `/adda/requestSuggestions?page=1&search=${encodeURIComponent(
          searchQuery
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data.suggestions || [];
    } catch (error) {
      console.error("Search failed:", error);
      errorToast("Failed to search for users");
      return [];
    }
  };

  const handleSendRequest = useCallback(
    async (friendId: string) => {
      setConnectingIds((prev) => [...prev, friendId]);

      try {
        const token = await getToken();
        const response = await axiosInstance.post(
          `/adda/request/${friendId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success === true) {
          if (isSearchMode) {
            setSearchResults((prev) => prev.filter((s) => s._id !== friendId));
          } else {
            setSuggestions((prev) => prev.filter((s) => s._id !== friendId));
          }

          successToast("Friend request sent successfully");

          if (!isSearchMode && suggestions.length <= 3 && hasMore) {
            setPage(1);
            fetchSuggestions();
          }
        }
      } catch (error) {
        console.error("Failed to send friend request:", error);
        errorToast("Failed to send friend request");
      } finally {
        setConnectingIds((prev) => prev.filter((id) => id !== friendId));
      }
    },
    [
      suggestions,
      searchResults,
      isSearchMode,
      hasMore,
      getToken,
      fetchSuggestions,
    ]
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  }, []);

  useEffect(() => {
    if (isSearchMode || !hasMore) return;

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loadingSuggestions) {
        fetchSuggestions();
      }
    };

    observer.current = new IntersectionObserver(handleObserver, options);

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, loadingSuggestions, isSearchMode, fetchSuggestions]);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
    if (showSearch) {
      setQuery("");
      setSearchResults([]);
      setIsSearchMode(false);
    }
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center w-full py-6 mx-auto text-center">
      <div className="p-3 mb-3 text-orange-500 rounded-full bg-orange-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </div>
      <h3 className="mb-1 text-lg font-medium text-gray-700">
        No Suggestions Available
      </h3>
      <p className="mb-4 text-sm text-gray-500">
        We couldn't find any connection suggestions for you at the moment
      </p>
      <button
        onClick={() => {
          setPage(1);
          setHasMore(true);
          fetchSuggestions();
        }}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Refresh Suggestions
      </button>
    </div>
  );

  return (
    <div className="relative flex flex-col w-full max-w-3xl mx-auto bg-orange-50 min-h-screen p-4">
      <div className="sticky top-0 z-10 bg-white shadow-md rounded-lg mb-4 p-3">
        <div className="flex items-center justify-between">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center w-8 h-8 bg-white rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-700"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>

          <h1 className="text-lg font-semibold text-gray-800">Find Friends</h1>

          <button
            onClick={toggleSearch}
            className="flex items-center justify-center w-8 h-8 bg-white rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-700"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-3"
            >
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={handleSearch}
                  placeholder="Search for friends..."
                  className="w-full p-2 pl-10 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                {query && (
                  <button
                    onClick={() => {
                      setQuery("");
                      setSearchResults([]);
                      setIsSearchMode(false);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isSearchMode ? (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Search Results
            </h2>
            {loadingSearch ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-3 gap-3"
              >
                {searchResults.map((friend, index) => (
                  <FriendCard
                    key={friend._id}
                    index={index}
                    friend={friend}
                    onSendRequest={handleSendRequest}
                    isConnecting={connectingIds.includes(friend._id)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="text-center p-6 bg-white rounded-lg shadow-md border border-orange-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <svg
                    className="mx-auto h-16 w-16 text-orange-300 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </motion.div>

                <motion.p
                  className="text-lg font-medium text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  No results found
                </motion.p>

                <motion.p
                  className="text-sm text-gray-400 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  Try adjusting your search or filters
                </motion.p>
              </motion.div>
            )}
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              People You May Know
            </h2>
            {loadingSuggestions && suggestions.length === 0 ? (
              <div className="flex justify-center p-6">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
              </div>
            ) : suggestions.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-3 gap-3"
              >
                {suggestions.map((friend, index) => (
                  <FriendCard
                    key={friend._id}
                    index={index}
                    friend={friend}
                    onSendRequest={handleSendRequest}
                    isConnecting={connectingIds.includes(friend._id)}
                  />
                ))}

                {hasMore && (
                  <div ref={loadMoreRef} className="col-span-3 h-4" />
                )}
              </motion.div>
            ) : (
              <EmptyState />
            )}

            {loadingSuggestions && suggestions.length > 0 && (
              <div className="flex justify-center p-4 mt-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                <span className="ml-2 text-gray-500">Loading more...</span>
              </div>
            )}

            {!loadingSuggestions && !hasMore && suggestions.length > 0 && (
              <div className="text-center p-4 mt-2">
                <p className="text-gray-500">That's everyone we know!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FriendSearch;
