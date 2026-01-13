import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  BsDownload,
  BsX,
  // BsPlay,
  // BsPause,
  // BsTrash,
  // BsCheck,
  BsThreeDotsVertical,
  BsFileEarmarkText,
} from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";
import ChatFooter from "./chatFooter";
import { useAuth } from "@clerk/clerk-react";
import axiosInstance from "@/api/axios";
import { Message, User } from "@/types";
import useSocket from "@/hooks/adda/useSocket";
import MorphingBubbleIndicator from "./TypingIndicator";
import { FaArrowLeft, FaShare } from "react-icons/fa6";
import { uploadFile } from "@/redux/fileUploadSlice";
import { sendFileMessage, sendTextMessage } from "@/services/chatServices";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import FilePreview from "./filePreview";
import ChatMenuModal from "@/components/modals/ChatMenuModal";
import {
  fetchConversation,
  fetchConversationId,
  addNewMessage,
  markMessagesAsRead,
  updateLastMessage,
  resetUnreadCount,
  incrementUnreadCount,
} from "@/redux/adda/conversationSlice";
import { getDateLabel } from "@/utils/formateDate";
import { SkeletonLoader } from "./skelton";
import { BiCheck, BiCheckDouble } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

export interface ChatUser {
  id: number;
  name: string;
  recentChat: string;
  time: string;
  profilePicture: string;
  new: boolean;
  online: boolean;
}

export interface Messages {
  [key: number]: Message[];
}

interface ChatProps {
  selectedUser: string;
  openForward: (msg: Message) => void;
  conversationMessages: Message[];
}

interface GroupedMessages {
  [key: string]: Message[];
}

