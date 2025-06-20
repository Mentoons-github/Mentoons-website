import React, { Dispatch, RefObject, SetStateAction } from "react";
import { BsPaperclip } from "react-icons/bs";
import { FaMicrophone, FaPaperPlane } from "react-icons/fa6";

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

const ChatFooter: React.FC<ChatFooterProps> = ({
  fileInputRef,
  message,
  setMessage,
  handleFileUpload,
  handleSendMessage,
  isRecording,
  recordedAudio,
  setIsRecording
}) => {
  return (
    <div className="flex items-center gap-2 p-4 bg-white border-t">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,audio/*,application/*" />

      <button onClick={() => fileInputRef.current?.click()} className="text-gray-500">
        <BsPaperclip size={22} />
      </button>

      <input
        type="text"
        value={message}
        disabled={isRecording || !!recordedAudio}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isRecording ? "Recording..." : "Type a message..."}
        className="flex-1 border rounded-full px-4 py-2 text-sm"
      />

      <button onClick={() => setIsRecording(prev => !prev)} disabled={!!recordedAudio}>
        <FaMicrophone size={20} className={`${isRecording ? "text-red-500 animate-pulse" : "text-gray-500"}`} />
      </button>

      <button
        onClick={handleSendMessage}
        disabled={(!message.trim() && !recordedAudio) || isRecording}
        className="bg-orange-500 text-white rounded-full p-3"
      >
        <FaPaperPlane size={16} />
      </button>
    </div>
  );
};

export default ChatFooter;
