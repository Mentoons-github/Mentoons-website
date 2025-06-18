import {
  Dispatch,
  RefObject,
  SetStateAction,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  BsEmojiSmile,
  BsPaperclip,
  BsThreeDotsVertical,
  BsDownload,
  BsX,
  BsPlay,
  BsPause,
  BsTrash,
  BsCheck,
} from "react-icons/bs";
import { useAudioRecorder } from "@/hooks/adda/useAudioRecorder";
import { FaMicrophone, FaPaperPlane } from "react-icons/fa6";
import { MdSearch } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

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
  selectedUser: ChatUser;
  messages: Messages;
  isTyping: boolean;
  messagesEndRef: RefObject<HTMLDivElement>;
  fileInputRef: RefObject<HTMLInputElement>;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  setIsRecording: Dispatch<SetStateAction<boolean>>;
  isRecording: boolean;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendMessage: () => void;
  renderMessage: (msg: Message) => JSX.Element;
  setMessages?: Dispatch<SetStateAction<Messages>>;
}

const Chat = ({
  selectedUser,
  messages,
  isTyping,
  messagesEndRef,
  fileInputRef,
  message,
  setMessage,
  setIsRecording,
  isRecording,
  handleFileUpload,
  handleSendMessage,
  renderMessage,
  setMessages,
}: ChatProps) => {
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const buttonRef = useRef(null);

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
      setMessages((prev) => ({
        ...prev,
        [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage],
      }));

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

  return (
    <>
      <div className="flex justify-between items-center mb-6 px-2 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={selectedUser.profilePicture}
              alt={selectedUser.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
            />
            {selectedUser.online && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-gray-800">
              {selectedUser.name}
            </h1>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm ${
                  selectedUser.online ? "text-green-600" : "text-gray-500"
                }`}
              >
                {selectedUser.online ? "Online" : "Last seen 1h ago"}
              </span>
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
        {messages[selectedUser.id]?.map(enhancedRenderMessage)}

        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex justify-start mb-4"
            >
              <div className="bg-gray-100 px-4 py-3 rounded-2xl shadow-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*,audio/*"
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-full transition-all"
          disabled={isRecording || recordedAudio !== null}
        >
          <BsPaperclip size={18} />
        </button>

        <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-300 transition-all">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" &&
              !isRecording &&
              !recordedAudio &&
              handleSendMessage()
            }
            placeholder={
              isRecording
                ? "Recording..."
                : recordedAudio
                ? "Audio recorded - preview above"
                : "Type a message..."
            }
            className="outline-none bg-transparent flex-1 text-sm text-gray-700 placeholder-gray-400"
            disabled={isRecording || recordedAudio !== null}
          />
          <BsEmojiSmile
            className={`cursor-pointer transition-colors ${
              isRecording || recordedAudio
                ? "text-gray-300"
                : "text-gray-400 hover:text-yellow-500"
            }`}
          />
        </div>

        <button
          onClick={() => setIsRecording(!isRecording)}
          disabled={recordedAudio !== null}
          className={`p-3 rounded-full transition-all ${
            isRecording
              ? "bg-red-500 text-white animate-pulse"
              : recordedAudio
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:text-indigo-500 hover:bg-indigo-50"
          }`}
        >
          <FaMicrophone size={18} />
        </button>

        <motion.button
          whileHover={{
            scale:
              recordedAudio ||
              (!message.trim() && !recordedAudio) ||
              isRecording
                ? 1
                : 1.05,
          }}
          whileTap={{
            scale:
              recordedAudio ||
              (!message.trim() && !recordedAudio) ||
              isRecording
                ? 1
                : 0.95,
          }}
          onClick={handleSendMessage}
          disabled={
            (!message.trim() && !recordedAudio) ||
            isRecording ||
            recordedAudio !== null
          }
          className="p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:shadow-lg hover:shadow-orange-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaPaperPlane size={16} />
        </motion.button>
      </div>
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
