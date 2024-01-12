import EmptyChat from "@components/EmptyChat";
import ChatList from "@components/layout/ChatList";

const Chats = () => {

  return (
    <div className="main-container">
      <ChatList />
      <EmptyChat />
    </div>
  );
};

export default Chats;
