import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Fixed full-page background. As the user scrolls the WHOLE page, the view
 * travels from the high sky (balloons, hot-air balloon, bird flocks, clouds)
 * down to a layered, living countryside (hills, windmill, house, trees,
 * fence, flowers, butterflies).
 *
 * Usage: render <SkyToLandBackground /> once, anywhere in the page.
 * The page's own wrappers/body must not have an opaque background.
 *
 * npm i gsap @gsap/react
 */

const INK = "#1a1a1a";
const S = {
  stroke: INK,
  strokeWidth: 3,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

type P = { style: React.CSSProperties; depth?: number };

const Cloud = ({ style, depth = 0 }: P) => {
  const shapes = (
    <>
      <circle cx="50" cy="55" r="26" />
      <circle cx="85" cy="40" r="32" />
      <circle cx="122" cy="55" r="26" />
      <rect x="24" y="55" width="124" height="26" rx="13" />
    </>
  );
  return (
    <svg
      className="cloud sky-item absolute"
      data-depth={depth}
      viewBox="0 0 170 90"
      style={style}
    >
      <g fill="#fff" {...S} strokeWidth={7}>
        {shapes}
      </g>
      <g fill="#fff">{shapes}</g>
    </svg>
  );
};

const Balloon = ({ color, style, depth = 0 }: { color: string } & P) => (
  <div className="sky-item absolute" data-depth={depth} style={style}>
    <div className="bob">
      <svg viewBox="0 0 70 150" className="w-full overflow-visible">
        <path
          d="M35 84 Q20 102 35 118 T35 146"
          fill="none"
          stroke={INK}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <ellipse cx="35" cy="38" rx="30" ry="36" fill={color} {...S} />
        <polygon
          points="29,76 41,76 35,85"
          fill={color}
          {...S}
          strokeWidth={2.5}
        />
        <ellipse cx="24" cy="24" rx="6" ry="10" fill="#fff" opacity="0.55" />
      </svg>
    </div>
  </div>
);

const HotAir = ({ style, depth = 0 }: P) => (
  <div className="sky-item absolute" data-depth={depth} style={style}>
    <div className="bob">
      <svg viewBox="0 0 120 170" className="w-full overflow-visible">
        <path
          d="M60 4 C8 4 2 62 32 100 L48 118 H72 L88 100 C118 62 112 4 60 4Z"
          fill="#FF6B6B"
          {...S}
        />
        <path
          d="M60 4 C38 20 38 92 50 118 H70 C82 92 82 20 60 4Z"
          fill="#FFD43B"
          {...S}
        />
        <path
          d="M60 4 C54 30 54 90 56 118 H64 C66 90 66 30 60 4Z"
          fill="#4DABF7"
          {...S}
          strokeWidth={2}
        />
        <path
          d="M48 118 L50 142 M72 118 L70 142"
          stroke={INK}
          strokeWidth="2.5"
        />
        <rect
          x="45"
          y="142"
          width="30"
          height="20"
          rx="3"
          fill="#B8733A"
          {...S}
        />
      </svg>
    </div>
  </div>
);

const V = [
  [40, 0],
  [20, 26],
  [60, 26],
  [0, 52],
  [80, 52],
];
const Flock = ({ style, depth = 0 }: P) => (
  <div
    className="flock sky-item absolute"
    data-depth={depth}
    style={{ left: 0, ...style }}
  >
    {V.map(([x, y], i) => (
      <svg
        key={i}
        viewBox="0 0 50 26"
        className="absolute"
        style={{ left: `${x}%`, top: `${y}%`, width: "26%" }}
      >
        <path
          className="wing"
          d="M2 16 Q14 -4 25 14 Q36 -4 48 16"
          fill="none"
          stroke={INK}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ))}
  </div>
);

const Tree = ({
  style,
  fill = "#3FA83A",
}: {
  style: React.CSSProperties;
  fill?: string;
}) => (
  <svg className="sway absolute" viewBox="0 0 100 160" style={style}>
    <rect x="42" y="90" width="16" height="65" fill="#B8733A" {...S} />
    <g fill={fill} {...S}>
      <circle cx="30" cy="75" r="25" />
      <circle cx="72" cy="75" r="25" />
      <circle cx="50" cy="52" r="38" />
    </g>
    <circle cx="40" cy="60" r="4.5" fill="#FF6B6B" />
    <circle cx="63" cy="72" r="4.5" fill="#FF6B6B" />
  </svg>
);

const Flower = ({
  left,
  top,
  color,
}: {
  left: string;
  top: string;
  color: string;
}) => (
  <svg
    className="sway absolute"
    viewBox="0 0 40 70"
    style={{ left, top, width: "clamp(20px,2.8vw,38px)" }}
  >
    <path d="M20 34 V68" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
    <g fill={color} {...S} strokeWidth={2.5}>
      <circle cx="20" cy="12" r="8" />
      <circle cx="32" cy="22" r="8" />
      <circle cx="8" cy="22" r="8" />
      <circle cx="26" cy="34" r="8" />
      <circle cx="14" cy="34" r="8" />
    </g>
    <circle cx="20" cy="24" r="8" fill="#FFD43B" {...S} strokeWidth={2.5} />
  </svg>
);

const Butterfly = ({
  style,
  color,
}: {
  style: React.CSSProperties;
  color: string;
}) => (
  <div className="absolute" style={style}>
    <svg className="bfly w-full overflow-visible" viewBox="0 0 40 30">
      <g className="bwings" fill={color} {...S} strokeWidth={2}>
        <path d="M20 15 Q4 -4 4 12 Q4 24 20 15Z" />
        <path d="M20 15 Q36 -4 36 12 Q36 24 20 15Z" />
      </g>
      <path d="M20 8 V24" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </svg>
  </div>
);

const BALLOONS = [
  ["#FF6B6B", "6%", "5%", "clamp(46px,6.5vw,88px)", -0.35],
  ["#4DABF7", "20%", "13%", "clamp(38px,5.5vw,74px)", -0.15],
  ["#FFD43B", "39%", "4%", "clamp(50px,7.5vw,98px)", -0.3],
  ["#69DB7C", "58%", "11%", "clamp(38px,5.5vw,74px)", -0.2],
  ["#DA77F2", "80%", "6%", "clamp(46px,6.5vw,88px)", -0.4],
  ["#FF922B", "33%", "30%", "clamp(34px,4.5vw,62px)", 0.1],
  ["#4DABF7", "86%", "27%", "clamp(34px,4.5vw,62px)", 0.05],
  ["#FF6B6B", "12%", "38%", "clamp(30px,4vw,56px)", 0.2],
] as const;

const CLOUDS = [
  ["3%", "4%", 16, 0.15],
  ["50%", "9%", 13, 0.3],
  ["28%", "20%", 11, 0.45],
  ["70%", "24%", 15, 0.1],
  ["8%", "33%", 18, -0.1],
  ["55%", "40%", 12, 0.35],
  ["80%", "47%", 14, 0.2],
  ["20%", "52%", 17, 0.05],
  ["45%", "62%", 13, 0.3],
  ["2%", "68%", 12, 0.4],
  ["68%", "72%", 16, 0.1],
] as const;

const FLOWER_COLORS = ["#FF8FAB", "#fff", "#FF6B6B", "#DA77F2", "#FFD43B"];

const SkyToLandBackground = () => {
  // page height changes as content loads — keep ScrollTrigger in sync
  useEffect(() => {
    let t: number;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(t);
      t = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    ro.observe(document.body);
    return () => {
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const r = gsap.utils.random;

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // ---------- idle life ----------
      gsap.utils
        .toArray<HTMLElement>(".bob")
        .forEach((el, i) =>
          gsap.to(el, {
            y: -14,
            rotation: i % 2 ? 4 : -4,
            transformOrigin: "50% 100%",
            duration: r(2, 3.6),
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          }),
        );
      gsap.utils
        .toArray<HTMLElement>(".flock")
        .forEach((el, i) =>
          gsap
            .fromTo(
              el,
              { x: "-30vw" },
              { x: "130vw", duration: 34 + i * 9, repeat: -1, ease: "none" },
            )
            .progress(0.15 + i * 0.3),
        );
      gsap.to(".wing", {
        scaleY: 0.35,
        transformOrigin: "50% 100%",
        duration: 0.28,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.06,
      });
      gsap.to(".sun-rays", {
        rotation: 360,
        transformOrigin: "50% 50%",
        duration: 50,
        repeat: -1,
        ease: "none",
      });
      gsap.to(".blades", {
        rotation: 360,
        transformOrigin: "50% 50%",
        duration: 9,
        repeat: -1,
        ease: "none",
      });
      gsap.utils.toArray<HTMLElement>(".sway").forEach((el) => {
        const a = r(2, 5);
        gsap.fromTo(
          el,
          { rotation: -a },
          {
            rotation: a,
            transformOrigin: "50% 100%",
            duration: r(2, 3.5),
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          },
        );
      });
      gsap.utils
        .toArray<HTMLElement>(".bfly")
        .forEach((el) =>
          gsap.to(el, {
            x: () => r(-70, 70),
            y: () => r(-40, 40),
            duration: r(2, 3.5),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            repeatRefresh: true,
          }),
        );
      gsap.to(".bwings", {
        scaleX: 0.3,
        transformOrigin: "50% 50%",
        duration: 0.15,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
      gsap.to(".kite-sway", {
        rotation: 8,
        transformOrigin: "50% 0%",
        duration: 2.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      // ---------- whole-page scroll scrub ----------
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });

      tl.to(".world", { yPercent: -66.6667, duration: 10 }, 0)
        // sky parallax: depth > 0 lingers, depth < 0 rises away faster
        .to(
          ".sky-item",
          {
            y: (_i, el: HTMLElement) =>
              `${parseFloat(el.dataset.depth || "0") * 70}vh`,
            duration: 10,
          },
          0,
        )
        .to(
          ".cloud",
          {
            x: (i) => `${(i % 2 ? -1 : 1) * (5 + (i % 4) * 3)}vw`,
            duration: 10,
          },
          0,
        )
        // the sun stays with you, sinking and warming as you descend
        .to(".sun", { y: "32vh", x: "-6vw", duration: 10 }, 0)
        .to(".sun-core", { fill: "#FF9F43", duration: 10 }, 0)
        // the land rises into place in three depth layers
        .from(".layer-far", { y: "14vh", duration: 5 }, 5)
        .from(".layer-mid", { y: "26vh", duration: 5 }, 5)
        .from(".layer-near", { y: "46vh", duration: 5 }, 5);
    });

    // reduced motion: static view of the horizon, no movement
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".world", { yPercent: -60 });
    });
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Tall world: sky on top, land at the bottom */}
      <div
        className="world absolute inset-x-0 top-0 h-[300vh] will-change-transform"
        style={{
          background:
            "linear-gradient(to bottom,#1E90E8 0%,#5BC0F8 25%,#9BE0FF 55%,#D8F4FF 72%,#FFEFC2 80%,#7ED957 80%,#3FAE3A 100%)",
        }}
      >
        {CLOUDS.map(([l, t, w, d], i) => (
          <Cloud
            key={i}
            depth={d}
            style={{
              left: l,
              top: t,
              width: `clamp(${w * 6}px,${w}vw,${w * 14}px)`,
              opacity: d > 0.3 ? 0.85 : 1,
            }}
          />
        ))}

        <HotAir
          depth={-0.25}
          style={{ left: "70%", top: "22%", width: "clamp(70px,10vw,140px)" }}
        />
        {BALLOONS.map(([c, l, t, w, d], i) => (
          <Balloon
            key={i}
            color={c}
            depth={d}
            style={{ left: l, top: t, width: w }}
          />
        ))}

        <Flock
          depth={-0.1}
          style={{
            top: "7%",
            width: "clamp(90px,12vw,170px)",
            height: "clamp(50px,7vw,90px)",
          }}
        />
        <Flock
          depth={0.05}
          style={{
            top: "18%",
            width: "clamp(60px,8vw,120px)",
            height: "clamp(34px,5vw,64px)",
          }}
        />
        <Flock
          depth={0.2}
          style={{
            top: "42%",
            width: "clamp(70px,9vw,130px)",
            height: "clamp(40px,5.5vw,70px)",
          }}
        />

        {/* Land: the bottom screenful of the world */}
        <div className="absolute inset-x-0 bottom-0 h-screen">
          {/* FAR layer: rainbow, far hills, windmill, kite */}
          <div className="layer-far absolute inset-0">
            <svg
              className="absolute"
              viewBox="0 0 400 200"
              style={{
                left: "50%",
                top: "4%",
                width: "min(80vw,900px)",
                transform: "translateX(-50%)",
                opacity: 0.9,
              }}
            >
              {[
                "#FF6B6B",
                "#FF922B",
                "#FFD43B",
                "#69DB7C",
                "#4DABF7",
                "#DA77F2",
              ].map((c, i) => (
                <path
                  key={c}
                  d={`M${20 + i * 14} 200 A${180 - i * 14} ${180 - i * 14} 0 0 1 ${380 - i * 14} 200`}
                  fill="none"
                  stroke={c}
                  strokeWidth="15"
                />
              ))}
            </svg>
            <svg
              className="absolute inset-x-0 w-full"
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
              style={{ top: "26%", height: "26%" }}
            >
              <path
                d="M0 200 V90 Q160 10 340 80 T660 70 T1000 50 V200Z"
                fill="#B5EBA9"
                {...S}
              />
            </svg>
            <svg
              className="absolute"
              viewBox="0 0 100 160"
              style={{
                left: "72%",
                top: "17%",
                width: "clamp(60px,8vw,115px)",
              }}
            >
              <polygon
                points="28,152 72,152 60,62 40,62"
                fill="#FFF1CC"
                {...S}
              />
              <polygon points="34,64 66,64 50,38" fill="#FF6B6B" {...S} />
              <rect
                x="44"
                y="128"
                width="12"
                height="24"
                rx="3"
                fill="#FFAA15"
                {...S}
                strokeWidth={2.5}
              />
              <g className="blades" fill="#fff" {...S} strokeWidth={2.5}>
                {[0, 90, 180, 270].map((a) => (
                  <rect
                    key={a}
                    x="45"
                    y="12"
                    width="10"
                    height="48"
                    transform={`rotate(${a} 50 60)`}
                  />
                ))}
              </g>
              <circle
                cx="50"
                cy="60"
                r="5"
                fill="#FFAA15"
                {...S}
                strokeWidth={2.5}
              />
            </svg>
            <div
              className="absolute"
              style={{ right: "10%", top: "4%", width: "clamp(44px,6vw,80px)" }}
            >
              <svg
                className="kite-sway w-full overflow-visible"
                viewBox="0 0 80 190"
              >
                <polygon
                  points="40,0 76,44 40,100 4,44"
                  fill="#FFAA15"
                  {...S}
                />
                <path d="M40 0 V100 M4 44 H76" stroke={INK} strokeWidth="2.5" />
                <path
                  d="M40 100 Q20 120 40 135 T40 170"
                  fill="none"
                  stroke={INK}
                  strokeWidth="2.5"
                />
                <polygon
                  points="30,128 40,134 30,140"
                  fill="#FF6B6B"
                  {...S}
                  strokeWidth={2.5}
                />
                <polygon
                  points="50,150 40,156 50,162"
                  fill="#4DABF7"
                  {...S}
                  strokeWidth={2.5}
                />
              </svg>
            </div>
          </div>

          {/* MID layer: mid hill, house, trees */}
          <div className="layer-mid absolute inset-0">
            <svg
              className="absolute inset-x-0 w-full"
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
              style={{ top: "38%", height: "30%" }}
            >
              <path
                d="M0 200 V100 Q200 20 420 90 T800 60 T1000 80 V200Z"
                fill="#7ED957"
                {...S}
              />
            </svg>
            <Tree
              style={{
                left: "36%",
                top: "34%",
                width: "clamp(50px,7vw,100px)",
              }}
              fill="#2F9E44"
            />
            <Tree
              style={{
                left: "88%",
                top: "33%",
                width: "clamp(56px,8vw,110px)",
              }}
            />
            <svg
              className="absolute"
              viewBox="0 0 200 170"
              style={{
                left: "9%",
                top: "28%",
                width: "clamp(130px,18vw,260px)",
              }}
            >
              <rect
                x="20"
                y="80"
                width="160"
                height="85"
                fill="#FFF1CC"
                {...S}
              />
              <polygon points="8,82 100,8 192,82" fill="#FF6B6B" {...S} />
              <rect
                x="85"
                y="108"
                width="32"
                height="57"
                rx="4"
                fill="#FFAA15"
                {...S}
              />
              <rect
                x="34"
                y="98"
                width="36"
                height="32"
                fill="#8ED8FF"
                {...S}
              />
              <rect
                x="130"
                y="98"
                width="36"
                height="32"
                fill="#8ED8FF"
                {...S}
              />
              <circle cx="100" cy="52" r="10" fill="#8ED8FF" {...S} />
              <rect
                x="138"
                y="-6"
                width="16"
                height="36"
                fill="#B8733A"
                {...S}
              />
            </svg>
            <Tree
              style={{
                left: "60%",
                top: "40%",
                width: "clamp(60px,9vw,125px)",
              }}
              fill="#37B24D"
            />
          </div>

          {/* NEAR layer: front hill, fence, trees, flowers, butterflies */}
          <div className="layer-near absolute inset-0">
            <svg
              className="absolute inset-x-0 w-full"
              viewBox="0 0 1000 300"
              preserveAspectRatio="none"
              style={{ top: "56%", height: "44%" }}
            >
              <path
                d="M0 300 V80 Q250 0 520 60 T1000 40 V300Z"
                fill="#4FBF45"
                {...S}
              />
            </svg>
            <Tree
              style={{
                left: "1%",
                top: "42%",
                width: "clamp(80px,12vw,170px)",
              }}
              fill="#2B8A3E"
            />
            <div className="absolute inset-x-0" style={{ top: "62%" }}>
              <div
                className="absolute inset-x-0 h-3 bg-white border-y-[3px] border-[#1a1a1a]"
                style={{ top: "40%" }}
              />
              <div className="relative flex justify-around">
                {Array.from({ length: 22 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white border-[3px] border-[#1a1a1a] rounded-t-md"
                    style={{
                      width: "clamp(12px,1.8vw,22px)",
                      height: "clamp(28px,4vw,50px)",
                    }}
                  />
                ))}
              </div>
            </div>
            {Array.from({ length: 22 }).map((_, i) => (
              <Flower
                key={i}
                left={`${2 + (i % 11) * 9 + (i > 10 ? 4 : 0)}%`}
                top={`${i > 10 ? 88 : 78}%`}
                color={FLOWER_COLORS[i % 5]}
              />
            ))}
            <Butterfly
              color="#FF8FAB"
              style={{ left: "30%", top: "70%", width: "clamp(22px,3vw,40px)" }}
            />
            <Butterfly
              color="#FFD43B"
              style={{
                left: "64%",
                top: "76%",
                width: "clamp(20px,2.6vw,34px)",
              }}
            />
            <Butterfly
              color="#DA77F2"
              style={{ left: "82%", top: "68%", width: "clamp(22px,3vw,40px)" }}
            />
          </div>
        </div>
      </div>

      {/* Sun: stays on screen, sinks and warms as you scroll */}
      <div
        className="sun absolute"
        style={{ right: "6%", top: "2%", width: "clamp(110px,16vw,220px)" }}
      >
        <div
          className="absolute inset-[-40%] rounded-full"
          style={{
            background:
              "radial-gradient(circle,rgba(255,236,150,.75) 0%,rgba(255,236,150,0) 65%)",
          }}
        />
        <svg className="relative w-full" viewBox="0 0 200 200">
          <g
            className="sun-rays"
            stroke="#FFAA15"
            strokeWidth="9"
            strokeLinecap="round"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={i}
                x1="100"
                y1="12"
                x2="100"
                y2="32"
                transform={`rotate(${i * 30} 100 100)`}
              />
            ))}
          </g>
          <circle
            className="sun-core"
            cx="100"
            cy="100"
            r="52"
            fill="#FFD43B"
            {...S}
            strokeWidth={4}
          />
          <circle cx="84" cy="92" r="5" fill={INK} />
          <circle cx="116" cy="92" r="5" fill={INK} />
          <path
            d="M82 114 Q100 130 118 114"
            fill="none"
            stroke={INK}
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default SkyToLandBackground;
