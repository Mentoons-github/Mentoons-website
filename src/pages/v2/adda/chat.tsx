import Chat from "@/components/adda/messages/chat/chat";
import Friends from "@/components/adda/messages/chat/freinds";
import Welcome from "@/components/adda/messages/chat/welcome";
import ShareUserModal from "@/components/adda/messages/share/shareModal";
import { Message } from "@/types";
import { motion } from "framer-motion";
import { useState } from "react";
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
    if (!socket && !msg) return;

    selectedUserIds.forEach((receiverId) => {
      socket.emit("send_message", {
        receiverId,
        message: msg.message,
        fileType: msg.fileType,
        isForwarded: true,
      });
    });
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden p-6">
      <div
        className={`${
          selectedUser ? "hidden" : "block"
        } md:hidden w-full h-full p-4`}
      >
        <Friends />
      </div>

      <div
        className={`${
          selectedUser ? "block" : "hidden"
        } md:hidden w-full h-full`}
      >
        {selectedUser && (
          <Chat
            selectedUser={selectedUser}
            openForward={(msg: Message) => {
              setMessageToForward(msg);
              setForwardModalOpen(true);
            }}
          />
        )}
      </div>

      <div className="hidden md:flex w-full h-full gap-0">
        <div className="w-16 lg:w-80 xl:w-96 border-r border-gray-200/50 bg-white/80 backdrop-blur-lg">
          <Friends />
        </div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 bg-white/80 backdrop-blur-lg flex flex-col border-l border-white/20"
        >
          {selectedUser ? (
            <Chat
              selectedUser={selectedUser}
              openForward={(msg: Message) => {
                setMessageToForward(msg);
                setForwardModalOpen(true);
              }}
            />
          ) : (
            <Welcome />
          )}
        </motion.div>
      </div>
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
