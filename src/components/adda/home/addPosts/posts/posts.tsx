import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import Feed from "../Feed";
import { PostData } from "../PostCard";

const Posts = () => {
  const [posts, setPosts] = useState<PostData[]>([]);

  const user = useUser();
  console.log(user);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get("http://localhost:4000/api/v1/posts");//todo:change this to be the feed.
      console.log(response.data.data);
      setPosts(response.data.data);
    };
    fetchPosts();
  }, []);
  return (
    <div className="flex flex-col items-center justify-start w-full gap-5">
      <Feed posts={posts} />
    </div>
  );
};

export default Posts;
