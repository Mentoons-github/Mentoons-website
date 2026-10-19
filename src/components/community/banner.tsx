import { CSSProperties } from "react";

const bannerStyle: CSSProperties = {
  backgroundColor: "#fb923c",
  backgroundImage: "radial-gradient(#00000026 1.5px, transparent 1.5px)",
  backgroundSize: "16px 16px",
  borderBottom: "6px solid #111",
  boxShadow: "0 8px 0 #111",
  position: "relative",
  zIndex: 1,
};

const titleStyle: CSSProperties = {
  fontFamily: "var(--font-comic-chip)",
  fontWeight: 400,
  letterSpacing: "0.08em",
  color: "#fff",
  textShadow:
    "4px 4px 0 #111, -2px -2px 0 #111, 2px -2px 0 #111, -2px 2px 0 #111, 2px 2px 0 #111",
  transform: "rotate(-1.5deg)",
  maxWidth: "42rem",
};

const textBubbleStyle: CSSProperties = {
  fontFamily: "var(--font-comic)",
  fontSize: "1.35rem",
  letterSpacing: "0.05em",
  lineHeight: 1.5,
  color: "#111",
  background: "#fff",
  border: "4px solid #111",
  borderRadius: "16px",
  boxShadow: "6px 6px 0 #111",
  padding: "1rem 1.5rem",
  maxWidth: "48rem",
  marginTop: "1.5rem",
};

const CommunityBanner = () => {
  return (
    <div
      className="flex flex-col items-start justify-center py-10 md:py-20 px-5 md:px-10"
      style={bannerStyle}
    >
      <h1
        className="text-start text-3xl md:text-5xl lg:text-7xl"
        style={titleStyle}
      >
        JOIN OUR COMMUNITY
      </h1>
      <p className="text-start" style={textBubbleStyle}>
        Connect with parents, children, and caregivers in a safe, friendly
        space. Share experiences, ask questions, and find support as we grow and
        learn together.
      </p>
    </div>
  );
};

export default CommunityBanner;
