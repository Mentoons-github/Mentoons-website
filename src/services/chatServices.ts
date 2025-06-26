import { Socket } from "socket.io-client";

export const sendTextMessage = (
  socket: Socket,
  receiverId: string,
  message: string
) => {
  socket.emit("send_message", {
    receiverId,
    message,
    fileType: "text",
  });
};

// Send file message through socket
export const sendFileMessage = (
  socket: Socket,
  receiverId: string,
  fileUrl: string,
  fileName: string,
  fileType: "image" | "audio" | "file" | "video"
) => {
  socket.emit("send_message", {
    receiverId,
    message: fileUrl,
    fileName,
    fileType,
  });
};
