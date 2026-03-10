import StarRatingFilter from "@/components/admin/feedback/starRatingFilter";
import { FaStar } from "react-icons/fa6";
import { MdDateRange, MdCheckCircle } from "react-icons/md";
import { fetchFeedback, saveDisplayReviews } from "@/api/feedback/feeedback";
import { useStatusModal } from "@/context/adda/statusModalContext";
import { useEffect, useState } from "react";
import { FeedbackItem } from "@/pages/v2/feedback/feedback";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/clerk-react";

const KidsStyles = () => (
  <style>{`
    :root {
      --pink: #ff79c6;
      --purple: #9d4edd;
      --blue: #5c7cfa;
      --green: #51cf66;
      --red: #ff6b6b;
      --yellow: #ffdd57;
    }
    .btn-sticker {
      padding: 12px 24px;
      border-radius: 9999px;
      font-weight: bold;
      box-shadow: 0 4px 0 rgba(0,0,0,0.15);
      transition: all 0.15s ease;
    }
    .btn-sticker:active {
      transform: translateY(3px);
      box-shadow: 0 1px 0 rgba(0,0,0,0.15);
    }
    .card-kids {
      border-radius: 20px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.08);
      transition: all 0.25s ease;
      position: relative;
      overflow: hidden;
    }
    .card-kids:hover {
      transform: translateY(-6px);
      box-shadow: 0 16px 35px rgba(0,0,0,0.12);
    }
    .selected-card {
      border: 4px solid var(--green);
      box-shadow: 0 0 0 8px rgba(81,207,102,0.25);
      transform: scale(1.03);
    }
    .avatar-kids {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1.5rem;
      color: white;
      flex-shrink: 0;
    }
    .ribbon {
      position: absolute;
      top: 12px;
      right: -36px;
      background: var(--purple);
      color: white;
      padding: 6px 44px;
      font-size: 0.85rem;
      font-weight: bold;
      transform: rotate(45deg);
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
  `}</style>
);

const ConfettiBar = () => (
  <div className="absolute top-0 left-0 right-0 h-1.5 overflow-hidden">
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="absolute h-full w-8 animate-slide"
        style={{
          background: `hsl(${i * 45}, 90%, 60%)`,
          left: `${i * 12.5}%`,
          animationDelay: `${i * 0.08}s`,
        }}
      />
    ))}
  </div>
);

const FloatingEmojis = () => (
  <>
    <span className="absolute text-4xl animate-float-1 left-[10%] top-[15%]">
      🌈
    </span>
    <span className="absolute text-5xl animate-float-2 right-[12%] top-[22%]">
      ⭐
    </span>
    <span className="absolute text-4xl animate-float-3 left-[18%] bottom-[20%]">
      🎈
    </span>
    <span className="absolute text-5xl animate-float-4 right-[15%] bottom-[25%]">
      🦄
    </span>
    <span className="absolute text-4xl animate-float-1 left-[25%] top-[8%]">
      🎉
    </span>
  </>
);

const StatBubble = ({
  emoji,
  label,
  value,
  color,
  delay,
}: {
  emoji: string;
  label: string;
  value: string | number;
  color: string;
  delay: number;
}) => (
  <motion.div
    initial={{ y: 40, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay, duration: 0.6, type: "spring" }}
    className="flex flex-col items-center p-5 rounded-2xl shadow-xl backdrop-blur-sm"
    style={{ background: `linear-gradient(135deg, ${color}22, ${color}15)` }}
  >
    <span className="text-4xl mb-2">{emoji}</span>
    <span className="text-3xl font-black" style={{ color }}>
      {value}
    </span>
    <span className="text-sm font-medium text-gray-600 mt-1">{label}</span>
  </motion.div>
);

const StarRow = ({ rating }: { rating: number }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <FaStar
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
        size={20}
      />
    ))}
  </div>
);

const AVATAR_COLORS = [
  "#FF4D6D",
  "#FF9F1C",
  "#FFD60A",
  "#2DC653",
  "#3A86FF",
  "#8338EC",
  "#FF006E",
  "#56CFE1",
];

