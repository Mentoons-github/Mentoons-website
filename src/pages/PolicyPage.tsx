import { useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiShield,
  FiUser,
  FiAlertTriangle,
  FiInfo,
  FiMail,
  FiFileText,
  FiEdit3,
} from "react-icons/fi";
import { FaCopyright } from "react-icons/fa6";

const PolicyPage = () => {
  const sections = [
    {
      title: "Introduction",
      icon: <FiInfo className="w-6 h-6" />,
      emoji: "👋",
      color: "#FF6B6B",
      bg: "#FFF0F0",
      star: "⭐",
      content:
        "These Terms and Conditions govern your use of our website and services. By accessing or using our services, you agree to abide by these terms in full. We strive to provide you with the best possible experience while ensuring compliance with all applicable laws and regulations.",
      highlight: "Welcome to our platform",
    },
    {
      title: "User Responsibilities",
      icon: <FiUser className="w-6 h-6" />,
      emoji: "🦸",
      color: "#845EF7",
      bg: "#F3EEFF",
      star: "🌟",
      content:
        "As a user, you are responsible for maintaining the confidentiality of your account, ensuring that any information provided is accurate, and refraining from any unlawful activities while using our services. This includes keeping your login credentials secure and notifying us immediately of any unauthorized access.",
      highlight: "Your account, your responsibility",
    },
    {
      title: "Prohibited Activities",
      icon: <FiAlertTriangle className="w-6 h-6" />,
      emoji: "🚫",
      color: "#F76707",
      bg: "#FFF4E6",
      star: "💫",
      content:
        "Users are prohibited from engaging in activities that are harmful to the website, violate any laws, or infringe on the rights of others. This includes spamming, distributing malware, attempting to bypass security measures, harassment, or any form of illegal content distribution.",
      highlight: "Keep it clean and legal",
    },
    {
      title: "Intellectual Property",
      icon: <FaCopyright className="w-6 h-6" />,
      emoji: "🎨",
      color: "#0CA678",
      bg: "#EAFAF5",
      star: "✨",
      content:
        "All content and materials available on this website are protected by intellectual property laws. Unauthorized use of any material, including images, logos, and text, is strictly prohibited. We respect intellectual property rights and expect our users to do the same.",
      highlight: "Respect creative works",
    },
    {
      title: "Disclaimer of Warranties",
      icon: <FiShield className="w-6 h-6" />,
      emoji: "🤞",
      color: "#F59F00",
      bg: "#FFFBE6",
      star: "🌠",
      content:
        "Our services are provided 'as is' without any guarantees or warranties of any kind. We disclaim all liability for any damages arising from the use or inability to use our services. While we strive for excellence, we cannot guarantee uninterrupted or error-free service.",
      highlight: "No guarantees, but we try our best",
    },
    {
      title: "Limitation of Liability",
      icon: <FiFileText className="w-6 h-6" />,
      emoji: "🛡️",
      color: "#1C7ED6",
      bg: "#E8F4FF",
      star: "⚡",
      content:
        "We are not liable for any damages, including direct, indirect, incidental, or consequential damages, that arise from your use of the website or services, even if we have been advised of the possibility of such damages. Our liability is limited to the maximum extent permitted by law.",
      highlight: "Legal protection for all parties",
    },
    {
      title: "Changes to Terms",
      icon: <FiEdit3 className="w-6 h-6" />,
      emoji: "📝",
      color: "#E64980",
      bg: "#FFF0F7",
      star: "🎇",
      content:
        "We reserve the right to modify these Terms and Conditions at any time. Any changes will be effective immediately upon posting on this page. We encourage users to review the terms periodically and will notify users of significant changes via email or prominent site notices.",
      highlight: "Terms may evolve over time",
    },
    {
      title: "Contact Us",
      icon: <FiMail className="w-6 h-6" />,
      emoji: "💌",
      color: "#20C997",
      bg: "#EAFAF7",
      star: "🌈",
      content:
        "If you have any questions or concerns regarding these Terms and Conditions, please don't hesitate to contact us at info@mentoons.com. Our team is here to help clarify any aspects of these terms and address your concerns promptly.",
      highlight: "We're here to help",
    },
  ];
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #fffde7 0%, #fce4ec 45%, #e3f2fd 100%)",
        fontFamily: "'Fredoka One', 'Nunito', cursive, sans-serif",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes tc-wiggle {
          0%,100% { transform: rotate(-4deg); }
          50%      { transform: rotate(4deg); }
        }
        @keyframes tc-float {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-14px); }
        }
        @keyframes tc-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes tc-rainbow {
          0%   { color: #FF6B6B; }
          20%  { color: #F59F00; }
          40%  { color: #0CA678; }
          60%  { color: #1C7ED6; }
          80%  { color: #845EF7; }
          100% { color: #FF6B6B; }
        }
        @keyframes tc-starspin {
          0%   { transform: rotate(0deg) scale(1); }
          50%  { transform: rotate(180deg) scale(1.3); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes tc-blob {
          0%   { transform: translate(0,0) scale(1); }
          33%  { transform: translate(28px,-38px) scale(1.08); }
          66%  { transform: translate(-18px,18px) scale(0.93); }
          100% { transform: translate(0,0) scale(1); }
        }

        .tc-wiggle   { animation: tc-wiggle 2.5s ease-in-out infinite; }
        .tc-float    { animation: tc-float 3.5s ease-in-out infinite; }
        .tc-spin     { animation: tc-spin 12s linear infinite; }
        .tc-rainbow  { animation: tc-rainbow 4s linear infinite; }
        .tc-starspin { animation: tc-starspin 3s ease-in-out infinite; }
        .tc-blob     { animation: tc-blob 7s ease-in-out infinite; }

        .tc-card {
          background: white;
          border-radius: 28px;
          overflow: hidden;
          position: relative;
          transition: transform 0.22s cubic-bezier(.36,.07,.19,.97),
                      box-shadow 0.22s, border-color 0.3s;
        }
        .tc-card:hover { transform: translateY(-4px) scale(1.013); }

        .tc-expand {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s;
        }
        .tc-expand.open { max-height: 520px; opacity: 1; }

        .tc-cta {
          background: white;
          border: none;
          padding: 14px 34px;
          border-radius: 999px;
          font-size: 1.05rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 6px 24px rgba(0,0,0,0.14);
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          font-family: 'Nunito', sans-serif;
          color: #E64980;
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .tc-cta:hover {
          transform: scale(1.07) rotate(-1deg);
          box-shadow: 0 10px 32px rgba(0,0,0,0.2);
        }
      `}</style>

      {/* ── Ambient blobs ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <div
          className="tc-blob"
          style={{
            position: "absolute",
            top: 40,
            left: -60,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,107,107,0.16), transparent 70%)",
          }}
        />
        <div
          className="tc-blob"
          style={{
            position: "absolute",
            top: 220,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(132,94,247,0.14),  transparent 70%)",
            animationDelay: "2s",
          }}
        />
        <div
          className="tc-blob"
          style={{
            position: "absolute",
            bottom: 80,
            left: "28%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(245,159,0,0.13),   transparent 70%)",
            animationDelay: "4s",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(150,150,200,0.12) 1.5px, transparent 1.5px)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* ── Floating emoji decorations ── */}
      {[
        { top: 50, left: 24, e: "🌈", size: 46, cls: "tc-float", delay: "0s" },
        {
          top: 150,
          right: 32,
          e: "⭐",
          size: 38,
          cls: "tc-float",
          delay: "0.8s",
        },
        { top: 370, left: 48, e: "🌸", size: 32, cls: "tc-spin", delay: "0s" },
        {
          top: 580,
          right: 26,
          e: "🎈",
          size: 38,
          cls: "tc-wiggle",
          delay: "0.3s",
        },
        {
          bottom: 300,
          left: 38,
          e: "🦋",
          size: 34,
          cls: "tc-float",
          delay: "1.2s",
        },
        {
          bottom: 170,
          right: 56,
          e: "🎠",
          size: 30,
          cls: "tc-spin",
          delay: "0s",
        },
      ].map((d, i) => (
        <span
          key={i}
          className={d.cls}
          style={{
            position: "fixed",
            zIndex: 0,
            pointerEvents: "none",
            userSelect: "none",
            fontSize: d.size,
            opacity: 0.5,
            display: "block",
            top: d.top,
            bottom: d.bottom,
            left: d.left,
            right: d.right,
            animationDelay: d.delay,
          }}
        >
          {d.e}
        </span>
      ))}

      {/* ══════════════ PAGE CONTENT ══════════════ */}
      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "40px 20px 60px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div
            className="tc-wiggle"
            style={{
              width: 106,
              height: 106,
              background: "linear-gradient(135deg, #FF6B6B, #F59F00)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow:
                "0 10px 40px rgba(255,107,107,0.35), 0 0 0 12px rgba(255,107,107,0.1)",
              fontSize: 50,
            }}
          >
            <FiShield style={{ width: 46, height: 46, color: "white" }} />
          </div>

          <h1
            className="tc-rainbow"
            style={{
              fontSize: "clamp(2.6rem, 6vw, 4.5rem)",
              fontFamily: "'Fredoka One', cursive",
              letterSpacing: "0.02em",
              margin: "0 0 14px",
              lineHeight: 1.1,
            }}
          >
            Terms &amp; Conditions
          </h1>

          <p
            style={{
              fontSize: "1.15rem",
              color: "#666",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              maxWidth: 540,
              margin: "0 auto 22px",
              lineHeight: 1.65,
            }}
          >
            Please take a moment to review our terms and conditions. We've
            designed them to be clear, fair, and transparent.
          </p>

          <div
            style={{
              display: "inline-block",
              background: "white",
              borderRadius: 999,
              padding: "8px 22px",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              color: "#845EF7",
              fontSize: "0.95rem",
              boxShadow: "0 4px 16px rgba(132,94,247,0.16)",
              border: "2.5px dashed #845EF7",
            }}
          >
            🗓️ Last updated: {new Date().toLocaleDateString()}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginTop: 28,
            }}
          >
            {["⭐", "🌟", "✨", "💫", "🌟", "⭐"].map((s, i) => (
              <span
                key={i}
                style={{ fontSize: i === 2 || i === 3 ? 22 : 15, opacity: 0.6 }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* ── Section cards ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {sections.map((section, index) => {
            const isOpen = expandedSection === index;
            return (
              <div
                key={index}
                className="tc-card"
                style={{
                  border: `3px solid ${isOpen ? section.color : "#efefef"}`,
                  boxShadow: isOpen
                    ? `0 10px 40px ${section.color}28`
                    : "0 4px 18px rgba(0,0,0,0.07)",
                }}
              >
                {/* Left colour bar */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 7,
                    background: `linear-gradient(180deg, ${section.color}, ${section.color}55)`,
                  }}
                />

                {/* Watermark number */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 4,
                    right: 16,
                    fontFamily: "'Fredoka One', cursive",
                    fontSize: "5rem",
                    lineHeight: 1,
                    color: section.color,
                    opacity: 0.07,
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Toggle button */}
                <button
                  onClick={() => toggleSection(index)}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    padding: "20px 24px 20px 26px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    textAlign: "left",
                  }}
                >
                  {/* Emoji badge */}
                  <div
                    style={{
                      width: 62,
                      height: 62,
                      background: section.bg,
                      border: `3px solid ${section.color}44`,
                      borderRadius: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 30,
                      flexShrink: 0,
                      transform: isOpen
                        ? "rotate(-8deg) scale(1.08)"
                        : "rotate(0deg) scale(1)",
                      transition: "transform 0.3s",
                      boxShadow: isOpen
                        ? `0 6px 20px ${section.color}33`
                        : "none",
                    }}
                  >
                    {section.emoji}
                  </div>

                  {/* Title + highlight */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "'Fredoka One', cursive",
                        fontSize: "1.5rem",
                        color: section.color,
                        marginBottom: 3,
                        lineHeight: 1.2,
                      }}
                    >
                      {section.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        color: "#bbb",
                      }}
                    >
                      {section.highlight}
                    </div>
                  </div>

                  {/* Chevron */}
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: isOpen ? section.color : "#f3f3f3",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "background 0.3s, transform 0.35s",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      boxShadow: isOpen
                        ? `0 4px 14px ${section.color}44`
                        : "none",
                    }}
                  >
                    {isOpen ? (
                      <FiChevronUp
                        style={{ width: 20, height: 20, color: "white" }}
                      />
                    ) : (
                      <FiChevronDown
                        style={{ width: 20, height: 20, color: "#bbb" }}
                      />
                    )}
                  </div>
                </button>

                {/* Expandable content */}
                <div className={`tc-expand ${isOpen ? "open" : ""}`}>
                  <div style={{ padding: "0 26px 26px 26px" }}>
                    <div
                      style={{
                        height: 3,
                        borderRadius: 99,
                        background: `linear-gradient(90deg, ${section.color}, ${section.color}22)`,
                        marginBottom: 18,
                        opacity: 0.3,
                      }}
                    />
                    <div
                      style={{
                        background: section.bg,
                        borderRadius: 20,
                        border: `2px dashed ${section.color}44`,
                        padding: "18px 22px",
                        display: "flex",
                        gap: 14,
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        className="tc-starspin"
                        style={{ fontSize: 22, flexShrink: 0, marginTop: 3 }}
                      >
                        {section.star}
                      </span>
                      <p
                        style={{
                          fontFamily: "'Nunito', sans-serif",
                          fontWeight: 700,
                          fontSize: "1.02rem",
                          color: "#444",
                          lineHeight: 1.75,
                          margin: 0,
                        }}
                      >
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer CTA ── */}
        <div
          style={{
            marginTop: 56,
            background:
              "linear-gradient(135deg, #FF6B6B 0%, #F59F00 55%, #845EF7 100%)",
            borderRadius: 36,
            padding: "48px 32px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 16px 60px rgba(255,107,107,0.28)",
          }}
        >
          {["🎉", "🎊", "🎈", "⭐", "🌈", "✨", "💖", "🎠"].map((e, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                fontSize: 26 + (i % 3) * 8,
                opacity: 0.14,
                top: `${10 + ((i * 11) % 70)}%`,
                left: `${(i * 13) % 90}%`,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              {e}
            </span>
          ))}

          <div className="tc-float" style={{ fontSize: 58, marginBottom: 10 }}>
            🦄
          </div>

          <h2
            style={{
              fontFamily: "'Fredoka One', cursive",
              fontSize: "clamp(1.8rem,4vw,2.8rem)",
              color: "white",
              margin: "0 0 10px",
              textShadow: "0 3px 12px rgba(0,0,0,0.16)",
            }}
          >
            Questions About Our Terms?
          </h2>

          <p
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              color: "rgba(255,255,255,0.9)",
              fontSize: "1.1rem",
              marginBottom: 28,
              lineHeight: 1.6,
            }}
          >
            Our team is here to help clarify any aspect of these terms and
            conditions.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 14,
            }}
          >
            <a href="mailto:info@mentoons.com" className="tc-cta">
              <FiMail style={{ width: 20, height: 20 }} />
              Contact Support
            </a>
            <div
              style={{
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(8px)",
                borderRadius: 999,
                padding: "12px 22px",
                color: "white",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 800,
                fontSize: "0.9rem",
                border: "2px solid rgba(255,255,255,0.28)",
              }}
            >
              ⚡ Response time: Usually within 24 hours
            </div>
          </div>

          <div
            style={{
              marginTop: 28,
              display: "flex",
              justifyContent: "center",
              gap: 10,
            }}
          >
            {["😊", "🤩", "😄", "🥳", "😎", "💪", "🙌"].map((e, i) => (
              <span
                key={i}
                className="tc-float"
                style={{
                  fontSize: 24,
                  display: "inline-block",
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                {e}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
