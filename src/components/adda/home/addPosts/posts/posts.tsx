import Feed from "../Feed";

const Posts = ({ newPost }: { newPost: boolean }) => {
  return (
    <div className="flex flex-col items-center justify-start w-full gap-5">
      <Feed newPost={newPost} />
    </div>
  );
};

export default Posts;
