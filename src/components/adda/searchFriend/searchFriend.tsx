import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/api/axios";
import { errorToast, successToast } from "@/utils/toastResposnse";
import { useAuth } from "@clerk/clerk-react";
import FriendCard from "./friendCard";

interface Friend {
  _id: string;
  name: string;
  picture: string;
  status:
    | "connect"
    | "friends"
    | "followBack"
    | "pendingSent"
    | "pendingReceived";
  requestId?: string;
}

interface RequestSender {
  requestId: string;
  senderDetails: {
    _id: string;
    name: string;
    picture: string;
  };
  status?: "pending" | "accepting" | "declining" | "accepted" | "declined";
  message?: string;
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

const FriendSearch = () => {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Friend[]>([]);
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(true);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [searchPage, setSearchPage] = useState<number>(1);
  const [searchHasMore, setSearchHasMore] = useState<boolean>(true);
  const [suggestionPage, setSuggestionPage] = useState<number>(1);
  const [suggestionHasMore, setSuggestionHasMore] = useState<boolean>(true);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
  const [connectingIds, setConnectingIds] = useState<string[]>([]);
  const [showRequests, setShowRequests] = useState<boolean>(false);
  const [requests, setRequests] = useState<RequestSender[]>([]);
  const [requestCount, setRequestCount] = useState<number>(0);
  const [loadingRequests, setLoadingRequests] = useState<boolean>(false);
  const navigate = useNavigate();
  const observer = useRef<IntersectionObserver | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { getToken } = useAuth();

  const fetchFriendRequestCount = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await axiosInstance.get(
        "/adda/getMyFriendRequests?page=1&limit=1",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setRequestCount(response.data.data.totalCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch friend request count:", error);
    }
  }, [getToken]);

  useEffect(() => {
    fetchFriendRequestCount();
    const intervalId = setInterval(fetchFriendRequestCount, 30000);
    return () => clearInterval(intervalId);
  }, [fetchFriendRequestCount]);

