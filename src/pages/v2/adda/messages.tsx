import UserList from "@/components/adda/messages/userList";
import MessageBox from "@/components/adda/messages/message";

const AddaMessages = () => {
  return (
    <div className="px-5 py-5">
      <div className="flex items-center gap-5 mt-5">
        <UserList />
        <MessageBox />
      </div>
    </div>
  );
};

export default AddaMessages;
