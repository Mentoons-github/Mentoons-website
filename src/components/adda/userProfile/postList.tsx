import { Post } from "@/pages/v2/adda/userProfile";
import { MediaType, User } from "@/types";
import { useState } from "react";

interface PostsListProps {
  posts: Post[];
  user: User;
}

const PostsList = ({ posts, user }: PostsListProps) => {
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>(
    {}
  );

  const togglePostExpansion = (postId: string) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMedia = (media: {
    url: string;
    type: string;
    caption?: string;
  }) => {
    switch (media.type) {
      case MediaType.IMAGE:
        return (
          <div className="mt-3 overflow-hidden rounded-lg">
            <img
              src={media.url}
              alt={media.caption || "Post image"}
              className="object-cover w-full h-auto"
            />
            {media.caption && (
              <p className="mt-1 text-sm text-gray-500">{media.caption}</p>
            )}
          </div>
        );
      case MediaType.VIDEO:
        return (
          <div className="mt-3 overflow-hidden rounded-lg">
            <video
              src={media.url}
              controls
              className="w-full"
              poster="/api/placeholder/640/360"
            />
            {media.caption && (
              <p className="mt-1 text-sm text-gray-500">{media.caption}</p>
            )}
          </div>
        );
      case MediaType.AUDIO:
        return (
          <div className="mt-3">
            <audio src={media.url} controls className="w-full" />
            {media.caption && (
              <p className="mt-1 text-sm text-gray-500">{media.caption}</p>
            )}
          </div>
        );
      case MediaType.DOCUMENT:
        return (
          <div className="p-3 mt-3 border border-gray-200 rounded-lg bg-gray-50">
            <a
              href={media.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:underline"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
              {media.caption || "View Document"}
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  const renderPostContent = (post: Post) => {
    switch (post.postType) {
      case "text":
        return (
          <>
            {post.content &&
            post.content?.length > 280 &&
            !expandedPosts[post._id] ? (
              <>
                <p className="text-gray-800">
                  {post.content.substring(0, 280)}...
                </p>
                <button
                  onClick={() => togglePostExpansion(post._id)}
                  className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Read More
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-800">{post.content}</p>
                {post.content && post.content?.length > 280 && (
                  <button
                    onClick={() => togglePostExpansion(post._id)}
                    className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Show Less
                  </button>
                )}
              </>
            )}
          </>
        );

      case "article":
        return (
          <div className="mt-3 space-y-2">
            {post.article?.coverImage && (
              <img
                src={post.article.coverImage}
                alt="Article cover"
                className="w-full h-auto rounded-lg"
              />
            )}
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="text-gray-700">{post.article?.body}</p>
          </div>
        );

      case "event":
        return (
          <div className="mt-3 space-y-2">
            {post.event?.coverImage && (
              <img
                src={post.event.coverImage}
                alt="Event cover"
                className="w-full h-auto rounded-lg"
              />
            )}
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="text-sm text-gray-500">
              {formatDate(post.event?.startDate || "")}
              {post.event?.endDate && ` - ${formatDate(post.event.endDate)}`}
            </p>
            <p className="text-gray-700">{post.event?.description}</p>
            <p className="text-sm italic text-gray-600">
              Venue: {post.event?.venue}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  if (posts.length === 0) {
    return (
      <div className="p-6 text-center bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
        <p className="mt-2 text-gray-500">
          {user._id === user.clerkId
            ? "You haven't created any posts yet."
            : `${user.name} hasn't created any posts yet.`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post._id}
          className="overflow-hidden bg-white rounded-lg shadow"
        >
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center">
              <img
                src={user.picture || "/api/placeholder/40/40"}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="mt-3">{renderPostContent(post)}</div>

            {/* Media */}
            {post.media && post.media.length > 0 && (
              <div className="mt-3 space-y-2">
                {post.media.map((item, idx) => (
                  <div key={idx}>{renderMedia(item)}</div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 mt-4 border-t border-gray-100">
              <div className="flex space-x-4">
                <ActionButton icon="👍" count={post.likes.length} />
                <ActionButton icon="💬" count={post.comments.length} />
                <ActionButton icon="🔁" count={post.shares.length} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ActionButton = ({ icon, count }: { icon: string; count: number }) => (
  <button className="flex items-center text-sm text-gray-500 hover:text-blue-600">
    <span className="mr-1">{icon}</span>
    <span>{count}</span>
  </button>
);

export default PostsList;
