import PostCard, { PostData } from "./PostCard";

interface FeedProps {
  posts: PostData[];
  onPostsChange?: (posts: PostData[]) => void;
}

const Feed = ({ posts }: FeedProps) => {
  // Sample comments for the first post
  const sampleComments = [
    {
      id: 1,
      text: "Great post!",
      author: {
        name: "Sam",
        profilePicture:
          "/assets/adda/profilePictures/pexels-stefanstefancik-91227.jpg",
      },
    },
    {
      id: 2,
      text: "Very informative",
      author: {
        name: "Alex",
        profilePicture:
          "/assets/adda/profilePictures/pexels-stefanstefancik-91227.jpg",
      },
    },
    {
      id: 3,
      text: "Thanks for sharing this!",
      author: {
        name: "Jordan",
        profilePicture:
          "/assets/adda/profilePictures/pexels-stefanstefancik-91227.jpg",
      },
    },
  ];

  return (
    <div className="flex flex-col w-full gap-6">
      {posts?.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          initialComments={post._id === "1" ? sampleComments : []}
        />
      ))}
    </div>
  );
};

export default Feed;
