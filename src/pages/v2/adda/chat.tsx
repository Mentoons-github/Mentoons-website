import Chat from "@/components/adda/messages/chat/chat";
import Friends from "@/components/adda/messages/chat/freinds";
import { motion } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";
import { FaSearch, FaPlay, FaPause } from "react-icons/fa";

export interface ChatUser {
  id: number;
  name: string;
  recentChat: string;
  time: string;
  profilePicture: string;
  new: boolean;
  online: boolean;
}

interface Message {
  id: number;
  text: string;
  sender: "me" | "other";
  time: string;
  type: "text" | "image" | "audio" | "file";
  fileName?: string;
}

interface Messages {
  [key: number]: Message[];
}

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Messages>({});
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const users: ChatUser[] = [
    {
      id: 1,
      name: "Dhanashekar",
      recentChat: "That sounds awesome! 🎉",
      time: "4m",
      profilePicture:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      new: true,
      online: true,
    },
    {
      id: 2,
      name: "Sam",
      recentChat: "Hey wanna go for a ride...",
      time: "10m",
      profilePicture:
        "https://images.unsplash.com/photo-1494790108755-2616b332c1ba?w=100&h=100&fit=crop&crop=face",
      new: false,
      online: true,
    },
    {
      id: 3,
      name: "Ram",
      recentChat: "Long time no see...",
      time: "1h",
      profilePicture:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      new: false,
      online: false,
    },
    {
      id: 4,
      name: "Priya",
      recentChat: "Thanks for the help! 👍",
      time: "2h",
      profilePicture:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      new: false,
      online: true,
    },
  ];

  const sampleMessages: Messages = useMemo(
    () => ({
      1: [
        {
          id: 1,
          text: "Hi Devan! How are you doing?",
          sender: "other",
          time: "10:30 AM",
          type: "text",
        },
        {
          id: 2,
          text: "Hey! I'm doing great, thanks for asking 😊",
          sender: "me",
          time: "10:32 AM",
          type: "text",
        },
        {
          id: 3,
          text: "I wanted to share something exciting with you!",
          sender: "other",
          time: "10:33 AM",
          type: "text",
        },
        {
          id: 4,
          text: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
          sender: "other",
          time: "10:34 AM",
          type: "image",
        },
        {
          id: 5,
          text: "Wow! That's an amazing view! 🏔️",
          sender: "me",
          time: "10:35 AM",
          type: "text",
        },
        {
          id: 6,
          text: "That sounds awesome! 🎉",
          sender: "other",
          time: "10:36 AM",
          type: "text",
        },
      ],
      2: [
        {
          id: 1,
          text: "Hey wanna go for a ride...",
          sender: "other",
          time: "9:45 AM",
          type: "text",
        },
        {
          id: 2,
          text: "Sure! Where are we heading?",
          sender: "me",
          time: "9:47 AM",
          type: "text",
        },
        {
          id: 3,
          text: "Let's go to the beach! 🏖️",
          sender: "other",
          time: "9:48 AM",
          type: "text",
        },
      ],
      3: [
        {
          id: 1,
          text: "Long time no see...",
          sender: "other",
          time: "Yesterday",
          type: "text",
        },
        {
          id: 2,
          text: "I know right! How have you been?",
          sender: "me",
          time: "Yesterday",
          type: "text",
        },
      ],
      4: [
        {
          id: 1,
          text: "Thanks for the help! 👍",
          sender: "other",
          time: "8:20 AM",
          type: "text",
        },
        {
          id: 2,
          text: "Anytime! Glad I could help",
          sender: "me",
          time: "8:22 AM",
          type: "text",
        },
      ],
    }),
    []
  );

  useEffect(() => {
    setMessages(sampleMessages);
  }, [sampleMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    const newMessage: Message = {
      id: Date.now(),
      text: message,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "text",
    };

    setMessages((prev) => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage],
    }));

    setMessage("");

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "That's interesting! 🤔",
        "I totally agree with you!",
        "Thanks for sharing that 😊",
        "Absolutely! 💯",
        "Haha, that's funny! 😄",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      const responseMessage: Message = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: "other",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "text",
      };

      setMessages((prev) => ({
        ...prev,
        [selectedUser.id]: [...(prev[selectedUser.id] || []), responseMessage],
      }));
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedUser) return;

    const fileURL = URL.createObjectURL(file);
    const fileType = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("audio/")
      ? "audio"
      : "file";

    const newMessage: Message = {
      id: Date.now(),
      text: fileURL,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: fileType,
      fileName: file.name,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage],
    }));
  };

  const toggleAudioPlay = (messageId: number) => {
    setPlayingAudio(playingAudio === messageId ? null : messageId);
  };

  const renderMessage = (msg: Message) => {
    const isMe = msg.sender === "me";

    return (
      <motion.div
        key={msg.id}
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`flex ${isMe ? "justify-end" : "justify-start"} mb-4`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
            isMe
              ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
              : "bg-gray-100 text-gray-800"
          } shadow-md`}
        >
          {msg.type === "text" && <p className="text-sm">{msg.text}</p>}
          {msg.type === "image" && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={msg.text}
                alt="Shared image"
                className="w-full h-auto max-w-48"
              />
            </div>
          )}
          {msg.type === "audio" && (
            <div className="flex items-center gap-2 py-1">
              <button
                onClick={() => toggleAudioPlay(msg.id)}
                className={`p-2 rounded-full ${
                  isMe ? "bg-white/20" : "bg-blue-500 text-white"
                }`}
              >
                {playingAudio === msg.id ? (
                  <FaPause size={12} />
                ) : (
                  <FaPlay size={12} />
                )}
              </button>
              <div className="flex-1 h-1 bg-white/30 rounded-full">
                <div className="h-full w-1/3 bg-white rounded-full"></div>
              </div>
              <span className="text-xs opacity-70">0:15</span>
            </div>
          )}
          <p
            className={`text-xs mt-1 ${
              isMe ? "text-white/70" : "text-gray-500"
            }`}
          >
            {msg.time}
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-6 gap-4 md:gap-6 overflow-hidden">
      <Friends
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        users={users}
      />

      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 flex flex-col border border-white/20"
      >
        {selectedUser ? (
          <Chat
            fileInputRef={fileInputRef}
            handleFileUpload={handleFileUpload}
            handleSendMessage={handleSendMessage}
            isRecording={isRecording}
            isTyping={isTyping}
            message={message}
            messages={messages}
            messagesEndRef={messagesEndRef}
            renderMessage={renderMessage}
            selectedUser={selectedUser}
            setIsRecording={setIsRecording}
            setMessage={setMessage}
          />
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-gray-400">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaSearch className="text-3xl text-indigo-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                Welcome to Chat
              </h2>
              <p className="text-sm">
                Select a conversation to start messaging
              </p>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ChatPage;
