import { useState, useEffect, useMemo } from "react";
import CelebrationHeader from "@/components/common/celebration/header";
import CelebrationSearchBar from "@/components/common/celebration/searchBar";
import TodayCelebrations from "@/components/common/celebration/todayCelebration";
import CelebrationCalender from "@/components/common/celebration/celebrationCalender";
import ThisMonthPanel from "@/components/common/celebration/monthPanel";
import ComingSoonPanel from "@/components/common/celebration/comingSoonPanel";
import TeamStatsPanel from "@/components/common/celebration/teamStatsPanel";
import CelebrationModal from "@/components/common/modal/celebratrionModal";
import { useCelebrations } from "@/hooks/useCelebration";
import { UpcomingCelebration } from "@/types";

const Celebrations = () => {
  const { celebrations, loading, error } = useCelebrations();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedBirthdayDate, setSearchedBirthdayDate] = useState<Date | null>(
    null,
  );
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      const match = celebrations.find(
        (c) =>
          c.type === "Birthday" &&
          c.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      if (match) {
        const d = new Date(match.date);
        if (!isNaN(d.getTime())) {
          setSearchedBirthdayDate(d);
          setCurrentDate(new Date(d.getFullYear(), d.getMonth(), 1));
        }
      } else {
        setSearchedBirthdayDate(null);
      }
    } else {
      setSearchedBirthdayDate(null);
      setCurrentDate(new Date());
    }
  }, [searchQuery, celebrations]);

  const upcomingAll = useMemo((): UpcomingCelebration[] => {
    const today = new Date();
    return celebrations
      .map((c) => {
        const cd = new Date(c.date);
        if (isNaN(cd.getTime())) return null;
        if (cd < today) cd.setFullYear(today.getFullYear() + 1);
        const daysUntil = Math.ceil(
          (cd.getTime() - today.getTime()) / 86400000,
        );
        return { ...c, daysUntil };
      })
      .filter((c): c is UpcomingCelebration => c !== null)
      .sort((a, b) => a.daysUntil - b.daysUntil);
  }, [celebrations]);

  const currentMonthCelebs = celebrations.filter(
    (c) => new Date(c.date).getMonth() === currentDate.getMonth(),
  );
  const todaysCelebs = celebrations.filter((c) => {
    const cd = new Date(c.date);
    const today = new Date();
    return (
      cd.getDate() === today.getDate() && cd.getMonth() === today.getMonth()
    );
  });

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">🎂</div>
          <p className="text-gray-400 font-medium text-sm">
            Loading celebrations...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-rose-500 font-medium">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Subtle dot-grid background pattern */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.4,
        }}
      />

      {/* Confetti overlay */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute text-lg"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-40px`,
                animation: `fall ${2 + Math.random() * 3}s linear forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            >
              {
                ["🎉", "🎈", "🎁", "✨", "🥳", "🌟"][
                  Math.floor(Math.random() * 6)
                ]
              }
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes fall { to { transform: translateY(110vh) rotate(360deg); opacity: 0; } }`}</style>

      <div className="max-w-7xl mx-auto relative z-10">
        <CelebrationHeader />
        <CelebrationSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onClear={() => {
            setSearchQuery("");
            setCurrentDate(new Date());
          }}
          hasNoResult={searchQuery !== "" && !searchedBirthdayDate}
        />
        <TodayCelebrations
          celebrations={todaysCelebs}
          onConfettiEnter={() => setConfetti(true)}
          onConfettiLeave={() => setConfetti(false)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          <div className="lg:col-span-2">
            <CelebrationCalender
              currentDate={currentDate}
              celebrations={celebrations}
              searchedBirthdayDate={searchedBirthdayDate}
              onPrevMonth={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() - 1,
                    1,
                  ),
                )
              }
              onNextMonth={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1,
                    1,
                  ),
                )
              }
              onToday={() => setCurrentDate(new Date())}
              onDateClick={setSelectedDate}
            />
          </div>

          <div className="space-y-4">
            <ThisMonthPanel
              celebrations={currentMonthCelebs}
              onDateClick={setSelectedDate}
            />
            <ComingSoonPanel celebrations={upcomingAll} />
            <TeamStatsPanel
              total={celebrations.length}
              thisMonth={currentMonthCelebs.length}
            />
          </div>
        </div>

        {selectedDate !== null && (
          <CelebrationModal
            date={selectedDate}
            month={currentDate.getMonth()}
            year={currentDate.getFullYear()}
            celebrations={celebrations.filter(
              (c) =>
                new Date(c.date).getDate() === selectedDate &&
                new Date(c.date).getMonth() === currentDate.getMonth(),
            )}
            onClose={() => setSelectedDate(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Celebrations;
