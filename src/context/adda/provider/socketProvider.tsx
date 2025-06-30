import { ReactNode, useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@clerk/clerk-react";
import SocketContext from "../socket";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { getToken } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<{_id: string}[]>([]);
  const [mongoUserId, setMongoUserId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const connectSocket = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const newSocket = io(import.meta.env.VITE_DEV_URL, {
          transports: ["websocket"],
          withCredentials: true,
          auth: { token },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
        });

        socketRef.current = newSocket;
        setSocket(newSocket);

        newSocket.on("connect", () => {
          console.log("Socket connected:", newSocket.id);
        });

        newSocket.on("mongo_user_id", ({ userId }) => {
          setMongoUserId(userId);
          console.log("MongoDB user ID from socket:", userId);
        });

        newSocket.on("online_users", (users: {_id: string}[]) => {
          console.log("Online users updated:", users);
          setOnlineUsers(users);
        });

        newSocket.on("disconnect", (reason) => {
          console.log("Socket disconnected:", reason);
        });

        newSocket.on("reconnect", (attemptNumber) => {
          console.log("Socket reconnected after", attemptNumber, "attempts");
        });

        newSocket.on("reconnect_error", (error) => {
          console.error("Socket reconnection error:", error);
        });

        const handleBeforeUnload = () => {
          if (socketRef.current) {
            socketRef.current.disconnect();
          }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
          window.removeEventListener("beforeunload", handleBeforeUnload);
        };

      } catch (error) {
        console.error("Error connecting socket:", error);
      }
    };

    connectSocket();

    // Cleanup function
    return () => {
      if (socketRef.current) {
        console.log("Cleaning up socket connection");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [getToken]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, mongoUserId }}>
      {children}
    </SocketContext.Provider>
  );
};