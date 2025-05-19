import axiosInstance from "@/api/axios";
import { errorToast, successToast } from "@/utils/toastResposnse";
import { useAuth } from "@clerk/clerk-react";
import { AxiosError } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

interface SuggestionInterface {
  _id: string;
  name: string;
  picture: string;
}

interface FriendSuggestionsListProps {
  initialSuggestions?: SuggestionInterface[] | null;
  initialLoading?: boolean;
  initialHasMore?: boolean;
}

const FriendSuggestionsList = ({
  initialSuggestions = null,
  initialLoading = false,
  initialHasMore = true,
}: FriendSuggestionsListProps) => {
  const [friendSuggestions, setFriendSuggestions] = useState<
    SuggestionInterface[] | null
  >(initialSuggestions);
  const [loading, setLoading] = useState<boolean>(initialLoading);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [page, setPage] = useState<number>(1);
  const [connectingIds, setConnectingIds] = useState<string[]>([]);

  const suggestionsObserver = useRef<IntersectionObserver | null>(null);
  const { getToken } = useAuth();

  const fetchSuggestions = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

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

      console.log("data found : ", response);

      const { suggestions, hasMore: moreAvailable } = response.data.data;

      setHasMore(moreAvailable);

      if (suggestions && suggestions.length > 0) {
        setFriendSuggestions((prev) =>
          prev ? [...prev, ...suggestions] : suggestions
        );

        if (moreAvailable) {
          setPage((prev) => prev + 1);
        }
      } else if (!suggestions || suggestions.length === 0) {
        if (page === 1) {
          setFriendSuggestions([]);
        }
      }
    } catch (error: unknown) {
      console.log("error found :", error);
      if (error instanceof AxiosError) {
        console.error("Error fetching friend suggestions:", error.response);
        errorToast(error.response?.data.error || "Failed to fetch suggestions");
      } else {
        errorToast("Failed to fetch suggestions");
      }
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, getToken]);

  useEffect(() => {
    if (!friendSuggestions) {
      fetchSuggestions();
    }
  }, [friendSuggestions, fetchSuggestions]);

  useEffect(() => {
    if (initialSuggestions !== null) {
      setFriendSuggestions(initialSuggestions);
      setHasMore(initialHasMore);
      setPage(1);
    }
  }, [initialSuggestions, initialHasMore]);

  const handleConnect = async (suggestionId: string) => {
    setConnectingIds((prev) => [...prev, suggestionId]);

    try {
      const token = await getToken();
      const response = await axiosInstance.post(
        `/adda/request/${suggestionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success === true) {
        setFriendSuggestions((prevSuggestions) =>
          prevSuggestions
            ? prevSuggestions.filter(
                (suggestion) => suggestion._id !== suggestionId
              )
            : null
        );

        successToast("Friend request sent successfully");

        if (friendSuggestions && friendSuggestions.length <= 3 && hasMore) {
          fetchSuggestions();
        }
      }
    } catch (error: unknown) {
      console.error("Error sending friend request:", error);
      errorToast("Failed to send friend request");
    } finally {
      setConnectingIds((prev) => prev.filter((id) => id !== suggestionId));
    }
  };

  const lastSuggestionRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (suggestionsObserver.current) suggestionsObserver.current.disconnect();
      suggestionsObserver.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchSuggestions();
          }
        },
        { threshold: 0.5 }
      );
      if (node) suggestionsObserver.current.observe(node);
    },
    [loading, hasMore, fetchSuggestions]
  );

  const EmptyStateContent = () => (
    <div className="flex flex-col items-center justify-center w-full max-w-sm py-6 mx-auto text-center sm:py-8">
      <div className="p-3 mb-3 text-orange-500 rounded-full bg-orange-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 sm:w-8 sm:h-8"
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
      <h3 className="mb-1 text-base font-medium text-gray-700 sm:text-lg">
        No Suggestions Available
      </h3>
      <p className="mb-4 text-xs text-gray-500 sm:text-sm">
        We couldn't find any connection suggestions for you at the moment
      </p>
      <button
        onClick={() => {
          setPage(1);
          setHasMore(true);
          setFriendSuggestions(null);
          fetchSuggestions();
        }}
        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white transition-colors bg-orange-500 rounded-lg sm:text-sm hover:bg-orange-600"
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

  if (!loading && (!friendSuggestions || friendSuggestions.length === 0)) {
    return <EmptyStateContent />;
  }

  return (
    <div className="grid gap-2 sm:gap-3">
      {friendSuggestions?.map(({ picture, name, _id }, index) => (
        <div
          key={_id}
          className="flex flex-col w-full p-3 transition-all duration-200 bg-white border border-orange-100 rounded-lg sm:p-4 sm:rounded-xl hover:shadow-md"
          ref={
            index === friendSuggestions.length - 1 ? lastSuggestionRef : null
          }
        >
          <div className="flex items-center w-full gap-2 mb-2 sm:gap-3 sm:mb-3">
            <div className="w-10 h-10 overflow-hidden rounded-full sm:w-12 sm:h-12 ring-2 ring-orange-50">
              <img
                src={picture}
                alt={name}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-800 sm:text-base">
                {name}
              </h3>
              <p className="text-xs text-gray-500">Suggested connection</p>
            </div>
          </div>
          <div className="flex justify-between w-full gap-2">
            <button
              onClick={() => handleConnect(_id)}
              disabled={connectingIds.includes(_id)}
              className={`flex items-center justify-center flex-1 gap-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white transition-all duration-200 rounded-lg ${
                connectingIds.includes(_id)
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600"
              }`}
            >
              {connectingIds.includes(_id) ? (
                <>
                  <div className="w-3 h-3 border-2 rounded-full sm:w-4 sm:h-4 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Connect
                </>
              )}
            </button>
          </div>
        </div>
      ))}

      {loading && (
        <div className="flex items-center justify-center w-full py-3 sm:py-4">
          <div className="w-5 h-5 border-2 rounded-full sm:w-6 sm:h-6 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <span className="ml-2 text-xs text-gray-500 sm:text-sm">
            Loading more suggestions...
          </span>
        </div>
      )}

      {!loading &&
        friendSuggestions &&
        friendSuggestions.length > 0 &&
        !hasMore && (
          <div className="w-full py-3 text-xs text-center text-gray-500 sm:py-4 sm:text-sm">
            No more suggestions available
          </div>
        )}
    </div>
  );
};

export default FriendSuggestionsList;
