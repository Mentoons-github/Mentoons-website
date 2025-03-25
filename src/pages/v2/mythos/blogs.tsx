import LeftSection from "@/components/mythos/blogs/left/leftSection";
import RightSection from "@/components/mythos/blogs/right/rigthSection";
import { FaSearch } from "react-icons/fa";

const Blogs = () => {
  return (
    <section className="flex flex-col px-20 py-12 justify-between items-center">
      <div className="flex justify-between items-center w-full">
        <h1 className="font-montserrat text-4xl font-semibold text-[#E39712] tracking-wider">
          EXPAND YOUR KNOWLEDGE
        </h1>
        <div className="bg-orange-200 flex items-center">
          <input
            type="text"
            placeholder="Search Here..."
            id="search"
            className="outline-none border p-3 px-5 font-semibold bg-[#33364F] text-white"
          />
          <button className="w-12 h-12 bg-yellow-400 flex items-center justify-center bg-[#FFC367]">
            <FaSearch />
          </button>
        </div>
      </div>
      <div className="flex justify-between items-start w-full mt-20 gap-4">
        <LeftSection />
        <RightSection />
      </div>
    </section>
  );
};

export default Blogs;
