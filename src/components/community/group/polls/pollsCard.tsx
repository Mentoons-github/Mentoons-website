import { motion } from "framer-motion";
import {
  Users,
  Edit3,
  Clock,
  CheckCircle2,
  Vote,
  Eye,
  Zap,
  AlertCircle,
  TrendingUp,
  Share2,
  BarChart3,
} from "lucide-react";
import { AppDispatch } from "@/redux/store";
import { votePoll, fetchGroupById } from "@/api/groups/groupsApi";
import { Poll } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

interface PollCardProps {
  poll: Poll;
  groupId: string;
  dispatch: AppDispatch;
  variants: {
    hidden: { opacity: number; x: number };
    visible: { opacity: number; x: number };
  };
}

const PollCard: React.FC<PollCardProps> = ({
  poll,
  groupId,
  dispatch,
  variants,
}) => {
  const { getToken } = useAuth();
  const currentUserId = "currentUserId";

  const hasUserVoted = (poll: Poll) =>
    poll.options.some((option) => option.voters.includes(currentUserId));

  const getUserVotes = (poll: Poll) =>
    poll.options
      .filter((option) => option.voters.includes(currentUserId))
      .map((option) => option.text);

  const canShowResults = (poll: Poll) =>
    poll.viewResults === "immediately" ||
    (poll.viewResults === "afterEnd" &&
      poll.expiresAt &&
      new Date(poll.expiresAt) <= new Date());

  const getTimeRemaining = (expiresAt?: string) => {
    if (!expiresAt) return null;

    const now = new Date();
    const diff = new Date(expiresAt).getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const handleVote = async (pollId: string, optionText: string) => {
    if (!groupId) return;

    const optionIndex = poll.options.findIndex(
      (opt) => opt.text === optionText
    );
    if (optionIndex >= 0) {
      try {
        const token = await getToken();
        if (!token) {
          console.error("User is not authenticated");
          toast.warning("User is not authenticated");
          return;
        }
        await dispatch(
          votePoll({ groupId, pollId, voterId: currentUserId, optionIndex })
        ).unwrap();
        await dispatch(fetchGroupById({ groupId, token })).unwrap();
      } catch (err) {
        console.error("Failed to vote:", err);
      }
    }
  };

  const showResults = canShowResults(poll);
  const isExpired = poll.expiresAt && new Date(poll.expiresAt) <= new Date();
  const userVotes = getUserVotes(poll);
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <motion.div
      variants={variants}
      className={`bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden ${
        isExpired ? "opacity-75" : ""
      }`}
      whileHover={{
        y: -5,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  poll.category === "Schedule"
                    ? "bg-blue-100 text-blue-700"
                    : poll.category === "Topic"
                    ? "bg-green-100 text-green-700"
                    : poll.category === "Activity"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {poll.category}
              </span>
              {poll.isAnonymous && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                  Anonymous
                </span>
              )}
              {poll.allowMultipleVotes && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                  Multi-vote
                </span>
              )}
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-3 leading-tight">
              {poll.title}
            </h3>

            {poll.description && (
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                {poll.description}
              </p>
            )}

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span className="font-semibold">{totalVotes} votes</span>
              </div>
              <div className="flex items-center gap-2">
                <Edit3 size={18} />
                <span>by {poll.createdBy}</span>
              </div>
              {poll.expiresAt && (
                <div
                  className={`flex items-center gap-2 ${
                    isExpired ? "text-red-500" : "text-orange-500"
                  }`}
                >
                  <Clock size={18} />
                  <span className="font-semibold">
                    {getTimeRemaining(poll.expiresAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {hasUserVoted(poll) && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-200"
            >
              <CheckCircle2 size={20} />
              <span className="font-bold">Voted</span>
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          {poll.options.map((option, optionIndex) => {
            const percentage =
              totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            const isUserChoice = userVotes.includes(option.text);
            const canVote =
              !isExpired && (!hasUserVoted(poll) || poll.allowMultipleVotes);

            return (
              <motion.div
                key={optionIndex}
                whileHover={canVote ? { scale: 1.02, x: 5 } : {}}
                className={`relative overflow-hidden rounded-2xl border-2 transition-all cursor-pointer ${
                  isExpired
                    ? "opacity-60"
                    : hasUserVoted(poll)
                    ? isUserChoice
                      ? "border-orange-400 bg-gradient-to-r from-orange-50 to-yellow-50"
                      : "border-gray-200 bg-gray-50"
                    : "border-gray-200 hover:border-orange-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50"
                }`}
                onClick={() => canVote && handleVote(poll._id!, option.text)}
              >
                {showResults && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{
                      duration: 1.2,
                      delay: optionIndex * 0.1,
                      ease: "easeOut",
                    }}
                    className={`absolute inset-y-0 left-0 ${
                      isUserChoice
                        ? "bg-gradient-to-r from-orange-400 to-yellow-400"
                        : "bg-gradient-to-r from-gray-300 to-gray-200"
                    } opacity-20`}
                  />
                )}

                <div className="relative p-5 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {canVote && !hasUserVoted(poll) && (
                      <div className="w-5 h-5 border-2 border-gray-400 rounded-full group-hover:border-orange-500 transition-colors" />
                    )}
                    {hasUserVoted(poll) && isUserChoice && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      >
                        <CheckCircle2 size={24} className="text-orange-600" />
                      </motion.div>
                    )}
                    {hasUserVoted(poll) && !isUserChoice && (
                      <div className="w-5 h-5 border-2 border-gray-400 rounded-full" />
                    )}
                    <span
                      className={`font-semibold text-lg ${
                        hasUserVoted(poll) && isUserChoice
                          ? "text-orange-700"
                          : "text-gray-700"
                      }`}
                    >
                      {option.text}
                    </span>
                  </div>

                  {showResults && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: optionIndex * 0.1 + 0.5 }}
                      className="flex items-center gap-3"
                    >
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-800">
                          {option.votes}
                        </div>
                        <div className="text-sm text-gray-500">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{
                            duration: 1,
                            delay: optionIndex * 0.1 + 0.3,
                          }}
                          className={`h-full ${
                            isUserChoice
                              ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                              : "bg-gray-400"
                          }`}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          {!hasUserVoted(poll) && !isExpired && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3 text-gray-600">
                <Vote size={20} />
                <span className="font-medium">
                  {poll.allowMultipleVotes
                    ? "Select up to 2 options"
                    : "Click on an option to vote"}
                </span>
              </div>
              {!showResults && (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <Eye size={16} />
                  <span className="text-sm font-medium">
                    Results shown after poll closes
                  </span>
                </div>
              )}
            </motion.div>
          )}

          {hasUserVoted(poll) && poll.allowMultipleVotes && !isExpired && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 text-orange-600"
            >
              <Zap size={20} />
              <span className="font-medium">
                You can still change your votes (selected: {userVotes.length}/2)
              </span>
            </motion.div>
          )}

          {isExpired && (
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle size={20} />
              <span className="font-medium">This poll has expired</span>
            </div>
          )}

          {showResults && totalVotes > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp size={20} className="text-orange-600" />
                  <span className="font-semibold text-orange-800">
                    {poll.options.sort((a, b) => b.votes - a.votes)[0].text}
                  </span>
                  <span className="text-orange-600">is leading</span>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-orange-600 hover:text-orange-800 transition-colors">
                    <Share2 size={16} />
                    <span className="font-medium">Share</span>
                  </button>
                  <button className="flex items-center gap-2 text-orange-600 hover:text-orange-800 transition-colors">
                    <BarChart3 size={16} />
                    <span className="font-medium">Analytics</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PollCard;
