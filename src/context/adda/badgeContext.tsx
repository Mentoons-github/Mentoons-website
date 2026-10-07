import { createContext, useContext, useState, useEffect } from "react";
import BadgeViewModal from "@/components/modals/badge/badgeViewModal";

interface Badge {
  _id: string;
  name: string;
  animation: any;
}

interface BadgeContextType {
  showBadge: (badge: Badge | Badge[]) => void;
}

const BadgeContext = createContext<BadgeContextType | null>(null);

export const useBadge = () => {
  const context = useContext(BadgeContext);
  if (!context) throw new Error("useBadge must be used within BadgeProvider");
  return context;
};

export const BadgeProvider = ({ children }: { children: React.ReactNode }) => {
  const [badgeQueue, setBadgeQueue] = useState<Badge[]>([]);
  const [currentBadge, setCurrentBadge] = useState<Badge | null>(null);

  useEffect(() => {
    if (badgeQueue.length > 0 && !currentBadge) {
      const nextBadge = badgeQueue[0];
      setCurrentBadge(nextBadge);

      setBadgeQueue((prev) => prev.slice(1));

      const timer = setTimeout(() => {
        setCurrentBadge(null);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [badgeQueue, currentBadge]);

  const showBadge = (badgeData: Badge | Badge[]) => {
    const badges = Array.isArray(badgeData) ? badgeData : [badgeData];
    setBadgeQueue((prev) => [...prev, ...badges]);
  };

  const closeBadge = () => {
    setCurrentBadge(null);
  };

  return (
    <BadgeContext.Provider value={{ showBadge }}>
      {children}
      {currentBadge && (
        <BadgeViewModal badge={currentBadge} onClose={closeBadge} />
      )}
    </BadgeContext.Provider>
  );
};