const Chat: React.FC<ChatProps> = ({
  selectedUser,
  openForward,
  conversationMessages,
}) => {
  const { getToken } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()

  const fileUpload = useSelector((state: RootState) => state.fileUpload);

  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  // const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  // const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(
  //   null
  // );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [message, setMessage] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileURL, setSelectedFileURL] = useState<string | null>(null);
  const [currentConversation, setCurrentConversation] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const buttonRef = useRef(null);
  // NEW: State for ShareUserModal
  // const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  // const [messageToForward, setMessageToForward] = useState<Message | null>(
  //   null
  // );

  const { socket, mongoUserId } = useSocket();

  useEffect(() => {
    const fetchConversationData = async () => {
      const token = await getToken();
      if (!token || !selectedUser) return;

      const result = await dispatch(
        fetchConversationId({ selectedUserId: selectedUser, token })
      );

      if (fetchConversationId.fulfilled.match(result)) {
        const conversationId = result.payload.conversationId;
        setCurrentConversation(conversationId);

        dispatch(fetchConversation({ conversationId, token }));
        if (socket) {
          socket.emit("mark_as_read", { conversationId });
        }
        dispatch(
          resetUnreadCount({
            conversationId: conversationId,
            userId: mongoUserId,
          })
        );
      }
    };

    fetchConversationData();
  }, [dispatch, getToken, selectedUser, socket]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axiosInstance.get(`/user/friend/${selectedUser}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.data.user);
    } catch (err) {
      console.error("Error fetching user:", err);
      setError(err instanceof Error ? err.message : "Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [selectedUser]);

  useEffect(() => {
    if (!socket) return;

    socket.on(
      "messages_read",
      ({
        conversationId,
        userId,
      }: {
        conversationId: string;
        userId: string;
      }) => {
        dispatch(markMessagesAsRead({ conversationId, userId }));
      }
    );

    return () => {
      socket.off("messages_read");
    };
  }, [socket, dispatch]);

  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (data: any) => {
      if (data.conversationId !== currentConversation) return;

      dispatch(addNewMessage(data));

      dispatch(
        updateLastMessage({
          conversationId: data.conversationId,
          message: data.message,
          fileType: data.fileType,
          updatedAt: data.createdAt,
        })
      );

      if (currentConversation === data.conversationId) {
        socket.emit("mark_as_read", { conversationId: data.conversationId });

        dispatch(
          resetUnreadCount({
            conversationId: data.conversationId,
            userId: mongoUserId,
          })
        );
      } else {
        dispatch(
          incrementUnreadCount({
            conversationId: data.conversationId,
            userId: mongoUserId,
          })
        );
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket, selectedUser, user, dispatch, currentConversation, mongoUserId]);

  const handleSendMessage = async () => {
    if (selectedFile) {
      let fileType: "image" | "video" | "file" = "file";

      if (selectedFile.type.startsWith("image/")) {
        fileType = "image";
      } else if (selectedFile.type.startsWith("video/")) {
        fileType = "video";
      } else {
        fileType = "file";
      }

      const resultAction = await dispatch(
        uploadFile({ file: selectedFile, getToken })
      );

      if (uploadFile.fulfilled.match(resultAction)) {
        const uploadedUrl = resultAction.payload.data.fileDetails?.url;
        sendFileMessage(
          socket!,
          selectedUser,
          uploadedUrl,
          selectedFile.name,
          fileType
        );
      } else {
        console.error("File upload failed:", resultAction.payload);
      }

      setSelectedFile(null);
      setSelectedFileURL(null);
      return;
    }

    if (message.trim() && selectedUser && socket && user) {
      sendTextMessage(socket, selectedUser, message);
      setMessage("");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setSelectedFileURL(URL.createObjectURL(file));
  };

  // const handleShareMessage = (selectedUserIds: string[], message: Message) => {
  //   if (!socket || !message) return;

  //   selectedUserIds.forEach((receiverId) => {
  //     socket.emit("send_message", {
  //       receiverId,
  //       message: message.message,
  //       fileType: message.fileType || "text",
  //       fileName: message.fileName,
  //     });
  //   });

  //   console.log(
  //     `Forwarded message to users: ${selectedUserIds.join(", ")}, Message: ${
  //       message.message
  //     }, Type: ${message.fileType}`
  //   );
  // };

  // const togglePreview = () => {
  //   if (!recordedAudio) return;

  //   if (isPlayingPreview) {
  //     previewAudio?.pause();
  //     setIsPlayingPreview(false);
  //   } else {
  //     const audio = new Audio(recordedAudio);
  //     audio.onended = () => setIsPlayingPreview(false);
  //     audio.play();
  //     setPreviewAudio(audio);
  //     setIsPlayingPreview(true);
  //   }
  // };

  // const sendRecordedAudio = () => {
  //   if (recordedAudio && socket && user) {
  //     socket.emit("send_message", {
  //       receiverId: selectedUser,
  //       fileType: "audio",
  //       message: recordedAudio,
  //       fileName: `audio_${Date.now()}.webm`,
  //     });

  //     setRecordedAudio(null);
  //     setIsRecording(false);
  //   }
  // };

  useEffect(() => {
    if (!socket) return;

    socket.on("typing", ({ userId }: { userId: string }) => {
      if (userId === selectedUser) {
        console.log("user is typing");
        setOtherUserTyping(true);
      }
    });

    socket.on("stopped_typing", ({ userId }: { userId: string }) => {
      if (userId === selectedUser) {
        setOtherUserTyping(false);
      }
    });

    return () => {
      socket.off("typing");
      socket.off("stopped_typing");
    };
  }, [socket, selectedUser, user]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    console.log("message typing");

    if (!socket || !user) return;

    console.log("typing :", typing);

    if (!typing) {
      socket.emit("typing", {
        receiverId: selectedUser,
      });
      console.log("user is typing");
      setTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopped_typing", {
        receiverId: selectedUser,
      });
      console.log("user stopped typing");
      setTyping(false);
    }, 1000);
  };

  // const discardRecording = () => {
  //   if (previewAudio) {
  //     previewAudio.pause();
  //     setIsPlayingPreview(false);
  //   }
  //   setRecordedAudio(null);
  //   setIsRecording(false);
  // };

  const downloadFile = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  if (error) {
    console.log(error, "error from profile");
  }

  const handleSendFile = async () => {
    if (!selectedFile || !socket || !user) return;

    const resultAction = await dispatch(
      uploadFile({ file: selectedFile, getToken })
    );

    if (uploadFile.fulfilled.match(resultAction)) {
      const uploadedUrl = resultAction.payload.data.fileDetails?.url;
      console.log(resultAction.payload.data.fileDetails?.url, "urllllll");

      let fileType: "image" | "audio" | "video" | "file" = "file";
      if (selectedFile.type.startsWith("image/")) fileType = "image";
      else if (selectedFile.type.startsWith("audio/")) fileType = "audio";

      sendFileMessage(
        socket,
        selectedUser,
        uploadedUrl,
        selectedFile.name,
        fileType
      );

      setSelectedFile(null);
      setSelectedFileURL(null);
    } else {
      console.error("File upload failed:", resultAction.payload);
    }
  };

  const groupedMessages = useMemo(() => {
    const groups: GroupedMessages = {};

    conversationMessages.forEach((msg) => {
      const label = getDateLabel(msg.createdAt);
      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(msg);
    });

    return groups;
  }, [conversationMessages]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
    return () => clearTimeout(timeout);
  }, [groupedMessages]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedUser}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex flex-col h-full"
      >
        {isLoading || error ? (
          <SkeletonLoader />
        ) : (
          <>
            <div className="flex justify-between items-center  border-b border-gray-100">
              <div className="flex items-center p-2">
                <div className="lg:hidden flex items-center border-b ">
                  <button
                    onClick={() => navigate("/chat")}
                    className="p-2 pl-0 text-gray-600 hover:text-indigo-500 transition-colors "
                  >
                    <FaArrowLeft size={18} />
                  </button>
                  
                </div>
                <div className="relative px-2">
                  <img
                    src={user?.picture}
                    alt={user?.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                  />
                </div>
                <div className="flex flex-col ml-4">
                  <h1 className="text-lg font-semibold text-gray-800">
                    {user?.name}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-4 relative px-2">
                <BsThreeDotsVertical
                  className="text-xl cursor-pointer text-gray-500 hover:text-indigo-500 transition-colors"
                  onClick={() => setIsModalOpen(true)}
                />
                <ChatMenuModal
                  buttonRef={buttonRef}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  conversationId={currentConversation}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4 bg-[url('/assets/adda/chat/background/d393ffb1117aaf22c62eaf8cf1f09587a6148e88.png')] bg-contain bg-no-repeat bg-center bg-gray-900 bg-opacity-25">
              {Object.entries(groupedMessages).map(([dateLabel, messages]) => (
                <div key={dateLabel}>
                  <div className="flex justify-center my-6">
                    <span className="text-sm bg-gray-800 text-gray-200 px-3 py-1 rounded-full">
                      {dateLabel}
                    </span>
                  </div>

                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${
                        msg.senderId === mongoUserId
                          ? "justify-end"
                          : "justify-start"
                      } mb-4 items-end`}
                    >
                      <div
                        className={`flex flex-col max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-md ${
                          msg.senderId === mongoUserId
                            ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {msg.fileType === "image" && (
                          <img
                            src={msg.message}
                            alt="Image"
                            className="rounded-md mb-2 max-w-[300px] max-h-[250px] object-cover"
                            onClick={() => setEnlargedImage(msg.message)}
                          />
                        )}
                        {msg.fileType === "audio" && (
                          <audio
                            src={msg.message}
                            controls
                            className="w-full rounded-md mb-2"
                          />
                        )}
                        {msg.fileType === "video" && (
                          <video
                            src={msg.message}
                            controls
                            className="w-full max-w-[300px] max-h-[250px] object-cover rounded-md mb-2"
                          />
                        )}
                        {msg.fileType === "file" && (
                          <a
                            href={msg.message}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center mb-2 p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                          >
                            <div className="flex items-center mb-2">
                              <div className="bg-blue-100 p-3 rounded-full">
                                <BsFileEarmarkText
                                  size={40}
                                  className="text-blue-500"
                                />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm text-gray-800 font-medium truncate max-w-[180px]">
                                  {msg.fileName}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-blue-500">Tap to open</p>
                          </a>
                        )}

                        {(!msg.fileType || msg.fileType === "text") && (
                          <p className="text-sm break-words whitespace-pre-wrap max-w-full">
                            {msg.message}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <p
                            className={`text-xs ${
                              msg.senderId !== selectedUser
                                ? "text-white/70"
                                : "text-gray-500"
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>

                          {msg.isForwarded && (
                            <p
                              className={`text-xs italic ${
                                msg.senderId !== selectedUser
                                  ? "text-white/70"
                                  : "text-gray-500"
                              }`}
                            >
                              Forwarded
                            </p>
                          )}

                          {msg.senderId !== selectedUser && (
                            <div className="ml-2 flex items-center">
                              {msg.isRead ? (
                                <span className="text-blue-500">
                                  <BiCheckDouble />
                                </span>
                              ) : msg.isDelivered ? (
                                <span className="text-gray-400">
                                  <BiCheckDouble />
                                </span>
                              ) : (
                                <span className="text-gray-400">
                                  <BiCheck />
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      {(msg.fileType === "image" ||
                        msg.fileType === "audio" ||
                        msg.fileType === "file" ||
                        msg.fileType === "video") && (
                        <button
                          onClick={() => openForward(msg)}
                          className={`ml-2 p-2 rounded-full transition-colors ${
                            msg.senderId !== selectedUser
                              ? "text-white bg-green-600"
                              : "text-gray-500 hover:bg-gray-200"
                          }`}
                          title="Forward"
                        >
                          <FaShare size={20} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              ))}

              <div ref={messagesEndRef} />
              {otherUserTyping && <MorphingBubbleIndicator />}
            </div>
            {/* <AnimatePresence>
              {recordedAudio && !isRecording && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center gap-3 py-3 px-4 bg-blue-50 border border-blue-200 rounded-lg mx-2 mb-2"
                >
                  <button
                    onClick={togglePreview}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  >
                    {isPlayingPreview ? (
                      <BsPause size={14} />
                    ) : (
                      <BsPlay size={14} />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="text-sm text-blue-700 font-medium">
                      Audio Preview
                    </div>
                    <div className="text-xs text-blue-600">
                      Tap play to listen before sending
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={discardRecording}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-all"
                      title="Discard recording"
                    >
                      <BsTrash size={14} />
                    </button>
                    <button
                      onClick={sendRecordedAudio}
                      className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                      title="Send recording"
                    >
                      <BsCheck size={16} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence> */}
            <FilePreview
              selectedFile={selectedFile}
              selectedFileURL={selectedFileURL}
              isUpload={fileUpload.loading}
              onCancel={() => {
                setSelectedFile(null);
                setSelectedFileURL(null);
              }}
              onSend={handleSendFile}
            />
            <ChatFooter
              fileInputRef={fileInputRef}
              message={message}
              handleMessageChange={handleMessageChange}
              handleFileUpload={handleFileUpload}
              handleSendMessage={handleSendMessage}
              selectedFile={selectedFile}
              isUpload={fileUpload.loading}
            />

            {/* {isShareModalOpen && messageToForward && (
              <ShareUserModal
                onClose={() => {
                  setIsShareModalOpen(false);
                  setMessageToForward(null);
                }}
                messageToForward={messageToForward}
                onShare={handleShareMessage}
                allowMultiSelect={true}
              />
            )} */}

            <AnimatePresence>
              {enlargedImage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
                  onClick={() => setEnlargedImage(null)}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative max-w-2xl max-h-[80vh]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={enlargedImage}
                      alt="Enlarged view"
                      className="w-96 h-full object-contain rounded-lg"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() =>
                          downloadFile(enlargedImage, "enlarged-image.jpg")
                        }
                        className="p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                      >
                        <BsDownload size={20} />
                      </button>
                      <button
                        onClick={() => setEnlargedImage(null)}
                        className="p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                      >
                        <BsX size={20} />
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Chat;
