import { ChevronLeft, ChevronRight, Cake } from "lucide-react";
import { Celebration } from "@/types";

interface CalendarProps {
  currentDate: Date;
  celebrations: Celebration[];
  searchedBirthdayDate: Date | null;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onDateClick: (day: number) => void;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const CelebrationCalender: React.FC<CalendarProps> = ({
  currentDate,
  celebrations,
  searchedBirthdayDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  onDateClick,
}) => {
  const getDaysInMonth = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const getFirstDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDay(currentDate);
  const today = new Date();

  const isToday = (day: number) =>
    day === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();

  const isSearched = (day: number) =>
    searchedBirthdayDate &&
    day === searchedBirthdayDate.getDate() &&
    currentDate.getMonth() === searchedBirthdayDate.getMonth() &&
    currentDate.getFullYear() === searchedBirthdayDate.getFullYear();

  const getCelebrationsForDate = (day: number) =>
    celebrations.filter((c) => {
      const cd = new Date(c.date);
      return cd.getDate() === day && cd.getMonth() === currentDate.getMonth();
    });

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border-2 border-blue-200">
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <button
            onClick={onPrevMonth}
            className="p-2 sm:p-3 hover:bg-white/20 rounded-xl transition-all hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </button>
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1 sm:mb-2">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={onToday}
              className="px-4 sm:px-6 py-1.5 sm:py-2 bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-semibold rounded-full transition-all hover:scale-105"
            >
              Today
            </button>
          </div>
          <button
            onClick={onNextMonth}
            className="p-2 sm:p-3 hover:bg-white/20 rounded-xl transition-all hover:scale-110"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
          {daysOfWeek.map((d) => (
            <div
              key={d}
              className="text-white font-bold py-2 sm:py-3 text-sm sm:text-base md:text-lg"
            >
              {d}
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 lg:gap-3">
          {calendarDays.map((day, i) => {
            const celebs = day ? getCelebrationsForDate(day) : [];
            const hasCeleb = celebs.length > 0;
            return (
              <div
                key={i}
                className={`relative aspect-square min-h-[50px] sm:min-h-[70px] md:min-h-[90px] lg:min-h-[100px] rounded-xl sm:rounded-2xl p-2 sm:p-3 transition-all cursor-pointer ${
                  !day
                    ? "bg-transparent"
                    : isSearched(day)
                    ? "bg-gradient-to-br from-yellow-400 to-yellow-500 text-white font-bold shadow-xl ring-2 sm:ring-4 ring-yellow-300 scale-105"
                    : isToday(day)
                    ? "bg-gradient-to-br from-blue-400 to-blue-500 text-white font-bold shadow-xl ring-2 sm:ring-4 ring-blue-300 scale-105"
                    : hasCeleb
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-2xl hover:scale-110 border-2 sm:border-3 border-blue-300"
                    : "bg-white hover:bg-blue-50 hover:shadow-lg border-2 border-blue-100 hover:border-blue-300"
                }`}
                onClick={() => day && onDateClick(day)}
              >
                {day && (
                  <div className="h-full flex flex-col justify-between">
                    <div
                      className={`text-sm sm:text-base md:text-lg lg:text-xl font-bold ${
                        hasCeleb || isToday(day) || isSearched(day)
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                    >
                      {day}
                    </div>
                    {hasCeleb && (
                      <div className="flex justify-center items-end flex-1 pb-1">
                        <Cake className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
                        {celebs.length > 1 && (
                          <span className="absolute top-1 right-1 bg-white text-blue-600 text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                            {celebs.length}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CelebrationCalender;
