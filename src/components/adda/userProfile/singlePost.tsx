import React from "react";
import { Post, User } from "@/types";
import { Heart, MessagesSquare, Share2, User as UserIcon } from "lucide-react";

interface SinglePostProps {
  post: Post;
  user: User;
}

const SinglePost: React.FC<SinglePostProps> = ({ post, user }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name || "User"}
              className="h-10 w-10 rounded-full mr-3"
            />
          ) : (
            <div className="h-10 w-10 rounded-full mr-3 bg-gray-200 flex items-center justify-center">
              <UserIcon size={20} className="text-gray-400" />
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900">
              {user.name || "Unnamed User"}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Post Content */}
        <p className="text-gray-900 mb-4">{post.content}</p>

        {/* Post Media if available */}
        {post.media && post.media.length > 0 && post.media[0].url && (
          <div className="rounded-lg overflow-hidden mb-4">
            <img
              src={post.media[0].url}
              alt={post.media[0].caption || "Post media"}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Post Stats */}
        <div className="flex justify-between text-sm text-gray-500 mt-4">
          <div className="flex space-x-4">
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              <span>{post.likes ? post.likes.length : 0} Likes</span>
            </div>
            <div className="flex items-center">
              <MessagesSquare className="h-4 w-4 mr-1" />
              <span>{post.commentCount || 0} Comments</span>
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <Share2 className="h-4 w-4 mr-1" />
              <span>{post.shares ? post.shares.length : 0} Shares</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
