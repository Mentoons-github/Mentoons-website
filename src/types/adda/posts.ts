export interface MediaItem {
  url: string;
  type: "image" | "video";
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
  postType: "text" | "photo" | "video" | "article" | "event" | "mixed";
  media?: MediaItem[];
  article?: ArticleDetails;
  eventDetails?: EventDetails;
  likes?: string[]; // Array of User IDs
  comments?: string[]; // Array of Comment IDs
  shares?: string[]; // Array of User IDs
  tags?: string[];
  location?: string;
  visibility: "public" | "friends" | "private";
  createdAt?: Date;
  updatedAt?: Date;
  url?: string; // Virtual property
}

// comment
export interface Comment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    picture: string;
  };
  content: string;
  createdAt: string;
}

//post details
export interface PostDetails {
  _id: string;
  user: {
    _id: string;
    name: string;
    role: string;
    picture: string;
    bio?: string;
  };
  content?: string;
  title?: string;
  postType: "text" | "photo" | "video" | "article" | "event" | "mixed";
  media?: Array<{
    url: string;
    type: "image" | "video";
    caption?: string;
  }>;
  article?: {
    body: string;
    coverImage?: string;
  };
  event?: {
    startDate: string | Date;
    endDate?: string | Date;
    venue: string;
    description: string;
    coverImage?: string;
  };
  likes: string[];
  comments: Comment[];
  shares: string[];
  createdAt: string | Date;
  visibility: "public" | "friends" | "private";
  tags?: string[];
  location?: string;
}

export interface PostMethods {
  isLikedBy: (userId: string) => boolean;
}

export interface EditPostTypes {
  title: string;
  content: string;
  tags: string[];
  article?: {
    body: string;
  };
  media?: Array<{
    type: "image" | "video";
    caption?: string;
  }>;
}
