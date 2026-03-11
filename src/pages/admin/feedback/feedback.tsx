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
    @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Boogaloo&display=swap');

    :root {
      --pink:   #FF79C6;
      --purple: #9D4EDD;
      --blue:   #3A86FF;
      --green:  #2DC653;
      --red:    #FF4D6D;
      --yellow: #FFD60A;
      --orange: #FF9F1C;
      --sky:    #56CFE1;
      --ink:    #1a1a2e;
    }

    body { font-family: 'Baloo 2', cursive; }

    .kd { font-family: 'Boogaloo', cursive; }
    .kf { font-family: 'Baloo 2', cursive; }

    @keyframes stripe-march {
      from { background-position: 0 0; }
      to   { background-position: 56px 0; }
    }
    @keyframes wobble {
      0%,100% { transform: rotate(-2deg) scale(1); }
      25%     { transform: rotate(2deg) scale(1.04); }
      75%     { transform: rotate(-1deg) scale(0.97); }
    }
    @keyframes hop {
      0%,100% { transform: translateY(0) rotate(0deg); }
      30%     { transform: translateY(-18px) rotate(-4deg); }
      60%     { transform: translateY(-8px) rotate(3deg); }
    }
    @keyframes spin-star {
      from { transform: rotate(0deg) scale(1); }
      50%  { transform: rotate(180deg) scale(1.2); }
      to   { transform: rotate(360deg) scale(1); }
    }
    @keyframes float-e {
      0%,100% { transform: translateY(0px) rotate(-5deg); }
      50%     { transform: translateY(-20px) rotate(5deg); }
    }
    @keyframes confetti-fall {
      0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
      100% { transform: translateY(80px) rotate(720deg); opacity: 0; }
    }
    @keyframes rainbow-bg {
      0%,100% { background-color: rgba(255,77,109,0.1); }
      25%     { background-color: rgba(255,214,10,0.1); }
      50%     { background-color: rgba(45,198,83,0.1); }
      75%     { background-color: rgba(58,134,255,0.1); }
    }
    @keyframes bloop {
      0%   { transform: scale(0) rotate(-15deg); }
      60%  { transform: scale(1.2) rotate(5deg); }
      100% { transform: scale(1) rotate(0deg); }
    }

    .wobble    { animation: wobble 3s ease-in-out infinite; }
    .hop       { animation: hop 2.4s ease-in-out infinite; }
    .spin-star { animation: spin-star 6s linear infinite; }
    .bloop     { animation: bloop 0.45s cubic-bezier(0.34,1.56,0.64,1) both; }

    .candy-stripe {
      background: repeating-linear-gradient(
        -45deg,
        var(--red) 0px, var(--red) 14px,
        #fff 14px, #fff 28px
      );
      background-size: 56px 56px;
      animation: stripe-march 1.5s linear infinite;
    }

    .dotted-bg {
      background-color: #FFFBF0;
      background-image: radial-gradient(circle, rgba(255,214,10,0.45) 1.5px, transparent 1.5px);
      background-size: 28px 28px;
    }

    .card-kids {
      border-radius: 24px;
      border: 4px solid var(--ink);
      box-shadow: 6px 6px 0 var(--ink);
      transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease;
      position: relative;
      overflow: visible;
    }
    .card-kids:hover {
      transform: translate(-3px,-5px) rotate(-0.4deg);
      box-shadow: 10px 12px 0 var(--ink);
    }

    .selected-card {
      border-color: var(--green) !important;
      box-shadow: 6px 6px 0 var(--green), 0 0 0 6px rgba(45,198,83,0.2) !important;
    }

    .btn-sticker {
      border: 4px solid var(--ink);
      box-shadow: 5px 5px 0 var(--ink);
      border-radius: 9999px;
      font-family: 'Boogaloo', cursive;
      font-size: 1.1rem;
      letter-spacing: 0.5px;
      transition: transform 0.15s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.15s ease;
      cursor: pointer;
      padding: 12px 28px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-sticker:hover  { transform: translate(-2px,-3px); box-shadow: 8px 9px 0 var(--ink); }
    .btn-sticker:active { transform: translate(3px,3px); box-shadow: 2px 2px 0 var(--ink); }
    .btn-sticker:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }

    .avatar-kids {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      border: 4px solid var(--ink);
      box-shadow: 3px 3px 0 var(--ink);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Boogaloo', cursive;
      font-size: 1.6rem;
      color: white;
      flex-shrink: 0;
      overflow: hidden;
    }

    .ribbon {
      position: absolute;
      top: -2px;
      right: -2px;
      background: var(--green);
      color: white;
      padding: 4px 12px;
      font-family: 'Boogaloo', cursive;
      font-size: 0.85rem;
      border-radius: 0 20px 0 20px;
      border: 3px solid var(--ink);
      box-shadow: 2px 2px 0 var(--ink);
      z-index: 10;
    }

    .stat-bubble {
      border: 4px solid var(--ink);
      box-shadow: 5px 5px 0 var(--ink);
      border-radius: 20px;
      transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease;
    }
    .stat-bubble:hover {
      transform: translate(-2px,-3px);
      box-shadow: 8px 9px 0 var(--ink);
    }

    .star-twinkle { transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1); }
    .star-twinkle:hover { transform: scale(1.5) rotate(20deg); }

    .selection-banner { animation: rainbow-bg 4s linear infinite; }

    .conf { position:absolute; width:10px; height:10px; border-radius:2px; pointer-events:none; }
    .conf-1 { background:var(--red);    top:10%; left:15%; animation:confetti-fall 2.8s 0.1s ease-in infinite; }
    .conf-2 { background:var(--yellow); top:5%;  left:40%; animation:confetti-fall 3.2s 0.4s ease-in infinite; }
    .conf-3 { background:var(--blue);   top:8%;  left:65%; animation:confetti-fall 2.5s 0.9s ease-in infinite; }
    .conf-4 { background:var(--green);  top:6%;  left:80%; animation:confetti-fall 3.5s 0.2s ease-in infinite; }
    .conf-5 { background:var(--purple); top:3%;  left:55%; animation:confetti-fall 2.9s 1.1s ease-in infinite; }
    .conf-6 { background:var(--pink);   top:12%; left:25%; animation:confetti-fall 3.1s 0.7s ease-in infinite; }
    .conf-7 { background:var(--orange); top:4%;  left:90%; animation:confetti-fall 2.6s 1.5s ease-in infinite; }
    .conf-8 { background:var(--sky);    top:9%;  left:5%;  animation:confetti-fall 3.3s 0.3s ease-in infinite; }

    .ef { position:fixed; pointer-events:none; z-index:0; opacity:0.14; font-size:2.4rem; }
    .ef1 { top:12%; left:1%;   animation:float-e 4.0s 0.0s ease-in-out infinite; }
    .ef2 { top:30%; right:2%;  animation:float-e 3.5s 1.0s ease-in-out infinite; }
    .ef3 { top:55%; left:2%;   animation:float-e 5.0s 2.0s ease-in-out infinite; }
    .ef4 { top:70%; right:1%;  animation:float-e 4.5s 0.5s ease-in-out infinite; }
    .ef5 { bottom:8%; left:4%; animation:float-e 3.8s 1.5s ease-in-out infinite; }
  `}</style>
);

const ConfettiBar = () => (
  <div
    className="relative overflow-hidden h-6 candy-stripe w-full"
    style={{ borderBottom: "4px solid var(--ink)" }}
  >
    {[...Array(8)].map((_, i) => (
      <div key={i} className={`conf conf-${i + 1}`} />
    ))}
  </div>
);

const FloatingEmojis = () => (
  <>
    <span className="ef ef1">🌈</span>
    <span className="ef ef2">⭐</span>
    <span className="ef ef3">🎈</span>
    <span className="ef ef4">🦄</span>
    <span className="ef ef5">🎉</span>
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
    initial={{ y: 40, opacity: 0, scale: 0.8 }}
    animate={{ y: 0, opacity: 1, scale: 1 }}
    transition={{
      delay,
      duration: 0.5,
      type: "spring",
      stiffness: 280,
      damping: 18,
    }}
    className="stat-bubble flex flex-col items-center p-5 text-center"
    style={{ background: `${color}22` }}
  >
    <span className="text-4xl mb-2 wobble inline-block">{emoji}</span>
    <span className="kd text-4xl leading-none" style={{ color: "var(--ink)" }}>
      {value}
    </span>
    <span className="kf text-sm font-600 text-gray-600 mt-1">{label}</span>
  </motion.div>
);

const StarRow = ({ rating }: { rating: number }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <FaStar
        key={i}
        className={`star-twinkle ${i < rating ? "text-amber-400" : "text-gray-200"}`}
        size={22}
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
      <FloatingEmojis />

      <div
        className="kf relative min-h-screen dotted-bg pb-20 overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <ConfettiBar />

        <div
          className="relative overflow-hidden py-10 px-4"
          style={{
            background:
              "linear-gradient(160deg,#FFD60A 0%,#FF9F1C 45%,#FF4D6D 100%)",
            borderBottom: "5px solid var(--ink)",
          }}
        >
          <div className="spin-star absolute -top-6 -left-6 text-7xl opacity-20 select-none pointer-events-none">
            ⭐
          </div>
          <div
            className="spin-star absolute -bottom-4 -right-4 text-8xl opacity-15 select-none pointer-events-none"
            style={{ animationDirection: "reverse" }}
          >
            🌟
          </div>

          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-5">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 14 }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-5xl bg-white"
                  style={{
                    border: "4px solid var(--ink)",
                    boxShadow: "5px 5px 0 var(--ink)",
                  }}
                >
                  🌟
                </div>
              </motion.div>
              <div>
                <motion.h1
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 18,
                    delay: 0.1,
                  }}
                  className="kd text-6xl md:text-7xl text-white"
                  style={{
                    textShadow: "4px 4px 0 var(--ink)",
                    lineHeight: 1.05,
                  }}
                >
                  Feedback Time!
                </motion.h1>
                <motion.p
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="kf text-white text-lg font-700 mt-1"
                  style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.25)" }}
                >
                  See what everyone thinks 💬✨
                </motion.p>
              </div>
            </div>

            {feedbackData.length > 0 && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 16,
                  delay: 0.3,
                }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.93 }}
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
              </motion.button>
            )}
          </div>
        </div>

        {selectionMode && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="selection-banner border-b-4 px-4 py-5"
            style={{ borderColor: "var(--ink)" }}
          >
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-center gap-4 mb-4 text-4xl">
                {Array.from({ length: MAX }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: i < selectedForDisplay.size ? [1, 1.4, 1] : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-12 h-12 rounded-full border-4 flex items-center justify-center text-2xl font-bold"
                    style={{
                      borderColor: "var(--ink)",
                      background:
                        i < selectedForDisplay.size
                          ? "var(--yellow)"
                          : "#e5e7eb",
                      boxShadow:
                        i < selectedForDisplay.size
                          ? "3px 3px 0 var(--ink)"
                          : "2px 2px 0 #9ca3af",
                    }}
                  >
                    {i < selectedForDisplay.size ? "⭐" : i + 1}
                  </motion.div>
                ))}
              </div>
              <h3
                className="kd text-3xl text-center mb-1"
                style={{ color: "var(--ink)" }}
              >
                Pick {MAX} awesome reviews! 🎯
              </h3>
              <p className="kf text-center text-gray-600 mb-5 font-600">
                {selectedForDisplay.size} of {MAX} chosen
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={cancelSelection}
                  className="btn-sticker"
                  style={{ background: "#f3f4f6", color: "#374151" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || selectedForDisplay.size !== MAX}
                  className="btn-sticker text-white"
                  style={{
                    background:
                      selectedForDisplay.size === MAX
                        ? "var(--green)"
                        : "#d1d5db",
                    cursor:
                      selectedForDisplay.size === MAX
                        ? "pointer"
                        : "not-allowed",
                  }}
                >
                  {saving ? (
                    <>
                      <svg
                        className="animate-spin w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          className="opacity-25"
                        />
                        <path
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          className="opacity-75"
                        />
                      </svg>
                      Saving…
                    </>
                  ) : (
                    `🚀 Save! (${selectedForDisplay.size}/${MAX})`
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="max-w-6xl mx-auto px-5 pt-10 pb-16 relative z-10">
          {feedbackData.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="card-kids p-5 mb-10"
              style={{ background: "#FFF9F0" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🔍</span>
                <span className="kd text-2xl" style={{ color: "var(--ink)" }}>
                  Filter by Stars!
                </span>
              </div>
              <StarRatingFilter
                selected={selectedRating}
                onChange={setSelectedRating}
                ratingCounts={ratingCounts}
              />
            </motion.div>
          )}

          {loading && feedbackData.length === 0 && (
            <div className="flex flex-col items-center py-24 gap-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="text-7xl"
              >
                ⭐
              </motion.div>
              <p className="kd text-3xl text-gray-500">Loading fun stuff…</p>
            </div>
          )}

          {!loading &&
            filteredData.length === 0 &&
            feedbackData.length === 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="card-kids p-16 text-center"
                style={{ background: "#FFF9F0" }}
              >
                <div className="text-8xl hop mb-4">😶</div>
                <p className="kd text-4xl mb-2" style={{ color: "var(--ink)" }}>
                  Nothing here yet!
                </p>
                <p className="kf text-gray-500 text-lg font-600">
                  Be the first to leave feedback! 🚀
                </p>
              </motion.div>
            )}

          {!loading && filteredData.length === 0 && feedbackData.length > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="card-kids p-16 text-center"
              style={{ background: "#F0F8FF" }}
            >
              <div className="text-8xl hop mb-4">🔍</div>
              <p className="kd text-4xl mb-2" style={{ color: "var(--ink)" }}>
                No {selectedRating}★ reviews!
              </p>
              <p className="kf text-gray-500 text-lg font-600">
                Try a different star filter! ✨
              </p>
            </motion.div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                  initial={{ y: 30, opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ y: 0, opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.08,
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                  onClick={
                    selectionMode && feedback._id && !saving
                      ? () => toggleSelection(id)
                      : undefined
                  }
                  className={`card-kids p-6 relative ${isSel ? "selected-card" : ""} ${selectionMode ? "cursor-pointer" : ""}`}
                  style={{ background: cardBg }}
                >
                  {feedback.showToUser && !isSel && (
                    <div className="ribbon">📢 On Display!</div>
                  )}

                  {selectionMode && (
                    <div className="absolute top-4 right-4 z-10">
                      <motion.div
                        key={isSel ? "sel" : "not"}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className="w-10 h-10 rounded-full border-4 flex items-center justify-center"
                        style={{
                          borderColor: "var(--ink)",
                          background: isSel ? "var(--green)" : "#e5e7eb",
                          boxShadow: isSel
                            ? "3px 3px 0 var(--ink)"
                            : "2px 2px 0 #9ca3af",
                        }}
                      >
                        {isSel && (
                          <MdCheckCircle
                            className="text-white bloop"
                            size={24}
                          />
                        )}
                      </motion.div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-5">
                    {feedback.user?.picture ? (
                      <div
                        className="avatar-kids"
                        style={{ background: avatarBg }}
                      >
                        <img
                          src={feedback.user.picture}
                          alt={feedback.user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className="avatar-kids"
                        style={{ background: avatarBg }}
                      >
                        {feedback.user?.name?.[0]?.toUpperCase() || "👤"}
                      </div>
                    )}

                    <div>
                      <div
                        className="kd text-2xl leading-tight"
                        style={{ color: "var(--ink)" }}
                      >
                        {feedback.user?.name || "Anonymous Friend"}
                      </div>
                      <div className="kf text-sm text-gray-500 flex items-center gap-1.5 mt-0.5 font-600">
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

                  <p className="kf text-gray-800 leading-relaxed text-[1.05rem] font-600">
                    {feedback.feedback}
                  </p>

                  {isSel && (
                    <motion.div
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full kd text-base text-white"
                      style={{
                        background: "var(--green)",
                        border: "3px solid var(--ink)",
                        boxShadow: "3px 3px 0 var(--ink)",
                      }}
                    >
                      ✅ Selected for display!
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {!selectedRating &&
            hasMore &&
            filteredData.length > 0 &&
            !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-14 flex justify-center"
              >
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
              </motion.div>
            )}

          {selectedRating !== null && filteredData.length > 0 && (
            <p
              className="mt-10 text-center kd text-xl"
              style={{ color: "var(--purple)" }}
            >
              Showing {filteredData.length} {selectedRating}⭐ review
              {filteredData.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <ConfettiBar />
      </div>
    </>
  );
};

export default Feedback;
