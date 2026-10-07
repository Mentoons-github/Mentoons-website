import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { AppDispatch } from "@/redux/store";
import { createPoll, fetchGroupById } from "@/redux/community/groupsThunk";
import { Poll } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { useAuthModal } from "@/context/adda/authModalContext";
import { useUser } from "@clerk/clerk-react";

interface CreatePollModalProps {
  showCreatePoll: boolean;
  setShowCreatePoll: (value: boolean) => void;
  groupId: string;
  dispatch: AppDispatch;
}

const CreatePollModal: React.FC<CreatePollModalProps> = ({
  showCreatePoll,
  setShowCreatePoll,
  groupId,
  dispatch,
}) => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const { openAuthModal } = useAuthModal();
  const [newPoll, setNewPoll] = useState({
    title: "",
    description: "",
    options: ["", ""],
    category: "General",
    isAnonymous: false,
    allowMultipleVotes: false,
    viewResults: "immediately" as "immediately" | "afterEnd",
    expiresIn: "",
  });

  const categories = [
    "Schedule",
    "Topic",
    "Activity",
    "General",
    "Decision",
    "Feedback",
  ];

  const addOption = () => {
    if (newPoll.options.length < 8) {
      setNewPoll((prev) => ({
        ...prev,
        options: [...prev.options, ""],
      }));
    }
  };

  const removeOption = (index: number) => {
    if (newPoll.options.length > 2) {
      setNewPoll((prev) => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
      }));
    }
  };

  const updateOption = (index: number, value: string) => {
    setNewPoll((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) => (i === index ? value : opt)),
    }));
  };

  const handleCreatePoll = async () => {
    if (
      newPoll.title.trim() &&
      newPoll.options.filter((opt) => opt.trim()).length >= 2
    ) {
      if (!groupId) return;

      let expiresAt;
      if (newPoll.expiresIn) {
        const hours = parseInt(newPoll.expiresIn);
        expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
      }

      const pollData: Partial<Poll> = {
        title: newPoll.title,
        description: newPoll.description,
        options: newPoll.options
          .filter((opt) => opt.trim())
          .map((text) => ({
            text,
            votes: 0,
            voters: [],
          })),
        createdBy: user?.id,
        expiresAt,
        isActive: true,
        category: newPoll.category,
        isAnonymous: newPoll.isAnonymous,
        allowMultipleVotes: newPoll.allowMultipleVotes,
        viewResults: newPoll.viewResults,
      };

      try {
        const token = await getToken();
        if (!token) {
          openAuthModal("sign-in");
          return;
        }
        await dispatch(createPoll({ groupId, pollData })).unwrap();
        await dispatch(fetchGroupById({ groupId, token })).unwrap();
        setNewPoll({
          title: "",
          description: "",
          options: ["", ""],
          category: "General",
          isAnonymous: false,
          allowMultipleVotes: false,
          viewResults: "immediately",
          expiresIn: "",
        });
        setShowCreatePoll(false);
      } catch (err) {
        console.error("Failed to create poll:", err);
      }
    }
  };

  const optionColors = [
    "border-blue-400 focus:ring-blue-400 bg-blue-50",
    "border-orange-400 focus:ring-orange-400 bg-orange-50",
    "border-green-400 focus:ring-green-400 bg-green-50",
    "border-yellow-400 focus:ring-yellow-400 bg-yellow-50",
    "border-blue-300 focus:ring-blue-300 bg-blue-50",
    "border-orange-300 focus:ring-orange-300 bg-orange-50",
    "border-green-300 focus:ring-green-300 bg-green-50",
    "border-yellow-300 focus:ring-yellow-300 bg-yellow-50",
  ];

  const optionDots = ["🔵", "🟠", "🟢", "🟡", "🔵", "🟠", "🟢", "🟡"];

  return (
    <AnimatePresence>
      {showCreatePoll && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-blue-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(251,146,60,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(74,222,128,0.15) 0%, transparent 50%)",
          }}
          onClick={() => setShowCreatePoll(false)}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 60 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-blue-200"
            style={{
              background:
                "linear-gradient(160deg, #fffbeb 0%, #f0fdf4 50%, #eff6ff 100%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="rounded-t-[1.7rem] px-8 py-6 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #60a5fa 100%)",
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2
                    className="text-3xl font-extrabold text-white drop-shadow-md"
                    style={{
                      fontFamily: "'Fredoka One', 'Nunito', sans-serif",
                      letterSpacing: "0.02em",
                    }}
                  >
                    Make a Poll!
                  </h2>
                  <p className="text-white/90 mt-1 font-semibold text-sm">
                    Ask your friends and vote together!
                  </p>
                </div>
                <button
                  onClick={() => setShowCreatePoll(false)}
                  className="p-2.5 bg-white/20 hover:bg-white/40 rounded-full transition-colors border-2 border-white/40"
                >
                  <X size={22} className="text-white" />
                </button>
              </div>
            </div>

            <div className="px-8 py-6 space-y-5">
              <div>
                <label className="block text-sm font-extrabold text-blue-700 mb-2 flex items-center gap-1">
                  <span>📝</span> What's your question?{" "}
                  <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={newPoll.title}
                  onChange={(e) =>
                    setNewPoll((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g. What should we do this weekend? 🤔"
                  className="w-full px-5 py-4 border-3 border-blue-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-200 bg-blue-50 text-blue-900 font-semibold text-base placeholder-blue-300 transition-all"
                  style={{ borderWidth: "2.5px" }}
                />
              </div>

              <div>
                <label className="block text-sm font-extrabold text-green-700 mb-2 flex items-center gap-1">
                  <span>💬</span> Tell us more{" "}
                  <span className="text-gray-400 font-normal text-xs">
                    (optional)
                  </span>
                </label>
                <textarea
                  value={newPoll.description}
                  onChange={(e) =>
                    setNewPoll((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Add some extra details to help everyone decide..."
                  className="w-full px-5 py-4 border-green-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-200 bg-green-50 text-green-900 font-semibold placeholder-green-300 resize-none transition-all"
                  style={{
                    borderWidth: "2.5px",
                    border: "2.5px solid #86efac",
                  }}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-extrabold text-orange-600 mb-2 flex items-center gap-1">
                    <span>🏷️</span> Category
                  </label>
                  <select
                    value={newPoll.category}
                    onChange={(e) =>
                      setNewPoll((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-200 bg-orange-50 text-orange-800 font-bold transition-all appearance-none cursor-pointer"
                    style={{
                      borderWidth: "2.5px",
                      border: "2.5px solid #fdba74",
                    }}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-blue-600 mb-2 flex items-center gap-1">
                    <span>⏰</span> Ends in (hours)
                  </label>
                  <input
                    type="number"
                    value={newPoll.expiresIn}
                    onChange={(e) =>
                      setNewPoll((prev) => ({
                        ...prev,
                        expiresIn: e.target.value,
                      }))
                    }
                    placeholder="24"
                    min="1"
                    max="168"
                    className="w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-200 bg-blue-50 text-blue-800 font-bold placeholder-blue-300 transition-all"
                    style={{
                      borderWidth: "2.5px",
                      border: "2.5px solid #93c5fd",
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-extrabold text-green-700 mb-3 flex items-center gap-1">
                  <span>🎯</span> Poll Options
                </label>
                <div className="space-y-3">
                  {newPoll.options.map((option, index) => (
                    <motion.div
                      key={index}
                      className="flex gap-3 items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.07,
                        type: "spring",
                        stiffness: 300,
                      }}
                    >
                      <span className="text-xl select-none flex-shrink-0">
                        {optionDots[index]}
                      </span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Choice ${index + 1}... ✏️`}
                        className={`flex-1 px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-4 font-semibold text-gray-700 placeholder-gray-400 transition-all ${optionColors[index]}`}
                      />
                      {newPoll.options.length > 2 && (
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => removeOption(index)}
                          className="p-2.5 text-red-400 hover:bg-red-100 rounded-xl transition-colors flex-shrink-0 border-2 border-red-200"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </div>

                {newPoll.options.length < 8 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={addOption}
                    className="mt-3 w-full py-3.5 border-2 border-dashed border-green-400 rounded-2xl text-green-600 hover:bg-green-50 transition-colors font-extrabold text-base flex items-center justify-center gap-2"
                  >
                    <span className="text-xl">➕</span> Add Another Choice!
                  </motion.button>
                )}
              </div>

              <div
                className="rounded-2xl p-5 space-y-4"
                style={{
                  background:
                    "linear-gradient(135deg, #dbeafe 0%, #dcfce7 100%)",
                  border: "2.5px solid #93c5fd",
                }}
              >
                <h3 className="font-extrabold text-blue-800 text-base flex items-center gap-2">
                  <span>⚙️</span> Poll Settings
                </h3>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={newPoll.allowMultipleVotes}
                        onChange={(e) =>
                          setNewPoll((prev) => ({
                            ...prev,
                            allowMultipleVotes: e.target.checked,
                          }))
                        }
                        className="w-5 h-5 text-orange-500 rounded-lg focus:ring-orange-400 border-orange-300 cursor-pointer"
                      />
                    </div>
                    <span className="font-bold text-orange-700 text-sm group-hover:text-orange-500 transition-colors">
                      🗳️ Let people pick more than one choice
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={newPoll.isAnonymous}
                      onChange={(e) =>
                        setNewPoll((prev) => ({
                          ...prev,
                          isAnonymous: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 text-green-500 rounded-lg focus:ring-green-400 border-green-300 cursor-pointer"
                    />
                    <span className="font-bold text-green-700 text-sm group-hover:text-green-500 transition-colors">
                      🕵️ Keep votes secret (anonymous)
                    </span>
                  </label>

                  <div>
                    <label className="block text-sm font-bold text-blue-700 mb-2 flex items-center gap-1">
                      <span>👀</span> When to show results
                    </label>
                    <select
                      value={newPoll.viewResults}
                      onChange={(e) =>
                        setNewPoll((prev) => ({
                          ...prev,
                          viewResults: e.target.value as
                            | "immediately"
                            | "afterEnd",
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 bg-white text-blue-800 font-bold border-2 border-blue-300 appearance-none cursor-pointer"
                    >
                      <option value="immediately">Right away! ⚡</option>
                      <option value="afterEnd">After the poll closes 🔒</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-2 pb-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowCreatePoll(false)}
                  className="flex-1 py-4 border-3 border-gray-300 rounded-2xl font-extrabold text-gray-600 hover:bg-gray-100 transition-colors text-base"
                  style={{ borderWidth: "2.5px" }}
                >
                  Maybe Later 👋
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleCreatePoll}
                  disabled={
                    !newPoll.title.trim() ||
                    newPoll.options.filter((opt) => opt.trim()).length < 2
                  }
                  className={`flex-1 py-4 rounded-2xl font-extrabold text-base transition-all shadow-lg ${
                    newPoll.title.trim() &&
                    newPoll.options.filter((opt) => opt.trim()).length >= 2
                      ? "text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  style={
                    newPoll.title.trim() &&
                    newPoll.options.filter((opt) => opt.trim()).length >= 2
                      ? {
                          background:
                            "linear-gradient(135deg, #3b82f6 0%, #22c55e 50%, #f97316 100%)",
                          boxShadow: "0 8px 25px rgba(59,130,246,0.4)",
                        }
                      : {}
                  }
                >
                  Let's Go! 🚀
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreatePollModal;
