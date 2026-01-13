import Chat from "@/components/adda/messages/chat/chat";
import Friends from "@/components/adda/messages/chat/freinds";
import Welcome from "@/components/adda/messages/chat/welcome";
import ShareUserModal from "@/components/adda/messages/share/shareModal";
import { Message } from "@/types";
import { useState } from "react";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useSocket from "@/hooks/adda/useSocket";

const ChatPage = () => {
  const { selectedUser } = useParams();
  const { socket } = useSocket();
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
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden ">
      {/* Friends list: Full width on mobile when no user is selected */}
      <div
        className={`${
          selectedUser ? "hidden" : "block"
        } lg:block w-full lg:w-80 xl:w-96 h-full lg:border-r lg:border-gray-200/50 lg:bg-white/80 lg:backdrop-blur-lg`}
      >
        <Friends lastMessage={lastMessage} />
      </div>

      {/* Chat area: Full width on mobile when a user is selected */}
      <div
        className={`${
          selectedUser ? "block" : "hidden"
        } lg:block w-full lg:flex-1 h-full lg:bg-white/80 lg:backdrop-blur-lg lg:border-l md:border-white/20`}
      >
        {selectedUser ? (
          <div className="flex flex-col h-full">
            
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
