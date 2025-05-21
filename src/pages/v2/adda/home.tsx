import AddPosts from "@/components/adda/home/addPosts/addPosts";
import Posts from "@/components/adda/home/addPosts/posts/posts";
import { useState } from "react";

const AddaHome = () => {
  const [newPost, setNewPost] = useState(false);
  return (
    <>
      <div className="bg-white rounded-bl-lg rounded-br-lg shadow-sm z-[10]">
        <AddPosts setNewPost={setNewPost} />
      </div>
      <div className="w-full mb-16 bg-white rounded-bl-lg rounded-br-lg">
        <Posts newPost={newPost} />
      </div>
    </>
  );
};

export default AddaHome;
