import { Users } from "lucide-react";

export interface MeetupFormValues {
  title: string;
  date: string;
  time: string;
  duration: string;
  maxCapacity: number;
  platform: string;
  meetingLink: string;
  place: string;
  description: string;
  detailedDescription: string;
  speakerName: string;
  speakerImage: File | null;
  speakerImageUrl: string | null;
  topics: string;
  tags: string;
  isOnline: boolean;
}

interface MeetupPreviewCardsProps {
  currentMeetups: MeetupFormValues[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

const MeetupPreviewCards: React.FC<MeetupPreviewCardsProps> = ({
  currentMeetups,
  currentIndex,
  setCurrentIndex,
}) => {
  const getMockParticipants = (maxCapacity: number) =>
    Math.floor(Math.random() * maxCapacity);

  return (
    <div className="mt-10 grid gap-5 md:grid-cols-3">
      {currentMeetups.map((meetup, index) => {
        const participants = getMockParticipants(meetup.maxCapacity);
        const isActive = index === currentIndex;

        return (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`rounded-2xl border-2 border-gray-900 p-4 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 ${
              isActive
                ? "-translate-y-1 bg-[#FFD93D] shadow-[7px_7px_0_0_#111827]"
                : "bg-white shadow-[4px_4px_0_0_#111827] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#111827]"
            }`}
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="font-comic-chip flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-gray-900 bg-[#FF5D8F] text-base text-white">
                {meetup.title.charAt(0)}
              </div>
              <h3 className="font-comic truncate text-xl tracking-wide text-gray-900">
                {meetup.title}
              </h3>
            </div>
            <div className="mb-3 flex items-center gap-4 text-sm font-semibold text-gray-800">
              <span>{meetup.date}</span>
              <span>{meetup.time}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-semibold text-gray-800">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" strokeWidth={2.5} />
                {participants}/{meetup.maxCapacity}
              </span>
              <span
                className={`font-comic-chip rounded-full border-2 border-gray-900 px-3 py-0.5 text-xs tracking-wide text-gray-900 ${
                  meetup.isOnline ? "bg-[#7AE582]" : "bg-[#4CC9F0]"
                }`}
              >
                {meetup.isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default MeetupPreviewCards;
