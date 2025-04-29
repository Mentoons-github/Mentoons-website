import { useState, useEffect, useRef } from "react";
import {
  FaPaperPlane,
  FaImage,
  FaPaperclip,
  FaSmile,
  FaMicrophone,
} from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const MessageBox = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Neha",
      text: "Hi there! How are you today?",
      time: "10:32 AM",
      avatar: "https://avatar.iran.liara.run/public/94",
      isRead: true,
    },
    {
      id: 2,
      sender: "You",
      text: "I'm doing well, thanks for asking! How about you?",
      time: "10:33 AM",
      isRead: true,
    },
    {
      id: 3,
      sender: "Neha",
      text: "Great! Just working on some React components. Need any help with your project?",
      time: "10:35 AM",
      avatar: "https://avatar.iran.liara.run/public/94",
      isRead: true,
    },
    {
      id: 4,
      sender: "You",
      text: "Actually, yes! I'm trying to improve this chat interface. Do you have any suggestions?",
      time: "10:36 AM",
      isRead: true,
    },
    {
      id: 5,
      sender: "Neha",
      text: "Definitely! You could add more interactive features like typing indicators, read receipts, and maybe some emoji reactions?",
      time: "10:38 AM",
      avatar: "https://avatar.iran.liara.run/public/94",
      isRead: false,
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [emojiShower, setEmojiShower] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const newMsg = {
      id: messages.length + 1,
      sender: "You",
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isRead: false,
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");

    setTimeout(() => {
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        const response = {
          id: messages.length + 2,
          sender: "Neha",
          text: getRandomResponse(newMessage),
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          avatar: "https://avatar.iran.liara.run/public/94",
          isRead: false,
        };
        setMessages((prev) => [...prev, response]);
      }, 2000);
    }, 1000);
  };

  const handleEmojiSelect = (emoji: any) => {
    console.log("emoji revceived :", emoji);
    setNewMessage((prev) => prev + emoji.native);
    setEmojiShower(false);
  };

  const getRandomResponse = (message: string) => {
    const responses = [
      "Oh, that's interesting! I'd love to hear more about it.",
      "Yeah, I get what you mean — maybe we could try looking at it a little differently?",
      "That's a great thought! Maybe we can build something even better from there.",
      "I'm really curious — tell me more about what you're thinking.",
      "That's such a clever idea! How did you come up with that?",
      "Funny enough, I've been mulling over something kind of similar lately.",
      "Thanks for sharing that. Let's dig into it together and see where it goes!",
    ];

    if (message.endsWith("?")) {
      return "That's a good question! I think it depends on the specific context, but generally I'd say it's worth trying.";
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const formatMessageDate = (index: number) => {
    const currentDate = new Date();
    if (index === 0) {
      return "Today";
    } else if (index === 3) {
      const yesterday = new Date(currentDate);
      yesterday.setDate(currentDate.getDate() - 1);
      return "Yesterday";
    }
    return null;
  };

  return (
    <div className="sticky border shadow-xl rounded-lg flex-1 flex flex-col h-[600px] bg-gray-50">
      <div className="p-4 flex items-center justify-between bg-gray-800 rounded-t-lg">
        <div className="flex items-center">
          <div className="relative">
            <img
              src="https://avatar.iran.liara.run/public/94"
              alt="Neha Mathew"
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-400"
            />
            <span className="absolute bottom-0 right-0 bg-green-500 rounded-full w-3 h-3"></span>
          </div>
          <div className="ml-3">
            <h1 className="text-white text-xl font-semibold">Neha Mathew</h1>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-sm">Online</span>
              <span className="text-gray-300 text-xs">
                • Last seen today at 12:45 PM
              </span>
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
        {messages.map((message, index) => (
          <div key={message.id}>
            {formatMessageDate(index) && (
              <div className="flex justify-center my-4">
                <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {formatMessageDate(index)}
                </span>
              </div>
            )}
            <div
              className={`mb-4 flex ${
                message.sender === "You" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender !== "You" && (
                <img
                  src={message.avatar}
                  alt={message.sender}
                  className="w-8 h-8 rounded-full mr-2 self-end"
                />
              )}
              <div
                className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                  message.sender === "You"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none shadow"
                }`}
              >
                <p className="break-words">{message.text}</p>
                <div className="flex justify-end items-center mt-1 gap-1">
                  <span
                    className={`text-xs ${
                      message.sender === "You"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.time}
                  </span>
                  {message.sender === "You" && (
                    <span className="text-xs">
                      {message.isRead ? (
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
        ))}

        {isTyping && (
          <div className="flex items-center mb-4">
            <img
              src="https://avatar.iran.liara.run/public/94"
              alt="Neha"
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
        <div className="relative">
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
        </div>

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
        />

        {newMessage ? (
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
          >
            <FaPaperPlane className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
          >
            <FaMicrophone className="h-4 w-4" />
          </button>
        )}
      </form>
    </div>
  );
};

export default MessageBox;
