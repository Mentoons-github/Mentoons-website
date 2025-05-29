import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserSummary } from "@/types";
import React from "react";
import { FiUsers } from "react-icons/fi";

interface FriendsSectionProps {
  friends: UserSummary[];
}

const FriendsSection: React.FC<FriendsSectionProps> = ({ friends }) => {
  return (
    <Card className="border border-orange-200 shadow-lg shadow-orange-100/80 rounded-xl">
      <div className="p-6">
        <h3 className="mb-3 font-semibold text-orange-600 text-md">Friends</h3>

        {friends && friends.length > 0 ? (
          <div>
            <p className="mb-4 text-sm text-gray-500">
              This user has {friends.length} friends.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {friends.map((friend) => (
                <div
                  key={friend._id}
                  className="flex items-center p-3 transition-colors border border-orange-100 rounded-lg hover:bg-orange-50"
                >
                  <div className="flex-shrink-0 w-10 h-10 overflow-hidden border-2 border-white rounded-full shadow-sm">
                    <img
                      src={friend.picture || "/api/placeholder/40/40"}
                      alt={friend.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="ml-3 truncate">
                    <p className="text-sm font-medium text-gray-800">
                      {friend.name}
                    </p>
                    <p className="text-xs text-gray-500">Friend</p>
                  </div>
                  <Button
                    className="h-8 px-3 ml-auto text-xs text-white bg-orange-500 hover:bg-orange-600"
                    size="sm"
                  >
                    Message
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center border border-orange-100 rounded-lg bg-orange-50">
            <div className="flex items-center justify-center mx-auto mb-4 text-orange-500 bg-orange-100 rounded-full w-14 h-14">
              <FiUsers size={24} />
            </div>
            <p className="font-medium text-gray-700">No friends to display</p>
            <p className="mt-1 text-sm text-gray-500">
              This user hasn't connected with anyone yet
            </p>
            <Button className="mt-4 bg-orange-500 hover:bg-orange-600">
              Connect
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FriendsSection;
