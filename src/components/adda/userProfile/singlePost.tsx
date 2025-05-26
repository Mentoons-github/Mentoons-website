import { Post, User } from "@/types";
import { Heart, MessagesSquare, Share2, User as UserIcon } from "lucide-react";
import React from "react";

interface SinglePostProps {
  post: Post;
  user: User;
}

const SinglePost: React.FC<SinglePostProps> = ({ post, user }) => {
  return (
    <div className="overflow-hidden bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center mb-4">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name || "User"}
              className="w-10 h-10 mr-3 rounded-full"
            />
          ) : (
            <div className="flex items-center justify-center w-10 h-10 mr-3 bg-gray-200 rounded-full">
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
        <p className="mb-4 text-gray-900">{post.content}</p>

        {/* Post Media if available */}
        {post.media && post.media.length > 0 && post.media[0].url && (
          <div className="mb-4 overflow-hidden rounded-lg">
            <img
              src={post.media[0].url}
              alt={post.media[0].caption || "Post media"}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Post Stats */}
        <div className="flex justify-between mt-4 text-sm text-gray-500">
          <div className="flex space-x-4">
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              <span>{post.likes ? post.likes.length : 0} Likes</span>
            </div>
            <div className="flex items-center">
              <MessagesSquare className="w-4 h-4 mr-1" />
              <span>{post.commentCount || 0} Comments</span>
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <Share2 className="w-4 h-4 mr-1" />
              <span>{post.shares ? post.shares.length : 0} Shares</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
