import MentoonsAddaLeftSidebar from "@/components/MentoonsAdda/MentoonsAddaLeftSidebar";
import MentoonsAddaMainContent from "@/components/MentoonsAdda/MentoonsAddaMainContent";
import MentoonsAddaRightSidebar from "@/components/MentoonsAdda/MentoonsAddaRightSidebar";

const MentoonsAdda = () => {
  return (
    <div className=" relative border border-red-500 h-screen flex  ">
      <MentoonsAddaLeftSidebar />
      <MentoonsAddaMainContent />
      <MentoonsAddaRightSidebar />
    </div>
  );
};

export default MentoonsAdda;
