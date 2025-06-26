import Chat from "@/components/adda/messages/chat/chat";
import Friends from "@/components/adda/messages/chat/freinds";
import Welcome from "@/components/adda/messages/chat/welcome";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ChatPage = () => {
  const { selectedUser } = useParams();
    const conversationMessages = useSelector(
    (state: RootState) => state.conversation.data
  );

  const lastMessage = conversationMessages[conversationMessages.length-1]

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden p-6">
      <div
        className={`${
          selectedUser ? "hidden" : "block"
        } md:hidden w-full h-full p-4`}
      >
        <Friends lastMessage = {lastMessage}/>
      </div>

      <div
        className={`${
          selectedUser ? "block" : "hidden"
        } md:hidden w-full h-full`}
      >
        {selectedUser && <Chat selectedUser={selectedUser} conversationMessages={conversationMessages}/>}
      </div>

      <div className="hidden md:flex w-full h-full gap-0">
        <div className="w-16 lg:w-80 xl:w-96 border-r border-gray-200/50 bg-white/80 backdrop-blur-lg">
          <Friends lastMessage = {lastMessage}/>
        </div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 bg-white/80 backdrop-blur-lg flex flex-col border-l border-white/20"
        >
          {selectedUser ? <Chat selectedUser={selectedUser} conversationMessages={conversationMessages}/> : <Welcome />}
        </motion.div>
      </div>
    </div>
  );
};

export default ChatPage;
