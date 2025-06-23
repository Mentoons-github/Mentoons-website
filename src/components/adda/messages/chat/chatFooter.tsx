import React, { Dispatch, RefObject, SetStateAction } from "react";
import { BsPaperclip } from "react-icons/bs";
import { FaMicrophone, FaPaperPlane } from "react-icons/fa6";

interface ChatFooterProps {
  fileInputRef: RefObject<HTMLInputElement>;
  message: string;
  handleMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendMessage: () => void;
  isRecording: boolean;
  recordedAudio: null | string;
  setIsRecording: Dispatch<SetStateAction<boolean>>;
  selectedFile: File | null;
}

const ChatFooter: React.FC<ChatFooterProps> = ({
  fileInputRef,
  message,
  handleMessageChange,
  handleFileUpload,
  handleSendMessage,
  isRecording,
  recordedAudio,
  setIsRecording,
  selectedFile,
}) => {
  return (
    <div className="flex items-center gap-2 p-4 bg-white border-t">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,audio/*,application/*"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="text-gray-500"
      >
        <BsPaperclip size={22} />
      </button>

      <input
        type="text"
        value={message}
        disabled={isRecording || !!recordedAudio}
        onChange={(e) => handleMessageChange(e)}
        placeholder={isRecording ? "Recording..." : "Type a message..."}
        className="flex-1 border rounded-full px-4 py-2 text-sm"
      />

      <button
        onClick={() => setIsRecording((prev) => !prev)}
        disabled={!!recordedAudio}
      >
        <FaMicrophone
          size={20}
          className={`${
            isRecording ? "text-red-500 animate-pulse" : "text-gray-500"
          }`}
        />
      </button>

      <button
        onClick={handleSendMessage}
        disabled={
          (!message.trim() && !recordedAudio && !selectedFile) || isRecording
        }
        className={`rounded-full p-3 text-white 
    ${
      (!message.trim() && !recordedAudio && !selectedFile) || isRecording
        ? "bg-orange-300 cursor-not-allowed"
        : "bg-orange-500 hover:bg-orange-600"
    }`}
      >
        <FaPaperPlane size={16} />
      </button>
    </div>
  );
};

export default ChatFooter;
