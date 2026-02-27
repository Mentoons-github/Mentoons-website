import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  CalendarDays,
  User,
  Mail,
  Phone,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface SortOption {
  field: string;
  label: string;
}

interface SortDropdownProps {
  sortField: string;
  sortOrder: 1 | -1;
  onSortChange: (field: string, order: 1 | -1) => void;
  options: SortOption[];
  className?: string;
}

const sortIcons: Record<string, React.FC<{ className?: string }>> = {
  createdAt: ({ className }) => <CalendarDays className={className} />,
  name: ({ className }) => <User className={className} />,
  email: ({ className }) => <Mail className={className} />,
  phone: ({ className }) => <Phone className={className} />,
};

const SortDropdown = ({
  sortField,
  sortOrder,
  onSortChange,
  options,
  className = "",
}: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSort = (field: string) => {
    let newOrder: 1 | -1 = 1;

    if (sortField === field) {
      newOrder = sortOrder === 1 ? -1 : 1;
    } else {
      newOrder = -1;
    }

    onSortChange(field, newOrder);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    const option = options.find((opt) => opt.field === sortField);
    const label = option?.label || sortField;
    return `${label} ${sortOrder === 1 ? "↑ Asc" : "↓ Desc"}`;
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={`relative sort-dropdown-container ${className}`}
    >
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={toggleDropdown}
        className={`
          group flex items-center gap-2.5
          px-4 py-2.5 rounded-xl font-medium text-sm
          bg-gradient-to-r from-blue-600 to-blue-700
          text-white shadow-sm hover:shadow-md
          transition-all duration-200
          border border-blue-500/30
        `}
      >
        <ArrowUpDown className="w-4 h-4 opacity-90 group-hover:opacity-100 transition-opacity" />
        <span className="font-medium">{getDisplayText()}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute right-0 top-full mt-2.5
              w-72 bg-white rounded-xl shadow-xl border border-gray-200/70
              overflow-hidden z-30
            `}
          >
            <div className="py-1.5 max-h-[min(420px,80vh)] overflow-y-auto scrollbar-thin">
              {options.map((option) => {
                const isActive = sortField === option.field;
                const isAsc = isActive && sortOrder === 1;

                const IconComponent =
                  sortIcons[option.field] ??
                  (({ className }: { className?: string }) => (
                    <ArrowUpDown className={className} />
                  ));

                return (
                  <motion.button
                    key={option.field}
                    whileHover={{ backgroundColor: "#f8fafc" }}
                    whileTap={{ scale: 0.995 }}
                    onClick={() => handleSort(option.field)}
                    className={`
                      group relative w-full flex items-center gap-3.5
                      px-5 py-3.5 text-left text-sm
                      transition-colors duration-150
                      ${isActive ? "bg-blue-50/70 text-blue-800 font-medium" : "text-gray-700 hover:bg-gray-50/80"}
                    `}
                  >
                    <IconComponent className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />

                    <span className="flex-1">{option.label}</span>

                    {isActive && (
                      <div className="flex items-center gap-1.5 pr-1">
                        {isAsc ? (
                          <ArrowUp className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-rose-600" />
                        )}
                        <span className="text-xs font-medium opacity-75">
                          {isAsc ? "Asc" : "Desc"}
                        </span>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortDropdown;
