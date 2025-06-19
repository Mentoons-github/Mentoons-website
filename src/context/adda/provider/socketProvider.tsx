import { ReactNode, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@clerk/clerk-react";
import SocketContext from "../socket";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { getToken } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const connectSocket = async () => {
      const token = await getToken();

      const newSocket = io(import.meta.env.VITE_PROD_URL, {
        transports: ["websocket"],
        withCredentials: true,
        auth: { token },
      });

      socketRef.current = newSocket;

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
      });
    };

    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, [getToken]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};
