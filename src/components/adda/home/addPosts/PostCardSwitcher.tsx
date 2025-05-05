import ArticlePostCard from "./ArticlePostCard";
import EventPostCard from "./EventPostCard";
import MixedPostCard from "./MixedPostCard";
import PhotoPostCard from "./PhotoPostCard";
import TextPostCard from "./TextPostCard";
import VideoPostCard from "./VideoPostCard";

interface PostCardSwitcherProps {
  post: {
    _id: string;
    postType: "text" | "photo" | "video" | "article" | "event" | "mixed";
    user: {
      _id: string;
      name: string;
      role: string;
      profilePicture: string;
    };
    content?: string;
    title?: string;
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
    likes: any[];
    comments: any[];
    shares: any[];
    createdAt: string | Date;
    visibility: "public" | "friends" | "private";
    tags?: string[];
    location?: string;
    [key: string]: any; // To allow for any additional properties
  };
  initialComments?: Comment[];
}

interface Comment {
  id: number;
  text: string;
  author: {
    name: string;
    profilePicture: string;
  };
}

const PostCardSwitcher = ({
  post,
  initialComments = [],
}: PostCardSwitcherProps) => {
  // Render the appropriate post card based on postType
  switch (post.postType) {
    case "text":
      return (
        <TextPostCard post={post as any} initialComments={initialComments} />
      );
    case "photo":
      return (
        <PhotoPostCard post={post as any} initialComments={initialComments} />
      );
    case "video":
      return (
        <VideoPostCard post={post as any} initialComments={initialComments} />
      );
    case "article":
      return (
        <ArticlePostCard post={post as any} initialComments={initialComments} />
      );
    case "event":
      return (
        <EventPostCard post={post as any} initialComments={initialComments} />
      );
    case "mixed":
      return (
        <MixedPostCard post={post as any} initialComments={initialComments} />
      );
    default:
      // Fallback to TextPostCard if the postType is unknown
      console.warn(`Unknown post type: ${post.postType}`);
      return (
        <TextPostCard post={post as any} initialComments={initialComments} />
      );
  }
};

export default PostCardSwitcher;
