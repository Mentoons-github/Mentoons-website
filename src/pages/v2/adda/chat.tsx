import Chat from "@/components/adda/messages/chat/chat";
import Friends from "@/components/adda/messages/chat/freinds";
import Welcome from "@/components/adda/messages/chat/welcome";
import ShareUserModal from "@/components/adda/messages/share/shareModal";
import { Message } from "@/types";
import { useState } from "react";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import useSocket from "@/hooks/adda/useSocket";
import { FaArrowLeft } from "react-icons/fa";

const ChatPage = () => {
  const { selectedUser } = useParams();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [messageToForward, setMessageToForward] = useState<Message | null>(
    null
  );
  const [forwardModalOpen, setForwardModalOpen] = useState(false);

  const handleShareMessage = (selectedUserIds: string[], msg: Message) => {
    if (!socket || !msg) return;

    selectedUserIds.forEach((receiverId) => {
      socket.emit("send_message", {
        receiverId,
        message: msg.message,
        fileType: msg.fileType,
        isForwarded: true,
      });
    });
  };

  const conversationMessages = useSelector(
    (state: RootState) => state.conversation.data
  );

  const lastMessage = conversationMessages[conversationMessages.length - 1];

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden p-2 sm:p-4 md:p-6">
      {/* Friends list: Full width on mobile when no user is selected */}
      <div
        className={`${
          selectedUser ? "hidden" : "block"
        } md:block w-full md:w-80 xl:w-96 h-full md:border-r md:border-gray-200/50 md:bg-white/80 md:backdrop-blur-lg`}
      >
        <Friends lastMessage={lastMessage} />
      </div>

      {/* Chat area: Full width on mobile when a user is selected */}
      <div
        className={`${
          selectedUser ? "block" : "hidden"
        } md:block w-full md:flex-1 h-full md:bg-white/80 md:backdrop-blur-lg md:border-l md:border-white/20`}
      >
        {selectedUser ? (
          <div className="flex flex-col h-full">
            <div className="md:hidden flex items-center p-3 sm:p-4 border-b border-gray-200">
              <button
                onClick={() => navigate("/chat")}
                className="p-2 text-gray-600 hover:text-indigo-500 transition-colors"
                aria-label="Back to friends list"
              >
                <FaArrowLeft size={18} />
              </button>
              <h2 className="ml-2 text-base sm:text-lg font-semibold text-gray-800">
                Chat
              </h2>
            </div>
            <Chat
              selectedUser={selectedUser}
              conversationMessages={conversationMessages}
              openForward={(msg: Message) => {
                setMessageToForward(msg);
                setForwardModalOpen(true);
              }}
            />
          </div>
        ) : (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Welcome />
          </motion.div>
        )}
      </div>

      {/* Share modal */}
      {messageToForward && forwardModalOpen && (
        <ShareUserModal
          messageToForward={messageToForward}
          onClose={() => setForwardModalOpen(false)}
          allowMultiSelect={true}
          onShare={handleShareMessage}
        />
      )}
    </div>
  );
};

export default ChatPage;
