import { createContext, useContext, useState } from "react";

type ModalType = "sign-in" | "sign-up" | null;

interface AuthModalContextProps {
  isOpen: boolean;
  modalType: ModalType;
  openAuthModal: (type: ModalType) => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextProps | undefined>(
  undefined
);

export const AuthModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);

  const openAuthModal = (type: ModalType) => {
    setModalType(type);
    setIsOpen(true);
  };

  const closeAuthModal = () => {
    setIsOpen(false);
    setModalType(null);
  };

  return (
    <AuthModalContext.Provider
      value={{ isOpen, modalType, openAuthModal, closeAuthModal }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context)
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  return context;
};
