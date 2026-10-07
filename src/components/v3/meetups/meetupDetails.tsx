import {
  Clock,
  MapPin,
  Users,
  ArrowRight,
  Link2,
  Mail,
  CalendarPlus,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

interface MeetupDetailData {
  day: string;
  date: string;
  month: string;
  title: string;
  description: string;
  format: "In-Person" | "Online";
  time: string;
  location: string;
  audience: string;
  spotsLeft: number;
  about: string;
  topics: string[];
}

const MEETUP_DETAIL: MeetupDetailData = {
  day: "SAT",
  date: "20",
  month: "SEP",
  title: "Meetup Title",
  description: "A group discussion for parents to share experiences and ideas.",
  format: "In-Person",
  time: "10:00 AM – 11:30 AM",
  location: "The Mindspace, Indiranagar, Bangalore, KA",
  audience: "For Parents",
  spotsLeft: 20,
  about:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  topics: ["Topic 1", "Topic 2", "Topic 3", "Topic 4"],
};

const SHARE_OPTIONS = [
  { label: "Copy link", icon: Link2 },
  { label: "WhatsApp", icon: FaWhatsapp },
  { label: "Email", icon: Mail },
  { label: "Add to calendar", icon: CalendarPlus },
];

const MeetupDetail = () => {
  const meetup = MEETUP_DETAIL;

  return (
    <div className="flex h-full w-1/3 flex-col gap-4">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {/* banner image */}
        <div className="relative h-40 shrink-0 bg-gray-300">
          <span className="absolute right-3 top-3 rounded-lg bg-gray-900/80 px-3 py-1.5 text-sm font-medium text-white">
            {meetup.format}
          </span>
        </div>

        {/* scrollable content */}
        <div className="flex-1 space-y-5 overflow-y-auto p-4">
          <div className="flex items-start gap-3">
            <div className="flex w-12 shrink-0 flex-col items-center text-center">
              <span className="text-xs font-semibold tracking-wide text-gray-500">
                {meetup.day}
              </span>
              <span className="text-2xl font-bold leading-tight text-gray-900">
                {meetup.date}
              </span>
              <span className="text-xs font-semibold tracking-wide text-gray-500">
                {meetup.month}
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-gray-900">
                {meetup.title}
              </h3>
              <p className="mt-1 text-base text-gray-600">
                {meetup.description}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-base text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 shrink-0 text-gray-400" />
              {meetup.time}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 shrink-0 text-gray-400" />
              {meetup.location}
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 shrink-0 text-gray-400" />
              {meetup.audience}
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 shrink-0 text-gray-400" />
              {meetup.spotsLeft} spots left
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-base font-semibold text-gray-900">
              About this Meetup
            </h4>
            <p className="mt-2 text-base leading-relaxed text-gray-600">
              {meetup.about}
            </p>
          </div>

          <div>
            <h4 className="text-base font-semibold text-gray-900">
              Topics We&apos;ll Discuss
            </h4>
            <ul className="mt-2 space-y-2">
              {meetup.topics.map((topic) => (
                <li
                  key={topic}
                  className="flex items-center gap-2 text-base text-gray-600"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-900" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="shrink-0 p-4 pt-0">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gray-900 px-4 py-3 text-base font-medium text-white hover:bg-gray-800"
          >
            Book Your Spot
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="shrink-0 rounded-2xl border border-gray-200 bg-white p-4">
        <h4 className="text-base font-semibold text-gray-900">
          Share this Meetup
        </h4>
        <div className="mt-3 flex items-center gap-3">
          {SHARE_OPTIONS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeetupDetail;
