import { useState, useEffect, useCallback, useMemo } from "react";
import { MdClose, MdSend, MdSearch, MdCheck } from "react-icons/md";
import axiosInstance from "@/api/axios";
import { useAuth } from "@clerk/clerk-react";
import { Message } from "@/types";

interface Friend {
  _id: string;
  name: string;
  picture?: string;
  lastSeen?: string;
  isOnline?: boolean;
}

interface FriendsResponse {
  data: {
    friends: Friend[];
  };
}

interface ShareUserModalProps {
  onClose: () => void;
  messageToForward: Message | null;
  onShare: (selectedUserIds: string[], message: Message) => void;
  allowMultiSelect?: boolean;
}

const ShareUserModal: React.FC<ShareUserModalProps> = ({
  onClose,
  messageToForward,
  onShare,
  allowMultiSelect = false,
}) => {
  const { getToken } = useAuth();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const MAX_SELECTION = 4;

  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) return friends;
    return friends.filter((friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [friends, searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const friendsResponse = await axiosInstance.get<FriendsResponse>(
          "/adda/getFriends",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log(friendsResponse.data.data?.friends);
        setFriends(friendsResponse.data.data?.friends || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch friends. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getToken]);

  const handleSelectUser = useCallback(
    (friendId: string) => {
      setSelectedUserIds((prev) => {
        if (allowMultiSelect) {
          if (prev.includes(friendId)) {
            return prev.filter((id) => id !== friendId);
          } else {
            if (prev.length < MAX_SELECTION) {
              return [...prev, friendId];
            }
            return prev;
          }
        } else {
          return prev[0] === friendId ? [] : [friendId];
        }
      });
    },
    [allowMultiSelect]
  );

  const canSelectFriend = useCallback(
    (friendId: string) => {
      if (!allowMultiSelect) return true;
      return (
        selectedUserIds.includes(friendId) ||
        selectedUserIds.length < MAX_SELECTION
      );
    },
    [allowMultiSelect, selectedUserIds]
  );

  const handleShare = useCallback(async () => {
    if (selectedUserIds.length === 0 || !messageToForward) return;

    setIsSharing(true);
    try {
      await onShare(selectedUserIds, messageToForward);
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000); // Close modal after 2 seconds
    } catch (err) {
      console.error("Error sharing:", err);
      setError("Failed to share content. Please try again.");
    } finally {
      setIsSharing(false);
    }
  }, [selectedUserIds, messageToForward, onShare, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        handleShare();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, handleShare]);

  const renderContentPreview = () => {
    if (!messageToForward)
      return <div className="text-gray-500">No content to share</div>;

    const { message, fileType, fileName } = messageToForward;

    switch (fileType) {
      case "image":
        return (
          <div className="flex items-center gap-3">
            <img
              src={message}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-md border border-orange-300"
            />
            <div>
              <div className="font-medium text-gray-800">Image</div>
              {fileName && (
                <div className="text-sm text-gray-600">{fileName}</div>
              )}
            </div>
          </div>
        );
      case "audio":
      case "video":
      case "file":
        return (
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-orange-100 rounded-md flex items-center justify-center">
              <span className="text-2xl">📎</span>
            </div>
            <div>
              <div className="font-medium text-gray-800 capitalize">
                {fileType}
              </div>
              {fileName && (
                <div className="text-sm text-gray-600">{fileName}</div>
              )}
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-gray-50 p-3 rounded-md border">
            <div className="text-gray-800 line-clamp-3">{message}</div>
          </div>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-md h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {showSuccess ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 bg-green-50">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-semibold text-green-800">
              Content Shared Successfully!
            </h2>
            <p className="text-gray-600 mt-2">Closing in a moment...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center p-4 border-b border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Share Content
                </h2>
                {allowMultiSelect && (
                  <p className="text-sm text-gray-600">
                    Select up to {MAX_SELECTION} friends
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors"
                aria-label="Close modal"
              >
                <MdClose className="text-xl text-gray-600" />
              </button>
            </div>

            <div className="p-4 bg-orange-50 border-b border-orange-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Content to Share
              </h3>
              {renderContentPreview()}
            </div>

            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search friends..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                  <span className="ml-3 text-gray-600">Loading friends...</span>
                </div>
              )}

              {error && (
                <div className="text-red-500 text-center py-8 px-4">
                  <div className="text-4xl mb-2">⚠️</div>
                  <div>{error}</div>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 text-orange-600 hover:underline"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!loading && !error && filteredFriends.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">👥</div>
                  <div>
                    {searchQuery
                      ? "No friends match your search"
                      : "No friends found"}
                  </div>
                </div>
              )}

              <div className="px-4 py-2 space-y-1">
                {filteredFriends.map((friend) => {
                  const isSelected = selectedUserIds.includes(friend._id);
                  const canSelect = canSelectFriend(friend._id);
                  const isDisabled = !canSelect && !isSelected;

                  return (
                    <div
                      key={friend._id}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        isDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      } ${
                        isSelected
                          ? "bg-orange-100 border-2 border-orange-400 shadow-sm"
                          : canSelect
                          ? "hover:bg-gray-50 border-2 border-transparent"
                          : "border-2 border-transparent"
                      }`}
                      onClick={() =>
                        !isDisabled && handleSelectUser(friend._id)
                      }
                    >
                      <div className="relative">
                        <img
                          src={friend.picture || "/default-avatar.png"}
                          alt={friend.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        {friend.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 truncate">
                          {friend.name}
                        </div>
                        {friend.lastSeen && (
                          <div className="text-xs text-gray-500">
                            {friend.lastSeen}
                          </div>
                        )}
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
                          <MdCheck className="text-white text-sm" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
              {selectedUserIds.length > 0 && (
                <div className="text-sm text-gray-600 mb-3">
                  {selectedUserIds.length} of{" "}
                  {allowMultiSelect ? MAX_SELECTION : 1} friend
                  {selectedUserIds.length > 1 ? "s" : ""} selected
                  {allowMultiSelect &&
                    selectedUserIds.length === MAX_SELECTION && (
                      <span className="text-orange-600 font-medium">
                        {" "}
                        (Maximum reached)
                      </span>
                    )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShare}
                  disabled={
                    selectedUserIds.length === 0 ||
                    !messageToForward ||
                    isSharing
                  }
                  className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-white font-medium transition-all ${
                    selectedUserIds.length > 0 && messageToForward && !isSharing
                      ? "bg-orange-600 hover:bg-orange-700 shadow-lg hover:shadow-xl"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {isSharing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sharing...
                    </>
                  ) : (
                    <>
                      <MdSend className="text-lg" />
                      Share
                    </>
                  )}
                </button>
              </div>

              <div className="text-xs text-gray-500 mt-2 text-center">
                Press Esc to cancel • Ctrl+Enter to share
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShareUserModal;
