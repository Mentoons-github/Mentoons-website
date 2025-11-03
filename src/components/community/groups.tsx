import { Group } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { NavLink } from "react-router-dom";

const GroupsSection = ({ groups }: { groups: Group[] }) => {
  const scrollContainer = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="my-10">
      <h1 className="text-start text-5xl font-bold tracking-wider">
        SUGGESTED GROUPS TO JOIN
      </h1>
      {groups.length > 0 ? (
        <div className="relative  my-10">
          <button
            onClick={scrollLeft}
            className="absolute -left-6 top-1/3 rounded-full border border-gray-400 w-12 h-12 flex items-center justify-center"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={scrollRight}
            className="absolute -right-12 top-1/3 rounded-full border border-gray-400 w-12 h-12 flex items-center justify-center"
          >
            <ChevronRight />
          </button>
          <div
            ref={scrollContainer}
            className="flex items-start justify-start gap-5 overflow-x-auto p-5"
          >
            {groups.map(({ name, _id, profileImage, members }) => (
              <div
                className="w-52 h-56 space-y-3 p-5 rounded-lg shadow-lg flex flex-col items-center flex-shrink-0"
                key={_id}
              >
                <img
                  src={profileImage}
                  className="w-12 h-12 rounded-full mx-auto"
                  alt="image-1"
                />
                <h1 className="text-center text-sm font-medium">{name}</h1>
                <span className="text-gray-400 text-xs">
                  {members?.length} Members
                </span>
                <div className="flex justify-center w-full">
                  <NavLink
                    to={`/community/group/${_id}`}
                    className="rounded-lg border border-orange-500 w-full max-w-[150px] text-center py-1 hover:border-none hover:bg-orange-500 hover:text-white transition-all ease"
                  >
                    Join
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-48 bg-gray-50 rounded-lg">
          <h1 className="text-center text-lg sm:text-xl font-medium text-gray-500">
            No groups available
          </h1>
        </div>
      )}
    </div>
  );
};

export default GroupsSection;
