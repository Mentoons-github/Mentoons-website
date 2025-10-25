import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Cake,
  Users,
  Gift,
  Calendar,
  Search,
  Mail,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const BirthdayCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [confetti, setConfetti] = useState(false);

  const employees = [
    {
      id: 1,
      name: "Rahul Sharma",
      department: "Engineering",
      birthday: "15",
      month: 0,
      avatar: "👨‍💻",
      email: "rahul@company.com",
    },
    {
      id: 2,
      name: "Priya Patel",
      department: "Design",
      birthday: "22",
      month: 1,
      avatar: "👩‍🎨",
      email: "priya@company.com",
    },
    {
      id: 3,
      name: "Anjali Reddy",
      department: "Marketing",
      birthday: "08",
      month: 2,
      avatar: "👩‍💼",
      email: "anjali@company.com",
    },
    {
      id: 4,
      name: "Vikram Singh",
      department: "Sales",
      birthday: "12",
      month: 3,
      avatar: "👨‍💼",
      email: "vikram@company.com",
    },
    {
      id: 5,
      name: "Sneha Gupta",
      department: "HR",
      birthday: "19",
      month: 4,
      avatar: "👩‍🦱",
      email: "sneha@company.com",
    },
    {
      id: 6,
      name: "Arjun Kumar",
      department: "Engineering",
      birthday: "25",
      month: 5,
      avatar: "👨‍🔧",
      email: "arjun@company.com",
    },
    {
      id: 7,
      name: "Lakshmi Iyer",
      department: "Finance",
      birthday: "03",
      month: 6,
      avatar: "👩‍💻",
      email: "lakshmi@company.com",
    },
    {
      id: 8,
      name: "Karthik Rao",
      department: "Operations",
      birthday: "14",
      month: 7,
      avatar: "👨‍🏭",
      email: "karthik@company.com",
    },
    {
      id: 9,
      name: "Divya Menon",
      department: "Design",
      birthday: "21",
      month: 8,
      avatar: "👩‍🎨",
      email: "divya@company.com",
    },
    {
      id: 10,
      name: "Rohan Joshi",
      department: "Engineering",
      birthday: "18",
      month: 9,
      avatar: "👨‍💻",
      email: "rohan@company.com",
    },
    {
      id: 11,
      name: "Nisha Verma",
      department: "Marketing",
      birthday: "07",
      month: 10,
      avatar: "👩‍💼",
      email: "nisha@company.com",
    },
    {
      id: 12,
      name: "Amit Desai",
      department: "Sales",
      birthday: "29",
      month: 11,
      avatar: "👨‍💼",
      email: "amit@company.com",
    },
    {
      id: 13,
      name: "Pooja Nair",
      department: "HR",
      birthday: "12",
      month: 0,
      avatar: "👩‍🦰",
      email: "pooja@company.com",
    },
    {
      id: 14,
      name: "Sanjay Malhotra",
      department: "Engineering",
      birthday: "28",
      month: 2,
      avatar: "👨‍💻",
      email: "sanjay@company.com",
    },
    {
      id: 15,
      name: "Kavya Krishnan",
      department: "Finance",
      birthday: "05",
      month: 5,
      avatar: "👩‍💼",
      email: "kavya@company.com",
    },
    {
      id: 16,
      name: "Aditya Bhatt",
      department: "Operations",
      birthday: "16",
      month: 8,
      avatar: "👨‍🏭",
      email: "aditya@company.com",
    },
    {
      id: 17,
      name: "Meera Pillai",
      department: "Design",
      birthday: "23",
      month: 11,
      avatar: "👩‍🎨",
      email: "meera@company.com",
    },
    {
      id: 18,
      name: "Manish Agarwal",
      department: "Sales",
      birthday: "30",
      month: 3,
      avatar: "👨‍💼",
      email: "manish@company.com",
    },
    {
      id: 19,
      name: "Deepak Chandra",
      department: "Engineering",
      birthday: "09",
      month: 1,
      avatar: "👨‍💻",
      email: "deepak@company.com",
    },
    {
      id: 20,
      name: "Aarti Shah",
      department: "HR",
      birthday: "17",
      month: 9,
      avatar: "👩‍💼",
      email: "aarti@company.com",
    },
  ];

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

  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const getBirthdaysForDate = (day, month) =>
    employees.filter(
      (emp) => parseInt(emp.birthday) === day && emp.month === month
    );

  const getUpcomingBirthdays = () => {
    const today = new Date();
    const upcoming = employees
      .map((emp) => {
        const bday = new Date(
          today.getFullYear(),
          emp.month,
          parseInt(emp.birthday)
        );
        if (bday < today) bday.setFullYear(today.getFullYear() + 1);
        const daysUntil = Math.ceil((bday - today) / (1000 * 60 * 60 * 24));
        return { ...emp, daysUntil };
      })
      .sort((a, b) => a.daysUntil - b.daysUntil);
    return upcoming.slice(0, 5);
  };

  const goToPreviousMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  const goToNextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  const goToToday = () => setCurrentDate(new Date());

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMonthBirthdays = (
    searchQuery ? filteredEmployees : employees
  ).filter((emp) => emp.month === currentMonth);
  const todaysBirthdays = getBirthdaysForDate(
    new Date().getDate(),
    new Date().getMonth()
  );
  const upcomingBirthdays = getUpcomingBirthdays();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-4 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div
          className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-50px`,
                animation: `fall ${2 + Math.random() * 3}s linear`,
              }}
            >
              {["🎉", "🎊", "🎈", "🎁", "✨"][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fall {
          to { transform: translateY(100vh) rotate(360deg); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Cake className="w-14 h-14 text-blue-500 drop-shadow-lg animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent drop-shadow-md">
              Birthday Calendar
            </h1>
            <Sparkles className="w-14 h-14 text-blue-500 drop-shadow-lg animate-pulse" />
          </div>
          <p className="text-gray-700 text-xl font-medium">
            Celebrate every special moment with your amazing team ✨
          </p>
        </div>

        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by name or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-12 py-5 text-lg rounded-2xl border-3 border-blue-200 focus:border-blue-500 focus:outline-none shadow-xl bg-white/90 backdrop-blur-sm transition-all focus:shadow-2xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xl font-bold transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {todaysBirthdays.length > 0 && (
          <div
            className="mb-8 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-3xl p-8 shadow-2xl border-4 border-white/50"
            onMouseEnter={() => setConfetti(true)}
            onMouseLeave={() => setConfetti(false)}
          >
            <div className="flex items-center gap-4 mb-6">
              <Gift className="w-14 h-14 text-white animate-bounce drop-shadow-lg" />
              <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">
                🎊 Birthday Celebration! 🎊
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {todaysBirthdays.map((emp) => (
                <div
                  key={emp.id}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all hover:shadow-blue-500/50"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-6xl">{emp.avatar}</span>
                    <div>
                      <h3 className="font-bold text-2xl text-gray-800 mb-1">
                        {emp.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {emp.department}
                      </p>
                    </div>
                  </div>
                  <button className="w-full px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-xl hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    Send Birthday Wishes
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-2 border-blue-200">
              <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={goToPreviousMonth}
                    className="p-3 hover:bg-white/20 rounded-xl transition-all hover:scale-110"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="w-7 h-7 text-white" />
                  </button>

                  <div className="text-center">
                    <h2 className="text-4xl font-black text-white mb-2">
                      {months[currentMonth]} {currentYear}
                    </h2>
                    <button
                      onClick={goToToday}
                      className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-full transition-all hover:scale-105"
                    >
                      Jump to Today
                    </button>
                  </div>

                  <button
                    onClick={goToNextMonth}
                    className="p-3 hover:bg-white/20 rounded-xl transition-all hover:scale-110"
                    aria-label="Next month"
                  >
                    <ChevronRight className="w-7 h-7 text-white" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      className="text-center text-white font-bold py-3 text-lg"
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="grid grid-cols-7 gap-3">
                  {calendarDays.map((day, index) => {
                    const birthdays = day
                      ? getBirthdaysForDate(day, currentMonth)
                      : [];
                    const hasBirthday = birthdays.length > 0;
                    const isTodayDate = day && isToday(day);
                    const isHovered = hoveredDay === day;

                    return (
                      <div
                        key={index}
                        className={`relative aspect-square min-h-[100px] rounded-2xl p-3 transition-all duration-300 z-0 ${
                          !day
                            ? "bg-transparent"
                            : isTodayDate
                            ? "bg-gradient-to-br from-blue-400 to-blue-500 text-white font-bold shadow-2xl ring-4 ring-blue-300 scale-105"
                            : hasBirthday
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white cursor-pointer hover:shadow-2xl hover:scale-110 transform border-3 border-blue-300"
                            : "bg-white hover:bg-blue-50 cursor-pointer hover:shadow-lg border-2 border-blue-100 hover:border-blue-300"
                        }`}
                        onClick={() => day && setSelectedDate(day)}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                      >
                        {day && (
                          <>
                            <div className="h-full flex flex-col">
                              <div
                                className={`text-xl font-bold mb-1 ${
                                  hasBirthday || isTodayDate
                                    ? "text-white"
                                    : "text-gray-800"
                                }`}
                              >
                                {day}
                              </div>
                              {hasBirthday && (
                                <div className="flex-1 flex items-center justify-center">
                                  <Cake className="w-8 h-8 text-white drop-shadow-lg" />
                                  {birthdays.length > 1 && (
                                    <span className="absolute top-2 right-2 bg-white text-blue-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                      {birthdays.length}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-2 border-blue-200">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5">
                <div className="flex items-center gap-3">
                  <Calendar className="w-7 h-7 text-white" />
                  <h3 className="text-2xl font-bold text-white">This Month</h3>
                </div>
              </div>

              <div className="p-5 max-h-96 overflow-y-auto">
                {currentMonthBirthdays.length > 0 ? (
                  <div className="space-y-3">
                    {currentMonthBirthdays
                      .sort(
                        (a, b) => parseInt(a.birthday) - parseInt(b.birthday)
                      )
                      .map((emp) => (
                        <div
                          key={emp.id}
                          className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl hover:shadow-xl transition-all cursor-pointer hover:scale-105 transform border-2 border-blue-200 hover:border-blue-400"
                          onClick={() =>
                            setSelectedDate(parseInt(emp.birthday))
                          }
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-4xl">{emp.avatar}</span>
                            <div className="flex-1">
                              <h4 className="font-bold text-lg text-gray-800">
                                {emp.name}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {emp.department}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-black text-blue-600">
                                {emp.birthday}
                              </div>
                              <div className="text-xs text-blue-600 font-semibold">
                                {months[emp.month]}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                    <p className="font-semibold">No birthdays this month</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-2 border-blue-200">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-7 h-7 text-white" />
                  <h3 className="text-2xl font-bold text-white">Coming Soon</h3>
                </div>
              </div>

              <div className="p-5">
                <div className="space-y-3">
                  {upcomingBirthdays.map((emp) => (
                    <div
                      key={emp.id}
                      className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl hover:shadow-lg transition-all border-2 border-blue-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{emp.avatar}</span>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800">
                            {emp.name}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {emp.department}
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-black text-blue-600">
                            {emp.daysUntil}
                          </div>
                          <div className="text-xs text-gray-600">days</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl shadow-2xl p-6 text-white border-4 border-white/30">
              <div className="flex items-center gap-3 mb-5">
                <Users className="w-10 h-10" />
                <h3 className="text-3xl font-black">Team Stats</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/20 rounded-2xl border-2 border-white/30 backdrop-blur-sm">
                  <span className="text-blue-100 font-semibold">
                    Total Team
                  </span>
                  <span className="text-4xl font-black text-blue-300">
                    {employees.length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/20 rounded-2xl border-2 border-white/30 backdrop-blur-sm">
                  <span className="text-blue-100 font-semibold">
                    This Month
                  </span>
                  <span className="text-4xl font-black text-blue-300">
                    {currentMonthBirthdays.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedDate && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedDate(null)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform transition-all border-4 border-blue-400 animate-in"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-3xl font-black text-gray-800 mb-6 flex items-center gap-3">
                <Cake className="w-10 h-10 text-blue-500" />
                {months[currentMonth]} {selectedDate}, {currentYear}
              </h3>

              {getBirthdaysForDate(selectedDate, currentMonth).length > 0 ? (
                <div className="space-y-4">
                  {getBirthdaysForDate(selectedDate, currentMonth).map(
                    (emp) => (
                      <div
                        key={emp.id}
                        className="p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border-3 border-blue-300"
                      >
                        <div className="flex items-center gap-5 mb-4">
                          <span className="text-6xl">{emp.avatar}</span>
                          <div>
                            <h4 className="font-black text-2xl text-gray-800 mb-1">
                              {emp.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {emp.department}
                            </p>
                            <p className="text-xs text-blue-600 font-bold">
                              🎉 Time to celebrate!
                            </p>
                          </div>
                        </div>
                        <button className="w-full px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2">
                          <Mail className="w-5 h-5" />
                          Send Birthday Message
                        </button>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 text-lg font-semibold">
                    No birthdays on this date
                  </p>
                </div>
              )}

              <button
                onClick={() => setSelectedDate(null)}
                className="mt-6 w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 transform"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayCalendar;
