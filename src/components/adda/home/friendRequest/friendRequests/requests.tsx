import { useCallback, useRef } from "react";
import { RequestInterface } from "@/types";
import axiosInstance from "@/api/axios";
import { useAuth } from "@clerk/clerk-react";

interface FriendRequestsListProps {
  requests: RequestInterface[] | null;
  loading: boolean;
  onFetchMore: () => Promise<void>;
}

const FriendRequestsList = ({
  requests,
  loading,
  onFetchMore,
}: FriendRequestsListProps) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const { getToken } = useAuth();

  const handleAccept = async (requestId: string) => {
    try {
      const token = await getToken();
      await axiosInstance.post(
        `/adda/acceptFriendRequest/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      const token = await getToken();
      await axiosInstance.post(
        `/adda/declineFriendRequest/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  const lastRequestRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            onFetchMore();
          }
        },
        { threshold: 1.0 }
      );
      if (node) observer.current.observe(node);
    },
    [loading, onFetchMore]
  );

  if (!requests || requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="p-3 mb-3 text-orange-500 rounded-full bg-orange-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        <p className="font-medium text-gray-600">No friend requests yet</p>
        <p className="text-sm text-gray-500">
          When someone sends you a request, it will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {requests.map(({ profilePic, userName, _id }, index) => (
        <div
          key={_id}
          className="flex flex-col w-full p-4 transition-all duration-200 bg-white border border-orange-100 rounded-xl hover:shadow-md"
          ref={index === requests.length - 1 ? lastRequestRef : null}
        >
          <div className="flex items-center w-full gap-3 mb-3">
            <div className="w-12 h-12 overflow-hidden rounded-full ring-2 ring-orange-50">
              <img
                src={profilePic}
                alt={userName}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-800">
                {userName}
              </h3>
              <p className="text-xs text-gray-500">Wants to connect with you</p>
            </div>
          </div>
          <div className="flex justify-between w-full gap-2">
            <button
              onClick={() => handleAccept(_id!)}
              className="flex items-center justify-center flex-1 gap-1 px-3 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Accept
            </button>
            <button
              onClick={() => handleDecline(_id!)}
              className="flex items-center justify-center flex-1 gap-1 px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequestsList;
