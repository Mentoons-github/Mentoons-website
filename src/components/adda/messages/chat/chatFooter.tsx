import React, { Dispatch, RefObject, SetStateAction, useState } from "react";
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

const Tooltip: React.FC<{
  text: string;
  children: React.ReactNode;
  position?: "top" | "bottom";
}> = ({ text, children, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap transition-opacity duration-200 ${
            position === "top"
              ? "bottom-full left-1/2 transform -translate-x-1/2 mb-2"
              : "top-full left-1/2 transform -translate-x-1/2 mt-2"
          }`}
        >
          {text}
          <div
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === "top"
                ? "top-full left-1/2 -translate-x-1/2 -translate-y-1"
                : "bottom-full left-1/2 -translate-x-1/2 translate-y-1"
            }`}
          />
        </div>
      )}
    </div>
  );
};

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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() !== "" && !isRecording && !recordedAudio) {
        handleSendMessage();
      }
    }
  };

  const canSend =
    (message.trim() || recordedAudio || selectedFile) && !isRecording;

  return (
    <div className="bg-white border-t border-gray-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3">
        {selectedFile && (
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <BsPaperclip className="text-blue-600" size={14} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <div className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-full">
              Ready to send
            </div>
          </div>
        )}

        {isRecording && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-700">
                Recording in progress...
              </span>
            </div>
            <div className="ml-auto text-xs text-red-600 font-medium">
              Speak clearly into your microphone
            </div>
          </div>
        )}

        {recordedAudio && !isRecording && (
          <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FaMicrophone className="text-green-600" size={14} />
              </div>
              <span className="text-sm font-medium text-green-700">
                Voice message recorded
              </span>
            </div>
            <div className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
              Ready to send
            </div>
          </div>
        )}

        <div className="flex items-end gap-3">
          <Tooltip text="Attach files">
            <div className="flex-shrink-0">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,audio/*,application/*"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-12 h-12 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 hover:border-gray-300"
              >
                <BsPaperclip
                  size={18}
                  className={`transition-colors duration-200 ${
                    selectedFile
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                />
              </button>
            </div>
          </Tooltip>

          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              disabled={isRecording || !!recordedAudio}
              onChange={(e) => handleMessageChange(e)}
              onKeyDown={(e) => handleKeyDown(e)}
              placeholder={
                isRecording
                  ? "Recording your voice message..."
                  : recordedAudio
                  ? "Voice message ready - click send or record again"
                  : "Type your message here..."
              }
              className={`w-full h-12 px-4 py-3 border rounded-xl text-sm transition-all duration-200 resize-none outline-none ${
                isRecording
                  ? "border-red-300 bg-red-50 text-red-700 placeholder-red-400"
                  : recordedAudio
                  ? "border-green-300 bg-green-50 text-green-700 placeholder-green-400"
                  : "border-gray-200 bg-white hover:border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
              } ${isRecording || recordedAudio ? "cursor-not-allowed" : ""}`}
            />

            {message.length > 0 && !isRecording && !recordedAudio && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                {message.length}
              </div>
            )}
          </div>

          <Tooltip
            text={
              recordedAudio
                ? "Voice message ready"
                : isRecording
                ? "Stop recording"
                : "voice message"
            }
          >
            <div className="flex-shrink-0">
              <button
                onClick={() => setIsRecording((prev) => !prev)}
                disabled={!!recordedAudio}
                className={`w-12 h-12 border rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 border-red-500 text-white shadow-lg"
                    : recordedAudio
                    ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-600 hover:text-gray-800 hover:border-gray-300"
                }`}
              >
                <FaMicrophone
                  size={16}
                  className={`transition-all duration-200 ${
                    isRecording ? "animate-pulse" : ""
                  }`}
                />
              </button>
            </div>
          </Tooltip>

          <Tooltip text={"Send message"}>
            <div className="flex-shrink-0">
              <button
                onClick={handleSendMessage}
                disabled={!canSend}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 ${
                  canSend
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <FaPaperPlane
                  size={14}
                  className={`transition-transform duration-200 ${
                    canSend
                      ? "hover:translate-x-0.5 hover:-translate-y-0.5"
                      : ""
                  }`}
                />
              </button>
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ChatFooter;
