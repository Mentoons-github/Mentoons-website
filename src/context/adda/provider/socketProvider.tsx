import { ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@clerk/clerk-react";
import SocketContext from "../socket";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { getToken } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [mongoUserId, setMongoUserId] = useState<string | null>(null);

  useEffect(() => {
    const connectSocket = async () => {
      const token = await getToken();

      const newSocket = io(import.meta.env.VITE_DEV_URL, {
        transports: ["websocket"],
        withCredentials: true,
        auth: { token },
      });

      newSocket.on("mongo_user_id", ({ userId }) => {
      setMongoUserId(userId);
      console.log("MongoDB user ID from socket:", userId);
    });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
      });

      newSocket.on("online_users", (users: string[]) => {
        console.log("Online users updated:", users);
        setOnlineUsers(users);
      });
    };

    connectSocket();

    return () => {
      if (socket) {
        socket.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, [getToken]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, mongoUserId }}>
      {children}
    </SocketContext.Provider>
  );
};
