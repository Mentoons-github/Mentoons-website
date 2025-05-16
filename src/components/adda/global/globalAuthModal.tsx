import LoginModal from "@/components/common/modal/loginModal";
import { useAuthModal } from "@/context/adda/authModalContext";

const GlobalAuthModal = () => {
  const { isOpen, closeAuthModal } = useAuthModal();

  return <LoginModal isOpen={isOpen} onClose={closeAuthModal} />;
};

export default GlobalAuthModal;
