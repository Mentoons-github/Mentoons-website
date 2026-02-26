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
      <div className="mb-1">
        <h2
          ref={titleRef}
          className="text-lg font-semibold text-gray-800 sm:text-xl"
        >
          {activeRequestTab === "receive"
            ? "Friend Requests"
            : activeRequestTab === "send"
              ? "Friend Suggestions"
              : "My Friends"}
        </h2>
      </div>
      <div
        ref={tabsRef}
        className="sticky top-0 z-10 flex gap-2 mb-1 border-b border-gray-200 bg-white"
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.value}
            ref={(el) => (tabButtonRefs.current[i] = el)}
            className={`flex-1 py-1.5 text-sm font-medium text-gray-600 transition-colors duration-200 ${
              activeRequestTab === tab.value
                ? "text-orange-500 border-b-2 border-orange-500"
                : "hover:text-orange-500"
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
        className="flex-1 overflow-y-auto p-1 max-h-[400px]"
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
