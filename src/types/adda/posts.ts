export interface MediaItem {
  url: string;
  type: 'image' | 'video';
  caption?: string;
}

export interface ArticleDetails {
  body: string;
  coverImage?: string;
}

export interface EventDetails {
  startDate: Date;
  endDate?: Date;
  venue: string;
  description: string;
  coverImage?: string;
}

export interface PostState {
  _id?: string;
  user: string; // User ID
  content?: string;
  title?: string;
  postType: 'text' | 'photo' | 'video' | 'article' | 'event' | 'mixed';
  media?: MediaItem[];
  article?: ArticleDetails;
  eventDetails?: EventDetails;
  likes?: string[]; // Array of User IDs
  comments?: string[]; // Array of Comment IDs
  shares?: string[]; // Array of User IDs
  tags?: string[];
  location?: string;
  visibility: 'public' | 'friends' | 'private';
  createdAt?: Date;
  updatedAt?: Date;
  url?: string; // Virtual property
}

export interface PostMethods {
  isLikedBy: (userId: string) => boolean;
}
