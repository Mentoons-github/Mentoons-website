import { FaLeftLong } from "react-icons/fa6";
import UserList from "@/components/adda/messages/userList";
import MessageBox from "@/components/adda/messages/message";

const AddaMessages = () => {
  return (
    <div>
      <div className="flex items-center gap-5">
        <button>
          <FaLeftLong className="text-2xl" />
        </button>
        <h1 className="text-4xl">Messages</h1>
      </div>
      <div className="flex items-center gap-5 mt-5">
        <UserList />
        <MessageBox />
      </div>
    </div>
  );
};

export default AddaMessages;
