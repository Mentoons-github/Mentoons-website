// import { Notification, NotificationContextType } from "@/types";
// import React, { useContext, useState } from "react";
// import { createContext } from "vm";

// const NotificationContext = createContext<NotificationContextType | undefined>(
//   undefined
// );

// export const useNotification = () => {
//   const context = useContext(NotificationContext);
//   if (!context) {
//     throw new Error(
//       "useNotification must be used within a NotificationProvider"
//     );
//   }
//   return context;
// };

// export const NotificationProvider: React.FC = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
// };
