import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { AppDispatch } from "@/redux/store";
import { createPoll, fetchGroupById } from "@/api/groups/groupsApi";
import { Poll } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { useAuthModal } from "@/context/adda/authModalContext";

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
        createdBy: "currentUserId",
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

  return (
    <AnimatePresence>
      {showCreatePoll && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreatePoll(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Create New Poll
                </h2>
                <p className="text-gray-600 mt-1">
                  Set up a poll for group decision making
                </p>
              </div>
              <button
                onClick={() => setShowCreatePoll(false)}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Poll Title *
                  </label>
                  <input
                    type="text"
                    value={newPoll.title}
                    onChange={(e) =>
                      setNewPoll((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="What would you like to ask?"
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Description (optional)
                  </label>
                  <textarea
                    value={newPoll.description}
                    onChange={(e) =>
                      setNewPoll((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Add context to help people make informed decisions..."
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Category
                  </label>
                  <select
                    value={newPoll.category}
                    onChange={(e) =>
                      setNewPoll((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Expires In (hours)
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
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Poll Options
                </label>
                {newPoll.options.map((option, index) => (
                  <motion.div
                    key={index}
                    className="flex gap-3 mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {newPoll.options.length > 2 && (
                      <button
                        onClick={() => removeOption(index)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </motion.div>
                ))}

                {newPoll.options.length < 8 && (
                  <button
                    onClick={addOption}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-colors font-semibold"
                  >
                    + Add Option
                  </button>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h3 className="font-bold text-gray-800">Poll Settings</h3>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newPoll.allowMultipleVotes}
                      onChange={(e) =>
                        setNewPoll((prev) => ({
                          ...prev,
                          allowMultipleVotes: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <span className="font-medium">
                      Allow multiple votes per person
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newPoll.isAnonymous}
                      onChange={(e) =>
                        setNewPoll((prev) => ({
                          ...prev,
                          isAnonymous: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <span className="font-medium">Anonymous voting</span>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      When to show results
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="immediately">Immediately</option>
                      <option value="afterEnd">After poll closes</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowCreatePoll(false)}
                  className="flex-1 py-4 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreatePoll}
                  disabled={
                    !newPoll.title.trim() ||
                    newPoll.options.filter((opt) => opt.trim()).length < 2
                  }
                  className={`flex-1 py-4 rounded-xl font-bold transition-all ${
                    newPoll.title.trim() &&
                    newPoll.options.filter((opt) => opt.trim()).length >= 2
                      ? "bg-gradient-to-r from-orange-600 to-yellow-600 text-white shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Create Poll
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
