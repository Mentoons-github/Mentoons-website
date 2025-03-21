import { useEffect, useState, useRef, useCallback } from "react";
import { RequestInterface } from "@/types";
import { FRIEND_REQUEST } from "@/constant/constants";
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
    <div className="flex flex-col items-center p-0 md:p-5 w-full">
      <h1 className="flex justify-start items-start gap-5 text-start w-full text-sm md:text-md figtree">
        <img
          src="/assets/adda/sidebar/dd917c3b5f69868482390319c6a80c25.png"
          alt="klem-friend"
          className="w-5"
        />
        Friend Requests
      </h1>
      <div className="w-full max-w-sm md:max-w-md lg:max-w-lg max-h-80 overflow-y-auto scrollbar-hide">
        {requests.length > 0 ? (
          requests.map(({ profilePic, userName }, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-white rounded-lg p-4 w-full gap-4 mb-2"
              ref={index === requests.length - 1 ? lastRequestRef : null}
            >
              <div className="flex items-center gap-4 w-full">
                <div className="w-14 h-14 rounded-full border-2 border-gray-300 overflow-hidden">
                  <img
                    src={profilePic}
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-medium">{userName}</h3>
              </div>
              <div className="flex justify-between w-full gap-3">
                <button className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#05f] via-[#09f] to-[#1E74FD] text-white font-medium hover:opacity-80 text-sm md:text-base transition">
                  Confirm
                </button>
                <button className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium text-sm md:text-base hover:bg-gray-300 transition">
                  Cancel
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No friend requests yet.</p>
        )}
      </div>
      {loading && <p className="text-center text-gray-500">Loading...</p>}
    </div>
  );
};

export default FriendRequest;
