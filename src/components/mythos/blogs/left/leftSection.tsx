import { useEffect, useState } from "react";
import { BLOGS } from "../../../../constant/constants";
import { JoinCardsProps } from "@/types";
import BlogsCard from "../../cards/blogsCard";

const LeftSection = () => {
  const [blogs, setBlogs] = useState<Partial<JoinCardsProps>[] | []>([]);

  useEffect(() => {
    setBlogs(BLOGS.slice(-4));
  }, []);

  return (
    <div className="flex flex-col items-start gap-5 w-full">
      <BlogsCard blogs={blogs} />
    </div>
  );
};

export default LeftSection;
