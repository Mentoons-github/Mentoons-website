import React from "react";
import { Users } from "lucide-react";
import { UserSummary } from "@/types";


interface FriendsSectionProps {
  friends: UserSummary[];
}

const FriendsSection: React.FC<FriendsSectionProps> = ({ friends }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Friends</h2>

        {friends && friends.length > 0 ? (
          <div>
            <p className="text-gray-500 mb-4">
              This user has {friends.length} friends.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friend) => (
                <div
                  key={friend._id}
                  className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={friend.picture || "/api/placeholder/40/40"}
                      alt={friend.name}
                      className="h-full w-full object-cover"
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
          <div className="text-center py-8">
            <Users size={48} className="mx-auto text-gray-400" />
            <p className="mt-2 text-gray-500">No friends to display</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsSection;
