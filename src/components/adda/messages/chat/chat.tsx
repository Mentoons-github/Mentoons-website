import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  BsDownload,
  BsX,
  BsPlay,
  BsPause,
  BsTrash,
  BsCheck,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { useAudioRecorder } from "@/hooks/adda/useAudioRecorder";
import { MdSearch } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import ChatFooter from "./chatFooter";
import { useAuth } from "@clerk/clerk-react";
import axiosInstance from "@/api/axios";
import { User } from "@/types";
import useSocket from "@/hooks/adda/useSocket";
import MorphingBubbleIndicator from "./TypingIndicator";
import { FaShare } from "react-icons/fa6";
import { uploadFile } from "@/redux/fileUploadSlice";
import { sendFileMessage, sendTextMessage } from "@/services/chatServices";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import FilePreview from "./filePreview";
import ChatMenuModal from "@/components/modals/ChatMenuModal";
import { SocketOnlineUser } from "./freinds";
import ShareUserModal from "../share/shareModal";

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
  message: string;
  senderId?: string;
  receiverId: string;
  timestamp: string;
  fileType?: "text" | "image" | "audio" | "video" | "file";
  fileName?: string;
}

export interface Messages {
  [key: number]: Message[];
}

interface ChatProps {
  selectedUser: string;
}

