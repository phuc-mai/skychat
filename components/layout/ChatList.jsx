"use client";

import ChatBox from "@components/ChatBox";
import Loader from "@components/Loader";
import { pusherClient } from "@lib/pusher";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

const ChatList = ({ currentChatId }) => {
  const { data: session } = useSession();
  const currentUser = session?.user;

  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");

  const getChats = async () => {
    try {
      const res = await fetch(
        search !== "" ? `/api/users/${currentUser._id}/searchChat/${search}` : `/api/users/${currentUser._id}`,
      )
      const data = await res.json();
      setChats(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser) getChats();
  }, [currentUser, search]);

  useEffect(() => {
    if (currentUser) {
      pusherClient.subscribe(currentUser._id);

      const handleChatUpdate = (updatedChat) => {
        setChats((allItems) =>
          allItems.map((chat) => {
            if (chat._id === updatedChat.id) {
              return { ...chat, messages: updatedChat.messages };
            } else {
              return chat;
            }
          })
        );
      };

      const handleNewChat = (newChat) => {
        setChats((allItems) => [...allItems, newChat]);
      };

      pusherClient.bind("update-chat", handleChatUpdate);
      pusherClient.bind("new-chat", handleNewChat);

      return () => {
        pusherClient.unsubscribe(currentUser._id);
        pusherClient.unbind("update-chat", handleChatUpdate);
        pusherClient.unbind("new-chat", handleNewChat);
      };
    }
  }, [currentUser]);

  return loading ? (
    <Loader />
  ) : (
    <div className="chat-list">
        <input
          placeholder="Search Chats..."
          className="input-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      <div className="chats">
        {chats.map((chat, index) => (
          <ChatBox
            chat={chat}
            currentUser={currentUser}
            currentChatId={currentChatId}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
