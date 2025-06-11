import AddPosts from "@/components/adda/home/addPosts/addPosts";
import WelcomeModal from "@/components/adda/welcome/welcome";
import { useAuth } from "@clerk/clerk-react";

import Posts from "@/components/adda/home/addPosts/posts/posts";
import { useEffect, useState } from "react";

const AddaHome = () => {
  const { isSignedIn } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("welcomeModalShown");

    if (!isSignedIn && !alreadyShown) {
      setShowModal(true);
      sessionStorage.setItem("welcomeModalShown", "true");
    }
  }, [isSignedIn]);

  return (
    <>
      {!isSignedIn && showModal && (
        <WelcomeModal onClose={() => setShowModal(false)} />
      )}
      <AddPosts setNewPost={setNewPost} />
      <Posts newPost={newPost} />
    </>
  );
};

export default AddaHome;
