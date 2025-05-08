import axiosInstance from "@/api/axios";
import MessageBox from "@/components/adda/messages/message";
import UserList from "@/components/adda/messages/userList";
import { Conversations, Friend } from "@/types";
import { useEffect, useState } from "react";

const AddaMessages = () => {
  const [conversations, setConversations] = useState<Conversations[] | null>(
    null
  );
  const [friends, setFriends] = useState<Friend[] | null>(null);
  const [selectedUser, setSelectedUser] = useState<Friend | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const friendsResponse = await axiosInstance.get("/adda/getFriends");
        console.log("friend request :", friendsResponse);
        setFriends(friendsResponse.data.data);

        const conversationsResponse = await axiosInstance.get(
          "/adda/getConversations"
        );

        console.log("conversations : ", conversationsResponse);
        setConversations(conversationsResponse.data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectUser = (user: Friend) => {
    setSelectedUser(user);
  };

  return (
    <div className="px-5 py-5">
      <div className="flex items-center gap-5 mt-5">
        <UserList
          friends={friends}
          conversations={conversations}
          loading={loading}
          onSelectUser={handleSelectUser}
          selectedUserId={selectedUser?._id}
        />
        <MessageBox selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default AddaMessages;
