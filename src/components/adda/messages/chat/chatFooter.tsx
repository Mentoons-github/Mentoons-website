import React, { RefObject, useCallback } from "react";
import { BsPaperclip } from "react-icons/bs";
import { FaPaperPlane } from "react-icons/fa6";

interface ChatFooterProps {
  fileInputRef: RefObject<HTMLInputElement>;
  message: string;
  handleMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendMessage: () => void;
  selectedFile: File | null;
  isUpload: boolean;
  maxMessageLength?: number;
  disabled?: boolean;
}

const ChatFooter: React.FC<ChatFooterProps> = ({
  fileInputRef,
  message,
  handleMessageChange,
  handleFileUpload,
  handleSendMessage,
  selectedFile,
  isUpload,
  maxMessageLength = 3000,
  disabled = false,
}) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (canSend && !disabled) {
          handleSendMessage();
        }
      }
    },
    [
      message,
      selectedFile,
      disabled,
      handleSendMessage,
    ]
  );

  // const handleRecordingToggle = useCallback(() => {
  //   if (disabled) return;
  //   setIsRecording((prev) => !prev);
  // }, [disabled, setIsRecording]);

  const handleFileButtonClick = useCallback(() => {
    if (disabled) return;
    fileInputRef.current?.click();
  }, [disabled, fileInputRef]);

  const handleSend = useCallback(() => {
    if (canSend && !disabled) {
      handleSendMessage();
    }
  }, [
    message,
    selectedFile,
    isUpload,
    disabled,
    handleSendMessage,
  ]);

  const canSend = Boolean(
    (message.trim() || selectedFile) &&
      !isUpload
  );

  const isInputDisabled = disabled
  const isOverLimit = message.length > maxMessageLength;

  const getInputClassName = () => {
    const baseClasses =
      "w-full h-12 px-4 py-3 border rounded-xl text-sm transition-all duration-200 resize-none outline-none";

    if (disabled) {
      return `${baseClasses} border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed`;
    }

    if (isOverLimit) {
      return `${baseClasses} border-red-300 bg-red-50 text-red-700 focus:border-red-400 focus:ring-4 focus:ring-red-50`;
    }

    return `${baseClasses} border-gray-200 bg-white hover:border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-50`;
  };

  // const getMicrophoneButtonClassName = () => {
  //   const baseClasses =
  //     "w-12 h-12 border rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2";

  //   if (disabled) {
  //     return `${baseClasses} bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed`;
  //   }

  //   if (isRecording) {
  //     return `${baseClasses} bg-red-500 hover:bg-red-600 border-red-500 text-white shadow-lg focus:ring-red-300`;
  //   }

  //   if (recordedAudio) {
  //     return `${baseClasses} bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed`;
  //   }

  //   return `${baseClasses} bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-600 hover:text-gray-800 hover:border-gray-300 focus:ring-gray-300`;
  // };

  const getSendButtonClassName = () => {
    const baseClasses =
      "rounded-full p-3 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

    if (!canSend || disabled) {
      return `${baseClasses} bg-orange-300 cursor-not-allowed`;
    }

    return `${baseClasses} bg-orange-500 hover:bg-orange-600 focus:ring-orange-300 hover:scale-105 active:scale-95`;
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-white border-t">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,audio/*,application/*,video/*"
        disabled={disabled}
        aria-label="Upload file"
      />

      <button
        type="button"
        onClick={handleFileButtonClick}
        disabled={disabled}
        className={`text-gray-500 p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 ${
          disabled
            ? "text-gray-300 cursor-not-allowed"
            : "hover:bg-gray-100 hover:text-gray-700"
        }`}
        aria-label="Attach file"
        title="Attach file"
      >
        <BsPaperclip size={22} />
      </button>

      <div className="flex-1 relative">
        <input
          type="text"
          value={message}
          disabled={isInputDisabled}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          className={getInputClassName()}
          maxLength={maxMessageLength}
          aria-label="Message input"
          aria-invalid={isOverLimit}
          aria-describedby={isOverLimit ? "message-error" : undefined}
        />

        {message.length > 0 && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <span
              className={`text-xs ${
                isOverLimit ? "text-red-500 font-medium" : "text-gray-400"
              }`}
            >
              {message.length}/{maxMessageLength}
            </span>
          </div>
        )}

        {isOverLimit && (
          <div
            id="message-error"
            className="absolute -bottom-6 left-0 text-xs text-red-500"
          >
            Message exceeds maximum length
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleSend}
        disabled={!canSend || disabled}
        className={getSendButtonClassName()}
        aria-label="Send message"
        title="Send message"
      >
        <FaPaperPlane size={16} />
      </button>

      {selectedFile && (
        <div className="absolute -top-12 left-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-2 text-sm text-blue-700">
          📎 {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
        </div>
      )}
    </div>
  );
};

export default ChatFooter;
