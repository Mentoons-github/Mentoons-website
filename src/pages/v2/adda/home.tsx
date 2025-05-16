import { useEffect, useRef } from "react";
import AddPosts from "@/components/adda/home/addPosts/addPosts";
import Posts from "@/components/adda/home/addPosts/posts/posts";

const AddaHome = () => {
  const postsRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="sticky top-[68px] z-[5] bg-white rounded-br-lg shadow-sm rounded-bl-lg">
        <AddPosts />
      </div>

      <div
        ref={postsRef}
        className="w-full mb-16 bg-white rounded-bl-lg rounded-br-lg"
      >
        <Posts />
      </div>
    </>
  );
};

export default AddaHome;
