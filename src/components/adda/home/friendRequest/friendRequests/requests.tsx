import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import SubscriptionModalManager from "@/components/protected/subscriptionManager";
import { AppDispatch } from "@/redux/store";
import {
  fetchFriendRequests,
  fetchFollowBackUsers,
  acceptFriendRequest,
  declineFriendRequest,
  sendFollowBackRequest,
  declineFollowBackRequest,
  resetRequests,
  resetFollowBackUsers,
  incrementPage,
} from "@/redux/adda/friendRequest";
import { RootState } from "@/redux/store";
import { RequestSender, FollowBackUser } from "@/types/adda/friendRequest";

const FriendRequestsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { getToken } = useAuth();
  const {
    requests,
    followBackUsers,
    loading,
    followBackLoading,
    hasMore,
    page,
    accessCheck,
    error,
  } = useSelector((state: RootState) => state.friendRequests);
  const observer = useRef<IntersectionObserver | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      if (token) {
        dispatch(fetchFriendRequests({ page: 1, limit: 10, token }));
        dispatch(fetchFollowBackUsers(token));
      }
    };
    fetchData();
    return () => {
      dispatch(resetRequests());
      dispatch(resetFollowBackUsers());
    };
  }, [dispatch, getToken]);

  // Handle infinite scroll
  const lastRequestRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            getToken().then((token) => {
              if (token) {
                dispatch(fetchFriendRequests({ page, limit: 10, token }));
                dispatch(incrementPage());
              }
            });
          }
        },
        { threshold: 0.8 },
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page, dispatch, getToken],
  );

  const handleAccept = async (requestId: string) => {
    const token = await getToken();
    if (token) {
      const result = await dispatch(acceptFriendRequest({ requestId, token }));
      if (acceptFriendRequest.fulfilled.match(result)) {
        // Notification updates are handled in the thunk
        dispatch(fetchFriendRequests({ page: 1, limit: 10, token }));
        dispatch(fetchFollowBackUsers(token));
      } else if (acceptFriendRequest.rejected.match(result)) {
        setShowModal(true);
      }
    }
  };

  const handleDecline = async (requestId: string) => {
    const token = await getToken();
    if (token) {
      const result = await dispatch(declineFriendRequest({ requestId, token }));
      if (declineFriendRequest.fulfilled.match(result)) {
        // Notification updates are handled in the thunk
        dispatch(fetchFriendRequests({ page: 1, limit: 10, token }));
      } else if (declineFriendRequest.rejected.match(result)) {
        setShowModal(true);
      }
    }
  };

  const handleFollowBack = async (userId: string) => {
    const token = await getToken();
    if (token) {
      dispatch(sendFollowBackRequest({ userId, token })).then((result) => {
        if (sendFollowBackRequest.rejected.match(result)) {
          setShowModal(true);
        }
      });
    }
  };

  const handleDeclineFollowBack = async (userId: string) => {
    const token = await getToken();
    if (token) {
      dispatch(declineFollowBackRequest({ userId, token }));
    }
  };

  const renderFollowBackSection = () => {
    if (!followBackUsers || followBackLoading) return null;

    if (followBackUsers.length === 0) return null;

    return (
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
          People to Follow Back
        </h2>
        <div className="grid gap-3">
          {followBackUsers.map((user: FollowBackUser) => (
            <div
              key={user._id}
              className={`flex flex-col sm:flex-row sm:items-center w-full p-4 border rounded-xl ${
                user.status === "following-in-progress" ||
                user.status === "declining"
                  ? "border-blue-200 bg-blue-50"
                  : user.status === "following"
                    ? "border-green-300 bg-green-100 transform scale-95 opacity-80"
                    : user.status === "declined"
                      ? "border-red-300 bg-red-100 transform scale-95 opacity-80"
                      : "border-orange-100 bg-white hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-3 mb-3 sm:mb-0 sm:flex-1">
                <div className="w-10 h-10 overflow-hidden rounded-full ring-2 ring-orange-50">
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-800">
                    {user.name}
                  </h3>
                  <p className="text-xs text-gray-500">Follows you</p>
                </div>
              </div>

              {user.status === "following-in-progress" ? (
                <div className="flex items-center justify-center gap-2 p-2">
                  <div className="w-5 h-5 border-2 rounded-full border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                  <span className="text-sm font-medium text-blue-600">
                    Following...
                  </span>
                </div>
              ) : user.status === "declining" ? (
                <div className="flex items-center justify-center gap-2 p-2">
                  <div className="w-5 h-5 border-2 rounded-full border-t-red-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                  <span className="text-sm font-medium text-red-600">
                    Declining...
                  </span>
                </div>
              ) : user.status === "following" ? (
                <div className="flex items-center justify-center gap-2 p-2 text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">Following!</span>
                </div>
              ) : user.status === "declined" ? (
                <div className="flex items-center justify-center gap-2 p-2 text-red-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 0 000 16zM8.707 7.293a1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 0 101.414 1.414L10 11.414l1.293 1.293a1 0 001.414-1.414L11.414 10l1.293-1.293a1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">Declined!</span>
                </div>
              ) : (
                <div className="flex flex-col sm:ml-auto gap-2 items-center">
                  <button
                    onClick={() => handleFollowBack(user._id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white rounded-md bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
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
                    Follow Back
                  </button>
                  <button
                    onClick={() => handleDeclineFollowBack(user._id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-all duration-200"
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
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getCardClasses = (status?: string) => {
    const baseClasses =
      "flex flex-col w-full p-4 transition-all duration-300 border rounded-xl";

    switch (status) {
      case "accepting":
        return `${baseClasses} border-green-200 bg-green-50`;
      case "declining":
        return `${baseClasses} border-red-200 bg-red-50`;
      case "accepted":
        return `${baseClasses} border-green-300 bg-green-100 transform scale-95 opacity-80`;
      case "declined":
        return `${baseClasses} border-red-300 bg-red-100 transform scale-95 opacity-80`;
      default:
        return `${baseClasses} border-orange-100 bg-white hover:shadow-md`;
    }
  };

  const getActionButtons = (request: RequestSender) => {
    const { status, requestId } = request;

    if (status === "accepting") {
      return (
        <div className="flex justify-center w-full py-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 rounded-full border-t-green-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <span className="text-sm font-medium text-green-600">
              Accepting request...
            </span>
          </div>
        </div>
      );
    }

    if (status === "declining") {
      return (
        <div className="flex justify-center w-full py-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 rounded-full border-t-red-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <span className="text-sm font-medium text-red-600">
              Declining request...
            </span>
          </div>
        </div>
      );
    }

    if (status === "accepted") {
      return (
        <div className="flex justify-center w-full py-2">
          <div className="flex items-center gap-2 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Request Accepted!</span>
          </div>
        </div>
      );
    }

    if (status === "declined") {
      return (
        <div className="flex justify-center w-full py-2">
          <div className="flex items-center gap-2 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 0 000 16zM8.707 7.293a1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 0 101.414 1.414L10 11.414l1.293 1.293a1 0 001.414-1.414L11.414 10l1.293-1.293a1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Request Declined!</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-between w-full gap-2">
        <button
          onClick={() => handleAccept(requestId)}
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
          onClick={() => handleDecline(requestId)}
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
    );
  };

  if ((!requests && loading) || (!followBackUsers && followBackLoading)) {
    return (
      <div className="flex items-center justify-center w-full py-8">
        <div className="w-6 h-6 border-2 rounded-full border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        <span className="ml-2 text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  if (
    (!requests || requests.length === 0) &&
    (!followBackUsers || followBackUsers.length === 0)
  ) {
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
        <p className="font-medium text-gray-600">No connection requests</p>
        <p className="text-sm text-gray-500">
          When someone sends you a request or follows you, it will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {renderFollowBackSection()}
      {requests && requests.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-gray-800">
            Friend Requests
          </h2>
          <div className="grid gap-3">
            {requests.map((request: RequestSender, index: number) => (
              <div
                key={request.requestId}
                className={getCardClasses(request.status)}
                ref={index === requests.length - 1 ? lastRequestRef : undefined}
              >
                <div className="flex items-center w-full gap-3 mb-3">
                  <div className="w-12 h-12 overflow-hidden rounded-full ring-2 ring-orange-50">
                    <img
                      src={request.senderDetails.picture}
                      alt={request.senderDetails.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-800">
                      {request.senderDetails.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Wants to connect with you
                    </p>
                  </div>
                </div>
                {getActionButtons(request)}
              </div>
            ))}
            {loading && (
              <div className="flex items-center justify-center w-full py-3">
                <div className="w-5 h-5 border-2 rounded-full border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                <span className="ml-2 text-xs text-gray-500">
                  Loading more requests...
                </span>
              </div>
            )}
            {!hasMore && requests.length > 0 && (
              <div className="text-center py-2 text-sm text-gray-500">
                No more friend requests to load
              </div>
            )}
          </div>
        </div>
      )}
      {accessCheck && (
        <SubscriptionModalManager
          accessCheck={accessCheck}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          productId=""
        />
      )}
      {error && (
        <div className="text-center py-2 text-sm text-red-500">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default FriendRequestsList;
