import { useEffect, useState } from "react";
import { FRIEND_REQUEST } from "@/constant/constants";
import { RequestInterface } from "@/types";
import "./friendRequest.css";

const FriendRequest = () => {
  const [requests, setRequests] = useState<RequestInterface[] | null>(
    FRIEND_REQUEST
  );

  useEffect(() => {
    setRequests(FRIEND_REQUEST);
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
        {requests?.map(({ profilePic, userName }, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white rounded-lg p-4 w-full gap-4 mb-2"
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
        ))}
      </div>
    </div>
  );
};

export default FriendRequest;
