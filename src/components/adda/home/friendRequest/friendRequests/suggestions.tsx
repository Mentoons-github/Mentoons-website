import { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "@/api/axios";
import { useAuth } from "@clerk/clerk-react";
import { errorToast, successToast } from "@/utils/toastResposnse";
import { AxiosError } from "axios";

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

  if (!loading && (!friendSuggestions || friendSuggestions.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="p-3 mb-3 text-blue-500 rounded-full bg-blue-50">
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
        <p className="font-medium text-gray-600">No suggestions available</p>
        <p className="text-sm text-gray-500">
          We'll suggest new connections for you soon
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {friendSuggestions?.map(({ picture, name, _id }, index) => (
        <div
          key={_id}
          className="flex flex-col w-full p-4 transition-all duration-200 bg-white border border-blue-100 rounded-xl hover:shadow-md"
          ref={
            index === friendSuggestions.length - 1 ? lastSuggestionRef : null
          }
        >
          <div className="flex items-center w-full gap-3 mb-3">
            <div className="w-12 h-12 overflow-hidden rounded-full ring-2 ring-blue-50">
              <img
                src={picture}
                alt={name}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-800">{name}</h3>
              <p className="text-xs text-gray-500">Suggested connection</p>
            </div>
          </div>
          <div className="flex justify-between w-full gap-2">
            <button
              onClick={() => handleConnect(_id)}
              disabled={connectingIds.includes(_id)}
              className={`flex items-center justify-center flex-1 gap-1 px-3 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg ${
                connectingIds.includes(_id)
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
              }`}
            >
              {connectingIds.includes(_id) ? (
                <>
                  <div className="w-4 h-4 border-2 rounded-full border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
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
        <div className="flex items-center justify-center w-full py-4">
          <div className="w-6 h-6 border-2 rounded-full border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <span className="ml-2 text-sm text-gray-500">
            Loading more suggestions...
          </span>
        </div>
      )}

      {!loading &&
        friendSuggestions &&
        friendSuggestions.length > 0 &&
        !hasMore && (
          <div className="w-full py-4 text-center text-sm text-gray-500">
            No more suggestions available
          </div>
        )}
    </div>
  );
};

export default FriendSuggestionsList;
