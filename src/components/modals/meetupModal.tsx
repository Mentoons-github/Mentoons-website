import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { X } from "lucide-react";

// Re-use the same type
export interface MeetupFromAPI {
  _id: string;
  title: string;
  dateTime: string;
  duration: string;
  maxCapacity: number;
  place?: string;
  platform?: string;
  meetingLink?: string;
  description: string;
  detailedDescription: string;
  speakerName: string;
  speakerImage: string;
  topics: string[];
  tags: string[];
  isOnline: boolean;
  venue?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ViewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetup: MeetupFromAPI | null;
}

const ViewDetailsModal = ({
  isOpen,
  onClose,
  meetup,
}: ViewDetailsModalProps) => {
  if (!meetup) return null;

  const formattedDateTime = (() => {
    try {
      return format(new Date(meetup.dateTime), "MMMM d, yyyy, h:mm a");
    } catch {
      return "-";
    }
  })();

  const rows = [
    { label: "Title", value: meetup.title },
    { label: "Date & Time", value: formattedDateTime },
    { label: "Duration", value: meetup.duration },
    { label: "Max Capacity", value: meetup.maxCapacity },
    {
      label: "Venue",
      value: meetup.isOnline
        ? meetup.platform
        : meetup.place || meetup.venue || "-",
    },
    {
      label: "Meeting Link",
      value:
        meetup.isOnline && meetup.meetingLink ? (
          <a
            href={meetup.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            {meetup.meetingLink}
          </a>
        ) : (
          "-"
        ),
    },
    { label: "Description", value: meetup.description },
    { label: "Detailed Description", value: meetup.detailedDescription },
    { label: "Speaker", value: meetup.speakerName },
    {
      label: "Speaker Image",
      value: meetup.speakerImage ? (
        <img
          src={meetup.speakerImage}
          alt={meetup.speakerName}
          className="w-24 h-24 object-cover rounded"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        "-"
      ),
    },
    { label: "Topics", value: meetup.topics?.join(", ") || "-" },
    { label: "Tags", value: meetup.tags?.join(", ") || "-" },
    { label: "Online?", value: meetup.isOnline ? "Yes" : "No" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            Meetup Details
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex flex-col">
              <span className="font-medium text-sm text-gray-600">{label}</span>
              <div className="mt-1">{value}</div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDetailsModal;
