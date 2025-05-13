import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PostCard from "./PostCard";

const Feed = () => {
  const { getToken } = useAuth();
  const [userFeeds, setUserFeeds] = useState<any[]>([]);
  useEffect(() => {
    const fetchUserFeeds = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(`http://localhost:4000/api/v1/feeds`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserFeeds(response.data.data);
        console.log(response.data.data);
        toast.success("User feeds fetched successfully");
      } catch (error) {
        console.error("Error fetching user feeds:", error);
        toast.error("Error fetching user feeds");
      }
    };
    fetchUserFeeds();
  }, []);
  return (
    <div className="flex flex-col w-full gap-4">
      {userFeeds?.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
