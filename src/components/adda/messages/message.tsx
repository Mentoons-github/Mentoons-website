import { useState, useEffect, useRef } from "react";
import {
  FaPaperPlane,
  FaImage,
  FaPaperclip,
  // FaSmile,
  FaMicrophone,
} from "react-icons/fa";
// import Picker from "@emoji-mart/react";
// import data from "@emoji-mart/data";
import axiosInstance from "@/api/axios";
import { Friend, Message as MessageType } from "@/types";

interface MessageBoxProps {
  selectedUser: Friend | null;
}

const MessageBox = ({ selectedUser }: MessageBoxProps) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [emojiShower, setEmojiShower] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Fetch messages when a user is selected
  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    } else {
      // Clear messages if no user is selected
      setMessages([]);
    }
  }, [selectedUser]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle typing indicator
  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;
    if (newMessage && !isTyping) {
      setIsTyping(true);
    } else if (!newMessage && isTyping) {
      typingTimeout = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }

    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [newMessage, isTyping]);

  const fetchMessages = async (userId: string) => {
    try {
      setIsLoading(true);
      // Assuming you have an endpoint to fetch messages for a specific conversation
      // You might need to create this endpoint if it doesn't exist
      const response = await axiosInstance.get(`/getMessages/${userId}`);

      if (response.data && response.data.data) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const currentTime = new Date().toISOString();
    const userMessage: MessageType = {
      _id: `temp-${Date.now()}`,
      conversationId: "", // Will be set by the server
      sender: "currentUser", // Replace with actual current user ID from auth
      text: newMessage,
      createdAt: currentTime,
      read: false,
    };

    // Optimistically add message to UI
    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = newMessage;
    setNewMessage("");

    try {
      // Send message to server
      await axiosInstance.post("/sendMessage", {
        receiverId: selectedUser._id,
        text: messageToSend,
      });

      fetchMessages(selectedUser._id);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // const handleEmojiSelect = (emoji: any) => {
  //   setNewMessage((prev) => prev + emoji.native);
  //   setEmojiShower(false);
  // };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMessageDate = (currentIndex: number) => {
    if (!messages[currentIndex]) return null;

    const currentDate = new Date(messages[currentIndex].createdAt);

    if (currentIndex === 0) {
      const today = new Date();
      return currentDate.toDateString() === today.toDateString()
        ? "Today"
        : currentDate.toLocaleDateString();
    }

    const prevDate = new Date(messages[currentIndex - 1].createdAt);

    if (currentDate.toDateString() !== prevDate.toDateString()) {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (currentDate.toDateString() === today.toDateString()) {
        return "Today";
      } else if (currentDate.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
      } else {
        return currentDate.toLocaleDateString();
      }
    }

    return null;
  };

  // Helper to determine if a message is from the current user
  const isMessageFromCurrentUser = (senderId: string) => {
    // Replace 'currentUser' with actual current user ID from auth
    return senderId === "currentUser";
  };

  // If no user is selected, show empty state
  if (!selectedUser) {
    return (
      <div className="sticky border shadow-xl rounded-lg flex-1 flex flex-col h-[520px] bg-gray-50 items-center justify-center">
        <div className="text-center p-8">
          <div className="text-gray-400 mb-2">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-600">
            Select a conversation
          </h3>
          <p className="text-gray-500 mt-1">
            Choose a friend from the list to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky border shadow-xl rounded-lg flex-1 flex flex-col h-[520px] bg-gray-50">
      <div className="p-4 flex items-center justify-between bg-gray-800 rounded-t-lg">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={
                selectedUser.picture || "https://avatar.iran.liara.run/public"
              }
              alt={selectedUser.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-400"
            />
            <span
              className={`absolute bottom-0 right-0 ${
                selectedUser.isOnline ? "bg-green-500" : "bg-gray-500"
              } rounded-full w-3 h-3`}
            ></span>
          </div>
          <div className="ml-3">
            <h1 className="text-white text-xl font-semibold">
              {selectedUser.name}
            </h1>
            <div className="flex items-center gap-2">
              <span
                className={
                  selectedUser.isOnline
                    ? "text-green-400 text-sm"
                    : "text-gray-300 text-sm"
                }
              >
                {selectedUser.isOnline ? "Online" : "Offline"}
              </span>
              {selectedUser.lastSeen && (
                <span className="text-gray-300 text-xs">
                  •{" "}
                  {selectedUser.isOnline
                    ? "Active now"
                    : `Last seen ${selectedUser.lastSeen}`}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="text-gray-300 hover:text-white">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-100"
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-gray-500">
            <svg
              className="w-12 h-12 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={message._id}>
              {formatMessageDate(index) && (
                <div className="flex justify-center my-4">
                  <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {formatMessageDate(index)}
                  </span>
                </div>
              )}
              <div
                className={`mb-4 flex ${
                  isMessageFromCurrentUser(message.sender)
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {!isMessageFromCurrentUser(message.sender) && (
                  <img
                    src={
                      selectedUser.picture ||
                      "https://avatar.iran.liara.run/public"
                    }
                    alt={selectedUser.name}
                    className="w-8 h-8 rounded-full mr-2 self-end"
                  />
                )}
                <div
                  className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                    isMessageFromCurrentUser(message.sender)
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none shadow"
                  }`}
                >
                  <p className="break-words">{message.text}</p>
                  <div className="flex justify-end items-center mt-1 gap-1">
                    <span
                      className={`text-xs ${
                        isMessageFromCurrentUser(message.sender)
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.createdAt)}
                    </span>
                    {isMessageFromCurrentUser(message.sender) && (
                      <span className="text-xs">
                        {message.read ? (
                          <svg
                            className="w-4 h-4 text-blue-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 text-blue-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex items-center mb-4">
            <img
              src={
                selectedUser.picture || "https://avatar.iran.liara.run/public"
              }
              alt={selectedUser.name}
              className="w-8 h-8 rounded-full mr-2"
            />
            <div className="bg-gray-200 rounded-full px-4 py-2">
              <div className="flex space-x-1">
                <div className="bg-gray-500 rounded-full w-2 h-2 animate-bounce"></div>
                <div
                  className="bg-gray-500 rounded-full w-2 h-2 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="bg-gray-500 rounded-full w-2 h-2 animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="border-t p-3 bg-white flex items-center gap-2"
      >
        {/* <div className="relative">
          <button
            onClick={() => setEmojiShower((prev) => !prev)}
            type="button"
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
          >
            <FaSmile className="w-5 h-5" />
          </button>

          {emojiShower && (
            <div
              className="absolute mt-2 z-[1000000000]"
              style={{ top: "-460px" }}
            >
              <Picker
                data={data}
                previewPosition="none"
                onEmojiSelect={(emoji: any) => handleEmojiSelect(emoji)}
              />
            </div>
          )}
        </div> */}

        <button
          type="button"
          className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
        >
          <FaPaperclip className="w-5 h-5" />
        </button>

        <button
          type="button"
          className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
        >
          <FaImage className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
          placeholder="Type a message..."
          disabled={!selectedUser}
        />

        {newMessage ? (
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
            disabled={!selectedUser}
          >
            <FaPaperPlane className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
            disabled={!selectedUser}
          >
            <FaMicrophone className="h-4 w-4" />
          </button>
        )}
      </form>
    </div>
  );
};

export default MessageBox;
