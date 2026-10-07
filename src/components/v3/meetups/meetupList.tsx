import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Calendar,
  Monitor,
  MapPin,
  Tag,
  ChevronDown,
  Clock,
  Users,
  ArrowRight,
  LucideIcon,
} from "lucide-react";

type Format = "In-Person" | "Online";

interface Meetup {
  id: number;
  day: string;
  date: string;
  month: string;
  title: string;
  description: string;
  format: Format;
  time: string;
  place: string;
  audience: string;
  tags: string[];
}

interface FilterItem {
  label: string;
  icon: LucideIcon;
}

const FILTERS: FilterItem[] = [
  { label: "Date", icon: Calendar },
  { label: "Format", icon: Monitor },
  { label: "Location", icon: MapPin },
  { label: "Topic", icon: Tag },
];

const MEETUPS: Meetup[] = [
  {
    id: 1,
    day: "SAT",
    date: "20",
    month: "SEP",
    title: "Meetup Title",
    description:
      "A group discussion for parents to share experiences and ideas.",
    format: "In-Person",
    time: "10:00 AM – 11:30 AM",
    place: "Bangalore, KA",
    audience: "For Parents",
    tags: ["Parenting", "Screen Time", "Behaviour"],
  },
  {
    id: 2,
    day: "SUN",
    date: "28",
    month: "SEP",
    title: "Meetup Title",
    description:
      "A group discussion for teens to talk, share and learn together.",
    format: "Online",
    time: "4:00 PM – 5:30 PM",
    place: "Online (Zoom)",
    audience: "For Teens",
    tags: ["Friendships", "Confidence", "Mental Wellbeing"],
  },
  {
    id: 3,
    day: "WED",
    date: "01",
    month: "OCT",
    title: "Meetup Title",
    description:
      "A hands-on session for new parents to swap routines and tips.",
    format: "In-Person",
    time: "5:30 PM – 7:00 PM",
    place: "Koramangala, BLR",
    audience: "For New Parents",
    tags: ["Sleep", "Routines", "Support"],
  },
  {
    id: 4,
    day: "SAT",
    date: "04",
    month: "OCT",
    title: "Meetup Title",
    description:
      "An open circle for teens to talk through exam stress together.",
    format: "Online",
    time: "6:00 PM – 7:00 PM",
    place: "Online (Zoom)",
    audience: "For Teens",
    tags: ["Exam Stress", "Coping Skills"],
  },
  {
    id: 5,
    day: "SUN",
    date: "12",
    month: "OCT",
    title: "Meetup Title",
    description:
      "A guided workshop on setting healthy screen-time boundaries at home.",
    format: "In-Person",
    time: "11:00 AM – 12:30 PM",
    place: "Indiranagar, BLR",
    audience: "For Parents",
    tags: ["Screen Time", "Boundaries", "Family"],
  },
];

interface SearchAndFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
}

const SearchAndFilters = ({ query, onQueryChange }: SearchAndFiltersProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            type="text"
            placeholder="Search by keyword..."
            className="h-12 w-full rounded-xl bg-gray-100 pl-11 pr-4 text-base text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
        <button
          type="button"
          className="flex h-12 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-base font-medium text-gray-700 hover:bg-gray-50"
        >
          <SlidersHorizontal className="h-5 w-5" />
          Filters
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {FILTERS.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-base font-medium text-gray-700 hover:bg-gray-50"
          >
            <Icon className="h-5 w-5 text-gray-500" />
            {label}
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );
};

interface DateBadgeProps {
  day: string;
  date: string;
  month: string;
}

const DateBadge = ({ day, date, month }: DateBadgeProps) => {
  return (
    <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-2 text-center">
      <span className="text-xs font-semibold tracking-wide text-gray-500">
        {day}
      </span>
      <span className="text-2xl font-bold leading-tight text-gray-900">
        {date}
      </span>
      <span className="text-xs font-semibold tracking-wide text-gray-500">
        {month}
      </span>
    </div>
  );
};

interface FormatBadgeProps {
  format: Format;
}

const FormatBadge = ({ format }: FormatBadgeProps) => {
  const Icon = format === "Online" ? Monitor : MapPin;
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700">
      <Icon className="h-4 w-4" />
      {format}
    </span>
  );
};

interface MeetupCardProps {
  meetup: Meetup;
}

const MeetupCard = ({ meetup }: MeetupCardProps) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* thumbnail */}
        <div className="flex h-28 w-full shrink-0 items-center justify-center rounded-xl bg-gray-200 sm:h-24 sm:w-32">
          <Users className="h-8 w-8 text-gray-400" />
        </div>

        {/* date badge */}
        <DateBadge day={meetup.day} date={meetup.date} month={meetup.month} />

        {/* main content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {meetup.title}
            </h3>
            <div className="hidden shrink-0 sm:block">
              <FormatBadge format={meetup.format} />
            </div>
          </div>

          <p className="mt-1 text-base text-gray-600">{meetup.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-base text-gray-600">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-gray-400" />
              {meetup.time}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-gray-400" />
              {meetup.place}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-gray-400" />
              {meetup.audience}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {meetup.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 sm:hidden">
              <FormatBadge format={meetup.format} />
            </div>

            <button
              type="button"
              className="flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-gray-900 px-4 py-2.5 text-base font-medium text-white hover:bg-gray-800"
            >
              View Details
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MeetupList = () => {
  const [query, setQuery] = useState<string>("");

  const meetups = MEETUPS.filter((m) =>
    m.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="flex-1 space-y-5">
      <SearchAndFilters query={query} onQueryChange={setQuery} />

      <div className="space-y-4">
        {meetups.map((meetup) => (
          <MeetupCard key={meetup.id} meetup={meetup} />
        ))}
      </div>
    </div>
  );
};

export default MeetupList;
