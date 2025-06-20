import Chat from "@/components/adda/messages/chat/chat";
import Friends from "@/components/adda/messages/chat/freinds";
import Welcome from "@/components/adda/messages/chat/welcome";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";


const ChatPage = () => {

    const { selectedUser } = useParams();
  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-6 gap-4 md:gap-6 overflow-hidden">
      <Friends />

      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 flex flex-col border border-white/20"
      >
         {selectedUser ? <Chat selectedUser={selectedUser} /> : <Welcome />}
      </motion.div>
    </div>
  );
};

export default ChatPage;
