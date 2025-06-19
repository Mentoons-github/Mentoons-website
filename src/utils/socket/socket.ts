import { io, Socket } from "socket.io-client";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const useSocket = () => {
  const { getToken } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const setupSocket = async () => {
      const token = await getToken();

      const newSocket: Socket = io("http://localhost:4000", {
        transports: ["websocket"],
        withCredentials: true,
        auth: {
          token: token, 
        },
      });

      setSocket(newSocket);
    };

    setupSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [getToken, socket]);

  return socket;
};

export default useSocket;
