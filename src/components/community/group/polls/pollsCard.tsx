import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Clock,
  CheckCircle2,
  TrendingUp,
  Eye,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { AppDispatch } from "@/redux/store";
import { votePoll, fetchGroupById } from "@/redux/community/groupsThunk";
import { Poll } from "@/types";
import { useAuth, useUser } from "@clerk/clerk-react";
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

const CATEGORY_MAP: Record<string, { bg: string; text: string; dot: string }> =
  {
    Schedule: { bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6" },
    Topic: { bg: "#dcfce7", text: "#15803d", dot: "#22c55e" },
    Activity: { bg: "#fef9c3", text: "#a16207", dot: "#eab308" },
    default: { bg: "#f3e8ff", text: "#7e22ce", dot: "#a855f7" },
  };

const OPTION_PALETTE = ["#6366f1", "#f43f5e", "#0ea5e9", "#f97316", "#8b5cf6"];

const PollCard: React.FC<PollCardProps> = ({
  poll,
  groupId,
  dispatch,
  variants,
}) => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const currentUserId = user?.firstName ?? "currentUser";

  const hasVoted = poll.options.some((o) => o.voters.includes(currentUserId));
  const userVotes = poll.options
    .filter((o) => o.voters.includes(currentUserId))
    .map((o) => o.text);
  const totalVotes = poll.options.reduce((s, o) => s + o.votes, 0);
  const isExpired = !!poll.expiresAt && new Date(poll.expiresAt) <= new Date();
  const showResults =
    poll.viewResults === "immediately" ||
    (poll.viewResults === "afterEnd" && isExpired);

  const topOption = [...poll.options].sort((a, b) => b.votes - a.votes)[0];
  const cat = CATEGORY_MAP[poll.category ?? ""] ?? CATEGORY_MAP.default;

  const timeLeft = (expiresAt?: string) => {
    if (!expiresAt) return null;
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return "Closed";
    const d = Math.floor(diff / 86_400_000);
    const h = Math.floor((diff % 86_400_000) / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    return d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const handleVote = async (pollId: string, optionId: string) => {
    if (!groupId || !optionId) return;
    try {
      const token = await getToken();
      if (!token) {
        toast.warning("Not authenticated");
        return;
      }
      await dispatch(
        votePoll({ groupId, pollId, voterId: currentUserId, optionId }),
      ).unwrap();
      await dispatch(fetchGroupById({ groupId, token })).unwrap();
    } catch (err) {
      console.error("Vote failed:", err);
    }
  };

  return (
    <motion.div
      variants={variants}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.06)",
        opacity: isExpired ? 0.7 : 1,
        fontFamily: "'Geist', 'DM Sans', system-ui, sans-serif",
      }}
      whileHover={{
        y: -3,
        boxShadow: "0 6px 20px rgba(0,0,0,0.09), 0 20px 48px rgba(0,0,0,0.08)",
      }}
      transition={{ duration: 0.22 }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${cat.dot}, ${OPTION_PALETTE[0]})`,
        }}
      />

      <div className="px-7 pt-7 pb-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-3.5">
              <span
                className="inline-flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full tracking-widest uppercase"
                style={{ background: cat.bg, color: cat.text }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: cat.dot }}
                />
                {poll.category ?? "Other"}
              </span>
              {poll.isAnonymous && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full tracking-widest uppercase bg-slate-100 text-slate-500">
                  <ShieldCheck size={12} />
                  Anonymous
                </span>
              )}
              {poll.allowMultipleVotes && (
                <span className="text-xs font-bold px-3.5 py-1.5 rounded-full tracking-widest uppercase bg-amber-50 text-amber-600">
                  Multi-vote
                </span>
              )}
            </div>

            <h3
              className="text-2xl font-semibold text-gray-900 leading-snug mb-2"
              style={{ letterSpacing: "-0.02em" }}
            >
              {poll.title}
            </h3>
            {poll.description && (
              <p className="text-base text-gray-400 leading-relaxed">
                {poll.description}
              </p>
            )}
          </div>

          <AnimatePresence>
            {hasVoted && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
                className="flex-shrink-0 flex flex-col items-center justify-center gap-1 rounded-xl px-3.5 py-3"
                style={{
                  background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                  border: "1.5px solid #86efac",
                }}
              >
                <CheckCircle2 size={22} color="#16a34a" />
                <span className="text-xs font-black tracking-widest uppercase text-green-700">
                  Voted
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-4 mb-5 text-sm text-gray-400 font-medium">
          <span className="flex items-center gap-1.5">
            <Users size={14} />
            {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
          </span>
          <span className="text-gray-200">|</span>
          <span>
            {typeof poll.createdBy === "string"
              ? poll.createdBy
              : poll.createdBy?.name}
          </span>
          {poll.expiresAt && (
            <>
              <span className="text-gray-200">|</span>
              <span
                className="flex items-center gap-1.5 font-semibold"
                style={{ color: isExpired ? "#ef4444" : "#f59e0b" }}
              >
                <Clock size={14} />
                {isExpired ? "Closed" : `${timeLeft(poll.expiresAt)} left`}
              </span>
            </>
          )}
        </div>

        <div className="space-y-3">
          {poll.options.map((option, idx) => {
            const accent = OPTION_PALETTE[idx % OPTION_PALETTE.length];
            const pct = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            const isChosen = userVotes.includes(option.text);
            const canVote =
              !isExpired && (!hasVoted || poll.allowMultipleVotes);

            return (
              <motion.button
                key={idx}
                disabled={!canVote}
                onClick={() => canVote && handleVote(poll._id!, option._id!)}
                whileHover={canVote ? { x: 2, scale: 1.005 } : {}}
                whileTap={canVote ? { scale: 0.985 } : {}}
                transition={{ duration: 0.12 }}
                className="w-full text-left relative overflow-hidden rounded-xl"
                style={{
                  background: isChosen
                    ? "linear-gradient(135deg, #f0fdf4, #dcfce7)"
                    : "#f8fafc",
                  border: isChosen
                    ? "1.5px solid #86efac"
                    : "1.5px solid #e2e8f0",
                  cursor: canVote ? "pointer" : "default",
                  transition: "all 0.18s ease",
                }}
              >
                {showResults && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{
                      duration: 0.85,
                      delay: idx * 0.06,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="absolute inset-y-0 left-0 rounded-xl"
                    style={{
                      background: isChosen
                        ? "linear-gradient(90deg, #bbf7d0, #86efac)"
                        : `${accent}14`,
                    }}
                  />
                )}

                <div className="relative flex items-center justify-between px-4 py-4 gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex-shrink-0">
                      {isChosen ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 26,
                          }}
                        >
                          <CheckCircle2 size={21} color="#16a34a" />
                        </motion.div>
                      ) : (
                        <div
                          className="w-5 h-5 rounded-full border-2"
                          style={{ borderColor: "#cbd5e1" }}
                        />
                      )}
                    </div>

                    <span
                      className="text-base truncate"
                      style={{
                        color: isChosen ? "#14532d" : "#374151",
                        fontWeight: isChosen ? 600 : 400,
                      }}
                    >
                      {option.text}
                    </span>
                  </div>

                  {showResults && (
                    <motion.div
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06 + 0.3 }}
                      className="flex-shrink-0 flex items-center gap-3"
                    >
                      <div className="hidden sm:block w-24 h-2 rounded-full overflow-hidden bg-gray-200">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{
                            duration: 0.75,
                            delay: idx * 0.06 + 0.15,
                          }}
                          className="h-full rounded-full"
                          style={{
                            background: isChosen
                              ? "linear-gradient(90deg, #22c55e, #16a34a)"
                              : accent,
                          }}
                        />
                      </div>
                      <span
                        className="text-base font-bold w-10 text-right tabular-nums"
                        style={{ color: isChosen ? "#15803d" : "#475569" }}
                      >
                        {pct.toFixed(0)}%
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-5 pt-4" style={{ borderTop: "1px solid #f1f5f9" }}>
          {!hasVoted && !isExpired && (
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>
                {poll.allowMultipleVotes
                  ? "Select up to 2 options"
                  : "Tap an option to vote"}
              </span>
              {!showResults && (
                <span className="flex items-center gap-1.5 text-amber-500 font-semibold">
                  <Eye size={14} />
                  Results after close
                </span>
              )}
            </div>
          )}

          {hasVoted && poll.allowMultipleVotes && !isExpired && (
            <p className="text-sm font-semibold" style={{ color: "#7c3aed" }}>
              {userVotes.length}/2 selected · tap another to add
            </p>
          )}

          {isExpired && (
            <div className="flex items-center gap-2 text-sm font-semibold text-red-400">
              <AlertCircle size={15} />
              This poll is now closed
            </div>
          )}

          {showResults && totalVotes > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="mt-4 flex items-center gap-3 px-4 py-3.5 rounded-xl"
              style={{
                background: "linear-gradient(135deg, #fefce8, #fef9c3)",
                border: "1px solid #fde68a",
              }}
            >
              <TrendingUp
                size={16}
                style={{ color: "#d97706", flexShrink: 0 }}
              />
              <span className="text-sm font-semibold text-amber-700 flex-shrink-0">
                Leading
              </span>
              <span className="text-base font-bold text-gray-800 truncate">
                {topOption.text}
              </span>
              <span
                className="ml-auto text-base font-black tabular-nums flex-shrink-0"
                style={{ color: "#d97706" }}
              >
                {totalVotes > 0
                  ? ((topOption.votes / totalVotes) * 100).toFixed(0)
                  : 0}
                %
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PollCard;
