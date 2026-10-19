import { useState } from "react";
import { motion, MotionConfig } from "framer-motion";
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

/* ── Comic palette ── */
const INK = "#1a1a1a";
const PAPER = "#FFF6D6";

/* Starburst polygon (for the "POW" badges) */
const burst = (points = 14, inner = 38, outer = 50) =>
  `polygon(${Array.from({ length: points * 2 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / points - Math.PI / 2;
    return `${50 + r * Math.cos(a)}% ${50 + r * Math.sin(a)}%`;
  }).join(", ")})`;

const BURST = burst();

/* ── Comic animation helpers (framer-motion, all inline) ── */

/* Springy "pop" used for boxes, chips and buttons when they scroll into view */
const POP_SPRING = {
  type: "spring" as const,
  stiffness: 240,
  damping: 14,
};

const PolicyPage = () => {
  const sections = [
    {
      title: "Introduction",
      icon: <FiInfo className="w-6 h-6" />,
      emoji: "👋",
      color: "#FF3B3B",
      bg: "#FFE3E3",
      sfx: "HELLO!",
      content:
        "These Terms and Conditions govern your use of our website and services. By accessing or using our services, you agree to abide by these terms in full. We strive to provide you with the best possible experience while ensuring compliance with all applicable laws and regulations.",
      highlight: "Welcome to our platform",
    },
    {
      title: "User Responsibilities",
      icon: <FiUser className="w-6 h-6" />,
      emoji: "🦸",
      color: "#A455FF",
      bg: "#EEDDFF",
      sfx: "YOUR TURN!",
      content:
        "As a user, you are responsible for maintaining the confidentiality of your account, ensuring that any information provided is accurate, and refraining from any unlawful activities while using our services. This includes keeping your login credentials secure and notifying us immediately of any unauthorized access.",
      highlight: "Your account, your responsibility",
    },
    {
      title: "Prohibited Activities",
      icon: <FiAlertTriangle className="w-6 h-6" />,
      emoji: "🚫",
      color: "#FF8A00",
      bg: "#FFE9CC",
      sfx: "NO WAY!",
      content:
        "Users are prohibited from engaging in activities that are harmful to the website, violate any laws, or infringe on the rights of others. This includes spamming, distributing malware, attempting to bypass security measures, harassment, or any form of illegal content distribution.",
      highlight: "Keep it clean and legal",
    },
    {
      title: "Intellectual Property",
      icon: <FaCopyright className="w-6 h-6" />,
      emoji: "🎨",
      color: "#14B87A",
      bg: "#D4F7E8",
      sfx: "HANDS OFF!",
      content:
        "All content and materials available on this website are protected by intellectual property laws. Unauthorized use of any material, including images, logos, and text, is strictly prohibited. We respect intellectual property rights and expect our users to do the same.",
      highlight: "Respect creative works",
    },
    {
      title: "Disclaimer of Warranties",
      icon: <FiShield className="w-6 h-6" />,
      emoji: "🤞",
      color: "#F5B800",
      bg: "#FFF1B8",
      sfx: "AS IS!",
      content:
        "Our services are provided 'as is' without any guarantees or warranties of any kind. We disclaim all liability for any damages arising from the use or inability to use our services. While we strive for excellence, we cannot guarantee uninterrupted or error-free service.",
      highlight: "No guarantees, but we try our best",
    },
    {
      title: "Limitation of Liability",
      icon: <FiFileText className="w-6 h-6" />,
      emoji: "🛡️",
      color: "#2D9CFF",
      bg: "#D6ECFF",
      sfx: "SHIELD UP!",
      content:
        "We are not liable for any damages, including direct, indirect, incidental, or consequential damages, that arise from your use of the website or services, even if we have been advised of the possibility of such damages. Our liability is limited to the maximum extent permitted by law.",
      highlight: "Legal protection for all parties",
    },
    {
      title: "Changes to Terms",
      icon: <FiEdit3 className="w-6 h-6" />,
      emoji: "📝",
      color: "#FF5FA2",
      bg: "#FFDDEC",
      sfx: "PLOT TWIST!",
      content:
        "We reserve the right to modify these Terms and Conditions at any time. Any changes will be effective immediately upon posting on this page. We encourage users to review the terms periodically and will notify users of significant changes via email or prominent site notices.",
      highlight: "Terms may evolve over time",
    },
    {
      title: "Contact Us",
      icon: <FiMail className="w-6 h-6" />,
      emoji: "💌",
      color: "#00B5C8",
      bg: "#D2F4F8",
      sfx: "CALL US!",
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
    <MotionConfig reducedMotion="user">
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: PAPER,
          backgroundImage: `radial-gradient(${INK}22 1.6px, transparent 1.8px)`,
          backgroundSize: "18px 18px",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        .cm-card {
          background: #fff;
          border: 4px solid ${INK};
          border-radius: 18px;
          box-shadow: 8px 8px 0 ${INK};
          position: relative;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .cm-card:hover {
          transform: translate(-2px, -2px);
          box-shadow: 10px 10px 0 ${INK};
        }
        .cm-card:active {
          transform: translate(4px, 4px);
          box-shadow: 4px 4px 0 ${INK};
        }

        .cm-toggle:focus-visible,
        .cm-cta:focus-visible {
          outline: 4px solid ${INK};
          outline-offset: 3px;
        }

        .cm-halftone {
          background-image: radial-gradient(${INK}33 1.4px, transparent 1.6px);
          background-size: 8px 8px;
        }

        .cm-outline-text {
          color: #fff;
          -webkit-text-stroke: 3px ${INK};
          paint-order: stroke fill;
          text-shadow: 5px 5px 0 ${INK};
          letter-spacing: 0.04em;
        }

        .cm-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #FFD60A;
          color: ${INK};
          border: 4px solid ${INK};
          border-radius: 14px;
          padding: 12px 28px;
          font-size: 1.6rem;
          letter-spacing: 0.06em;
          text-decoration: none;
          box-shadow: 6px 6px 0 ${INK};
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }
        .cm-cta:hover {
          transform: translate(-2px, -2px) rotate(-1.5deg);
          box-shadow: 8px 8px 0 ${INK};
        }
        .cm-cta:active {
          transform: translate(4px, 4px);
          box-shadow: 2px 2px 0 ${INK};
        }

        @media (prefers-reduced-motion: reduce) {
          .cm-card, .cm-cta { transition: none; }
        }
      `}</style>

        {/* ══════════════ PAGE CONTENT ══════════════ */}
        <div
          style={{
            maxWidth: 860,
            margin: "0 auto",
            padding: "48px 20px 72px",
            position: "relative",
          }}
        >
          {/* ── Header (shakes when the title lands) ── */}
          <motion.div
            style={{ textAlign: "center", marginBottom: 56 }}
            animate={{ x: [0, -6, 5, -4, 3, 0], y: [0, 3, -4, -2, 2, 0] }}
            transition={{ duration: 0.35, delay: 0.75, ease: "linear" }}
          >
            {/* Starburst badge spins and bounces in */}
            <motion.div
              style={{
                width: 130,
                height: 130,
                margin: "0 auto 8px",
                position: "relative",
              }}
              initial={{ scale: 0, rotate: -200 }}
              animate={{ scale: [0, 1.2, 0.95, 1], rotate: [-200, 10, -9, -6] }}
              transition={{
                duration: 0.8,
                times: [0, 0.5, 0.75, 1],
                ease: "easeOut",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: INK,
                  clipPath: BURST,
                  transform: "translate(5px, 5px)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#FFD60A",
                  clipPath: BURST,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiShield style={{ width: 52, height: 52, color: INK }} />
              </div>
            </motion.div>

            <motion.h1
              className="font-comic cm-outline-text"
              style={{
                fontSize: "clamp(3rem, 9vw, 5.5rem)",
                lineHeight: 1,
                margin: "6px 0 18px",
                display: "inline-block",
              }}
              initial={{ opacity: 0, scale: 2.4, rotate: -10, y: -40 }}
              animate={{
                opacity: [0, 1, 1, 1],
                scale: [2.4, 0.94, 1.03, 1],
                rotate: [-10, -0.5, -2.5, -2],
                y: [-40, 0, 0, 0],
              }}
              transition={{
                duration: 0.7,
                delay: 0.35,
                times: [0, 0.55, 0.75, 1],
                ease: "easeOut",
              }}
            >
              Terms &amp; Conditions
            </motion.h1>

            {/* Narration box */}
            <motion.div
              style={{
                maxWidth: 560,
                margin: "0 auto 24px",
                background: "#FFF1B8",
                border: `3px solid ${INK}`,
                boxShadow: `5px 5px 0 ${INK}`,
                padding: "12px 18px",
                textAlign: "left",
                fontWeight: 700,
                fontSize: "1.05rem",
                lineHeight: 1.55,
                color: INK,
              }}
              initial={{ opacity: 0, scale: 0.5, rotate: -6, y: 30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0.6, y: 0 }}
              transition={{ ...POP_SPRING, delay: 1.0 }}
            >
              Please take a moment to review our terms and conditions. We've
              designed them to be clear, fair, and transparent.
            </motion.div>

            <motion.span
              className="font-comic-chip"
              style={{
                display: "inline-block",
                background: "#2D9CFF",
                color: "#fff",
                border: `3px solid ${INK}`,
                borderRadius: 999,
                padding: "6px 20px",
                fontSize: "1.1rem",
                letterSpacing: "0.06em",
                boxShadow: `4px 4px 0 ${INK}`,
                textShadow: `2px 2px 0 ${INK}`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...POP_SPRING, delay: 1.25 }}
            >
              Last updated: {new Date().toLocaleDateString()}
            </motion.span>
          </motion.div>

          {/* ── Section cards ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {sections.map((section, index) => {
              const isOpen = expandedSection === index;
              const panelId = `cm-panel-${index}`;
              const fromLeft = index % 2 === 0;
              return (
                /* Wrapper carries the entrance so the card's own hover CSS keeps working */
                <motion.div
                  key={section.title}
                  initial={{
                    opacity: 0,
                    x: fromLeft ? -90 : 90,
                    rotate: fromLeft ? -5 : 5,
                    scale: 0.85,
                  }}
                  whileInView={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <div
                    className="cm-card"
                    style={{
                      transform: undefined,
                      overflow: "visible",
                    }}
                  >
                    {/* SFX tag stamps onto the corner */}
                    <motion.span
                      className="font-comic-chip"
                      style={{
                        position: "absolute",
                        top: -18,
                        right: 18,
                        background: section.color,
                        color: "#fff",
                        border: `3px solid ${INK}`,
                        borderRadius: 8,
                        padding: "2px 12px",
                        fontSize: "1rem",
                        letterSpacing: "0.06em",
                        textShadow: `2px 2px 0 ${INK}`,
                        boxShadow: `3px 3px 0 ${INK}`,
                        pointerEvents: "none",
                      }}
                      initial={{
                        opacity: 0,
                        scale: 3,
                        rotate: fromLeft ? 20 : -20,
                      }}
                      whileInView={{
                        opacity: 1,
                        scale: 1,
                        rotate: fromLeft ? 3 : -3,
                      }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 13,
                        delay: 0.3,
                      }}
                    >
                      {section.sfx}
                    </motion.span>

                    {/* Toggle row */}
                    <button
                      type="button"
                      className="cm-toggle"
                      onClick={() => toggleSection(index)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      style={{
                        width: "100%",
                        background: isOpen ? section.bg : "transparent",
                        border: "none",
                        borderRadius: 14,
                        padding: "18px 20px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        textAlign: "left",
                        transition: "background 0.2s",
                      }}
                    >
                      {/* Emoji panel */}
                      <div
                        className="cm-halftone"
                        style={{
                          width: 64,
                          height: 64,
                          backgroundColor: section.color,
                          border: `3px solid ${INK}`,
                          borderRadius: 12,
                          boxShadow: `4px 4px 0 ${INK}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 32,
                          flexShrink: 0,
                          transform: isOpen ? "rotate(-8deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                        }}
                      >
                        {section.emoji}
                      </div>

                      {/* Title + tagline */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          className="font-comic"
                          style={{
                            fontSize: "clamp(1.6rem, 4vw, 2.1rem)",
                            color: INK,
                            lineHeight: 1.1,
                            letterSpacing: "0.04em",
                          }}
                        >
                          {section.title}
                        </div>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: "0.92rem",
                            color: "#555",
                            marginTop: 2,
                          }}
                        >
                          {section.highlight}
                        </div>
                      </div>

                      {/* Chevron */}
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: "50%",
                          background: isOpen ? section.color : "#fff",
                          border: `3px solid ${INK}`,
                          boxShadow: `3px 3px 0 ${INK}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {isOpen ? (
                          <FiChevronUp
                            style={{
                              width: 22,
                              height: 22,
                              color: "#fff",
                              strokeWidth: 3,
                            }}
                          />
                        ) : (
                          <FiChevronDown
                            style={{
                              width: 22,
                              height: 22,
                              color: INK,
                              strokeWidth: 3,
                            }}
                          />
                        )}
                      </div>
                    </button>

                    {/* Speech bubble content */}
                    {isOpen && (
                      <div
                        id={panelId}
                        role="region"
                        aria-label={section.title}
                        style={{ padding: "6px 22px 26px" }}
                      >
                        <motion.div
                          /* Bubble pops out from its tail */
                          initial={{
                            opacity: 0,
                            scale: 0.6,
                            y: -10,
                            rotate: -2,
                          }}
                          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 18,
                          }}
                          style={{
                            position: "relative",
                            background: "#fff",
                            border: `3px solid ${INK}`,
                            borderRadius: 22,
                            padding: "18px 22px",
                            boxShadow: `5px 5px 0 ${section.color}`,
                            marginTop: 14,
                            transformOrigin: "40px 0px",
                          }}
                        >
                          {/* Bubble tail (outer = border, inner = fill) */}
                          <span
                            aria-hidden
                            style={{
                              position: "absolute",
                              top: -19,
                              left: 36,
                              width: 0,
                              height: 0,
                              borderLeft: "14px solid transparent",
                              borderRight: "14px solid transparent",
                              borderBottom: `19px solid ${INK}`,
                            }}
                          />
                          <span
                            aria-hidden
                            style={{
                              position: "absolute",
                              top: -12,
                              left: 40,
                              width: 0,
                              height: 0,
                              borderLeft: "10px solid transparent",
                              borderRight: "10px solid transparent",
                              borderBottom: "14px solid #fff",
                            }}
                          />
                          <p
                            style={{
                              fontWeight: 600,
                              fontSize: "1.05rem",
                              color: INK,
                              lineHeight: 1.7,
                              margin: 0,
                              maxWidth: "68ch",
                            }}
                          >
                            {section.content}
                          </p>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── Footer CTA ── */}
          <motion.div
            className="cm-halftone"
            style={{
              marginTop: 72,
              backgroundColor: "#FF5FA2",
              border: `5px solid ${INK}`,
              borderRadius: 24,
              boxShadow: `10px 10px 0 ${INK}`,
              padding: "44px 24px 40px",
              textAlign: "center",
              position: "relative",
            }}
            initial={{ opacity: 0, scale: 0.85, y: 60, rotate: -2 }}
            whileInView={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ type: "spring", stiffness: 160, damping: 14 }}
          >
            <motion.span
              className="font-comic-chip"
              style={{
                position: "absolute",
                top: -22,
                left: "50%",
                x: "-50%",
                background: "#FFD60A",
                color: INK,
                border: `4px solid ${INK}`,
                borderRadius: 10,
                padding: "4px 18px",
                fontSize: "1.2rem",
                letterSpacing: "0.08em",
                boxShadow: `4px 4px 0 ${INK}`,
                whiteSpace: "nowrap",
              }}
              initial={{ opacity: 0, scale: 3, rotate: 14 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -3 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 13,
                delay: 0.35,
              }}
            >
              TO BE CONTINUED...
            </motion.span>

            <motion.h2
              className="font-comic cm-outline-text"
              style={{
                fontSize: "clamp(2.2rem, 6vw, 3.4rem)",
                margin: "0 0 14px",
                lineHeight: 1.05,
              }}
              initial={{ opacity: 0, scale: 2.2, rotate: -6, y: -30 }}
              whileInView={{
                opacity: [0, 1, 1, 1],
                scale: [2.2, 0.94, 1.03, 1],
                rotate: [-6, 1, -0.5, 0],
                y: [-30, 0, 0, 0],
              }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: 0.7,
                delay: 0.4,
                times: [0, 0.55, 0.75, 1],
                ease: "easeOut",
              }}
            >
              Questions About Our Terms?
            </motion.h2>

            <motion.p
              style={{
                fontWeight: 800,
                color: INK,
                fontSize: "1.1rem",
                lineHeight: 1.6,
                margin: "0 auto 28px",
                maxWidth: 480,
                background: "#fff",
                border: `3px solid ${INK}`,
                borderRadius: 14,
                padding: "10px 16px",
                boxShadow: `4px 4px 0 ${INK}`,
              }}
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ ...POP_SPRING, delay: 0.9 }}
            >
              Our team is here to help clarify any aspect of these terms and
              conditions.
            </motion.p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 20,
              }}
            >
              {/* Wrapper carries the pop so the button's hover CSS keeps working */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -10 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ ...POP_SPRING, delay: 1.1 }}
              >
                <a
                  href="mailto:info@mentoons.com"
                  className="cm-cta font-comic"
                >
                  <FiMail style={{ width: 24, height: 24, strokeWidth: 3 }} />
                  Contact Support
                </a>
              </motion.div>
              <motion.span
                className="font-comic-chip"
                style={{
                  background: "#fff",
                  color: INK,
                  border: `3px solid ${INK}`,
                  borderRadius: 999,
                  padding: "8px 18px",
                  fontSize: "1rem",
                  letterSpacing: "0.05em",
                  boxShadow: `4px 4px 0 ${INK}`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ ...POP_SPRING, delay: 1.3 }}
              >
                ⚡ Response time: usually within 24 hours
              </motion.span>
            </div>
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
};

export default PolicyPage;
