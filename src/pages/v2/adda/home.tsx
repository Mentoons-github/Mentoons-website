import AddPosts from "@/components/adda/home/addPosts/addPosts";
import Posts from "@/components/adda/home/addPosts/posts/posts";

const AddaHome = () => {
  return (
    <>
      <div className="bg-white rounded-bl-lg rounded-br-lg shadow-sm sticky top-[200px] z-[10]">
        <AddPosts />
      </div>
      <div className="w-full mb-16 bg-white rounded-bl-lg rounded-br-lg">
        <Posts />
      </div>
    </>
  );
};

export default AddaHome;
