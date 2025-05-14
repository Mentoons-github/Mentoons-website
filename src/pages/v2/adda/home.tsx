import AddPosts from "@/components/adda/home/addPosts/addPosts";
import Posts from "@/components/adda/home/addPosts/posts/posts";
import { useEffect } from "react";

const AddaHome = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="sticky top-[176px] sm:top-[184px] md:top-[200px] z-[5] bg-white rounded-br-lg shadow-sm rounded-bl-lg">
        <AddPosts />
      </div>
      <div className="w-full mb-16 bg-white rounded-bl-lg rounded-br-lg">
        <Posts />
      </div>
    </>
  );
};

export default AddaHome;
