"use client";

import ChatDetails from "@components/layout/ChatDetails";
import ChatList from "@components/layout/ChatList";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const ChatPage = () => {
  const { chatId } = useParams();

  const { data: session } = useSession();
  const currentUser = session?.user;

  const seenLastMessage = async () => {
    try {
      await fetch(`/api/chats/${chatId}`, {
        method: "POST",
        body: JSON.stringify({ currentUserId: currentUser._id }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser && chatId) seenLastMessage();
  }, [currentUser, chatId]);

  return (
    <div className="flex justify-between gap-5 px-10 py-3">
      <ChatList currentChatId={chatId} />
      
      <div className="max-lg:hidden w-2/3">
        <ChatDetails chatId={chatId} />
      </div>
    </div>
  );
};

export default ChatPage;
