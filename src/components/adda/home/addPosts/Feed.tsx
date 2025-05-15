import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";

const Feed = () => {
  const { getToken } = useAuth();
  const [userFeeds, setUserFeeds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserFeeds = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        const response = await axios.get(
          `${import.meta.env.VITE_PROD_URL}feeds`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log(response.data);
        setUserFeeds(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching user feeds:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserFeeds();
  }, [getToken]);

  if (isLoading) {
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
      {userFeeds?.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
