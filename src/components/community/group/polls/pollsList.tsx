import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { Poll } from "@/types";
import PollCard from "./pollsCard";
import CreatePollModal from "./createPolls";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

interface PollListProps {
  polls: Poll[];
  groupId: string;
  searchTerm: string;
  filterCategory: string;
  filterStatus: string;
  showCreatePoll: boolean;
  setShowCreatePoll: (value: boolean) => void;
}

const PollList: React.FC<PollListProps> = ({
  polls,
  groupId,
  searchTerm,
  filterCategory,
  filterStatus,
  showCreatePoll,
  setShowCreatePoll,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUserId = "currentUserId";

  const hasUserVoted = (poll: Poll) =>
    poll.options.some((option) => option.voters.includes(currentUserId));

  const filteredPolls = polls.filter((poll) => {
    const matchesSearch =
      poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (poll.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false);
    const matchesCategory =
      filterCategory === "All" || poll.category === filterCategory;
    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Active" &&
        poll.isActive &&
        (!poll.expiresAt || new Date(poll.expiresAt) > new Date())) ||
      (filterStatus === "Voted" && hasUserVoted(poll)) ||
      (filterStatus === "Expired" &&
        poll.expiresAt &&
        new Date(poll.expiresAt) <= new Date());

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const pollVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      <div className="space-y-8">
        {filteredPolls.map((poll) => (
          <PollCard
            key={poll._id}
            poll={poll}
            groupId={groupId}
            dispatch={dispatch}
            variants={pollVariants}
          />
        ))}

        {filteredPolls.length === 0 && (
          <motion.div
            variants={pollVariants}
            className="text-center py-20 bg-white rounded-3xl shadow-lg"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <BarChart3 size={80} className="text-gray-300 mx-auto mb-6" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-600 mb-3">
              {searchTerm || filterCategory !== "All" || filterStatus !== "All"
                ? "No polls match your filters"
                : "No polls yet"}
            </h3>
            <p className="text-gray-500 text-lg mb-8">
              {searchTerm || filterCategory !== "All" || filterStatus !== "All"
                ? "Try adjusting your search or filter criteria"
                : "Be the first to create a poll for the group!"}
            </p>
            {!searchTerm &&
              filterCategory === "All" &&
              filterStatus === "All" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreatePoll(true)}
                  className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all"
                >
                  Create Your First Poll
                </motion.button>
              )}
          </motion.div>
        )}
      </div>

      <CreatePollModal
        showCreatePoll={showCreatePoll}
        setShowCreatePoll={setShowCreatePoll}
        groupId={groupId}
        dispatch={dispatch}
      />
    </>
  );
};

export default PollList;