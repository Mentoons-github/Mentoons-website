import { FRIEND_REQUEST } from "@/constant/constants";
import { RequestInterface } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
import "./friendRequest.css";

const FriendRequest = () => {
  const [requests, setRequests] = useState<RequestInterface[]>(FRIEND_REQUEST);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchRequests = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/friend-requests?page=${page}`);
      const data = await res.json();
      if (res.ok) {
        setRequests((prev) =>
          data.length > 0 ? [...prev, ...data] : FRIEND_REQUEST
        );
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
    setLoading(false);
  };

  const lastRequestRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchRequests();
          }
        },
        { threshold: 1.0 }
      );
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="flex flex-col items-center w-full rounded-xl">
      <div className="flex items-center justify-between w-full mb-4 ">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full">
            <img
              src="/assets/adda/sidebar/dd917c3b5f69868482390319c6a80c25.png"
              alt="friend-requests"
              className="w-full "
            />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 figtree">
            Friend Requests
          </h2>
        </div>
        {requests.length > 0 && (
          <span className="flex items-center justify-center px-[9px] py-1 text-xs font-medium text-white bg-orange-500 rounded-full mr-2">
            {requests.length}
          </span>
        )}
      </div>

      <div className="w-full overflow-y-auto max-h-[400px] scrollbar-hide">
        {requests.length > 0 ? (
          <div className="grid gap-3">
            {requests.map(({ profilePic, userName }, index) => (
              <div
                key={index}
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
                    <p className="text-xs text-gray-500">
                      Wants to connect with you
                    </p>
                  </div>
                </div>
                <div className="flex justify-between w-full gap-2">
                  <button className="flex items-center justify-center flex-1 gap-1 px-3 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600">
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
                  <button className="flex items-center justify-center flex-1 gap-1 px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 bg-gray-100 rounded-lg hover:bg-gray-200">
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
        ) : (
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
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center w-full py-4">
          <div className="w-6 h-6 border-2 rounded-full border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <span className="ml-2 text-sm text-gray-500">
            Loading more requests...
          </span>
        </div>
      )}
    </div>
  );
};

export default FriendRequest;
