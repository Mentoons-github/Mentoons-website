import axiosInstance from "@/api/axios";
import SubscriptionModalManager, {
  AccessCheckResponse,
} from "@/components/protected/subscriptionManager";
import { errorToast, successToast } from "@/utils/toastResposnse";
import { useAuth } from "@clerk/clerk-react";
import { AxiosError } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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

const FriendSuggestionsList: React.FC<FriendSuggestionsListProps> = ({
  initialSuggestions = null,
  initialLoading = false,
  initialHasMore = true,
}) => {
  const [friendSuggestions, setFriendSuggestions] = useState<
    SuggestionInterface[] | null
  >(initialSuggestions);
  const [loading, setLoading] = useState<boolean>(initialLoading);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [page, setPage] = useState<number>(1);
  const [connectingIds, setConnectingIds] = useState<string[]>([]);
  const [accessCheck, setAccessCheck] = useState<AccessCheckResponse | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
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
          headers: { Authorization: `Bearer ${token}` },
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
      console.error("Error fetching friend suggestions:", error);
      if (error instanceof AxiosError) {
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
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
      if (error instanceof AxiosError) {
        const accessCheck: AccessCheckResponse = error.response?.data?.error;
        console.log(error.response?.data);
        console.log("accessCheck =================>: ", accessCheck);
        if (accessCheck?.upgradeRequired) {
          setAccessCheck(accessCheck);
          setShowModal(true);
        } else {
          errorToast(
            error.response?.data.error || "Failed to send friend request"
          );
        }
      } else {
        errorToast("Failed to send friend request");
      }
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
    return (
      <>
        <EmptyStateContent />
        <SubscriptionModalManager
          accessCheck={accessCheck}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      </>
    );
  }

  return (
    <div className="grid gap-2">
      {friendSuggestions?.map(({ picture, name, _id }, index) => (
        <div
          key={_id}
          className="flex items-center justify-between w-full p-2.5 transition-all duration-200 bg-white border border-orange-100 rounded-lg hover:shadow-sm hover:border-orange-200"
          ref={
            index === friendSuggestions.length - 1 ? lastSuggestionRef : null
          }
        >
          {/* User Info Section */}
          <div
            className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
            onClick={() => navigate(`/adda/user/${_id}`)}
          >
            <div className="w-8 h-8 overflow-hidden rounded-full ring-1 ring-orange-100 flex-shrink-0">
              <img
                src={picture}
                alt={name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-800 truncate">
                {name}
              </h3>
              <p className="text-xs text-gray-500">Suggested</p>
            </div>
          </div>

          {/* Connect Button */}
          <button
            onClick={() => handleConnect(_id)}
            disabled={connectingIds.includes(_id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 rounded-md flex-shrink-0 ${
              connectingIds.includes(_id)
                ? "bg-orange-400 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 hover:shadow-sm"
            }`}
          >
            {connectingIds.includes(_id) ? (
              <>
                <div className="w-3 h-3 border-2 rounded-full border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                <span>Connecting</span>
              </>
            ) : (
              <>
                <svg
                  className="w-3 h-3"
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
      ))}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center w-full py-3">
          <div className="w-4 h-4 border-2 rounded-full border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <span className="ml-2 text-xs text-gray-500">Loading more...</span>
        </div>
      )}

      {/* No More Results */}
      {!loading &&
        friendSuggestions &&
        friendSuggestions.length > 0 &&
        !hasMore && (
          <div className="w-full py-2 text-xs text-center text-gray-400">
            No more suggestions
          </div>
        )}

      <SubscriptionModalManager
        accessCheck={accessCheck}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default FriendSuggestionsList;
