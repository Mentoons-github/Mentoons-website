import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Users,
  Presentation,
  CalendarDays,
  UsersRound,
  Package,
  Phone,
  HelpCircle,
  Briefcase,
  ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ADMIN_BASE = "/admin";

interface SubItem {
  label: string;
  path: string;
}

interface HomeCard {
  key: string;
  title: string;
  icon: LucideIcon;
  color: string;
  path?: string; // direct navigation (no dropdown)
  items?: SubItem[]; // dropdown items
}

const cards: HomeCard[] = [
  // direct navigation cards
  {
    key: "task-report",
    title: "Employee Task Report",
    icon: ClipboardList,
    color: "bg-orange-100 text-orange-600",
    path: "reports-by-date",
  },
  {
    key: "employees",
    title: "Employees",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
    path: "employee-table",
  },
  {
    key: "workshops",
    title: "Workshops",
    icon: Presentation,
    color: "bg-purple-100 text-purple-600",
    path: "workshops",
  },
  {
    key: "meetups",
    title: "Meetups",
    icon: CalendarDays,
    color: "bg-pink-100 text-pink-600",
    path: "meetups",
  },
  {
    key: "community",
    title: "Community",
    icon: UsersRound,
    color: "bg-teal-100 text-teal-600",
    path: "community",
  },
  {
    key: "products",
    title: "Products",
    icon: Package,
    color: "bg-yellow-100 text-yellow-600",
    path: "product-table",
  },

  // dropdown card: One on One Sessions + General Queries
  {
    key: "sessions-queries",
    title: "One on One & General Queries",
    icon: Phone,
    color: "bg-green-100 text-green-600",
    items: [
      { label: "One on One Sessions", path: "session-enquiry" },
      { label: "General Queries", path: "general-queries" },
    ],
  },

  // direct navigation
  {
    key: "quiz",
    title: "Quiz",
    icon: HelpCircle,
    color: "bg-indigo-100 text-indigo-600",
    path: "quiz",
  },

  // dropdown card: Career + Applicants
  {
    key: "career-applicants",
    title: "Career & Applicants",
    icon: Briefcase,
    color: "bg-cyan-100 text-cyan-600",
    items: [
      { label: "Career", path: "all-jobs" },
      { label: "Applicants", path: "view-applications" },
    ],
  },
];

const AdminHome = () => {
  const navigate = useNavigate();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = (path: string) => navigate(`${ADMIN_BASE}/${path}`);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpenKey(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCardClick = (card: HomeCard) => {
    if (card.items) {
      setOpenKey((prev) => (prev === card.key ? null : card.key));
    } else if (card.path) {
      goTo(card.path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <h1 className="mb-2 text-2xl font-bold text-gray-800">Admin Home</h1>
      <p className="mb-8 text-sm text-gray-500">Select a section to manage</p>

      <div
        ref={containerRef}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {cards.map((card) => {
          const Icon = card.icon;
          const isOpen = openKey === card.key;

          return (
            <div key={card.key} className="relative">
              <button
                type="button"
                onClick={() => handleCardClick(card)}
                className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className={`rounded-lg p-3 ${card.color}`}>
                    <Icon size={24} />
                  </div>
                  <span className="font-semibold text-gray-800">
                    {card.title}
                  </span>
                </div>
                {card.items && (
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {card.items && isOpen && (
                <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                  {card.items.map((item) => (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => goTo(item.path)}
                      className="block w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminHome;
