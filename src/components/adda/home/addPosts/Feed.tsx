import PostCard, { PostData } from "./PostCard";

interface FeedProps {
  posts: PostData[];
  onPostsChange?: (posts: PostData[]) => void;
}

const Feed = ({ posts }: FeedProps) => {
  return (
    <div className="flex flex-col w-full gap-6">
      {posts?.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
