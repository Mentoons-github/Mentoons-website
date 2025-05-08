import { useState } from "react";
import Feed from "./Feed";
import { PostData } from "./PostCard";
import AddPosts from "./addPosts";

const PostsContainer = () => {
  // Sample post data for demonstration
  const [posts, setPosts] = useState<any[]>([
    {
      id: "1",
      type: "text",
      title: "Text Only Post",
      description:
        "This is a simple text-only post. Sometimes you just need to share your thoughts without any media.",
      postUrl: "https://example.com/posts/1",
      author: {
        name: "Hardik",
        role: "Teacher at Divim Technology",
        profilePicture:
          "/assets/adda/profilePictures/pexels-stefanstefancik-91227.jpg",
      },
      timestamp: "25 Nov at 12:24 PM",
      likes: [{ _id: "1" }],
      comments: [{ _id: "1" }],
      shares: [{ _id: "1" }],
      saves: 2,
    },
    {
      id: "2",
      type: "photo",
      title: "Parenting Advice",
      description:
        "Showing anger, frustration, insecurity in situations does not have good impression on the child. Parents should think before they react to any situation specially in front of their children learn from there behavior and so parents have to be good role models for them.",
      postUrl: "https://example.com/posts/2",
      mediaUrl: "/assets/adda/post/8.jpg",
      author: {
        name: "Riya",
        role: "Parenting Coach",
        profilePicture:
          "/assets/adda/profilePictures/pexels-stefanstefancik-91227.jpg",
      },
      timestamp: "24 Nov at 10:15 AM",
      likes: [{ _id: "1" }],
      comments: [{ _id: "1" }],
      shares: [{ _id: "1" }],
      saves: 10,
    },
    {
      id: "3",
      type: "video",
      title: "Child Development Tips",
      description:
        "Check out this helpful video on child development milestones and how to encourage healthy growth.",
      postUrl: "https://example.com/posts/3",
      mediaUrl: "https://example.com/video.mp4", // Replace with actual video URL
      thumbnailUrl: "/assets/adda/post/video-thumbnail.jpg", // Replace with actual thumbnail
      author: {
        name: "Dr. Sharma",
        role: "Child Psychologist",
        profilePicture:
          "/assets/adda/profilePictures/pexels-stefanstefancik-91227.jpg",
      },
      timestamp: "23 Nov at 3:45 PM",
      likes: [{ _id: "1" }],
      comments: [{ _id: "1" }],
      shares: [{ _id: "1" }],
      saves: 25,
    },
    {
      id: "3",
      type: "event",
      title: "Child Development Tips",
      description:
        "Check out this helpful video on child development milestones and how to encourage healthy growth.",
      postUrl: "https://example.com/posts/3",
      mediaUrl: "https://example.com/video.mp4", // Replace with actual video URL
      thumbnailUrl: "/assets/adda/post/video-thumbnail.jpg", // Replace with actual thumbnail
      author: {
        name: "Dr. Sharma",
        role: "Child Psychologist",
        profilePicture:
          "/assets/adda/profilePictures/pexels-stefanstefancik-91227.jpg",
      },
      timestamp: "23 Nov at 3:45 PM",
      likes: [{ _id: "1" }],
      comments: [{ _id: "1" }],
      shares: [{ _id: "1" }],
      saves: 25,
    },
    {
      _id: "3",
      type: "article",
      title: "Child Development Tips",
      description:
        "Check out this helpful video on child development milestones and how to encourage healthy growth.",
      postUrl: "https://example.com/posts/3",
      mediaUrl: "https://example.com/video.mp4", // Replace with actual video URL
      thumbnailUrl: "/assets/adda/post/video-thumbnail.jpg", // Replace with actual thumbnail
      author: {
        name: "Dr. Sharma",
        role: "Child Psychologist",
        profilePicture:
          "/assets/adda/profilePictures/pexels-stefanstefancik-91227.jpg",
      },
      timestamp: "23 Nov at 3:45 PM",
      likes: [{ _id: "1" }],
      comments: [{ _id: "1" }],
      shares: [{ _id: "1" }],
      saves: 25,
    },
  ]);

  const handleNewPost = (newPost: PostData) => {
    // Add new post at the beginning of the posts array
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="flex flex-col w-full gap-6">
      <AddPosts
        onPostCreated={(post) => {
          // Ensure coverImage is a string if article exists
          const newPost: any = {
            ...post,
            article: post.article
              ? {
                  ...post.article,
                  coverImage: post.article.coverImage || "", // Provide default empty string if undefined
                }
              : undefined,
          };
          handleNewPost(newPost);
        }}
      />
      <Feed />
    </div>
  );
};

export default PostsContainer;
