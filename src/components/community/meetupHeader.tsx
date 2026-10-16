import { Globe, MapPin } from "lucide-react";

interface MeetupHeaderProps {
  active: "offline" | "online";
  handleTabChange: (newActive: "offline" | "online") => void;
}

const MeetupHeader: React.FC<MeetupHeaderProps> = ({
  active,
  handleTabChange,
}) => {
  const tabClass = (isActive: boolean, activeBg: string) =>
    `font-comic-chip flex items-center gap-2 rounded-xl border-2 border-gray-900 px-6 py-3 text-base tracking-wide text-gray-900 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 sm:px-8 sm:text-lg ${
      isActive
        ? `${activeBg} shadow-[4px_4px_0_0_#111827]`
        : "bg-white shadow-[2px_2px_0_0_#111827] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
    }`;

  return (
    <div className="mb-8 flex flex-col text-left md:flex-row md:items-center md:justify-between">
      <div className="mb-6 md:mb-0">
        <h1
          className="font-comic mb-4 text-5xl tracking-wide text-white sm:text-6xl"
          style={{
            WebkitTextStroke: "2px #111827",
            textShadow: "5px 5px 0 #111827",
          }}
        >
          OUR MEETUPS
        </h1>
        <p className="inline-block max-w-2xl -rotate-1 rounded-2xl border-2 border-gray-900 bg-white px-5 py-3 text-base font-medium text-gray-900 shadow-[5px_5px_0_0_#111827] sm:text-lg">
          Join our vibrant community of Parents, psychologist, and teenagers
        </p>
      </div>
      <div className="flex items-center justify-center gap-3 md:justify-end">
        <button
          onClick={() => handleTabChange("online")}
          className={tabClass(active === "online", "bg-[#4CC9F0]")}
        >
          <Globe className="h-5 w-5" strokeWidth={2.5} />
          Online Events
        </button>
        <button
          onClick={() => handleTabChange("offline")}
          className={tabClass(active === "offline", "bg-[#FF5D8F]")}
        >
          <MapPin className="h-5 w-5" strokeWidth={2.5} />
          Offline Events
        </button>
      </div>
    </div>
  );
};

export default MeetupHeader;
