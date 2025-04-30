export interface EventDetails {
  eventDate: Date;
  location: string;
  additionalInfo: string;
}

export interface PostState {
  type: "image" | "video" | "article" | "event";
  files: string[];
  description: string;
  articleContent: string;
  eventDetails: EventDetails;
}
