import ModalPortal from "@/components/common/ModalPortal";
import { useRef, useState } from "react";
import Feed from "./Feed";
import FirstPostModal from "./FirstPostModal";
import { PostData } from "./PostCard";
import AddPosts from "./addPosts";

const PostsContainer = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState(false);
  const [showFirstPostModal, setShowFirstPostModal] = useState(false);
  const [lastPostType, setLastPostType] = useState<
    "text" | "photo" | "video" | "event" | "article" | null
  >(null);
  const addPostsRef = useRef<any>(null);

  // Function to reset newPost state
  const resetNewPost = () => {
    setNewPost(false);
  };

  // Helper to check if first post modal should be shown
  const checkAndShowFirstPostModal = (
    postType: "text" | "photo" | "video" | "event" | "article" | "mixed"
  ) => {
    if (!localStorage.getItem("mentoons_first_post_done")) {
      if (postType === "mixed") {
        setLastPostType("text");
      } else {
        setLastPostType(postType);
      }
      setShowFirstPostModal(true);
      localStorage.setItem("mentoons_first_post_done", "true");
    }
  };

  const handleNewPost = (newPost: PostData) => {
    setPosts([newPost, ...posts]);
    if (posts.length === 0) {
      checkAndShowFirstPostModal(newPost.postType);
    }
  };

  const handleCreateSameTypePost = () => {
    setShowFirstPostModal(false);
    if (lastPostType === "text") {
      return;
    }
    if (
      lastPostType &&
      ["photo", "video", "event", "article"].includes(lastPostType)
    ) {
      if (addPostsRef.current) {
        addPostsRef.current.handlePost(lastPostType);
      }
    }
  };

  return (
    <div className="flex flex-col w-full gap-6">
      <AddPosts
        setLatestPost={setNewPost}
        ref={addPostsRef}
        onPostCreated={(post) => {
          if (!post) {
            console.error("Received undefined or null post");
            return;
          }
          let newPost: any;
          if (post.postType === "text") {
            newPost = { ...post };
          } else if (post.postType === "article" && post.article) {
            newPost = {
              ...post,
              article: {
                ...post.article,
                coverImage: post.article.coverImage || "",
              },
            };
          } else {
            newPost = { ...post };
          }
          handleNewPost(newPost);
        }}
      />
      <Feed latestPost={newPost} onFetchComplete={resetNewPost} />
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