export interface MeetupFormValues {
  _id?: string;
  title: string;
  date?: string;
  time?: string;
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
  venue?: string;
  dateTime?: string;
  createdAt?: string;
  updatedAt?: string;
  __v: string;
}
