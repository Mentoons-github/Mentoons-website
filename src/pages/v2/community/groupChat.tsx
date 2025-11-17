import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Send, Smile, Paperclip, Maximize2, Minimize2 } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  avatar: string;
  message: string;
  timestamp: Date;
  isOwn: boolean;
}

interface GroupChatProps {}

const GroupChat: React.FC<GroupChatProps> = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "Priya Sharma",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces&auto=format&q=80",
      message: "Hey everyone! How is everyone feeling today? 💪",
      timestamp: new Date(Date.now() - 300000),
      isOwn: false,
    },
    {
      id: "2",
      sender: "You",
      avatar:
        "https://ui-avatars.com/api/?name=You&background=f97316&color=ffffff&size=100",
      message: "Feeling much better after yesterday's session!",
      timestamp: new Date(Date.now() - 240000),
      isOwn: true,
    },
    {
      id: "3",
      sender: "Arjun Patel",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces&auto=format&q=80",
      message:
        "That's great to hear! Remember, progress is progress, no matter how small 🌟",
      timestamp: new Date(Date.now() - 180000),
      isOwn: false,
    },
    {
      id: "4",
      sender: "Sneha Reddy",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=faces&auto=format&q=80",
      message:
        "I've been practicing the mindfulness techniques we discussed. Really helpful!",
      timestamp: new Date(Date.now() - 120000),
      isOwn: false,
    },
  ]);

  const [newMessage, setNewMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: "You",
        avatar:
          "https://ui-avatars.com/api/?name=You&background=f97316&color=ffffff&size=100",
        message: newMessage.trim(),
        timestamp: new Date(),
        isOwn: true,
      };

      setMessages((prev) => [...prev, message]);
      setNewMessage("");

      // Simulate typing indicator
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Simulate a response
        const responses = [
          "That's really insightful! 👏",
          "Thank you for sharing that with us ❤️",
          "We're here to support each other! 🤝",
          "Keep up the great work! 💪",
        ];
        const response: Message = {
          id: (Date.now() + 1).toString(),
          sender: "Group Moderator",
          avatar:
            "https://ui-avatars.com/api/?name=Mod&background=10b981&color=ffffff&size=100",
          message: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          isOwn: false,
        };
        setMessages((prev) => [...prev, response]);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const fullscreenVariants = {
    normal: {
      scale: 1,
      x: 0,
      y: 0,
      width: "auto",
      height: "auto",
    },
    fullscreen: {
      scale: 1,
      x: 0,
      y: 0,
      width: "100vw",
      height: "100vh",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const ChatComponent = () => (
    <motion.div
      className={`bg-white rounded-2xl shadow-2xl overflow-hidden ${
        isFullscreen
          ? "fixed inset-0 z-50 rounded-none max-w-none"
          : "max-w-6xl mx-auto mt-8"
      }`}
      variants={isFullscreen ? fullscreenVariants : containerVariants}
      initial={isFullscreen ? "normal" : "hidden"}
      animate={isFullscreen ? "fullscreen" : "visible"}
      layout
    >
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-400 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Group Discussion</h2>
            <p className="text-orange-100 mt-1">12 members • 8 online</p>
          </div>
          <motion.button
            onClick={toggleFullscreen}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        className={`overflow-y-auto p-4 space-y-4 bg-gray-50 ${
          isFullscreen ? "h-[calc(100vh-180px)]" : "h-96"
        }`}
        style={{ scrollBehavior: "smooth" }}
      >
        {messages.map((message) => (
          <motion.div
            key={message.id}
            variants={messageVariants}
            className={`flex items-start space-x-3 ${
              message.isOwn ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <img
              src={message.avatar}
              alt={message.sender}
              className="w-10 h-10 rounded-full border-2 border-orange-300"
            />
            <div
              className={`max-w-xs lg:max-w-md ${
                message.isOwn ? "text-right" : ""
              }`}
            >
              <div
                className={`rounded-2xl px-4 py-2 ${
                  message.isOwn
                    ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-white"
                    : "bg-white border border-gray-200 text-gray-800"
                }`}
              >
                {!message.isOwn && (
                  <p className="text-sm font-semibold text-orange-600 mb-1">
                    {message.sender}
                  </p>
                )}
                <p className="text-sm leading-relaxed">{message.message}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1 px-2">
                {formatTime(message.timestamp)}
              </p>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl px-4 py-2 border border-gray-200">
              <p className="text-sm text-gray-600">Someone is typing...</p>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-orange-500 transition-colors"
          >
            <Paperclip size={20} />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors"
            >
              <Smile size={20} />
            </button>
          </div>

          <motion.button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-full transition-all ${
              newMessage.trim()
                ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <Send size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <ChatComponent />
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 z-40"
          onClick={toggleFullscreen}
        />
      )}
    </>
  );
};

export default GroupChat;