const pickColor = (name?: string) =>
  AVATAR_COLORS[(name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

const Feedback = () => {
  const { showStatus } = useStatusModal();
  const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>([]);
  const [filteredData, setFilteredData] = useState<FeedbackItem[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedForDisplay, setSelectedForDisplay] = useState<Set<string>>(
    new Set(),
  );
  const { getToken } = useAuth();
  const [selectionMode, setSelectionMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const MAX = 3;

  const allFeedback = async (page = 1, append = false) => {
    setLoading(true);
    const res = await fetchFeedback(10, page);
    if (!res.success) {
      showStatus("error", res.message!);
      setLoading(false);
      return;
    }
    const items = res.data.data.feedback;
    const total = res.data.data.totalPages || 1;
    setTotalPages(total);
    setHasMore(page < total);
    setFeedbackData((prev) => (append ? [...prev, ...items] : items));
    setLoading(false);
  };

  useEffect(() => {
    allFeedback(1, false);
  }, []);

  useEffect(() => {
    const sorted = [...feedbackData].sort((a, b) => {
      const aS = a.showToUser === true;
      const bS = b.showToUser === true;
      return aS && !bS ? -1 : !aS && bS ? 1 : 0;
    });
    setFilteredData(
      selectedRating === null
        ? sorted
        : sorted.filter((f) => f.rating === selectedRating),
    );
  }, [selectedRating, feedbackData]);

  const getRatingCounts = () => {
    const c = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    feedbackData.forEach((f) => {
      if (f.rating >= 1 && f.rating <= 5) c[f.rating as keyof typeof c]++;
    });
    return c;
  };

  const ratingCounts = getRatingCounts();

  const avgRating =
    feedbackData.length === 0
      ? "0.0"
      : (
          feedbackData.reduce((a, c) => a + c.rating, 0) / feedbackData.length
        ).toFixed(1);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const toggleSelection = (id: string) => {
    if (!id) return;
    setSelectedForDisplay((prev) => {
      const s = new Set(prev);
      if (s.has(id)) {
        s.delete(id);
      } else {
        if (s.size >= MAX) {
          showStatus("info", `Only ${MAX} reviews max! 🙈`);
          return prev;
        }
        s.add(id);
      }
      return s;
    });
  };

  const handleSave = async () => {
    if (selectedForDisplay.size !== MAX) {
      showStatus("info", `Pick exactly ${MAX} reviews! 🌟`);
      return;
    }
    setSaving(true);
    const res = await saveDisplayReviews({
      reviewIds: Array.from(selectedForDisplay),
      getToken,
    });
    if (res.success) {
      showStatus("success", "Yay! Reviews saved! 🎉");
      setSelectionMode(false);
      setSelectedForDisplay(new Set());
    } else {
      showStatus("error", res.message || "Oops! Try again 😅");
    }
    setSaving(false);
  };

  const cancelSelection = () => {
    setSelectionMode(false);
    setSelectedForDisplay(new Set());
  };

  return (
    <>
      <KidsStyles />

      <div className="relative min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 pb-20 overflow-hidden">
        <FloatingEmojis />
        <ConfettiBar />

        <div className="max-w-6xl mx-auto px-5 pt-12 pb-16 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                Feedback Time!
              </h1>
              <p className="text-xl text-gray-700 mt-3 font-medium">
                See what everyone thinks 💬✨
              </p>
            </div>

            {feedbackData.length > 0 && (
              <button
                onClick={() =>
                  selectionMode ? cancelSelection() : setSelectionMode(true)
                }
                disabled={saving}
                className="btn-sticker text-white text-lg md:text-xl whitespace-nowrap"
                style={{
                  background: selectionMode ? "var(--red)" : "var(--green)",
                }}
              >
                {selectionMode ? "✖ Cancel" : "🌟 Pick Star Reviews!"}
              </button>
            )}
          </div>

          {selectionMode && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border-2 border-purple-200 mb-10 relative overflow-hidden"
            >
              <div className="flex justify-center gap-4 mb-5 text-4xl">
                {Array.from({ length: MAX }).map((_, i) => (
                  <span key={i}>
                    {i < selectedForDisplay.size ? "⭐" : i + 1}
                  </span>
                ))}
              </div>
              <h3 className="text-2xl font-bold text-center text-purple-700 mb-2">
                Pick {MAX} awesome reviews! 🎯
              </h3>
              <p className="text-center text-gray-600 mb-6">
                {selectedForDisplay.size} of {MAX} chosen
              </p>
              <div className="flex justify-center gap-6">
                <button
                  onClick={cancelSelection}
                  className="btn-sticker bg-gray-500 hover:bg-gray-600 text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || selectedForDisplay.size !== MAX}
                  className="btn-sticker text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background:
                      selectedForDisplay.size === MAX
                        ? "var(--purple)"
                        : "gray",
                  }}
                >
                  {saving ? (
                    <>Saving…</>
                  ) : (
                    `🚀 Save! (${selectedForDisplay.size}/${MAX})`
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {feedbackData.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <StatBubble
                emoji="⭐"
                label="Average Rating"
                value={avgRating}
                color="#FFD60A"
                delay={0.1}
              />
              <StatBubble
                emoji="📊"
                label="Total Reviews"
                value={feedbackData.length}
                color="#3A86FF"
                delay={0.2}
              />
              <StatBubble
                emoji="😍"
                label="5-Star Reviews"
                value={ratingCounts[5]}
                color="#FF4D6D"
                delay={0.3}
              />
              <StatBubble
                emoji="🎉"
                label="On Display"
                value={feedbackData.filter((f) => f.showToUser).length}
                color="#2DC653"
                delay={0.4}
              />
            </div>
          )}

          {!selectionMode && feedbackData.length > 0 && (
            <div className="mb-10 flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-4 text-purple-700">
                🔍 Filter by Stars!
              </h3>
              <StarRatingFilter
                selected={selectedRating}
                onChange={setSelectedRating}
                ratingCounts={ratingCounts}
              />
            </div>
          )}

          {loading && feedbackData.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-6 animate-spin">⭐</div>
              <p className="text-xl text-gray-600">Loading fun stuff…</p>
            </div>
          )}

          {!loading &&
            filteredData.length === 0 &&
            feedbackData.length === 0 && (
              <div className="text-center py-24">
                <div className="text-8xl mb-6">😶</div>
                <h2 className="text-3xl font-bold text-gray-700 mb-3">
                  Nothing here yet!
                </h2>
                <p className="text-xl text-gray-500">
                  Be the first to leave feedback! 🚀
                </p>
              </div>
            )}

          {!loading && filteredData.length === 0 && feedbackData.length > 0 && (
            <div className="text-center py-20">
              <div className="text-7xl mb-6">🔍</div>
              <h2 className="text-3xl font-bold text-gray-700 mb-3">
                No {selectedRating}★ reviews!
              </h2>
              <p className="text-xl text-gray-600">
                Try a different star filter! ✨
              </p>
            </div>
          )}

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredData.map((feedback, index) => {
              const id = feedback._id || `feedback-${index}`;
              const isSel = selectedForDisplay.has(id);
              const avatarBg = pickColor(feedback.user?.name);
              const cardBgs = [
                "#FFF0F5",
                "#FFFDF0",
                "#F0FFF8",
                "#F0F5FF",
                "#FFF5F0",
                "#F8F0FF",
              ];
              const cardBg = cardBgs[index % cardBgs.length];

              return (
                <motion.div
                  key={id}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.08 }}
                  onClick={
                    selectionMode && feedback._id && !saving
                      ? () => toggleSelection(id)
                      : undefined
                  }
                  className={`card-kids p-6 relative ${isSel ? "selected-card" : ""} ${
                    selectionMode ? "cursor-pointer" : ""
                  }`}
                  style={{ background: cardBg }}
                >
                  {feedback.showToUser && !isSel && (
                    <div className="ribbon">📢 On Display!</div>
                  )}

                  {selectionMode && (
                    <div className="absolute top-4 right-4 z-10">
                      <div
                        className={`w-8 h-8 rounded-full border-3 flex items-center justify-center text-white font-bold ${
                          isSel
                            ? "bg-green-500 border-green-600"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        {isSel && <MdCheckCircle size={28} />}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-5">
                    {feedback.user?.picture ? (
                      <img
                        src={feedback.user.picture}
                        alt={feedback.user.name}
                        className="avatar-kids"
                        style={{ background: avatarBg }}
                      />
                    ) : (
                      <div
                        className="avatar-kids"
                        style={{ background: avatarBg }}
                      >
                        {feedback.user?.name?.[0]?.toUpperCase() || "👤"}
                      </div>
                    )}

                    <div>
                      <div className="font-bold text-lg">
                        {feedback.user?.name || "Anonymous Friend"}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1.5">
                        <MdDateRange size={16} />
                        {feedback.createdAt
                          ? formatDate(feedback.createdAt)
                          : "N/A"}
                      </div>
                    </div>
                  </div>

                  {!selectionMode && (
                    <div className="mb-4">
                      <StarRow rating={feedback.rating} />
                    </div>
                  )}

                  <p className="text-gray-800 leading-relaxed text-lg">
                    {feedback.feedback}
                  </p>

                  {isSel && (
                    <div className="mt-4 inline-block bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium">
                      ✅ Selected for display!
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {!selectedRating &&
            hasMore &&
            filteredData.length > 0 &&
            !loading && (
              <div className="text-center mt-16">
                <button
                  onClick={() => {
                    const n = currentPage + 1;
                    setCurrentPage(n);
                    allFeedback(n, true);
                  }}
                  className="btn-sticker text-white text-xl"
                  style={{
                    background:
                      "linear-gradient(135deg,var(--blue),var(--purple))",
                    padding: "14px 36px",
                  }}
                >
                  🎈 Load More! ({currentPage + 1}/{totalPages})
                </button>
              </div>
            )}

          {selectedRating !== null && filteredData.length > 0 && (
            <div className="text-center mt-12 text-xl font-medium text-purple-700">
              Showing {filteredData.length} {selectedRating}⭐ review
              {filteredData.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Feedback;