  const fetchRequests = async () => {
    if (loadingRequests) return;
    setLoadingRequests(true);
    try {
      const token = await getToken();
      const response = await axiosInstance.get(
        "/adda/getMyFriendRequests?page=1&limit=10",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { pendingReceived } = response.data.data;
      const transformedRequests = pendingReceived.map((data: any) => ({
        requestId: data._id,
        senderDetails: {
          _id: data.senderId._id,
          name: data.senderId.name,
          picture: data.senderId.picture,
        },
        status: "pending",
      }));
      setRequests(transformedRequests);
      setRequestCount(transformedRequests.length);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      errorToast("Failed to load friend requests");
    } finally {
      setLoadingRequests(false);
    }
  };

  const toggleRequestsPanel = () => {
    if (!showRequests) {
      fetchRequests();
    }
    setShowRequests(!showRequests);
    if (showSearch) {
      setShowSearch(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setSearchResults([]);
      setIsSearchMode(false);
      setSearchPage(1);
      setSearchHasMore(true);
      return;
    }
    setIsSearchMode(true);
    setLoadingSearch(true);
    const performSearch = async () => {
      try {
        console.log("Search query:", debouncedQuery);
        const results = await searchFriends(debouncedQuery, searchPage);
        console.log("Search results:", results);
        setSearchResults((prev) =>
          searchPage === 1
            ? results.suggestions
            : [...prev, ...results.suggestions]
        );
        setSearchHasMore(results.hasMore);
        if (results.hasMore) {
          setSearchPage((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoadingSearch(false);
      }
    };

    performSearch();
  }, [debouncedQuery, searchPage]);

  const fetchSuggestions = useCallback(async () => {
    
    if (suggestions.length > 0) {
      setLoadingSuggestions(false);
      return;
    }
    if (loadingSuggestions && suggestionPage > 1) return;
    setLoadingSuggestions(true);
    try {
      const token = await getToken();
     
      const response = await axiosInstance.get(
        `/adda/getFriends?page=${suggestionPage}&limit=10`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("friends ============>", response.data);
      const { friends, totalPages } = response.data.data;

      console.log(friends);

      const mappedSuggestions: Friend[] = friends.map((friend: any) => ({
        _id: friend._id,
        name: friend.name,
        picture: friend.picture,
        status: "friends",
      }));
      setSuggestionHasMore(suggestionPage < totalPages);
      if (mappedSuggestions.length > 0) {
        setSuggestions((prev) =>
          suggestionPage === 1
            ? mappedSuggestions
            : [...prev, ...mappedSuggestions]
        );
        if (suggestionPage < totalPages) {
          setSuggestionPage((prev) => prev + 1);
        }
      } else if (suggestionPage === 1) {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Failed to fetch friend suggestions:", error);
      errorToast("Failed to load friend suggestions");
    } finally {
      setLoadingSuggestions(false);
    }
  }, [suggestionPage, loadingSuggestions, getToken, suggestions.length]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const searchFriends = async (searchQuery: string, page: number) => {
    if (!searchQuery.trim()) return { suggestions: [], hasMore: false };
    try {
      const token = await getToken();
      const response = await axiosInstance.get(
        `/user/search-friend?page=${page}&search=${encodeURIComponent(
          searchQuery
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return {
        suggestions: response.data.data.suggestions || [],
        hasMore: response.data.data.hasMore || false,
      };
    } catch (error) {
      console.error("Search failed:", error);
      errorToast("Failed to search for users");
      return { suggestions: [], hasMore: false };
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
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success === true) {
          if (isSearchMode) {
            setSearchResults((prev) =>
              prev.map((s) =>
                s._id === friendId
                  ? {
                      ...s,
                      status: "pendingSent",
                      requestId: response.data.data.requestId,
                    }
                  : s
              )
            );
          } else {
            setSuggestions((prev) =>
              prev.map((s) =>
                s._id === friendId
                  ? {
                      ...s,
                      status: "pendingSent",
                      requestId: response.data.data.requestId,
                    }
                  : s
              )
            );
          }
          successToast("Friend request sent successfully");
          if (!isSearchMode && suggestions.length <= 3 && suggestionHasMore) {
            setSuggestionPage(1);
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
      suggestionHasMore,
      getToken,
      fetchSuggestions,
    ]
  );

  const handleCancelRequest = useCallback(
    async (requestId: string) => {
      try {
        const token = await getToken();
        const response = await axiosInstance.post(
          `/adda/cancelRequest/${requestId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success === true) {
          if (isSearchMode) {
            setSearchResults((prev) =>
              prev.map((s) =>
                s.requestId === requestId
                  ? { ...s, status: "connect", requestId: undefined }
                  : s
              )
            );
          } else {
            setSuggestions((prev) =>
              prev.map((s) =>
                s.requestId === requestId
                  ? { ...s, status: "connect", requestId: undefined }
                  : s
              )
            );
          }
          successToast("Friend request cancelled successfully");
        }
      } catch (error) {
        console.error("Failed to cancel friend request:", error);
        errorToast("Failed to cancel friend request");
      }
    },
    [isSearchMode]
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSearchPage(1);
  }, []);

  useEffect(() => {
    if (isSearchMode || !suggestionHasMore) return;
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      if (
        entries[0].isIntersecting &&
        suggestionHasMore &&
        !loadingSuggestions
      ) {
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
  }, [suggestionHasMore, loadingSuggestions, isSearchMode, fetchSuggestions]);

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
      setSearchPage(1);
      setSearchHasMore(true);
    }
    if (showRequests) {
      setShowRequests(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.requestId === requestId
          ? { ...request, status: "accepting" }
          : request
      )
    );
    try {
      const token = await getToken();
      const response = await axiosInstance.patch(
        `/adda/acceptRequest/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success === true) {
        setRequests((prev) =>
          prev.map((request) =>
            request.requestId === requestId
              ? { ...request, status: "accepted", message: "Request accepted!" }
              : request
          )
        );
        setRequestCount((count) => Math.max(0, count - 1));
        setTimeout(() => {
          setRequests((prev) =>
            prev.filter((request) => request.requestId !== requestId)
          );
        }, 1500);
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      setRequests((prev) =>
        prev.map((request) =>
          request.requestId === requestId
            ? { ...request, status: "pending" }
            : request
        )
      );
    }
  };

  const handleDecline = async (requestId: string) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.requestId === requestId
          ? { ...request, status: "declining" }
          : request
      )
    );
    try {
      const token = await getToken();
      const response = await axiosInstance.patch(
        `/adda/rejectRequest/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success === true) {
        setRequests((prev) =>
          prev.map((request) =>
            request.requestId === requestId
              ? { ...request, status: "declined", message: "Request declined" }
              : request
          )
        );
        setRequestCount((count) => Math.max(0, count - 1));
        setTimeout(() => {
          setRequests((prev) =>
            prev.filter((request) => request.requestId !== requestId)
          );
        }, 1500);
      }
    } catch (error) {
      console.error("Error declining friend request:", error);
      setRequests((prev) =>
        prev.map((request) =>
          request.requestId === requestId
            ? { ...request, status: "pending" }
            : request
        )
      );
    }
  };

  const getCardClasses = (status?: string) => {
    const baseClasses =
      "flex flex-col w-full p-4 transition-all duration-300 border rounded-xl";
    switch (status) {
      case "accepting":
        return `${baseClasses} border-green-200 bg-green-50`;
      case "declining":
        return `${baseClasses} border-red-200 bg-red-50`;
      case "accepted":
        return `${baseClasses} border-green-300 bg-green-100 transform scale-95 opacity-80`;
      case "declined":
        return `${baseClasses} border-red-300 bg-red-100 transform scale-95 opacity-80`;
      default:
        return `${baseClasses} border-orange-100 bg-white hover:shadow-md`;
    }
  };

  const getActionButtons = (request: RequestSender) => {
    const { status, requestId } = request;
    if (status === "accepting") {
      return (
        <div className="flex justify-center w-full py-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 rounded-full border-t-green-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <span className="text-sm font-medium text-green-600">
              Accepting request...
            </span>
          </div>
        </div>
      );
    }
    if (status === "declining") {
      return (
        <div className="flex justify-center w-full py-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 rounded-full border-t-red-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <span className="text-sm font-medium text-red-600">
              Declining request...
            </span>
          </div>
        </div>
      );
    }
    if (status === "accepted") {
      return (
        <div className="flex justify-center w-full py-2">
          <div className="flex items-center gap-2 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Request Accepted!</span>
          </div>
        </div>
      );
    }
    if (status === "declined") {
      return (
        <div className="flex justify-center w-full py-2">
          <div className="flex items-center gap-2 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Request Declined</span>
          </div>
        </div>
      );
    }
    return (
      <div className="flex justify-between w-full gap-2">
        <button
          onClick={() => handleAccept(requestId)}
          className="flex items-center justify-center flex-1 gap-1 px-3 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Accept
        </button>
        <button
          onClick={() => handleDecline(requestId)}
          className="flex items-center justify-center flex-1 gap-1 px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Decline
        </button>
      </div>
    );
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
        No Friends Available
      </h3>
      <p className="mb-4 text-sm text-gray-500">
        You don't have any mutual friends at the moment. Try searching for new
        connections!
      </p>
      <button
        onClick={() => {
          setSuggestionPage(1);
          setSuggestionHasMore(true);
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
        Refresh Friends
      </button>
    </div>
  );

  const EmptyRequestsState = () => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
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
      <p className="font-medium text-gray-600">No friend requests yet</p>
      <p className="text-sm text-gray-500">
        When someone sends you a request, it will appear here
      </p>
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
          <div className="flex items-center gap-2">
            <button
              onClick={toggleRequestsPanel}
              className="relative flex items-center justify-center w-8 h-8 bg-white rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Friend Requests"
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              {requestCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                  {requestCount > 99 ? "99+" : requestCount}
                </span>
              )}
            </button>
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
                      setSearchPage(1);
                      setSearchHasMore(true);
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
      <AnimatePresence>
        {showRequests && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md mb-4 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                Friend Requests
              </h2>
            </div>
            <div className="max-h-96 overflow-y-auto p-4">
              {loadingRequests ? (
                <div className="flex justify-center items-center py-6">
                  <div className="w-8 h-8 border-4 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                </div>
              ) : requests.length > 0 ? (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div
                      key={request.requestId}
                      className={getCardClasses(request.status)}
                    >
                      <div className="flex items-center mb-4">
                        <img
                          src={request.senderDetails.picture}
                          alt={request.senderDetails.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-orange-100"
                        />
                        <div className="ml-3 flex-1">
                          <h3 className="font-medium text-gray-800">
                            {request.senderDetails.name}
                          </h3>
                          {request.message && (
                            <p className="text-sm text-gray-500">
                              {request.message}
                            </p>
                          )}
                        </div>
                      </div>
                      {getActionButtons(request)}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyRequestsState />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
                    onCancelRequest={handleCancelRequest}
                    isConnecting={connectingIds.includes(friend._id)}
                  />
                ))}
                {searchHasMore && (
                  <div ref={loadMoreRef} className="col-span-3 h-4" />
                )}
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
            {loadingSearch && searchResults.length > 0 && (
              <div className="flex justify-center p-4 mt-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                <span className="ml-2 text-gray-500">Loading more...</span>
              </div>
            )}
            {!loadingSearch && !searchHasMore && searchResults.length > 0 && (
              <div className="text-center p-4 mt-2">
                <p className="text-gray-500">No more results</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Your Friends
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
                    onCancelRequest={handleCancelRequest}
                    isConnecting={connectingIds.includes(friend._id)}
                  />
                ))}
                {suggestionHasMore && (
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
            {!loadingSuggestions &&
              !suggestionHasMore &&
              suggestions.length > 0 && (
                <div className="text-center p-4 mt-2">
                  <p className="text-gray-500">That's all your friends!</p>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default FriendSearch;
