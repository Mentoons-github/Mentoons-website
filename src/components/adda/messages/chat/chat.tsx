import { useState, useEffect, useRef } from "react";
import {
  BsThreeDotsVertical,
  BsDownload,
  BsX,
  BsPlay,
  BsPause,
  BsTrash,
  BsCheck,
} from "react-icons/bs";
import { useAudioRecorder } from "@/hooks/adda/useAudioRecorder";
import { MdSearch } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import ChatFooter from "./chatFooter";
import { FaPause, FaPlay } from "react-icons/fa6";
import { useAuth } from "@clerk/clerk-react";
import axiosInstance from "@/api/axios";
import { User } from "@/types";
import useSocket from "@/utils/socket/socket";
// import useSocket from "@/utils/socket/socket";

export interface ChatUser {
  id: number;
  name: string;
  recentChat: string;
  time: string;
  profilePicture: string;
  new: boolean;
  online: boolean;
}

export interface Message {
  id: number;
  text: string;
  sender: "me" | "other";
  time: string;
  type: "text" | "image" | "audio" | "file";
  fileName?: string;
}

export interface Messages {
  [key: number]: Message[];
}

interface ChatProps {
  selectedUser: string;
}

const Chat: React.FC<ChatProps> = ({ selectedUser }) => {
  console.log("first", selectedUser);
  const { getToken } = useAuth();

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const buttonRef = useRef(null);

  const fetchUserData = async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axiosInstance.get(`/user/friend/${selectedUser}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data.data.isFriend);
      setUser(response.data.data.user);
    } catch (err) {
      console.error("Error fetching user:", err);
      setError(err instanceof Error ? err.message : "Failed to load user data");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

 setMessages(prev => [...prev, newMessage]);


    setMessage("");

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

    setMessages(prev => [...prev, newMessage]);
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

  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;
    socket.connect();

    socket.on("receive_message", ({ from, message, createdAt }) => {
      if (from === selectedUser) {
        setMessages((prev) => [
          ...prev,
          { from, message, createdAt },
        ]);
      }
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  });

  const handleAction = (action: string) => {
    console.log(`Action selected: ${action}`);
    setIsModalOpen(false);
  };

  const menuItems = [
    {
      label: "Report Abuse",
      icon: "🚩",
      hoverBg: "hover:bg-red-50",
      action: "Report Abuse",
    },
    {
      label: "Block User",
      icon: "🚫",
      hoverBg: "hover:bg-red-50",
      action: "Block User",
    },
    {
      label: "Mute User",
      icon: "🔇",
      hoverBg: "hover:bg-yellow-50",
      action: "Mute User",
    },
    {
      label: "Cancel",
      icon: "❌",
      hoverBg: "hover:bg-gray-50",
      action: "Cancel",
    },
  ];

  const { startRecording, stopRecording, audioUrl } = useAudioRecorder();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }

    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if (isRecording) {
      startRecording();
      setRecordedAudio(null);
    } else {
      stopRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  useEffect(() => {
    if (audioUrl && !isRecording) {
      setRecordedAudio(audioUrl);
    }
  }, [audioUrl, isRecording]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePreview = () => {
    if (!recordedAudio) return;

    if (isPlayingPreview) {
      previewAudio?.pause();
      setIsPlayingPreview(false);
    } else {
      const audio = new Audio(recordedAudio);
      audio.onended = () => setIsPlayingPreview(false);
      audio.play();
      setPreviewAudio(audio);
      setIsPlayingPreview(true);
    }
  };

  const sendRecordedAudio = () => {
    if (recordedAudio && setMessages) {
      const newMessage: Message = {
        id: Date.now(),
        text: recordedAudio,
        sender: "me",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "audio",
        fileName: `audio_${Date.now()}.webm`,
      };
      setMessages(prev => [...prev, newMessage]);

      setRecordedAudio(null);
      setIsRecording(false);
    }
  };

  const discardRecording = () => {
    if (previewAudio) {
      previewAudio.pause();
      setIsPlayingPreview(false);
    }
    setRecordedAudio(null);
    setIsRecording(false);
  };

  const downloadFile = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const enhancedRenderMessage = (msg: Message) => {
    if (msg.type === "image" && msg.text) {
      return (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex ${
            msg.sender === "me" ? "justify-end" : "justify-start"
          } mb-4`}
        >
          <div
            className={`max-w-xs lg:max-w-md rounded-2xl shadow-md overflow-hidden ${
              msg.sender === "me"
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            <div className="relative group p-2">
              <img
                src={msg.text}
                alt="Shared image"
                className="w-full h-auto max-h-64 object-contain rounded-lg cursor-pointer transition-transform hover:scale-105"
                onClick={() => setEnlargedImage(msg.text)}
              />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadFile(msg.text, msg.fileName || "image.jpg");
                  }}
                  className="p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                >
                  <BsDownload size={12} />
                </button>
              </div>
            </div>
            <div className="px-3 pb-2">
              <span
                className={`text-xs ${
                  msg.sender === "me"
                    ? "text-white text-opacity-70"
                    : "text-gray-500"
                }`}
              >
                {msg.time}
              </span>
            </div>
          </div>
        </motion.div>
      );
    }

    if (msg.type === "audio" && msg.text) {
      return (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex ${
            msg.sender === "me" ? "justify-end" : "justify-start"
          } mb-4`}
        >
          <div
            className={`max-w-xs lg:max-w-md rounded-2xl shadow-md ${
              msg.sender === "me"
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            <div className="relative group p-2">
              <audio src={msg.text} controls className="w-full rounded-lg" />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() =>
                    downloadFile(msg.text, msg.fileName || "audio.webm")
                  }
                  className="p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                >
                  <BsDownload size={12} />
                </button>
              </div>
            </div>
            <div className="px-3 pb-2">
              <span
                className={`text-xs ${
                  msg.sender === "me"
                    ? "text-white text-opacity-70"
                    : "text-gray-500"
                }`}
              >
                {msg.time}
              </span>
            </div>
          </div>
        </motion.div>
      );
    }

    return renderMessage(msg);
  };

  if(error){
    console.log(error,'error from profile')
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6 px-2 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          {isLoading&&(
            <div>Loading</div>
          )}
          <div className="relative">
            <img
              src={user?.picture}
              alt={user?.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
            />
            {/* {selectedUser.online && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
            )} */}
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-gray-800">
              {user?.name}
            </h1>
            <div className="flex items-center gap-2">
              {/* <span
                className={`text-sm ${
                  selectedUser.online ? "text-green-600" : "text-gray-500"
                }`}
              >
                {selectedUser.online ? "Online" : "Last seen 1h ago"}
              </span> */}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 relative">
          <MdSearch className="text-xl text-gray-500 cursor-pointer hover:text-indigo-500 transition-colors" />

          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setIsModalOpen(!isModalOpen)}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
            >
              <BsThreeDotsVertical className="text-xl text-gray-500 hover:text-indigo-500 transition-colors" />
            </button>

            <AnimatePresence>
              {isModalOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black bg-opacity-20 z-40"
                    onClick={() => setIsModalOpen(false)}
                  />

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 w-48 py-2 z-50"
                  >
                    {menuItems.map((item, index) => (
                      <motion.button
                        key={item.action}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.1,
                          ease: "easeOut",
                        }}
                        onClick={() => handleAction(item.action)}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                          item.hoverBg
                        } ${
                          index !== menuItems.length - 1
                            ? "border-b border-gray-100"
                            : ""
                        }`}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span className="text-sm font-medium text-gray-700">
                          {item.label}
                        </span>
                      </motion.button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4 bg-[url('/assets/adda/chat/background/d393ffb1117aaf22c62eaf8cf1f09587a6148e88.png')] bg-contain bg-no-repeat bg-center bg-gray-900 bg-opacity-25">
        {messages?.map(enhancedRenderMessage)}

        <div ref={messagesEndRef} />
      </div>
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center justify-center py-2 bg-red-50 border border-red-200 rounded-lg mx-2 mb-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-600 font-medium">
                Recording... {formatDuration(recordingDuration)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {recordedAudio && !isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-3 py-3 px-4 bg-blue-50 border border-blue-200 rounded-lg mx-2 mb-2"
          >
            <button
              onClick={togglePreview}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              {isPlayingPreview ? <BsPause size={14} /> : <BsPlay size={14} />}
            </button>

            <div className="flex-1">
              <div className="text-sm text-blue-700 font-medium">
                Audio Preview
              </div>
              <div className="text-xs text-blue-600">
                Tap play to listen before sending
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={discardRecording}
                className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-all"
                title="Discard recording"
              >
                <BsTrash size={14} />
              </button>

              <button
                onClick={sendRecordedAudio}
                className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                title="Send recording"
              >
                <BsCheck size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ChatFooter
        fileInputRef={fileInputRef}
        message={message}
        setMessage={setMessage}
        handleFileUpload={handleFileUpload}
        handleSendMessage={handleSendMessage}
        isRecording={isRecording}
        recordedAudio={recordedAudio}
        // setRecordedAudio = {setRecordedAudio}
        setIsRecording={setIsRecording}
      />
      <AnimatePresence>
        {enlargedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={() => setEnlargedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-2xl max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={enlargedImage}
                alt="Enlarged view"
                className="w-96 h-full object-contain rounded-lg"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() =>
                    downloadFile(enlargedImage, "enlarged-image.jpg")
                  }
                  className="p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                >
                  <BsDownload size={20} />
                </button>
                <button
                  onClick={() => setEnlargedImage(null)}
                  className="p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                >
                  <BsX size={20} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chat;
