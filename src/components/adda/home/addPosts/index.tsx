import ModalPortal from "@/components/common/ModalPortal";
import { useRef, useState } from "react";
import Feed from "./Feed";
import FirstPostModal from "./FirstPostModal";
import { PostData } from "./PostCard";
import AddPosts from "./addPosts";

const PostsContainer = () => {
  // Use an empty array for posts instead of sample data
  const [posts, setPosts] = useState<any[]>([]);

  const [showFirstPostModal, setShowFirstPostModal] = useState(false);
  // Add state to track the last created post type
  const [lastPostType, setLastPostType] = useState<
    "text" | "photo" | "video" | "event" | "article" | null
  >(null); // Default to null, will be set when a post is created
  const addPostsRef = useRef<any>(null);

  // Helper to check if first post modal should be shown
  const checkAndShowFirstPostModal = (
    postType: "text" | "photo" | "video" | "event" | "article" | "mixed"
  ) => {
    if (!localStorage.getItem("mentoons_first_post_done")) {
      // Only store supported post types
      if (postType === "mixed") {
        setLastPostType("text"); // Default to text for mixed type
      } else {
        setLastPostType(postType);
      }
      setShowFirstPostModal(true);
      localStorage.setItem("mentoons_first_post_done", "true");
    }
  };

  const handleNewPost = (newPost: PostData) => {
    setPosts([newPost, ...posts]);

    // If this is the first post (i.e., posts was empty before adding)
    if (posts.length === 0) {
      checkAndShowFirstPostModal(newPost.postType);
    }
  };

  // Function to handle creating a new post of the same type
  const handleCreateSameTypePost = () => {
    setShowFirstPostModal(false);

    // If it's a text post, focus on the text input
    if (lastPostType === "text") {
      // We'll just close the modal and let the user enter text in the input
      return;
    }

    // For other post types, open the appropriate modal
    if (
      lastPostType &&
      ["photo", "video", "event", "article"].includes(lastPostType)
    ) {
      // Simulate clicking on the post type button
      if (addPostsRef.current) {
        addPostsRef.current.handlePost(lastPostType);
      }
    }
  };

  return (
    <div className="flex flex-col w-full gap-6">
      <AddPosts
        ref={addPostsRef}
        onPostCreated={(post) => {
          // Add null/undefined check before accessing properties
          if (!post) {
            console.error("Received undefined or null post");
            return;
          }

          let newPost: any;

          // Handle different post types differently
          if (post.postType === "text") {
            // For text posts, we don't need to worry about article property
            newPost = { ...post };
          } else if (post.postType === "article" && post.article) {
            // For article posts, ensure coverImage exists
            newPost = {
              ...post,
              article: {
                ...post.article,
                coverImage: post.article.coverImage || "",
              },
            };
          } else {
            // For other post types, just pass through
            newPost = { ...post };
          }

          handleNewPost(newPost);
        }}
      />
      <Feed />
      <ModalPortal isOpen={showFirstPostModal}>
        <FirstPostModal
          onClose={() => setShowFirstPostModal(false)}
          postType={lastPostType}
          onCreateNewPost={handleCreateSameTypePost}
        />
      </ModalPortal>
    </div>
  );
};

export default PostsContainer;
