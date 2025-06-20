import { ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@clerk/clerk-react";
import SocketContext from "../socket";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { getToken } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const connectSocket = async () => {
      const token = await getToken();

      const newSocket = io(import.meta.env.VITE_DEV_URL, {
        transports: ["websocket"],
        withCredentials: true,
        auth: { token },
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
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
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
