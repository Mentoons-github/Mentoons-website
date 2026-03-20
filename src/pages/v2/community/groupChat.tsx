import { motion } from "framer-motion";
import React, { useRef, useEffect, useState } from "react";
import { Send, Maximize2, Minimize2, Ellipsis } from "lucide-react";
import { GroupMessage } from "@/types";
import { Socket } from "socket.io-client";
import { MdReport } from "react-icons/md";
import ReportAbuseModal from "@/components/common/modal/BlockAndReportModal";

interface GroupChatProps {
  groupId: string;
  messages: GroupMessage[];
  setMessages: React.Dispatch<React.SetStateAction<GroupMessage[]>>;
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  socket: Socket | null;
  mongoUserId: string;
  handleMemberClick: (memberId: string) => void;
}

const GroupChat: React.FC<GroupChatProps> = ({
  groupId,
  messages,
  setMessages,
  newMessage,
  setNewMessage,
  socket,
  mongoUserId,
  handleMemberClick,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);
  const [reportModal, setReportModal] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedConversationId, setSelectedConversationId] =
    useState<string>("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    };

    if (openDropdownId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!socket || !groupId) return;
    socket.emit("join_group", groupId);
  }, [socket, groupId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    socket.emit("send_message", {
      groupId,
      message: newMessage,
      fileType: "text",
    });

    setNewMessage("");
  };

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg: GroupMessage & { groupId: string }) => {
      if (msg.groupId !== groupId) return;
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receive_group_message", handleReceiveMessage);

    return () => {
      socket.off("receive_group_message", handleReceiveMessage);
    };
  }, [socket, groupId, setMessages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleReportAbuse = () => {
    setReportModal(true);
    setOpenDropdownId(null);
  };

  const handleModal = (userId: string, messageId: string) => {
    setSelectedConversationId(messageId);
    setSelectedUserId(userId);

    setOpenDropdownId((prev) => (prev === messageId ? null : messageId));
  };

  return (
    <>
      <motion.div
        className={`bg-white rounded-2xl shadow-2xl overflow-hidden ${
          isFullscreen
            ? "fixed inset-0 z-50 rounded-none "
            : "max-w-6xl mx-2 md:mx-5 lg:mx-auto mt-8 "
        }`}
      >
        {/* HEADER */}

        <div className="bg-gradient-to-r from-orange-500 to-yellow-400 p-6 text-white flex justify-between items-center">
          <h2 className="text-2xl font-bold">Group Discussion</h2>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-white/20 rounded"
          >
            {isFullscreen ? <Minimize2 /> : <Maximize2 />}
          </button>
        </div>

        <div
          ref={chatContainerRef}
          className={`overflow-y-auto p-4 space-y-4 bg-gray-50 ${
            isFullscreen ? "h-[calc(100vh-180px)]" : "h-96"
          }`}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm">Start the conversation 👋</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.senderId._id === mongoUserId;

              return (
                <div
                  key={msg._id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex items-start gap-2 max-w-[70%]">
                    {!isOwn && (
                      <img
                        onClick={() => handleMemberClick(msg.senderId._id)}
                        src={msg.senderId.picture}
                        alt="user"
                        className="w-8 h-8 rounded-full object-cover cursor-pointer"
                      />
                    )}

                    <div
                      className={`px-4 py-2 rounded-xl w-fit max-w-full relative ${
                        isOwn
                          ? "bg-orange-500 text-white"
                          : "bg-white border text-gray-800"
                      }`}
                    >
                      {!isOwn && (
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-orange-500 mb-1">
                            {msg.senderId?.name || "User"}
                          </p>
                          <Ellipsis
                            onClick={() =>
                              handleModal(msg.senderId._id, msg._id)
                            }
                          />
                        </div>
                      )}
                      {openDropdownId === msg._id && (
                        <motion.div
                          ref={dropdownRef}
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute right-0  z-50 w-48 mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-xl"
                        >
                          <>
                            <button
                              className="flex items-center w-full px-4 py-3 text-left text-orange-600 transition-colors hover:bg-gray-50"
                              onClick={handleReportAbuse}
                            >
                              <MdReport className="w-5 h-5 mr-2" />
                              Report Abuse
                            </button>
                          </>
                        </motion.div>
                      )}

                      <p className="text-sm break-words">{msg.message}</p>

                      <p className="text-[10px] opacity-70 text-right mt-1">
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* INPUT */}

        <div className="p-4 border-t bg-white flex items-center gap-3">
          {/* <button className="text-gray-500 hover:text-orange-500">
            <Paperclip size={20} />
          </button> */}

          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`p-2 rounded-full ${
              newMessage
                ? "bg-orange-500 text-white"
                : "bg-gray-300 text-gray-500"
            }`}
          >
            <Send size={18} />
          </button>
        </div>
        <ReportAbuseModal
          isOpen={reportModal}
          setIsOpen={setReportModal}
          modalType="report"
          userId={selectedUserId}
          contentId={selectedConversationId}
          reportType="conversation"
          messageType="groupMessage"
        />
      </motion.div>
    </>
  );
};

export default GroupChat;
