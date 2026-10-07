import { useState, useRef, useEffect } from "react";
import FriendRequestsList from "./friendRequests/requests";
import FriendSuggestionsList from "./friendRequests/suggestions";
import FriendsList from "./friendRequests/friendList";
import { gsap } from "gsap";

const FriendRequest = () => {
  const [activeRequestTab, setActiveRequestTab] = useState<
    "send" | "receive" | "friends"
  >("receive");

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tabButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      containerRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45 },
    )
      .fromTo(
        titleRef.current,
        { x: -15, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.35 },
        "-=0.2",
      )
      .fromTo(
        tabButtonRefs.current.filter(Boolean),
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, stagger: 0.07 },
        "-=0.15",
      )
      .fromTo(
        contentRef.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35 },
        "-=0.1",
      );
  }, []);

  const handleTabChange = (tab: "send" | "receive" | "friends") => {
    gsap.to(contentRef.current, {
      opacity: 0,
      y: 8,
      duration: 0.15,
      ease: "power2.in",
      onComplete: () => {
        setActiveRequestTab(tab);
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
        );
      },
    });
  };

  const handleTabHoverEnter = (el: HTMLButtonElement | null) => {
    if (!el) return;
    gsap.to(el, { y: -2, duration: 0.18, ease: "power2.out" });
  };

  const handleTabHoverLeave = (el: HTMLButtonElement | null) => {
    if (!el) return;
    gsap.to(el, { y: 0, duration: 0.18, ease: "power2.out" });
  };

  const tabs: { label: string; value: "send" | "receive" | "friends" }[] = [
    { label: "Requests", value: "receive" },
    { label: "Suggestions", value: "send" },
    { label: "Friends", value: "friends" },
  ];

  return (
    <div ref={containerRef} className="flex flex-col w-full box-border">
      <style>{`
        .fr-font {
          font-family: var(--font-comic) !important;
          font-weight: 400 !important;
          letter-spacing: 0.05em;
        }
        .fr-chip-font {
          font-family: var(--font-comic-chip, var(--font-comic)) !important;
          font-weight: 400 !important;
          letter-spacing: 0.04em;
        }

        .fr-title {
          background: #fde047;
          color: #000;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 8px;
          padding: 0 10px;
          transform: rotate(-2deg) skewX(-6deg);
          display: inline-block;
        }

        .fr-tabs {
          background: #fff;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 999px;
          padding: 4px;
        }
        .fr-tab {
          background: #fff;
          color: #000;
          border: 3px solid transparent;
          border-radius: 999px;
          cursor: pointer;
          transition: box-shadow 0.1s ease, background 0.1s ease;
        }
        .fr-tab:hover { background: #fef9c3; }
        .fr-tab-on {
          background: #fde047;
          border-color: #000;
          box-shadow: 2px 2px 0 #000;
        }
        .fr-tab-on:hover { background: #facc15; }
        .fr-tab:active { box-shadow: 0 0 0 #000; }

        .fr-content {
          background-color: #fffbeb;
          background-image: radial-gradient(rgba(249,115,22,0.18) 1.5px, transparent 2px);
          background-size: 14px 14px;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          border-radius: 12px;
        }
        .fr-scroll::-webkit-scrollbar { width: 10px; }
        .fr-scroll::-webkit-scrollbar-track {
          background: #fff;
          border: 2px solid #000;
          border-radius: 999px;
        }
        .fr-scroll::-webkit-scrollbar-thumb {
          background: #fde047;
          border: 2px solid #000;
          border-radius: 999px;
        }
      `}</style>

      <div className="mb-3 p-1">
        <h2 ref={titleRef} className="text-lg sm:text-xl">
          <span className="fr-title fr-font pr-1">
            {activeRequestTab === "receive"
              ? "Friend Requests"
              : activeRequestTab === "send"
                ? "Friend Suggestions"
                : "My Friends"}
          </span>
        </h2>
      </div>
      <div
        ref={tabsRef}
        className="fr-tabs sticky top-0 z-10 flex gap-1 mb-3 mx-1"
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.value}
            ref={(el) => (tabButtonRefs.current[i] = el)}
            className={`fr-tab fr-chip-font flex-1 py-1.5 text-sm ${
              activeRequestTab === tab.value ? "fr-tab-on" : ""
            }`}
            onClick={() => handleTabChange(tab.value)}
            onMouseEnter={() => handleTabHoverEnter(tabButtonRefs.current[i])}
            onMouseLeave={() => handleTabHoverLeave(tabButtonRefs.current[i])}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        ref={contentRef}
        className="fr-content fr-scroll flex-1 overflow-y-auto p-2 mx-1 mb-1 max-h-[400px]"
      >
        {activeRequestTab === "receive" ? (
          <FriendRequestsList />
        ) : activeRequestTab === "send" ? (
          <FriendSuggestionsList />
        ) : (
          <FriendsList />
        )}
      </div>
    </div>
  );
};

export default FriendRequest;
