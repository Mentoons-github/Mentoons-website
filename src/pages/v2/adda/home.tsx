import WelcomeModal from "@/components/adda/welcome/welcome";
import { useAuth } from "@clerk/clerk-react";
import PostsContainer from "@/components/adda/home/addPosts/index";
import { useEffect, useState } from "react";

const AddaHome = () => {
  const { isSignedIn } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isSignedIn) return;

    const alreadyShown = sessionStorage.getItem("welcomeModalShown");
    if (alreadyShown) return;

    const timer = setTimeout(() => {
      setShowModal(true);
      sessionStorage.setItem("welcomeModalShown", "true");
    }, 3000);

    return () => clearTimeout(timer);
  }, [isSignedIn]);

  return (
    <>
      {!isSignedIn && showModal && (
        <WelcomeModal onClose={() => setShowModal(false)} />
      )}
      <PostsContainer />
    </>
  );
};

export default AddaHome;
