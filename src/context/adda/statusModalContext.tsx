import { createContext, useContext, useState, ReactNode } from "react";

type StatusType = "success" | "error" | "info";

interface StatusModalState {
  open: boolean;
  type: StatusType;
  message: string;
}

interface StatusModalContextType {
  showStatus: (type: StatusType, message: string) => void;
  closeStatus: () => void;
  status: StatusModalState;
}

const StatusModalContext = createContext<StatusModalContextType | undefined>(
  undefined
);

export const useStatusModal = () => {
  const context = useContext(StatusModalContext);
  if (!context)
    throw new Error("useStatusModal must be used within StatusModalProvider");
  return context;
};

export const StatusModalProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<StatusModalState>({
    open: false,
    type: "info",
    message: "",
  });

  const showStatus = (type: StatusType, message: string) => {
    setStatus({ open: true, type, message });

    setTimeout(() => {
      setStatus((prev) => ({ ...prev, open: false }));
    }, 3000);
  };

  const closeStatus = () => {
    setStatus((prev) => ({ ...prev, open: false }));
  };

  return (
    <StatusModalContext.Provider value={{ showStatus, closeStatus, status }}>
      {children}
    </StatusModalContext.Provider>
  );
};
