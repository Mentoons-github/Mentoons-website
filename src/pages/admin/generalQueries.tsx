import axios from "axios";
import { useEffect, useState } from "react";
import { errorToast, successToast } from "@/utils/toastResposnse";

interface Query {
  _id: string;
  name: string;
  email: string;
  phone: string;
  queryType: string;
  message: string;
  status: "pending" | "in-progress" | "resolved" | "closed";
  responseMessage?: string;
  respondedBy?: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

const STATUS_CONFIG = {
  pending: {
    color: "bg-amber-100 text-amber-700 border-2 border-amber-300",
    emoji: "⏳",
    label: "Waiting!",
    bg: "bg-amber-50",
  },
  "in-progress": {
    color: "bg-sky-100 text-sky-700 border-2 border-sky-300",
    emoji: "🚀",
    label: "On it!",
    bg: "bg-sky-50",
  },
  resolved: {
    color: "bg-emerald-100 text-emerald-700 border-2 border-emerald-300",
    emoji: "✅",
    label: "Done!",
    bg: "bg-emerald-50",
  },
  closed: {
    color: "bg-purple-100 text-purple-700 border-2 border-purple-300",
    emoji: "🎉",
    label: "Closed",
    bg: "bg-purple-50",
  },
};

const QUERY_TYPE_EMOJI: Record<string, string> = {
  general: "💬",
  assessment: "📝",
  product: "🛍️",
  workshop: "🎨",
};

const GeneralQueries = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [status, setStatus] = useState<
    "pending" | "in-progress" | "resolved" | "closed"
  >("pending");
  const [originalQueries, setOriginalQueries] = useState<Query[]>([]);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_PROD_URL}/query`,
        );
        setQueries(response.data.data);
        setOriginalQueries(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch queries");
        setLoading(false);
        console.error(err);
      }
    };

    fetchQueries();
  }, []);

  const handleQueryClick = (query: Query) => {
    setSelectedQuery(query);
    setStatus(query.status);
    setResponseMessage(query.responseMessage || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuery(null);
  };

  const handleSubmitResponse = async () => {
    if (!selectedQuery) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/email/sendQueryResponseEmail`,
        {
          id: selectedQuery._id,
          name: selectedQuery.name,
          email: selectedQuery.email,
          message: selectedQuery.message,
          queryType: selectedQuery.queryType,
          status,
          responseMessage,
        },
      );
      if (response.status === 200) {
        const updatedQuery = { ...selectedQuery, status, responseMessage };
        setQueries(
          queries.map((q) => (q._id === selectedQuery._id ? updatedQuery : q)),
        );
        setOriginalQueries(
          originalQueries.map((q) =>
            q._id === selectedQuery._id ? updatedQuery : q,
          ),
        );
        closeModal();
        successToast("Query updated successfully");
      }
    } catch (err) {
      console.error("Failed to update query:", err);
      errorToast(
        `Failed to update query: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  };

  if (loading) {
    return (
      <div
        className="flex flex-col items-center justify-center h-screen gap-4"
        style={{
          background: "linear-gradient(135deg, #fff9f0 0%, #f0f7ff 100%)",
        }}
      >
        <div className="text-6xl animate-bounce">🌀</div>
        <p
          className="text-2xl font-bold text-purple-500"
          style={{ fontFamily: "'Fredoka One', cursive" }}
        >
          Loading your messages...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-6xl">😔</div>
        <p className="text-xl font-bold text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');

        * { box-sizing: border-box; }

        .query-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
        }
        .query-card:hover {
          transform: translateY(-6px) rotate(0.5deg);
          box-shadow: 0 16px 40px rgba(0,0,0,0.12);
        }

        .filter-select {
          appearance: none;
          background: white;
          border: 3px solid #fbbf24;
          border-radius: 16px;
          padding: 10px 40px 10px 16px;
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 15px;
          color: #374151;
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .filter-select:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 4px rgba(251,191,36,0.2);
        }

        .submit-btn {
          background: linear-gradient(135deg, #fb923c, #f97316);
          color: white;
          border: none;
          border-radius: 16px;
          padding: 12px 28px;
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          font-size: 16px;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 12px rgba(249,115,22,0.4);
        }
        .submit-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(249,115,22,0.5);
        }
        .submit-btn:active { transform: scale(0.98); }

        .cancel-btn {
          background: #f3f4f6;
          color: #6b7280;
          border: none;
          border-radius: 16px;
          padding: 12px 24px;
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .cancel-btn:hover { background: #e5e7eb; }

        .modal-backdrop {
          animation: fadeIn 0.2s ease;
        }
        .modal-box {
          animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          border-radius: 999px;
          padding: 4px 12px;
          font-size: 13px;
          font-weight: 800;
          font-family: 'Nunito', sans-serif;
        }

        .section-label {
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 13px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 4px;
        }
        .section-value {
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #374151;
        }

        textarea, select.response-select {
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          border: 3px solid #e5e7eb;
          border-radius: 16px;
          padding: 12px 16px;
          width: 100%;
          outline: none;
          resize: vertical;
          transition: border-color 0.2s, box-shadow 0.2s;
          color: #374151;
        }
        textarea:focus, select.response-select:focus {
          border-color: #fb923c;
          box-shadow: 0 0 0 4px rgba(251,146,60,0.15);
        }
        select.response-select {
          appearance: none;
          cursor: pointer;
          background: white;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='%23fb923c'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 20px;
          padding-right: 40px;
        }

        .doodle-bg {
          background-color: #fffbf5;
          background-image:
            radial-gradient(circle at 15% 10%, rgba(251,191,36,0.12) 0%, transparent 50%),
            radial-gradient(circle at 85% 20%, rgba(167,243,208,0.15) 0%, transparent 45%),
            radial-gradient(circle at 50% 80%, rgba(196,181,253,0.12) 0%, transparent 50%),
            radial-gradient(circle at 5% 90%, rgba(253,186,116,0.1) 0%, transparent 40%);
        }

        .card-stripe {
          height: 8px;
          border-radius: 4px 4px 0 0;
        }

        .wiggle:hover { animation: wiggle 0.4s ease; }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
      `}</style>

      <div
        className="doodle-bg min-h-screen"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 24px" }}>
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="text-5xl wiggle" style={{ cursor: "default" }}>
              📬
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: "clamp(28px, 5vw, 42px)",
                  color: "#1f2937",
                  lineHeight: 1.1,
                  marginBottom: 4,
                }}
              >
                Message Center
              </h1>
              <p style={{ fontSize: 15, color: "#9ca3af", fontWeight: 600 }}>
                {queries.length} message{queries.length !== 1 ? "s" : ""} to
                check out 👀
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div
            style={{
              background: "white",
              borderRadius: 24,
              padding: "16px 24px",
              marginBottom: 32,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 12,
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              border: "2px solid #fef3c7",
            }}
          >
            <span style={{ fontSize: 22 }}>🔍</span>
            <span
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: 18,
                color: "#374151",
              }}
            >
              Show me:
            </span>
            <div style={{ position: "relative" }}>
              <select
                className="filter-select"
                onChange={(e) => {
                  const v = e.target.value;
                  setQueries(
                    v === "all"
                      ? originalQueries
                      : originalQueries.filter((q) => q.queryType === v),
                  );
                }}
              >
                <option value="all">🌟 All Messages</option>
                {["general", "assessment", "product", "workshop"].map(
                  (item) => (
                    <option key={item} value={item}>
                      {QUERY_TYPE_EMOJI[item]}{" "}
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          {/* Empty State */}
          {queries.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 24px",
                background: "white",
                borderRadius: 32,
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontSize: 72, marginBottom: 16 }}>📭</div>
              <p
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: 28,
                  color: "#9ca3af",
                }}
              >
                No messages here!
              </p>
              <p style={{ color: "#d1d5db", fontSize: 16, marginTop: 8 }}>
                Check back later 😊
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 20,
              }}
            >
              {queries.map((query, i) => {
                const s = STATUS_CONFIG[query.status] || STATUS_CONFIG.pending;
                const stripeColors = [
                  "linear-gradient(90deg,#fbbf24,#f59e0b)",
                  "linear-gradient(90deg,#34d399,#10b981)",
                  "linear-gradient(90deg,#60a5fa,#3b82f6)",
                  "linear-gradient(90deg,#f472b6,#ec4899)",
                  "linear-gradient(90deg,#a78bfa,#8b5cf6)",
                ];
                const stripe = stripeColors[i % stripeColors.length];
                return (
                  <div
                    key={query._id}
                    className="query-card"
                    onClick={() => handleQueryClick(query)}
                    style={{
                      background: "white",
                      borderRadius: 24,
                      overflow: "hidden",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    }}
                  >
                    {/* Color stripe */}
                    <div
                      className="card-stripe"
                      style={{ background: stripe }}
                    />

                    <div style={{ padding: "18px 20px 20px" }}>
                      {/* Top Row */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 14,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <span style={{ fontSize: 28 }}>
                            {QUERY_TYPE_EMOJI[query.queryType] || "💬"}
                          </span>
                          <span
                            style={{
                              fontFamily: "'Fredoka One', cursive",
                              fontSize: 20,
                              color: "#1f2937",
                              textTransform: "capitalize",
                            }}
                          >
                            {query.queryType || "General"}
                          </span>
                        </div>
                        <span className={`status-badge ${s.color}`}>
                          {s.emoji} {s.label}
                        </span>
                      </div>

                      {/* Info rows */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                          marginBottom: 14,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <span style={{ fontSize: 18 }}>👤</span>
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: "#4b5563",
                            }}
                          >
                            {query.name || "Anonymous"}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <span style={{ fontSize: 16 }}>📧</span>
                          <span
                            style={{
                              fontSize: 13,
                              color: "#9ca3af",
                              fontWeight: 600,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "220px",
                            }}
                          >
                            {query.email || "No email"}
                          </span>
                        </div>
                      </div>

                      {/* Message preview */}
                      <div
                        style={{
                          background: "#f9fafb",
                          borderRadius: 14,
                          padding: "10px 14px",
                          borderLeft: "4px solid #fbbf24",
                        }}
                      >
                        <p
                          style={{
                            fontSize: 14,
                            color: "#6b7280",
                            lineHeight: 1.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            margin: 0,
                          }}
                        >
                          {query.message}
                        </p>
                      </div>

                      {/* Click hint */}
                      <p
                        style={{
                          textAlign: "center",
                          fontSize: 12,
                          color: "#d1d5db",
                          marginTop: 12,
                          fontWeight: 700,
                        }}
                      >
                        Tap to read & reply 👆
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen &&
        selectedQuery &&
        (() => {
          const s =
            STATUS_CONFIG[selectedQuery.status] || STATUS_CONFIG.pending;
          return (
            <div
              className="modal-backdrop"
              onClick={closeModal}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 50,
                background: "rgba(0,0,0,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
                backdropFilter: "blur(4px)",
              }}
            >
              <div
                className="modal-box"
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "white",
                  borderRadius: 32,
                  width: "100%",
                  maxWidth: 680,
                  maxHeight: "90vh",
                  overflowY: "auto",
                  fontFamily: "'Nunito', sans-serif",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
                }}
              >
                {/* Modal Header */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #fff7ed, #fef3c7)",
                    borderRadius: "32px 32px 0 0",
                    padding: "24px 28px 20px",
                    borderBottom: "2px dashed #fde68a",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span style={{ fontSize: 36 }}>
                      {QUERY_TYPE_EMOJI[selectedQuery.queryType] || "💬"}
                    </span>
                    <div>
                      <h2
                        style={{
                          fontFamily: "'Fredoka One', cursive",
                          fontSize: 26,
                          color: "#1f2937",
                          margin: 0,
                          textTransform: "capitalize",
                        }}
                      >
                        {selectedQuery.queryType} Message
                      </h2>
                      <span
                        className={`status-badge ${s.color}`}
                        style={{ marginTop: 4, display: "inline-flex" }}
                      >
                        {s.emoji} {s.label}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    style={{
                      background: "#fee2e2",
                      border: "none",
                      borderRadius: "50%",
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: 20,
                      transition: "background 0.2s, transform 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "#fecaca";
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "#fee2e2";
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(1)";
                    }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ padding: "24px 28px" }}>
                  {/* Contact Info */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                      marginBottom: 24,
                    }}
                  >
                    {[
                      {
                        emoji: "👤",
                        label: "Name",
                        value: selectedQuery.name || "Anonymous",
                      },
                      {
                        emoji: "📧",
                        label: "Email",
                        value: selectedQuery.email || "No email",
                      },
                      {
                        emoji: "📞",
                        label: "Phone",
                        value: selectedQuery.phone || "No phone",
                      },
                      {
                        emoji: "🗓️",
                        label: "Date",
                        value: new Date(
                          selectedQuery.createdAt,
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }),
                      },
                    ].map(({ emoji, label, value }) => (
                      <div
                        key={label}
                        style={{
                          background: "#f9fafb",
                          borderRadius: 16,
                          padding: "12px 16px",
                          border: "2px solid #f3f4f6",
                        }}
                      >
                        <div className="section-label">
                          {emoji} {label}
                        </div>
                        <div
                          className="section-value"
                          style={{ wordBreak: "break-all" }}
                        >
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Original Message */}
                  <div style={{ marginBottom: 24 }}>
                    <div className="section-label" style={{ marginBottom: 8 }}>
                      💌 Their Message
                    </div>
                    <div
                      style={{
                        background: "#f0fdf4",
                        borderRadius: 16,
                        padding: "16px 18px",
                        border: "2px solid #bbf7d0",
                        whiteSpace: "pre-wrap",
                        fontSize: 15,
                        lineHeight: 1.6,
                        color: "#374151",
                      }}
                    >
                      {selectedQuery.message}
                    </div>
                  </div>

                  {/* Divider */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 24,
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: 2,
                        background: "#fde68a",
                        borderRadius: 2,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'Fredoka One', cursive",
                        fontSize: 18,
                        color: "#f59e0b",
                      }}
                    >
                      ✏️ Your Reply
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: 2,
                        background: "#fde68a",
                        borderRadius: 2,
                      }}
                    />
                  </div>

                  {/* Status Selector */}
                  <div style={{ marginBottom: 18 }}>
                    <div className="section-label" style={{ marginBottom: 8 }}>
                      🚦 Update Status
                    </div>
                    <select
                      className="response-select"
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value as typeof status)
                      }
                    >
                      <option value="pending">
                        ⏳ Pending – Still waiting
                      </option>
                      <option value="in-progress">
                        🚀 In Progress – Working on it!
                      </option>
                      <option value="resolved">✅ Resolved – All done!</option>
                      <option value="closed">🎉 Closed – Wrapped up</option>
                    </select>
                  </div>

                  {/* Response Message */}
                  <div style={{ marginBottom: 24 }}>
                    <div className="section-label" style={{ marginBottom: 8 }}>
                      💬 Write Your Reply
                    </div>
                    <textarea
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      rows={4}
                      placeholder="Type something nice here... 😊"
                    />
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 12,
                    }}
                  >
                    <button className="cancel-btn" onClick={closeModal}>
                      Nevermind
                    </button>
                    <button
                      className="submit-btn"
                      onClick={handleSubmitResponse}
                    >
                      Send Reply 🚀
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </>
  );
};

export default GeneralQueries;