const Chat: React.FC<ChatProps> = ({ selectedUser }) => {
  const { getToken } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  // const {data:messages} = useSelector((state:RootState)=>state.conversation)

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileURL, setSelectedFileURL] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<SocketOnlineUser[]>([]);
  const [forwardOpen, setForwardOpen] = useState(false);
  const [messageToSend, setMessageToSend] = useState<Message | null>(null);
  const buttonRef = useRef(null);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setMessages([]);
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
      setUser(response.data.data.user);
    } catch (err) {
      console.error("Error fetching user:", err);
      setError(err instanceof Error ? err.message : "Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [selectedUser]);

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (data) => {
      console.log("data recieved :", data );
      const {
        // chatId,
        // conversationId,
        senderId,
        receiverId,
        message,
        timestamp,
        fileType,
        fileName,
      } = data;

      setMessages((prev) => [
        ...prev,
        {
          senderId,
          receiverId,
          message,
          timestamp,
          fileType,
          fileName,
        },
      ]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket, selectedUser, user]);

  useEffect(() => {
    if (!socket) return;

    // Listen for online users
    socket.on("online_users", (data: SocketOnlineUser[]) => {
      console.log("Online users updated:", data);
      setOnlineUsers(data);
    });

    socket.emit("online_users");

    return () => {
      socket.off("online_users");
    };
  }, [socket]);

  const handleSendMessage = async () => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const resultAction = await dispatch(
        uploadFile({ file: selectedFile, getToken })
      );

      if (uploadFile.fulfilled.match(resultAction)) {
        const uploadedUrl = resultAction.payload.data.fileDetails?.url;
        sendFileMessage(
          socket!,
          selectedUser,
          uploadedUrl,
          selectedFile.name,
          "image"
        );
      } else {
        console.error("File upload failed:", resultAction.payload);
      }

      setSelectedFile(null);
      setSelectedFileURL(null);
      return;
    }

    if (message.trim() && selectedUser && socket && user) {
      sendTextMessage(socket, selectedUser, message);
      setMessage("");
    }
  };

  const isSelectedUserOnline = useMemo(() => {
    return onlineUsers.some((user) => user.friend?._id === selectedUser);
  }, [onlineUsers, selectedUser]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setSelectedFileURL(URL.createObjectURL(file));
  };

  const handleAction = (action: string) => {
    console.log(`Action selected: ${action}`);
    setIsModalOpen(false);
  };

  const handleForwardMessage = (msg: Message) => {
    setForwardOpen(true);
    setMessageToSend(msg);
  };

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
    if (recordedAudio && socket && user) {
      socket.emit("send_message", {
        receiverId: selectedUser,
        fileType: "audio",
        message: recordedAudio,
        fileName: `audio_${Date.now()}.webm`,
      });

      setRecordedAudio(null);
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("typing", ({ userId }) => {
      if (userId === selectedUser) {
        setOtherUserTyping(true);
      }
    });

    socket.on("stopped_typing", ({ userId }) => {
      if (userId === selectedUser) {
        setOtherUserTyping(false);
      }
    });

    return () => {
      socket.off("typing");
      socket.off("stopped_typing");
    };
  }, [socket, selectedUser, user]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (!socket || !user) return;

    if (!typing) {
      socket.emit("typing", {
        receiverId: selectedUser,
      });
      setTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopped_typing", {
        receiverId: selectedUser,
      });
      setTyping(false);
    }, 1000);
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

  if (error) {
    console.log(error, "error from profile");
  }

  const handleSendFile = async () => {
    if (!selectedFile || !socket || !user) return;

    const resultAction = await dispatch(
      uploadFile({ file: selectedFile, getToken })
    );

    if (uploadFile.fulfilled.match(resultAction)) {
      const uploadedUrl = resultAction.payload.data.fileDetails?.url;
      console.log(resultAction.payload.data.fileDetails?.url, "urllllll");

      let fileType: "image" | "audio" | "file" = "file";
      if (selectedFile.type.startsWith("image/")) fileType = "image";
      else if (selectedFile.type.startsWith("audio/")) fileType = "audio";

      sendFileMessage(
        socket,
        selectedUser,
        uploadedUrl,
        selectedFile.name,
        fileType
      );

      setSelectedFile(null);
      setSelectedFileURL(null);
    } else {
      console.error("File upload failed:", resultAction.payload);
    }
  };

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="flex justify-between items-center mb-6 px-2 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex flex-col">
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-16 h-3 bg-gray-200 rounded mt-2"></div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex justify-start mb-4">
            <div className="max-w-xs bg-gray-200 rounded-2xl p-4">
              <div className="w-32 h-4 bg-gray-300 rounded"></div>
              <div className="w-16 h-3 bg-gray-300 rounded mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedUser}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex flex-col h-full"
      >
        {isLoading || error ? (
          <SkeletonLoader />
        ) : (
          <>
            <div className="flex justify-between items-center mb-6 px-4 pb-4 border-b border-gray-200">
              {/* Left section */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={user?.picture}
                    alt={user?.name || "User Avatar"}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-300 shadow-md"
                  />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-lg font-semibold text-gray-900">
                    {user?.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isSelectedUserOnline ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></span>
                    <span className="text-sm font-medium text-gray-600">
                      {isSelectedUserOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 relative">
                <button
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                  aria-label="Search"
                >
                  <MdSearch className="text-2xl text-gray-600 hover:text-indigo-500 transition-colors" />
                </button>

                <button
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                  aria-label="Menu"
                  onClick={() => setIsModalOpen(true)}
                  ref={buttonRef}
                >
                  <BsThreeDotsVertical className="text-2xl text-gray-600 hover:text-indigo-500 transition-colors" />
                </button>

                <ChatMenuModal
                  buttonRef={buttonRef}
                  handleAction={handleAction}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4 bg-[url('/assets/adda/chat/background/d393ffb1117aaf22c62eaf8cf1f09587a6148e88.png')] bg-contain bg-no-repeat bg-center bg-gray-900 bg-opacity-25">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    msg.senderId !== selectedUser
                      ? "justify-end"
                      : "justify-start"
                  } mb-4 items-end`}
                >
                  <div
                    className={`flex flex-col max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-md ${
                      msg.senderId !== selectedUser
                        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.fileType === "image" && (
                      <img
                        src={msg.message}
                        alt="Image"
                        className="w-full h-auto rounded-md mb-2 cursor-pointer"
                        onClick={() => setEnlargedImage(msg.message)}
                      />
                    )}
                    {msg.fileType === "audio" && (
                      <audio
                        src={msg.message}
                        controls
                        className="w-full rounded-md mb-2"
                      />
                    )}
                    {msg.fileType === "video" && (
                      <video
                        src={msg.message}
                        controls
                        className="w-full max-w-[200px] rounded-md mb-2"
                      />
                    )}
                    {msg.fileType === "file" && (
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm truncate">{msg.fileName}</p>
                        <button
                          className="ml-2 p-1 bg-white text-black rounded"
                          onClick={() =>
                            downloadFile(msg.message, msg.fileName || "file")
                          }
                        >
                          Download
                        </button>
                      </div>
                    )}
                    {(!msg.fileType || msg.fileType === "text") && (
                      <p className="text-sm">{msg.message}</p>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <p
                        className={`text-xs ${
                          msg.senderId !== selectedUser
                            ? "text-white/70"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  {(msg.fileType === "image" ||
                    msg.fileType === "audio" ||
                    msg.fileType === "video") && (
                    <button
                      onClick={() => handleForwardMessage(msg)}
                      className={`ml-2 p-2 rounded-full transition-colors ${
                        msg.senderId !== selectedUser
                          ? "text-white bg-green-600"
                          : "text-gray-500 hover:bg-gray-200"
                      }`}
                      title="Forward"
                    >
                      <FaShare size={20} />
                    </button>
                  )}
                </motion.div>
              ))}
              <MorphingBubbleIndicator isTyping={otherUserTyping} />
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
                    {isPlayingPreview ? (
                      <BsPause size={14} />
                    ) : (
                      <BsPlay size={14} />
                    )}
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
            <FilePreview
              selectedFile={selectedFile}
              selectedFileURL={selectedFileURL}
              onCancel={() => {
                setSelectedFile(null);
                setSelectedFileURL(null);
              }}
              onSend={handleSendFile}
            />
            <ChatFooter
              fileInputRef={fileInputRef}
              message={message}
              handleMessageChange={handleMessageChange}
              handleFileUpload={handleFileUpload}
              handleSendMessage={handleSendMessage}
              isRecording={isRecording}
              recordedAudio={recordedAudio}
              setIsRecording={setIsRecording}
              selectedFile={selectedFile}
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
        )}
      </motion.div>
      {forwardOpen && messageToSend && (
        <ShareUserModal
          allowMultiSelect={true}
          onClose={() => {
            setForwardOpen(false);
            setMessageToSend(null);
          }}
          messageToForward={messageToSend}
          onShare={(selectedUserId, message) => {
            if (socket && user) {
              socket.emit("send_message", {
                receiverId: selectedUserId,
                message: message.message,
                fileType: message.fileType,
                fileName: message.fileName,
              });
            }
            setForwardOpen(false);
            setMessageToSend(null);
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default Chat;
