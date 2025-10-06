import { Globe, MapPin } from "lucide-react";

interface MeetupHeaderProps {
  active: "offline" | "online";
  handleTabChange: (newActive: "offline" | "online") => void;
}

const MeetupHeader: React.FC<MeetupHeaderProps> = ({
  active,
  handleTabChange,
}) => {
  return (
    <div className="text-left mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="mb-6 md:mb-0">
        <h1 className="text-5xl font-bold text-black mb-4">OUR MEETUPS</h1>
        <p className="text-xl text-black max-w-2xl">
          Join our vibrant community of Parents, psychologist, and teenagers
        </p>
      </div>
      <div className="flex items-center justify-center md:justify-end">
        <div className="rounded-xl bg-gray-100 p-1 shadow-inner flex">
          <button
            onClick={() => handleTabChange("online")}
            className={`${
              active === "online"
                ? "bg-white text-blue-600 shadow-md"
                : "text-gray-600 hover:text-gray-800"
            } rounded-lg px-8 py-3 text-lg font-semibold transition-all duration-300 ease-in-out flex items-center gap-2 transform hover:scale-105`}
          >
            <Globe className="w-5 h-5" />
            Online Events
          </button>
          <button
            onClick={() => handleTabChange("offline")}
            className={`${
              active === "offline"
                ? "bg-white text-blue-600 shadow-md"
                : "text-gray-600 hover:text-gray-800"
            } rounded-lg px-8 py-3 text-lg font-semibold transition-all duration-300 ease-in-out flex items-center gap-2 transform hover:scale-105`}
          >
            <MapPin className="w-5 h-5" />
            Offline Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetupHeader;
