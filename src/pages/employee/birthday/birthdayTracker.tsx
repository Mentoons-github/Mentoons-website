import { useState, useEffect } from "react";
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
    null
  );
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      const match = celebrations.find(
        (c) =>
          c.type === "Birthday" &&
          c.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  const getUpcoming = (): UpcomingCelebration[] => {
    const today = new Date();
    return celebrations
      .map((c) => {
        const cd = new Date(c.date);
        if (isNaN(cd.getTime())) return null;
        if (cd < today) cd.setFullYear(today.getFullYear() + 1);
        const daysUntil = Math.ceil(
          (cd.getTime() - today.getTime()) / 86400000
        );
        return { ...c, daysUntil };
      })
      .filter((c): c is UpcomingCelebration => c !== null)
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 5);
  };

  const currentMonthCelebs = celebrations.filter(
    (c) => new Date(c.date).getMonth() === currentDate.getMonth()
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
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-2xl">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-4 md:p-6 lg:p-8 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 sm:w-72 sm:h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div
          className="absolute top-40 right-10 w-64 h-64 sm:w-72 sm:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-8 left-1/2 w-64 h-64 sm:w-72 sm:h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute text-xl sm:text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-50px`,
                animation: `fall ${2 + Math.random() * 3}s linear`,
              }}
            >
              {
                ["Party", "Balloon", "Gift", "Sparkles", "Celebrate"][
                  Math.floor(Math.random() * 5)
                ]
              }
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes fall { to { transform: translateY(100vh) rotate(360deg); } }`}</style>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
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
                    1
                  )
                )
              }
              onNextMonth={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1,
                    1
                  )
                )
              }
              onToday={() => setCurrentDate(new Date())}
              onDateClick={setSelectedDate}
            />
          </div>

          <div className="space-y-4 sm:space-y-6">
            <ThisMonthPanel
              celebrations={currentMonthCelebs}
              onDateClick={setSelectedDate}
            />
            <ComingSoonPanel celebrations={getUpcoming()} />
            <TeamStatsPanel
              total={celebrations.length}
              thisMonth={currentMonthCelebs.length}
            />
          </div>
        </div>

        {selectedDate && (
          <CelebrationModal
            date={selectedDate}
            month={currentDate.getMonth()}
            year={currentDate.getFullYear()}
            celebrations={celebrations.filter(
              (c) =>
                new Date(c.date).getDate() === selectedDate &&
                new Date(c.date).getMonth() === currentDate.getMonth()
            )}
            onClose={() => setSelectedDate(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Celebrations;
