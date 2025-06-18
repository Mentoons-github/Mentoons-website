import WelcomeModal from "@/components/adda/welcome/welcome";
import { useAuth } from "@clerk/clerk-react";

import PostsContainer from "@/components/adda/home/addPosts/index";
import { useEffect, useState } from "react";

const AddaHome = () => {
  const { isSignedIn } = useAuth();
  const [showModal, setShowModal] = useState(false);

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
      <PostsContainer/>
    </>
  );
};

export default AddaHome;
