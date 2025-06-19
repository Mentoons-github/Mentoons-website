// import { io, Socket } from "socket.io-client";
// import { useAuth } from "@clerk/clerk-react";
// import { useEffect, useState, useRef } from "react";

// const useSocket = () => {
//   const { getToken } = useAuth();
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const hasConnected = useRef(false);

//   useEffect(() => {
//     const setupSocket = async () => {
//       if (hasConnected.current) return; // Prevent multiple connections
//       hasConnected.current = true;

//       const token = await getToken();
//       if (!token) return;

//       const newSocket: Socket = io("http://localhost:4000", {
//         transports: ["websocket"],
//         withCredentials: true,
//         auth: {
//           token: token,
//         },
//       });

//       newSocket.on("connect", () => {
//         console.log("Socket connected:", newSocket.id);
//       });

//       newSocket.on("disconnect", () => {
//         console.log("Socket disconnected");
//       });

//       setSocket(newSocket);
//     };

//     setupSocket();

//     return () => {
//       if (socket) {
//         socket.disconnect();
//       }
//     };
//   }, [getToken]);

//   return socket;
// };

// export default useSocket;
