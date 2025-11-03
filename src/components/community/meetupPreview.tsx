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
    <div className="mt-8 grid md:grid-cols-3 gap-4">
      {currentMeetups.map((meetup, index) => {
        const participants = getMockParticipants(meetup.maxCapacity);

        return (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`p-4 rounded-lg border-2 transition-all duration-300 ease-in-out text-left transform hover:scale-105 ${
              index === currentIndex
                ? "border-blue-500 bg-blue-50 shadow-md scale-105"
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {meetup.title.charAt(0)}
              </div>
              <h3 className="font-semibold text-gray-800 truncate">
                {meetup.title}
              </h3>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <span>{meetup.date}</span>
              <span>{meetup.time}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {participants}/{meetup.maxCapacity}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  meetup.isOnline
                    ? "bg-green-100 text-green-700"
                    : "bg-purple-100 text-purple-700"
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
