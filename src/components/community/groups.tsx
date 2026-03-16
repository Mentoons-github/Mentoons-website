import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { clearGroupReduces } from "@/redux/community/groupSlice";
import { joinGroupThunk } from "@/redux/community/groupsThunk";
import { Group } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";

const GroupsSection = ({
  groups,
  loading,
  error,
  refetch,
}: {
  groups: { joinedGroups: Group[]; suggestedGroups: Group[] };
  loading?: boolean;
  error?: string | null;
  refetch: () => void;
}) => {
  const scrollContainer = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const {
    message,
    joinSuccess,
    error: joinError,
  } = useAppSelector((state) => state.groups);
  const { getToken } = useAuth();

  useEffect(() => {
    if (joinSuccess) {
      toast.success(message);
      dispatch(clearGroupReduces());
    }
    if (joinError) {
      toast.error(joinError);
      dispatch(clearGroupReduces());
    }
  }, [dispatch, joinError, joinSuccess, message]);

  const scrollLeft = () => {
    scrollContainer.current?.scrollBy({ left: -250, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainer.current?.scrollBy({ left: 250, behavior: "smooth" });
  };

  const handleJoin = async (groupId: string) => {
    const token = await getToken();
    if (!token) return;
    dispatch(joinGroupThunk({ groupId, token }));
  };

  return (
    <div className="my-12 space-y-16">
      {/* ---------------- JOINED GROUPS ---------------- */}
      <h1 className="text-3xl font-bold mb-6">Your Groups</h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-xl bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="w-full bg-red-50 border border-red-200 text-red-600 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Failed to load groups</h2>
          <p className="text-sm">{error}</p>

          <button
            onClick={refetch}
            className="mt-4 px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Retry
          </button>
        </div>
      ) : groups.joinedGroups.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {groups.joinedGroups.map(({ _id, name, profileImage, members }) => (
            <NavLink
              key={_id}
              to={`/community/group/${_id}`}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-xl transition"
            >
              <img src={profileImage} className="w-14 h-14 rounded-full mb-2" />
              <h2 className="text-sm font-semibold text-center">{name}</h2>
              <p className="text-xs text-gray-400">{members?.length} Members</p>

              <span className="mt-2 text-xs text-green-600 font-medium">
                Joined
              </span>
            </NavLink>
          ))}
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-400">You haven't joined any groups</p>
        </div>
      )}

      {/* ---------------- SUGGESTED GROUPS ---------------- */}
      <div>
        <h1 className="text-3xl font-bold mb-6">Suggested Groups</h1>

        {loading ? (
          <div className="flex gap-6 overflow-x-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-56 h-44 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : groups.suggestedGroups.length > 0 ? (
          <div className="relative">
            <button
              onClick={scrollLeft}
              className="absolute -left-6 top-1/3 rounded-full border w-10 h-10 flex items-center justify-center bg-white shadow"
            >
              <ChevronLeft />
            </button>

            <button
              onClick={scrollRight}
              className="absolute -right-6 top-1/3 rounded-full border w-10 h-10 flex items-center justify-center bg-white shadow"
            >
              <ChevronRight />
            </button>

            <div
              ref={scrollContainer}
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
            >
              {groups.suggestedGroups.map(
                ({ name, _id, profileImage, members }) => (
                  <div
                    key={_id}
                    className="w-56 bg-white shadow-md rounded-xl p-5 flex flex-col items-center flex-shrink-0 hover:shadow-xl transition"
                  >
                    <img
                      src={profileImage}
                      className="w-14 h-14 rounded-full mb-3"
                    />

                    <h2 className="text-sm font-semibold text-center">
                      {name}
                    </h2>

                    <p className="text-xs text-gray-400 mb-3">
                      {members?.length} Members
                    </p>

                    <button
                      onClick={() => handleJoin(_id as string)}
                      className="w-full border border-orange-500 text-orange-500 rounded-lg py-1 text-sm hover:bg-orange-500 hover:text-white transition"
                    >
                      Join
                    </button>
                  </div>
                ),
              )}
            </div>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-400">No suggested groups available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupsSection;
