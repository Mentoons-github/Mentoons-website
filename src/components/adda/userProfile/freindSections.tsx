import { UserSummary } from "@/types";
import { Users } from "lucide-react";
import React from "react";


interface FriendsSectionProps {
  friends: UserSummary[];
}

const FriendsSection: React.FC<FriendsSectionProps> = ({ friends }) => {
  return (
    <div className="overflow-hidden bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="mb-4 text-lg font-medium text-gray-900">Friends</h2>

        {friends && friends.length > 0 ? (
          <div>
            <p className="mb-4 text-gray-500">
              This user has {friends.length} friends.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {friends.map((friend) => (
                <div
                  key={friend._id}
                  className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-shrink-0 w-10 h-10 overflow-hidden rounded-full">
                    <img
                      src={friend.picture || "/api/placeholder/40/40"}
                      alt={friend.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="ml-3 truncate">
                    <p className="text-sm font-medium text-gray-900">
                      {friend.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <Users size={48} className="mx-auto text-gray-400" />
            <p className="mt-2 text-gray-500">No friends to display</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsSection;
