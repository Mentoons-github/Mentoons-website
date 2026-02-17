import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import PostCard, { PostData } from "./PostCard";
import { useStatusModal } from "@/context/adda/statusModalContext";

interface PaginationData {
  total?: number;
  page: number;
  pages?: number;
  limit: number;
  hasMore?: boolean;
}

interface FeedProps {
  latestPost?: boolean;
  onFetchComplete?: () => void;
}

const POSTS_PER_PAGE = 5;

const Feed = ({ latestPost, onFetchComplete }: FeedProps) => {
  const { getToken } = useAuth();

  const [userFeeds, setUserFeeds] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  const { showStatus } = useStatusModal();

  const fetchUserFeeds = useCallback(
    async (pageNum: number, reset = false) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      if (pageNum === 1) {
        setIsLoading(true);
        setError(null);
      }

      try {
        const token = await getToken();

        const { data } = await axios.get(
          `${import.meta.env.VITE_PROD_URL}/feeds`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { page: pageNum, limit: POSTS_PER_PAGE },
          },
        );

        if (!data.success) throw new Error("Failed to fetch feeds");

        const newPosts: PostData[] = data.data;
        const pagination: PaginationData = data.pagination;

        setHasMore(
          pagination?.hasMore ??
            (pagination.page && pagination.pages
              ? pagination.page < pagination.pages
              : newPosts.length === POSTS_PER_PAGE),
        );

        setUserFeeds((prev) => {
          if (reset) return newPosts;

          const existingIds = new Set(prev.map((p) => p._id));
          const filtered = newPosts.filter(
            (post) => !existingIds.has(post._id),
          );

          return [...prev, ...filtered];
        });

        if (pageNum === 1 && onFetchComplete) {
          onFetchComplete();
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const data = err.response?.data as { message?: string };
          setError(data?.message || "Failed to load feed");
        } else {
          setError("Failed to load feed");
        }
      } finally {
        isFetchingRef.current = false;
        setIsLoading(false);
      }
    },
    [getToken, onFetchComplete],
  );

  useEffect(() => {
    fetchUserFeeds(1, true);
  }, []);

  const removeUserPosts = (blockedUserId: string) => {
    setUserFeeds((prev) =>
      prev.filter((post) => post.user._id !== blockedUserId),
    );
  };

  useEffect(() => {
    if (!latestPost) return;

    setPage(1);
    setHasMore(true);
    fetchUserFeeds(1, true);
  }, [latestPost]);

  useEffect(() => {
    if (page > 1) {
      fetchUserFeeds(page);
    }
  }, [page]);

  useEffect(() => {
    if (!loaderRef.current) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          hasMore &&
          !isLoading &&
          !isFetchingRef.current
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "150px" },
    );

    observerRef.current.observe(loaderRef.current);

    return () => observerRef.current?.disconnect();
  }, [hasMore, isLoading]);

  const handleDelete = async (postId: string) => {
    try {
      const token = await getToken();

      const response = await axios.delete(
        `${import.meta.env.VITE_PROD_URL}/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success === true) {
        setUserFeeds((prev) => prev.filter((p) => p._id !== postId));
        showStatus("success", "Post deleted successfully.");
      } else {
        showStatus("error", "Failed to delete post.");
      }
    } catch (err: unknown) {
      console.error("Error deleting post:", err);

      if (axios.isAxiosError(err)) {
        showStatus(
          "error",
          err.response?.data?.message ?? "Failed to delete post.",
        );
      } else {
        showStatus("error", "Something went wrong.");
      }
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center py-10">
        <p className="text-red-600">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded"
          onClick={() => fetchUserFeeds(1, true)}
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading && userFeeds.length === 0) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-10 h-10 border-4 border-orange-300 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoading && userFeeds.length === 0) {
    return <div className="text-center py-10 text-gray-500">No posts yet</div>;
  }

  /* ---------------- RENDER ---------------- */

  return (
    <div className="flex flex-col gap-4 w-full">
      {userFeeds.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onDelete={handleDelete}
          onUserBlocked={(blockedUserId: string) =>
            removeUserPosts(blockedUserId)
          }
        />
      ))}

      {hasMore && (
        <div ref={loaderRef} className="py-6 flex justify-center">
          <div className="w-8 h-8 border-4 border-orange-300 border-t-orange-500 rounded-full animate-spin" />
        </div>
      )}

      {!hasMore && (
        <div className="text-center py-4 text-gray-400">
          You’ve reached the end
        </div>
      )}
    </div>
  );
};

export default Feed;
