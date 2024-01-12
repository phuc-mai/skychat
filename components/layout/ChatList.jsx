"use client";

import ChatBox from "@components/ChatBox";
import Loader from "@components/Loader";
import { Search } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

const ChatList = () => {
  const { data: session } = useSession();
  const currentUser = session?.user;

  const [loading, setLoading] = useState(true);
  const [allChats, setAllChats] = useState([]);

  const getAllChats = async () => {
    try {
      const res = await fetch(`/api/users/${currentUser._id}`, {
        method: "GET",
      });

      const data = await res.json();
      setAllChats(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser) getAllChats();
  }, [currentUser]);

  return loading ? (
    <Loader />
  ) : (
    <div className="chat-list">
      <div className="input-container">
        <input
          placeholder="Search Chats..."
          name="search"
          className="input-field"
        />
        <Search
          sx={{
            color: "#737373",
            cursor: "pointer",
            "&:hover": { color: "#ff5252" },
          }}
        />
      </div>

      <div className="chats">
        {allChats.map((chat, index) => (
          <ChatBox chat={chat} currentUser={currentUser} key={index} />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
