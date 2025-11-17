import { motion } from "framer-motion";
import { Vote, Users, CheckCircle2 } from "lucide-react";
import { Poll } from "@/types";

interface PollStatsProps {
  polls: Poll[];
}

const PollStats: React.FC<PollStatsProps> = ({ polls }) => {
  const currentUserId = "currentUserId";

  const hasUserVoted = (poll: Poll) =>
    poll.options.some((option) => option.voters.includes(currentUserId));

  return (
    <>
      {polls.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 font-medium">Total Polls</p>
                <p className="text-3xl font-bold">{polls.length}</p>
              </div>
              <Vote size={40} className="text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 font-medium">Total Votes</p>
                <p className="text-3xl font-bold">
                  {polls.reduce(
                    (sum, poll) =>
                      sum + poll.options.reduce((s, opt) => s + opt.votes, 0),
                    0
                  )}
                </p>
              </div>
              <Users size={40} className="text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 font-medium">Your Votes</p>
                <p className="text-3xl font-bold">
                  {polls.filter((poll) => hasUserVoted(poll)).length}
                </p>
              </div>
              <CheckCircle2 size={40} className="text-orange-200" />
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default PollStats;