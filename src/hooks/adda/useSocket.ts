import { useContext } from "react";
import SocketContext from "@/context/adda/socket";

const useSocket = () => {
  return useContext(SocketContext);
};

export default useSocket;
