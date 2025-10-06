import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchGroupById } from "@/api/groups/groupsApi";
import PollHeader from "@/components/community/group/polls/pollHeader";
import PollList from "@/components/community/group/polls/pollsList";
import PollStats from "@/components/community/group/polls/pollStats";
import { useAuth } from "@clerk/clerk-react";

interface GroupPollsProps {
  groupId: string;
}

const GroupPolls: React.FC<GroupPollsProps> = ({ groupId }) => {
  const { getToken } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedGroup, loading, error } = useSelector(
    (state: RootState) => state.groups
  );
  const polls = selectedGroup?.polls || [];
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("Active");

  const categories = [
    "All",
    "Schedule",
    "Topic",
    "Activity",
    "General",
    "Decision",
    "Feedback",
  ];

  const handleFetchGroup = async (groupId: string) => {
    const token = await getToken();

    if (groupId && token) {
      console.log(groupId, token);
      dispatch(fetchGroupById({ groupId, token }));
    }
  };
  const statuses = ["All", "Active", "Voted", "Expired"];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading polls...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Error Loading Polls
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => handleFetchGroup(groupId)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!selectedGroup) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Group not found</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-6xl mx-auto p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <PollHeader
        showCreatePoll={showCreatePoll}
        setShowCreatePoll={setShowCreatePoll}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        categories={categories}
        statuses={statuses}
      />
      <PollList
        polls={polls}
        groupId={groupId}
        searchTerm={searchTerm}
        filterCategory={filterCategory}
        filterStatus={filterStatus}
        showCreatePoll={showCreatePoll}
        setShowCreatePoll={setShowCreatePoll}
      />
      <PollStats polls={polls} />
    </motion.div>
  );
};

export default GroupPolls;
