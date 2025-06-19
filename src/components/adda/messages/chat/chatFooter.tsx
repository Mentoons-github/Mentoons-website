import React, { Dispatch, RefObject, SetStateAction } from "react";
import { BsEmojiSmile, BsPaperclip } from "react-icons/bs";
import { FaMicrophone, FaPaperPlane } from "react-icons/fa6";
import {  motion } from "framer-motion";


interface ChatFooterProps {
  fileInputRef: RefObject<HTMLInputElement>;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendMessage: () => void;
  isRecording: boolean;
  recordedAudio: null | string;
  setIsRecording: Dispatch<SetStateAction<boolean>>;
}

const ChatFooter = ({
  fileInputRef,
  message,
  setMessage,
  handleFileUpload,
  handleSendMessage,
  isRecording,
  recordedAudio,
  setIsRecording,
}: ChatFooterProps) => {
  return (
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
            recordedAudio || (!message.trim() && !recordedAudio) || isRecording
              ? 1
              : 1.05,
        }}
        whileTap={{
          scale:
            recordedAudio || (!message.trim() && !recordedAudio) || isRecording
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
  );
};

export default ChatFooter;
