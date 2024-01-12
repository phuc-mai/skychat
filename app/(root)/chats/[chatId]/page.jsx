"use client"

import ChatDetails from "@components/layout/ChatDetails";
import ChatList from "@components/layout/ChatList";
import { useParams } from "next/navigation";

const ChatPage = () => {
  const { chatId } = useParams();

  return (
    <div className="main-container">
      <ChatList />
      <ChatDetails chatId={chatId} />
    </div>
  );
};

export default ChatPage;
