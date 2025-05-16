import { useAuth } from "@clerk/clerk-react";
import axios, { AxiosError } from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import PostCard, { PostData } from "./PostCard";

interface PaginationData {
  total?: number;
  page: number;
  pages?: number;
  limit: number;
  hasMore?: boolean;
}

const Feed = () => {
  const { getToken } = useAuth();
  const [userFeeds, setUserFeeds] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const POSTS_PER_PAGE = 5;

  const fetchUserFeeds = useCallback(
    async (pageNum: number) => {
      if (pageNum === 1) {
        setIsLoading(true);
        setError(null);
      }

      try {
        const token = await getToken();
        const response = await axios.get(
          `${import.meta.env.VITE_PROD_URL}/feeds`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { page: pageNum, limit: POSTS_PER_PAGE },
          }
        );

        if (response.data.success) {
          const newPosts = response.data.data;
          const pagination: PaginationData = response.data.pagination;

          if (pagination.hasMore !== undefined) {
            setHasMore(pagination.hasMore);
          } else if (pagination.page && pagination.pages) {
            setHasMore(pagination.page < pagination.pages);
          } else if (newPosts.length < POSTS_PER_PAGE) {
            setHasMore(false);
          }

          setUserFeeds((prev) =>
            pageNum === 1 ? newPosts : [...prev, ...newPosts]
          );
        } else {
          setError("Failed to load feed data");
        }
      } catch (error: unknown) {
        console.error("Error fetching user feeds:", error);
        if (error instanceof AxiosError) {
          setError(error.response?.data?.message || "Failed to load feed");
        } else {
          setError("Failed to load feed");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [getToken]
  );

  useEffect(() => {
    fetchUserFeeds(1);
  }, [fetchUserFeeds]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.5 }
    );

    observerRef.current = observer;

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading]);

  useEffect(() => {
    if (page > 1) {
      fetchUserFeeds(page);
    }
  }, [page, fetchUserFeeds]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-10 text-center">
        <p className="text-lg text-red-600">Error: {error}</p>
        <button
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
          onClick={() => fetchUserFeeds(1)}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isLoading && userFeeds.length === 0) {
    return (
      <div className="flex items-center justify-center w-full py-10">
        <div className="w-10 h-10 border-4 border-orange-300 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (userFeeds.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-10 text-center">
        <p className="text-lg text-gray-600">No posts to show yet.</p>
        <p className="text-sm text-gray-500">Be the first to create a post!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-4">
      {userFeeds.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {hasMore && (
        <div
          ref={loadingRef}
          className="flex items-center justify-center w-full py-4"
        >
          <div className="w-8 h-8 border-4 border-orange-300 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      )}

      {!hasMore && userFeeds.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          You've reached the end of the feed
        </div>
      )}
    </div>
  );
};

export default Feed;
