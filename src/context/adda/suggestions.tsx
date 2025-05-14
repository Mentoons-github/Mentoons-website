import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import axiosInstance from "@/api/axios";
import { AxiosError } from "axios";
import { useAuth } from "@clerk/clerk-react";
import { errorToast, successToast } from "@/utils/toastResposnse";

interface Suggestion {
  _id: string;
  name: string;
  picture: string;
}

interface FriendSuggestionContextType {
  friendSuggestions: Suggestion[] | null;
  handleConnect: (suggestionId: string) => Promise<void>;
  lastSuggestionRef: (node: HTMLDivElement | null) => void;
  connectingIds: string[];
}

const FriendSuggestionContext =
  createContext<FriendSuggestionContextType | null>(null);

export const FriendSuggestionProvider = ({
  children,
  initialSuggestions = null,
  initialHasMore = false,
}: {
  children: ReactNode;
  initialSuggestions?: Suggestion[] | null;
  initialHasMore?: boolean;
}) => {
  const [friendSuggestions, setFriendSuggestions] = useState<
    Suggestion[] | null
  >(initialSuggestions);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { suggestions, hasMore: moreAvailable } = response.data.data;
      setHasMore(moreAvailable);

      if (suggestions && suggestions.length > 0) {
        setFriendSuggestions((prev) =>
          prev ? [...prev, ...suggestions] : suggestions
        );
        if (moreAvailable) setPage((prev) => prev + 1);
      } else if (!suggestions || suggestions.length === 0) {
        if (page === 1) setFriendSuggestions([]);
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
  }, [loading, hasMore, page]);

  useEffect(() => {
    if (!friendSuggestions) fetchSuggestions();
  }, [friendSuggestions, fetchSuggestions]);

  const handleConnect = async (suggestionId: string) => {
    setConnectingIds((prev) => [...prev, suggestionId]);

    try {
      const token = await getToken();
      const response = await axiosInstance.post(
        `/adda/request/${suggestionId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setFriendSuggestions((prev) =>
          prev
            ? prev.filter((suggestion) => suggestion._id !== suggestionId)
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
          if (entries[0].isIntersecting) fetchSuggestions();
        },
        { threshold: 0.5 }
      );
      if (node) suggestionsObserver.current.observe(node);
    },
    [loading, hasMore, fetchSuggestions]
  );

  return (
    <FriendSuggestionContext.Provider
      value={{
        friendSuggestions,
        handleConnect,
        lastSuggestionRef,
        connectingIds,
      }}
    >
      {children}
    </FriendSuggestionContext.Provider>
  );
};

export const useFriendSuggestions = () => {
  const context = useContext(FriendSuggestionContext);
  if (!context)
    throw new Error(
      "useFriendSuggestions must be used within a FriendSuggestionProvider"
    );
  return context;
};
